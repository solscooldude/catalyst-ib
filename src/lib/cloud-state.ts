import { normalizeAppearance, type AppearanceState } from "@/lib/appearance";
import {
  normalizePendingStreakAward,
  normalizeStreakAwardsShown,
  type StreakAward,
} from "@/lib/care";
import { clampDailyGoalMinutes } from "@/lib/daily-goal";
import { normalizeHostList } from "@/lib/domain-policy";
import { normalizeFriendCode } from "@/lib/friends";
import { normalizeAvatarUrl, normalizeUsername } from "@/lib/identity";
import { normalizeProfile, type ProfileState } from "@/lib/ib";
import { normalizeSchedule, type LockWindow } from "@/lib/schedule";
import { isNemesisId, type NemesisId } from "@/lib/constants";
import { normalizeCareStage, type CareStage } from "@/lib/stats";
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
  studyStyle: StudyStyleId;
  extraMagical: boolean;
  petQuizComplete: boolean;
  careStage: CloudCareStage;
  careActions: number;
  dailyGoalMinutes: number;
  dailyGoalSetDay: string | null;
  dailyGoalClaimedDay: string | null;
  friendCode: string;
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
  studyStyle?: string;
  spriteSpecies?: string;
  extraMagical?: boolean;
  petQuizComplete?: boolean;
  careStage?: string;
  careActions?: number;
  dailyGoalMinutes?: number;
  dailyGoalSetDay?: string | null;
  dailyGoalClaimedDay?: string | null;
  friendCode?: string;
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
    spriteHatched: Boolean(raw.spriteHatched),
    studyStyle: normalizeStudyStyle(raw.studyStyle ?? raw.spriteSpecies ?? DEFAULT_STUDY_STYLE),
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

export function compactCloudSnapshot(snapshot: CloudSnapshot) {
  const json = JSON.stringify(snapshot);
  if (json.length <= 7500) return snapshot;
  return {
    ...snapshot,
    avatarUrl: null,
    appearance: normalizeAppearance({
      ...snapshot.appearance,
      ownedAccents: snapshot.appearance.ownedAccents.slice(0, 12),
      ownedBackgrounds: snapshot.appearance.ownedBackgrounds.slice(0, 12),
      ownedSparkTints: snapshot.appearance.ownedSparkTints.slice(0, 12),
      ownedGear: snapshot.appearance.ownedGear.slice(0, 16),
      ownedAuras: snapshot.appearance.ownedAuras.slice(0, 16),
      ownedTrails: snapshot.appearance.ownedTrails.slice(0, 8),
      ownedFocusThemes: snapshot.appearance.ownedFocusThemes.slice(0, 8),
    }),
  };
}
