import type { CareStage } from "@/lib/stats";
import type { SpeciesPalette, SpriteSpeciesId } from "@/lib/sprite-species";

/** Soft stage glow behind the inline SVG critter. */
export function SpriteFxLayers({
  palette,
  stage,
  stageGlow,
  extraMagical = false,
  uid = "sprite-fx",
}: {
  species: SpriteSpeciesId;
  palette: SpeciesPalette;
  stage: CareStage;
  stageGlow: boolean;
  extraMagical?: boolean;
  uid?: string;
}) {
  if (!stageGlow) return null;
  const magical = extraMagical && stage === "ethereal";
  return (
    <g className="sprite-fx-layers sprite-stage-glow" aria-hidden>
      <defs>
        <radialGradient id={`${uid}-fx-stage`} cx="50%" cy="48%" r="50%">
          <stop offset="0%" stopColor={palette.glow} stopOpacity={magical ? 0.28 : 0.16} />
          <stop offset="36%" stopColor={palette.glow} stopOpacity={magical ? 0.12 : 0.07} />
          <stop offset="68%" stopColor={palette.glow} stopOpacity={magical ? 0.04 : 0.025} />
          <stop offset="100%" stopColor={palette.glow} stopOpacity="0" />
        </radialGradient>
        <filter id={`${uid}-fx-soft`} x="-75%" y="-75%" width="250%" height="250%">
          <feGaussianBlur stdDeviation="10.4" />
        </filter>
      </defs>
      <ellipse
        cx="50"
        cy="62"
        rx={magical ? 70 : stage === "ethereal" ? 62 : 48}
        ry={magical ? 68 : stage === "ethereal" ? 60 : 46}
        fill={`url(#${uid}-fx-stage)`}
        filter={`url(#${uid}-fx-soft)`}
      />
    </g>
  );
}
