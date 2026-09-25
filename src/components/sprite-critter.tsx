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

function Face({
  mood,
  ink,
  species,
  palette,
  glow,
  glowDeep,
  extraMagical,
  squint = false,
  uid,
}: {
  mood: CritterMood;
  ink: string;
  species: SpriteSpeciesId;
  palette: SpeciesPalette;
  glow: string;
  glowDeep: string;
  extraMagical: boolean;
  squint?: boolean;
  uid: string;
}) {
  const look = mood === "tempted" ? 2.2 : 0;
  const happy = mood === "done";
  const showCatMouth =
    mood === "idle" ||
    mood === "locked" ||
    mood === "earning" ||
    mood === "tempted" ||
    mood === "done";

  return (
    <g>
      {mood === "done" ? (
        <g fill="none" stroke={ink} strokeWidth="1.9" strokeLinecap="round">
          <path d="M35 47.6c2.6-3.6 8.2-3.6 10.8 0" />
          <path d="M54.2 47.6c2.6-3.6 8.2-3.6 10.8 0" />
        </g>
      ) : null}
      {mood === "annoyed" ? (
        <g fill="none" stroke={ink} strokeWidth="2" strokeLinecap="round">
          <path d="M34 47h12" />
          <path d="M54 47h12" />
        </g>
      ) : null}
      {mood === "sleepy" ? (
        <g fill="none" stroke={ink} strokeWidth="2" strokeLinecap="round">
          <path d="M34 50c2.8 2.4 8.8 2.4 11.6 0" />
          <path d="M54.4 50c2.8 2.4 8.8 2.4 11.6 0" />
        </g>
      ) : null}
      {squint && mood !== "sleepy" ? (
        <g fill="none" stroke={ink} strokeWidth="2" strokeLinecap="round">
          <path d="M34 48.2c2.8 2.8 8.6 2.8 11.4 0" />
          <path d="M54.4 48.2c2.8 2.8 8.6 2.8 11.4 0" />
        </g>
      ) : null}
      {mood === "eating" ? (
        <g>
          <ellipse cx="39.8" cy="48.8" rx="4.2" ry="3.1" fill={EYE_INK} />
          <ellipse cx="60.2" cy="48.8" rx="4.2" ry="3.1" fill={EYE_INK} />
        </g>
      ) : null}
      {!squint &&
      (mood === "idle" ||
        mood === "locked" ||
        mood === "earning" ||
        mood === "tempted") ? (
        <>
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
        </>
      ) : null}
      {happy ? (
        <>
          <ellipse cx="34.6" cy="57.8" rx="3.1" ry="1.7" fill="#F4A8B8" opacity="0.42" />
          <ellipse cx="65.4" cy="57.8" rx="3.1" ry="1.7" fill="#F4A8B8" opacity="0.42" />
        </>
      ) : null}
      <SpeciesNose species={species} palette={palette} />
      {showCatMouth ? (
        <CatMouth
          ink={species === "cat" ? "#2A211C" : ink}
          species={species}
          wide={happy}
        />
      ) : null}
      {mood === "eating" ? (
        <ellipse
          className="spark-chew"
          cx="50"
          cy={MOUTH_Y[species] + 2.2}
          rx="4.4"
          ry="2.2"
          fill="#0B0B0F"
        />
      ) : null}
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
        <path d="M28 14c-1.6-9.2 7.4-13.8 11.2-5.6 1.6 3.6.2 9-3 11.4Z" fill={palette.accent} />
        <path d="M72 14c1.6-9.2-7.4-13.8-11.2-5.6-1.6 3.6-.2 9 3 11.4Z" fill={palette.accent} />
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
        <CatEar palette={palette} />
        <g transform="translate(100 0) scale(-1 1)">
          <CatEar palette={palette} />
        </g>
      </g>
    );
  }
  if (species === "deer") {
    return (
      <g>
        <path d="M28 31c-2.4-16.8 16.4-21.2 20-8.2-6.2 1.8-13.2 4.2-20 8.2Z" fill={palette.fur} />
        <path d="M72 31c2.4-16.8-16.4-21.2-20-8.2 6.2 1.8 13.2 4.2 20 8.2Z" fill={palette.fur} />
        <path d="M31.4 27.6c-1-10.4 9.6-13 12.2-4.6-4 1.2-8.4 2.8-12.2 4.6Z" fill={palette.belly} />
        <path d="M68.6 27.6c1-10.4-9.6-13-12.2-4.6 4 1.2 8.4 2.8 12.2 4.6Z" fill={palette.belly} />
      </g>
    );
  }
  if (species === "dragon") {
    return (
      <g>
        <path d="M28 29c-1.8-14 14.4-17.6 18-6.2-5.8 1.6-12.2 3.6-18 6.2Z" fill={palette.fur} />
        <path d="M72 29c1.8-14-14.4-17.6-18-6.2 5.8 1.6 12.2 3.6 18 6.2Z" fill={palette.fur} />
      </g>
    );
  }
  return (
    <g>
      <FoxEar palette={palette} />
      <g transform="translate(100 0) scale(-1 1)">
        <FoxEar palette={palette} />
      </g>
    </g>
  );
}

