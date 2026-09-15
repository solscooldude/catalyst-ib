"use client";

import { useEffect, useRef, useState } from "react";
import "@/app/sprite-motion.css";
import { SparkleMark } from "@/components/brand-marks";
import { Spark, type SparkMood } from "@/components/spark";
import type {
  SparkAuraId,
  SparkGearId,
  SparkTintId,
  SparkTrailId,
} from "@/lib/appearance";
import {
  SNACKS,
  hitZone,
  type SnackId,
  type SparkAct,
} from "@/lib/spark-play";
import { catchSparkToken } from "@/lib/spark-gift";
import { createSparkScrunch } from "@/lib/spark-scrunch";
import { cn } from "@/lib/utils";

const TAP_SLOP = 9;
const FOLLOW = 0.72;
const STIFFNESS = 0.16;
const DAMPING = 0.84;
const SNAP = 0.14;
const HOLD_SLEEP_MS = 620;

type SpritePlaypenProps = {
  mood: SparkMood;
  petPulse: number;
  canFeed: boolean;
  celebrate?: boolean;
  asleep?: boolean;
  onPet: () => void;
  onFeed: () => boolean;
  onSleep?: () => void;
  onWake?: () => void;
  onCelebrate?: () => void;
  onCatch?: (ok: boolean, reason?: string) => void;
  tint?: SparkTintId;
  gear?: SparkGearId;
  aura?: SparkAuraId;
  trail?: SparkTrailId;
};

