"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

export type SparkMood = "idle" | "locked" | "earning" | "done" | "tempted";

type SparkProps = {
  mood?: SparkMood;
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

export function Spark({ mood = "idle", size = 72, className }: SparkProps) {
  const uid = useId().replace(/:/g, "");
  const glowId = `spark-glow-${uid}`;
  const bodyId = `spark-body-${uid}`;
  const specId = `spark-spec-${uid}`;

  return (
    <div
      className={cn("spark-float pointer-events-none relative", className)}
      style={{ width: size, height: size }}
      aria-hidden
    >
      <span className="spark-halo absolute inset-[-18%] rounded-full" />
      <svg
        viewBox="0 0 100 112"
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

        <path
          d="M50 10C50 10 22 46 22 70c0 16.6 12.1 26 28 26s28-9.4 28-26C78 46 50 10 50 10Z"
          fill={`url(#${bodyId})`}
        />
        <ellipse cx="40" cy="48" rx="11" ry="8" fill={`url(#${specId})`} />

        <Eyes mood={mood} fill="#0B0B0F" />

        {mood === "earning" ? (
          <g className="spark-particles" fill="#5EEAD4">
            <circle className="spark-dot spark-dot-a" cx="18" cy="36" r="1.4" />
            <circle className="spark-dot spark-dot-b" cx="84" cy="42" r="1.15" />
            <circle className="spark-dot spark-dot-c" cx="78" cy="78" r="1.05" />
            <circle className="spark-dot spark-dot-d" cx="22" cy="80" r="0.95" />
          </g>
        ) : null}
      </svg>
    </div>
  );
}
