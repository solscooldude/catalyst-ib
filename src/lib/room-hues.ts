type RoomShadeId = "pastel" | "normal" | "deep";

type RoomPaper = {
  bg: string;
  card: string;
  mute: string;
};

export type RoomWash = {
  light: RoomPaper;
  dark: RoomPaper;
  swatch: string;
};

function paper(bg: string, card: string, mute: string): RoomPaper {
  return { bg, card, mute };
}

function wash(pastel: RoomWash, normal: RoomWash, deep: RoomWash) {
  return { pastel, normal, deep };
}

function tone(
  lightBg: string,
  lightCard: string,
  lightMute: string,
  darkBg: string,
  darkCard: string,
  darkMute: string,
  swatch: string,
): RoomWash {
  return {
    light: paper(lightBg, lightCard, lightMute),
    dark: paper(darkBg, darkCard, darkMute),
    swatch,
  };
}

export const BACKGROUNDS = [
  {
    id: "void",
    name: "Void",
    cost: 0,
    collection: "starter" as const,
    kind: "plain" as const,
    blurb: "The original room. No wash.",
  },
  {
    id: "mint",
    name: "Mint room",
    cost: 12,
    collection: "starter" as const,
    kind: "wash" as const,
    blurb: "One mint wash. Pastel / Normal / Deep after you buy.",
    shades: wash(
      tone("#eefaf7", "#f7fffc", "#e4f4ef", "#0e1816", "#15201d", "#1b2824", "#e8faf6"),
      tone("#e4f6f1", "#f3fcf8", "#d7eee7", "#0c1614", "#141c1a", "#1a2622", "#c5ebe3"),
      tone("#d4ebe4", "#e8f5f0", "#c3ddd4", "#081210", "#101816", "#16201c", "#0f766e"),
    ),
  },
  {
    id: "red",
    name: "Red room",
    cost: 14,
    collection: "starter" as const,
    kind: "wash" as const,
    blurb: "Warm red paper. Shade is a dropdown, not another buy.",
    shades: wash(
      tone("#fdeeee", "#fff7f7", "#f6e0e0", "#1f1414", "#2a1c1c", "#352424", "#fecaca"),
      tone("#f8e2e2", "#fdf0f0", "#efd0d0", "#1a1010", "#241818", "#2e2020", "#f87171"),
      tone("#f0d2d2", "#f8e6e6", "#e4bcbc", "#160c0c", "#1e1414", "#281c1c", "#b91c1c"),
    ),
  },
  {
    id: "orange",
    name: "Orange room",
    cost: 14,
    collection: "starter" as const,
    kind: "wash" as const,
    blurb: "Peach through burnt paper.",
    shades: wash(
      tone("#fff4ea", "#fffaf4", "#f8e8d6", "#1f1710", "#2a2018", "#35281e", "#fed7aa"),
      tone("#fce8d4", "#fff4ea", "#f3d8bc", "#1a140e", "#241c16", "#2e241c", "#fb923c"),
      tone("#f3d4b4", "#f8e6cc", "#e8c49c", "#16100a", "#1e1810", "#281e16", "#c2410c"),
    ),
  },
  {
    id: "yellow",
    name: "Yellow room",
    cost: 14,
    collection: "starter" as const,
    kind: "wash" as const,
    blurb: "Soft lemon paper, three depths.",
    shades: wash(
      tone("#fef9e8", "#fffdf4", "#f5efd4", "#1c1a10", "#262418", "#302c1e", "#fef08a"),
      tone("#f8efc8", "#fcf6dc", "#eee4b4", "#18160c", "#221e14", "#2c281a", "#facc15"),
      tone("#efe2a8", "#f6ecc4", "#e0d090", "#14120a", "#1c1a10", "#262214", "#ca8a04"),
    ),
  },
  {
    id: "green",
    name: "Green room",
    cost: 14,
    collection: "starter" as const,
    kind: "wash" as const,
    blurb: "Grove green. Deep is the old library-lamp shade.",
    shades: wash(
      tone("#eef6f1", "#f7fbf8", "#e4f0e8", "#101612", "#181e1a", "#202620", "#bbf7d0"),
      tone("#e2f0e8", "#f0f8f3", "#d4e4da", "#0c120f", "#141c18", "#1a2420", "#4ade80"),
      tone("#d0e4d6", "#e4f0e8", "#c0d4c6", "#0c120f", "#141c18", "#1a2420", "#15803d"),
    ),
  },
  {
    id: "blue",
    name: "Blue room",
    cost: 14,
    collection: "starter" as const,
    kind: "wash" as const,
    blurb: "Baby blue through ink. Pastel is the morning-sky wash.",
    shades: wash(
      tone("#e8f3fb", "#f5fbff", "#dceaf6", "#101820", "#17222c", "#1d2b36", "#bfdbfe"),
      tone("#d8ebf6", "#eef6fc", "#c8dcec", "#0e161c", "#141e26", "#1a2630", "#60a5fa"),
      tone("#c4d8ea", "#dce8f4", "#b0c8de", "#0c141a", "#121c24", "#18222c", "#1d4ed8"),
    ),
  },
  {
    id: "indigo",
    name: "Indigo room",
    cost: 14,
    collection: "starter" as const,
    kind: "wash" as const,
    blurb: "The last rainbow stop for the room.",
    shades: wash(
      tone("#eef0fb", "#f6f7fe", "#e2e6f6", "#12141e", "#1a1c28", "#222636", "#c7d2fe"),
      tone("#e2e6f6", "#eef0fb", "#d4d8ee", "#10121a", "#181a24", "#202430", "#818cf8"),
      tone("#d0d4ee", "#e2e6f6", "#c0c4e2", "#0c0e18", "#141620", "#1c1e2a", "#3730a3"),
    ),
  },
  {
    id: "pink",
    name: "Pink room",
    cost: 14,
    collection: "starter" as const,
    kind: "wash" as const,
    blurb: "Blush paper. Pastel is the old light-pink wash.",
    shades: wash(
      tone("#fdecef", "#fff7f8", "#f8e4e8", "#1f1418", "#2a1c21", "#35242a", "#fecdd3"),
      tone("#f6dce2", "#fceef1", "#eeccd4", "#1a1014", "#24181c", "#2e2026", "#f9a8d4"),
      tone("#ecc8d2", "#f6dee6", "#e0b4c0", "#160c10", "#1e1418", "#281c22", "#db2777"),
    ),
  },
  {
    id: "violet",
    name: "Violet room",
    cost: 14,
    collection: "starter" as const,
    kind: "wash" as const,
    blurb: "Lilac through dusk. Pastel is the old lilac wash.",
    shades: wash(
      tone("#f3eef8", "#fbf8fd", "#eee6f6", "#1a1522", "#241d2e", "#2d2438", "#e9d5ff"),
      tone("#e8def4", "#f4eefb", "#ddd0ee", "#16121c", "#1e1828", "#282030", "#c4b5fd"),
      tone("#e8dff2", "#f3eef8", "#ddd0e8", "#120e18", "#1b1524", "#241c30", "#6d28d9"),
    ),
  },
  {
    id: "amber",
    name: "Amber room",
    cost: 14,
    collection: "starter" as const,
    kind: "wash" as const,
    blurb: "Quiet gold paper for late sessions.",
    shades: wash(
      tone("#fbf4e4", "#fefaf0", "#f2e8d0", "#1c1810", "#262218", "#302c1e", "#fde68a"),
      tone("#f4e8cc", "#faf2dc", "#eadcba", "#18140c", "#221e14", "#2c261a", "#fbbf24"),
      tone("#ead8b0", "#f4e8c8", "#decc9c", "#14100a", "#1c1810", "#262214", "#b45309"),
    ),
  },
  {
    id: "slate",
    name: "Slate room",
    cost: 12,
    collection: "starter" as const,
    kind: "wash" as const,
    blurb: "Cool mist gray. The old Mist room lives here.",
    shades: wash(
      tone("#eef1f5", "#f8fafc", "#e8edf3", "#12161c", "#1a1e24", "#222830", "#e2e8f0"),
      tone("#e8edf3", "#f4f6f8", "#dce2ea", "#101318", "#171c24", "#1e2530", "#94a3b8"),
      tone("#dce2ea", "#e8edf3", "#d0d6de", "#0c1014", "#14181e", "#1a2028", "#475569"),
    ),
  },
  {
    id: "stars",
    name: "Star dots",
    cost: 100,
    collection: "aurora" as const,
    kind: "effect" as const,
    blurb: "Soft dots on the app chrome. Not the Focus night-sky scene.",
  },
  {
    id: "aurora",
    name: "Aurora",
    cost: 100,
    collection: "aurora" as const,
    kind: "wash" as const,
    blurb: "Lavender chrome plus a quiet band. Shade still comes with the colour.",
    shades: wash(
      tone("#efe8f6", "#f8f4fc", "#e6dcf4", "#14101a", "#1c1824", "#262030", "#efe8f6"),
      tone("#e9d5ff", "#f3eef8", "#ddd0ee", "#1a1522", "#241d2e", "#2d2438", "#e9d5ff"),
      tone("#d8c8ee", "#e8def6", "#c8b8e0", "#100e16", "#18141e", "#201c28", "#c4b5fd"),
    ),
  },
] as const;

