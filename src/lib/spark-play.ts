export type SparkAct =
  | "boop"
  | "poke"
  | "scrunch"
  | "sleep"
  | "celebrate"
  | "highfive"
  | null;

export const SPARK_HOW_TO = [
  { name: "Pet", how: "Drag Spark around." },
  { name: "Poke", how: "Tap a side — bigger squash." },
  { name: "Boop", how: "Tap the face." },
  { name: "Peak scrunch", how: "Drag the twin peaks." },
  { name: "Sleep", how: "Long-press to tuck in. Long-press again to wake." },
  { name: "Feed", how: "Drag a snack onto Spark." },
  { name: "Catch a token", how: "Tap the floating mint star." },
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
export function hitZone(
  x: number,
  y: number,
  width: number,
  height: number,
): "peak" | "face" | "body" {
  const px = x / width;
  const py = y / height;
  if (py < 0.3 && px > 0.22 && px < 0.78) return "peak";
  if (py > 0.42 && py < 0.78 && px > 0.24 && px < 0.76) return "face";
  return "body";
}
