import { normalizeAppearance, type AppearanceState } from "@/lib/appearance";
import {
  normalizeEggFeeds,
  normalizePendingStreakAward,
  normalizeStreakAwardsShown,
  resolveSpriteHatched,
  type StreakAward,
} from "@/lib/care";
import { clampDailyGoalMinutes } from "@/lib/daily-goal";
import { normalizeHostList } from "@/lib/domain-policy";
import {
  normalizeFriendCode,
  normalizeFriendRequests,
  normalizeFriends,
  type Friend,
  type FriendRequest,
} from "@/lib/friends";
import { normalizeAvatarUrl, normalizeUsername } from "@/lib/identity";
import { normalizeProfile, type ProfileState } from "@/lib/ib";
import { normalizeSchedule, type LockWindow } from "@/lib/schedule";
import { isNemesisId, type NemesisId } from "@/lib/constants";
import { normalizeCareStage, type CareStage } from "@/lib/stats";
import {
  DEFAULT_SPECIES,
  normalizeSpriteSpecies,
  type SpriteSpeciesId,
} from "@/lib/sprite-species";
import {
  DEFAULT_STUDY_STYLE,
  normalizeStudyStyle,
  type StudyStyleId,
} from "@/lib/study-style";

export const CLOUD_STATE_VERSION = 1;

export type CloudUnlock = {
  id: string;
  catalogId: string;
  label: string;
  cost: number;
  startedAt: number;
  expiresAt: number;
};

export type CloudCareStage = CareStage;

export type CloudSnapshot = {
  v: typeof CLOUD_STATE_VERSION;
  updatedAt: number;
  username: string;
  avatarUrl: string | null;
  tokens: number;
  schedule: LockWindow[];
  nemeses: NemesisId[];
  allowlistExtra: string[];
  unlocks: CloudUnlock[];
  appearance: AppearanceState;
  spriteName: string;
  spriteRenameCount: number;
  spriteAsleep: boolean;
  spriteHatched: boolean;
  eggFeeds: number;
  spriteSpecies: SpriteSpeciesId;
  studyStyle: StudyStyleId;
  spriteShapeChangeCount: number;
  extraMagical: boolean;
  petQuizComplete: boolean;
  careStage: CloudCareStage;
  careActions: number;
  dailyGoalMinutes: number;
  dailyGoalSetDay: string | null;
  dailyGoalClaimedDay: string | null;
  friendCode: string;
  friends?: Friend[];
  incomingRequests?: FriendRequest[];
  outgoingRequests?: FriendRequest[];
  weeklyStudyMinutes: number;
  setupComplete: boolean;
  introSeen: boolean;
  profile: ProfileState;
  lastLoginDay: string | null;
  streakDays: number;
  streakAwardsShown: string[];
  pendingStreakAward: StreakAward | null;
  demoMode: boolean;
};

export type CloudSource = {
  username?: string;
  avatarUrl?: string | null;
  avatarDataUrl?: string | null;
  tokens?: number;
  schedule?: unknown;
  nemeses?: unknown;
  allowlistExtra?: unknown;
  unlocks?: unknown;
  appearance?: unknown;
  spriteName?: string;
  spriteRenameCount?: number;
  spriteAsleep?: boolean;
  spriteHatched?: boolean;
  eggFeeds?: number;
  feedCount?: number;
  feedDay?: string | null;
  spriteSpecies?: string;
  studyStyle?: string;
  spriteShapeChangeCount?: number;
  extraMagical?: boolean;
  petQuizComplete?: boolean;
  careStage?: string;
  careActions?: number;
  dailyGoalMinutes?: number;
  dailyGoalSetDay?: string | null;
  dailyGoalClaimedDay?: string | null;
  friendCode?: string;
  friends?: unknown;
  incomingRequests?: unknown;
  outgoingRequests?: unknown;
  weeklyStudyMinutes?: number;
  setupComplete?: boolean;
  introSeen?: boolean;
  profile?: unknown;
  lastLoginDay?: string | null;
  streakDays?: number;
  streakAwardsShown?: unknown;
  pendingStreakAward?: unknown;
  demoMode?: boolean;
};

function asUnlocks(raw: unknown): CloudUnlock[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((row) => {
      if (!row || typeof row !== "object") return null;
      const item = row as Record<string, unknown>;
      const catalogId = String(item.catalogId ?? "");
      const expiresAt = Number(item.expiresAt ?? 0);
      if (!catalogId || !Number.isFinite(expiresAt)) return null;
      return {
        id: String(item.id ?? catalogId),
        catalogId,
        label: String(item.label ?? catalogId),
        cost: Number(item.cost ?? 0) || 0,
        startedAt: Number(item.startedAt ?? Date.now()) || Date.now(),
        expiresAt,
      };
    })
    .filter((row): row is CloudUnlock => Boolean(row))
    .slice(0, 24);
}

