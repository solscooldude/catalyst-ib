import { SPARK_TINTS, type SparkTintId } from "./spark-tints";
import {
  BACKGROUNDS,
  migrateBackground,
  type BackgroundId,
} from "./room-hues";

export { SPARK_TINTS, getSparkTint } from "./spark-tints";
export type { SparkTintId } from "./spark-tints";
export {
  BACKGROUNDS,
  getBackground,
  getBackgroundShade,
  roomHasShades,
} from "./room-hues";
export type { BackgroundId } from "./room-hues";

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

export type AccentShadeId = "pastel" | "normal" | "deep";

export const ACCENT_SHADE_OPTIONS: {
  id: AccentShadeId;
  name: string;
}[] = [
  { id: "pastel", name: "Pastel" },
  { id: "normal", name: "Normal" },
  { id: "deep", name: "Deep" },
];

function shade(pastel: string, normal: string, deep: string, ink: string, paper: string) {
  return {
    pastel: { hex: pastel, fg: paper },
    normal: { hex: normal, fg: ink },
    deep: { hex: deep, fg: paper },
  };
}

export const ACCENTS = [
  {
    id: "mint",
    name: "Mint",
    cost: 0,
    collection: "starter" as const,
    blurb: "The default. One colour — switch Pastel, Normal, or Deep.",
    shades: shade("#A7F3E8", "#5EEAD4", "#0F766E", "#134e4a", "#f0fdfa"),
  },
  {
    id: "red",
    name: "Red",
    cost: 16,
    collection: "starter" as const,
    blurb: "Rainbow red. Shades are free after you buy the colour.",
    shades: shade("#FECACA", "#F87171", "#B91C1C", "#7f1d1d", "#fff7f7"),
  },
  {
    id: "orange",
    name: "Orange",
    cost: 16,
    collection: "starter" as const,
    blurb: "Warm orange. Pastel / Normal / Deep in the dropdown.",
    shades: shade("#FED7AA", "#FB923C", "#C2410C", "#7c2d12", "#fff7ed"),
  },
  {
    id: "yellow",
    name: "Yellow",
    cost: 16,
    collection: "starter" as const,
    blurb: "Bright yellow chrome, three shades included.",
    shades: shade("#FEF08A", "#FACC15", "#CA8A04", "#713f12", "#fffbeb"),
  },
  {
    id: "green",
    name: "Green",
    cost: 16,
    collection: "starter" as const,
    blurb: "Leaf green, not mint. Shade is a dropdown, not another buy.",
    shades: shade("#BBF7D0", "#4ADE80", "#15803D", "#14532d", "#f0fdf4"),
  },
  {
    id: "blue",
    name: "Blue",
    cost: 16,
    collection: "starter" as const,
    blurb: "Sky blue through ink blue.",
    shades: shade("#BFDBFE", "#60A5FA", "#1D4ED8", "#1e3a8a", "#eff6ff"),
  },
  {
    id: "indigo",
    name: "Indigo",
    cost: 16,
    collection: "starter" as const,
    blurb: "The last rainbow stop.",
    shades: shade("#C7D2FE", "#818CF8", "#3730A3", "#312e81", "#eef2ff"),
  },
  {
    id: "pink",
    name: "Blush",
    cost: 20,
    collection: "starter" as const,
    blurb: "Warm pink buttons. All three shades come with the colour.",
    shades: shade("#FBCFE8", "#F9A8D4", "#DB2777", "#831843", "#fdf2f8"),
  },
  {
    id: "violet",
    name: "Violet",
    cost: 18,
    collection: "starter" as const,
    blurb: "Lilac through deep violet.",
    shades: shade("#DDD6FE", "#C4B5FD", "#6D28D9", "#4c1d95", "#f5f3ff"),
  },
  {
    id: "amber",
    name: "Amber",
    cost: 16,
    collection: "starter" as const,
    blurb: "A quieter gold for late sessions.",
    shades: shade("#FDE68A", "#FBBF24", "#B45309", "#78350f", "#fffbeb"),
  },
  {
    id: "gold",
    name: "Elite gold",
    cost: 220,
    collection: "gold" as const,
    blurb: "Rare metal. Shine + sparkle. Shade still comes with the colour.",
    shades: shade("#F5E6A8", "#E8C547", "#A16207", "#3f2f05", "#fffbeb"),
  },
] as const;

