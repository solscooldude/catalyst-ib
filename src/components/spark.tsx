"use client";

import { useEffect, useId, useRef, useState } from "react";
import {
  getSparkTint,
  type SparkGearId,
  type SparkTintId,
} from "@/lib/appearance";
import {
  sparkFlavorFromContext,
  sparkHintFromTask,
  type SparkFlavor,
} from "@/lib/spark-flavor";
import { TASK_SUBJECT, type SubjectId, type TaskId } from "@/lib/constants";
import { useCatalyst } from "@/lib/store";
import { cn } from "@/lib/utils";

export type SparkMood = "idle" | "locked" | "earning" | "done" | "tempted";

type SparkProps = {
  mood?: SparkMood;
  subject?: SubjectId | null;
  taskId?: TaskId | null;
  flavor?: SparkFlavor;
  hint?: string | null;
  tint?: SparkTintId;
  gear?: SparkGearId;
  size?: number;
  className?: string;
  pettable?: boolean;
  flourish?: "loop" | "now";
};

function OpenEyes({
  wider,
  look,
  fill,
}: {
  wider?: boolean;
  look?: "center" | "side";
  fill: string;
}) {
  const rx = wider ? 5.4 : 4.6;
  const ry = wider ? 6.4 : 5.6;
  const pupil = look === "side" ? 1.7 : 0;
  return (
    <g className="spark-blink">
      <ellipse cx="38.2" cy="63.6" rx={rx} ry={ry} fill={fill} />
      <ellipse cx="61.8" cy="63.6" rx={rx} ry={ry} fill={fill} />
      <ellipse
        cx={39.6 + pupil}
        cy="62.1"
        rx="1.55"
        ry="1.95"
        fill="#fff"
        fillOpacity="0.88"
      />
      <ellipse
        cx={63.2 + pupil}
        cy="62.1"
        rx="1.55"
        ry="1.95"
        fill="#fff"
        fillOpacity="0.88"
      />
    </g>
  );
}

function Heart() {
  return (
    <path d="M8 3.2C6.6.8 3.2.6 1.8 2.7-.1 5.4 1.6 8.6 8 13.4c6.4-4.8 8.1-8 6.2-10.7C12.8.6 9.4.8 8 3.2Z" />
  );
}

function PetHearts() {
  return (
    <g className="spark-hearts" fill="#F9A8D4">
      <g className="spark-heart spark-heart-a" transform="translate(6 18) scale(1.05)">
        <Heart />
      </g>
      <g className="spark-heart spark-heart-b" transform="translate(78 12) scale(0.85)">
        <Heart />
      </g>
      <g className="spark-heart spark-heart-c" transform="translate(86 48) scale(0.7)">
        <Heart />
      </g>
    </g>
  );
}

function Eyes({ mood, fill }: { mood: SparkMood; fill: string }) {
  if (mood === "done") {
    return (
      <g fill="none" stroke={fill} strokeWidth="2.2" strokeLinecap="round">
        <path d="M33.5 65.2c2.2-3.2 7.2-3.2 9.4 0" />
        <path d="M57.1 65.2c2.2-3.2 7.2-3.2 9.4 0" />
        <path d="M45.6 73.2c1.6 1.8 7.2 1.8 8.8 0" />
      </g>
    );
  }
  if (mood === "tempted") return <OpenEyes look="side" fill={fill} />;
  if (mood === "locked" || mood === "earning") {
    return <OpenEyes wider fill={fill} />;
  }
  return <OpenEyes fill={fill} />;
}

function Gear({ id }: { id: SparkGearId }) {
  if (id === "bow") {
    return (
      <g fill="#F9A8D4" stroke="#BE185D" strokeOpacity="0.35" strokeWidth="0.6">
        <path d="M42 16c-4-6 2-9 6-4 4-5 10-2 6 4l-6 3Z" />
        <circle cx="50" cy="18.5" r="2.1" fill="#F472B6" />
      </g>
    );
  }
  if (id === "glasses") {
    return (
      <g fill="none" stroke="#0B0B0F" strokeWidth="1.6">
        <circle cx="38.2" cy="63.4" r="8.2" />
        <circle cx="61.8" cy="63.4" r="8.2" />
        <path d="M46.4 63.2h7.2" />
      </g>
    );
  }
  if (id === "scarf") {
    return (
      <g fill="#DC2626">
        <path d="M32 78c6 8 30 8 36 0-4 10-10 14-18 14-7 0-13-4-18-14Z" />
        <path d="M58 90c2 8 7 13 4 18-6-2-10-10-9-16Z" fill="#B91C1C" />
      </g>
    );
  }
  if (id === "cap") {
    return (
      <g>
        <path d="M22 20 50 10l28 10-28 10Z" fill="#18181B" />
        <path d="M38 22h24l-1.6 8H39.6Z" fill="#27272A" />
        <path
          d="M50 12c8 4 14 10 16 16"
          fill="none"
          stroke="#FBBF24"
          strokeWidth="1.4"
        />
        <circle cx="67" cy="29" r="2.1" fill="#FBBF24" />
      </g>
    );
  }
  return null;
}

