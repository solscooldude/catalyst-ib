export const CARE_STAGES = [
  "egg",
  "hatchling",
  "growing",
  "luminary",
  "ethereal",
] as const;

export type CareStage = (typeof CARE_STAGES)[number];

const LEGACY_GROWING = new Set(["sparklet", "steady", "bright", "growing"]);

/** Official hours + streak + care. Luminary at 32; Ethereal after that at 64. */
export const LUMINARY_SCORE = 32;
export const ETHEREAL_SCORE = 64;

export const CARE_STAGE_GUIDE: {
  stage: CareStage;
  label: string;
  how: string;
}[] = [
  {
    stage: "egg",
    label: "Egg",
    how: "Closed egg. First real focus or snack hatches it into Hatchling.",
  },
  {
    stage: "hatchling",
    label: "Hatchling",
    how: "Just out. Tiny chibi body, almost no glow.",
  },
  {
    stage: "growing",
    label: "Growing",
    how: "Full little-critter shape. Study hours, streak, and snacks.",
  },
  {
    stage: "luminary",
    label: "Luminary",
    how: "Signature aura around a natural-colour body. Longer official hours.",
  },
  {
    stage: "ethereal",
    label: "Ethereal",
    how: "Final form after Luminary. Signature glow, still a natural body. Extra Magical is optional: glowing eyes, stronger aura, more sparkles, faint halo.",
  },
];

export const STAGE_LOOK: Record<CareStage, { scale: number; glow: number }> = {
  egg: { scale: 0.8, glow: 0.22 },
  hatchling: { scale: 0.78, glow: 0.28 },
  growing: { scale: 1, glow: 0.42 },
  luminary: { scale: 1.12, glow: 1.72 },
  ethereal: { scale: 1.2, glow: 2.35 },
};

export function normalizeCareStage(raw: string | undefined | null): CareStage {
  if (!raw) return "egg";
  if (LEGACY_GROWING.has(raw)) return "growing";
  if ((CARE_STAGES as readonly string[]).includes(raw)) return raw as CareStage;
  return "egg";
}

export function stageFromScore(score: number, hatched: boolean): CareStage {
  if (!hatched) return "egg";
  if (score < 2.2) return "hatchling";
  if (score < LUMINARY_SCORE) return "growing";
  if (score < ETHEREAL_SCORE) return "luminary";
  return "ethereal";
}

export function sparkEvolutionLabel(stage: CareStage) {
  return CARE_STAGE_GUIDE.find((row) => row.stage === stage)?.label ?? "Egg";
}

/** Luminary/Ethereal use the species signature glow — not a shared mint wash. */
export function signatureGlowForStage(stage: CareStage) {
  return stage === "luminary" || stage === "ethereal";
}

export const mintGlowForStage = signatureGlowForStage;
