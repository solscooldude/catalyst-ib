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
          rx="12.2"
          ry="13.2"
          fill={glow}
          fillOpacity="0.38"
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
    return (
      <g>
        <ellipse cx="50" cy="59.2" rx="1.55" ry="1.25" fill={palette.nose} />
        <path
          d="M50 60.3v3.1M50 62.2c-2.1 1.4-3.6 1.2-4.4.4M50 62.2c2.1 1.4 3.6 1.2 4.4.4"
          fill="none"
          stroke={palette.ink}
          strokeWidth="1.05"
          strokeLinecap="round"
        />
      </g>
    );
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
        <path
          d="M50 61.1c-2.4 1.7-4.2 1.5-5.2.3M50 61.1c2.4 1.7 4.2 1.5 5.2.3"
          fill="none"
          stroke={palette.ink}
          strokeWidth="1.05"
          strokeLinecap="round"
        />
        <g
          fill="none"
          stroke={palette.ink}
          strokeWidth="0.85"
          strokeLinecap="round"
          opacity="0.55"
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
        <path
          d="M44.8 63.4c1.8 2.6 8.6 2.6 10.4 0"
          fill="none"
          stroke={palette.ink}
          strokeWidth="1.2"
          strokeLinecap="round"
        />
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

function Face({
  mood,
  ink,
  species,
  palette,
  glow,
  glowDeep,
  extraMagical,
  uid,
}: {
  mood: CritterMood;
  ink: string;
  species: SpriteSpeciesId;
  palette: SpeciesPalette;
  glow: string;
  glowDeep: string;
  extraMagical: boolean;
  uid: string;
}) {
  const look = mood === "tempted" ? 2.2 : 0;
  if (mood === "done") {
    return (
      <g fill="none" stroke={ink} strokeWidth="1.9" strokeLinecap="round">
        <path d="M35 47.6c2.6-3.6 8.2-3.6 10.8 0" />
        <path d="M54.2 47.6c2.6-3.6 8.2-3.6 10.8 0" />
        <path d="M45.6 60.6c1.6 1.8 7.2 1.8 8.8 0" />
      </g>
    );
  }
  if (mood === "annoyed") {
    return (
      <g fill="none" stroke={ink} strokeWidth="2" strokeLinecap="round">
        <path d="M34 47h12" />
        <path d="M54 47h12" />
      </g>
    );
  }
  if (mood === "sleepy") {
    return (
      <g fill="none" stroke={ink} strokeWidth="2" strokeLinecap="round">
        <path d="M34 50c2.8 2.4 8.8 2.4 11.6 0" />
        <path d="M54.4 50c2.8 2.4 8.8 2.4 11.6 0" />
      </g>
    );
  }
  if (mood === "eating") {
    return (
      <g>
        <ellipse cx="39.8" cy="48.8" rx="4.2" ry="3.1" fill={EYE_INK} />
        <ellipse cx="60.2" cy="48.8" rx="4.2" ry="3.1" fill={EYE_INK} />
        <ellipse className="spark-chew" cx="50" cy="61.6" rx="5.6" ry="3" fill="#0B0B0F" />
      </g>
    );
  }
  return (
    <g>
      <GlossyEye
        cx={38.8}
        cy={47.6}
        look={look}
        extraMagical={extraMagical}
        glow={glow}
        glowDeep={glowDeep}
        fillId={`${uid}-eye`}
      />
      <GlossyEye
        cx={61.2}
        cy={47.6}
        look={look}
        extraMagical={extraMagical}
        glow={glow}
        glowDeep={glowDeep}
        fillId={`${uid}-eye`}
      />
      <SpeciesNose species={species} palette={palette} />
    </g>
  );
}

