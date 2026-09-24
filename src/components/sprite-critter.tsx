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
};

function Face({
  mood,
  ink,
  nose,
  species,
  glow,
  extraMagical,
}: {
  mood: CritterMood;
  ink: string;
  nose: string;
  species: SpriteSpeciesId;
  glow: string;
  extraMagical: boolean;
}) {
  const look = mood === "tempted" ? 2.2 : 0;
  const eyeFill = extraMagical ? glow : ink;
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
        <ellipse cx="40.2" cy="50.4" rx="4.1" ry="3" fill={ink} />
        <ellipse cx="59.8" cy="50.4" rx="4.1" ry="3" fill={ink} />
        <ellipse className="spark-chew" cx="50" cy="62.4" rx="5.8" ry="3.1" fill="#0B0B0F" />
      </g>
    );
  }
  return (
    <g>
      {extraMagical ? (
        <g opacity="0.55">
          <ellipse cx={40.4 + look} cy="49.6" rx="8.2" ry="8.8" fill={glow} />
          <ellipse cx={59.6 + look} cy="49.6" rx="8.2" ry="8.8" fill={glow} />
        </g>
      ) : null}
      <ellipse cx={40.4 + look} cy="49.6" rx="5.1" ry="6.2" fill={eyeFill} />
      <ellipse cx={59.6 + look} cy="49.6" rx="5.1" ry="6.2" fill={eyeFill} />
      <ellipse
        className="spark-pupil"
        cx={41.6 + look}
        cy="48"
        rx="1.45"
        ry="1.85"
        fill="#fff"
        fillOpacity="0.95"
      />
      <ellipse
        className="spark-pupil"
        cx={60.8 + look}
        ry="1.85"
        cy="48"
        rx="1.45"
        fill="#fff"
        fillOpacity="0.95"
      />
      {species === "cat" ? (
        <path
          d="M50 57.2c-2.4 2.6-5.4.4-3.2-1.8 1.3-1.3 3.2-.4 3.2 1.8 0-2.2 1.9-3.1 3.2-1.8 2.2 2.2-.8 4.4-3.2 1.8Z"
          fill={nose}
        />
      ) : (
        <ellipse cx="50" cy="57.6" rx="2.15" ry="1.55" fill={nose} />
      )}
    </g>
  );
}

function SpeciesExtras({
  species,
  palette,
}: {
  species: SpriteSpeciesId;
  palette: SpeciesPalette;
}) {
  if (species === "bunny") {
    return (
      <g>
        <path
          d="M34 28c-4-22 2-30 8-18 3 6 3 16 1 22"
          fill={palette.fur}
          stroke={palette.furDeep}
          strokeWidth="0.6"
        />
        <path d="M36 24c-1.4-12 2.2-16 4.4-8" fill={palette.accent} />
        <path
          d="M66 28c4-22-2-30-8-18-3 6-3 16-1 22"
          fill={palette.fur}
          stroke={palette.furDeep}
          strokeWidth="0.6"
        />
        <path d="M64 24c1.4-12-2.2-16-4.4-8" fill={palette.accent} />
      </g>
    );
  }
  if (species === "deer") {
    return (
      <g>
        <path
          d="M38 18 34 6c4 2 7 8 8 14"
          fill="none"
          stroke={palette.accent}
          strokeWidth="1.7"
          strokeLinecap="round"
        />
        <path
          d="M62 18 66 6c-4 2-7 8-8 14"
          fill="none"
          stroke={palette.accent}
          strokeWidth="1.7"
          strokeLinecap="round"
        />
        <ellipse cx="44" cy="82" rx="2.1" ry="1.5" fill={palette.mark ?? palette.belly} />
        <ellipse cx="56" cy="84" rx="1.8" ry="1.3" fill={palette.mark ?? palette.belly} />
      </g>
    );
  }
  if (species === "axolotl") {
    return (
      <g>
        <path d="M24 46c-10-2-14 8-8 14 4 4 10 2 12-4" fill={palette.accent} />
        <path d="M22 38c-9-8-4-16 4-12 5 2 8 8 6 14" fill={palette.accent} />
        <path d="M76 46c10-2 14 8 8 14-4 4-10 2-12-4" fill={palette.accent} />
        <path d="M78 38c9-8 4-16-4-12-5 2-8 8-6 14" fill={palette.accent} />
      </g>
    );
  }
  if (species === "dragon") {
    return (
      <g>
        <path d="M28 18 22 4l10 10Z" fill={palette.accent} />
        <path d="M72 18 78 4 68 14Z" fill={palette.accent} />
        <path
          d="M22 72c-12-4-16 8-8 16 10 4 16-2 18-8"
          fill={palette.furDeep}
          opacity="0.92"
        />
        <path
          d="M78 72c12-4 16 8 8 16-10 4-16-2-18-8"
          fill={palette.furDeep}
          opacity="0.92"
        />
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
        <path d="M28 36 22 14l22 16Z" fill={palette.fur} />
        <path d="M72 36 78 14 56 30Z" fill={palette.fur} />
        <path d="M30 32 26 18l14 12Z" fill={palette.accent} opacity="0.7" />
        <path d="M70 32 74 18 56 30Z" fill={palette.accent} opacity="0.7" />
      </g>
    );
  }
  if (species === "deer") {
    return (
      <g>
        <path d="M30 32 24 16l18 12Z" fill={palette.fur} />
        <path d="M70 32 76 16 58 28Z" fill={palette.fur} />
        <path d="M32 29 28 20l10 8Z" fill={palette.belly} />
        <path d="M68 29 72 20 58 28Z" fill={palette.belly} />
      </g>
    );
  }
  if (species === "dragon") {
    return (
      <g>
        <path d="M30 30 26 16l16 12Z" fill={palette.fur} />
        <path d="M70 30 74 16 58 28Z" fill={palette.fur} />
      </g>
    );
  }
  return (
    <g>
      <path d="M29 34 20 8c10 4 18 16 20 22Z" fill={palette.fur} />
      <path d="M71 34 80 8c-10 4-18 16-20 22Z" fill={palette.fur} />
      <path d="M31 30 26 14c6 4 12 12 13 16Z" fill={palette.belly} />
      <path d="M69 30 74 14c-6 4-12 12-13 16Z" fill={palette.belly} />
    </g>
  );
}

