use client";

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
import { setUiTheme } from "@/lib/ui-theme";
import {
  pickPersistedSpriteName,
  readDeviceSpriteName,
  writeDeviceSpriteName,
} from "@/lib/sprite-name-persist";
import {
  MOCK_TASKS,
  NEMESIS_APPS,
  STORAGE_KEY,
  TASK_SUBJECT,
  getUnlockItem,
  isEssentialAppId,
  isNemesisId,
  isNemesisOnlyId,
  isUnlockCatalogId,
  isUnlockSpendId,
  isUnlockTierSpendId,
  type NemesisId,
  type SubjectId,
  type TaskId,
  type UnlockSpendId,
} from "@/lib/constants";
import { clampDailyGoalMinutes, DEFAULT_DAILY_GOAL_MINUTES } from "@/lib/daily-goal";
import { normalizeHostList } from "@/lib/domain-policy";
import {
  assignUniqueFriendCode,
  normalizeFriendRequests,
  normalizeFriends,
  publishFriendDirectory,
  type Friend,
  type FriendRequest,
} from "@/lib/friends";
import {
  displayAvatar,
  makeFriendCode,
  normalizeAvatar,
  normalizeAvatarUrl,
  normalizeUsername,
} from "@/lib/identity";
import {
  extractCloudSnapshot,
  type CloudSnapshot,
} from "@/lib/cloud-state";
import {
  normalizeSchoolTasks,
  type SchoolTask,
} from "@/lib/school-tasks";
import {
  normalizeSchoolProvider,
  type SchoolProvider,
} from "@/lib/school-provider";
import {
  defaultMotivation,
  defaultProfile,
  normalizeMotivation,
  normalizeProfile,
  type MotivationState,
  type ProfileState,
} from "@/lib/ib";
import {
  normalizePlannerEvents,
  normalizePlannerTodos,
  type PlannerEvent,
  type PlannerTodo,
} from "@/lib/planner";
import { normalizeSchedule, type LockWindow } from "@/lib/schedule";
import { sparkEvolutionFromState, weeklyStudyMinutes, type CareStage } from "@/lib/stats";
import {
  DEFAULT_SPECIES,
  normalizeSpriteSpecies,
  type SpriteSpeciesId,
} from "@/lib/sprite-species";
import {
  DEFAULT_STUDY_STYLE,
  normalizeStudyStyle,
  studyStyleResult,
  type StudyStyleId,
} from "@/lib/study-style";
import {
  EGG_FEEDS_TO_HATCH,
  normalizeEggFeeds,
  normalizePendingStreakAward,
  normalizeStreakAwardsShown,
  resolveSpriteHatched,
  type StreakAward,
} from "@/lib/care";

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
  catalogId: UnlockSpendId;
  label: string;
  cost: number;
  startedAt: number;
  expiresAt: number;
};

