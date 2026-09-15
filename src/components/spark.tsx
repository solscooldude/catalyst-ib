"use client";

import { useEffect, useId, useRef, useState, type Ref } from "react";
import "@/app/sprite-motion.css";
import {
  getSparkTint,
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
import { sparkEvolution } from "@/lib/stats";
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
  return null;
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

export function Spark({
  mood = "idle",
  subject,
  taskId,
  flavor,
  hint,
  tint,
  gear,
  trail,
  size = 72,
  className,
  pettable = false,
  petPulse = 0,
  flourish = "loop",
  evolve = true,
  act = null,
  snack = null,
  trackEyes = false,
}: SparkProps) {
  const wrapRef = useRef<HTMLDivElement | HTMLButtonElement | null>(null);
  const uid = useId().replace(/:/g, "");
  const glowId = `spark-glow-${uid}`;
  const bodyId = `spark-body-${uid}`;
  const specId = `spark-spec-${uid}`;
  const store = useCatalyst();
  const tintId = tint ?? store.appearance.sparkTint;
  const gearId = gear ?? store.appearance.gear;
  const trailId = trail ?? store.appearance.trail;
  const palette = getSparkTint(tintId);
  const resolved =
    flavor ??
    sparkFlavorFromContext({
      subjectId: subject ?? (taskId ? TASK_SUBJECT[taskId] : undefined),
      text: hint ?? sparkHintFromTask(taskId),
    });
  const canPet = pettable;
  const [petted, setPetted] = useState(false);
  const [orbit, setOrbit] = useState(false);
  const petTimer = useRef<number>(0);
  const lastPet = useRef(0);
  const hideOrbit = useRef(0);
  const firstOrbit = useRef(true);
  const flavorKey = `${resolved}:${subject ?? ""}:${taskId ?? ""}`;
  const canSparkle = evolve && size >= 80;
  const ORBIT_MS = 2600;

  function idleGap() {
    return 180_000 + Math.floor(Math.random() * 120_000);
  }

  function fireOrbit() {
    setOrbit(true);
    window.clearTimeout(hideOrbit.current);
    hideOrbit.current = window.setTimeout(() => setOrbit(false), ORBIT_MS);
  }

  useEffect(() => {
    return () => window.clearTimeout(petTimer.current);
  }, []);

  useEffect(() => {
    if (!canSparkle) return;
    if (firstOrbit.current) {
      firstOrbit.current = false;
      return;
    }
    fireOrbit();
  }, [flavorKey, canSparkle]);

  useEffect(() => {
    if (!canSparkle) return;
    let wait = 0;
    function schedule(delay: number) {
      wait = window.setTimeout(() => {
        fireOrbit();
        schedule(idleGap());
      }, delay);
    }
    schedule(flourish === "now" ? 200 : idleGap());
    return () => {
      window.clearTimeout(wait);
      window.clearTimeout(hideOrbit.current);
    };
  }, [canSparkle, flourish]);

  useEffect(() => {
    if (act === "sleep" || mood === "sleepy") setOrbit(false);
  }, [act, mood]);

  function pet() {
    const now = Date.now();
    if (now - lastPet.current < 280) return;
    lastPet.current = now;
    setPetted(true);
    window.clearTimeout(petTimer.current);
    petTimer.current = window.setTimeout(() => setPetted(false), 1800);
  }

  useEffect(() => {
    if (!petPulse) return;
    pet();
  }, [petPulse]);

  const shownMood: SparkMood =
    mood === "eating"
      ? "eating"
      : act === "sleep" || mood === "sleepy"
        ? "sleepy"
        : act === "celebrate" || act === "highfive" || petted
          ? "done"
          : mood;
  const asleep = shownMood === "sleepy";
  const canGlance =
    !trackEyes &&
    !petted &&
    act !== "sleep" &&
    act !== "celebrate" &&
    (mood === "idle" || mood === "locked");

  useEffect(() => {
    if (!trackEyes) return;
    function look(event: PointerEvent) {
      const el = wrapRef.current;
      if (!el || asleep) {
        el?.style.setProperty("--eye-x", "0px");
        el?.style.setProperty("--eye-y", "0px");
        return;
      }
      const box = el.getBoundingClientRect();
      const nx = (event.clientX - (box.left + box.width / 2)) / (box.width / 2);
      const ny = (event.clientY - (box.top + box.height * 0.48)) / (box.height / 2);
      el.style.setProperty(
        "--eye-x",
        `${Math.max(-3.2, Math.min(3.2, nx * 3.1))}px`,
      );
      el.style.setProperty(
        "--eye-y",
        `${Math.max(-2.4, Math.min(2.4, ny * 2.2))}px`,
      );
    }
    window.addEventListener("pointermove", look, { passive: true });
    return () => window.removeEventListener("pointermove", look);
  }, [trackEyes, asleep]);
  const evo = evolve ? sparkEvolution(store.logs) : { scale: 1, glow: 1 };
  const drawn = size * evo.scale;
  const frameClass = cn(
    "spark-float relative isolate z-20 overflow-visible",
    canPet
      ? "cursor-pointer touch-manipulation border-0 bg-transparent p-0"
      : "pointer-events-none",
    petted && mood !== "eating" && "spark-petted",
    (act === "boop" || petted) && mood !== "eating" && "spark-boop",
    act === "scrunch" && "spark-scrunch",
    act === "celebrate" && "spark-celebrate",
    act === "highfive" && "spark-highfive",
    (act === "sleep" || mood === "sleepy") && "spark-sleeping",
    mood === "eating" && "spark-eating",
    mood === "eating" && snack && `spark-eat-${snack}`,
    flourish === "now" && "spark-idle-pop",
    trackEyes && "spark-track-eyes",
    className,
  );
  const frameStyle = {
    width: drawn,
    height: drawn,
    color: palette.lo,
    ["--spark-evo-glow" as string]: String(evo.glow),
  };

  const body = (
    <>
      <span className="spark-halo absolute inset-[-28%] rounded-full" />
      <Trail id={trailId} />
      <svg
        viewBox="-22 -18 144 150"
        width={drawn}
        height={drawn}
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
          <path d={SPARK_BODY_PATH} fill={`url(#${bodyId})`} />
          <ellipse cx="40" cy="48" rx="11" ry="8" fill={`url(#${specId})`} />
          <Gear id={gearId} />
          <g className={canGlance ? "spark-glance" : undefined}>
            <Eyes mood={shownMood} fill="#0B0B0F" />
          </g>
        </g>

        {(petted || act === "boop") && mood !== "eating" ? <PetHearts /> : null}

        {act === "sleep" || mood === "sleepy" ? (
          <g className="spark-zzz" fill="#A1A1AA" fontSize="11" fontWeight="700">
            <text className="spark-z spark-z-a" x="74" y="22">
              z
            </text>
            <text className="spark-z spark-z-b" x="84" y="12">
              z
            </text>
            <text className="spark-z spark-z-c" x="92" y="4">
              z
            </text>
          </g>
        ) : null}

        {mood === "eating" ? (
          <g
            className="spark-crumbs"
            fill={
              snack === "berry"
                ? "#C084FC"
                : snack === "mint"
                  ? "#5EEAD4"
                  : "#F5D0A9"
            }
          >
            <circle className="spark-crumb-bit spark-crumb-a" cx="28" cy="84" r="2.1" />
            <circle className="spark-crumb-bit spark-crumb-b" cx="70" cy="88" r="1.6" />
            <circle className="spark-crumb-bit spark-crumb-c" cx="50" cy="94" r="1.3" />
          </g>
        ) : null}

        {orbit && mood !== "tempted" && mood !== "sleepy" && act !== "sleep" ? (
          <g className="spark-particles" fill={SPARK_FLAVOR_INK[resolved]}>
            <SparkParticleRing radius={40} twist={22} />
            <SubjectFlourish flavor={resolved} />
          </g>
        ) : null}
      </svg>
    </>
  );

  if (canPet) {
    return (
      <button
        ref={wrapRef as Ref<HTMLButtonElement>}
        type="button"
        onClick={pet}
        onPointerUp={(event) => {
          if (event.pointerType === "touch") {
            event.preventDefault();
            pet();
          }
        }}
        aria-label={`Pet ${displaySpriteName(store.spriteName)}`}
        className={frameClass}
        style={frameStyle}
      >
        {body}
      </button>
    );
  }

  return (
    <div
      ref={wrapRef as Ref<HTMLDivElement>}
      aria-hidden
      className={frameClass}
      style={frameStyle}
    >
      {body}
    </div>
  );
}
