"use client";

import { useEffect, useRef, useState } from "react";
import "@/app/sprite-motion.css";
import { Spark, type SparkMood } from "@/components/spark";
import { cn } from "@/lib/utils";

const TAP_SLOP = 9;
const FOLLOW = 0.34;
const STIFFNESS = 0.18;
const DAMPING = 0.78;
const SNAP = 0.18;

type SpritePlaypenProps = {
  mood: SparkMood;
  petPulse: number;
  canFeed: boolean;
  onPet: () => void;
  onFeed: () => boolean;
};

export function SpritePlaypen({
  mood,
  petPulse,
  canFeed,
  onPet,
  onFeed,
}: SpritePlaypenProps) {
  const playpenRef = useRef<HTMLDivElement>(null);
  const sparkRef = useRef<HTMLDivElement>(null);
  const snackRef = useRef<HTMLButtonElement>(null);
  const spark = useRef({ x: 0, y: 0, vx: 0, vy: 0, tx: 0, ty: 0 });
  const snack = useRef({ x: 0, y: 0, vx: 0, vy: 0, tx: 0, ty: 0 });
  const hold = useRef<
    | {
        kind: "spark" | "snack";
        pointerId: number;
        originX: number;
        originY: number;
        lastX: number;
        lastY: number;
        lastT: number;
        dragged: boolean;
      }
    | null
  >(null);
  const [held, setHeld] = useState<"spark" | "snack" | null>(null);
  const [eaten, setEaten] = useState(false);
  const eatenRef = useRef(false);
  const snackScale = useRef(1);

  useEffect(() => {
    let frame = 0;
    function tick() {
      snackScale.current +=
        ((eatenRef.current ? 0.08 : 1) - snackScale.current) * 0.18;
      step(spark.current, hold.current?.kind === "spark", sparkRef.current, 1);
      step(
        snack.current,
        hold.current?.kind === "snack",
        snackRef.current,
        snackScale.current,
      );
      frame = window.requestAnimationFrame(tick);
    }
    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (mood !== "eating") {
      eatenRef.current = false;
      setEaten(false);
      snack.current = { x: 0, y: 0, vx: 0, vy: 0, tx: 0, ty: 0 };
      apply(snackRef.current, snack.current, false, 1);
    }
  }, [mood]);

  function begin(
    kind: "spark" | "snack",
    event: React.PointerEvent<HTMLElement>,
  ) {
    if (kind === "snack" && (!canFeed || eaten || mood === "eating")) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    hold.current = {
      kind,
      pointerId: event.pointerId,
      originX: event.clientX,
      originY: event.clientY,
      lastX: event.clientX,
      lastY: event.clientY,
      lastT: performance.now(),
      dragged: false,
    };
    const body = kind === "spark" ? spark.current : snack.current;
    body.tx = body.x;
    body.ty = body.y;
    setHeld(kind);
  }

  function move(event: React.PointerEvent<HTMLElement>) {
    const active = hold.current;
    if (!active || active.pointerId !== event.pointerId) return;
    const dx = event.clientX - active.originX;
    const dy = event.clientY - active.originY;
    if (!active.dragged && Math.hypot(dx, dy) > TAP_SLOP) {
      active.dragged = true;
    }
    if (!active.dragged) return;
    const now = performance.now();
    const dt = Math.max(8, now - active.lastT);
    const body = active.kind === "spark" ? spark.current : snack.current;
    body.tx = dx;
    body.ty = dy;
    body.vx = ((event.clientX - active.lastX) / dt) * 16;
    body.vy = ((event.clientY - active.lastY) / dt) * 16;
    active.lastX = event.clientX;
    active.lastY = event.clientY;
    active.lastT = now;
  }

  function end(event: React.PointerEvent<HTMLElement>) {
    const active = hold.current;
    if (!active || active.pointerId !== event.pointerId) return;
    hold.current = null;
    setHeld(null);
    try {
      event.currentTarget.releasePointerCapture(event.pointerId);
    } catch {
      /* already released */
    }
    if (!active.dragged) {
      if (active.kind === "spark") onPet();
      return;
    }
    if (active.kind === "snack") {
      if (overSpark() && canFeed && onFeed()) {
        eatenRef.current = true;
        setEaten(true);
        const sparkBox = sparkRef.current?.getBoundingClientRect();
        const snackBox = snackRef.current?.getBoundingClientRect();
        if (sparkBox && snackBox) {
          snack.current.tx =
            snack.current.x +
            (sparkBox.left + sparkBox.width / 2 - (snackBox.left + snackBox.width / 2));
          snack.current.ty =
            snack.current.y +
            (sparkBox.top + sparkBox.height * 0.62 - (snackBox.top + snackBox.height / 2));
        }
        snack.current.vx = 0;
        snack.current.vy = 0;
        return;
      }
    }
    const body = active.kind === "spark" ? spark.current : snack.current;
    body.tx = 0;
    body.ty = 0;
    body.vx *= 0.45;
    body.vy = body.vy * 0.35 - 10;
  }

  function overSpark() {
    const sparkBox = sparkRef.current?.getBoundingClientRect();
    const snackBox = snackRef.current?.getBoundingClientRect();
    if (!sparkBox || !snackBox) return false;
    const x = snackBox.left + snackBox.width / 2;
    const y = snackBox.top + snackBox.height / 2;
    const pad = 28;
    return (
      x > sparkBox.left - pad &&
      x < sparkBox.right + pad &&
      y > sparkBox.top - pad &&
      y < sparkBox.bottom + pad
    );
  }

  return (
    <div ref={playpenRef} className="sprite-playpen">
      <div
        ref={sparkRef}
        className={cn("sprite-spark-stage", held === "spark" && "is-held")}
        onPointerDown={(event) => begin("spark", event)}
        onPointerMove={move}
        onPointerUp={end}
        onPointerCancel={end}
      >
        <Spark
          mood={mood}
          size={268}
          petPulse={petPulse}
          className="pointer-events-none"
        />
      </div>
      <button
        ref={snackRef}
        type="button"
        aria-label={canFeed ? "Drag snack onto the spark" : "No snacks left"}
        disabled={!canFeed || eaten || mood === "eating"}
        className={cn(
          "sprite-snack border-0 bg-transparent p-0",
          held === "snack" && "is-held",
          (!canFeed || eaten) && "is-disabled",
          eaten && "is-eaten",
        )}
        onPointerDown={(event) => begin("snack", event)}
        onPointerMove={move}
        onPointerUp={end}
        onPointerCancel={end}
      >
        <SnackArt />
      </button>
    </div>
  );
}