export type BackgroundId = (typeof BACKGROUNDS)[number]["id"];

const LEGACY_ROOM: Record<string, { hue: BackgroundId; shade?: RoomShadeId }> = {
  dusk: { hue: "violet", shade: "deep" },
  mist: { hue: "slate", shade: "normal" },
  grove: { hue: "green", shade: "deep" },
  lilac: { hue: "violet", shade: "pastel" },
  blush: { hue: "pink", shade: "pastel" },
  babyblue: { hue: "blue", shade: "pastel" },
};

export function migrateBackground(id: string | undefined): {
  hue: BackgroundId;
  shade?: RoomShadeId;
} {
  if (!id) return { hue: "void" };
  const legacy = LEGACY_ROOM[id];
  if (legacy) return legacy;
  return BACKGROUNDS.some((row) => row.id === id)
    ? { hue: id as BackgroundId }
    : { hue: "void" };
}

export function getBackground(id: BackgroundId) {
  return BACKGROUNDS.find((row) => row.id === id) ?? BACKGROUNDS[0];
}

export function getBackgroundShade(hue: BackgroundId, shade: RoomShadeId) {
  const room = getBackground(hue);
  if (room.kind !== "wash") return null;
  return room.shades[shade] ?? room.shades.normal;
}

export function roomHasShades(id: BackgroundId) {
  return getBackground(id).kind === "wash";
}