function CatEar({ palette }: { palette: SpeciesPalette }) {
  return (
    <g transform="translate(-2.4 6.4) translate(33.2 31.2) scale(0.68) translate(-33.2 -31.2)">
      <path
        d="M24.8 31.4C21.2 17.6 22.4 7.2 27.6 4.4C29.6 3.3 34 3.4 35.8 6C39.2 14.2 40 23.6 40.4 31.4Z"
        fill="#8B8B94"
      />
      <path
        d="M26 31C22.8 18.2 24 8.4 28.6 5.8C30.4 4.8 34 4.9 35.4 7.2C38.4 14.8 39.2 23.4 39.6 31Z"
        fill={palette.fur}
      />
      <path
        d="M30.8 29.4C29.4 19.6 29.6 11.6 31.8 8C32.6 6.8 34.8 6.8 35.6 8.2C37.2 14 37.8 22.2 38 29.4Z"
        fill="#F4B4C8"
      />
    </g>
  );
}

function DragonWing({
  palette,
  side,
}: {
  palette: SpeciesPalette;
  side: "left" | "right";
}) {
  const flip = side === "right" ? "translate(100 0) scale(-1 1)" : undefined;
  return (
    <g transform={flip}>
      <path
        d="M34.8 69.2C20.4 60.6 8.2 61.4 4.6 71.2C2.8 80.8 10.4 90.6 22.6 88.2C28.4 86.8 31.6 80.4 34.2 74.6C34.8 73.2 35.2 71.2 34.8 69.2Z"
        fill={palette.furDeep}
      />
      <path
        d="M33.8 70C22.2 62.8 11.6 64 8.6 72C7.4 80 13.6 87.2 23.2 85.4C28 84.2 30.8 78.8 33.2 74C33.6 72.8 34 71.2 33.8 70Z"
        fill={palette.fur}
      />
      <path
        d="M33.6 70.2C23.2 64.4 14.6 67.2 10.4 75.4"
        fill="none"
        stroke={palette.furDeep}
        strokeWidth="1.55"
        strokeLinecap="round"
      />
      <path
        d="M32.8 73.6C24.8 70.4 18.4 74.6 16.2 80.8"
        fill="none"
        stroke={palette.furDeep}
        strokeWidth="1.15"
        strokeLinecap="round"
        opacity="0.7"
      />
      <ellipse cx="33.8" cy="71.6" rx="6.2" ry="5.1" fill={palette.fur} />
      <ellipse cx="33.2" cy="71" rx="3.6" ry="2.8" fill={palette.furDeep} opacity="0.3" />
    </g>
  );
}

function DragonWings({
  palette,
  stage,
}: {
  palette: SpeciesPalette;
  stage: CareStage;
}) {
  const grown = stage === "luminary" || stage === "ethereal";
  return (
    <g
      className="dragon-wings"
      transform={grown ? "translate(50 72) scale(1.08) translate(-50 -72)" : undefined}
    >
      <DragonWing palette={palette} side="left" />
      <DragonWing palette={palette} side="right" />
    </g>
  );
}

