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
    egg: "#E8893A",
    eggWash: "#FFF3DC",
    eggMark: "#C45A18",
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
    egg: "#F4C4D0",
    eggWash: "#FBE0E8",
    eggMark: "#E8A0B4",
  },
  deer: {
    id: "deer",
    label: "Deer",
    fur: "#B8773F",
    furDeep: "#8A4A24",
    belly: "#FFF6E8",
    accent: "#6B3A1C",
    ink: "#2A211C",
    nose: "#2A1C16",
    ...ETHEREAL_GLOWS.deer,
    egg: "#C8894E",
    eggWash: "#E8C9A0",
    eggMark: "#FFF8EE",
    mark: "#FFF8EE",
  },
  cat: {
    id: "cat",
    label: "Cat",
    fur: "#1C1C1E",
    furDeep: "#0B0B0F",
    belly: "#FFF8F4",
    accent: "#F4B4C8",
    ink: "#F8FAFC",
    nose: "#F4A8B8",
    ...ETHEREAL_GLOWS.cat,
    egg: "#1C1C1E",
    eggWash: "#3A3A40",
    eggMark: "#FFF8F4",
    mark: "#FFF8F4",
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
    egg: "#F5C2CE",
    eggWash: "#FFE4EC",
    eggMark: "#E89AAD",
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
    egg: "#4EA8A6",
    eggWash: "#8ED4D0",
    eggMark: "#2F7A78",
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
