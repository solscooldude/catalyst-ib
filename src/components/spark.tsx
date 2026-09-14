"use client";

import { useId } from "react";
import {
  sparkFlavorFromContext,
  sparkHintFromTask,
  type SparkFlavor,
} from "@/lib/spark-flavor";
import { TASK_SUBJECT, type SubjectId, type TaskId } from "@/lib/constants";
import { cn } from "@/lib/utils";

export type SparkMood = "idle" | "locked" | "earning" | "done" | "tempted";

type SparkProps = {
  mood?: SparkMood;
  subject?: SubjectId | null;
  taskId?: TaskId | null;
  flavor?: SparkFlavor;
  hint?: string | null;
  size?: number;
  className?: string;
};

function Eyes({ mood, fill }: { mood: SparkMood; fill: string }) {
  if (mood === "idle") {
    return (
      <g fill={fill}>
        <rect x="34.5" y="63.2" width="9" height="2.6" rx="1.3" />
        <rect x="56.5" y="63.2" width="9" height="2.6" rx="1.3" />
      </g>
    );
  }

  if (mood === "locked") {
    return (
      <g fill={fill}>
        <rect x="30.5" y="63" width="14.5" height="2.8" rx="1.4" />
        <rect x="55" y="63" width="14.5" height="2.8" rx="1.4" />
      </g>
    );
  }

  if (mood === "earning") {
    return (
      <g fill={fill}>
        <ellipse cx="38.5" cy="64" rx="3.4" ry="4.6" />
        <ellipse cx="61.5" cy="64" rx="3.4" ry="4.6" />
      </g>
    );
  }

  if (mood === "done") {
    return (
      <g
        fill="none"
        stroke={fill}
        strokeWidth="2.2"
        strokeLinecap="round"
      >
        <path d="M33.5 65.2c2.2-3.2 7.2-3.2 9.4 0" />
        <path d="M57.1 65.2c2.2-3.2 7.2-3.2 9.4 0" />
        <path d="M45.6 73.2c1.6 1.8 7.2 1.8 8.8 0" />
      </g>
    );
  }

  return (
    <g fill={fill}>
      <ellipse cx="39" cy="64" rx="3.5" ry="4.8" />
      <ellipse cx="61" cy="64" rx="3.5" ry="4.8" />
      <ellipse cx="40.6" cy="63.4" rx="1.15" ry="1.6" fill="#5eead4" />
      <ellipse cx="62.6" cy="63.4" rx="1.15" ry="1.6" fill="#5eead4" />
    </g>
  );
}

function MathFlourish() {
  return (
    <g
      className="spark-flourish"
      fill="#5EEAD4"
      fontFamily="Geist, ui-sans-serif, system-ui, sans-serif"
      fontSize="8"
    >
      <text className="spark-symbol spark-symbol-a" x="6" y="30">
        π
      </text>
      <text className="spark-symbol spark-symbol-b" x="84" y="24" fontSize="7">
        ∑
      </text>
      <text className="spark-symbol spark-symbol-c" x="80" y="42" fontSize="6.5">
        x²
      </text>
    </g>
  );
}

function BiologyFlourish() {
  return (
    <g className="spark-flourish" fill="#5EEAD4">
      <g className="spark-leaf">
        <path d="M10 86c0-9 10-16 16-6-5 2-11 5-16 6Z" />
        <path
          d="M11 85c5-4 10-6 14-5"
          fill="none"
          stroke="#0B0B0F"
          strokeOpacity="0.22"
          strokeWidth="0.7"
        />
      </g>
      <g className="spark-cell" transform="translate(82 28)">
        <circle r="6.2" fill="#5EEAD4" fillOpacity="0.22" />
        <circle r="6.2" fill="none" stroke="#5EEAD4" strokeWidth="0.8" />
        <circle cx="-1.4" cy="-0.6" r="1.6" />
      </g>
    </g>
  );
}

