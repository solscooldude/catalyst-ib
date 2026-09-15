import type { FocusThemeId } from "@/lib/appearance";

export const STAGE_THEMES = [
  {
    id: "none" as const,
    name: "Quiet spotlight",
    cost: 0,
    blurb: "Dim stage only. The default empty wash.",
  },
  {
    id: "nightsky" as const,
    name: "Night sky",
    cost: 0,
    blurb: "Soft indigo, twinkle, a rare shooting star.",
  },
  {
    id: "waves" as const,
    name: "Gentle waves",
    cost: 0,
    blurb: "Slow mint and lilac bands drifting behind Spark.",
  },
  {
    id: "math" as const,
    name: "Math drift",
    cost: 18,
    blurb: "Faint equations floating at low contrast.",
  },
  {
    id: "sea" as const,
    name: "Deep blue sea",
    cost: 18,
    blurb: "Navy and cobalt water rolling behind the spark.",
  },
];

/** Soft washes (spotlight / gradient / subject tint) — next after interactions. */
export type StageThemeId = (typeof STAGE_THEMES)[number]["id"];

export function isStageFocusTheme(id: FocusThemeId | string): id is StageThemeId {
  return (
    id === "nightsky" ||
    id === "waves" ||
    id === "sea" ||
    id === "math" ||
    id === "none"
  );
}