export const SPARK_GEAR = [
  { id: "none", name: "Bare", cost: 0, collection: "starter" as const, blurb: "Just the spark." },
  { id: "bow", name: "Tiny bow", cost: 10, collection: "starter" as const, blurb: "A pink knot on the crown." },
  { id: "glasses", name: "Round glasses", cost: 12, collection: "starter" as const, blurb: "Black study frames." },
  { id: "scarf", name: "Soft scarf", cost: 12, collection: "starter" as const, blurb: "A red knit looped at the base, ends hanging down." },
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
export type SparkGearId = (typeof SPARK_GEAR)[number]["id"];
export type SparkTrailId = (typeof SPARK_TRAILS)[number]["id"];
export type FocusThemeId = (typeof FOCUS_THEMES)[number]["id"];

const LEGACY_ACCENT: Record<string, { hue: AccentId; shade: AccentShadeId }> = {
  "red-deep": { hue: "red", shade: "deep" },
  "orange-deep": { hue: "orange", shade: "deep" },
  "yellow-deep": { hue: "yellow", shade: "deep" },
  "green-deep": { hue: "green", shade: "deep" },
  "blue-deep": { hue: "blue", shade: "deep" },
  "indigo-deep": { hue: "indigo", shade: "deep" },
};

export type AppearanceState = {
  ownedAccents: AccentId[];
  ownedBackgrounds: BackgroundId[];
  ownedSparkTints: SparkTintId[];
  ownedGear: SparkGearId[];
  ownedTrails: SparkTrailId[];
  ownedFocusThemes: FocusThemeId[];
  accent: AccentId;
  accentShade: AccentShadeId;
  background: BackgroundId;
  backgroundShade: AccentShadeId;
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
  accentShade: "normal",
  background: "void",
  backgroundShade: "normal",
  sparkTint: "mint",
  gear: "none",
  trail: "none",
  focusTheme: "nightsky",
};

function migrateAccent(id: string | undefined): {
  hue: AccentId;
  shade?: AccentShadeId;
} {
  if (!id) return { hue: "mint" };
  const legacy = LEGACY_ACCENT[id];
  if (legacy) return legacy;
  return ACCENTS.some((row) => row.id === id)
    ? { hue: id as AccentId }
    : { hue: "mint" };
}

function knownShade(id: string | undefined): AccentShadeId | null {
  return id === "pastel" || id === "normal" || id === "deep" ? id : null;
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
    (raw?.ownedAccents ?? ["mint"]).map((id) => migrateAccent(id).hue),
    "mint",
  );
  const ownedBackgrounds = unique(
    (raw?.ownedBackgrounds ?? ["void"]).map((id) => migrateBackground(id).hue),
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
  const migrated = migrateAccent(raw?.accent);
  const accent = ownedAccents.includes(migrated.hue) ? migrated.hue : "mint";
  const accentShade =
    knownShade(raw?.accentShade) ?? migrated.shade ?? "normal";
  const migratedRoom = migrateBackground(raw?.background);
  const background = ownedBackgrounds.includes(migratedRoom.hue)
    ? migratedRoom.hue
    : "void";
  const backgroundShade =
    knownShade(raw?.backgroundShade) ?? migratedRoom.shade ?? "normal";
  return {
    ownedAccents,
    ownedBackgrounds,
    ownedSparkTints,
    ownedGear,
    ownedTrails,
    ownedFocusThemes,
    accent,
    accentShade,
    background,
    backgroundShade,
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

export function getAccentShade(hue: AccentId, shade: AccentShadeId) {
  const accent = getAccent(hue);
  return accent.shades[shade] ?? accent.shades.normal;
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