export function extractCloudSnapshot(
  raw: CloudSource,
  now = Date.now(),
): CloudSnapshot {
  const nemeses = [...new Set((Array.isArray(raw.nemeses) ? raw.nemeses : []).filter(isNemesisId))];
  const appearance = normalizeAppearance(
    raw.appearance as AppearanceState | undefined,
  );
  return {
    v: CLOUD_STATE_VERSION,
    updatedAt: now,
    username: normalizeUsername(raw.username),
    avatarUrl: normalizeAvatarUrl(raw.avatarUrl),
    tokens: Math.max(0, Math.floor(Number(raw.tokens ?? 0) || 0)),
    schedule: normalizeSchedule(raw.schedule),
    nemeses,
    allowlistExtra: normalizeHostList(raw.allowlistExtra),
    unlocks: asUnlocks(raw.unlocks),
    appearance,
    spriteName: String(raw.spriteName ?? "Sprite").slice(0, 24) || "Sprite",
    spriteRenameCount: Math.max(0, Number(raw.spriteRenameCount ?? 0) || 0),
    spriteAsleep: Boolean(raw.spriteAsleep),
    spriteHatched: resolveSpriteHatched(raw),
    eggFeeds: normalizeEggFeeds(raw),
    spriteSpecies: normalizeSpriteSpecies(raw.spriteSpecies ?? DEFAULT_SPECIES),
    studyStyle: normalizeStudyStyle(
      raw.studyStyle ?? raw.spriteSpecies ?? DEFAULT_STUDY_STYLE,
    ),
    spriteShapeChangeCount: Math.max(
      0,
      Number(raw.spriteShapeChangeCount ?? 0) || 0,
    ),
    extraMagical: Boolean(raw.extraMagical),
    petQuizComplete: Boolean(raw.petQuizComplete),
    careStage: normalizeCareStage(raw.careStage),
    careActions: Math.max(0, Number(raw.careActions ?? 0) || 0),
    dailyGoalMinutes: clampDailyGoalMinutes(raw.dailyGoalMinutes),
    dailyGoalSetDay:
      typeof raw.dailyGoalSetDay === "string" ? raw.dailyGoalSetDay : null,
    dailyGoalClaimedDay:
      typeof raw.dailyGoalClaimedDay === "string" ? raw.dailyGoalClaimedDay : null,
    friendCode: normalizeFriendCode(String(raw.friendCode ?? "")),
    friends:
      raw.friends === undefined ? undefined : normalizeFriends(raw.friends),
    incomingRequests:
      raw.incomingRequests === undefined
        ? undefined
        : normalizeFriendRequests(raw.incomingRequests).filter(
            (row) => row.direction === "in",
          ),
    outgoingRequests:
      raw.outgoingRequests === undefined
        ? undefined
        : normalizeFriendRequests(raw.outgoingRequests).map((row) => ({
            ...row,
            direction: "out" as const,
          })),
    weeklyStudyMinutes: Math.max(0, Math.round(Number(raw.weeklyStudyMinutes ?? 0) || 0)),
    setupComplete: Boolean(raw.setupComplete),
    introSeen: Boolean(raw.introSeen),
    profile: normalizeProfile(raw.profile as ProfileState | undefined),
    lastLoginDay: typeof raw.lastLoginDay === "string" ? raw.lastLoginDay : null,
    streakDays: Math.max(0, Number(raw.streakDays ?? 0) || 0),
    streakAwardsShown: normalizeStreakAwardsShown(raw.streakAwardsShown, [
      ...appearance.ownedGear,
      ...appearance.ownedTrails,
    ]),
    pendingStreakAward: (() => {
      const pending = normalizePendingStreakAward(raw.pendingStreakAward);
      const shown = normalizeStreakAwardsShown(raw.streakAwardsShown, [
        ...appearance.ownedGear,
        ...appearance.ownedTrails,
      ]);
      return pending && shown.includes(pending.id) ? null : pending;
    })(),
    demoMode: false,
  };
}

export function isCloudEmpty(snapshot: CloudSnapshot | null | undefined) {
  if (!snapshot) return true;
  return (
    snapshot.tokens === 0 &&
    snapshot.schedule.length === 0 &&
    snapshot.nemeses.length === 0 &&
    snapshot.allowlistExtra.length === 0 &&
    snapshot.unlocks.length === 0 &&
    !snapshot.username &&
    !snapshot.setupComplete &&
    !snapshot.introSeen &&
    snapshot.careActions === 0 &&
    !snapshot.spriteHatched
  );
}

export function isLocalWorthMigrating(raw: CloudSource | null | undefined) {
  if (!raw) return false;
  const snapshot = extractCloudSnapshot(raw);
  return !isCloudEmpty(snapshot);
}

function withoutLocalAvatars<T extends { avatarUrl: string | null }>(
  rows: T[] | undefined,
) {
  if (!rows) return rows;
  return rows.map((row) => ({
    ...row,
    avatarUrl:
      row.avatarUrl && /^https:\/\//i.test(row.avatarUrl) ? row.avatarUrl : null,
  }));
}

export function compactCloudSnapshot(snapshot: CloudSnapshot) {
  const stripped = {
    ...snapshot,
    friends: withoutLocalAvatars(snapshot.friends),
    incomingRequests: withoutLocalAvatars(snapshot.incomingRequests),
    outgoingRequests: withoutLocalAvatars(snapshot.outgoingRequests),
  };
  const json = JSON.stringify(stripped);
  if (json.length <= 7500) return stripped;
  return {
    ...stripped,
    avatarUrl: null,
    appearance: normalizeAppearance({
      ...snapshot.appearance,
      ownedAccents: snapshot.appearance.ownedAccents.slice(0, 12),
      ownedBackgrounds: snapshot.appearance.ownedBackgrounds.slice(0, 12),
      ownedSparkTints: snapshot.appearance.ownedSparkTints.slice(0, 12),
      ownedGear: snapshot.appearance.ownedGear.slice(0, 16),
      ownedAuras: snapshot.appearance.ownedAuras.slice(0, 12),
      ownedTrails: snapshot.appearance.ownedTrails.slice(0, 8),
      ownedFocusThemes: snapshot.appearance.ownedFocusThemes.slice(0, 8),
    }),
  };
}
