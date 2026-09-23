"use client";

import {
  ACCENTS,
  BACKGROUNDS,
  FOCUS_THEMES,
  SPARK_AURAS,
  SPARK_GEAR,
  SPARK_TRAILS,
  SPARK_TINTS,
  normalizeAppearance,
  roomHasShades,
  type AccentId,
  type AccentShadeId,
  type AppearanceState,
  type BackgroundId,
} from "@/lib/appearance";
import {
  FEED_COST,
  FEED_DAILY_LIMIT,
  QUIZ_TOKEN,
  STREAK_REWARD_DAY,
  dayKey,
  streakGearForWeek,
  streakLoginPrize,
  yesterdayKey,
} from "@/lib/care";
import {
  DEMO_TIME_COMPRESS_MS,
  DEMO_TOKEN_BLOCK_MS,
  DEMO_TOKENS_PER_BLOCK,
  DEMO_UNLOCK_MS,
  MOCK_TASKS,
  REAL_TIME_COMPRESS_MS,
  REAL_TOKEN_MS,
  REAL_UNLOCK_MS,
  NEMESIS_UNLOCK_COST,
  SUBJECTS,
  TASK_SUBJECT,
  UNLOCK_CATALOG,
  isNemesisId,
  type NemesisId,
  type SubjectId,
  type TaskId,
  TIER2_COST,
  TIER3_COST,
  type UnlockCatalogId,
  type UnlockTier,
  unlockTierSpendId,
} from "@/lib/constants";
import {
  normalizeHostList,
  type UnlockMinutes,
} from "@/lib/domain-policy";
import {
  normalizeMotivation,
  normalizeProfile,
  validateDiploma,
  type MotivationState,
} from "@/lib/ib";
import {
  AFTER_SCHOOL_PRESET,
  normalizeSchedule,
  normalizeWindow,
  validateWindow,
  type LockWindow,
} from "@/lib/schedule";
import { writeSessionRecap } from "@/lib/session-recap";
import {
  inferSubjectId,
  mergeSchoolTasks,
  mockTasksAsSchool,
  type SchoolTask,
} from "@/lib/school-tasks";
import { SAMPLE_CLASSROOM_TASKS } from "@/lib/classroom";
import { SAMPLE_MANAGEBAC_TASKS, parseManageBacImport } from "@/lib/managebac";
import type { SchoolProvider } from "@/lib/school-provider";
import { displaySpriteName, isDefaultSpriteName } from "@/lib/sprite-name";
import {
  clampDailyGoalMinutes,
  DAILY_GOAL_REWARD,
} from "@/lib/daily-goal";
import { todayStudyMs } from "@/lib/stats";
import {
  claimFriendCode,
  FRIEND_CODE_HINT,
  normalizeFriendCode,
  stubFriendFromCode,
} from "@/lib/friends";
import {
  normalizeAvatar,
  normalizeAvatarUrl,
  normalizeUsername,
} from "@/lib/identity";
import {
  normalizePlannerEvents,
  type PlannerEventKind,
} from "@/lib/planner";
import { playSfx } from "@/lib/sfx";
import {
  coalesceUnlocks,
  getSnapshot,
  setState,
  type CatalystState,
  type Session,
  type SessionLog,
  type Unlock,
} from "@/lib/store-core";

export * from "@/lib/store-core";

export function completeSetup(nemeses: NemesisId[]) {
  const next = [...new Set(nemeses.filter(isNemesisId))];
  if (next.length === 0) {
    return { ok: false as const, reason: "Pick at least one nemesis app." };
  }
  setState((current) => {
    const schedule =
      current.schedule.length > 0
        ? current.schedule
        : normalizeSchedule([AFTER_SCHOOL_PRESET]);
    if (schedule.length === 0) return current;
    return {
      ...current,
      nemeses: next,
      schedule,
      schoolTasks: current.schoolTasks,
      setupComplete: true,
    };
  });
  if (!getSnapshot().setupComplete) {
    return { ok: false as const, reason: "Add lock hours first." };
  }
  return { ok: true as const };
}

export function saveNemeses(nemeses: NemesisId[]) {
  const next = [...new Set(nemeses.filter(isNemesisId))];
  setState((current) => ({ ...current, nemeses: next }));
  return { ok: true as const, nemeses: next };
}

export function setDemoMode(demoMode: boolean) {
  setState((current) => ({ ...current, demoMode }));
}

export function sessionTitle(session: Session) {
  return session.title;
}

