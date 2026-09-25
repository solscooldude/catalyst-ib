export type SparkAct =
  | "boop"
  | "poke"
  | "scrunch"
  | "spin"
  | "tickle"
  | "wave"
  | "sleep"
  | "celebrate"
  | null;

export const SPARK_HOW_TO = [
  { name: "Pet", how: "Drag the sprite — it follows and jiggles." },
  { name: "Poke", how: "Tap a side — bigger squash." },
  { name: "Boop", how: "Tap the face." },
  { name: "Scrunch", how: "Drag the head or belly down to squash." },
  { name: "Spin", how: "Double-tap for a twirl." },
  { name: "Tickle", how: "Drag across the belly." },
  { name: "Mirror pose", how: "Wave beside the sprite — it flips to copy you." },
  { name: "Sleep", how: "Long-press to tuck in (closed eyes + zzz). Long-press again to wake." },
  { name: "Feed", how: "Drag a snack onto the sprite." },
  { name: "Equip", how: "Tap an owned look below. Buy the rest in Appearance." },
  { name: "Catch a token", how: "Tap the floating mint star." },
  { name: "Dodge minigame", how: "Play Avoid falling objects. Arrow keys or A/D." },
  { name: "Study buddy sit", how: "On Focus, sit the sprite beside the timer." },
] as const;

/** Moves that must visibly work on every hatched animal. */
export const SPRITE_STAGE_MOVES = [
  "Pet",
  "Poke",
  "Boop",
  "Scrunch",
  "Spin",
  "Tickle",
  "Mirror pose",
  "Sleep",
  "Feed",
] as const;

export type SnackId = "cookie" | "berry" | "mint";

export const SNACKS: { id: SnackId; label: string }[] = [
  { id: "cookie", label: "Cookie" },
  { id: "berry", label: "Berry" },
  { id: "mint", label: "Mint puff" },
];

export const CATCH_DAILY_LIMIT = 3;

/** Calm when a streak is on, proud after a long study day, sleepy if nothing logged. */
export function careMood(
  streakDays: number,
  todayMs: number,
): "idle" | "done" | "sleepy" {
  if (todayMs >= 90 * 60 * 1000 || streakDays >= 5) return "done";
  if (todayMs === 0 && streakDays === 0) return "sleepy";
  return "idle";
}

/**
 * Mini-game ideas only — do not ship UI yet:
 * - Memory / flip: match two mint cards for a tiny token.
 * - Streak balloon: tap rising balloons on a 7-day streak celebration.
 */
export type SparkZone = "peak" | "face" | "belly" | "body";

export function hitZone(
  x: number,
  y: number,
  width: number,
  height: number,
): SparkZone {
  const px = x / width;
  const py = y / height;
  if (py < 0.36 && px > 0.14 && px < 0.86) return "peak";
  if (py > 0.56 && py < 0.9 && px > 0.16 && px < 0.84) return "belly";
  if (py > 0.3 && py < 0.6 && px > 0.18 && px < 0.82) return "face";
  return "body";
}

export function isScrunchZone(zone: SparkZone) {
  return zone === "peak" || zone === "face" || zone === "belly";
}

export const DOUBLE_TAP_MS = 340;
export const TICKLE_DX = 36;
export const TICKLE_DY = 28;
export const WAVE_NEAR = 100;
export const WAVE_FLIP_MS = 900;

export function isTickleSwipe(dx: number, dy: number) {
  return Math.abs(dx) >= TICKLE_DX && Math.abs(dy) <= TICKLE_DY;
}

export const SPARK_GIFT_MIME = "application/x-catalyst-gift";

export type SparkGiftKind = "sparkTint" | "gear" | "aura" | "trail";

export function encodeSparkGift(kind: SparkGiftKind, id: string) {
  return JSON.stringify({ kind, id });
}

export function decodeSparkGift(
  raw: string | undefined,
): { kind: SparkGiftKind; id: string } | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as { kind?: string; id?: string };
    if (
      parsed.kind === "sparkTint" ||
      parsed.kind === "gear" ||
      parsed.kind === "aura" ||
      parsed.kind === "trail"
    ) {
      if (typeof parsed.id === "string" && parsed.id.length > 0) {
        return { kind: parsed.kind, id: parsed.id };
      }
    }
  } catch {
    return null;
  }
  return null;
}