export function SpritePlaypen({
  mood,
  petPulse,
  canFeed,
  celebrate = false,
  asleep = false,
  onPet,
  onFeed,
  onSleep,
  onWake,
  onCelebrate,
  onCatch,
  tint,
  gear,
  aura,
  trail,
}: SpritePlaypenProps) {
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
        zone: "peak" | "face" | "body";
      }
    | null
  >(null);
  const holdTimer = useRef(0);
  const scrunch = useRef(createSparkScrunch());
  const [held, setHeld] = useState<"spark" | "snack" | null>(null);
  const [eaten, setEaten] = useState(false);
  const eatenRef = useRef(false);
  const snackScale = useRef(1);
  const [snackId, setSnackId] = useState<SnackId>("cookie");
  const [act, setAct] = useState<SparkAct>(asleep ? "sleep" : null);
  const [star, setStar] = useState<{ id: number; left: number } | null>(null);
  const asleepRef = useRef(asleep);
  asleepRef.current = asleep;

  useEffect(() => {
    const controller = scrunch.current;
    return () => controller.dispose();
  }, []);

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

  useEffect(() => {
    if (celebrate) setAct("celebrate");
  }, [celebrate]);

  useEffect(() => {
    setAct((current) => {
      if (asleep) return "sleep";
      return current === "sleep" ? null : current;
    });
  }, [asleep]);

  useEffect(() => {
    const first = window.setTimeout(spawnStar, 7000);
    const beat = window.setInterval(spawnStar, 16000);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(beat);
    };
  }, []);

  function spawnStar() {
    setStar({ id: Date.now(), left: 28 + Math.random() * 44 });
    window.setTimeout(() => setStar(null), 3400);
  }

  function play(next: SparkAct, ms = 700) {
    setAct(next);
    window.setTimeout(() => {
      setAct((current) => (current === next ? null : current));
    }, ms);
  }

  function zoneFromEvent(event: React.PointerEvent<HTMLElement>): "peak" | "face" | "body" {
    const box = sparkRef.current?.getBoundingClientRect();
    if (!box) return "body";
    return hitZone(event.clientX - box.left, event.clientY - box.top, box.width, box.height);
  }

  function begin(
    kind: "spark" | "snack",
    event: React.PointerEvent<HTMLElement>,
  ) {
    if (kind === "snack" && (!canFeed || eaten || mood === "eating")) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    const zone = kind === "spark" ? zoneFromEvent(event) : "body";
    scrunch.current.attach(sparkRef.current);
    if (kind === "spark" && zone === "peak" && !asleepRef.current && mood !== "sleepy") {
      const box = sparkRef.current?.getBoundingClientRect();
      scrunch.current.press(event.clientY, box?.height ?? 200);
    }
    hold.current = {
      kind,
      pointerId: event.pointerId,
      originX: event.clientX,
      originY: event.clientY,
      lastX: event.clientX,
      lastY: event.clientY,
      lastT: performance.now(),
      dragged: false,
      zone,
    };
    const body = kind === "spark" ? spark.current : snack.current;
    body.tx = body.x;
    body.ty = body.y;
    setHeld(kind);
    window.clearTimeout(holdTimer.current);
    if (kind === "spark" && mood !== "eating") {
      holdTimer.current = window.setTimeout(() => {
        if (!hold.current || hold.current.dragged) return;
        if (asleepRef.current || mood === "sleepy") {
          onWake?.();
          return;
        }
        setAct("sleep");
        onSleep?.();
      }, HOLD_SLEEP_MS);
    }
  }

  function move(event: React.PointerEvent<HTMLElement>) {
    const active = hold.current;
    if (!active || active.pointerId !== event.pointerId) return;
    const dx = event.clientX - active.originX;
    const dy = event.clientY - active.originY;
    if (!active.dragged && Math.hypot(dx, dy) > TAP_SLOP) {
      active.dragged = true;
      window.clearTimeout(holdTimer.current);
      if (active.kind === "spark" && active.zone === "peak") {
        scrunch.current.move(event.clientY);
      }
    }
    if (active.kind === "spark" && active.zone === "peak") {
      scrunch.current.move(event.clientY);
      return;
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
    window.clearTimeout(holdTimer.current);
    try {
      event.currentTarget.releasePointerCapture(event.pointerId);
    } catch {
      /* already released */
    }
    if (!active.dragged) {
      if (active.kind === "spark" && active.zone === "peak") {
        scrunch.current.release();
      }
      if (active.kind === "spark") {
        if (asleepRef.current || mood === "sleepy") {
          return;
        }
        if (celebrate) {
          play("celebrate", 900);
          onCelebrate?.();
        }
        if (active.zone === "face") play("boop", 700);
        onPet();
      }
      return;
    }
    if (active.kind === "spark" && active.zone === "peak") {
      scrunch.current.release();
    }
    if (active.kind === "snack") {
      if (over(sparkRef, snackRef) && canFeed && onFeed()) {
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

  function over(
    a: React.RefObject<HTMLElement | null>,
    b: React.RefObject<HTMLElement | null>,
  ) {
    const sparkBox = a.current?.getBoundingClientRect();
    const other = b.current?.getBoundingClientRect();
    if (!sparkBox || !other) return false;
    const x = other.left + other.width / 2;
    const y = other.top + other.height / 2;
    const pad = 28;
    return (
      x > sparkBox.left - pad &&
      x < sparkBox.right + pad &&
      y > sparkBox.top - pad &&
      y < sparkBox.bottom + pad
    );
  }

  function grabStar() {
    const result = catchSparkToken();
    setStar(null);
    onCatch?.(result.ok, result.ok ? undefined : result.reason);
  }

  return (
    <div className="sprite-playpen">
      <div
        ref={sparkRef}
        className={cn(
          "sprite-spark-stage spark-scrunch-host",
          held === "spark" && "is-held",
        )}
        onPointerDown={(event) => begin("spark", event)}
        onPointerMove={move}
        onPointerUp={end}
        onPointerCancel={end}
      >
        <Spark
          mood={act === "sleep" ? "sleepy" : mood}
          size={268}
          petPulse={petPulse}
          act={act}
          snack={snackId}
          tint={tint}
          gear={gear}
          aura={aura}
          trail={trail}
          trackEyes
          className="pointer-events-none"
        />
      </div>
      {star ? (
        <button
          type="button"
          aria-label="Catch a token"
          className="sprite-catch-star"
          style={{ left: `${star.left}%`, top: "12%" }}
          onClick={grabStar}
        >
          <SparkleMark size={22} />
        </button>
      ) : null}
      {canFeed ? (
        <>
          <div className="sprite-snack-row">
            {SNACKS.map((item) => (
              <button
                key={item.id}
                type="button"
                aria-label={item.label}
                aria-pressed={snackId === item.id}
                className={cn(
                  "sprite-snack-pick border-0",
                  snackId === item.id && "is-on",
                )}
                onClick={() => setSnackId(item.id)}
              >
                <SnackArt id={item.id} small />
              </button>
            ))}
          </div>
          <button
            ref={snackRef}
            type="button"
            aria-label={snackId}
            disabled={eaten || mood === "eating"}
            className={cn(
              "sprite-snack border-0 bg-transparent p-0",
              held === "snack" && "is-held",
              eaten && "is-eaten",
            )}
            onPointerDown={(event) => begin("snack", event)}
            onPointerMove={move}
            onPointerUp={end}
            onPointerCancel={end}
          >
            <SnackArt id={snackId} />
          </button>
        </>
      ) : null}
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
    body.vx *= 0.5;
    body.vy *= 0.5;
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
  const scrunching = node.classList.contains("is-scrunching");
  if (scrunching) return;
  const speed = Math.hypot(body.vx, body.vy);
  const stretch = 1 + Math.min(speed * 0.03, 0.18);
  const squash = 1 - Math.min(speed * 0.018, 0.12);
  const angle = Math.atan2(body.vy, body.vx);
  const lively =
    !scrunching &&
    (held ? speed > 0.8 : Math.hypot(body.x, body.y) > 4 || speed > 1.2);
  const squashStretch = lively
    ? `rotate(${angle}rad) scale(${stretch}, ${squash}) rotate(${-angle}rad)`
    : "";
  node.style.transform = `translate3d(${body.x}px, ${body.y}px, 0) ${squashStretch} scale(${scale})`;
  node.style.opacity = scale < 1 ? String(Math.max(0, scale * 4)) : "1";
}

function SnackArt({ id, small }: { id: SnackId; small?: boolean }) {
  const size = small ? 36 : 58;
  if (id === "berry") {
    return (
      <svg viewBox="0 0 64 64" width={size} height={size} aria-hidden>
        <ellipse cx="32" cy="44" rx="14" ry="4" fill="#0B0B0F" opacity="0.2" />
        <circle cx="32" cy="34" r="14" fill="#C084FC" />
        <circle cx="26" cy="30" r="3" fill="#E9D5FF" />
        <path d="M32 16c2 6 8 8 8 8" fill="none" stroke="#4ADE80" strokeWidth="2" />
      </svg>
    );
  }
  if (id === "mint") {
    return (
      <svg viewBox="0 0 64 64" width={size} height={size} aria-hidden>
        <ellipse cx="32" cy="44" rx="13" ry="4" fill="#0B0B0F" opacity="0.18" />
        <circle cx="32" cy="32" r="13" fill="#99F6E4" />
        <circle cx="32" cy="32" r="7" fill="#5EEAD4" />
        <circle cx="26" cy="28" r="2" fill="#fff" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} className="sprite-snack-art" aria-hidden>
      <ellipse cx="32" cy="40" rx="16" ry="5" fill="#0B0B0F" opacity="0.22" />
      <path
        d="M18 30c0-11 8-18 14-18 7 0 12 4 14 11 6 2 10 8 8 13-2 7-12 12-22 12s-20-6-18-14c1-3 3-4 4-4Z"
        fill="#F5D0A9"
      />
      <circle cx="26" cy="32" r="2.1" fill="#C2410C" />
      <circle cx="36" cy="28" r="1.7" fill="#B45309" />
      <circle cx="33" cy="38" r="1.8" fill="#9A3412" />
    </svg>
  );
}
