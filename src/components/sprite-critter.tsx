import { CAT_HEART, ETHEREAL_GLOWS } from "@/lib/species-glows";
import type { SpeciesPalette, SpriteSpeciesId } from "@/lib/sprite-species";
import type { CareStage } from "@/lib/stats";

type CritterMood =
  | "idle"
  | "locked"
  | "earning"
  | "done"
  | "tempted"
  | "annoyed"
  | "sleepy"
  | "eating";

type SpriteCritterProps = {
  species: SpriteSpeciesId;
  palette: SpeciesPalette;
  mood: CritterMood;
  stage: CareStage;
  stageGlow: boolean;
  extraMagical?: boolean;
  uid?: string;
};

const EYE_INK = "#16120F";

function GlossyEye({
  cx,
  cy,
  look,
  extraMagical,
  glow,
  glowDeep,
  fillId,
}: {
  cx: number;
  cy: number;
  look: number;
  extraMagical: boolean;
  glow: string;
  glowDeep: string;
  fillId: string;
}) {
  const x = cx + look;
  return (
    <g>
      {extraMagical ? (
        <ellipse
          cx={x}
          cy={cy}
          rx="11.4"
          ry="12.2"
          fill={glow}
          fillOpacity="0.42"
        />
      ) : null}
      <ellipse
        cx={x}
        cy={cy}
        rx={extraMagical ? 7.8 : 7.2}
        ry={extraMagical ? 9.2 : 8.6}
        fill={extraMagical ? `url(#${fillId})` : EYE_INK}
      />
      {extraMagical ? (
        <ellipse
          cx={x}
          cy={cy + 0.4}
          rx="3.4"
          ry="4.1"
          fill={glowDeep}
          fillOpacity="0.55"
        />
      ) : (
        <ellipse
          cx={x}
          cy={cy + 0.6}
          rx="3.1"
          ry="3.8"
          fill="#0B0B0F"
          fillOpacity="0.55"
        />
      )}
      <ellipse
        className="spark-pupil"
        cx={x - 1.7}
        cy={cy - 2.4}
        rx="2.35"
        ry="2.85"
        fill="#fff"
        fillOpacity="0.96"
      />
      <ellipse
        cx={x + 2.1}
        cy={cy + 1.6}
        rx="0.85"
        ry="1.05"
        fill="#fff"
        fillOpacity="0.72"
      />
      <ellipse
        cx={x + 0.2}
        cy={cy + 3.6}
        rx="2.4"
        ry="1.15"
        fill="#fff"
        fillOpacity="0.18"
      />
    </g>
  );
}
