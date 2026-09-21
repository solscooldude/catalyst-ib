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
import { normalizeAvatar, normalizeUsername } from "@/lib/identity";
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

export function feedSpark() {
  const today = dayKey();
  const used = getSnapshot().feedDay === today ? getSnapshot().feedCount : 0;
  if (used >= FEED_DAILY_LIMIT) {
    return { ok: false as const, reason: "That's enough snacks for today." };
  }
  if (getSnapshot().tokens < FEED_COST) {
    return { ok: false as const, reason: "Need 1 token to feed." };
  }
  const justHatched = !getSnapshot().spriteHatched;
  setState((current) => ({
    ...current,
    tokens: current.tokens - FEED_COST,
    feedDay: today,
    feedCount: used + 1,
    careActions: current.careActions + 1,
    spriteHatched: true,
    hatchBurstAt: current.spriteHatched ? current.hatchBurstAt : Date.now(),
  }));
  if (justHatched) playSfx("hatch");
  return { ok: true as const, remaining: FEED_DAILY_LIMIT - used - 1 };
}

export function scoreQuiz(correct: number) {
  const today = dayKey();
  if (getSnapshot().quizDay === today) {
    return { ok: false as const, reason: "Quiz already done today." };
  }
  const gained = Math.max(0, correct) * QUIZ_TOKEN;
  setState((current) => ({
    ...current,
    quizDay: today,
    quizCorrect: correct,
    tokens: current.tokens + gained,
    careActions: current.careActions + 1,
    spriteHatched: true,
    hatchBurstAt: current.spriteHatched ? current.hatchBurstAt : Date.now(),
  }));
  return { ok: true as const, gained };
}

export function grantFocusGift() {
  if (getSnapshot().session?.status !== "focus") {
    return { ok: false as const };
  }
  setState((current) => ({ ...current, tokens: current.tokens + 1 }));
  return { ok: true as const };
}

export function spendUnlock(catalogId: UnlockCatalogId) {
  const item = UNLOCK_CATALOG.find((entry) => entry.id === catalogId);
  if (!item) return { ok: false as const, reason: "Unknown unlock." };
  if (getSnapshot().tokens < item.cost) {
    return { ok: false as const, reason: "Not enough tokens yet." };
  }

  const duration = getSnapshot().demoMode ? DEMO_UNLOCK_MS : REAL_UNLOCK_MS;
  const now = Date.now();
  const label = item.name;
  const existing = coalesceUnlocks(getSnapshot().unlocks, now).find(
    (unlock) => unlock.catalogId === catalogId,
  );
  const remaining = existing ? Math.max(0, existing.expiresAt - now) : 0;
  const stacked = remaining > 0;

  const unlock: Unlock = {
    id: existing?.id ?? crypto.randomUUID(),
    catalogId,
    label,
    cost: (existing?.cost ?? 0) + item.cost,
    startedAt: existing?.startedAt ?? now,
    expiresAt: now + remaining + duration,
  };

  setState((current) => ({
    ...current,
    tokens: current.tokens - item.cost,
    unlocks: [
      ...coalesceUnlocks(current.unlocks, now).filter(
        (row) => row.catalogId !== catalogId,
      ),
      unlock,
    ],
  }));

  return { ok: true as const, unlock, stacked };
}

export function spendUnlockTier(tier: UnlockTier) {
  const catalogId = unlockTierSpendId(tier);
  const cost = tier === 2 ? TIER2_COST : TIER3_COST;
  const label = tier === 2 ? "Tier 2" : "Tier 3";
  if (getSnapshot().tokens < cost) {
    return { ok: false as const, reason: "Not enough tokens yet." };
  }

  const duration = getSnapshot().demoMode ? DEMO_UNLOCK_MS : REAL_UNLOCK_MS;
  const now = Date.now();
  const existing = coalesceUnlocks(getSnapshot().unlocks, now).find(
    (unlock) => unlock.catalogId === catalogId,
  );
  const remaining = existing ? Math.max(0, existing.expiresAt - now) : 0;
  const stacked = remaining > 0;

  const unlock: Unlock = {
    id: existing?.id ?? crypto.randomUUID(),
    catalogId,
    label,
    cost: (existing?.cost ?? 0) + cost,
    startedAt: existing?.startedAt ?? now,
    expiresAt: now + remaining + duration,
  };

  setState((current) => ({
    ...current,
    tokens: current.tokens - cost,
    unlocks: [
      ...coalesceUnlocks(current.unlocks, now).filter(
        (row) => row.catalogId !== catalogId,
      ),
      unlock,
    ],
  }));

  playSfx("unlock");
  return { ok: true as const, unlock, stacked };
}

