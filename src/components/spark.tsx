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
