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

function Face({
  mood,
  ink,
  nose,
  species,
  glow,
  glowDeep,
  extraMagical,
  uid,
}: {
  mood: CritterMood;
  ink: string;
  nose: string;
  species: SpriteSpeciesId;
  glow: string;
  glowDeep: string;
  extraMagical: boolean;
  uid: string;
}) {
  const look = mood === "tempted" ? 2.2 : 0;
  if (mood === "done") {
    return (
      <g fill="none" stroke={ink} strokeWidth="2" strokeLinecap="round">
        <path d="M36 49c2.4-3.4 7.6-3.4 10 0" />
        <path d="M54 49c2.4-3.4 7.6-3.4 10 0" />
        <path d="M46 61c1.4 1.6 6.6 1.6 8 0" />
      </g>
    );
  }
  if (mood === "annoyed") {
    return (
      <g fill="none" stroke={ink} strokeWidth="2.1" strokeLinecap="round">
        <path d="M35 48h11" />
        <path d="M54 48h11" />
      </g>
    );
  }
  if (mood === "sleepy") {
    return (
      <g fill="none" stroke={ink} strokeWidth="2.1" strokeLinecap="round">
        <path d="M35 51c2.6 2.2 8.2 2.2 10.8 0" />
        <path d="M54.2 51c2.6 2.2 8.2 2.2 10.8 0" />
      </g>
    );
  }
  if (mood === "eating") {
    return (
      <g>
        <ellipse cx="40.2" cy="50.4" rx="4.1" ry="3" fill={EYE_INK} />
        <ellipse cx="59.8" cy="50.4" rx="4.1" ry="3" fill={EYE_INK} />
        <ellipse className="spark-chew" cx="50" cy="62.4" rx="5.8" ry="3.1" fill="#0B0B0F" />
      </g>
    );
  }
  return (
    <g>
      <GlossyEye
        cx={39.6}
        cy={49.2}
        look={look}
        extraMagical={extraMagical}
        glow={glow}
        glowDeep={glowDeep}
        fillId={`${uid}-eye`}
      />
      <GlossyEye
        cx={60.4}
        cy={49.2}
        look={look}
        extraMagical={extraMagical}
        glow={glow}
        glowDeep={glowDeep}
        fillId={`${uid}-eye`}
      />
      {species === "cat" ? (
        <path
          d="M50 58.4c-2.4 2.6-5.4.4-3.2-1.8 1.3-1.3 3.2-.4 3.2 1.8 0-2.2 1.9-3.1 3.2-1.8 2.2 2.2-.8 4.4-3.2 1.8Z"
          fill={nose}
        />
      ) : (
        <ellipse cx="50" cy="58.8" rx="2.15" ry="1.55" fill={nose} />
      )}
    </g>
  );
}