function SpeciesExtras({
  species,
  palette,
  stage,
}: {
  species: SpriteSpeciesId;
  palette: SpeciesPalette;
  stage: CareStage;
}) {
  if (species === "bunny") {
    return (
      <g>
        <path
          d="M31 22c-3.6-16 8.4-26 13.2-12 2.6 7.6 1.4 18.4-1.6 24.8-2.6 1.2-6.8-1.6-11.6-12.8Z"
          fill={palette.fur}
        />
        <path
          d="M35.4 20c-1.6-10 5.2-16.4 8.2-8.4 1.6 4.6.6 12.2-1.4 16.8-2.2.4-5.2-1.8-6.8-8.4Z"
          fill={palette.accent}
        />
        <path
          d="M69 22c3.6-16-8.4-26-13.2-12-2.6 7.6-1.4 18.4 1.6 24.8 2.6 1.2 6.8-1.6 11.6-12.8Z"
          fill={palette.fur}
        />
        <path
          d="M64.6 20c1.6-10-5.2-16.4-8.2-8.4-1.6 4.6-.6 12.2 1.4 16.8 2.2.4 5.2-1.8 6.8-8.4Z"
          fill={palette.accent}
        />
      </g>
    );
  }
  if (species === "deer") {
    const grown = stage === "luminary" || stage === "ethereal";
    const sprout = stage === "hatchling";
    return (
      <g>
        {sprout ? (
          <>
            <path d="M38 18v-5" fill="none" stroke={palette.accent} strokeWidth="1.6" strokeLinecap="round" />
            <path d="M62 18v-5" fill="none" stroke={palette.accent} strokeWidth="1.6" strokeLinecap="round" />
          </>
        ) : (
          <>
            <path
              d={grown ? "M37 14 31-1c4.2 2 8.4 9 10.4 16" : "M38 16 34 4c4 2 7 8 8 14"}
              fill="none"
              stroke={palette.accent}
              strokeWidth={grown ? 2 : 1.7}
              strokeLinecap="round"
            />
            <path
              d={grown ? "M63 14 69-1c-4.2 2-8.4 9-10.4 16" : "M62 16 66 4c-4 2-7 8-8 14"}
              fill="none"
              stroke={palette.accent}
              strokeWidth={grown ? 2 : 1.7}
              strokeLinecap="round"
            />
            {grown ? (
              <>
                <path d="M34 6l-6-5" fill="none" stroke={palette.accent} strokeWidth="1.5" strokeLinecap="round" />
                <path d="M66 6l6-5" fill="none" stroke={palette.accent} strokeWidth="1.5" strokeLinecap="round" />
              </>
            ) : null}
            {stage === "ethereal" ? (
              <>
                <circle cx="31" cy="0" r="1.3" fill={palette.glow} />
                <circle cx="69" cy="0" r="1.3" fill={palette.glowDeep} />
              </>
            ) : null}
          </>
        )}
        <ellipse cx="44" cy="86" rx="2" ry="1.45" fill={palette.mark ?? palette.belly} />
        <ellipse cx="56" cy="87.6" rx="1.7" ry="1.25" fill={palette.mark ?? palette.belly} />
        <ellipse cx="40.4" cy="91.2" rx="1.4" ry="1.05" fill={palette.mark ?? palette.belly} />
        <ellipse cx="59.6" cy="90.6" rx="1.3" ry="0.95" fill={palette.mark ?? palette.belly} />
      </g>
    );
  }
  if (species === "axolotl") {
    return (
      <g>
        <path d="M22 42c-9.6-1.6-14 8.4-7.6 13.6 4.2 3.4 10.2 1.4 12.4-4.2Z" fill={palette.accent} />
        <path d="M21 34c-8.6-7.6-3.4-15.6 4.2-11.4 4.8 2.2 7.6 7.6 5.4 13.4Z" fill={palette.accent} />
        <path d="M24 52c-8.2 2-10.8 11.2-4.2 14.4 4.6 2.2 9.6-1 11.2-6.2Z" fill={palette.furDeep} />
        <path d="M78 42c9.6-1.6 14 8.4 7.6 13.6-4.2 3.4-10.2 1.4-12.4-4.2Z" fill={palette.accent} />
        <path d="M79 34c8.6-7.6 3.4-15.6-4.2-11.4-4.8 2.2-7.6 7.6-5.4 13.4Z" fill={palette.accent} />
        <path d="M76 52c8.2 2 10.8 11.2 4.2 14.4-4.6 2.2-9.6-1-11.2-6.2Z" fill={palette.furDeep} />
      </g>
    );
  }
  if (species === "dragon") {
    return (
      <g>
        <path d="M29 16c-1.4-8.4 6.6-12.6 10.2-5.2 1.6 3.4.2 8.4-2.8 10.6Z" fill={palette.accent} />
        <path d="M71 16c1.4-8.4-6.6-12.6-10.2-5.2-1.6 3.4-.2 8.4 2.8 10.6Z" fill={palette.accent} />
        <path d="M20 74c-11.2-3.2-15.6 8.4-7.2 15.2 9.6 3.6 15.6-2.2 17.4-8Z" fill={palette.furDeep} opacity="0.92" />
        <path d="M80 74c11.2-3.2 15.6 8.4 7.2 15.2-9.6 3.6-15.6-2.2-17.4-8Z" fill={palette.furDeep} opacity="0.92" />
      </g>
    );
  }
  return null;
}

