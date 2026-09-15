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
  { name: "Pet", how: "Drag the sprite around." },
  { name: "Poke", how: "Tap a side — bigger squash." },
  { name: "Boop", how: "Tap the face." },
  { name: "Peak scrunch", how: "Drag the twin peaks." },
  { name: "Spin", how: "Double-tap for a twirl." },
  { name: "Tickle", how: "Drag across the belly." },
  { name: "Mirror pose", how: "Wave the cursor nearby — the sprite copies." },
  { name: "Sleep", how: "Long-press to tuck in. Long-press again to wake." },
  { name: "Feed", how: "Drag a snack onto the sprite." },
  { name: "Equip", how: "Tap an owned look below. Buy the rest in Appearance." },
  { name: "Catch a token", how: "Tap the floating mint star." },
  { name: "10s catch", how: "Play Token catch on My Sprite." },
  { name: "Study buddy sit", how: "On Focus, sit the sprite beside the timer." },
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
  if (py < 0.3 && px > 0.22 && px < 0.78) return "peak";
  if (py > 0.66 && py < 0.9 && px > 0.2 && px < 0.8) return "belly";
  if (py > 0.42 && py < 0.66 && px > 0.24 && px < 0.76) return "face";
  return "body";
}

export const DOUBLE_TAP_MS = 340;
export const TICKLE_DX = 36;
export const TICKLE_DY = 28;
export const WAVE_NEAR = 72;
export const WAVE_FLIP_MS = 560;

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