function DragonSpike({
  x,
  y,
  r,
  rot,
  fill,
  sheen,
  glow,
}: {
  x: number;
  y: number;
  r: number;
  rot: number;
  fill: string;
  sheen: string;
  glow?: string;
}) {
  return (
    <g transform={`rotate(${rot} ${x} ${y})`}>
      <ellipse cx={x} cy={y} rx={r * 0.62} ry={r} fill={fill} />
      <ellipse
        cx={x - r * 0.12}
        cy={y - r * 0.22}
        rx={r * 0.28}
        ry={r * 0.4}
        fill={sheen}
        opacity="0.42"
      />
      {glow ? <circle cx={x} cy={y - r * 0.78} r={Math.max(0.85, r * 0.28)} fill={glow} /> : null}
    </g>
  );
}

function DragonSpikes({
  palette,
  stage,
}: {
  palette: SpeciesPalette;
  stage: CareStage;
}) {
  const grown = stage === "luminary" || stage === "ethereal";
  const glow = stage === "ethereal" ? palette.glow : undefined;
  const plates = grown
    ? [
        [50, 17.6, 3.15, 0],
        [54.4, 27.2, 2.75, 16],
        [59.8, 40.4, 2.55, 22],
        [65.2, 55.2, 2.35, 26],
        [70.6, 68.6, 2.15, 30],
        [76.4, 76.8, 1.95, 18],
        [82.2, 73.4, 1.7, -8],
        [87.2, 68.2, 1.45, -18],
      ]
    : [
        [50, 18.4, 2.75, 0],
        [54.6, 28.6, 2.4, 16],
        [60.4, 43.2, 2.2, 22],
        [66.2, 58.4, 2.05, 26],
        [72.4, 72.2, 1.85, 24],
        [79.2, 77.2, 1.65, 8],
        [85.2, 71.4, 1.4, -16],
      ];
  return (
    <g className="dragon-spikes">
      {plates.map(([x, y, r, rot]) => (
        <DragonSpike
          key={`${x}-${y}`}
          x={x}
          y={y}
          r={r}
          rot={rot}
          fill={palette.furDeep}
          sheen={palette.accent}
          glow={glow}
        />
      ))}
    </g>
  );
}

function FoxEar({ palette }: { palette: SpeciesPalette }) {
  return (
    <g>
      <path
        d="M25.8 30.8C22.2 20.6 23.2 12 27.2 7.2C28.6 5.5 32.4 5.4 33.8 7.4C36.8 13.6 37.8 22.4 38.4 30.8Z"
        fill={palette.fur}
      />
      <path
        d="M26.6 11.2C25.6 8.2 27.6 5.8 30.4 5.7C33.2 5.8 34.8 8.4 34.2 11.2C32.4 9.4 28.6 9.4 26.6 11.2Z"
        fill={palette.furDeep}
      />
      <path
        d="M30.4 27.4C28.8 20.4 28.8 14.4 30.6 10.6C31.4 9 33.4 8.9 34.2 10.6C35.6 15.2 36.2 21.6 36.6 27.4Z"
        fill={palette.belly}
      />
    </g>
  );
}

function DeerHooves() {
  return (
    <g>
      <ellipse cx="42.2" cy="102.2" rx="4.8" ry="2.8" fill="#3F3F46" />
      <ellipse cx="41.3" cy="101.35" rx="2.55" ry="1.15" fill="#A1A1AA" opacity="0.38" />
      <ellipse cx="57.8" cy="102.2" rx="4.8" ry="2.8" fill="#3F3F46" />
      <ellipse cx="56.9" cy="101.35" rx="2.55" ry="1.15" fill="#A1A1AA" opacity="0.38" />
    </g>
  );
}

