export const ACCENTS = [
  {
    id: "mint",
    name: "Mint",
    hex: "#5EEAD4",
    cost: 0,
    blurb: "The default. Soft cyan.",
  },
  {
    id: "pink",
    name: "Blush",
    hex: "#F9A8D4",
    cost: 20,
    blurb: "Warm pink buttons and highlights.",
  },
  {
    id: "violet",
    name: "Violet",
    hex: "#C4B5FD",
    cost: 18,
    blurb: "Lilac accents across the UI.",
  },
  {
    id: "amber",
    name: "Amber",
    hex: "#FBBF24",
    cost: 16,
    blurb: "A quieter gold for late sessions.",
  },
] as const;

export const BACKGROUNDS = [
  {
    id: "void",
    name: "Void",
    cost: 0,
    blurb: "Near-black, the original room.",
  },
  {
    id: "dusk",
    name: "Dusk",
    cost: 12,
    blurb: "A violet evening wash.",
  },
  {
    id: "mist",
    name: "Mist",
    cost: 12,
    blurb: "Cool slate, a little softer.",
  },
  {
    id: "grove",
    name: "Grove",
    cost: 14,
    blurb: "Deep green, like a library lamp.",
  },
  {
    id: "stars",
    name: "Stars",
    cost: 100,
    blurb: "Soft glowing dots. A quiet night sky.",
  },
  {
    id: "aurora",
    name: "Aurora",
    cost: 100,
    blurb: "A slow mint-and-violet wash across the room.",
  },
] as const;

export const SPARK_TINTS = [
  {
    id: "mint",
    name: "Mint spark",
    cost: 0,
    hi: "#B8FFF3",
    mid: "#7AF0DC",
    lo: "#5EEAD4",
  },
  {
    id: "rose",
    name: "Rose spark",
    cost: 14,
    hi: "#FFE4F1",
    mid: "#F9A8D4",
    lo: "#F472B6",
  },
  {
    id: "gold",
    name: "Gold spark",
    cost: 16,
    hi: "#FEF3C7",
    mid: "#FCD34D",
    lo: "#F59E0B",
  },
  {
    id: "lilac",
    name: "Lilac spark",
    cost: 14,
    hi: "#EDE9FE",
    mid: "#C4B5FD",
    lo: "#A78BFA",
  },
] as const;

export const SPARK_GEAR = [
  { id: "none", name: "Bare", cost: 0, blurb: "Just the spark." },
  { id: "bow", name: "Tiny bow", cost: 10, blurb: "A pink knot on the crown." },
  { id: "glasses", name: "Round glasses", cost: 12, blurb: "Black study frames." },
  { id: "scarf", name: "Soft scarf", cost: 12, blurb: "A red wrap at the neck." },
  { id: "cap", name: "Graduation cap", cost: 14, blurb: "A dark mortarboard." },
] as const;

export type AccentId = (typeof ACCENTS)[number]["id"];
export type BackgroundId = (typeof BACKGROUNDS)[number]["id"];
export type SparkTintId = (typeof SPARK_TINTS)[number]["id"];
export type SparkGearId = (typeof SPARK_GEAR)[number]["id"];

export type AppearanceState = {
  ownedAccents: AccentId[];
  ownedBackgrounds: BackgroundId[];
  ownedSparkTints: SparkTintId[];
  ownedGear: SparkGearId[];
  accent: AccentId;
  background: BackgroundId;
  sparkTint: SparkTintId;
  gear: SparkGearId;
};

export const defaultAppearance: AppearanceState = {
  ownedAccents: ["mint"],
  ownedBackgrounds: ["void"],
  ownedSparkTints: ["mint"],
  ownedGear: ["none"],
  accent: "mint",
  background: "void",
  sparkTint: "mint",
  gear: "none",
};

function unique<T extends string>(values: T[], fallback: T): T[] {
  const next = [...new Set(values.filter(Boolean))];
  if (!next.includes(fallback)) next.unshift(fallback);
  return next;
}

export function normalizeAppearance(
  raw?: Partial<AppearanceState> | null,
): AppearanceState {
  const ownedAccents = unique(raw?.ownedAccents ?? ["mint"], "mint");
  const ownedBackgrounds = unique(raw?.ownedBackgrounds ?? ["void"], "void");
  const ownedSparkTints = unique(raw?.ownedSparkTints ?? ["mint"], "mint");
  const ownedGear = unique(raw?.ownedGear ?? ["none"], "none");
  return {
    ownedAccents,
    ownedBackgrounds,
    ownedSparkTints,
    ownedGear,
    accent: ownedAccents.includes(raw?.accent ?? "mint")
      ? (raw?.accent ?? "mint")
      : "mint",
    background: ownedBackgrounds.includes(raw?.background ?? "void")
      ? (raw?.background ?? "void")
      : "void",
    sparkTint: ownedSparkTints.includes(raw?.sparkTint ?? "mint")
      ? (raw?.sparkTint ?? "mint")
      : "mint",
    gear: ownedGear.includes(raw?.gear ?? "none") ? (raw?.gear ?? "none") : "none",
  };
}

export function getAccent(id: AccentId) {
  return ACCENTS.find((row) => row.id === id) ?? ACCENTS[0];
}

export function getBackground(id: BackgroundId) {
  return BACKGROUNDS.find((row) => row.id === id) ?? BACKGROUNDS[0];
}

export function getSparkTint(id: SparkTintId) {
  return SPARK_TINTS.find((row) => row.id === id) ?? SPARK_TINTS[0];
}

export function getSparkGear(id: SparkGearId) {
  return SPARK_GEAR.find((row) => row.id === id) ?? SPARK_GEAR[0];
}
