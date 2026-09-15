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
    name: "Aurora",
    range: "80–150",
    copy: "Lavender room chrome for the whole app. Not a Focus scene.",
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
    range: "Free–18",
    copy: "Session backdrops only: night sky, deep blue sea, math drift. Trails live in Trails.",
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
    hex: "#E8C547",
    cost: 220,
    collection: "gold" as const,
    blurb: "Rare metal on buttons and chips. Shine + sparkle.",
  },
  {
    id: "red",
    name: "Red",
    hex: "#F87171",
    cost: 16,
    collection: "starter" as const,
    blurb: "A clear red for buttons and chips.",
  },
  {
    id: "red-deep",
    name: "Deep red",
    hex: "#B91C1C",
    cost: 10,
    collection: "starter" as const,
    blurb: "Darker red. Buy after Red, or on its own.",
  },
  {
    id: "orange",
    name: "Orange",
    hex: "#FB923C",
    cost: 16,
    collection: "starter" as const,
    blurb: "Warm orange highlights.",
  },
  {
    id: "orange-deep",
    name: "Deep orange",
    hex: "#C2410C",
    cost: 10,
    collection: "starter" as const,
    blurb: "Burnt orange, a shade down.",
  },
  {
    id: "yellow",
    name: "Yellow",
    hex: "#FACC15",
    cost: 16,
    collection: "starter" as const,
    blurb: "Bright yellow chrome.",
  },
  {
    id: "yellow-deep",
    name: "Deep yellow",
    hex: "#CA8A04",
    cost: 10,
    collection: "starter" as const,
    blurb: "Mustard yellow.",
  },
  {
    id: "green",
    name: "Green",
    hex: "#4ADE80",
    cost: 16,
    collection: "starter" as const,
    blurb: "Leaf green, not mint.",
  },
  {
    id: "green-deep",
    name: "Deep green",
    hex: "#15803D",
    cost: 10,
    collection: "starter" as const,
    blurb: "Forest green.",
  },
  {
    id: "blue",
    name: "Blue",
    hex: "#60A5FA",
    cost: 16,
    collection: "starter" as const,
    blurb: "Clear sky blue.",
  },
  {
    id: "blue-deep",
    name: "Deep blue",
    hex: "#1D4ED8",
    cost: 10,
    collection: "starter" as const,
    blurb: "Ink blue.",
  },
  {
    id: "indigo",
    name: "Indigo",
    hex: "#818CF8",
    cost: 16,
    collection: "starter" as const,
    blurb: "The last rainbow stop.",
  },
  {
    id: "indigo-deep",
    name: "Deep indigo",
    hex: "#3730A3",
    cost: 10,
    collection: "starter" as const,
    blurb: "Night indigo.",
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
    name: "Star dots",
    cost: 100,
    collection: "aurora" as const,
    blurb: "Soft dots on the app chrome. Not the Focus night-sky scene.",
  },
  {
    id: "aurora",
    name: "Aurora",
    cost: 100,
    collection: "aurora" as const,
    blurb: "Soft muted lavender chrome for the whole app. Not a Focus backdrop.",
  },
  {
    id: "lilac",
    name: "Lilac room",
    cost: 14,
    collection: "starter" as const,
    blurb: "A light lilac wash. Works in light chrome.",
  },
  {
    id: "blush",
    name: "Light pink",
    cost: 14,
    collection: "starter" as const,
    blurb: "Baby pink paper. Soft, not neon.",
  },
  {
    id: "babyblue",
    name: "Baby blue",
    cost: 14,
    collection: "starter" as const,
    blurb: "Pale blue room, like morning sky.",
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
    hi: "#FFF4B8",
    mid: "#F5D76A",
    lo: "#D4A017",
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
  {
    id: "headband",
    name: "Mint headband",
    cost: 12,
    collection: "starter" as const,
    blurb: "A thin band across the peaks.",
  },
  {
    id: "phones",
    name: "Study headphones",
    cost: 16,
    collection: "starter" as const,
    blurb: "Soft black cups. For the long block.",
  },
  {
    id: "star",
    name: "Star clip",
    cost: 14,
    collection: "starter" as const,
    blurb: "A tiny gold star on the left peak.",
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
    collection: "starter" as const,
    blurb: "Warm desk-lamp specks rising off the spark.",
  },
  {
    id: "gold",
    name: "Elite gold sparkle",
    cost: 280,
    collection: "gold" as const,
    blurb: "Rare metal dust. One trail at a time.",
  },
  {
    id: "week",
    name: "Seven-day flare",
    cost: 0,
    collection: "gold" as const,
    blurb: "Login seven days in a row. Warm gold motes.",
  },
] as const;

