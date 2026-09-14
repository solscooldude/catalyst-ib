export type CollectionId = "starter" | "aurora" | "gold" | "focus";

export const COLLECTIONS: {
  id: CollectionId;
  name: string;
  range: string;
  copy: string;
}[] = [
  {
    id: "starter",
    name: "Starter",
    range: "Free–46",
    copy: "Cheap closet pieces, paper dust, and a mint vapor trail.",
  },
  {
    id: "aurora",
    name: "Night sky",
    range: "80–150",
    copy: "Stars, aurora wash, and a mint-violet trail.",
  },
  {
    id: "gold",
    name: "Elite gold",
    range: "200–350",
    copy: "Rare metal: site gold, a gilded cap, and a gold sparkle trail.",
  },
  {
    id: "focus",
    name: "Focus scenes",
    range: "Free–120",
    copy: "Lamp ember trail. Room plates are parked — focus is the spark on a quiet stage.",
  },
];

export const ACCENTS = [
  {
    id: "mint",
    name: "Mint",
    hex: "#5EEAD4",
    cost: 0,
    collection: "starter" as const,
    blurb: "The default. Soft cyan.",
  },
  {
    id: "pink",
    name: "Blush",
    hex: "#F9A8D4",
    cost: 20,
    collection: "starter" as const,
    blurb: "Warm pink buttons and highlights.",
  },
  {
    id: "violet",
    name: "Violet",
    hex: "#C4B5FD",
    cost: 18,
    collection: "starter" as const,
    blurb: "Lilac accents across the UI.",
  },
  {
    id: "amber",
    name: "Amber",
    hex: "#FBBF24",
    cost: 16,
    collection: "starter" as const,
    blurb: "A quieter gold for late sessions.",
  },
  {
    id: "gold",
    name: "Elite gold",
    hex: "#E4C56A",
    cost: 220,
    collection: "gold" as const,
    blurb: "Rare metal on buttons and chips.",
  },
] as const;

export const BACKGROUNDS = [
  {
    id: "void",
    name: "Void",
    cost: 0,
    collection: "starter" as const,
    blurb: "Near-black, the original room.",
  },
  {
    id: "dusk",
    name: "Dusk",
    cost: 12,
    collection: "starter" as const,
    blurb: "A violet evening wash.",
  },
  {
    id: "mist",
    name: "Mist",
    cost: 12,
    collection: "starter" as const,
    blurb: "Cool slate, a little softer.",
  },
  {
    id: "grove",
    name: "Grove",
    cost: 14,
    collection: "starter" as const,
    blurb: "Deep green, like a library lamp.",
  },
  {
    id: "stars",
    name: "Stars",
    cost: 100,
    collection: "aurora" as const,
    blurb: "Soft glowing dots. A quiet night sky.",
  },
  {
    id: "aurora",
    name: "Aurora",
    cost: 100,
    collection: "aurora" as const,
    blurb: "A slow mint-and-violet wash across the room.",
  },
] as const;

export const SPARK_TINTS = [
  {
    id: "mint",
    name: "Mint spark",
    cost: 0,
    collection: "starter" as const,
    hi: "#B8FFF3",
    mid: "#7AF0DC",
    lo: "#5EEAD4",
  },
  {
    id: "rose",
    name: "Rose spark",
    cost: 14,
    collection: "starter" as const,
    hi: "#FFE4F1",
    mid: "#F9A8D4",
    lo: "#F472B6",
  },
  {
    id: "gold",
    name: "Gold spark",
    cost: 16,
    collection: "starter" as const,
    hi: "#FEF3C7",
    mid: "#FCD34D",
    lo: "#F59E0B",
  },
  {
    id: "lilac",
    name: "Lilac spark",
    cost: 14,
    collection: "starter" as const,
    hi: "#EDE9FE",
    mid: "#C4B5FD",
    lo: "#A78BFA",
  },
  {
    id: "aurora",
    name: "Aurora spark",
    cost: 90,
    collection: "aurora" as const,
    hi: "#E9D5FF",
    mid: "#5EEAD4",
    lo: "#A78BFA",
  },
] as const;

export const SPARK_GEAR = [
  { id: "none", name: "Bare", cost: 0, collection: "starter" as const, blurb: "Just the spark." },
  { id: "bow", name: "Tiny bow", cost: 10, collection: "starter" as const, blurb: "A pink knot on the crown." },
  { id: "glasses", name: "Round glasses", cost: 12, collection: "starter" as const, blurb: "Black study frames." },
  { id: "scarf", name: "Soft scarf", cost: 12, collection: "starter" as const, blurb: "A red wrap at the neck." },
  { id: "cap", name: "Graduation cap", cost: 14, collection: "starter" as const, blurb: "A dark mortarboard." },
  {
    id: "veil",
    name: "Aurora veil",
    cost: 90,
    collection: "aurora" as const,
    blurb: "A mint-violet wash at the shoulders.",
  },
  {
    id: "cap-gold",
    name: "Gilded cap",
    cost: 240,
    collection: "gold" as const,
    blurb: "Mortarboard with a gold rim and tassel.",
  },
] as const;

