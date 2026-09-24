import type { CareStage } from "@/lib/stats";
import type { SpeciesPalette, SpriteSpeciesId } from "@/lib/sprite-species";

/** Soft stage glow behind the inline SVG critter. */
export function SpriteFxLayers({
  palette,
  stage,
  stageGlow,
  extraMagical = false,
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
    <g className="sprite-fx-layers" aria-hidden>
      <ellipse
        cx="50"
        cy="72"
        rx={magical ? 52 : stage === "ethereal" ? 42 : 34}
        ry={magical ? 50 : stage === "ethereal" ? 40 : 30}
        fill={palette.glow}
        fillOpacity={magical ? 0.38 : stage === "ethereal" ? 0.2 : 0.12}
      />
      {magical ? (
        <ellipse
          cx="50"
          cy="42"
          rx="36.5"
          ry="38.5"
          fill="none"
          stroke={palette.glow}
          strokeWidth="1.2"
          strokeDasharray="1.5 3.8"
          opacity="0.55"
        />
      ) : null}
    </g>
  );
}