export const FOCUS_THEMES = [
  {
    id: "nightsky",
    name: "Night sky",
    cost: 0,
    collection: "focus" as const,
    blurb: "Free default. Soft indigo, twinkle, a rare shooting star.",
  },
  {
    id: "sea",
    name: "Deep blue sea",
    cost: 18,
    collection: "focus" as const,
    blurb: "Rolling navy swells and foam behind Spark.",
  },
  {
    id: "math",
    name: "Math drift",
    cost: 18,
    collection: "focus" as const,
    blurb: "Faint equations floating at low contrast.",
  },
  {
    id: "none",
    name: "Quiet spotlight",
    cost: 0,
    collection: "focus" as const,
    blurb: "No extra scene on the timer.",
  },
] as const;

const RETIRED_FOCUS = new Set(["cat", "desk", "library", "rocket", "waves"]);

/** Session backdrops sold under Focus scenes. Quiet spotlight stays off the shelf. */
export const SHOP_FOCUS_SCENES = FOCUS_THEMES.filter((item) => item.id !== "none");

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
  ownedFocusThemes: ["none", "nightsky"],
  accent: "mint",
  background: "void",
  sparkTint: "mint",
  gear: "none",
  trail: "none",
  focusTheme: "nightsky",
};

function knownAccent(id: string | undefined): AccentId {
  return ACCENTS.some((row) => row.id === id) ? (id as AccentId) : "mint";
}

function knownBackground(id: string | undefined): BackgroundId {
  return BACKGROUNDS.some((row) => row.id === id)
    ? (id as BackgroundId)
    : "void";
}

function mapFocusTheme(id: string | undefined): FocusThemeId {
  if (!id || RETIRED_FOCUS.has(id) || id === "aurora") return "nightsky";
  return FOCUS_THEMES.some((row) => row.id === id)
    ? (id as FocusThemeId)
    : "nightsky";
}

function unique<T extends string>(values: T[], fallback: T): T[] {
  const next = [...new Set(values.filter(Boolean))];
  if (!next.includes(fallback)) next.unshift(fallback);
  return next;
}

export function normalizeAppearance(
  raw?: Partial<AppearanceState> | null,
): AppearanceState {
  const ownedAccents = unique(
    (raw?.ownedAccents ?? ["mint"]).filter((id) =>
      ACCENTS.some((row) => row.id === id),
    ),
    "mint",
  );
  const ownedBackgrounds = unique(
    (raw?.ownedBackgrounds ?? ["void"]).filter((id) =>
      BACKGROUNDS.some((row) => row.id === id),
    ),
    "void",
  );
  const ownedSparkTints = unique(
    (raw?.ownedSparkTints ?? ["mint"]).filter((id) =>
      SPARK_TINTS.some((row) => row.id === id),
    ),
    "mint",
  );
  const ownedGear = unique(
    (raw?.ownedGear ?? ["none"]).filter((id) =>
      SPARK_GEAR.some((row) => row.id === id),
    ),
    "none",
  );
  const ownedTrails = unique(
    (raw?.ownedTrails ?? ["none"]).filter((id) =>
      SPARK_TRAILS.some((row) => row.id === id),
    ),
    "none",
  );
  const rawOwned = (raw?.ownedFocusThemes ?? ["none", "nightsky"]).map((id) =>
    mapFocusTheme(id),
  );
  const ownedFocusThemes = unique([...rawOwned, "none", "nightsky"], "nightsky");
  const rawTheme = mapFocusTheme(raw?.focusTheme);
  const accent = knownAccent(raw?.accent);
  const background = knownBackground(raw?.background);
  return {
    ownedAccents,
    ownedBackgrounds,
    ownedSparkTints,
    ownedGear,
    ownedTrails,
    ownedFocusThemes,
    accent: ownedAccents.includes(accent) ? accent : "mint",
    background: ownedBackgrounds.includes(background) ? background : "void",
    sparkTint: ownedSparkTints.includes(raw?.sparkTint ?? "mint")
      ? (raw?.sparkTint ?? "mint")
      : "mint",
    gear: ownedGear.includes(raw?.gear ?? "none") ? (raw?.gear ?? "none") : "none",
    trail: ownedTrails.includes(raw?.trail ?? "none")
      ? (raw?.trail ?? "none")
      : "none",
    focusTheme: ownedFocusThemes.includes(rawTheme) ? rawTheme : "nightsky",
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