export function spendUnlockNemesis() {
  const catalogId = "nemesis" as const;
  const cost = NEMESIS_UNLOCK_COST;
  const snapshot = getSnapshot();
  if (snapshot.nemeses.length === 0) {
    return { ok: false as const, reason: "Pick a nemesis in Setup first." };
  }
  if (snapshot.tokens < cost) {
    return { ok: false as const, reason: "Not enough tokens yet." };
  }

  const duration = snapshot.demoMode ? DEMO_UNLOCK_MS : REAL_UNLOCK_MS;
  const now = Date.now();
  const existing = coalesceUnlocks(snapshot.unlocks, now).find(
    (unlock) => unlock.catalogId === catalogId,
  );
  const remaining = existing ? Math.max(0, existing.expiresAt - now) : 0;
  const stacked = remaining > 0;

  const unlock: Unlock = {
    id: existing?.id ?? crypto.randomUUID(),
    catalogId,
    label: "Nemesis apps",
    cost: (existing?.cost ?? 0) + cost,
    startedAt: existing?.startedAt ?? now,
    expiresAt: now + remaining + duration,
  };

  setState((current) => ({
    ...current,
    tokens: current.tokens - cost,
    unlocks: [
      ...coalesceUnlocks(current.unlocks, now).filter(
        (row) => row.catalogId !== catalogId,
      ),
      unlock,
    ],
  }));

  playSfx("unlock");
  return { ok: true as const, unlock, stacked };
}

export type AppearanceKind =
  | "accent"
  | "background"
  | "sparkTint"
  | "gear"
  | "aura"
  | "trail"
  | "focusTheme";

function catalogFor(kind: AppearanceKind) {
  if (kind === "accent") return ACCENTS;
  if (kind === "background") return BACKGROUNDS;
  if (kind === "sparkTint") return SPARK_TINTS;
  if (kind === "gear") return SPARK_GEAR;
  if (kind === "aura") return SPARK_AURAS;
  if (kind === "trail") return SPARK_TRAILS;
  return FOCUS_THEMES;
}

function ownedKey(kind: AppearanceKind): keyof AppearanceState {
  if (kind === "accent") return "ownedAccents";
  if (kind === "background") return "ownedBackgrounds";
  if (kind === "sparkTint") return "ownedSparkTints";
  if (kind === "gear") return "ownedGear";
  if (kind === "aura") return "ownedAuras";
  if (kind === "trail") return "ownedTrails";
  return "ownedFocusThemes";
}

function equippedKey(kind: AppearanceKind): keyof AppearanceState {
  if (kind === "accent") return "accent";
  if (kind === "background") return "background";
  if (kind === "sparkTint") return "sparkTint";
  if (kind === "gear") return "gear";
  if (kind === "aura") return "aura";
  if (kind === "trail") return "trail";
  return "focusTheme";
}

export function buyAppearance(kind: AppearanceKind, id: string) {
  const item = catalogFor(kind).find((row) => row.id === id);
  if (!item) return { ok: false as const, reason: "Unknown item." };
  if (id === "week") {
    return { ok: false as const, reason: "Login seven days in a row." };
  }
  const owned = getSnapshot().appearance[ownedKey(kind)] as string[];
  if (owned.includes(id)) {
    return { ok: false as const, reason: "Already in your closet." };
  }
  if (getSnapshot().tokens < item.cost) {
    return { ok: false as const, reason: "Not enough tokens yet." };
  }

  setState((current) => ({
    ...current,
    tokens: current.tokens - item.cost,
    appearance: normalizeAppearance({
      ...current.appearance,
      [ownedKey(kind)]: [
        ...(current.appearance[ownedKey(kind)] as string[]),
        id,
      ],
      [equippedKey(kind)]: id,
    }),
  }));

  return { ok: true as const, item, equipped: true };
}

