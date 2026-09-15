"use client";

import { useEffect, useRef, useState } from "react";
import { SparkleMark } from "@/components/brand-marks";
import { HighFiveHand } from "@/components/high-five-hand";
import { Spark, type SparkMood } from "@/components/spark";
import { hitZone, type SparkAct } from "@/lib/spark-play";
import { catchSparkToken } from "@/lib/spark-gift";
import { grantFocusGift } from "@/lib/store";
import { cn } from "@/lib/utils";
import type { SubjectId, TaskId } from "@/lib/constants";

type IdleAct = "rest" | "wander" | "morph" | "loop" | "gift";

export function FocusSpark({
  mood,
  taskId,
  subject,
  hint,
}: {
  mood: SparkMood;
  taskId?: TaskId;
  subject?: SubjectId;
  hint?: string;
}) {
  const stageRef = useRef<HTMLDivElement>(null);
  const handRef = useRef<HTMLButtonElement>(null);
  const [act, setAct] = useState<SparkAct>(null);
  const [idle, setIdle] = useState<IdleAct>("rest");
  const gifted = useRef(false);
  const holdTimer = useRef(0);
  const moved = useRef(false);
  const zone = useRef<"peak" | "face" | "body">("body");
  const [star, setStar] = useState<{ id: number; left: number } | null>(null);
  const [handHeld, setHandHeld] = useState(false);
  const hand = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (mood === "done") setAct("celebrate");
  }, [mood]);

  useEffect(() => {
    let hold = 0;
    function playIdle(next: IdleAct) {
      setIdle(next);
      window.clearTimeout(hold);
      hold = window.setTimeout(() => setIdle("rest"), next === "gift" ? 2600 : 5200);
    }

    function pick() {
      const roll = Math.random();
      if (!gifted.current && roll < 0.1) {
        gifted.current = true;
        const result = grantFocusGift();
        playIdle(result.ok ? "gift" : "wander");
        return;
      }
      if (roll < 0.38) playIdle("wander");
      else if (roll < 0.64) playIdle("morph");
      else if (roll < 0.9) playIdle("loop");
      else playIdle("rest");
    }

    const first = window.setTimeout(pick, 9000 + Math.random() * 6000);
    const beat = window.setInterval(pick, 17000);
    const starFirst = window.setTimeout(spawnStar, 8000);
    const starBeat = window.setInterval(spawnStar, 18000);
    return () => {
      window.clearTimeout(first);
      window.clearTimeout(hold);
      window.clearInterval(beat);
      window.clearTimeout(starFirst);
      window.clearInterval(starBeat);
    };
  }, []);

  function spawnStar() {
    setStar({ id: Date.now(), left: 30 + Math.random() * 40 });
    window.setTimeout(() => setStar(null), 3400);
  }

  function play(next: SparkAct, ms = 700) {
    setAct(next);
    window.setTimeout(() => {
      setAct((current) => (current === next ? null : current));
    }, ms);
  }

  function releaseScrunch() {
    const node = stageRef.current;
    if (!node) return;
    node.classList.remove("is-scrunching");
    node.classList.add("spark-scrunch-release");
    window.setTimeout(() => node.classList.remove("spark-scrunch-release"), 480);
  }

  function down(event: React.PointerEvent<HTMLDivElement>) {
    event.currentTarget.setPointerCapture(event.pointerId);
    const box = stageRef.current?.getBoundingClientRect();
    moved.current = false;
    zone.current = box
      ? hitZone(event.clientX - box.left, event.clientY - box.top, box.width, box.height)
      : "body";
    if (zone.current === "peak") {
      stageRef.current?.classList.add("is-scrunching");
    }
    window.clearTimeout(holdTimer.current);
    holdTimer.current = window.setTimeout(() => {
      if (!moved.current) {
        setAct((current) => (current === "sleep" ? null : "sleep"));
      }
    }, 620);
  }

  function move(event: React.PointerEvent<HTMLDivElement>) {
    if (event.buttons === 0) return;
    const origin = stageRef.current?.getBoundingClientRect();
    if (!origin) return;
    const dx = event.clientX - (origin.left + origin.width / 2);
    const dy = event.clientY - (origin.top + origin.height / 2);
    if (Math.hypot(dx, dy) > 8) {
      moved.current = true;
      window.clearTimeout(holdTimer.current);
    }
    if (zone.current === "peak") {
      stageRef.current?.classList.add("is-scrunching");
    }
  }

  function up() {
    window.clearTimeout(holdTimer.current);
    if (zone.current === "peak" && moved.current) {
      releaseScrunch();
      return;
    }
    stageRef.current?.classList.remove("is-scrunching");
    if (!moved.current) {
      if (act === "sleep") return;
      if (mood === "done") play("celebrate", 900);
      else if (zone.current === "face") play("boop", 700);
    }
  }

  function handDown(event: React.PointerEvent<HTMLButtonElement>) {
    event.stopPropagation();
    event.currentTarget.setPointerCapture(event.pointerId);
    setHandHeld(true);
    hand.current = { x: 0, y: 0 };
  }

  function handMove(event: React.PointerEvent<HTMLButtonElement>) {
    event.stopPropagation();
    if (!handHeld) return;
    const node = handRef.current;
    if (!node) return;
    const box = node.getBoundingClientRect();
    const x = event.clientX - (box.left + box.width / 2);
    const y = event.clientY - (box.top + box.height / 2);
    hand.current = { x, y };
    node.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  }

  function handUp(event?: React.PointerEvent<HTMLButtonElement>) {
    event?.stopPropagation();
    const sparkBox = stageRef.current?.getBoundingClientRect();
    const handBox = handRef.current?.getBoundingClientRect();
    const hit =
      sparkBox &&
      handBox &&
      handBox.left + handBox.width / 2 > sparkBox.left - 20 &&
      handBox.left + handBox.width / 2 < sparkBox.right + 20 &&
      handBox.top + handBox.height / 2 > sparkBox.top - 20 &&
      handBox.top + handBox.height / 2 < sparkBox.bottom + 20;
    if (hit || !handHeld || (hand.current.x === 0 && hand.current.y === 0)) {
      play("highfive", 800);
    }
    setHandHeld(false);
    if (handRef.current) handRef.current.style.transform = "";
  }

  return (
    <div className="focus-quiet-stage">
      <div
        ref={stageRef}
        className={cn(
          "focus-spark-stage spark-scrunch-host",
          `focus-spark-${idle}`,
        )}
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerCancel={up}
      >
        <Spark
          mood={act === "sleep" ? "sleepy" : mood}
          taskId={taskId}
          subject={subject}
          hint={hint}
          size={248}
          pettable
          act={act}
        />
        {idle === "gift" ? (
          <span className="focus-token-drop" aria-live="polite">
            <SparkleMark size={16} />
            +1
          </span>
        ) : null}
        {star ? (
          <button
            type="button"
            aria-label="Catch a token"
            className="sprite-catch-star"
            style={{ left: `${star.left}%`, top: "8%" }}
            onClick={() => {
              catchSparkToken();
              setStar(null);
            }}
          >
            <SparkleMark size={22} />
          </button>
        ) : null}
        <button
          ref={handRef}
          type="button"
          aria-label="High-five Spark"
          className={cn("sprite-highfive-hand focus-highfive-hand", handHeld && "is-held")}
          onPointerDown={handDown}
          onPointerMove={handMove}
          onPointerUp={handUp}
          onPointerCancel={handUp}
        >
          <HighFiveHand />
          <span className="sprite-highfive-label">High-five</span>
        </button>
      </div>
    </div>
  );
}
