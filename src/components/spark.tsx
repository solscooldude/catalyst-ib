"use client";

import { useEffect, useId, useRef, useState, type Ref } from "react";
import "@/app/sprite-motion.css";
import {
  getSparkAura,
  getSparkTint,
  type SparkAuraId,
  type SparkGearId,
  type SparkTintId,
  type SparkTrailId,
} from "@/lib/appearance";
import { SparkParticleRing, SubjectFlourish } from "@/components/spark-flourishes";
import { SPARK_BODY_PATH } from "@/lib/spark-silhouette";
import {
  SPARK_FLAVOR_INK,
  sparkFlavorFromContext,
  sparkHintFromTask,
  type SparkFlavor,
} from "@/lib/spark-flavor";
import { TASK_SUBJECT, type SubjectId, type TaskId } from "@/lib/constants";
import { type SnackId, type SparkAct } from "@/lib/spark-play";
import { displaySpriteName } from "@/lib/sprite-name";
import { sparkEvolutionFromState } from "@/lib/stats";
import { useCatalyst } from "@/lib/store";
import { cn } from "@/lib/utils";

export type SparkMood =
  | "idle"
  | "locked"
  | "earning"
  | "done"
  | "tempted"
  | "annoyed"
  | "sleepy"
  | "eating";

type SparkProps = {
  mood?: SparkMood;
  subject?: SubjectId | null;
  taskId?: TaskId | null;
  flavor?: SparkFlavor;
  hint?: string | null;
  tint?: SparkTintId;
  gear?: SparkGearId;
  aura?: SparkAuraId;
  trail?: SparkTrailId;
  size?: number;
  className?: string;
  pettable?: boolean;
  petPulse?: number;
  flourish?: "loop" | "now";
  evolve?: boolean;
  act?: SparkAct;
  snack?: SnackId | null;
  trackEyes?: boolean;
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
        className="spark-pupil"
        cx={39.6 + pupil}
        cy="62.1"
        rx="1.55"
        ry="1.95"
        fill="#fff"
        fillOpacity="0.88"
      />
      <ellipse
        className="spark-pupil"
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
      <g transform="translate(6 18) scale(1.05)">
        <g className="spark-heart spark-heart-a">
          <Heart />
        </g>
      </g>
      <g transform="translate(78 12) scale(0.85)">
        <g className="spark-heart spark-heart-b">
          <Heart />
        </g>
      </g>
      <g transform="translate(86 48) scale(0.7)">
        <g className="spark-heart spark-heart-c">
          <Heart />
        </g>
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
  if (mood === "annoyed") {
    return (
      <g fill="none" stroke={fill} strokeWidth="2.2" strokeLinecap="round">
        <path d="M33 61.4h11.2" />
        <path d="M55.8 61.4h11.2" />
      </g>
    );
  }
  if (mood === "sleepy") {
    return (
      <g fill="none" stroke={fill} strokeWidth="2.2" strokeLinecap="round">
        <path d="M33.4 66.2c2.4 2.2 7.6 2.2 10 0" />
        <path d="M56.6 66.2c2.4 2.2 7.6 2.2 10 0" />
      </g>
    );
  }
  if (mood === "eating") {
    return (
      <g>
        <ellipse cx="38.2" cy="66.4" rx="4.2" ry="3.1" fill={fill} />
        <ellipse cx="61.8" cy="66.4" rx="4.2" ry="3.1" fill={fill} />
        <ellipse
          className="spark-chew"
          cx="50"
          cy="76.4"
          rx="6.4"
          ry="3.4"
          fill="#0B0B0F"
        />
      </g>
    );
  }
  if (mood === "tempted") return <OpenEyes look="side" fill={fill} />;
  if (mood === "locked" || mood === "earning") {
    return <OpenEyes wider fill={fill} />;
  }
  return <OpenEyes fill={fill} />;
}