function MathFlourish() {
  return (
    <g
      className="spark-flourish"
      fill="currentColor"
      fontFamily="Geist, ui-sans-serif, system-ui, sans-serif"
      fontSize="16"
    >
      <text className="spark-symbol spark-symbol-a" x="0" y="28">
        π
      </text>
      <text className="spark-symbol spark-symbol-b" x="92" y="22" fontSize="15">
        ∑
      </text>
      <text className="spark-symbol spark-symbol-c" x="86" y="48" fontSize="13">
        x²
      </text>
      <text className="spark-symbol spark-symbol-a" x="4" y="50" fontSize="12">
        √
      </text>
    </g>
  );
}

function BiologyFlourish() {
  return (
    <g className="spark-flourish" fill="currentColor">
      <g className="spark-leaf">
        <path d="M4 92c0-14 16-24 24-8-8 3-16 7-24 8Z" />
        <path d="M18 86c-4-8 6-16 14-6-6 2-11 5-14 6Z" />
        <path
          d="M6 90c8-6 16-9 21-7"
          fill="none"
          stroke="#0B0B0F"
          strokeOpacity="0.2"
          strokeWidth="0.8"
        />
      </g>
      <g className="spark-cell" transform="translate(94 24)">
        <circle r="9" fill="currentColor" fillOpacity="0.2" />
        <circle r="9" fill="none" stroke="currentColor" strokeWidth="1.1" />
        <circle cx="-2" cy="-1" r="2.4" />
      </g>
      <g className="spark-cell spark-cell-b" transform="translate(78 44)">
        <circle r="6.2" fill="currentColor" fillOpacity="0.18" />
        <circle r="6.2" fill="none" stroke="currentColor" strokeWidth="0.9" />
        <circle cx="1.2" cy="0.8" r="1.6" />
      </g>
      <g className="spark-cell spark-cell-c" transform="translate(12 28)">
        <circle r="5" fill="currentColor" fillOpacity="0.16" />
        <circle r="5" fill="none" stroke="currentColor" strokeWidth="0.8" />
        <circle cx="-0.8" cy="-0.4" r="1.3" />
      </g>
    </g>
  );
}

function ChemistryFlourish() {
  return (
    <g className="spark-flourish" fill="currentColor">
      <circle className="spark-bubble spark-bubble-a" cx="14" cy="74" r="4.2" fillOpacity="0.85" />
      <circle className="spark-bubble spark-bubble-b" cx="28" cy="84" r="2.8" fillOpacity="0.7" />
      <circle className="spark-bubble spark-bubble-c" cx="8" cy="88" r="2.2" fillOpacity="0.6" />
      <g className="spark-molecule" transform="translate(90 28)">
        <circle cx="-9" cy="0" r="3.4" />
        <circle cx="8" cy="-5" r="2.7" />
        <circle cx="7" cy="7" r="2.7" />
        <path
          d="M-6 0h12.2M6.4-3.2 5.2 5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.15"
        />
      </g>
    </g>
  );
}

function PhysicsFlourish() {
  return (
    <g className="spark-flourish spark-orbit" fill="currentColor">
      <ellipse
        cx="50"
        cy="48"
        rx="46"
        ry="18"
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.45"
        strokeWidth="1.15"
      />
      <circle cx="96" cy="48" r="3" />
      <circle cx="8" cy="42" r="2.1" />
      <path
        d="M10 18c12 5 24 4 34-7"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </g>
  );
}

function ReadingFlourish() {
  return (
    <g className="spark-flourish">
      <text
        className="spark-crumb"
        x="2"
        y="34"
        fill="currentColor"
        fontSize="13"
        fontFamily="Geist, ui-sans-serif, system-ui, sans-serif"
      >
        ¿
      </text>
      <text
        className="spark-crumb"
        x="88"
        y="30"
        fill="currentColor"
        fontSize="12"
        fontFamily="Geist, ui-sans-serif, system-ui, sans-serif"
      >
        ä
      </text>
      <g className="spark-book" transform="translate(58 74) scale(1.35)">
        <path
          d="M0 2 9-1l9 3v11l-9-2.4L0 13Z"
          fill="#121218"
          stroke="currentColor"
          strokeWidth="1.1"
        />
        <path d="M9-1v11.6" fill="none" stroke="currentColor" strokeWidth="0.9" />
        <path
          d="M3 6.2h4.2M3 8.6h3.4"
          fill="none"
          stroke="#A1A1AA"
          strokeWidth="0.6"
        />
      </g>
    </g>
  );
}