export function sessionHint(session: Session) {
  const subject =
    SUBJECTS.find((row) => row.id === session.subjectId)?.label ??
    session.subjectId;
  return `${session.title} ${subject} ${session.goal}`;
}

export function plannedLockMs(session: Session) {
  if (!session.plannedMinutes) return null;
  const realMs = session.plannedMinutes * 60 * 1000;
  return session.demoMode
    ? Math.round(realMs * (DEMO_TIME_COMPRESS_MS / REAL_TIME_COMPRESS_MS))
    : realMs;
}

export function startSession(input: { taskId: TaskId; goal: string }) {
  const school = getSnapshot().schoolTasks.find((row) => row.id === input.taskId);
  const mock = MOCK_TASKS.find((row) => row.id === input.taskId);
  const task = school ?? mock;
  const session: Session = {
    id: crypto.randomUUID(),
    kind: "verified",
    taskId: input.taskId,
    subjectId: school?.subjectId ?? TASK_SUBJECT[input.taskId] ?? "other",
    title: task?.title ?? "Focus task",
    goal: input.goal.trim(),
    plannedMinutes: null,
    demoMode: getSnapshot().demoMode,
    status: "focus",
    lockedAt: Date.now(),
    focusStartedAt: Date.now(),
    completedAt: null,
    pausedAt: null,
    pauseAccumMs: 0,
    taskMarkedDone: false,
    tokensEarned: 0,
    timeTokens: 0,
    completionTokens: 0,
  };
  setState((current) => ({ ...current, session }));
}

export function startStudySession(input: {
  subjectId: SubjectId;
  title: string;
  minutes?: number | null;
}) {
  const minutes =
    input.minutes == null ? null : Math.floor(input.minutes);
  const title = input.title.trim();
  if (title.length < 3) {
    return { ok: false as const, reason: "Say what you are studying." };
  }
  if (minutes != null && (!Number.isFinite(minutes) || minutes < 5)) {
    return { ok: false as const, reason: "Soft goal must be at least 5 minutes." };
  }
  const subject = SUBJECTS.find((row) => row.id === input.subjectId);
  if (!subject) {
    return { ok: false as const, reason: "Pick a subject." };
  }
  if (getSnapshot().session?.status === "locked" || getSnapshot().session?.status === "focus") {
    return { ok: false as const, reason: "Finish the session already running." };
  }

  const session: Session = {
    id: crypto.randomUUID(),
    kind: "study",
    subjectId: subject.id,
    title,
    goal: title,
    plannedMinutes: minutes,
    demoMode: getSnapshot().demoMode,
    status: "focus",
    lockedAt: Date.now(),
    focusStartedAt: Date.now(),
    completedAt: null,
    pausedAt: null,
    pauseAccumMs: 0,
    taskMarkedDone: false,
    tokensEarned: 0,
    timeTokens: 0,
    completionTokens: 0,
  };
  setState((current) => ({ ...current, session }));
  return { ok: true as const, session };
}

export function enterFocus() {
  setState((current) => {
    if (!current.session) return current;
    if (current.session.status === "focus") return current;
    if (current.session.status !== "locked") return current;
    return {
      ...current,
      session: {
        ...current.session,
        status: "focus",
        focusStartedAt: current.session.focusStartedAt ?? Date.now(),
        pausedAt: null,
        pauseAccumMs: 0,
      },
    };
  });
}

export function setDailyGoalMinutes(minutes: number) {
  const next = clampDailyGoalMinutes(minutes);
  setState((current) =>
    current.dailyGoalMinutes === next
      ? current
      : { ...current, dailyGoalMinutes: next },
  );
}

export function confirmDailyGoal(minutes: number, now = new Date()) {
  const next = clampDailyGoalMinutes(minutes);
  const today = dayKey(now);
  setState((current) => ({
    ...current,
    dailyGoalMinutes: next,
    dailyGoalSetDay: today,
  }));
  return { ok: true as const, minutes: next, reward: DAILY_GOAL_REWARD };
}

export function claimDailyGoalReward(now = new Date()) {
  const current = getSnapshot();
  const today = dayKey(now);
  if (current.dailyGoalClaimedDay === today) {
    return { ok: false as const, reason: "already" as const };
  }
  const goalMs = current.dailyGoalMinutes * 60 * 1000;
  if (todayStudyMs(current.logs, now) < goalMs) {
    return { ok: false as const, reason: "short" as const };
  }
  setState((state) => ({
    ...state,
    tokens: state.tokens + DAILY_GOAL_REWARD,
    dailyGoalClaimedDay: today,
  }));
  return { ok: true as const, tokens: DAILY_GOAL_REWARD };
}