function Tail({ species, palette }: { species: SpriteSpeciesId; palette: SpeciesPalette }) {
  if (species === "bunny") {
    return <ellipse cx="68" cy="90" rx="6.2" ry="5.4" fill={palette.belly} />;
  }
  if (species === "cat") {
    return (
      <path
        d="M66 88c16 2 22-10 16-20"
        fill="none"
        stroke={palette.fur}
        strokeWidth="5.2"
        strokeLinecap="round"
      />
    );
  }
  if (species === "axolotl") {
    return (
      <path
        d="M66 86c14 2 20 10 14 18-8 4-16-2-18-8"
        fill={palette.fur}
      />
    );
  }
  if (species === "dragon") {
    return (
      <g>
        <path
          d="M66 88c18 4 24-8 20-18"
          fill="none"
          stroke={palette.fur}
          strokeWidth="4.6"
          strokeLinecap="round"
        />
        <path d="M84 66l8 4-8 6Z" fill={palette.accent} />
      </g>
    );
  }
  if (species === "deer") {
    return <ellipse cx="67" cy="88" rx="5.4" ry="6.2" fill={palette.belly} />;
  }
  return (
    <g>
      <path
        d="M28 86c-16-6-20-24-8-34 8-6 16 4 16 14 6-4 14 2 12 12-2 10-12 14-20 8Z"
        fill={palette.fur}
      />
      <ellipse cx="18" cy="56" rx="6.4" ry="6" fill={palette.belly} />
    </g>
  );
}