function SparkAuraMark({
  id,
  blurId,
}: {
  id: SparkAuraId;
  blurId: string;
}) {
  if (id === "none") return null;
  const spec = getSparkAura(id);
  return (
    <g aria-hidden className="spark-aura-body">
      {spec.glowB ? (
        <path
          d={SPARK_BODY_PATH}
          fill={spec.glowB}
          fillOpacity="0.55"
          filter={`url(#${blurId})`}
          transform="translate(50 62) scale(1.22) translate(-50 -62)"
        />
      ) : null}
      <path
        d={SPARK_BODY_PATH}
        fill={spec.glow}
        fillOpacity="0.7"
        filter={`url(#${blurId})`}
        transform="translate(50 62) scale(1.18) translate(-50 -62)"
      />
    </g>
  );
}

function GearBack({ id }: { id: SparkGearId }) {
  if (id === "cape") {
    return (
      <g>
        <path
          d="M24 66C10 70 2 84 5 102c3 16 18 24 45 28 27-4 42-12 45-28 3-18-6-32-20-36-10 12-40 12-50 0Z"
          fill="#1E1B4B"
        />
        <path
          d="M16 94c8 18 18 28 34 32 16-4 26-14 34-32"
          fill="none"
          stroke="#312E81"
          strokeWidth="2.2"
          strokeLinecap="round"
          opacity="0.55"
        />
        <path
          d="M14 108c10 14 22 20 36 22 14-2 26-8 36-22"
          fill="#312E81"
          opacity="0.35"
        />
        <path
          d="M28 78c-5 14-7 28-3 42"
          fill="none"
          stroke="#4338CA"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.55"
        />
        <path
          d="M72 78c5 14 7 28 3 42"
          fill="none"
          stroke="#4338CA"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.55"
        />
        <path
          d="M50 84v42"
          fill="none"
          stroke="#4338CA"
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.35"
        />
        <path
          d="M22 118c9 7 18 10 28 10s19-3 28-10"
          fill="none"
          stroke="#A78BFA"
          strokeWidth="1.3"
          strokeLinecap="round"
          opacity="0.4"
        />
      </g>
    );
  }
  if (id !== "scarf") return null;
  return (
    <g>
      <path
        d="M16 80c-3 10 2 20 12 24 3-2 4-8 2-14-2-7-5-12-9-14-3-1-5 1-5 4Z"
        fill="#7F1D1D"
      />
      <path
        d="M84 80c3 10-2 20-12 24-3-2-4-8-2-14 2-7 5-12 9-14 3-1 5 1 5 4Z"
        fill="#7F1D1D"
      />
    </g>
  );
}