function Ears({ species, palette }: { species: SpriteSpeciesId; palette: SpeciesPalette }) {
  if (species === "bunny" || species === "axolotl") return null;
  if (species === "cat") {
    return (
      <g>
        <path d="M27 34c-2.4-16 16.8-20 20.4-6.4-6.4 1.8-13.6 4.4-20.4 6.4Z" fill={palette.fur} />
        <path d="M73 34c2.4-16-16.8-20-20.4-6.4 6.4 1.8 13.6 4.4 20.4 6.4Z" fill={palette.fur} />
        <path d="M30.4 30.4c-1-10 9.6-12.4 12.2-4.2-4.2 1.2-8.6 2.8-12.2 4.2Z" fill={palette.accent} opacity="0.7" />
        <path d="M69.6 30.4c1-10-9.6-12.4-12.2-4.2 4.2 1.2 8.6 2.8 12.2 4.2Z" fill={palette.accent} opacity="0.7" />
      </g>
    );
  }
  if (species === "deer") {
    return (
      <g>
        <path d="M29 30c-2-13.6 14.8-17.2 18-5.6-5.8 1.6-12.2 3.6-18 5.6Z" fill={palette.fur} />
        <path d="M71 30c2-13.6-14.8-17.2-18-5.6 5.8 1.6 12.2 3.6 18 5.6Z" fill={palette.fur} />
        <path d="M32 27.4c-.8-8 8.2-10 10.4-3.4-3.6 1-7.4 2.2-10.4 3.4Z" fill={palette.belly} />
        <path d="M68 27.4c.8-8-8.2-10-10.4-3.4 3.6 1 7.4 2.2 10.4 3.4Z" fill={palette.belly} />
      </g>
    );
  }
  if (species === "dragon") {
    return (
      <g>
        <path d="M29 28c-1.6-12 12.8-15.2 16-5-5.2 1.4-11 3.2-16 5Z" fill={palette.fur} />
        <path d="M71 28c1.6-12-12.8-15.2-16-5 5.2 1.4 11 3.2 16 5Z" fill={palette.fur} />
      </g>
    );
  }
  return (
    <g>
      <path d="M28 32C18 8 40 4 46 22c-6.2 2.2-12.6 6-18 10Z" fill={palette.fur} />
      <path d="M72 32C82 8 60 4 54 22c6.2 2.2 12.6 6 18 10Z" fill={palette.fur} />
      <path d="M31 28C25 14 40 12 43.6 22c-4.2 1.6-8.6 4-12.6 6Z" fill={palette.belly} />
      <path d="M69 28C75 14 60 12 56.4 22c4.2 1.6 8.6 4 12.6 6Z" fill={palette.belly} />
    </g>
  );
}

