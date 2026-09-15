"use client";

import {
  ACCENTS,
  BACKGROUNDS,
  FOCUS_THEMES,
  SPARK_GEAR,
  SPARK_TRAILS,
  SPARK_TINTS,
  normalizeAppearance,
  type AccentId,
  type AccentShadeId,
  type AppearanceState,
} from "@/lib/appearance";
import {
  FEED_COST,
  FEED_DAILY_LIMIT,
  LOGIN_TOKEN,
  QUIZ_TOKEN,
  STREAK_REWARD_DAY,
  dayKey,
  yesterdayKey,
} from "@/lib/care";
import {
  COMPLETION_BONUS,
  DEMO_TIME_COMPRESS_MS,
  DEMO_TOKEN_BLOCK_MS,
  DEMO_TOKENS_PER_BLOCK,
  DEMO_UNLOCK_MS,
  MOCK_TASKS,
  REAL_TIME_COMPRESS_MS,
  REAL_TOKEN_MS,
  REAL_UNLOCK_MS,
  SUBJECTS,
  TASK_SUBJECT,
  UNLOCK_CATALOG,
  formatNemesisList,
  isNemesisId,
  type NemesisId,
  type SubjectId,
  type TaskId,
  type UnlockCatalogId,
} from "@/lib/constants";
import {
  normalizeMotivation,
  normalizeProfile,
  validateDiploma,
  type MotivationState,
} from "@/lib/ib";
import {
  normalizeSchedule,
  normalizeWindow,
  validateWindow,
  type LockWindow,
} from "@/lib/schedule";
import { writeSessionRecap } from "@/lib/session-recap";
import {
  coalesceUnlocks,
  setState,
  state,
  type Session,
  type SessionLog,
  type Unlock,
} from "@/lib/store-core";

export * from "@/lib/store-core";