export type CatalystState = {
  hydrated: boolean;
  setupComplete: boolean;
  nemeses: NemesisId[];
  schoolProvider: SchoolProvider | null;
  manageBacConnected: boolean;
  manageBacSchoolUrl: string;
  manageBacIcsUrl: string;
  manageBacMode: "import" | "sample" | "scan" | "ics" | "manual" | null;
  classroomConnected: boolean;
  classroomEmail: string;
  classroomMode: "oauth" | "sample" | null;
  demoMode: boolean;
  tokens: number;
  tasks: TaskState[];
  schoolTasks: SchoolTask[];
  session: Session | null;
  unlocks: Unlock[];
  logs: SessionLog[];
  appearance: AppearanceState;
  profile: ProfileState;
  motivation: MotivationState;
  schedule: LockWindow[];
  lastLoginDay: string | null;
  streakDays: number;
  streakAwardsShown: string[];
  pendingStreakAward: StreakAward | null;
  feedDay: string | null;
  feedCount: number;
  eggFeeds: number;
  quizDay: string | null;
  quizCorrect: number;
  spriteName: string;
  spriteRenameCount: number;
  spriteAsleep: boolean;
  dailyGoalMinutes: number;
  dailyGoalSetDay: string | null;
  dailyGoalClaimedDay: string | null;
  spriteHatched: boolean;
  spriteSpecies: SpriteSpeciesId;
  studyStyle: StudyStyleId;
  spriteShapeChangeCount: number;
  extraMagical: boolean;
  petQuizComplete: boolean;
  careStage: CareStage;
  careActions: number;
  hatchBurstAt: number | null;
  introSeen: boolean;
  username: string;
  avatarDataUrl: string | null;
  avatarUrl: string | null;
  soundMuted: boolean;
  friendCode: string;
  allowlistExtra: string[];
  friends: Friend[];
  incomingRequests: FriendRequest[];
  outgoingRequests: FriendRequest[];
  plannerTodos: PlannerTodo[];
  plannerEvents: PlannerEvent[];
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
    schoolProvider: null,
    manageBacConnected: false,
    manageBacSchoolUrl: "",
    manageBacIcsUrl: "",
    manageBacMode: null,
    classroomConnected: false,
    classroomEmail: "",
    classroomMode: null,
    demoMode: false,
    tokens: 0,
    tasks: defaultTasks.map((task) => ({ ...task })),
    schoolTasks: [],
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
    streakAwardsShown: [],
    pendingStreakAward: null,
    feedDay: null,
    feedCount: 0,
    eggFeeds: 0,
    quizDay: null,
    quizCorrect: 0,
    spriteName: "Sprite",
    spriteRenameCount: 0,
    spriteAsleep: false,
    dailyGoalMinutes: DEFAULT_DAILY_GOAL_MINUTES,
    dailyGoalSetDay: null,
    dailyGoalClaimedDay: null,
    spriteHatched: false,
    spriteSpecies: DEFAULT_SPECIES,
    studyStyle: DEFAULT_STUDY_STYLE,
    spriteShapeChangeCount: 0,
    extraMagical: false,
    petQuizComplete: false,
    careStage: "egg",
    careActions: 0,
    hatchBurstAt: null,
    introSeen: false,
    username: "",
    avatarDataUrl: null,
    avatarUrl: null,
    soundMuted: false,
    friendCode: makeFriendCode(),
    allowlistExtra: [],
    friends: [],
    incomingRequests: [],
    outgoingRequests: [],
    plannerTodos: [],
    plannerEvents: [],
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
  writeDeviceSpriteName(next.spriteName);
  const userId = storageAccountId ?? sessionAccountId();
  if (!userId) return;
  storageAccountId = userId;
  const { hydrated, ...rest } = next;
  void hydrated;
  window.localStorage.setItem(accountStorageKey(userId), JSON.stringify(rest));
  writeCloset(userId, next.appearance);
  writeDeviceFocusStage(next.appearance.focusTheme);
  publishFriendDirectory({
    code: next.friendCode,
    name: next.username,
    avatarUrl: displayAvatar(next.avatarDataUrl, next.avatarUrl),
    weeklyStudyMinutes: weeklyStudyMinutes(next.logs),
    tokens: next.tokens,
    streakDays: next.streakDays,
  });
}

function withGrowth(next: CatalystState): CatalystState {
  const careStage = sparkEvolutionFromState(next).stage;
  return next.careStage === careStage ? next : { ...next, careStage };
}

export function setState(updater: (current: CatalystState) => CatalystState) {
  state = withGrowth(updater(state));
  persist(state);
  emit();
}

export function setSpriteAsleep(asleep: boolean) {
  setState((current) =>
    current.spriteAsleep === asleep ? current : { ...current, spriteAsleep: asleep },
  );
}

export function setExtraMagical(on: boolean) {
  setState((current) =>
    current.extraMagical === on ? current : { ...current, extraMagical: on },
  );
}

export function setSpriteSpecies(species: SpriteSpeciesId) {
  setState((current) =>
    current.spriteSpecies === species
      ? current
      : { ...current, spriteSpecies: species },
  );
}

export const SHAPE_CHANGE_COST = 15;

