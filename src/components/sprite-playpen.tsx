"use client";

import { useEffect, useRef, useState } from "react";
import "@/app/sprite-motion.css";
import { SparkleMark } from "@/components/brand-marks";
import { Spark, type SparkMood } from "@/components/spark";
import {
  SNACKS,
  hitZone,
  type SnackId,
  type SparkAct,
} from "@/lib/spark-play";
import { catchSparkToken } from "@/lib/spark-gift";
import { cn } from "@/lib/utils";

const TAP_SLOP = 9;
const FOLLOW = 0.34;
const STIFFNESS = 0.18;
const DAMPING = 0.78;
const SNAP = 0.18;
const HOLD_SLEEP_MS = 620;

type SpritePlaypenProps = {
  mood: SparkMood;
  petPulse: number;
  canFeed: boolean;
  canHighFive?: boolean;
  celebrate?: boolean;
  onPet: () => void;
  onFeed: () => boolean;
  onSleep?: () => void;
  onWake?: () => void;
  onCelebrate?: () => void;
  onHighFive?: () => void;
  onCatch?: (ok: boolean, reason?: string) => void;
};

export function SpritePlaypen({
  mood,
  petPulse,
  canFeed,
  canHighFive = false,
  celebrate = false,
  onPet,
  onFeed,
  onSleep,
  onWake,
  onCelebrate,
  onHighFive,
  onCatch,
}: SpritePlaypenProps) {
  const sparkRef = useRef<HTMLDivElement>(null);
  const snackRef = useRef<HTMLButtonElement>(null);
  const handRef = useRef<HTMLButtonElement>(null);
  const spark = useRef({ x: 0, y: 0, vx: 0, vy: 0, tx: 0, ty: 0 });
  const snack = useRef({ x: 0, y: 0, vx: 0, vy: 0, tx: 0, ty: 0 });
  const hand = useRef({ x: 0, y: 0, vx: 0, vy: 0, tx: 0, ty: 0 });
  const hold = useRef<
    | {
        kind: "spark" | "snack" | "hand";
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
  const [held, setHeld] = useState<"spark" | "snack" | "hand" | null>(null);
  const [eaten, setEaten] = useState(false);
  const eatenRef = useRef(false);
  const snackScale = useRef(1);
  const [snackId, setSnackId] = useState<SnackId>("cookie");
  const [act, setAct] = useState<SparkAct>(null);
  const [star, setStar] = useState<{ id: number; left: number } | null>(null);

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
      step(hand.current, hold.current?.kind === "hand", handRef.current, 1);
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
    kind: "spark" | "snack" | "hand",
    event: React.PointerEvent<HTMLElement>,
  ) {
    if (kind === "snack" && (!canFeed || eaten || mood === "eating")) return;
    if (kind === "hand" && !canHighFive) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    const zone = kind === "spark" ? zoneFromEvent(event) : "body";
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
    const body =
      kind === "spark" ? spark.current : kind === "snack" ? snack.current : hand.current;
    body.tx = body.x;
    body.ty = body.y;
    setHeld(kind);
    window.clearTimeout(holdTimer.current);
    if (kind === "spark" && mood !== "eating") {
      holdTimer.current = window.setTimeout(() => {
        if (!hold.current || hold.current.dragged) return;
        if (act === "sleep" || mood === "sleepy") {
          setAct(null);
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
        setAct("scrunch");
      }
    }
    if (!active.dragged) return;
    const now = performance.now();
    const dt = Math.max(8, now - active.lastT);
    const body =
      active.kind === "spark"
        ? spark.current
        : active.kind === "snack"
          ? snack.current
          : hand.current;
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
      if (active.kind === "spark") {
        if (act === "sleep" || mood === "sleepy") {
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
      setAct("scrunch");
      window.setTimeout(() => setAct(null), 80);
      sparkRef.current?.classList.add("spark-scrunch-release");
      window.setTimeout(
        () => sparkRef.current?.classList.remove("spark-scrunch-release"),
        560,
      );
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
    if (active.kind === "hand" && over(sparkRef, handRef)) {
      play("highfive", 800);
      onHighFive?.();
    }
    const body =
      active.kind === "spark"
        ? spark.current
        : active.kind === "snack"
          ? snack.current
          : hand.current;
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
          "sprite-spark-stage",
          held === "spark" && "is-held",
          act === null && "spark-scrunch-host",
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
          className="pointer-events-none"
        />
      </div>
      {canHighFive ? (
        <button
          ref={handRef}
          type="button"
          aria-label="Drag to high-five Spark"
          className={cn(
            "sprite-highfive-hand border-0 bg-transparent p-0",
            held === "hand" && "is-held",
          )}
          onPointerDown={(event) => begin("hand", event)}
          onPointerMove={move}
          onPointerUp={end}
          onPointerCancel={end}
        >
          <HighFiveHand />
        </button>
      ) : null}
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
            aria-label={`Drag ${snackId} onto the spark`}
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

function HighFiveHand() {
  return (
    <svg viewBox="0 0 64 64" width="48" height="48" aria-hidden>
      <path
        d="M28 54c-8-2-10-12-6-20l8-18c1.4-3 6-2.2 5.2 1.2L32 32l6-16c1.2-3.2 6.2-2.4 5.2 1L40 30l6-10c1.4-3 6.4-2 5.2 1.4L46 34l5-6c1.6-2.2 5.6-.6 4.4 2.2L48 44c-2 6-8 12-20 10Z"
        fill="#F5D0A9"
        stroke="#E8B88A"
        strokeWidth="1.4"
      />
    </svg>
  );
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