function ChemistryFlourish() {
  return (
    <g className="spark-flourish" fill="#5EEAD4">
      <circle className="spark-bubble spark-bubble-a" cx="16" cy="78" r="2.1" />
      <circle className="spark-bubble spark-bubble-b" cx="24" cy="84" r="1.35" />
      <circle className="spark-bubble spark-bubble-c" cx="12" cy="86" r="1.1" />
      <g className="spark-molecule" transform="translate(82 30)">
        <circle cx="-6" cy="0" r="2.1" />
        <circle cx="6" cy="-3" r="1.7" />
        <circle cx="5" cy="5" r="1.7" />
        <path
          d="M-4.2 0h8.4M4.6-1.6 3.8 3.6"
          fill="none"
          stroke="#5EEAD4"
          strokeWidth="0.75"
        />
      </g>
    </g>
  );
}

function PhysicsFlourish() {
  return (
    <g className="spark-flourish spark-orbit" fill="#5EEAD4">
      <ellipse
        cx="50"
        cy="46"
        rx="36"
        ry="13"
        fill="none"
        stroke="#5EEAD4"
        strokeOpacity="0.35"
        strokeWidth="0.7"
      />
      <circle className="spark-orbit-dot" cx="86" cy="46" r="1.7" />
      <path
        className="spark-comet"
        d="M18 22c8 3 16 2 22-4"
        fill="none"
        stroke="#5EEAD4"
        strokeWidth="1"
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
        x="8"
        y="36"
        fill="#5EEAD4"
        fontSize="7"
        fontFamily="Geist, ui-sans-serif, system-ui, sans-serif"
      >
        ¿
      </text>
      <g className="spark-book" transform="translate(64 78)">
        <path
          d="M0 2 9-1l9 3v11l-9-2.4L0 13Z"
          fill="#121218"
          stroke="#5EEAD4"
          strokeWidth="1"
        />
        <path d="M9-1v11.6" fill="none" stroke="#5EEAD4" strokeWidth="0.8" />
        <path
          d="M3 6.2h4.2M3 8.6h3.4"
          fill="none"
          stroke="#A1A1AA"
          strokeWidth="0.55"
        />
      </g>
    </g>
  );
}

function HistoryFlourish() {
  return (
    <g className="spark-flourish spark-hourglass" fill="#5EEAD4">
      <path
        d="M80 22h12l-5.4 7.2 5.4 7.2H80l5.4-7.2Z"
        fill="none"
        stroke="#5EEAD4"
        strokeWidth="1"
        strokeLinejoin="round"
      />
      <path d="M83.2 24.2h5.6L86 28.4Z" fillOpacity="0.7" />
    </g>
  );
}

function GeographyFlourish() {
  return (
    <g className="spark-flourish spark-globe" transform="translate(82 28)">
      <circle r="7.2" fill="#5EEAD4" fillOpacity="0.16" />
      <circle r="7.2" fill="none" stroke="#5EEAD4" strokeWidth="0.85" />
      <ellipse
        rx="3.1"
        ry="7.2"
        fill="none"
        stroke="#5EEAD4"
        strokeWidth="0.6"
      />
      <path
        d="M-6.4-2.2h12.8M-6.6 2.4h13.2"
        fill="none"
        stroke="#5EEAD4"
        strokeWidth="0.55"
      />
    </g>
  );
}

function EconomicsFlourish() {
  return (
    <g className="spark-flourish spark-bars" fill="#5EEAD4" transform="translate(78 36)">
      <rect className="spark-bar spark-bar-a" x="0" y="6" width="3.2" height="8" rx="0.7" />
      <rect className="spark-bar spark-bar-b" x="5" y="2" width="3.2" height="12" rx="0.7" />
      <rect className="spark-bar spark-bar-c" x="10" y="8" width="3.2" height="6" rx="0.7" />
    </g>
  );
}

function PsychologyFlourish() {
  return (
    <g className="spark-flourish spark-thought" fill="#5EEAD4">
      <circle cx="18" cy="78" r="1.1" fillOpacity="0.55" />
      <circle cx="22" cy="72" r="1.55" fillOpacity="0.7" />
      <path
        d="M28 54c-6 0-10 4.2-10 9.2 0 3.4 2 6.4 5.2 8l-.4 4.6 5.2-3.2c.8.12 1.6.2 2.4.2 6 0 10-4.2 10-9.4S34 54 28 54Z"
        fill="#5EEAD4"
        fillOpacity="0.18"
        stroke="#5EEAD4"
        strokeWidth="0.85"
      />
    </g>
  );
}