export function equipAppearance(kind: AppearanceKind, id: string) {
  const item = catalogFor(kind).find((row) => row.id === id);
  if (!item) return { ok: false as const, reason: "Unknown item." };
  const owned = getSnapshot().appearance[ownedKey(kind)] as string[];
  if (!owned.includes(id)) {
    return { ok: false as const, reason: "Buy it first." };
  }

  setState((current) => ({
    ...current,
    appearance: normalizeAppearance({
      ...current.appearance,
      [equippedKey(kind)]: id,
    }),
  }));

  return { ok: true as const, item };
}

export function setAccentShade(shade: AccentShadeId, hue?: AccentId) {
  const accent = hue ?? getSnapshot().appearance.accent;
  if (!getSnapshot().appearance.ownedAccents.includes(accent)) {
    return { ok: false as const, reason: "Buy the colour first." };
  }
  setState((current) => ({
    ...current,
    appearance: normalizeAppearance({
      ...current.appearance,
      accent,
      accentShade: shade,
    }),
  }));
  return { ok: true as const };
}

export function setBackgroundShade(shade: AccentShadeId, hue?: BackgroundId) {
  const background = hue ?? getSnapshot().appearance.background;
  if (!getSnapshot().appearance.ownedBackgrounds.includes(background)) {
    return { ok: false as const, reason: "Buy the colour first." };
  }
  if (!roomHasShades(background)) {
    return { ok: false as const, reason: "This room has no shade." };
  }
  setState((current) => ({
    ...current,
    appearance: normalizeAppearance({
      ...current.appearance,
      background,
      backgroundShade: shade,
    }),
  }));
  return { ok: true as const };
}

export function completeIntro() {
  setState((current) => ({ ...current, introSeen: true }));
}

export function setFriendCode(raw: string) {
  const code = normalizeFriendCode(raw);
  if (!code) return { ok: false as const, reason: FRIEND_CODE_HINT };
  if (code === getSnapshot().friendCode) return { ok: true as const, code };
  if (getSnapshot().friends.some((row) => row.code === code)) {
    return { ok: false as const, reason: "A friend already uses that code." };
  }
  const claimed = claimFriendCode(code);
  if (!claimed.ok) return claimed;
  setState((current) => ({ ...current, friendCode: code }));
  return { ok: true as const, code };
}

export function addFriend(raw: string) {
  const code = normalizeFriendCode(raw);
  if (!code) return { ok: false as const, reason: FRIEND_CODE_HINT };
  if (code === getSnapshot().friendCode) {
    return { ok: false as const, reason: "That's your own code." };
  }
  if (getSnapshot().friends.some((row) => row.code === code)) {
    return { ok: false as const, reason: "Already added." };
  }
  if (getSnapshot().friends.length >= 24) {
    return { ok: false as const, reason: "Friend list is full." };
  }
  const next = stubFriendFromCode(code);
  setState((current) => ({
    ...current,
    friends: [...current.friends, next],
  }));
  return { ok: true as const, friend: next };
}

export function removeFriend(code: string) {
  setState((current) => ({
    ...current,
    friends: current.friends.filter((row) => row.code !== code),
  }));
  return { ok: true as const };
}

export function importSchoolTasks(
  incoming: SchoolTask[],
  extras?: Partial<
    Pick<
      CatalystState,
      | "classroomConnected"
      | "classroomEmail"
      | "classroomMode"
      | "manageBacConnected"
      | "manageBacSchoolUrl"
      | "manageBacIcsUrl"
      | "manageBacMode"
      | "schoolProvider"
    >
  >,
) {
  if (incoming.length === 0) {
    return { ok: false as const, reason: "No tasks to import." };
  }
  setState((current) => ({
    ...current,
    schoolTasks: mergeSchoolTasks(current.schoolTasks, incoming),
    ...extras,
  }));
  return { ok: true as const, count: incoming.length };
}