function HistoryFlourish() {
  return (
    <g className="spark-flourish spark-hourglass" fill="currentColor">
      <path
        d="M78 16h18l-8 11 8 11H78l8-11Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M82.4 19.4h9.2L87 26Z" fillOpacity="0.75" />
    </g>
  );
}

function GeographyFlourish() {
  return (
    <g className="spark-flourish spark-globe" transform="translate(90 26)">
      <circle r="11" fill="currentColor" fillOpacity="0.16" />
      <circle r="11" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <ellipse rx="4.6" ry="11" fill="none" stroke="currentColor" strokeWidth="0.85" />
      <path
        d="M-9.6-3.2h19.2M-10 3.6h20"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.8"
      />
    </g>
  );
}

function EconomicsFlourish() {
  return (
    <g className="spark-flourish spark-bars" fill="currentColor" transform="translate(76 28)">
      <rect className="spark-bar spark-bar-a" x="0" y="10" width="5" height="14" rx="1" />
      <rect className="spark-bar spark-bar-b" x="8" y="2" width="5" height="22" rx="1" />
      <rect className="spark-bar spark-bar-c" x="16" y="14" width="5" height="10" rx="1" />
    </g>
  );
}

function PsychologyFlourish() {
  return (
    <g className="spark-flourish spark-thought" fill="currentColor">
      <circle cx="14" cy="82" r="1.8" fillOpacity="0.55" />
      <circle cx="20" cy="74" r="2.5" fillOpacity="0.7" />
      <path
        d="M30 48c-9 0-15 6.4-15 14 0 5.2 3.2 9.8 8 12.2l-.6 7 8-4.8c1.2.2 2.4.3 3.6.3 9 0 15-6.4 15-14S39 48 30 48Z"
        fill="currentColor"
        fillOpacity="0.16"
        stroke="currentColor"
        strokeWidth="1.15"
      />
    </g>
  );
}

function CsFlourish() {
  return (
    <g
      className="spark-flourish"
      fill="currentColor"
      fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
      fontSize="12"
    >
      <text className="spark-bits spark-bits-a" x="0" y="30">
        01
      </text>
      <text className="spark-bits spark-bits-b" x="86" y="38">
        10
      </text>
      <rect className="spark-cursor" x="88" y="76" width="2" height="11" rx="0.5" />
    </g>
  );
}

function ArtsFlourish() {
  return (
    <g className="spark-flourish" fill="none" stroke="currentColor">
      <path
        className="spark-brush"
        d="M6 86c12-16 28-24 42-16 9 3 12 16 5 22"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle className="spark-dab" cx="90" cy="26" r="5.4" fill="currentColor" stroke="none" />
      <circle className="spark-dab" cx="78" cy="36" r="3.2" fill="currentColor" fillOpacity="0.55" stroke="none" />
    </g>
  );
}

function MusicFlourish() {
  return (
    <g
      className="spark-flourish"
      fill="currentColor"
      fontFamily="Geist, ui-sans-serif, system-ui, sans-serif"
      fontSize="18"
    >
      <text className="spark-note spark-note-a" x="2" y="34">
        ♪
      </text>
      <text className="spark-note spark-note-b" x="86" y="26">
        ♫
      </text>
    </g>
  );
}

function ResearchFlourish() {
  return (
    <g className="spark-flourish spark-lens" fill="none" stroke="currentColor">
      <circle cx="84" cy="26" r="9.2" strokeWidth="1.5" />
      <path d="M91 33.6 99 42" strokeWidth="1.8" strokeLinecap="round" />
      <rect x="4" y="74" width="14" height="16" rx="1.6" fill="#121218" strokeWidth="1.1" />
      <rect
        x="10"
        y="70"
        width="14"
        height="16"
        rx="1.6"
        fill="#121218"
        fillOpacity="0.88"
        strokeWidth="1.1"
      />
    </g>
  );
}

function CasFlourish() {
  return (
    <g className="spark-flourish" fill="none" stroke="currentColor">
      <path
        className="spark-pulse"
        d="M4 82h14l5-14 7 24 5-10h16"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  );
}

