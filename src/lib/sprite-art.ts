import type { CareStage } from "./care-stages.ts";
import type { SpriteSpeciesId } from "./species-glows.ts";

export const ILLUSTRATED_STAGES = [
  "egg",
  "hatchling",
  "growing",
  "luminary",
  "ethereal",
] as const;

/** Painted cutouts shipped first for Fox. Other species fall back to SVG. */
export const ILLUSTRATED_SPECIES = ["fox"] as const;

export function spriteArtSrc(
  species: SpriteSpeciesId | string,
  stage: CareStage | string,
): string | null {
  if (species !== "fox") return null;
  if (!(ILLUSTRATED_STAGES as readonly string[]).includes(stage)) return null;
  return `/sprites/fox/${stage}.webp`;
}