export function setSchoolProvider(provider: SchoolProvider) {
  setState((current) => ({ ...current, schoolProvider: provider }));
  return { ok: true as const, provider };
}

export function addManualSchoolTask(input: {
  title: string;
  subject?: string;
  due?: string;
  detail?: string;
}) {
  const title = input.title.trim();
  if (title.length < 3) {
    return { ok: false as const, reason: "Give the task a real title." };
  }
  const subject = (input.subject ?? "").trim() || "Other";
  const task: SchoolTask = {
    id: `manual-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 36) || Date.now()}`,
    title: title.slice(0, 120),
    subject: subject.slice(0, 48),
    subjectId: inferSubjectId(`${subject} ${title}`),
    due: (input.due ?? "").trim().slice(0, 32),
    detail: (input.detail ?? "Added by hand.").trim().slice(0, 200),
    source: "manual",
    done: false,
  };
  return importSchoolTasks([task]);
}

export function markSchoolTaskDone(taskId: string, done: boolean) {
  setState((current) => ({
    ...current,
    schoolTasks: current.schoolTasks.map((task) =>
      task.id === taskId ? { ...task, done } : task,
    ),
    tasks: current.tasks.map((task) =>
      task.id === taskId ? { ...task, done } : task,
    ),
  }));
  return { ok: true as const };
}

export function markSchoolTaskSubmitted(taskId: string, submitted: boolean) {
  setState((current) => ({
    ...current,
    schoolTasks: current.schoolTasks.map((task) =>
      task.id === taskId
        ? { ...task, submitted, done: submitted ? true : task.done }
        : task,
    ),
  }));
  return { ok: true as const };
}

export function applyClassroomSubmissionStates(
  rows: Array<{ id: string; submitted?: boolean; done?: boolean }>,
) {
  setState((current) => {
    const byId = new Map(rows.map((row) => [row.id, row]));
    return {
      ...current,
      schoolTasks: current.schoolTasks.map((task) => {
        const hit = byId.get(task.id);
        if (!hit) return task;
        return {
          ...task,
          submitted: hit.submitted ?? task.submitted,
          done: hit.done ?? (hit.submitted ? true : task.done),
        };
      }),
    };
  });
  return { ok: true as const, count: rows.length };
}

export function connectClassroomSample() {
  return importSchoolTasks(SAMPLE_CLASSROOM_TASKS, {
    schoolProvider: "classroom",
    classroomConnected: true,
    classroomEmail: "",
    classroomMode: "sample",
  });
}

export function connectClassroomLive(input: {
  email?: string;
  tasks: SchoolTask[];
}) {
  const tasks = input.tasks.length ? input.tasks : SAMPLE_CLASSROOM_TASKS;
  return importSchoolTasks(tasks, {
    schoolProvider: "classroom",
    classroomConnected: true,
    classroomEmail: input.email ?? "",
    classroomMode: input.tasks.length ? "oauth" : "sample",
  });
}

export function connectManageBacSample(schoolUrl?: string) {
  return importSchoolTasks(SAMPLE_MANAGEBAC_TASKS, {
    schoolProvider: "managebac",
    manageBacConnected: true,
    manageBacMode: "sample",
    manageBacSchoolUrl: schoolUrl?.trim().slice(0, 160) ?? getSnapshot().manageBacSchoolUrl,
  });
}

export function connectManageBacImport(raw: string, schoolUrl?: string) {
  const tasks = parseManageBacImport(raw);
  if (tasks.length === 0) {
    return {
      ok: false as const,
      reason: "Paste lines like Title | Subject | Due, or an ICS calendar.",
    };
  }
  return importSchoolTasks(tasks, {
    schoolProvider: "managebac",
    manageBacConnected: true,
    manageBacMode: "import",
    manageBacSchoolUrl: schoolUrl?.trim().slice(0, 160) ?? getSnapshot().manageBacSchoolUrl,
  });
}