function Tail({ species, palette }: { species: SpriteSpeciesId; palette: SpeciesPalette }) {
  if (species === "bunny") {
    return <ellipse cx="67.4" cy="92.2" rx="6.4" ry="5.6" fill={palette.belly} />;
  }
  if (species === "cat") {
    return (
      <path
        d="M66 90c16 3 23-9 17.4-20"
        fill="none"
        stroke={palette.fur}
        strokeWidth="5.4"
        strokeLinecap="round"
      />
    );
  }
  if (species === "axolotl") {
    return <path d="M66 88c14.4 2.4 20.4 10.4 14 18.4-8.2 3.8-16.2-2.2-18.4-8.4Z" fill={palette.fur} />;
  }
  if (species === "dragon") {
    return (
      <g>
        <path
          d="M66 90c18 4.2 24.4-8 20.2-18.4"
          fill="none"
          stroke={palette.fur}
          strokeWidth="4.8"
          strokeLinecap="round"
        />
        <path d="M84 67.4c4.6 1.2 8.8 3.4 8.2 5.6-2.2 2.8-7.8 4.8-10.6 3.2Z" fill={palette.accent} />
      </g>
    );
  }
  if (species === "deer") {
    return <ellipse cx="66.8" cy="90.4" rx="5.2" ry="6" fill={palette.belly} />;
  }
  return (
    <g>
      <path
        d="M26 88c-16.4-6.4-20.8-25.2-8-35.2 8.2-6.4 16.4 4.2 16.2 14.4 6.2-4.2 14.4 2.2 12.2 12.4-2.2 10.4-12.4 14.6-20.4 8.4Z"
        fill={palette.fur}
      />
      <ellipse cx="16.8" cy="56.4" rx="6.6" ry="6.2" fill={palette.belly} />
      <ellipse cx="13.2" cy="50.6" rx="3.2" ry="3" fill="#FFF8EE" />
    </g>
  );
}

function HeartMark({
  x,
  y,
  scale = 1,
  fill,
}: {
  x: number;
  y: number;
  scale?: number;
  fill: string;
}) {
  return (
    <path
      transform={`translate(${x} ${y}) scale(${scale})`}
      d="M0 2.2C-1.6-.4-5-.6-6.4 1.5-8.3 4.2-6.6 7.4 0 12.2 6.4 7.4 8.1 4.2 6.2 1.5 4.8-.6 1.4-.4 0 2.2Z"
      fill={fill}
    />
  );
}

function StarMark({
  x,
  y,
  scale = 1,
  fill,
}: {
  x: number;
  y: number;
  scale?: number;
  fill: string;
}) {
  return (
    <path
      transform={`translate(${x} ${y}) scale(${scale})`}
      d="M0-4.2 1.2-1.1 4.4 0 1.2 1.1 0 4.2-1.2 1.1-4.4 0-1.2-1.1Z"
      fill={fill}
    />
  );
}

function MagicalHalo({
  glow,
  glowDeep,
  bloomId,
}: {
  glow: string;
  glowDeep: string;
  bloomId: string;
}) {
  return (
    <g className="sprite-magical-halo" aria-hidden>
      <ellipse cx="50" cy="50" rx="48" ry="50" fill={`url(#${bloomId})`} />
      <ellipse
        cx="50"
        cy="42"
        rx="36.5"
        ry="38.5"
        fill="none"
        stroke={glow}
        strokeWidth="1.2"
        strokeDasharray="1.5 3.8"
        opacity="0.62"
      />
      <ellipse
        cx="50"
        cy="42"
        rx="32.4"
        ry="34.2"
        fill="none"
        stroke={glowDeep}
        strokeWidth="0.55"
        opacity="0.38"
      />
      <path
        d="M50 1.6 52 6.2 56.6 8.2 52 10.2 50 14.8 48 10.2 43.4 8.2 48 6.2Z"
        fill={glow}
      />
      <circle cx="50" cy="8.2" r="1.05" fill="#FFFBEB" fillOpacity="0.85" />
      <circle cx="16" cy="24" r="1.15" fill={glow} />
      <circle cx="84" cy="22" r="1.05" fill={glowDeep} />
      <circle cx="24" cy="10" r="0.8" fill={glow} />
      <circle cx="76" cy="8" r="0.75" fill={glowDeep} />
      <circle cx="10" cy="48" r="0.9" fill={glow} />
      <circle cx="90" cy="46" r="0.85" fill={glowDeep} />
    </g>
  );
}

