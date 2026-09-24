import type { CareStage } from "./care-stages.ts";
import { SPRITE_SPECIES, type SpriteSpeciesId } from "./species-glows.ts";

export const ILLUSTRATED_STAGES = [
  "egg",
  "hatchling",
  "growing",
  "luminary",
  "ethereal",
] as const;

/** Painted cutouts for every quiz species. SVG is only the 404 fallback. */
export const ILLUSTRATED_SPECIES = SPRITE_SPECIES;

export function spriteArtSrc(
  species: SpriteSpeciesId | string,
  stage: CareStage | string,
): string | null {
  if (!(ILLUSTRATED_SPECIES as readonly string[]).includes(species)) return null;
  if (!(ILLUSTRATED_STAGES as readonly string[]).includes(stage)) return null;
  return `/sprites/${species}/${stage}.webp`;
}