function SoftScarf() {
  return (
    <g>
      <path
        d="M18 76c-2 9 2 18 10 22 4 1 6-3 5-8-1-7-3-13-7-16-3-2-7-1-8 2Z"
        fill="#B91C1C"
      />
      <path
        d="M82 76c2 9-2 18-10 22-4 1-6-3-5-8 1-7 3-13 7-16 3-2 7-1 8 2Z"
        fill="#B91C1C"
      />
      <path
        d="M24 86c8 1 17 2 26 1 9 1 18 0 26-1 3 3 2 9-2 12-15 5-35 5-50 0-4-3-4-9 0-12Z"
        fill="#DC2626"
      />
      <path
        d="M30 88c10-3 20-1 30 1 6 1 12-1 16-3"
        fill="none"
        stroke="#F87171"
        strokeWidth="1.7"
        strokeLinecap="round"
        opacity="0.8"
      />
      <path
        d="M32 94c12 2 26 2 38-1"
        fill="none"
        stroke="#9F1239"
        strokeWidth="1.15"
        strokeLinecap="round"
        opacity="0.45"
      />
      <path
        d="M54 90c6-3 12 0 12 6 0 5-5 8-10 6-4-2-5-6-2-12Z"
        fill="#B91C1C"
      />
      <ellipse cx="61" cy="95.2" rx="4.4" ry="3.3" fill="#EF4444" />
      <ellipse cx="59.6" cy="93.8" rx="1.5" ry="1.1" fill="#FECACA" opacity="0.75" />
      <path
        d="M55 98c-4 7-3 15 1 20 3 3 7 1 6-3-1-6 0-12-3-16-1-2-3-2-4-1Z"
        fill="#B91C1C"
      />
      <path
        d="M63 98c6 6 9 14 8 23 0 6-3 10 1 13 5-2 6-9 5-14 2-9-3-18-9-23-2-1-5 0-5 1Z"
        fill="#DC2626"
      />
      <path
        d="M66 105c3 7 4 14 3 20"
        fill="none"
        stroke="#9F1239"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.4"
      />
      <g stroke="#7F1D1D" strokeWidth="1.15" strokeLinecap="round">
        <path d="M55.5 117v4" />
        <path d="M58.8 118v3.4" />
        <path d="M64.8 132v5.2" />
        <path d="M68.2 133v4.8" />
        <path d="M71.6 131.6 72.8 136.4" />
      </g>
    </g>
  );
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
  if (id === "scarf") return <SoftScarf />;
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
  if (id === "veil") {
    return (
      <g>
        <ellipse cx="42" cy="80" rx="22" ry="9" fill="#5EEAD4" fillOpacity="0.28" />
        <ellipse cx="60" cy="78" rx="18" ry="8" fill="#A78BFA" fillOpacity="0.26" />
        <path
          d="M28 78c8 10 36 10 44 0"
          fill="none"
          stroke="#5EEAD4"
          strokeOpacity="0.45"
          strokeWidth="1.2"
        />
      </g>
    );
  }
  if (id === "cap-gold") {
    return (
      <g>
        <path
          d="M22 20 50 10l28 10-28 10Z"
          fill="#1C1917"
          stroke="#E4C56A"
          strokeWidth="1.3"
        />
        <path d="M38 22h24l-1.6 8H39.6Z" fill="#292524" stroke="#E4C56A" strokeWidth="0.7" />
        <path
          d="M50 12c8 4 14 10 16 16"
          fill="none"
          stroke="#F5D76A"
          strokeWidth="1.6"
        />
        <circle cx="67" cy="29" r="2.3" fill="#F5D76A" />
      </g>
    );
  }
  if (id === "headband") {
    return (
      <g fill="none" stroke="#5EEAD4" strokeWidth="3.2" strokeLinecap="round">
        <path d="M28 28c8-10 36-10 44 0" />
      </g>
    );
  }
  if (id === "phones") {
    return (
      <g>
        <path
          d="M22 48c0-20 12-30 28-30s28 10 28 30"
          fill="none"
          stroke="#18181B"
          strokeWidth="3.6"
          strokeLinecap="round"
        />
        <rect x="16" y="46" width="12" height="22" rx="6" fill="#18181B" />
        <rect x="18.5" y="50" width="7" height="14" rx="3.5" fill="#3F3F46" />
        <rect x="72" y="46" width="12" height="22" rx="6" fill="#18181B" />
        <rect x="74.5" y="50" width="7" height="14" rx="3.5" fill="#3F3F46" />
      </g>
    );
  }
  if (id === "cape") {
    return (
      <g>
        <circle cx="50" cy="77.2" r="3.4" fill="#312E81" stroke="#A78BFA" strokeWidth="1.1" />
        <circle cx="50" cy="77.2" r="1.35" fill="#C4B5FD" />
        <path
          d="M46.4 76.4 38 74.2"
          fill="none"
          stroke="#4338CA"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        <path
          d="M53.6 76.4 62 74.2"
          fill="none"
          stroke="#4338CA"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </g>
    );
  }
  if (id === "horn") {
    return (
      <g transform="translate(39 13) rotate(-16)">
        <ellipse cx="0" cy="7.2" rx="5.2" ry="2.4" fill="#F59E0B" opacity="0.55" />
        <path
          d="M-3.6 7.4C-4.6 1.2-2.4-14 0-22.5C2.4-14 4.6 1.2 3.6 7.4Z"
          fill="#FDE68A"
          stroke="#D97706"
          strokeWidth="0.85"
        />
        <path
          d="M-1.8-16C.6-12 2.2-9 .2-5M-2.2-8C.8-4 2.6-1 .4 3M-2.4 0C.6 3.2 2.4 5.2.2 7"
          fill="none"
          stroke="#F59E0B"
          strokeWidth="1.05"
          strokeLinecap="round"
        />
        <path
          d="M-1.1-20.4 1.2-16.8"
          fill="none"
          stroke="#FFFBEB"
          strokeWidth="0.9"
          strokeLinecap="round"
        />
      </g>
    );
  }
  if (id === "bowtie") {
    return (
      <g>
        <path
          d="M36 80c-7-5-9 3-2 7 5 2 9 1 14-1 5 2 9 3 14 1 7-4 5-12-2-7-5 2-9 2-14 1-5 1-9 1-14-1Z"
          fill="#9A3412"
        />
        <rect x="46.6" y="78.2" width="6.8" height="6.4" rx="1.3" fill="#7C2D12" />
      </g>
    );
  }
  if (id === "beanie") {
    return (
      <g>
        <path
          d="M29 30C34 12 43 6 50 6c8 0 17 5 23 22-10 5-34 6-44 2Z"
          fill="#334155"
        />
        <path
          d="M27 28c8 5 38 6 48 0-2 7-12 10-24 10S29 35 27 28Z"
          fill="#1E293B"
        />
        <circle cx="50" cy="7.4" r="3.3" fill="#F8FAFC" />
        <path
          d="M34 24c8 3 24 3 32 0"
          fill="none"
          stroke="#475569"
          strokeWidth="1.1"
          strokeLinecap="round"
          opacity="0.7"
        />
      </g>
    );
  }
  if (id === "star") {
    return (
      <path
        d="M32 18l2.2 6.4H41l-5.4 4 2.1 6.4L32 30.8 26.3 34.8l2.1-6.4-5.4-4h6.8Z"
        fill="#E8C547"
      />
    );
  }
  return null;
}