function StageGlow({
  stage,
  glow,
  glowDeep,
  extraMagical,
}: {
  stage: CareStage;
  glow: string;
  glowDeep: string;
  extraMagical: boolean;
}) {
  const ethereal = stage === "ethereal";
  const luminary = stage === "luminary";
  if (!ethereal && !luminary) return null;
  const strong = extraMagical && ethereal;
  return (
    <g className="sprite-stage-glow" aria-hidden>
      <ellipse
        cx="50"
        cy="72"
        rx={strong ? 48 : ethereal ? 42 : 34}
        ry={strong ? 46 : ethereal ? 40 : 32}
        fill={glow}
        fillOpacity={strong ? 0.3 : ethereal ? 0.2 : 0.12}
      />
      <circle
        cx="50"
        cy="48"
        r={strong ? 38 : ethereal ? 34 : 0}
        fill="none"
        stroke={glow}
        strokeOpacity={strong ? 0.7 : 0.4}
        strokeWidth={strong ? 1.8 : 1.2}
      />
      <circle
        cx="50"
        cy="72"
        r={strong ? 44 : ethereal ? 40 : 32}
        fill="none"
        stroke={glowDeep}
        strokeOpacity={strong ? 0.62 : ethereal ? 0.45 : 0.28}
        strokeWidth="1.4"
      />
      {ethereal ? (
        <g className="sprite-ethereal-wisps" fill="none" stroke={glow} strokeLinecap="round">
          <path d="M14 70c8-18 10-8 18-22" strokeWidth="1.3" opacity="0.75" />
          <path d="M86 68c-8-16-8-6-18-20" strokeWidth="1.3" opacity="0.75" />
          <path d="M22 46c6-10 14-4 16-14" strokeWidth="1.1" opacity="0.55" />
          <path d="M78 44c-6-10-12-2-16-14" strokeWidth="1.1" opacity="0.55" />
          <circle cx="20" cy="34" r="1.3" fill={glow} stroke="none" />
          <circle cx="80" cy="30" r="1.1" fill={glow} stroke="none" />
          <circle cx="50" cy="16" r="1.2" fill={glow} stroke="none" />
          <circle cx="70" cy="20" r="0.8" fill={glow} stroke="none" />
          <circle cx="32" cy="22" r="0.8" fill={glow} stroke="none" />
          {strong ? (
            <g fill={glow} stroke="none">
              <circle cx="12" cy="52" r="1.4" />
              <circle cx="88" cy="50" r="1.3" />
              <circle cx="28" cy="14" r="1.1" />
              <circle cx="74" cy="12" r="1.15" />
              <circle cx="42" cy="8" r="0.9" />
              <circle cx="58" cy="10" r="0.85" />
              <circle cx="8" cy="70" r="0.8" />
              <circle cx="92" cy="72" r="0.8" />
              <path d="M50 6l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7Z" />
              <path d="M18 24l.5 1.3 1.3.5-1.3.5-.5 1.3-.5-1.3-1.3-.5 1.3-.5Z" />
              <path d="M82 22l.5 1.3 1.3.5-1.3.5-.5 1.3-.5-1.3-1.3-.5 1.3-.5Z" />
            </g>
          ) : null}
        </g>
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
}: SpriteCritterProps) {
  const hatchling = stage === "hatchling";
  const magical = extraMagical && stage === "ethereal";
  return (
    <g className="sprite-critter">
      {stageGlow ? (
        <StageGlow
          stage={stage}
          glow={palette.glow}
          glowDeep={palette.glowDeep}
          extraMagical={magical}
        />
      ) : null}
      <ellipse cx="50" cy="104" rx="18" ry="4.2" fill="#0B0B0F" opacity="0.22" />
      <g transform={hatchling ? "translate(50 96) scale(0.9) translate(-50 -96)" : undefined}>
        <Tail species={species} palette={palette} />
        <SpeciesExtras species={species} palette={palette} />
        <ellipse cx="50" cy="90" rx="16.5" ry="12.2" fill={palette.furDeep} />
        <ellipse cx="50" cy="88.6" rx="15.4" ry="11.2" fill={palette.fur} />
        <ellipse cx="50" cy="91" rx="9.6" ry="7.2" fill={palette.belly} />
        <ellipse cx="41.4" cy="99.6" rx="5.2" ry="3.1" fill={palette.accent} />
        <ellipse cx="58.6" cy="99.6" rx="5.2" ry="3.1" fill={palette.accent} />
        <Ears species={species} palette={palette} />
        <ellipse cx="50" cy="50" rx="29.6" ry="27.4" fill={palette.furDeep} />
        <ellipse cx="50" cy="49" rx="28.2" ry="26.2" fill={palette.fur} />
        <ellipse cx="50" cy="58" rx="16.4" ry="13" fill={palette.belly} />
        <ellipse cx="38" cy="42" rx="8" ry="5.4" fill="#fff" opacity="0.18" />
        {magical ? (
          <path
            d="M50 28l1.1 2.6 2.6 1.1-2.6 1.1L50 35.4 48.9 32.8 46.3 31.7l2.6-1.1Z"
            fill={palette.glow}
          />
        ) : null}
        <Face
          mood={mood}
          ink={palette.ink}
          nose={palette.nose}
          species={species}
          glow={palette.glow}
          extraMagical={magical}
        />
      </g>
    </g>
  );
}
