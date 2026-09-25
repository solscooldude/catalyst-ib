export const BRAND_MINT = "#5EEAD4";

export const SPRITE_SPECIES = [
  "fox",
  "bunny",
  "deer",
  "cat",
  "axolotl",
  "dragon",
] as const;

export type SpriteSpeciesId = (typeof SPRITE_SPECIES)[number];

/** Locked Ethereal FX — never a uniform mint wash. */
export type EtherealFx =
  | "sunset"
  | "bubbles"
  | "goldgreen"
  | "hearts"
  | "rose"
  | "starfire";

export type SpeciesGlow = {
  glow: string;
  glowDeep: string;
  fx: EtherealFx;
};

export const ETHEREAL_GLOWS: Record<SpriteSpeciesId, SpeciesGlow> = {
  fox: { glow: "#FBBF24", glowDeep: "#F97316", fx: "sunset" },
  bunny: { glow: "#FBCFE8", glowDeep: "#C4B5FD", fx: "bubbles" },
  deer: { glow: "#FDE68A", glowDeep: "#86EFAC", fx: "goldgreen" },
  cat: { glow: "#E879F9", glowDeep: "#A78BFA", fx: "hearts" },
  axolotl: { glow: "#F472B6", glowDeep: "#FB7185", fx: "rose" },
  dragon: { glow: BRAND_MINT, glowDeep: "#2DD4BF", fx: "starfire" },
};

export const CAT_HEART = "#F9A8D4";
