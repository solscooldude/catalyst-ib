import type { FocusThemeId } from "@/lib/appearance";

export const STAGE_THEMES = [
  {
    id: "nightsky" as const,
    name: "Night sky",
    cost: 0,
    blurb: "Free default. Soft indigo, twinkle, a rare shooting star.",
  },
  {
    id: "sea" as const,
    name: "Deep blue sea",
    cost: 18,
    blurb: "Rolling navy swells and foam behind the sprite.",
  },
  {
    id: "math" as const,
    name: "Math drift",
    cost: 18,
    blurb: "Faint equations floating at low contrast.",
  },
];

/** Soft washes (spotlight / gradient / subject tint) — next after interactions. */
export type StageThemeId = (typeof STAGE_THEMES)[number]["id"];

export function isStageFocusTheme(id: FocusThemeId | string): id is StageThemeId {
  return id === "nightsky" || id === "sea" || id === "math";
}