function step(
  body: { x: number; y: number; vx: number; vy: number; tx: number; ty: number },
  held: boolean,
  node: HTMLElement | null,
  scale: number,
) {
  if (held) {
    body.x += (body.tx - body.x) * FOLLOW;
    body.y += (body.ty - body.y) * FOLLOW;
    body.vx *= 0.86;
    body.vy *= 0.86;
  } else {
    body.vx += (body.tx - body.x) * STIFFNESS;
    body.vy += (body.ty - body.y) * STIFFNESS;
    body.vx *= DAMPING;
    body.vy *= DAMPING;
    body.x += body.vx;
    body.y += body.vy;
    if (Math.hypot(body.x, body.y) < SNAP && Math.hypot(body.vx, body.vy) < SNAP) {
      body.x = body.tx;
      body.y = body.ty;
      body.vx = 0;
      body.vy = 0;
    }
  }
  apply(node, body, held, scale);
}

function apply(
  node: HTMLElement | null,
  body: { x: number; y: number; vx: number; vy: number },
  held: boolean,
  scale = 1,
) {
  if (!node) return;
  const speed = Math.hypot(body.vx, body.vy);
  const stretch = 1 + Math.min(speed * 0.045, 0.34);
  const squash = 1 - Math.min(speed * 0.028, 0.2);
  const angle = Math.atan2(body.vy, body.vx);
  const lively = held ? speed > 0.35 : Math.hypot(body.x - 0, body.y) > 2 || speed > 0.6;
  const squashStretch = lively
    ? `rotate(${angle}rad) scale(${stretch}, ${squash}) rotate(${-angle}rad)`
    : "scale(1, 1)";
  node.style.transform = `translate(${body.x}px, ${body.y}px) ${squashStretch} scale(${scale})`;
  node.style.opacity = scale < 1 ? String(Math.max(0, scale * 4)) : "1";
}

function SnackArt() {
  return (
    <svg
      viewBox="0 0 64 64"
      width="58"
      height="58"
      className="sprite-snack-art"
      aria-hidden
    >
      <ellipse cx="32" cy="40" rx="16" ry="5" fill="#0B0B0F" opacity="0.22" />
      <path
        d="M18 30c0-11 8-18 14-18 7 0 12 4 14 11 6 2 10 8 8 13-2 7-12 12-22 12s-20-6-18-14c1-3 3-4 4-4Z"
        fill="#F5D0A9"
      />
      <path
        d="M20 28c2-8 8-14 12-14 5 0 10 4 12 10"
        fill="none"
        stroke="#E8B88A"
        strokeWidth="2"
      />
      <circle cx="26" cy="32" r="2.1" fill="#C2410C" />
      <circle cx="36" cy="28" r="1.7" fill="#B45309" />
      <circle cx="33" cy="38" r="1.8" fill="#9A3412" />
      <circle cx="24" cy="40" r="1.3" fill="#C2410C" />
      <path
        d="M40 22c4-1 8 2 7 6"
        fill="none"
        stroke="#5EEAD4"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
