import type { SparkAuraId } from "./spark-auras.ts";
import type { SpriteSpeciesId } from "./species-glows.ts";

export const STUDY_STYLES = [
  "night-owl",
  "social-sprint",
  "steady-marathon",
  "deep-dive",
  "calm-plan",
  "bold-challenge",
] as const;

export type StudyStyleId = (typeof STUDY_STYLES)[number];

export type StudyStyleResult = {
  id: StudyStyleId;
  title: string;
  glowName: string;
  aura: SparkAuraId;
  species: SpriteSpeciesId;
  line: string;
};

export const STUDY_STYLE_RESULTS: Record<StudyStyleId, StudyStyleResult> = {
  "night-owl": {
    id: "night-owl",
    title: "Night owl sprinter",
    glowName: "amber",
    aura: "amber",
    species: "fox",
    line: "You wait for the right window, then finish in one hot burst.",
  },
  "social-sprint": {
    id: "social-sprint",
    title: "Social sprinter",
    glowName: "pearl pink",
    aura: "pearl",
    species: "bunny",
    line: "Work is lighter with someone else in the room. You pull people in.",
  },
  "steady-marathon": {
    id: "steady-marathon",
    title: "Steady marathoner",
    glowName: "gold-green",
    aura: "grove",
    species: "deer",
    line: "A little every day. Calm structure beats a last-minute scramble.",
  },
  "deep-dive": {
    id: "deep-dive",
    title: "Deep-dive explorer",
    glowName: "magenta",
    aura: "magenta",
    species: "cat",
    line: "You protect the block, sink in, and let the rest of the world wait.",
  },
  "calm-plan": {
    id: "calm-plan",
    title: "Calm planner",
    glowName: "hot pink",
    aura: "hotpink",
    species: "axolotl",
    line: "You keep the week soft and mapped. Kindness first, then the work.",
  },
  "bold-challenge": {
    id: "bold-challenge",
    title: "Bold challenger",
    glowName: "mint-teal",
    aura: "mint",
    species: "dragon",
    line: "You want the spark — a dare, a timer, a reason to push.",
  },
};

export const DEFAULT_STUDY_STYLE: StudyStyleId = "bold-challenge";

const LEGACY_SPECIES: Record<string, StudyStyleId> = {
  fox: "night-owl",
  bunny: "social-sprint",
  deer: "steady-marathon",
  cat: "deep-dive",
  axolotl: "calm-plan",
  dragon: "bold-challenge",
  "twin-peak": "bold-challenge",
  teardrop: "social-sprint",
  mochi: "night-owl",
  cloud: "steady-marathon",
  wisp: "calm-plan",
  star: "night-owl",
  bean: "deep-dive",
};

export function normalizeStudyStyle(raw?: string | null): StudyStyleId {
  if (raw && (STUDY_STYLES as readonly string[]).includes(raw)) {
    return raw as StudyStyleId;
  }
  if (raw && LEGACY_SPECIES[raw]) return LEGACY_SPECIES[raw];
  return DEFAULT_STUDY_STYLE;
}

export function studyStyleResult(id?: string | null): StudyStyleResult {
  return STUDY_STYLE_RESULTS[normalizeStudyStyle(id)];
}
