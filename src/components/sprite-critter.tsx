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
          d="M30 36c-8-4-18 8-16 28 1.2 12 10 14 14 4 3-8 4-20 2-32Z"
          fill={palette.fur}
          stroke={palette.furDeep}
          strokeWidth="0.55"
        />
        <path d="M31 42c-4 2-8 12-6 22 1.2 6 6 5 7-4 1-8 1-14-1-18Z" fill={palette.accent} />
        <path
          d="M70 36c8-4 18 8 16 28-1.2 12-10 14-14 4-3-8-4-20-2-32Z"
          fill={palette.fur}
          stroke={palette.furDeep}
          strokeWidth="0.55"
        />
        <path d="M69 42c4 2 8 12 6 22-1.2 6-6 5-7-4-1-8-1-14 1-18Z" fill={palette.accent} />
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
    return <path d="M66 86c14 2 20 10 14 18-8 4-16-2-18-8" fill={palette.fur} />;
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
      <ellipse cx="14" cy="50" rx="3.4" ry="3.2" fill="#FFF8EE" />
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
      <radialGradient id={`${uid}-head`} cx="36%" cy="30%" r="72%">
        <stop offset="0%" stopColor={palette.belly} stopOpacity="0.42" />
        <stop offset="48%" stopColor={palette.fur} stopOpacity="0" />
        <stop offset="100%" stopColor={palette.furDeep} stopOpacity="0.5" />
      </radialGradient>
      <radialGradient id={`${uid}-body`} cx="40%" cy="28%" r="78%">
        <stop offset="0%" stopColor={palette.belly} stopOpacity="0.28" />
        <stop offset="100%" stopColor={palette.furDeep} stopOpacity="0.38" />
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
            <circle cx="44" cy="2" r="0.8" />
            <circle cx="56" cy="1" r="0.7" fill={glow} />
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
        <circle cx="34" cy="22" r="2" fill={glow} fillOpacity="0.35" stroke="none" />
        <circle cx="68" cy="20" r="1.7" fill={glowDeep} fillOpacity="0.4" stroke="none" />
        {strong ? (
          <g>
            <circle cx="8" cy="72" r="3.6" stroke={glow} strokeWidth="1" opacity="0.55" />
            <circle cx="92" cy="70" r="3.2" stroke={glowDeep} strokeWidth="1" opacity="0.55" />
            <circle cx="42" cy="8" r="1.8" fill={glow} fillOpacity="0.45" stroke="none" />
            <circle cx="58" cy="6" r="1.5" fill={glowDeep} fillOpacity="0.4" stroke="none" />
            <circle cx="4" cy="48" r="2.2" stroke={glowDeep} strokeWidth="0.9" opacity="0.45" />
            <circle cx="96" cy="46" r="2" stroke={glow} strokeWidth="0.9" opacity="0.45" />
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
        <path d="M24 44c4-10 12-2 12-12" stroke={glowDeep} strokeWidth="1.15" opacity="0.65" />
        <path d="M76 42c-4-10-10-2-12-12" stroke={glow} strokeWidth="1.15" opacity="0.65" />
        <ellipse cx="20" cy="36" rx="2.2" ry="3.4" fill={glowDeep} stroke="none" opacity="0.7" />
        <ellipse cx="80" cy="32" rx="2" ry="3.1" fill={glow} stroke="none" opacity="0.7" />
        <ellipse cx="50" cy="14" rx="1.6" ry="2.4" fill={glowDeep} stroke="none" opacity="0.6" />
        {strong ? (
          <g>
            <ellipse cx="10" cy="54" rx="1.8" ry="2.8" fill={glow} opacity="0.55" />
            <ellipse cx="90" cy="52" rx="1.7" ry="2.6" fill={glowDeep} opacity="0.55" />
            <circle cx="36" cy="10" r="1" fill={glow} />
            <circle cx="64" cy="8" r="0.9" fill={glowDeep} />
            <ellipse cx="4" cy="44" rx="1.4" ry="2.1" fill={glowDeep} opacity="0.45" />
            <ellipse cx="96" cy="40" rx="1.3" ry="2" fill={glow} opacity="0.45" />
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
        <HeartMark x={28} y={18} scale={0.36} fill={glow} />
        <HeartMark x={72} y={16} scale={0.34} fill={glowDeep} />
        <circle cx="12" cy="58" r="1.2" fill={glow} />
        <circle cx="88" cy="56" r="1.1" fill={glowDeep} />
        {strong ? (
          <g>
            <HeartMark x={8} y={68} scale={0.4} fill={CAT_HEART} />
            <HeartMark x={92} y={66} scale={0.38} fill={glow} />
            <HeartMark x={36} y={-2} scale={0.28} fill={glow} />
            <circle cx="40" cy="6" r="0.9" fill={glow} />
            <circle cx="60" cy="5" r="0.85" fill={glowDeep} />
            <circle cx="4" cy="48" r="1.05" fill={glow} />
            <circle cx="96" cy="44" r="0.95" fill={glowDeep} />
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
        <circle cx="34" cy="18" r="1" fill={glowDeep} />
        <circle cx="66" cy="16" r="0.95" fill={glow} />
        <path
          d="M14 70c8-16 10-6 16-18"
          fill="none"
          stroke={glow}
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.65"
        />
        <path
          d="M86 68c-8-14-8-4-16-16"
          fill="none"
          stroke={glowDeep}
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.65"
        />
        {strong ? (
          <g>
            <ellipse cx="8" cy="66" rx="2.4" ry="3.4" fill={glowDeep} opacity="0.4" />
            <ellipse cx="92" cy="64" rx="2.2" ry="3.2" fill={glow} opacity="0.4" />
            <circle cx="42" cy="7" r="1.05" fill={glow} />
            <circle cx="58" cy="6" r="0.95" fill={glowDeep} />
            <circle cx="4" cy="46" r="1.15" fill={glow} />
            <circle cx="96" cy="42" r="1.05" fill={glowDeep} />
            <circle cx="50" cy="2" r="0.85" fill={glow} />
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
      <circle cx="30" cy="16" r="1.2" fill={glow} />
      <circle cx="70" cy="14" r="1.1" fill={glowDeep} />
      {strong ? (
        <g>
          <StarMark x={8} y={70} scale={0.62} fill={glowDeep} />
          <StarMark x={92} y={68} scale={0.58} fill={glow} />
          <StarMark x={38} y={4} scale={0.45} fill={glow} />
          <StarMark x={62} y={3} scale={0.42} fill={glowDeep} />
          <StarMark x={4} y={44} scale={0.36} fill={glow} />
          <StarMark x={96} y={40} scale={0.34} fill={glowDeep} />
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
      <ellipse cx="52" cy="86" rx="16" ry="4.5" fill="#0B0B0F" opacity="0.18" />
      <ellipse cx="50" cy="62" rx="22.5" ry="29.5" fill={palette.egg} />
      <ellipse cx="50" cy="64" rx="20" ry="26" fill={palette.eggWash} opacity="0.32" />
      <ellipse cx="42" cy="50" rx="8" ry="6" fill="#FFF8E7" opacity="0.55" />
      {species === "cat" || species === "bunny" ? (
        <g transform="translate(50 64)">
          <HeartMark x={-3.2} y={-4} scale={0.55} fill={palette.eggMark} />
        </g>
      ) : species === "fox" ? (
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
      <ellipse cx="50" cy="104" rx="18" ry="4.2" fill="#0B0B0F" opacity="0.22" />
      <g transform={hatchling ? "translate(50 96) scale(0.9) translate(-50 -96)" : undefined}>
        <Tail species={species} palette={palette} />
        <SpeciesExtras species={species} palette={palette} />
        <ellipse cx="50" cy="90" rx="16.5" ry="12.2" fill={palette.furDeep} />
        <ellipse cx="50" cy="88.6" rx="15.4" ry="11.2" fill={palette.fur} />
        <ellipse cx="50" cy="88.6" rx="15.4" ry="11.2" fill={`url(#${uid}-body)`} />
        <ellipse cx="50" cy="91" rx="9.6" ry="7.2" fill={palette.belly} />
        <ellipse cx="41.4" cy="99.6" rx="5.2" ry="3.1" fill={palette.accent} />
        <ellipse cx="58.6" cy="99.6" rx="5.2" ry="3.1" fill={palette.accent} />
        <Ears species={species} palette={palette} />
        <ellipse cx="50" cy="50" rx="29.6" ry="27.4" fill={palette.furDeep} />
        <ellipse cx="50" cy="49" rx="28.2" ry="26.2" fill={palette.fur} />
        <ellipse cx="50" cy="49" rx="28.2" ry="26.2" fill={`url(#${uid}-head)`} />
        <ellipse cx="50" cy="58" rx="16.4" ry="13" fill={palette.belly} />
        <ellipse cx="37" cy="40" rx="9.2" ry="6.2" fill="#fff" opacity="0.22" />
        <ellipse cx="32" cy="62" rx="5.4" ry="3.2" fill={palette.accent} opacity="0.28" />
        <ellipse cx="68" cy="62" rx="5.4" ry="3.2" fill={palette.accent} opacity="0.28" />
        {species === "cat" ? (
          <g transform="translate(50 68)">
            <HeartMark x={-3.4} y={-5} scale={0.52} fill={CAT_HEART} />
          </g>
        ) : null}
        {magical ? (
          <path
            d="M50 26.4l1.25 2.9 2.9 1.25-2.9 1.25L50 34.7 48.75 31.8 45.85 30.55l2.9-1.25Z"
            fill={palette.glow}
          />
        ) : null}
        <Face
          mood={mood}
          ink={palette.ink}
          nose={palette.nose}
          species={species}
          glow={palette.glow}
          glowDeep={palette.glowDeep}
          extraMagical={magical}
          uid={uid}
        />
      </g>
    </g>
  );
}