export function connectManageBacScan(tasks: SchoolTask[]) {
  return importSchoolTasks(tasks, {
    schoolProvider: "managebac",
    manageBacConnected: true,
    manageBacMode: "scan",
  });
}

export function connectManageBacIcs(tasks: SchoolTask[], icsUrl?: string) {
  return importSchoolTasks(tasks, {
    schoolProvider: "managebac",
    manageBacConnected: true,
    manageBacMode: "ics",
    manageBacIcsUrl: icsUrl?.trim().slice(0, 240) ?? getSnapshot().manageBacIcsUrl,
  });
}

export function resetSchoolTasksToDemo() {
  setState((current) => ({
    ...current,
    schoolTasks: mockTasksAsSchool(
      current.tasks.filter((row) => row.done).map((row) => row.id),
    ),
    classroomConnected: false,
    classroomEmail: "",
    classroomMode: null,
    manageBacConnected: current.setupComplete,
    manageBacMode: null,
  }));
  return { ok: true as const };
}

export function setSoundMuted(soundMuted: boolean) {
  setState((current) => ({ ...current, soundMuted }));
}

export function saveIdentity(input: {
  username?: string;
  avatarDataUrl?: string | null;
}) {
  const username = normalizeUsername(input.username);
  const avatarDataUrl =
    input.avatarDataUrl === undefined
      ? undefined
      : normalizeAvatar(input.avatarDataUrl);
  setState((current) => ({
    ...current,
    username: input.username === undefined ? current.username : username,
    avatarDataUrl:
      avatarDataUrl === undefined ? current.avatarDataUrl : avatarDataUrl,
  }));
  return { ok: true as const };
}

export function addCareAction() {
  const justHatched = !getSnapshot().spriteHatched;
  setState((current) => ({
    ...current,
    careActions: current.careActions + 1,
    spriteHatched: true,
    hatchBurstAt: current.spriteHatched ? current.hatchBurstAt : Date.now(),
  }));
  if (justHatched) playSfx("hatch");
}

export function addPlannerTodo(title: string) {
  const next = title.trim();
  if (!next) return { ok: false as const, reason: "Add a title." };
  if (getSnapshot().plannerTodos.length >= 40) {
    return { ok: false as const, reason: "Forty to-dos is enough." };
  }
  setState((current) => ({
    ...current,
    plannerTodos: [
      {
        id: crypto.randomUUID(),
        title: next.slice(0, 80),
        done: false,
        createdAt: Date.now(),
      },
      ...current.plannerTodos,
    ],
  }));
  return { ok: true as const };
}

export function togglePlannerTodo(id: string) {
  setState((current) => ({
    ...current,
    plannerTodos: current.plannerTodos.map((row) =>
      row.id === id ? { ...row, done: !row.done } : row,
    ),
  }));
}

export function removePlannerTodo(id: string) {
  setState((current) => ({
    ...current,
    plannerTodos: current.plannerTodos.filter((row) => row.id !== id),
  }));
}

export function addPlannerEvent(input: {
  title: string;
  day: number;
  time: string;
  kind: PlannerEventKind;
  date?: string | null;
}) {
  if (getSnapshot().plannerEvents.length >= 60) {
    return { ok: false as const, reason: "Sixty events is enough." };
  }
  const [event] = normalizePlannerEvents([
    {
      id: crypto.randomUUID(),
      title: input.title,
      day: input.day,
      time: input.time,
      kind: input.kind,
      date: input.date ?? null,
    },
  ]);
  if (!event) return { ok: false as const, reason: "Need a title, day, and time." };
  setState((current) => ({
    ...current,
    plannerEvents: [...current.plannerEvents, event],
  }));
  return { ok: true as const, event };
}

export function removePlannerEvent(id: string) {
  setState((current) => ({
    ...current,
    plannerEvents: current.plannerEvents.filter((row) => row.id !== id),
  }));
}
