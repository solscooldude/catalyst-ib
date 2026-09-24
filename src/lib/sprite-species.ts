import { getSparkTint, type SparkTintId } from "@/lib/spark-tints";

export const SPRITE_SPECIES = [
  "fox",
  "bunny",
  "deer",
  "cat",
  "axolotl",
  "dragon",
] as const;

export type SpriteSpeciesId = (typeof SPRITE_SPECIES)[number];

export const DEFAULT_SPECIES: SpriteSpeciesId = "fox";

export const BRAND_MINT = "#5EEAD4";

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
    glow: "#F5B942",
    glowDeep: "#F59E0B",
  },
  bunny: {
    id: "bunny",
    label: "Bunny",
    fur: "#F3E6D6",
    furDeep: "#D6C2AE",
    belly: "#FFFBF5",
    accent: "#F4B4B8",
    ink: "#2A211C",
    nose: "#E8A0A8",
    glow: "#F5D0FE",
    glowDeep: "#C4B5FD",
  },
  deer: {
    id: "deer",
    label: "Deer",
    fur: "#C4A06A",
    furDeep: "#8B6A3E",
    belly: "#FFF6E8",
    accent: "#7A5530",
    ink: "#2A211C",
    nose: "#3A2A20",
    glow: "#FDE68A",
    glowDeep: "#A3E635",
    mark: "#FFF8EE",
  },
  cat: {
    id: "cat",
    label: "Cat",
    fur: "#1C1C1E",
    furDeep: "#0B0B0F",
    belly: "#2A2A2E",
    accent: "#F4A4B8",
    ink: "#F8FAFC",
    nose: "#F4A4B8",
    glow: "#E879F9",
    glowDeep: "#C084FC",
  },
  axolotl: {
    id: "axolotl",
    label: "Axolotl",
    fur: "#F5B6C4",
    furDeep: "#E07A96",
    belly: "#FFE4EC",
    accent: "#E87A9A",
    ink: "#3A2430",
    nose: "#C45A78",
    glow: "#F472B6",
    glowDeep: "#FB7185",
  },
  dragon: {
    id: "dragon",
    label: "Dragon",
    fur: "#8BA888",
    furDeep: "#5F7A5C",
    belly: "#D7E6CF",
    accent: "#E8D7B0",
    ink: "#1F2A1E",
    nose: "#3A4638",
    glow: "#5EEAD4",
    glowDeep: "#2DD4BF",
  },
};

export function normalizeSpriteSpecies(
  raw: string | undefined | null,
): SpriteSpeciesId {
  if (raw && (SPRITE_SPECIES as readonly string[]).includes(raw)) {
    return raw as SpriteSpeciesId;
  }
  return DEFAULT_SPECIES;
}

/** Default mint tint means natural species fur — mint is glow only. */
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