function PaintDefs({
  uid,
  palette,
}: {
  uid: string;
  palette: SpeciesPalette;
}) {
  return (
    <defs>
      <radialGradient id={`${uid}-head`} cx="34%" cy="26%" r="74%">
        <stop offset="0%" stopColor={palette.belly} stopOpacity="0.5" />
        <stop offset="42%" stopColor={palette.fur} stopOpacity="0" />
        <stop offset="100%" stopColor={palette.furDeep} stopOpacity="0.42" />
      </radialGradient>
      <radialGradient id={`${uid}-body`} cx="40%" cy="26%" r="78%">
        <stop offset="0%" stopColor={palette.belly} stopOpacity="0.32" />
        <stop offset="100%" stopColor={palette.furDeep} stopOpacity="0.34" />
      </radialGradient>
      <radialGradient id={`${uid}-rim`} cx="22%" cy="18%" r="46%">
        <stop offset="0%" stopColor="#fff" stopOpacity="0.42" />
        <stop offset="100%" stopColor="#fff" stopOpacity="0" />
      </radialGradient>
      <radialGradient id={`${uid}-eye`} cx="38%" cy="32%" r="70%">
        <stop offset="0%" stopColor="#FFF7D6" stopOpacity="0.95" />
        <stop offset="28%" stopColor={palette.glow} />
        <stop offset="100%" stopColor={palette.glowDeep} />
      </radialGradient>
      <radialGradient id={`${uid}-halo`} cx="50%" cy="46%" r="50%">
        <stop offset="0%" stopColor={palette.glow} stopOpacity="0.28" />
        <stop offset="58%" stopColor={palette.glowDeep} stopOpacity="0.1" />
        <stop offset="100%" stopColor={palette.glow} stopOpacity="0" />
      </radialGradient>
      <filter id={`${uid}-sit`} x="-30%" y="-40%" width="160%" height="180%">
        <feGaussianBlur stdDeviation="1.8" />
      </filter>
    </defs>
  );
}

function StageGlow({
  species,
  stage,
  glow,
  glowDeep,
  extraMagical,
}: {
  species: SpriteSpeciesId;
  stage: CareStage;
  glow: string;
  glowDeep: string;
  extraMagical: boolean;
}) {
  const ethereal = stage === "ethereal";
  const luminary = stage === "luminary";
  if (!ethereal && !luminary) return null;
  const strong = extraMagical && ethereal;
  const fx = ETHEREAL_GLOWS[species].fx;
  return (
    <g className="sprite-stage-glow" aria-hidden>
      <ellipse
        cx="50"
        cy="72"
        rx={strong ? 54 : ethereal ? 42 : 34}
        ry={strong ? 52 : ethereal ? 40 : 32}
        fill={glow}
        fillOpacity={strong ? 0.4 : ethereal ? 0.2 : 0.12}
      />
      <ellipse
        cx="50"
        cy="70"
        rx={strong ? 44 : ethereal ? 34 : 26}
        ry={strong ? 42 : ethereal ? 32 : 24}
        fill={glowDeep}
        fillOpacity={strong ? 0.18 : ethereal ? 0.1 : 0.05}
      />
      {ethereal ? <EtherealFxLayer fx={fx} glow={glow} glowDeep={glowDeep} strong={strong} /> : null}
    </g>
  );
}

