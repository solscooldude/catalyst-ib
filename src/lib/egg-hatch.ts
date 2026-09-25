function calendarDay(now = new Date()) {
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

/** Snacks needed to leave Egg. Change this one number to retune the hatch. */
export const EGG_FEEDS_TO_HATCH = 3;

export type EggCrackLevel = 0 | 1 | 2;

export function clampEggFeeds(value: number) {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(EGG_FEEDS_TO_HATCH, Math.round(value)));
}

export function isEggReadyToHatch(feeds: number) {
  return feeds >= EGG_FEEDS_TO_HATCH;
}

/** Crack after 1/3 and 2/3 of the hatch constant so the look scales if the number changes. */
export function eggCrackLevel(feeds: number): EggCrackLevel {
  if (feeds <= 0) return 0;
  if (feeds >= EGG_FEEDS_TO_HATCH) return 2;
  const ratio = feeds / EGG_FEEDS_TO_HATCH;
  if (ratio >= 2 / 3) return 2;
  if (ratio >= 1 / 3) return 1;
  return 0;
}

export function hatchProgressLabel(feeds: number) {
  return `Hatching ${Math.min(clampEggFeeds(feeds), EGG_FEEDS_TO_HATCH)}/${EGG_FEEDS_TO_HATCH}`;
}

export function nextEggFeeds(currentFeeds: number, alreadyHatched: boolean) {
  const feeds = Number(currentFeeds) || 0;
  if (alreadyHatched) {
    return Math.max(clampEggFeeds(feeds), EGG_FEEDS_TO_HATCH);
  }
  return clampEggFeeds(feeds + 1);
}

type EggProgressSource = {
  eggFeeds?: unknown;
  spriteHatched?: unknown;
  feedCount?: unknown;
  feedDay?: unknown;
  logs?: unknown;
  careActions?: unknown;
  careStage?: unknown;
};

export function wasLegacyHatched(raw: EggProgressSource) {
  if (raw.spriteHatched) return true;
  if (Array.isArray(raw.logs) && raw.logs.length > 0) return true;
  if ((Number(raw.careActions) || 0) > 0) return true;
  const stage = typeof raw.careStage === "string" ? raw.careStage : "";
  return Boolean(stage) && stage !== "egg";
}

/** Persist hatch snacks across days. Missing field seeds from today's feed count. */
export function normalizeEggFeeds(raw: EggProgressSource, today = calendarDay()) {
  if (typeof raw.eggFeeds === "number" && Number.isFinite(raw.eggFeeds)) {
    return clampEggFeeds(raw.eggFeeds);
  }
  if (wasLegacyHatched(raw)) return EGG_FEEDS_TO_HATCH;
  const todayFeeds =
    raw.feedDay === today ? Math.max(0, Math.round(Number(raw.feedCount) || 0)) : 0;
  return clampEggFeeds(todayFeeds);
}

export function resolveSpriteHatched(raw: EggProgressSource, today = calendarDay()) {
  if (typeof raw.eggFeeds === "number" && Number.isFinite(raw.eggFeeds)) {
    return Boolean(raw.spriteHatched) || raw.eggFeeds >= EGG_FEEDS_TO_HATCH;
  }
  return wasLegacyHatched(raw) || normalizeEggFeeds(raw, today) >= EGG_FEEDS_TO_HATCH;
}