export function changeSpriteShape(shape: SpriteSpeciesId) {
  const current = state;
  if (current.spriteSpecies === shape) {
    return { ok: true as const, cost: 0, first: false };
  }
  const first = current.spriteShapeChangeCount === 0;
  const cost = first ? 0 : SHAPE_CHANGE_COST;
  if (!first && current.tokens < cost) {
    return { ok: false as const, reason: `Need ${cost} tokens to change shape.` };
  }
  setState((next) => ({
    ...next,
    spriteSpecies: shape,
    spriteShapeChangeCount: next.spriteShapeChangeCount + 1,
    tokens: first ? next.tokens : next.tokens - cost,
  }));
  return { ok: true as const, cost, first };
}

export function completePetQuiz(
  style: StudyStyleId,
  opts?: { applyGlow?: boolean; applyShape?: boolean },
) {
  const result = studyStyleResult(style);
  const applyGlow = opts?.applyGlow !== false;
  const applyShape = opts?.applyShape !== false;
  setState((current) => ({
    ...current,
    studyStyle: result.id,
    petQuizComplete: true,
    spriteSpecies: applyShape ? result.species : current.spriteSpecies,
    appearance: applyGlow
      ? normalizeAppearance({
          ...current.appearance,
          ownedAuras: [...current.appearance.ownedAuras, result.aura],
          aura: result.aura,
        })
      : current.appearance,
  }));
}

function pruneUnlocks(unlocks: Unlock[], now = Date.now()) {
  return unlocks.filter((unlock) => unlock.expiresAt > now);
}