function EtherealFxLayer({
  fx,
  glow,
  glowDeep,
  strong,
}: {
  fx: (typeof ETHEREAL_GLOWS)[SpriteSpeciesId]["fx"];
  glow: string;
  glowDeep: string;
  strong: boolean;
}) {
  if (fx === "sunset") {
    return (
      <g className="sprite-ethereal-wisps" fill="none" strokeLinecap="round">
        <path d="M12 74c10-22 8-10 22-28" stroke={glowDeep} strokeWidth="2.1" opacity="0.8" />
        <path d="M18 80c8-16 14-8 20-22" stroke={glow} strokeWidth="1.6" opacity="0.85" />
        <path d="M88 72c-10-20-6-8-22-26" stroke={glowDeep} strokeWidth="2.1" opacity="0.8" />
        <path d="M82 78c-8-14-12-6-18-20" stroke={glow} strokeWidth="1.6" opacity="0.85" />
        <path d="M28 40c6-12 14-4 16-16" stroke={glow} strokeWidth="1.2" opacity="0.6" />
        <circle cx="22" cy="36" r="1.4" fill={glow} stroke="none" />
        <circle cx="80" cy="32" r="1.2" fill={glowDeep} stroke="none" />
        <circle cx="50" cy="14" r="1.3" fill={glow} stroke="none" />
        {strong ? (
          <g fill={glowDeep} stroke="none">
            <circle cx="10" cy="56" r="1.5" />
            <circle cx="90" cy="54" r="1.3" />
            <circle cx="36" cy="10" r="1" />
            <circle cx="64" cy="8" r="0.9" />
            <circle cx="6" cy="40" r="1.1" fill={glow} />
            <circle cx="94" cy="38" r="1" fill={glow} />
          </g>
        ) : null}
      </g>
    );
  }
  if (fx === "bubbles") {
    return (
      <g className="sprite-ethereal-wisps" fill="none">
        <circle cx="16" cy="58" r="5.2" stroke={glow} strokeWidth="1.2" opacity="0.8" />
        <circle cx="22" cy="40" r="3.4" stroke={glowDeep} strokeWidth="1.1" opacity="0.75" />
        <circle cx="84" cy="56" r="4.8" stroke={glowDeep} strokeWidth="1.2" opacity="0.8" />
        <circle cx="78" cy="34" r="3.1" stroke={glow} strokeWidth="1.1" opacity="0.7" />
        <circle cx="50" cy="16" r="2.6" stroke={glow} strokeWidth="1" opacity="0.65" />
        {strong ? (
          <g>
            <circle cx="8" cy="72" r="3.6" stroke={glow} strokeWidth="1" opacity="0.55" />
            <circle cx="92" cy="70" r="3.2" stroke={glowDeep} strokeWidth="1" opacity="0.55" />
          </g>
        ) : null}
      </g>
    );
  }
  if (fx === "goldgreen") {
    return (
      <g className="sprite-ethereal-wisps" fill="none" strokeLinecap="round">
        <path d="M14 68c8-16 10-6 18-20" stroke={glow} strokeWidth="1.5" opacity="0.8" />
        <path d="M86 66c-8-14-8-4-18-18" stroke={glowDeep} strokeWidth="1.5" opacity="0.8" />
        <ellipse cx="20" cy="36" rx="2.2" ry="3.4" fill={glowDeep} stroke="none" opacity="0.7" />
        <ellipse cx="80" cy="32" rx="2" ry="3.1" fill={glow} stroke="none" opacity="0.7" />
        {strong ? (
          <g>
            <ellipse cx="10" cy="54" rx="1.8" ry="2.8" fill={glow} opacity="0.55" />
            <ellipse cx="90" cy="52" rx="1.7" ry="2.6" fill={glowDeep} opacity="0.55" />
          </g>
        ) : null}
      </g>
    );
  }
  if (fx === "hearts") {
    return (
      <g className="sprite-ethereal-wisps">
        <HeartMark x={16} y={34} scale={0.72} fill={glow} />
        <HeartMark x={84} y={30} scale={0.62} fill={glowDeep} />
        <HeartMark x={50} y={8} scale={0.48} fill={CAT_HEART} />
        <circle cx="12" cy="58" r="1.2" fill={glow} />
        <circle cx="88" cy="56" r="1.1" fill={glowDeep} />
        {strong ? (
          <g>
            <HeartMark x={8} y={68} scale={0.4} fill={CAT_HEART} />
            <HeartMark x={92} y={66} scale={0.38} fill={glow} />
          </g>
        ) : null}
      </g>
    );
  }
  if (fx === "rose") {
    return (
      <g className="sprite-ethereal-wisps">
        <ellipse cx="16" cy="52" rx="3.2" ry="4.6" fill={glow} opacity="0.45" />
        <ellipse cx="84" cy="48" rx="3" ry="4.2" fill={glowDeep} opacity="0.45" />
        <circle cx="22" cy="34" r="1.6" fill={glow} />
        <circle cx="78" cy="30" r="1.4" fill={glowDeep} />
        <circle cx="50" cy="14" r="1.5" fill={glow} />
        {strong ? (
          <g>
            <ellipse cx="8" cy="66" rx="2.4" ry="3.4" fill={glowDeep} opacity="0.4" />
            <ellipse cx="92" cy="64" rx="2.2" ry="3.2" fill={glow} opacity="0.4" />
          </g>
        ) : null}
      </g>
    );
  }
  return (
    <g className="sprite-ethereal-wisps">
      <StarMark x={18} y={32} scale={1.05} fill={glow} />
      <StarMark x={82} y={28} scale={0.92} fill={glowDeep} />
      <StarMark x={50} y={10} scale={0.78} fill={glow} />
      <circle cx="12" cy="58" r="2.1" fill={glow} opacity="0.7" />
      <circle cx="88" cy="54" r="1.8" fill={glowDeep} opacity="0.7" />
      {strong ? (
        <g>
          <StarMark x={8} y={70} scale={0.62} fill={glowDeep} />
          <StarMark x={92} y={68} scale={0.58} fill={glow} />
        </g>
      ) : null}
    </g>
  );
}

