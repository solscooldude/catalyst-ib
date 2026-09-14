"use client";

import { useSyncExternalStore } from "react";
import {
  ACCENTS,
  BACKGROUNDS,
  SPARK_GEAR,
  SPARK_TINTS,
  defaultAppearance,
  normalizeAppearance,
  type AppearanceState,
} from "@/lib/appearance";
import {
  COMPLETION_BONUS,
  DEMO_TOKEN_MS,
  DEMO_UNLOCK_MS,
  MOCK_TASKS,
  NEMESIS_APPS,
  REAL_TOKEN_MS,
  REAL_UNLOCK_MS,
  STORAGE_KEY,
  SUBJECTS,
  TASK_SUBJECT,
  UNLOCK_CATALOG,
  type NemesisId,
  type SubjectId,
  type TaskId,
  type UnlockCatalogId,
} from "@/lib/constants";
import {
  defaultMotivation,
  defaultProfile,
  normalizeMotivation,
  normalizeProfile,
  validateDiploma,
  type MotivationState,
  type ProfileState,
} from "@/lib/ib";
import {
  normalizeSchedule,
  normalizeWindow,
  validateWindow,
  type LockWindow,
} from "@/lib/schedule";

export type TaskState = {
  id: TaskId;
  done: boolean;
};

export type SessionStatus = "locked" | "focus" | "completed";

export type SessionKind = "verified" | "study";

export type Session = {
  id: string;
  kind: SessionKind;
  taskId?: TaskId;
  subjectId: SubjectId;
  title: string;
  goal: string;
  plannedMinutes: number | null;
  demoMode: boolean;
  status: SessionStatus;
  lockedAt: number;
  focusStartedAt: number | null;
  completedAt: number | null;
  taskMarkedDone: boolean;
  tokensEarned: number;
  timeTokens: number;
  completionTokens: number;
};

export type SessionLog = {
  id: string;
  kind: "verified" | "manual";
  subjectId: SubjectId;
  subjectLabel: string;
  startedAt: number;
  endedAt: number;
  durationMs: number;
  timeTokens: number;
  completionTokens: number;
  note?: string;
  taskId?: TaskId;
};

export type Unlock = {
  id: string;
  catalogId: UnlockCatalogId;
  label: string;
  cost: number;
  startedAt: number;
  expiresAt: number;
};

export type CatalystState = {
  hydrated: boolean;
  setupComplete: boolean;
  nemesis: NemesisId | null;
  manageBacConnected: boolean;
  demoMode: boolean;
  tokens: number;
  tasks: TaskState[];
  session: Session | null;
  unlocks: Unlock[];
  logs: SessionLog[];
  appearance: AppearanceState;
  profile: ProfileState;
  motivation: MotivationState;
  schedule: LockWindow[];
};

const defaultTasks: TaskState[] = MOCK_TASKS.map((task) => ({
  id: task.id,
  done: false,
}));

export const defaultState: CatalystState = {
  hydrated: false,
  setupComplete: false,
  nemesis: null,
  manageBacConnected: false,
  demoMode: true,
  tokens: 0,
  tasks: defaultTasks,
  session: null,
  unlocks: [],
  logs: [],
  appearance: defaultAppearance,
  profile: defaultProfile,
  motivation: defaultMotivation,
  schedule: [],
};

type Listener = () => void;

let state: CatalystState = defaultState;
const listeners = new Set<Listener>();

function emit() {
  listeners.forEach((listener) => listener());
}

let storageAccountId: string | null = null;

function accountStorageKey(userId: string) {
  return `${STORAGE_KEY}:user:${userId}`;
}

function persist(next: CatalystState) {
  if (typeof window === "undefined" || !storageAccountId) return;
  const { hydrated, ...rest } = next;
  void hydrated;
  window.localStorage.setItem(
    accountStorageKey(storageAccountId),
    JSON.stringify(rest),
  );
}

function setState(updater: (current: CatalystState) => CatalystState) {
  state = updater(state);
  persist(state);
  emit();
}

function pruneUnlocks(unlocks: Unlock[], now = Date.now()) {
  return unlocks.filter((unlock) => unlock.expiresAt > now);
}

function coalesceUnlocks(unlocks: Unlock[], now = Date.now()) {
  const byCatalog = new Map<UnlockCatalogId, Unlock>();
  for (const unlock of pruneUnlocks(unlocks, now)) {
    const existing = byCatalog.get(unlock.catalogId);
    if (!existing) {
      byCatalog.set(unlock.catalogId, unlock);
      continue;
    }
    const remaining =
      Math.max(0, existing.expiresAt - now) +
      Math.max(0, unlock.expiresAt - now);
    byCatalog.set(unlock.catalogId, {
      ...existing,
      cost: existing.cost + unlock.cost,
      expiresAt: now + remaining,
    });
  }
  return [...byCatalog.values()];
}

export function hydrateStore(userId: string | null = null) {
  if (typeof window === "undefined") return;
  storageAccountId = userId;
  if (!userId) {
    state = { ...defaultState, hydrated: true };
    emit();
    return;
  }
  try {
    const raw = window.localStorage.getItem(accountStorageKey(userId));
    if (!raw) {
      state = { ...defaultState, hydrated: true };
      emit();
      return;
    }
    const parsed = JSON.parse(raw) as Partial<CatalystState>;
    state = {
      ...defaultState,
      ...parsed,
      tasks:
        parsed.tasks && parsed.tasks.length === defaultTasks.length
          ? parsed.tasks
          : defaultTasks,
      unlocks: coalesceUnlocks(parsed.unlocks ?? []),
      logs: parsed.logs ?? [],
      appearance: normalizeAppearance(parsed.appearance),
      profile: normalizeProfile(parsed.profile),
      motivation: normalizeMotivation(parsed.motivation),
      schedule: normalizeSchedule(parsed.schedule),
      session: normalizeSession(parsed.session ?? null),
      hydrated: true,
    };
  } catch {
    state = { ...defaultState, hydrated: true };
  }
  emit();
}

