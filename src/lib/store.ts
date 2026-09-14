"use client";

import { useSyncExternalStore } from "react";
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

export type TaskState = {
  id: TaskId;
  done: boolean;
};

export type SessionStatus = "locked" | "focus" | "completed";

export type Session = {
  id: string;
  taskId: TaskId;
  goal: string;
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

export function startSession(input: { taskId: TaskId; goal: string }) {
  const session: Session = {
    id: crypto.randomUUID(),
    taskId: input.taskId,
    goal: input.goal.trim(),
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
  if (!state.session || !state.session.taskMarkedDone) {
    return { ok: false as const, reason: "Mark the ManageBac task done first." };
  }
  if (tokensEarned < 1) {
    return {
      ok: false as const,
      reason: state.session.demoMode
        ? "Stay focused for 30 seconds to earn your first token."
        : "Stay focused for 5 minutes to earn your first token.",
    };
  }

  const taskId = state.session.taskId;
  const timeTokens = tokensEarned;
  const completionTokens = COMPLETION_BONUS;
  const totalTokens = timeTokens + completionTokens;
  const endedAt = Date.now();
  const startedAt =
    state.session.focusStartedAt ?? state.session.lockedAt;
  const subjectId = TASK_SUBJECT[taskId];
  const subjectLabel =
    SUBJECTS.find((subject) => subject.id === subjectId)?.label ??
    getTask(taskId)?.subject ??
    "Other";
  const log: SessionLog = {
    id: state.session.id,
    kind: "verified",
    subjectId,
    subjectLabel,
    startedAt,
    endedAt,
    durationMs: Math.max(0, endedAt - startedAt),
    timeTokens,
    completionTokens,
    note: state.session.goal || undefined,
    taskId,
  };

  setState((current) => ({
    ...current,
    tokens: current.tokens + totalTokens,
    tasks: current.tasks.map((task) =>
      task.id === taskId ? { ...task, done: true } : task,
    ),
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

export function addManualSession(input: {
  subjectId: SubjectId;
  minutes: number;
  note: string;
}) {
  const minutes = Math.floor(input.minutes);
  if (!Number.isFinite(minutes) || minutes < 1) {
    return { ok: false as const, reason: "Enter at least 1 minute." };
  }
  const subject = SUBJECTS.find((row) => row.id === input.subjectId);
  if (!subject) {
    return { ok: false as const, reason: "Pick a subject." };
  }

  const durationMs = minutes * 60 * 1000;
  const timeTokens = tokensFromElapsed(durationMs, false);
  const endedAt = Date.now();
  const log: SessionLog = {
    id: crypto.randomUUID(),
    kind: "manual",
    subjectId: subject.id,
    subjectLabel: subject.label,
    startedAt: endedAt - durationMs,
    endedAt,
    durationMs,
    timeTokens,
    completionTokens: 0,
    note: input.note.trim() || undefined,
  };

  setState((current) => ({
    ...current,
    tokens: current.tokens + timeTokens,
    logs: [...current.logs, log],
  }));

  return { ok: true as const, timeTokens, log };
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