export const SPARK_TRAILS = [
  {
    id: "none",
    name: "No trail",
    cost: 0,
    collection: "starter" as const,
    blurb: "The spark floats clean.",
  },
  {
    id: "sparkle",
    name: "Basic sparkle",
    cost: 24,
    collection: "starter" as const,
    blurb: "Tiny motes while the spark is on screen.",
  },
  {
    id: "paper",
    name: "Paper dust",
    cost: 18,
    collection: "starter" as const,
    blurb: "Warm scrap motes. Like notes sliding off the desk.",
  },
  {
    id: "vapor",
    name: "Mint vapor",
    cost: 46,
    collection: "starter" as const,
    blurb: "Soft mint wisps. Lo-fi, not neon.",
  },
  {
    id: "aurora",
    name: "Aurora glow",
    cost: 110,
    collection: "aurora" as const,
    blurb: "A soft mint-violet wake.",
  },
  {
    id: "ember",
    name: "Lamp ember",
    cost: 72,
    collection: "focus" as const,
    blurb: "Warm desk-lamp specks rising off the spark.",
  },
  {
    id: "gold",
    name: "Elite gold sparkle",
    cost: 280,
    collection: "gold" as const,
    blurb: "Rare metal dust. One trail at a time.",
  },
] as const;

export const FOCUS_THEMES = [
  {
    id: "none",
    name: "Clear desk",
    cost: 0,
    collection: "focus" as const,
    blurb: "No extra scene on the timer.",
  },
  {
    id: "cat",
    name: "Cat study",
    cost: 0,
    collection: "focus" as const,
    blurb: "A sleeping study cat. One window, afternoon into night.",
  },
  {
    id: "desk",
    name: "Desk window",
    cost: 40,
    collection: "focus" as const,
    blurb: "Laptop at the glass. Hills go gold, then starlight.",
  },
  {
    id: "library",
    name: "Library attic",
    cost: 48,
    collection: "focus" as const,
    blurb: "Books, a chair, and a skylight that turns to night.",
  },
  {
    id: "rocket",
    name: "Rocket to space",
    cost: 120,
    collection: "focus" as const,
    blurb: "Older option. Liftoff into the open universe — kept, not the main scene.",
  },
] as const;

export type AccentId = (typeof ACCENTS)[number]["id"];
export type BackgroundId = (typeof BACKGROUNDS)[number]["id"];
export type SparkTintId = (typeof SPARK_TINTS)[number]["id"];
export type SparkGearId = (typeof SPARK_GEAR)[number]["id"];
export type SparkTrailId = (typeof SPARK_TRAILS)[number]["id"];
export type FocusThemeId = (typeof FOCUS_THEMES)[number]["id"];

export type AppearanceState = {
  ownedAccents: AccentId[];
  ownedBackgrounds: BackgroundId[];
  ownedSparkTints: SparkTintId[];
  ownedGear: SparkGearId[];
  ownedTrails: SparkTrailId[];
  ownedFocusThemes: FocusThemeId[];
  accent: AccentId;
  background: BackgroundId;
  sparkTint: SparkTintId;
  gear: SparkGearId;
  trail: SparkTrailId;
  focusTheme: FocusThemeId;
};

export const defaultAppearance: AppearanceState = {
  ownedAccents: ["mint"],
  ownedBackgrounds: ["void"],
  ownedSparkTints: ["mint"],
  ownedGear: ["none"],
  ownedTrails: ["none"],
  ownedFocusThemes: ["none", "cat"],
  accent: "mint",
  background: "void",
  sparkTint: "mint",
  gear: "none",
  trail: "none",
  focusTheme: "none",
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
  const ownedTrails = unique(raw?.ownedTrails ?? ["none"], "none");
  const ownedFocusThemes = unique(
    [...(raw?.ownedFocusThemes ?? ["none", "cat"]), "cat"],
    "none",
  );
  return {
    ownedAccents,
    ownedBackgrounds,
    ownedSparkTints,
    ownedGear,
    ownedTrails,
    ownedFocusThemes,
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
    trail: ownedTrails.includes(raw?.trail ?? "none")
      ? (raw?.trail ?? "none")
      : "none",
    focusTheme: ownedFocusThemes.includes(raw?.focusTheme ?? "none")
      ? (raw?.focusTheme ?? "none")
      : "none",
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

export function getSparkTrail(id: SparkTrailId) {
  return SPARK_TRAILS.find((row) => row.id === id) ?? SPARK_TRAILS[0];
}

export function getFocusTheme(id: FocusThemeId) {
  return FOCUS_THEMES.find((row) => row.id === id) ?? FOCUS_THEMES[0];
}
