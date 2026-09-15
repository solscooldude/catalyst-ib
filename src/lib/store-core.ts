"use client";

import { useSyncExternalStore } from "react";
import {
  defaultAppearance,
  normalizeAppearance,
  type AppearanceState,
} from "@/lib/appearance";
import {
  clearCloset,
  mergeAppearance,
  sessionAccountId,
  writeCloset,
} from "@/lib/closet";
import { writeDeviceFocusStage } from "@/lib/focus-stage-persist";
import {
  MOCK_TASKS,
  NEMESIS_APPS,
  STORAGE_KEY,
  TASK_SUBJECT,
  isNemesisId,
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
  type MotivationState,
  type ProfileState,
} from "@/lib/ib";
import { normalizeSchedule, type LockWindow } from "@/lib/schedule";

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
  pausedAt: number | null;
  pauseAccumMs: number;
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
  nemeses: NemesisId[];
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
  lastLoginDay: string | null;
  streakDays: number;
  feedDay: string | null;
  feedCount: number;
  quizDay: string | null;
  quizCorrect: number;
  spriteName: string;
  spriteRenameCount: number;
};

const defaultTasks: TaskState[] = MOCK_TASKS.map((task) => ({
  id: task.id,
  done: false,
}));

export function createDefaultState(): CatalystState {
  return {
    hydrated: false,
    setupComplete: false,
    nemeses: [],
    manageBacConnected: false,
    demoMode: true,
    tokens: 0,
    tasks: defaultTasks.map((task) => ({ ...task })),
    session: null,
    unlocks: [],
    logs: [],
    appearance: normalizeAppearance(defaultAppearance),
    profile: {
      ...defaultProfile,
      subjects: [...defaultProfile.subjects],
      core: [...defaultProfile.core],
    },
    motivation: { ...defaultMotivation },
    schedule: [],
    lastLoginDay: null,
    streakDays: 0,
    feedDay: null,
    feedCount: 0,
    quizDay: null,
    quizCorrect: 0,
    spriteName: "Spark",
    spriteRenameCount: 0,
  };
}

export const defaultState: CatalystState = createDefaultState();

type Listener = () => void;

export let state: CatalystState = defaultState;
const listeners = new Set<Listener>();

function emit() {
  listeners.forEach((listener) => listener());
}

let storageAccountId: string | null = null;

export function accountStorageKey(userId: string) {
  return `${STORAGE_KEY}:user:${userId}`;
}

function persist(next: CatalystState) {
  if (typeof window === "undefined") return;
  const userId = storageAccountId ?? sessionAccountId();
  if (!userId) return;
  storageAccountId = userId;
  const { hydrated, ...rest } = next;
  void hydrated;
  window.localStorage.setItem(accountStorageKey(userId), JSON.stringify(rest));
  writeCloset(userId, next.appearance);
  writeDeviceFocusStage(next.appearance.focusTheme);
}

export function setState(updater: (current: CatalystState) => CatalystState) {
  state = updater(state);
  persist(state);
  emit();
}

function pruneUnlocks(unlocks: Unlock[], now = Date.now()) {
  return unlocks.filter((unlock) => unlock.expiresAt > now);
}

export function coalesceUnlocks(unlocks: Unlock[], now = Date.now()) {
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

function normalizeNemeses(
  raw: Partial<CatalystState> & { nemesis?: NemesisId | null },
): NemesisId[] {
  const fromList = (raw.nemeses ?? []).filter(isNemesisId);
  if (fromList.length > 0) return [...new Set(fromList)];
  if (raw.nemesis && isNemesisId(raw.nemesis)) return [raw.nemesis];
  return [];
}

function normalizeSession(raw: Session | (Session & { taskId: TaskId }) | null) {
  if (!raw) return null;
  if (raw.kind && raw.subjectId && raw.title) {
    return {
      ...raw,
      pausedAt: raw.pausedAt ?? null,
      pauseAccumMs: raw.pauseAccumMs ?? 0,
    };
  }
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
    pausedAt: legacy.pausedAt ?? null,
    pauseAccumMs: legacy.pauseAccumMs ?? 0,
  };
}

export function hydrateStore(userId: string | null = null) {
  if (typeof window === "undefined") return;
  const id = userId ?? sessionAccountId();
  storageAccountId = id;
  if (!id) {
    state = { ...createDefaultState(), hydrated: true };
    emit();
    return;
  }
  try {
    const raw = window.localStorage.getItem(accountStorageKey(id));
    if (!raw) {
      state = {
        ...createDefaultState(),
        appearance: mergeAppearance(undefined, id),
        hydrated: true,
      };
      persist(state);
      emit();
      return;
    }
    const parsed = JSON.parse(raw) as Partial<CatalystState> & {
      nemesis?: NemesisId | null;
    };
    state = {
      ...createDefaultState(),
      ...parsed,
      nemeses: normalizeNemeses(parsed),
      tasks:
        parsed.tasks && parsed.tasks.length === defaultTasks.length
          ? parsed.tasks
          : defaultTasks.map((task) => ({ ...task })),
      unlocks: coalesceUnlocks(parsed.unlocks ?? []),
      logs: parsed.logs ?? [],
      appearance: mergeAppearance(parsed.appearance, id),
      profile: normalizeProfile(parsed.profile),
      motivation: normalizeMotivation(parsed.motivation),
      schedule: normalizeSchedule(parsed.schedule),
      session: normalizeSession(parsed.session ?? null),
      lastLoginDay: parsed.lastLoginDay ?? null,
      streakDays: parsed.streakDays ?? 0,
      feedDay: parsed.feedDay ?? null,
      feedCount: parsed.feedCount ?? 0,
      quizDay: parsed.quizDay ?? null,
      quizCorrect: parsed.quizCorrect ?? 0,
      spriteName:
        /^flux$/i.test(parsed.spriteName ?? "")
          ? "Spark"
          : (parsed.spriteName ?? "Spark"),
      spriteRenameCount: parsed.spriteRenameCount ?? 0,
      hydrated: true,
    };
  } catch {
    state = {
      ...createDefaultState(),
      appearance: mergeAppearance(undefined, id),
      hydrated: true,
    };
  }
  persist(state);
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

export function resetDemo() {
  const userId = storageAccountId ?? sessionAccountId();
  if (typeof window !== "undefined" && userId) {
    window.localStorage.removeItem(accountStorageKey(userId));
    clearCloset(userId);
  }
  state = { ...createDefaultState(), hydrated: true };
  emit();
}

export function getTask(id: TaskId) {
  return MOCK_TASKS.find((task) => task.id === id);
}

export function getNemesis(id: NemesisId | null) {
  return NEMESIS_APPS.find((app) => app.id === id);
}

export function getNemeses(ids: readonly NemesisId[]) {
  return NEMESIS_APPS.filter((app) => ids.includes(app.id));
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