function SubjectFlourish({ flavor }: { flavor: SparkFlavor }) {
  if (flavor === "math") return <MathFlourish />;
  if (flavor === "biology") return <BiologyFlourish />;
  if (flavor === "chemistry") return <ChemistryFlourish />;
  if (flavor === "physics") return <PhysicsFlourish />;
  if (flavor === "reading") return <ReadingFlourish />;
  if (flavor === "history") return <HistoryFlourish />;
  if (flavor === "geography") return <GeographyFlourish />;
  if (flavor === "economics") return <EconomicsFlourish />;
  if (flavor === "psychology") return <PsychologyFlourish />;
  if (flavor === "cs") return <CsFlourish />;
  if (flavor === "arts") return <ArtsFlourish />;
  if (flavor === "music") return <MusicFlourish />;
  if (flavor === "research") return <ResearchFlourish />;
  if (flavor === "cas") return <CasFlourish />;
  return null;
}

export function Spark({
  mood = "idle",
  subject,
  taskId,
  flavor,
  hint,
  tint,
  gear,
  size = 72,
  className,
  pettable = false,
  flourish = "loop",
}: SparkProps) {
  const uid = useId().replace(/:/g, "");
  const glowId = `spark-glow-${uid}`;
  const bodyId = `spark-body-${uid}`;
  const specId = `spark-spec-${uid}`;
  const store = useCatalyst();
  const tintId = tint ?? store.appearance.sparkTint;
  const gearId = gear ?? store.appearance.gear;
  const palette = getSparkTint(tintId);
  const resolved =
    flavor ??
    sparkFlavorFromContext({
      subjectId: subject ?? (taskId ? TASK_SUBJECT[taskId] : undefined),
      text: hint ?? sparkHintFromTask(taskId),
    });
  const busy = mood === "locked" || mood === "earning";
  const canPet = pettable && !busy;
  const [petted, setPetted] = useState(false);
  const petTimer = useRef<number>(0);

  useEffect(() => {
    return () => window.clearTimeout(petTimer.current);
  }, []);

  function pet() {
    if (!canPet) return;
    setPetted(true);
    window.clearTimeout(petTimer.current);
    petTimer.current = window.setTimeout(() => setPetted(false), 1800);
  }

  const shownMood: SparkMood = petted ? "done" : mood;
  const canGlance = !petted && (mood === "idle" || mood === "locked");
  const frameClass = cn(
    "spark-float relative",
    canPet ? "cursor-pointer border-0 bg-transparent p-0" : "pointer-events-none",
    petted && "spark-petted",
    flourish === "now" && "spark-idle-pop",
    className,
  );
  const frameStyle = { width: size, height: size, color: palette.lo };

  const body = (
    <>
      <span className="spark-halo absolute inset-[-28%] rounded-full" />
      <svg
        viewBox="-22 -18 144 150"
        width={size}
        height={size}
        className="relative z-10 overflow-visible"
      >
        <defs>
          <radialGradient id={glowId} cx="50%" cy="58%" r="48%">
            <stop offset="0%" stopColor={palette.lo} stopOpacity="0.55" />
            <stop offset="100%" stopColor={palette.lo} stopOpacity="0" />
          </radialGradient>
          <radialGradient id={bodyId} cx="38%" cy="32%" r="72%">
            <stop offset="0%" stopColor={palette.hi} />
            <stop offset="42%" stopColor={palette.mid} />
            <stop offset="100%" stopColor={palette.lo} />
          </radialGradient>
          <radialGradient id={specId} cx="35%" cy="30%" r="22%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </radialGradient>
        </defs>

        <ellipse cx="50" cy="72" rx="28" ry="24" fill={`url(#${glowId})`} />

        <g className="spark-body">
          <path
            d="M50 10C50 10 22 46 22 70c0 16.6 12.1 26 28 26s28-9.4 28-26C78 46 50 10 50 10Z"
            fill={`url(#${bodyId})`}
          />
          <ellipse cx="40" cy="48" rx="11" ry="8" fill={`url(#${specId})`} />
          <Gear id={gearId} />
          <g className={canGlance ? "spark-glance" : undefined}>
            <Eyes mood={shownMood} fill="#0B0B0F" />
          </g>
        </g>

        {petted ? <PetHearts /> : null}

        {mood === "earning" ? (
          <g className="spark-particles" fill="currentColor">
            <circle className="spark-dot spark-dot-a" cx="14" cy="32" r="2" />
            <circle className="spark-dot spark-dot-b" cx="90" cy="38" r="1.6" />
            <circle className="spark-dot spark-dot-c" cx="84" cy="80" r="1.4" />
            <circle className="spark-dot spark-dot-d" cx="18" cy="82" r="1.3" />
          </g>
        ) : null}

        {mood !== "tempted" ? <SubjectFlourish flavor={resolved} /> : null}
      </svg>
    </>
  );

  if (canPet) {
    return (
      <button
        type="button"
        onClick={pet}
        aria-label="Pet the spark"
        className={frameClass}
        style={frameStyle}
      >
        {body}
      </button>
    );
  }

  return (
    <div aria-hidden className={frameClass} style={frameStyle}>
      {body}
    </div>
  );
}