function GearFront({ id }: { id: SparkGearId }) {
  if (id !== "hearts") return null;
  return (
    <g>
      <path
        d="M35.6 46.4c-5.2-7.8-16.4-8.6-21.6-.8-6.8 9.6-.4 20.8 21.6 36.6 22-15.8 28.4-27 21.6-36.6-5.2-7.8-16.4-7-21.6.8Z"
        fill="#DB2777"
        stroke="#9D174D"
        strokeWidth="1.25"
      />
      <path
        d="M64.4 46.4c-5.2-7.8-16.4-8.6-21.6-.8-6.8 9.6-.4 20.8 21.6 36.6 22-15.8 28.4-27 21.6-36.6-5.2-7.8-16.4-7-21.6.8Z"
        fill="#DB2777"
        stroke="#9D174D"
        strokeWidth="1.25"
      />
      <path
        d="M43 65.2h14"
        fill="none"
        stroke="#9D174D"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <path
        d="M27.2 51.2c2.6-3 6.8-2.6 7.8.8"
        fill="none"
        stroke="#F9A8D4"
        strokeWidth="1.8"
        strokeLinecap="round"
        opacity="0.85"
      />
      <path
        d="M56 51.2c2.6-3 6.8-2.6 7.8.8"
        fill="none"
        stroke="#F9A8D4"
        strokeWidth="1.8"
        strokeLinecap="round"
        opacity="0.85"
      />
    </g>
  );
}

function Trail({ id }: { id: SparkTrailId }) {
  if (id === "none") return null;
  return (
    <span className={cn("spark-trail", `spark-trail-${id}`)} aria-hidden>
      {Array.from({ length: 8 }, (_, index) => (
        <span key={index} className={`spark-trail-dot spark-trail-dot-${index}`} />
      ))}
    </span>
  );
}