export function coalesceUnlocks(unlocks: Unlock[], now = Date.now()) {
  const byCatalog = new Map<UnlockSpendId, Unlock>();
  for (const unlock of pruneUnlocks(unlocks, now)) {
    if (!isUnlockSpendId(unlock.catalogId)) continue;
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

type RawUnlock = {
  id?: string;
  catalogId?: string;
  label?: string;
  cost?: number;
  startedAt?: number;
  expiresAt?: number;
};

export function normalizeUnlocks(
  unlocks: RawUnlock[] | Unlock[] | undefined,
  _nemeses: readonly NemesisId[] = [],
  now = Date.now(),
): Unlock[] {
  const migrated: Unlock[] = [];
  for (const unlock of unlocks ?? []) {
    const catalogId = unlock.catalogId;
    if (!catalogId || catalogId === "notes") continue;
    if (catalogId === "nemesis") {
      migrated.push({
        id: unlock.id ?? "nemesis",
        catalogId: "nemesis",
        label: unlock.label ?? "Nemesis apps",
        cost: unlock.cost ?? 0,
        startedAt: unlock.startedAt ?? now,
        expiresAt: unlock.expiresAt ?? now,
      });
      continue;
    }
    if (isUnlockTierSpendId(catalogId)) {
      migrated.push({
        id: unlock.id ?? catalogId,
        catalogId,
        label: unlock.label ?? (catalogId === "tier2" ? "Tier 2" : "Tier 3"),
        cost: unlock.cost ?? 0,
        startedAt: unlock.startedAt ?? now,
        expiresAt: unlock.expiresAt ?? now,
      });
      continue;
    }
    if (!isUnlockCatalogId(catalogId)) continue;
    const item = getUnlockItem(catalogId);
    migrated.push({
      id: unlock.id ?? catalogId,
      catalogId,
      label: unlock.label ?? item?.name ?? catalogId,
      cost: unlock.cost ?? item?.cost ?? 0,
      startedAt: unlock.startedAt ?? now,
      expiresAt: unlock.expiresAt ?? now,
    });
  }
  return coalesceUnlocks(migrated, now);
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
      demoMode: false,
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
    subjectId: TASK_SUBJECT[taskId] ?? "other",
    title: task?.title ?? "Focus session",
    demoMode: false,
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
    state = {
      ...createDefaultState(),
      spriteName: pickPersistedSpriteName(undefined, readDeviceSpriteName()),
      hydrated: true,
    };
    emit();
    return;
  }
  try {
    const raw = window.localStorage.getItem(accountStorageKey(id));
    if (!raw) {
      const fresh = createDefaultState();
      state = {
        ...fresh,
        appearance: mergeAppearance(undefined, id),
        spriteName: pickPersistedSpriteName(undefined, readDeviceSpriteName()),
        friendCode: assignUniqueFriendCode(fresh.friendCode, id),
        hydrated: true,
      };
      persist(state);
      emit();
      return;
    }
    const parsed = JSON.parse(raw) as Partial<CatalystState> & {
      nemesis?: NemesisId | null;
    };
    const appearance = mergeAppearance(parsed.appearance, id);
    const streakAwardsShown = normalizeStreakAwardsShown(
      parsed.streakAwardsShown,
      [...appearance.ownedGear, ...appearance.ownedTrails],
    );
    const pendingStreakAward = (() => {
      const pending = normalizePendingStreakAward(parsed.pendingStreakAward);
      return pending && streakAwardsShown.includes(pending.id) ? null : pending;
    })();
    state = {
      ...createDefaultState(),
      ...parsed,
      nemeses: normalizeNemeses(parsed),
      tasks:
        parsed.tasks && parsed.tasks.length === defaultTasks.length
          ? parsed.tasks
          : defaultTasks.map((task) => ({ ...task })),
      unlocks: normalizeUnlocks(parsed.unlocks ?? [], normalizeNemeses(parsed)),
      logs: parsed.logs ?? [],
      appearance,
      profile: normalizeProfile(parsed.profile),
      motivation: normalizeMotivation(parsed.motivation),
      schedule: normalizeSchedule(parsed.schedule),
      session: normalizeSession(parsed.session ?? null),
      lastLoginDay: parsed.lastLoginDay ?? null,
      streakDays: parsed.streakDays ?? 0,
      streakAwardsShown,
      pendingStreakAward,
      feedDay: parsed.feedDay ?? null,
      feedCount: parsed.feedCount ?? 0,
      eggFeeds: normalizeEggFeeds(parsed),
      quizDay: parsed.quizDay ?? null,
      quizCorrect: parsed.quizCorrect ?? 0,
      spriteName: pickPersistedSpriteName(
        parsed.spriteName,
        readDeviceSpriteName(),
      ),
      spriteRenameCount: parsed.spriteRenameCount ?? 0,
      spriteAsleep: Boolean(parsed.spriteAsleep),
      dailyGoalMinutes: clampDailyGoalMinutes(parsed.dailyGoalMinutes),
      dailyGoalSetDay:
        typeof parsed.dailyGoalSetDay === "string" ? parsed.dailyGoalSetDay : null,
      dailyGoalClaimedDay:
        typeof parsed.dailyGoalClaimedDay === "string"
          ? parsed.dailyGoalClaimedDay
          : null,
      spriteHatched: resolveSpriteHatched(parsed),
      spriteSpecies: normalizeSpriteSpecies(parsed.spriteSpecies),
      studyStyle: normalizeStudyStyle(
        (parsed as { studyStyle?: string }).studyStyle ?? parsed.spriteSpecies,
      ),
      spriteShapeChangeCount: Math.max(
        0,
        Number((parsed as { spriteShapeChangeCount?: number }).spriteShapeChangeCount ?? 0) || 0,
      ),
      extraMagical: Boolean(parsed.extraMagical),
      petQuizComplete: Boolean(parsed.petQuizComplete),
      careActions:
        typeof parsed.careActions === "number"
          ? Math.max(0, parsed.careActions)
          : 0,
      hatchBurstAt: null,
      introSeen: Boolean(parsed.introSeen),
      username: normalizeUsername(parsed.username),
      avatarDataUrl: normalizeAvatar(parsed.avatarDataUrl),
      avatarUrl: normalizeAvatarUrl(parsed.avatarUrl),
      soundMuted: Boolean(parsed.soundMuted),
      friendCode: assignUniqueFriendCode(String(parsed.friendCode ?? ""), id),
      allowlistExtra: normalizeHostList(parsed.allowlistExtra),
      friends: normalizeFriends(parsed.friends),
      incomingRequests: normalizeFriendRequests(
        (parsed as { incomingRequests?: unknown }).incomingRequests,
      ).filter((row) => row.direction === "in"),
      outgoingRequests: normalizeFriendRequests(
        (parsed as { outgoingRequests?: unknown }).outgoingRequests,
      ).map((row) => ({ ...row, direction: "out" as const })),
      schoolTasks: normalizeSchoolTasks(parsed.schoolTasks),
      schoolProvider: normalizeSchoolProvider(parsed.schoolProvider),
      manageBacIcsUrl:
        typeof parsed.manageBacIcsUrl === "string"
          ? parsed.manageBacIcsUrl.slice(0, 240)
          : "",
      manageBacSchoolUrl:
        typeof parsed.manageBacSchoolUrl === "string"
          ? parsed.manageBacSchoolUrl.slice(0, 160)
          : "",
      manageBacMode:
        parsed.manageBacMode === "import" ||
        parsed.manageBacMode === "sample" ||
        parsed.manageBacMode === "scan" ||
        parsed.manageBacMode === "ics" ||
        parsed.manageBacMode === "manual"
          ? parsed.manageBacMode
          : null,
      classroomConnected: Boolean(parsed.classroomConnected),
      classroomEmail:
        typeof parsed.classroomEmail === "string"
          ? parsed.classroomEmail.slice(0, 80)
          : "",
      classroomMode:
        parsed.classroomMode === "oauth" || parsed.classroomMode === "sample"
          ? parsed.classroomMode
          : null,
      plannerTodos: normalizePlannerTodos(parsed.plannerTodos),
      plannerEvents: normalizePlannerEvents(parsed.plannerEvents),
      demoMode: false,
      hydrated: true,
    };
    state = withGrowth(state);
  } catch {
    const fresh = createDefaultState();
    state = {
      ...fresh,
      appearance: mergeAppearance(undefined, id),
      friendCode: assignUniqueFriendCode(fresh.friendCode, id),
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

export function applyCloudSnapshot(snapshot: CloudSnapshot) {
  setState((current) => ({
    ...current,
    username: snapshot.username || current.username,
    avatarUrl: snapshot.avatarUrl,
    avatarDataUrl: snapshot.avatarUrl ? null : current.avatarDataUrl,
    tokens: snapshot.tokens,
    schedule: normalizeSchedule(snapshot.schedule),
    nemeses: snapshot.nemeses,
    allowlistExtra: snapshot.allowlistExtra,
    unlocks: normalizeUnlocks(snapshot.unlocks, snapshot.nemeses),
    appearance: mergeAppearance(snapshot.appearance, storageAccountId),
    spriteName: snapshot.spriteName,
    spriteRenameCount: snapshot.spriteRenameCount,
    spriteAsleep: snapshot.spriteAsleep,
    spriteHatched: Boolean(snapshot.spriteHatched || current.spriteHatched),
    eggFeeds: Math.max(
      snapshot.eggFeeds ?? 0,
      current.eggFeeds ?? 0,
      snapshot.spriteHatched || current.spriteHatched ? EGG_FEEDS_TO_HATCH : 0,
    ),
    spriteSpecies: snapshot.spriteSpecies ?? current.spriteSpecies,
    studyStyle: snapshot.studyStyle ?? current.studyStyle,
    spriteShapeChangeCount:
      snapshot.spriteShapeChangeCount ?? current.spriteShapeChangeCount,
    extraMagical: Boolean(snapshot.extraMagical),
    petQuizComplete: Boolean(snapshot.petQuizComplete),
    careStage: snapshot.careStage,
    careActions: snapshot.careActions,
    dailyGoalMinutes: snapshot.dailyGoalMinutes,
    dailyGoalSetDay: snapshot.dailyGoalSetDay,
    dailyGoalClaimedDay: snapshot.dailyGoalClaimedDay,
    friendCode: assignUniqueFriendCode(
      snapshot.friendCode || current.friendCode,
    ),
    friends: snapshot.friends ?? current.friends,
    incomingRequests: snapshot.incomingRequests ?? current.incomingRequests,
    outgoingRequests: snapshot.outgoingRequests ?? current.outgoingRequests,
    setupComplete: snapshot.setupComplete,
    introSeen: snapshot.introSeen,
    profile: snapshot.profile,
    lastLoginDay: snapshot.lastLoginDay,
    streakDays: snapshot.streakDays,
    streakAwardsShown: normalizeStreakAwardsShown(
      [...current.streakAwardsShown, ...snapshot.streakAwardsShown],
      [
        ...snapshot.appearance.ownedGear,
        ...snapshot.appearance.ownedTrails,
        ...current.appearance.ownedGear,
        ...current.appearance.ownedTrails,
      ],
    ),
    pendingStreakAward: (() => {
      const pending =
        snapshot.pendingStreakAward ?? current.pendingStreakAward;
      const shown = normalizeStreakAwardsShown(
        [...current.streakAwardsShown, ...snapshot.streakAwardsShown],
        [],
      );
      return pending && shown.includes(pending.id) ? null : pending;
    })(),
    demoMode: false,
    hydrated: true,
  }));
}

export function exportCloudSnapshot(now = Date.now()) {
  const current = getSnapshot();
  return extractCloudSnapshot(
    {
      ...current,
      weeklyStudyMinutes: weeklyStudyMinutes(current.logs),
    },
    now,
  );
}

export function readLegacyLocalSnapshots(): CloudSnapshot[] {
  if (typeof window === "undefined") return [];
  const found: CloudSnapshot[] = [];
  try {
    const keys = Object.keys(window.localStorage);
    for (const key of keys) {
      if (key !== STORAGE_KEY && !key.startsWith(`${STORAGE_KEY}:user:`)) {
        continue;
      }
      const raw = window.localStorage.getItem(key);
      if (!raw) continue;
      const parsed = JSON.parse(raw) as CloudSourceLike;
      found.push(extractCloudSnapshot(parsed));
    }
  } catch {
    /* private mode */
  }
  return found;
}

type CloudSourceLike = Parameters<typeof extractCloudSnapshot>[0];

export function pickLegacyLocalSnapshot() {
  const current = extractCloudSnapshot(getSnapshot());
  const extras = readLegacyLocalSnapshots();
  return [current, ...extras].sort((a, b) => {
    const score = (row: CloudSnapshot) =>
      row.tokens +
      row.schedule.length * 10 +
      row.nemeses.length * 4 +
      (row.setupComplete ? 20 : 0) +
      (row.username ? 5 : 0);
    return score(b) - score(a);
  })[0];
}

export function resetDemo() {
  const userId = storageAccountId ?? sessionAccountId();
  if (typeof window !== "undefined" && userId) {
    window.localStorage.removeItem(accountStorageKey(userId));
    clearCloset(userId);
  }
  state = { ...createDefaultState(), hydrated: true };
  persist(state);
  setUiTheme("dark");
  emit();
}

export function getTask(id: TaskId) {
  return (
    state.schoolTasks.find((task) => task.id === id) ??
    MOCK_TASKS.find((task) => task.id === id)
  );
}

export function getNemesis(id: NemesisId | null) {
  return NEMESIS_APPS.find((app) => app.id === id);
}

export function getNemeses(ids: readonly NemesisId[]) {
  return NEMESIS_APPS.filter((app) => ids.includes(app.id));
}

export function isUnlockActive(
  unlocks: Unlock[],
  catalogId: UnlockSpendId,
  now = Date.now(),
) {
  return coalesceUnlocks(unlocks, now).some(
    (unlock) => unlock.catalogId === catalogId,
  );
}

export function isAppUnlocked(
  unlocks: Unlock[],
  appId: string,
  now = Date.now(),
  nemeses: readonly NemesisId[] = state.nemeses,
) {
  if (isEssentialAppId(appId)) return true;
  if (isNemesisId(appId) && nemeses.includes(appId)) {
    return (
      isUnlockActive(unlocks, "nemesis", now) ||
      isUnlockActive(unlocks, appId, now)
    );
  }
  if (isNemesisOnlyId(appId)) return true;
  if (!isUnlockCatalogId(appId)) return false;
  const item = getUnlockItem(appId);
  if (!item) return false;
  const tierId = item.tier === 2 ? "tier2" : "tier3";
  return isUnlockActive(unlocks, appId, now) || isUnlockActive(unlocks, tierId, now);
}
