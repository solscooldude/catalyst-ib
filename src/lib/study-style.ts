import type { SparkAuraId } from "./spark-auras";

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
  line: string;
};

export const STUDY_STYLE_RESULTS: Record<StudyStyleId, StudyStyleResult> = {
  "night-owl": {
    id: "night-owl",
    title: "Night owl sprinter",
    glowName: "amber",
    aura: "amber",
    line: "You cut a smarter path, save energy for the hard parts, and finish in a burst.",
  },
  "social-sprint": {
    id: "social-sprint",
    title: "Social sprinter",
    glowName: "pearl pink",
    aura: "pearl",
    line: "Work feels lighter with people nearby. You pull others in and keep going.",
  },
  "steady-marathon": {
    id: "steady-marathon",
    title: "Steady marathoner",
    glowName: "gold-green",
    aura: "grove",
    line: "A little every day. Calm structure beats a last-minute scramble.",
  },
  "deep-dive": {
    id: "deep-dive",
    title: "Deep-dive explorer",
    glowName: "magenta",
    aura: "magenta",
    line: "You protect the block, sink in, and let the rest of the world wait.",
  },
  "calm-plan": {
    id: "calm-plan",
    title: "Calm planner",
    glowName: "hot pink",
    aura: "hotpink",
    line: "You recover soft, then map the week. Kindness first, then the work.",
  },
  "bold-challenge": {
    id: "bold-challenge",
    title: "Bold challenger",
    glowName: "mint-teal",
    aura: "mint",
    line: "You want the spark — intensity, a dare, and a reason to push.",
  },
};

export const DEFAULT_STUDY_STYLE: StudyStyleId = "night-owl";

const LEGACY_SPECIES: Record<string, StudyStyleId> = {
  fox: "night-owl",
  bunny: "social-sprint",
  deer: "steady-marathon",
  cat: "deep-dive",
  axolotl: "calm-plan",
  dragon: "bold-challenge",
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
