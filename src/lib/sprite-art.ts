import type { CareStage } from "./care-stages.ts";
import { SPRITE_SPECIES, type SpriteSpeciesId } from "./species-glows.ts";

export const ILLUSTRATED_STAGES = [
  "egg",
  "hatchling",
  "growing",
  "luminary",
  "ethereal",
] as const;

export const ILLUSTRATED_SPECIES = SPRITE_SPECIES;

/** Image plates are unused. The study buddy is inline SVG. */
export function spriteArtSrc(
  _species?: SpriteSpeciesId | string,
  _stage?: CareStage | string,
): string | null {
  return null;
}
