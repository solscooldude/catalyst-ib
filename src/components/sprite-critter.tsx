import type { EggCrackLevel } from "@/lib/care";
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
  squint?: boolean;
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
          className="sprite-eye-bloom"
          cx={x}
          cy={cy}
          rx="14.4"
          ry="15.2"
          fill={glow}
          fillOpacity="0.42"
        />
      ) : null}
      <ellipse
        cx={x}
        cy={cy}
        rx={extraMagical ? 9.6 : 9.1}
        ry={extraMagical ? 11.2 : 10.6}
        fill={extraMagical ? `url(#${fillId})` : EYE_INK}
      />
      <ellipse
        cx={x}
        cy={cy + 0.6}
        rx="3.4"
        ry="4.2"
        fill={extraMagical ? glowDeep : "#0B0B0F"}
        fillOpacity={extraMagical ? 0.5 : 0.48}
      />
      <ellipse
        className="spark-pupil"
        cx={x - 2.1}
        cy={cy - 2.8}
        rx="2.7"
        ry="3.3"
        fill="#fff"
        fillOpacity="0.98"
      />
      <ellipse
        cx={x + 2.4}
        cy={cy + 1.4}
        rx="1.05"
        ry="1.25"
        fill="#fff"
        fillOpacity="0.78"
      />
      <ellipse
        cx={x + 0.2}
        cy={cy + 4.1}
        rx="2.6"
        ry="1.2"
        fill="#fff"
        fillOpacity="0.16"
      />
    </g>
  );
}

const MOUTH_Y: Record<SpriteSpeciesId, number> = {
  fox: 64.6,
  bunny: 63.1,
  deer: 64.8,
  cat: 66.5,
  axolotl: 63.4,
  dragon: 64.9,
};

function catMouthPath(y: number, half: number, dip: number) {
  const left = 50 - half;
  const right = 50 + half;
  const pull = half * 0.44;
  return `M${left} ${y}C${left + pull} ${y + dip} ${50 - pull} ${y + dip} 50 ${y}C${50 + pull} ${y + dip} ${right - pull} ${y + dip} ${right} ${y}`;
}

function CatMouth({
  ink,
  species,
  wide = false,
}: {
  ink: string;
  species: SpriteSpeciesId;
  wide?: boolean;
}) {
  return (
    <path
      d={catMouthPath(MOUTH_Y[species], wide ? 8.8 : 7.45, wide ? 3.45 : 2.85)}
      fill="none"
      stroke={ink}
      strokeWidth={wide ? 1.9 : 1.72}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
}

function SpeciesNose({
  species,
  palette,
}: {
  species: SpriteSpeciesId;
  palette: SpeciesPalette;
}) {
  if (species === "fox") {
    return (
      <g>
        <ellipse cx="50" cy="61.4" rx="8.4" ry="5.6" fill={palette.belly} />
        <path
          d="M50 57.6c-2.1 0-3.4 1.7-2.4 3.2.6.9 1.6 1.4 2.4 1.4s1.8-.5 2.4-1.4c1-1.5-.3-3.2-2.4-3.2Z"
          fill={palette.nose}
        />
        <ellipse cx="49.2" cy="58.8" rx="0.7" ry="0.45" fill="#fff" opacity="0.35" />
      </g>
    );
  }
  if (species === "bunny") {
    return <ellipse cx="50" cy="59.2" rx="1.55" ry="1.25" fill={palette.nose} />;
  }
  if (species === "deer") {
    return (
      <g>
        <ellipse cx="50" cy="61.8" rx="7.6" ry="5.2" fill={palette.belly} />
        <ellipse cx="50" cy="60.2" rx="2.55" ry="2.15" fill={palette.nose} />
        <ellipse cx="49.1" cy="59.3" rx="0.85" ry="0.55" fill="#fff" opacity="0.45" />
      </g>
    );
  }
  if (species === "cat") {
    return (
      <g>
        <path d="M50 58.4 47.7 61.1h4.6Z" fill={palette.nose} />
        <g
          fill="none"
          stroke="#3F3F46"
          strokeWidth="0.85"
          strokeLinecap="round"
          opacity="0.62"
        >
          <path d="M34 59.6c-5.2.4-8.4 2.2-10.2 4" />
          <path d="M34.6 62.2c-5 .8-8.2 2.8-9.6 4.8" />
          <path d="M66 59.6c5.2.4 8.4 2.2 10.2 4" />
          <path d="M65.4 62.2c5 .8 8.2 2.8 9.6 4.8" />
        </g>
      </g>
    );
  }
  if (species === "axolotl") {
    return (
      <g>
        <circle cx="47.6" cy="59.6" r="0.7" fill={palette.nose} />
        <circle cx="52.4" cy="59.6" r="0.7" fill={palette.nose} />
      </g>
    );
  }
  return (
    <g>
      <ellipse cx="50" cy="61.8" rx="8.2" ry="4.8" fill={palette.furDeep} />
      <ellipse cx="50" cy="61.2" rx="7.2" ry="4.1" fill={palette.fur} />
      <circle cx="47.8" cy="60.4" r="0.7" fill={palette.nose} />
      <circle cx="52.2" cy="60.4" r="0.7" fill={palette.nose} />
    </g>
  );
}
