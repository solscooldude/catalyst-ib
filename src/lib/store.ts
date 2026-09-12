"use client";

import { useSyncExternalStore } from "react";
import {
  DEMO_TOKEN_MS,
  DEMO_UNLOCK_MS,
  MOCK_TASKS,
  NEMESIS_APPS,
  REAL_TOKEN_MS,
  REAL_UNLOCK_MS,
  STORAGE_KEY,
  UNLOCK_CATALOG,
  type NemesisId,
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
};

type Listener = () => void;

let state: CatalystState = defaultState;
const listeners = new Set<Listener>();

function emit() {
  listeners.forEach((listener) => listener());
}

function persist(next: CatalystState) {
  if (typeof window === "undefined") return;
  const { hydrated, ...rest } = next;
  void hydrated;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(rest));
}

function setState(updater: (current: CatalystState) => CatalystState) {
  state = updater(state);
  persist(state);
  emit();
}

function pruneUnlocks(unlocks: Unlock[], now = Date.now()) {
  return unlocks.filter((unlock) => unlock.expiresAt > now);
}

export function hydrateStore() {
  if (typeof window === "undefined") return;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
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
      unlocks: pruneUnlocks(parsed.unlocks ?? []),
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
  setState((current) => ({
    ...current,
    tokens: current.tokens + tokensEarned,
    tasks: current.tasks.map((task) =>
      task.id === taskId ? { ...task, done: true } : task,
    ),
    session: current.session
      ? {
          ...current.session,
          status: "completed",
          completedAt: Date.now(),
          tokensEarned,
        }
      : null,
  }));
  return { ok: true as const };
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

  const unlock: Unlock = {
    id: crypto.randomUUID(),
    catalogId,
    label,
    cost: item.cost,
    startedAt: now,
    expiresAt: now + duration,
  };

  setState((current) => ({
    ...current,
    tokens: current.tokens - item.cost,
    unlocks: pruneUnlocks([...current.unlocks, unlock], now),
  }));

  return { ok: true as const, unlock };
}

export function resetDemo() {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(STORAGE_KEY);
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
  return unlocks.some(
    (unlock) => unlock.catalogId === catalogId && unlock.expiresAt > now,
  );
}