function CsFlourish() {
  return (
    <g
      className="spark-flourish"
      fill="#5EEAD4"
      fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
      fontSize="6.5"
    >
      <text className="spark-bits spark-bits-a" x="6" y="32">
        01
      </text>
      <text className="spark-bits spark-bits-b" x="82" y="40">
        10
      </text>
      <rect className="spark-cursor" x="84" y="78" width="1.2" height="7" rx="0.4" />
    </g>
  );
}

function ArtsFlourish() {
  return (
    <g className="spark-flourish" fill="none" stroke="#5EEAD4">
      <path
        className="spark-brush"
        d="M12 80c8-10 18-16 28-12 6 2 8 10 4 14"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <circle className="spark-dab" cx="84" cy="30" r="3.2" fill="#5EEAD4" stroke="none" />
    </g>
  );
}

function MusicFlourish() {
  return (
    <g
      className="spark-flourish"
      fill="#5EEAD4"
      fontFamily="Geist, ui-sans-serif, system-ui, sans-serif"
      fontSize="9"
    >
      <text className="spark-note spark-note-a" x="8" y="34">
        ♪
      </text>
      <text className="spark-note spark-note-b" x="82" y="28">
        ♫
      </text>
    </g>
  );
}

function ResearchFlourish() {
  return (
    <g className="spark-flourish spark-lens" fill="none" stroke="#5EEAD4">
      <circle cx="80" cy="30" r="6" strokeWidth="1.05" />
      <path d="M84.6 35.2 90 41" strokeWidth="1.2" strokeLinecap="round" />
      <rect
        x="8"
        y="76"
        width="10"
        height="12"
        rx="1.2"
        fill="#121218"
        strokeWidth="0.85"
      />
      <rect
        x="11"
        y="73"
        width="10"
        height="12"
        rx="1.2"
        fill="#121218"
        fillOpacity="0.85"
        strokeWidth="0.85"
      />
    </g>
  );
}

function CasFlourish() {
  return (
    <g className="spark-flourish" fill="none" stroke="#5EEAD4">
      <path
        className="spark-pulse"
        d="M10 80h8l3-8 4 14 3-6h10"
        strokeWidth="1.15"
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
  size = 72,
  className,
}: SparkProps) {
  const uid = useId().replace(/:/g, "");
  const glowId = `spark-glow-${uid}`;
  const bodyId = `spark-body-${uid}`;
  const specId = `spark-spec-${uid}`;
  const resolved =
    flavor ??
    sparkFlavorFromContext({
      subjectId: subject ?? (taskId ? TASK_SUBJECT[taskId] : undefined),
      text: hint ?? sparkHintFromTask(taskId),
    });
  const canGlance = mood === "idle" || mood === "locked";

  return (
    <div
      className={cn("spark-float pointer-events-none relative", className)}
      style={{ width: size, height: size }}
      aria-hidden
    >
      <span className="spark-halo absolute inset-[-22%] rounded-full" />
      <svg
        viewBox="-16 -12 132 136"
        width={size}
        height={size}
        className="relative z-10 overflow-visible"
      >
        <defs>
          <radialGradient id={glowId} cx="50%" cy="58%" r="48%">
            <stop offset="0%" stopColor="#5EEAD4" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#5EEAD4" stopOpacity="0" />
          </radialGradient>
          <radialGradient id={bodyId} cx="38%" cy="32%" r="72%">
            <stop offset="0%" stopColor="#B8FFF3" />
            <stop offset="42%" stopColor="#7AF0DC" />
            <stop offset="100%" stopColor="#5EEAD4" />
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
          <g className={canGlance ? "spark-glance" : undefined}>
            <Eyes mood={mood} fill="#0B0B0F" />
          </g>
        </g>

        {mood === "earning" ? (
          <g className="spark-particles" fill="#5EEAD4">
            <circle className="spark-dot spark-dot-a" cx="18" cy="36" r="1.4" />
            <circle className="spark-dot spark-dot-b" cx="84" cy="42" r="1.15" />
            <circle className="spark-dot spark-dot-c" cx="78" cy="78" r="1.05" />
            <circle className="spark-dot spark-dot-d" cx="22" cy="80" r="0.95" />
          </g>
        ) : null}

        {mood !== "tempted" ? <SubjectFlourish flavor={resolved} /> : null}
      </svg>
    </div>
  );
}