export function sessionElapsedMs(session: Session, now = Date.now()) {
  const startedAt = session.focusStartedAt ?? session.lockedAt;
  const livePause = session.pausedAt ? Math.max(0, now - session.pausedAt) : 0;
  return Math.max(0, now - startedAt - (session.pauseAccumMs ?? 0) - livePause);
}

export function pauseSession() {
  setState((current) => {
    if (!current.session || current.session.status !== "focus") return current;
    if (current.session.pausedAt) return current;
    return {
      ...current,
      session: { ...current.session, pausedAt: Date.now() },
    };
  });
}

export function resumeSession() {
  setState((current) => {
    if (!current.session || current.session.status !== "focus") return current;
    if (!current.session.pausedAt) return current;
    const extra = Math.max(0, Date.now() - current.session.pausedAt);
    return {
      ...current,
      session: {
        ...current.session,
        pausedAt: null,
        pauseAccumMs: (current.session.pauseAccumMs ?? 0) + extra,
      },
    };
  });
}

export function markTaskDone(done: boolean) {
  setState((current) => {
    if (!current.session) return current;
    return {
      ...current,
      session: { ...current.session, taskMarkedDone: done },
    };
  });
}

export function tokensFromElapsed(elapsedMs: number, demoMode: boolean) {
  const ms = Math.max(0, elapsedMs);
  if (demoMode) {
    return Math.floor(ms / DEMO_TOKEN_BLOCK_MS) * DEMO_TOKENS_PER_BLOCK;
  }
  return Math.floor(ms / REAL_TOKEN_MS);
}

/** Credit newly earned time tokens to the wallet while the timer keeps counting. */
export function creditLiveSessionTokens(now = Date.now()) {
  setState((current) => {
    const session = current.session;
    if (!session || session.status !== "focus" || session.pausedAt) {
      return current;
    }
    const earned = tokensFromElapsed(
      sessionElapsedMs(session, now),
      session.demoMode,
    );
    const already = session.timeTokens ?? 0;
    const delta = earned - already;
    if (delta <= 0) return current;
    return {
      ...current,
      tokens: current.tokens + delta,
      session: {
        ...session,
        timeTokens: earned,
        tokensEarned: earned + session.completionTokens,
      },
    };
  });
}

export function completeSession(tokensEarned?: number) {
  creditLiveSessionTokens();
  const session = getSnapshot().session;
  if (!session) {
    return { ok: false as const, reason: "No session to complete." };
  }
  const startedAt = session.focusStartedAt ?? session.lockedAt;
  const elapsed = sessionElapsedMs(session);
  const computed = tokensFromElapsed(elapsed, session.demoMode);
  const timeTokens = Math.max(
    0,
    tokensEarned ?? Math.max(session.timeTokens ?? 0, computed),
  );
  const leftover = Math.max(0, timeTokens - (session.timeTokens ?? 0));
  const completionTokens = 0;
  const totalTokens = timeTokens;
  const endedAt = Date.now();
  const subjectId = session.subjectId;
  const subjectLabel =
    SUBJECTS.find((subject) => subject.id === subjectId)?.label ??
    session.title;
  const log: SessionLog = {
    id: session.id,
    kind: session.kind === "verified" ? "verified" : "manual",
    subjectId,
    subjectLabel,
    startedAt,
    endedAt,
    durationMs: elapsed,
    timeTokens,
    completionTokens,
    note: session.goal || undefined,
    taskId: session.taskId,
  };

  writeSessionRecap({
    title: session.title,
    minutes: Math.max(0, Math.round(elapsed / 60000)),
    elapsedMs: elapsed,
    tokens: totalTokens,
    timeTokens,
    completionTokens,
    kind: session.kind,
    endedAt,
  });

  const justHatched = !getSnapshot().spriteHatched;
  setState((current) => ({
    ...current,
    spriteHatched: true,
    hatchBurstAt: current.spriteHatched ? current.hatchBurstAt : Date.now(),
    tokens: current.tokens + leftover + completionTokens,
    tasks:
      session.kind === "verified" && session.taskId
        ? current.tasks.map((task) =>
            task.id === session.taskId ? { ...task, done: true } : task,
          )
        : current.tasks,
    schoolTasks:
      session.kind === "verified" && session.taskId
        ? current.schoolTasks.map((task) =>
            task.id === session.taskId ? { ...task, done: true } : task,
          )
        : current.schoolTasks,
    logs: [...current.logs, log],
    session: current.session
      ? {
          ...current.session,
          status: "completed",
          completedAt: endedAt,
          tokensEarned: totalTokens,
          timeTokens,
          completionTokens,
        }
      : null,
  }));
  if (justHatched) playSfx("hatch");
  return { ok: true as const, timeTokens, completionTokens, totalTokens };
}