export function completeSetup(nemeses: NemesisId[]) {
  const next = [...new Set(nemeses.filter(isNemesisId))];
  if (next.length === 0) return;
  setState((current) => ({
    ...current,
    nemeses: next,
    manageBacConnected: true,
    setupComplete: true,
  }));
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
  const task = MOCK_TASKS.find((row) => row.id === input.taskId);
  const session: Session = {
    id: crypto.randomUUID(),
    kind: "verified",
    taskId: input.taskId,
    subjectId: TASK_SUBJECT[input.taskId],
    title: task?.title ?? "Official task",
    goal: input.goal.trim(),
    plannedMinutes: null,
    demoMode: state.demoMode,
    status: "locked",
    lockedAt: Date.now(),
    focusStartedAt: null,
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
  if (state.session?.status === "locked" || state.session?.status === "focus") {
    return { ok: false as const, reason: "Finish the session already running." };
  }

  const session: Session = {
    id: crypto.randomUUID(),
    kind: "study",
    subjectId: subject.id,
    title,
    goal: title,
    plannedMinutes: minutes,
    demoMode: state.demoMode,
    status: "locked",
    lockedAt: Date.now(),
    focusStartedAt: null,
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
    if (!current.session || current.session.status !== "locked") return current;
    return {
      ...current,
      session: {
        ...current.session,
        status: "focus",
        focusStartedAt: Date.now(),
        pausedAt: null,
        pauseAccumMs: 0,
      },
    };
  });
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
  const session = state.session;
  if (!session) {
    return { ok: false as const, reason: "No session to complete." };
  }
  if (session.kind === "verified" && !session.taskMarkedDone) {
    return { ok: false as const, reason: "Mark the ManageBac task done first." };
  }
  const startedAt = session.focusStartedAt ?? session.lockedAt;
  const elapsed = sessionElapsedMs(session);
  const computed = tokensFromElapsed(elapsed, session.demoMode);
  const timeTokens = Math.max(
    0,
    tokensEarned ?? Math.max(session.timeTokens ?? 0, computed),
  );
  const leftover = Math.max(0, timeTokens - (session.timeTokens ?? 0));
  const completionTokens = session.kind === "verified" ? COMPLETION_BONUS : 0;
  const totalTokens = timeTokens + completionTokens;
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

  setState((current) => ({
    ...current,
    tokens: current.tokens + leftover + completionTokens,
    tasks:
      session.kind === "verified" && session.taskId
        ? current.tasks.map((task) =>
            task.id === session.taskId ? { ...task, done: true } : task,
          )
        : current.tasks,
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
  return { ok: true as const, timeTokens, completionTokens, totalTokens };
}

export function saveProfile(input: { classYear: number; subjects: string[] }) {
  const check = validateDiploma(input.subjects, input.classYear);
  if (!check.ok) {
    return { ok: false as const, reason: check.reason };
  }
  const profile = normalizeProfile({
    classYear: input.classYear,
    subjects: input.subjects,
    complete: true,
  });
  setState((current) => ({ ...current, profile }));
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
  if (state.schedule.length >= 8) {
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
  const existing = state.schedule.find((row) => row.id === id);
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
  if (state.lastLoginDay === today) {
    return { ok: true as const, awarded: false, streakDays: state.streakDays };
  }
  const streakDays =
    state.lastLoginDay === yesterdayKey(now) ? state.streakDays + 1 : 1;
  const weekReward = streakDays > 0 && streakDays % STREAK_REWARD_DAY === 0;
  setState((current) => ({
    ...current,
    lastLoginDay: today,
    streakDays,
    tokens: current.tokens + LOGIN_TOKEN,
    appearance: weekReward
      ? normalizeAppearance({
          ...current.appearance,
          ownedTrails: [...current.appearance.ownedTrails, "week"],
          trail: "week",
        })
      : current.appearance,
  }));
  return { ok: true as const, awarded: true, streakDays, weekReward };
}

export function feedSpark() {
  const today = dayKey();
  const used = state.feedDay === today ? state.feedCount : 0;
  if (used >= FEED_DAILY_LIMIT) {
    return { ok: false as const, reason: "That's enough snacks for today." };
  }
  if (state.tokens < FEED_COST) {
    return { ok: false as const, reason: "Need 1 token to feed." };
  }
  setState((current) => ({
    ...current,
    tokens: current.tokens - FEED_COST,
    feedDay: today,
    feedCount: used + 1,
  }));
  return { ok: true as const, remaining: FEED_DAILY_LIMIT - used - 1 };
}

export function scoreQuiz(correct: number) {
  const today = dayKey();
  if (state.quizDay === today) {
    return { ok: false as const, reason: "Quiz already done today." };
  }
  const gained = Math.max(0, correct) * QUIZ_TOKEN;
  setState((current) => ({
    ...current,
    quizDay: today,
    quizCorrect: correct,
    tokens: current.tokens + gained,
  }));
  return { ok: true as const, gained };
}

export function grantFocusGift() {
  if (state.session?.status !== "focus") {
    return { ok: false as const };
  }
  setState((current) => ({ ...current, tokens: current.tokens + 1 }));
  return { ok: true as const };
}

export function spendUnlock(catalogId: UnlockCatalogId) {
  const item = UNLOCK_CATALOG.find((entry) => entry.id === catalogId);
  if (!item) return { ok: false as const, reason: "Unknown unlock." };
  if (state.tokens < item.cost) {
    return { ok: false as const, reason: "Not enough tokens yet." };
  }

  const duration = state.demoMode ? DEMO_UNLOCK_MS : REAL_UNLOCK_MS;
  const now = Date.now();
  const label =
    catalogId === "nemesis" ? formatNemesisList(state.nemeses) : item.name;
  const existing = coalesceUnlocks(state.unlocks, now).find(
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

export type AppearanceKind =
  | "accent"
  | "background"
  | "sparkTint"
  | "gear"
  | "trail"
  | "focusTheme";

function catalogFor(kind: AppearanceKind) {
  if (kind === "accent") return ACCENTS;
  if (kind === "background") return BACKGROUNDS;
  if (kind === "sparkTint") return SPARK_TINTS;
  if (kind === "gear") return SPARK_GEAR;
  if (kind === "trail") return SPARK_TRAILS;
  return FOCUS_THEMES;
}

function ownedKey(kind: AppearanceKind): keyof AppearanceState {
  if (kind === "accent") return "ownedAccents";
  if (kind === "background") return "ownedBackgrounds";
  if (kind === "sparkTint") return "ownedSparkTints";
  if (kind === "gear") return "ownedGear";
  if (kind === "trail") return "ownedTrails";
  return "ownedFocusThemes";
}

function equippedKey(kind: AppearanceKind): keyof AppearanceState {
  if (kind === "accent") return "accent";
  if (kind === "background") return "background";
  if (kind === "sparkTint") return "sparkTint";
  if (kind === "gear") return "gear";
  if (kind === "trail") return "trail";
  return "focusTheme";
}

export function buyAppearance(kind: AppearanceKind, id: string) {
  const item = catalogFor(kind).find((row) => row.id === id);
  if (!item) return { ok: false as const, reason: "Unknown item." };
  if (id === "week") {
    return { ok: false as const, reason: "Login seven days in a row." };
  }
  const owned = state.appearance[ownedKey(kind)] as string[];
  if (owned.includes(id)) {
    return { ok: false as const, reason: "Already in your closet." };
  }
  if (state.tokens < item.cost) {
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
  const owned = state.appearance[ownedKey(kind)] as string[];
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
  const accent = hue ?? state.appearance.accent;
  if (!state.appearance.ownedAccents.includes(accent)) {
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