export function SpeciesEgg({
  palette,
  species,
  hatching,
}: {
  palette: SpeciesPalette;
  species: SpriteSpeciesId;
  hatching?: boolean;
}) {
  return (
    <g className="spark-body">
      <ellipse cx="50" cy="94" rx="20" ry="5.4" fill="#0B0B0F" opacity="0.2" />
      <ellipse cx="50" cy="62" rx="22.5" ry="29.5" fill={palette.egg} />
      <ellipse cx="50" cy="64" rx="20" ry="26" fill={palette.eggWash} opacity="0.32" />
      <ellipse cx="42" cy="50" rx="8" ry="6" fill="#FFF8E7" opacity="0.55" />
      {species === "fox" ? (
        <StarMark x={50} y={58} scale={0.7} fill={palette.eggMark} />
      ) : (
        <>
          <circle cx="37" cy="68" r="1.5" fill={palette.eggMark} opacity="0.55" />
          <circle cx="58" cy="56" r="1.15" fill={palette.eggMark} opacity="0.4" />
          <circle cx="55" cy="76" r="1.3" fill={palette.eggMark} opacity="0.35" />
        </>
      )}
      {hatching ? (
        <path
          d="M50 34c2 7-5 11-2 17 4 8-4 11-1 18"
          fill="none"
          stroke="#3F3F46"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
      ) : null}
    </g>
  );
}

