import { getSparkTint, type SparkTintId } from "./spark-tints.ts";
import {
  CAT_HEART,
  ETHEREAL_GLOWS,
  SPRITE_SPECIES,
  type SpriteSpeciesId,
} from "./species-glows.ts";

export {
  BRAND_MINT,
  CAT_HEART,
  ETHEREAL_GLOWS,
  SPRITE_SPECIES,
  type EtherealFx,
  type SpriteSpeciesId,
} from "./species-glows.ts";

export const DEFAULT_SPECIES: SpriteSpeciesId = "fox";

export type SpeciesPalette = {
  id: SpriteSpeciesId;
  label: string;
  fur: string;
  furDeep: string;
  belly: string;
  accent: string;
  ink: string;
  nose: string;
  glow: string;
  glowDeep: string;
  egg: string;
  eggWash: string;
  eggMark: string;
  mark?: string;
};

export const SPECIES_PALETTES: Record<SpriteSpeciesId, SpeciesPalette> = {
  fox: {
    id: "fox",
    label: "Fox",
    fur: "#E07A2F",
    furDeep: "#B45316",
    belly: "#FFF4E5",
    accent: "#2A211C",
    ink: "#14110F",
    nose: "#1A1412",
    ...ETHEREAL_GLOWS.fox,
    egg: "#F3D2A8",
    eggWash: "#E07A2F",
    eggMark: "#C26A2A",
  },
  bunny: {
    id: "bunny",
    label: "Bunny",
    fur: "#FFF6EC",
    furDeep: "#E8D4C4",
    belly: "#FFFCF8",
    accent: "#F4B4C8",
    ink: "#2A211C",
    nose: "#F4A8B8",
    ...ETHEREAL_GLOWS.bunny,
    egg: "#FFF8F2",
    eggWash: "#F8D5DE",
    eggMark: "#F4B4C8",
  },
  deer: {
    id: "deer",
    label: "Deer",
    fur: "#C4A06A",
    furDeep: "#8B6A3E",
    belly: "#FFF6E8",
    accent: "#7A5530",
    ink: "#2A211C",
    nose: "#2A1C16",
    ...ETHEREAL_GLOWS.deer,
    egg: "#E8D2A8",
    eggWash: "#C4A06A",
    eggMark: "#FFF8EE",
    mark: "#FFF8EE",
  },
  cat: {
    id: "cat",
    label: "Cat",
    fur: "#1C1C1E",
    furDeep: "#0B0B0F",
    belly: "#2A2A2E",
    accent: "#F4B4C8",
    ink: "#F8FAFC",
    nose: "#F4A8B8",
    ...ETHEREAL_GLOWS.cat,
    egg: "#2A2A30",
    eggWash: "#18181C",
    eggMark: "#A1A1AA",
  },
  axolotl: {
    id: "axolotl",
    label: "Axolotl",
    fur: "#F7C4D0",
    furDeep: "#E07A96",
    belly: "#FFE4EC",
    accent: "#E87A9A",
    ink: "#3A2430",
    nose: "#C45A78",
    ...ETHEREAL_GLOWS.axolotl,
    egg: "#F8D0DA",
    eggWash: "#F4A4B8",
    eggMark: "#E87A9A",
  },
  dragon: {
    id: "dragon",
    label: "Dragon",
    fur: "#8FB176",
    furDeep: "#5F7A48",
    belly: "#F3EBD8",
    accent: "#C9B48A",
    ink: "#1F2A1E",
    nose: "#3A4638",
    ...ETHEREAL_GLOWS.dragon,
    egg: "#D5E4C4",
    eggWash: "#8FB176",
    eggMark: "#5F7A48",
  },
};

const SHAPE_TO_ANIMAL: Record<string, SpriteSpeciesId> = {
  "twin-peak": "dragon",
  teardrop: "bunny",
  mochi: "fox",
  cloud: "deer",
  wisp: "axolotl",
  bean: "cat",
  star: "fox",
};

export function normalizeSpriteSpecies(
  raw: string | undefined | null,
): SpriteSpeciesId {
  if (raw && (SPRITE_SPECIES as readonly string[]).includes(raw)) {
    return raw as SpriteSpeciesId;
  }
  if (raw && SHAPE_TO_ANIMAL[raw]) return SHAPE_TO_ANIMAL[raw];
  return DEFAULT_SPECIES;
}

/** Default mint tint means natural species fur — mint glow is Dragon + brand only. */
export function usesNaturalBody(tint: SparkTintId | string | undefined) {
  return !tint || tint === "mint";
}

export function spriteBodyPalette(
  species: SpriteSpeciesId,
  tint: SparkTintId | undefined,
): SpeciesPalette {
  const natural = SPECIES_PALETTES[species] ?? SPECIES_PALETTES.fox;
  if (usesNaturalBody(tint) || !tint) return natural;
  const wash = getSparkTint(tint);
  return {
    ...natural,
    fur: wash.mid,
    furDeep: wash.lo,
    belly: wash.hi,
    accent: wash.lo,
  };
}
