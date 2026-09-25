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