export function SpriteFxLayers({
  species,
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
  const magical = extraMagical && stage === "ethereal";
  return (
    <g className="sprite-fx-layers" aria-hidden>
      <PaintDefs uid={uid} palette={palette} />
      {stageGlow ? (
        <StageGlow
          species={species}
          stage={stage}
          glow={palette.glow}
          glowDeep={palette.glowDeep}
          extraMagical={magical}
        />
      ) : null}
      {magical ? (
        <MagicalHalo
          glow={palette.glow}
          glowDeep={palette.glowDeep}
          bloomId={`${uid}-halo`}
        />
      ) : null}
    </g>
  );
}

export function SpriteCritter({
  species,
  palette,
  mood,
  stage,
  stageGlow,
  extraMagical = false,
  uid = "sprite",
}: SpriteCritterProps) {
  const hatchling = stage === "hatchling";
  const magical = extraMagical && stage === "ethereal";
  const stageScale =
    stage === "hatchling" ? 0.86 : stage === "luminary" ? 1.04 : stage === "ethereal" ? 1.06 : 1;
  const blush = species === "cat" ? "#F472B6" : species === "fox" ? "#F97316" : palette.accent;
  return (
    <g className="sprite-critter">
      <PaintDefs uid={uid} palette={palette} />
      {stageGlow ? (
        <StageGlow
          species={species}
          stage={stage}
          glow={palette.glow}
          glowDeep={palette.glowDeep}
          extraMagical={magical}
        />
      ) : null}
      {magical ? (
        <MagicalHalo
          glow={palette.glow}
          glowDeep={palette.glowDeep}
          bloomId={`${uid}-halo`}
        />
      ) : null}
      <ellipse
        cx="50"
        cy="110"
        rx="20"
        ry="5.2"
        fill="#0B0B0F"
        opacity="0.26"
        filter={`url(#${uid}-sit)`}
      />
      <g
        transform={
          hatchling || stageScale !== 1
            ? `translate(50 110) scale(${stageScale}) translate(-50 -110)`
            : undefined
        }
      >
        <Tail species={species} palette={palette} />
        <SpeciesExtras species={species} palette={palette} stage={stage} />
        <ellipse cx="50" cy="93.6" rx="14.4" ry="10.6" fill={palette.furDeep} />
        <ellipse cx="50" cy="92.4" rx="13.4" ry="9.7" fill={palette.fur} />
        <ellipse cx="50" cy="92.4" rx="13.4" ry="9.7" fill={`url(#${uid}-body)`} />
        <ellipse cx="50" cy="94.2" rx="8.2" ry="6.2" fill={palette.belly} />
        <ellipse cx="42.2" cy="102.2" rx="4.8" ry="2.8" fill={palette.furDeep} />
        <ellipse cx="57.8" cy="102.2" rx="4.8" ry="2.8" fill={palette.furDeep} />
        <Ears species={species} palette={palette} />
        <ellipse cx="50" cy="47.2" rx="31.6" ry="29.2" fill={palette.furDeep} />
        <ellipse cx="50" cy="46" rx="30.2" ry="28" fill={palette.fur} />
        <ellipse cx="50" cy="46" rx="30.2" ry="28" fill={`url(#${uid}-head)`} />
        <ellipse cx="50" cy="46" rx="30.2" ry="28" fill={`url(#${uid}-rim)`} />
        <ellipse cx="50" cy="56.6" rx="15.2" ry="12.2" fill={palette.belly} opacity="0.92" />
        <ellipse cx="36.6" cy="36.4" rx="9.6" ry="6.4" fill="#fff" opacity="0.28" />
        <ellipse cx="33.2" cy="60.8" rx="6.2" ry="3.6" fill={blush} opacity="0.34" />
        <ellipse cx="66.8" cy="60.8" rx="6.2" ry="3.6" fill={blush} opacity="0.34" />
        {magical ? (
          <path
            d="M50 23.6l1.25 2.9 2.9 1.25-2.9 1.25L50 31.9 48.75 29 45.85 27.75l2.9-1.25Z"
            fill={palette.glow}
          />
        ) : null}
        <Face
          mood={mood}
          ink={palette.ink}
          species={species}
          palette={palette}
          glow={palette.glow}
          glowDeep={palette.glowDeep}
          extraMagical={magical}
          uid={uid}
        />
      </g>
    </g>
  );
}