function Tail({ species, palette }: { species: SpriteSpeciesId; palette: SpeciesPalette }) {
  if (species === "bunny") {
    return <ellipse cx="67.4" cy="92.2" rx="6.4" ry="5.6" fill={palette.belly} />;
  }
  if (species === "cat") {
    return (
      <g>
        <path
          d="M66 90c16 3 23-9 17.4-20"
          fill="none"
          stroke="#8B8B94"
          strokeWidth="6.4"
          strokeLinecap="round"
        />
        <path
          d="M66 90c16 3 23-9 17.4-20"
          fill="none"
          stroke={palette.fur}
          strokeWidth="5.2"
          strokeLinecap="round"
        />
        <path
          d="M81.6 71.4c1.4-1.2 2.8-0.6 2.2 1.1"
          fill="none"
          stroke={palette.mark ?? palette.belly}
          strokeWidth="5.2"
          strokeLinecap="round"
        />
      </g>
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
      <ellipse cx="50" cy="50" rx="54" ry="56" fill={`url(#${bloomId})`} />
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
      <radialGradient id={`${uid}-stage`} cx="50%" cy="48%" r="50%">
        <stop offset="0%" stopColor={palette.glow} stopOpacity="0.32" />
        <stop offset="28%" stopColor={palette.glow} stopOpacity="0.16" />
        <stop offset="58%" stopColor={palette.glowDeep} stopOpacity="0.06" />
        <stop offset="82%" stopColor={palette.glow} stopOpacity="0.02" />
        <stop offset="100%" stopColor={palette.glow} stopOpacity="0" />
      </radialGradient>
      <filter id={`${uid}-sit`} x="-30%" y="-40%" width="160%" height="180%">
        <feGaussianBlur stdDeviation="1.8" />
      </filter>
      <filter id={`${uid}-glow-soft`} x="-75%" y="-75%" width="250%" height="250%">
        <feGaussianBlur stdDeviation="10.4" />
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
  uid,
}: {
  species: SpriteSpeciesId;
  stage: CareStage;
  glow: string;
  glowDeep: string;
  extraMagical: boolean;
  uid: string;
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
        cy="62"
        rx={strong ? 72 : ethereal ? 64 : 50}
        ry={strong ? 70 : ethereal ? 62 : 48}
        fill={`url(#${uid}-stage)`}
        filter={`url(#${uid}-glow-soft)`}
        opacity={strong ? 0.92 : ethereal ? 0.8 : 0.58}
      />
      <ellipse
        cx="50"
        cy="66"
        rx={strong ? 42 : ethereal ? 36 : 26}
        ry={strong ? 40 : ethereal ? 34 : 24}
        fill={glowDeep}
        fillOpacity={strong ? 0.08 : 0.04}
        filter={`url(#${uid}-glow-soft)`}
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

const EGG_PATH =
  "M50 28c14.8 0 23.2 17.2 23.2 34.6C73.2 82.4 63 92.4 50 92.4S26.8 82.4 26.8 62.6C26.8 45.2 35.2 28 50 28Z";

function hexRgb(hex: string) {
  const raw = hex.replace("#", "");
  const full =
    raw.length === 3
      ? raw
          .split("")
          .map((part) => part + part)
          .join("")
      : raw;
  return {
    r: parseInt(full.slice(0, 2), 16) || 0,
    g: parseInt(full.slice(2, 4), 16) || 0,
    b: parseInt(full.slice(4, 6), 16) || 0,
  };
}

function isGingerFur(hex: string) {
  const { r, g, b } = hexRgb(hex);
  return r > 140 && r > g && r > b + 16 && g > 70 && b < 150;
}

function catEggColors(palette: SpeciesPalette) {
  if (isGingerFur(palette.fur)) {
    return {
      shell: "#E4A25A",
      wash: "#F0C48A",
      stripe: palette.furDeep,
      tip: "#FFF1D6",
    };
  }
  return {
    shell: palette.egg,
    wash: palette.eggWash,
    stripe: palette.eggMark,
    tip: palette.eggWash,
  };
}

function FlameSpeckle({
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
      d="M0-5.6C2.2-2.2 3.2.4 2 2.8 1.1 4.6-1.1 4.6-2 2.8-3.2.4-2.2-2.2 0-5.6Z"
      fill={fill}
    />
  );
}

function CloverSpot({
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
    <g transform={`translate(${x} ${y}) scale(${scale})`} fill={fill}>
      <circle cx="-1.35" cy="-0.15" r="1.35" />
      <circle cx="1.35" cy="-0.15" r="1.35" />
      <circle cx="0" cy="1.45" r="1.35" />
      <path d="M0 1.1v2.4" stroke={fill} strokeWidth="0.55" strokeLinecap="round" />
    </g>
  );
}

function EggMarks({
  species,
  palette,
  uid,
}: {
  species: SpriteSpeciesId;
  palette: SpeciesPalette;
  uid: string;
}) {
  if (species === "fox") {
    return (
      <g>
        <ellipse cx="50" cy="36" rx="17.5" ry="13" fill={`url(#${uid}-fox-tip)`} />
        <FlameSpeckle x={35} y={56} scale={1.15} fill={palette.eggMark} />
        <FlameSpeckle x={63} y={52} scale={0.95} fill={palette.eggMark} />
        <FlameSpeckle x={44} y={70} scale={0.88} fill={palette.eggMark} />
        <FlameSpeckle x={58} y={76} scale={0.72} fill={palette.eggMark} />
        <FlameSpeckle x={37} y={80} scale={0.62} fill={palette.eggMark} />
        <FlameSpeckle x={51} y={58} scale={0.55} fill={palette.eggMark} />
      </g>
    );
  }
  if (species === "bunny") {
    return (
      <g opacity="0.78">
        <CloverSpot x={36} y={54} scale={1.15} fill={palette.eggMark} />
        <CloverSpot x={61} y={48} scale={0.95} fill={palette.eggMark} />
        <CloverSpot x={54} y={70} scale={1.05} fill={palette.eggMark} />
        <CloverSpot x={39} y={78} scale={0.82} fill={palette.eggMark} />
        <CloverSpot x={48} y={58} scale={0.7} fill={palette.eggMark} />
      </g>
    );
  }
  if (species === "deer") {
    return (
      <g fill={palette.eggMark}>
        <ellipse cx="37" cy="52" rx="3.1" ry="2.4" />
        <ellipse cx="58" cy="48" rx="2.5" ry="1.95" />
        <ellipse cx="46" cy="66" rx="3.3" ry="2.55" />
        <ellipse cx="62" cy="68" rx="2.3" ry="1.8" />
        <ellipse cx="35" cy="74" rx="2.2" ry="1.7" />
        <ellipse cx="52" cy="80" rx="2.7" ry="2.05" />
        <ellipse cx="43" cy="46" rx="1.85" ry="1.4" />
        <ellipse cx="56" cy="58" rx="1.7" ry="1.3" />
      </g>
    );
  }
  if (species === "cat") {
    const tuxedo = catEggColors(palette);
    return (
      <g>
        <path
          d="M50 58C42 60 37 68 38.4 76C40 84 45.6 88.6 50 89C54.4 88.6 60 84 61.6 76C63 68 58 60 50 58Z"
          fill={tuxedo.stripe}
          opacity="0.92"
        />
        <ellipse cx="36" cy="50" rx="2.1" ry="1.6" fill={tuxedo.stripe} />
        <ellipse cx="62" cy="54" rx="1.7" ry="1.3" fill={tuxedo.stripe} />
        <ellipse cx="44" cy="46" rx="1.4" ry="1.1" fill={tuxedo.stripe} />
        <ellipse cx="56" cy="70" rx="1.5" ry="1.15" fill={tuxedo.shell} opacity="0.35" />
      </g>
    );
  }
  if (species === "axolotl") {
    return (
      <g fill="none" stroke={palette.eggMark} strokeLinecap="round">
        <path
          d="M28.5 48c-5.4-2.4-8.6 2.6-5.6 7.2 3.8 3 8.6.8 9.6-3.4"
          strokeWidth="2.6"
          opacity="0.82"
        />
        <path
          d="M28.8 61c-5.8-1.4-8.6 4-4.8 8.2 4 2.6 8.8.4 9.8-3.2"
          strokeWidth="2.6"
          opacity="0.82"
        />
        <path
          d="M31 74c-5-.6-7.6 4.2-3.8 7.8 3.6 2.1 7.8.1 8.8-3"
          strokeWidth="2.4"
          opacity="0.74"
        />
        <path
          d="M71.5 48c5.4-2.4 8.6 2.6 5.6 7.2-3.8 3-8.6.8-9.6-3.4"
          strokeWidth="2.6"
          opacity="0.82"
        />
        <path
          d="M71.2 61c5.8-1.4 8.6 4 4.8 8.2-4 2.6-8.8.4-9.8-3.2"
          strokeWidth="2.6"
          opacity="0.82"
        />
        <path
          d="M69 74c5-.6 7.6 4.2 3.8 7.8-3.6 2.1-7.8.1-8.8-3"
          strokeWidth="2.4"
          opacity="0.74"
        />
        <path
          d="M36 47c5.4 3.4 8.6-2.2 15 1.2 6.4 3.4 8.6-1.2 15.2 2.2"
          strokeWidth="1.7"
          opacity="0.5"
        />
        <path
          d="M34 63c6.4 2.8 9.6-1.8 16 1.4 6.4 3 9.6-1.2 16.2 1.8"
          strokeWidth="1.7"
          opacity="0.42"
        />
      </g>
    );
  }
  return (
    <g fill={palette.eggWash} stroke={palette.eggMark} strokeWidth="0.85" opacity="0.9">
      {[
        [34, 50],
        [46, 48],
        [58, 50],
        [70, 52],
        [30, 61],
        [42, 59],
        [54, 59],
        [66, 61],
        [34, 71],
        [46, 69],
        [58, 69],
        [70, 71],
        [38, 81],
        [50, 79],
        [62, 81],
      ].map(([x, y]) => (
        <path
          key={`${x}-${y}`}
          d={`M${x - 5.2} ${y}a5.2 4.1 0 0 1 10.4 0`}
        />
      ))}
    </g>
  );
}

function EggCracks({
  crack,
  hatching,
}: {
  crack: EggCrackLevel;
  hatching: boolean;
}) {
  if (crack < 1 && !hatching) return null;
  const strong = crack >= 2 || hatching;
  return (
    <g
      fill="none"
      stroke="#3F3A38"
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity={hatching ? 0.82 : 0.7}
    >
      <path
        d={strong ? "M50 33c2.2 7.2-4.8 11.2-1.6 18.4 4.2 8.6-4.6 12-1.2 20.6" : "M50 36c1.6 5.4-3.2 8.2-1.2 13.4"}
        strokeWidth={strong ? 1.85 : 1.45}
      />
      {strong ? (
        <>
          <path d="M48.6 48.5 43 52.2" strokeWidth="1.35" />
          <path d="M51.4 56.8 57.2 60.4" strokeWidth="1.35" />
          <path d="M49.2 68.4 44.4 73.6" strokeWidth="1.25" />
        </>
      ) : (
        <path d="M49.4 44.6 46.2 47.2" strokeWidth="1.15" />
      )}
      {hatching ? (
        <>
          <path d="M47.6 40.2 41.8 36.4" strokeWidth="1.3" />
          <path d="M52.6 62.2 59.4 66" strokeWidth="1.3" />
          <path d="M50.4 78.8 54.8 86.2" strokeWidth="1.2" />
        </>
      ) : null}
    </g>
  );
}

export function SpeciesEgg({
  palette,
  species,
  hatching,
  crack = 0,
  uid = "egg",
}: {
  palette: SpeciesPalette;
  species: SpriteSpeciesId;
  hatching?: boolean;
  crack?: EggCrackLevel;
  uid?: string;
}) {
  const tabby = species === "cat" ? catEggColors(palette) : null;
  const shell = tabby?.shell ?? palette.egg;
  const wash = tabby?.wash ?? palette.eggWash;
  const tip = tabby?.tip ?? palette.eggWash;
  return (
    <g className="spark-body">
      <defs>
        <clipPath id={`${uid}-egg-clip`}>
          <path d={EGG_PATH} />
        </clipPath>
        <linearGradient id={`${uid}-egg-shell`} x1="32%" y1="12%" x2="78%" y2="92%">
          <stop offset="0%" stopColor={tip} />
          <stop offset="38%" stopColor={shell} />
          <stop offset="100%" stopColor={shell} />
        </linearGradient>
        <radialGradient id={`${uid}-egg-shade`} cx="38%" cy="28%" r="72%">
          <stop offset="0%" stopColor={wash} stopOpacity="0.55" />
          <stop offset="55%" stopColor={shell} stopOpacity="0" />
          <stop offset="100%" stopColor="#2A211C" stopOpacity="0.18" />
        </radialGradient>
        <radialGradient id={`${uid}-egg-sheen`} cx="30%" cy="22%" r="42%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.72" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${uid}-fox-tip`} x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#FFF6E4" />
          <stop offset="100%" stopColor="#FFF6E4" stopOpacity="0" />
        </linearGradient>
      </defs>
      <g transform="translate(50 78) scale(1.38) translate(-50 -78)">
      <ellipse cx="50" cy="95" rx="20" ry="5.2" fill="#0B0B0F" opacity="0.2" />
      <path d={EGG_PATH} fill={`url(#${uid}-egg-shell)`} />
      <g clipPath={`url(#${uid}-egg-clip)`}>
        <path d={EGG_PATH} fill={`url(#${uid}-egg-shade)`} />
        <EggMarks species={species} palette={palette} uid={uid} />
        <ellipse cx="39" cy="46" rx="9.2" ry="7.2" fill={`url(#${uid}-egg-sheen)`} />
        <ellipse cx="60" cy="78" rx="7" ry="4.2" fill="#fff" opacity="0.1" />
        <EggCracks crack={crack} hatching={Boolean(hatching)} />
      </g>
      <path
        d={EGG_PATH}
        fill="none"
        stroke="#fff"
        strokeOpacity="0.22"
        strokeWidth="1.05"
      />
      </g>
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
          uid={uid}
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
  squint = false,
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
          uid={uid}
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
        {species === "dragon" ? (
          <DragonWings palette={palette} stage={stage} />
        ) : null}
        <SpeciesExtras species={species} palette={palette} stage={stage} />
        <ellipse cx="50" cy="93.6" rx="14.4" ry="10.6" fill={palette.furDeep} />
        <ellipse cx="50" cy="92.4" rx="13.4" ry="9.7" fill={palette.fur} />
        {species === "cat" ? null : (
          <ellipse cx="50" cy="92.4" rx="13.4" ry="9.7" fill={`url(#${uid}-body)`} />
        )}
        <ellipse
          cx="50"
          cy={species === "cat" ? 93.4 : 94.2}
          rx={species === "cat" ? 9.6 : 8.2}
          ry={species === "cat" ? 7.4 : 6.2}
          fill={palette.belly}
        />
        {species === "deer" ? (
          <DeerHooves />
        ) : (
          <>
            <ellipse
              cx="42.2"
              cy="102.2"
              rx="4.8"
              ry="2.8"
              fill={species === "cat" ? (palette.mark ?? palette.belly) : palette.furDeep}
            />
            <ellipse
              cx="57.8"
              cy="102.2"
              rx="4.8"
              ry="2.8"
              fill={species === "cat" ? (palette.mark ?? palette.belly) : palette.furDeep}
            />
          </>
        )}
        <ellipse cx="50" cy="47.2" rx="31.6" ry="29.2" fill={palette.furDeep} />
        <ellipse cx="50" cy="46" rx="30.2" ry="28" fill={palette.fur} />
        {species === "cat" ? null : (
          <ellipse cx="50" cy="46" rx="30.2" ry="28" fill={`url(#${uid}-head)`} />
        )}
        <ellipse cx="50" cy="46" rx="30.2" ry="28" fill={`url(#${uid}-rim)`} />
        <Ears species={species} palette={palette} />
        {species === "dragon" ? (
          <DragonSpikes palette={palette} stage={stage} />
        ) : null}
        {species === "cat" ? (
          <path
            d="M50 51.2C45.4 52.2 40.2 57.2 38.6 63.2C37.2 69.2 41.4 73.8 50 74.6C58.6 73.8 62.8 69.2 61.4 63.2C59.8 57.2 54.6 52.2 50 51.2Z"
            fill={palette.mark ?? palette.belly}
          />
        ) : (
          <ellipse cx="50" cy="56.6" rx="15.2" ry="12.2" fill={palette.belly} opacity="0.92" />
        )}
        <ellipse cx="36.6" cy="36.4" rx="9.6" ry="6.4" fill="#fff" opacity={species === "cat" ? 0.16 : 0.28} />
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
          squint={squint}
          uid={uid}
        />
        {magical ? (
          <MagicalAccents
            species={species}
            glow={palette.glow}
            glowDeep={palette.glowDeep}
          />
        ) : null}
      </g>
    </g>
  );
}