export function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getSnapshot() {
  return state;
}

export function getServerSnapshot() {
  return defaultState;
}

export function useCatalyst() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function completeSetup(nemesis: NemesisId) {
  setState((current) => ({
    ...current,
    nemesis,
    manageBacConnected: true,
    setupComplete: true,
  }));
}

export function setDemoMode(demoMode: boolean) {
  setState((current) => ({ ...current, demoMode }));
}

function normalizeSession(raw: Session | (Session & { taskId: TaskId }) | null) {
  if (!raw) return null;
  if (raw.kind && raw.subjectId && raw.title) return raw;
  const legacy = raw as Session & { taskId?: TaskId };
  const taskId = legacy.taskId;
  if (!taskId) return null;
  const task = MOCK_TASKS.find((row) => row.id === taskId);
  return {
    ...legacy,
    kind: "verified" as const,
    taskId,
    subjectId: TASK_SUBJECT[taskId],
    title: task?.title ?? "Focus session",
    plannedMinutes: legacy.plannedMinutes ?? null,
  };
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
    ? Math.round(realMs * (DEMO_TOKEN_MS / REAL_TOKEN_MS))
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
  minutes: number;
}) {
  const minutes = Math.floor(input.minutes);
  const title = input.title.trim();
  if (title.length < 3) {
    return { ok: false as const, reason: "Say what you are studying." };
  }
  if (!Number.isFinite(minutes) || minutes < 5) {
    return { ok: false as const, reason: "Pick at least a 5-minute block." };
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
  const interval = demoMode ? DEMO_TOKEN_MS : REAL_TOKEN_MS;
  return Math.floor(Math.max(0, elapsedMs) / interval);
}

export function completeSession(tokensEarned: number) {
  const session = state.session;
  if (!session) {
    return { ok: false as const, reason: "No session to complete." };
  }
  if (session.kind === "verified" && !session.taskMarkedDone) {
    return { ok: false as const, reason: "Mark the ManageBac task done first." };
  }
  const startedAt = session.focusStartedAt ?? session.lockedAt;
  const elapsed = Date.now() - startedAt;
  const needed = plannedLockMs(session);
  if (needed && elapsed < needed) {
    return {
      ok: false as const,
      reason: "Stay until this study block ends. No credit for leaving early.",
    };
  }
  if (tokensEarned < 1) {
    return {
      ok: false as const,
      reason: session.demoMode
        ? "Stay focused for 30 seconds to earn your first token."
        : "Stay focused for 5 minutes to earn your first token.",
    };
  }

  const timeTokens = tokensEarned;
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
    durationMs: Math.max(0, endedAt - startedAt),
    timeTokens,
    completionTokens,
    note: session.goal || undefined,
    taskId: session.taskId,
  };

  setState((current) => ({
    ...current,
    tokens: current.tokens + totalTokens,
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
  if (!motivation.colleges || !motivation.course || !motivation.why) {
    return {
      ok: false as const,
      reason: "Colleges, course, and why it matters are required.",
    };
  }
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

export function spendUnlock(catalogId: UnlockCatalogId) {
  const item = UNLOCK_CATALOG.find((entry) => entry.id === catalogId);
  if (!item) return { ok: false as const, reason: "Unknown unlock." };
  if (state.tokens < item.cost) {
    return { ok: false as const, reason: "Not enough tokens yet." };
  }

  const duration = state.demoMode ? DEMO_UNLOCK_MS : REAL_UNLOCK_MS;
  const now = Date.now();
  const nemesisName =
    NEMESIS_APPS.find((app) => app.id === state.nemesis)?.name ?? "Nemesis app";
  const label = catalogId === "nemesis" ? nemesisName : item.name;
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

export type AppearanceKind = "accent" | "background" | "sparkTint" | "gear";

function catalogFor(kind: AppearanceKind) {
  if (kind === "accent") return ACCENTS;
  if (kind === "background") return BACKGROUNDS;
  if (kind === "sparkTint") return SPARK_TINTS;
  return SPARK_GEAR;
}

function ownedKey(kind: AppearanceKind): keyof AppearanceState {
  if (kind === "accent") return "ownedAccents";
  if (kind === "background") return "ownedBackgrounds";
  if (kind === "sparkTint") return "ownedSparkTints";
  return "ownedGear";
}

function equippedKey(kind: AppearanceKind): keyof AppearanceState {
  if (kind === "accent") return "accent";
  if (kind === "background") return "background";
  if (kind === "sparkTint") return "sparkTint";
  return "gear";
}

export function buyAppearance(kind: AppearanceKind, id: string) {
  const item = catalogFor(kind).find((row) => row.id === id);
  if (!item) return { ok: false as const, reason: "Unknown item." };
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

export function resetDemo() {
  if (typeof window !== "undefined" && storageAccountId) {
    window.localStorage.removeItem(accountStorageKey(storageAccountId));
  }
  state = { ...defaultState, hydrated: true };
  emit();
}

export function getTask(id: TaskId) {
  return MOCK_TASKS.find((task) => task.id === id);
}

export function getNemesis(id: NemesisId | null) {
  return NEMESIS_APPS.find((app) => app.id === id);
}

export function isUnlockActive(
  unlocks: Unlock[],
  catalogId: UnlockCatalogId,
  now = Date.now(),
) {
  return coalesceUnlocks(unlocks, now).some(
    (unlock) => unlock.catalogId === catalogId,
  );
}