export function saveProfile(input: {
  classYear: number;
  subjects: string[];
  spriteName?: string;
}) {
  const check = validateDiploma(input.subjects, input.classYear);
  if (!check.ok) {
    return { ok: false as const, reason: check.reason };
  }
  const profile = normalizeProfile({
    classYear: input.classYear,
    subjects: input.subjects,
    complete: true,
  });
  setState((current) => {
    const currentName = displaySpriteName(current.spriteName);
    const incoming = input.spriteName
      ? displaySpriteName(input.spriteName)
      : null;
    const spriteName =
      incoming && !isDefaultSpriteName(incoming) ? incoming : currentName;
    return {
      ...current,
      profile,
      spriteName,
      spriteRenameCount:
        spriteName !== currentName
          ? Math.max(current.spriteRenameCount ?? 0, 1)
          : current.spriteRenameCount,
    };
  });
  return { ok: true as const, profile };
}

export function saveMotivation(input: MotivationState) {
  const motivation = normalizeMotivation(input);
  setState((current) => ({ ...current, motivation }));
  return { ok: true as const, motivation };
}

export function saveSchedule(windows: LockWindow[]) {
  const schedule = normalizeSchedule(windows);
  if (windows.length > 8) {
    return { ok: false as const, reason: "Eight windows is enough." };
  }
  for (const window of windows) {
    const check = validateWindow(window);
    if (!check.ok) return { ok: false as const, reason: check.reason };
  }
  setState((current) => ({ ...current, schedule }));
  return { ok: true as const, schedule };
}

export function addLockWindow(input: Omit<LockWindow, "id">) {
  const check = validateWindow(input);
  if (!check.ok) return { ok: false as const, reason: check.reason };
  if (getSnapshot().schedule.length >= 8) {
    return { ok: false as const, reason: "Eight windows is enough." };
  }
  const window = normalizeSchedule([
    {
      ...input,
      id: crypto.randomUUID(),
    },
  ])[0];
  if (!window) {
    return { ok: false as const, reason: "Could not save that window." };
  }
  setState((current) => ({
    ...current,
    schedule: [...current.schedule, window],
  }));
  return { ok: true as const, window };
}

export function updateLockWindow(
  id: string,
  patch: Partial<Omit<LockWindow, "id">>,
) {
  const existing = getSnapshot().schedule.find((row) => row.id === id);
  if (!existing) return { ok: false as const, reason: "Window not found." };
  const next = normalizeWindow({ ...existing, ...patch, id });
  if (!next) return { ok: false as const, reason: "Could not update that window." };
  setState((current) => ({
    ...current,
    schedule: current.schedule.map((row) => (row.id === id ? next : row)),
  }));
  return { ok: true as const };
}

export function removeLockWindow(id: string) {
  setState((current) => ({
    ...current,
    schedule: current.schedule.filter((row) => row.id !== id),
  }));
}

export function clearSession() {
  setState((current) => ({ ...current, session: null }));
}

export function claimDailyLogin(now = new Date()) {
  const today = dayKey(now);
  if (getSnapshot().lastLoginDay === today) {
    return { ok: true as const, awarded: false, streakDays: getSnapshot().streakDays };
  }
  const streakDays =
    getSnapshot().lastLoginDay === yesterdayKey(now) ? getSnapshot().streakDays + 1 : 1;
  const prize = streakLoginPrize(streakDays);
  const weekGear = streakGearForWeek(streakDays);
  const weekReward = streakDays > 0 && streakDays % STREAK_REWARD_DAY === 0;
  setState((current) => ({
    ...current,
    lastLoginDay: today,
    streakDays,
    tokens: current.tokens + prize,
    appearance: weekReward
      ? normalizeAppearance({
          ...current.appearance,
          ownedTrails: [...current.appearance.ownedTrails, "week"],
          ownedGear: weekGear
            ? [...current.appearance.ownedGear, weekGear]
            : current.appearance.ownedGear,
          trail: "week",
          gear: weekGear ?? current.appearance.gear,
        })
      : current.appearance,
  }));
  return { ok: true as const, awarded: true, streakDays, weekReward, prize };
}
