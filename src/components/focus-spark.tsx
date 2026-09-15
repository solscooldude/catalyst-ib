"use client";

import { useEffect, useRef, useState } from "react";
import { SparkleMark } from "@/components/brand-marks";
import { Spark, type SparkMood } from "@/components/spark";
import {
  DOUBLE_TAP_MS,
  hitZone,
  isTickleSwipe,
  type SparkAct,
  type SparkZone,
} from "@/lib/spark-play";
import { catchSparkToken } from "@/lib/spark-gift";
import { createSparkScrunch } from "@/lib/spark-scrunch";
import { grantFocusGift } from "@/lib/store";
import { cn } from "@/lib/utils";
import type { SubjectId, TaskId } from "@/lib/constants";

type IdleAct = "rest" | "wander" | "morph" | "loop" | "gift";

export function FocusSpark({
  mood,
  taskId,
  subject,
  hint,
  sit = false,
}: {
  mood: SparkMood;
  taskId?: TaskId;
  subject?: SubjectId;
  hint?: string;
  sit?: boolean;
}) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [act, setAct] = useState<SparkAct>(null);
  const [idle, setIdle] = useState<IdleAct>("rest");
  const gifted = useRef(false);
  const holdTimer = useRef(0);
  const moved = useRef(false);
  const origin = useRef({ x: 0, y: 0 });
  const lastTap = useRef(0);
  const zone = useRef<SparkZone>("body");
  const scrunch = useRef(createSparkScrunch());
  const [star, setStar] = useState<{ id: number; left: number } | null>(null);

  useEffect(() => {
    const controller = scrunch.current;
    return () => controller.dispose();
  }, []);

  useEffect(() => {
    if (mood === "done") setAct("celebrate");
  }, [mood]);

  useEffect(() => {
    if (sit) {
      setIdle("rest");
      setStar(null);
      return;
    }
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
  }, [sit]);

  function spawnStar() {
    if (sit) return;
    setStar({ id: Date.now(), left: 30 + Math.random() * 40 });
    window.setTimeout(() => setStar(null), 3400);
  }

  function play(next: SparkAct, ms = 700) {
    setAct(next);
    window.setTimeout(() => {
      setAct((current) => (current === next ? null : current));
    }, ms);
  }

  function down(event: React.PointerEvent<HTMLDivElement>) {
    event.currentTarget.setPointerCapture(event.pointerId);
    const box = stageRef.current?.getBoundingClientRect();
    moved.current = false;
    origin.current = { x: event.clientX, y: event.clientY };
    scrunch.current.attach(stageRef.current);
    zone.current = box
      ? hitZone(event.clientX - box.left, event.clientY - box.top, box.width, box.height)
      : "body";
    if (zone.current === "peak" && act !== "sleep") {
      scrunch.current.press(event.clientY, box?.height ?? 200);
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
    const dx = event.clientX - origin.current.x;
    const dy = event.clientY - origin.current.y;
    if (Math.hypot(dx, dy) > 8) {
      moved.current = true;
      window.clearTimeout(holdTimer.current);
    }
    if (zone.current === "peak") {
      scrunch.current.move(event.clientY);
    }
  }

  function up(event?: React.PointerEvent<HTMLDivElement>) {
    if (event) {
      try {
        event.currentTarget.releasePointerCapture(event.pointerId);
      } catch {
        /* already released */
      }
    }
    window.clearTimeout(holdTimer.current);
    const dx = event ? event.clientX - origin.current.x : 0;
    const dy = event ? event.clientY - origin.current.y : 0;
    if (zone.current === "belly" && isTickleSwipe(dx, dy) && act !== "sleep") {
      play("tickle", 720);
      return;
    }
    if (zone.current === "peak") {
      scrunch.current.release();
      if (moved.current) return;
    }
    if (!moved.current) {
      if (act === "sleep") return;
      const now = performance.now();
      if (now - lastTap.current < DOUBLE_TAP_MS) {
        lastTap.current = 0;
        play("spin", 820);
        return;
      }
      lastTap.current = now;
      if (mood === "done") play("celebrate", 900);
      else if (zone.current === "face") play("boop", 700);
      else if (zone.current === "body" || zone.current === "belly") play("poke", 720);
    }
  }

  return (
    <div className={cn("focus-quiet-stage", sit && "is-buddy-sit")}>
      <div
        ref={stageRef}
        className={cn(
          "focus-spark-stage spark-scrunch-host",
          sit ? "is-buddy-sit" : `focus-spark-${idle}`,
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
          size={sit ? 112 : 248}
          pettable
          act={act}
          flourish={sit ? "loop" : "now"}
          className={sit ? "spark-sit" : undefined}
        />
        {idle === "gift" && !sit ? (
          <span className="focus-token-drop" aria-live="polite">
            <SparkleMark size={16} />
            +1
          </span>
        ) : null}
        {star && !sit ? (
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
      </div>
    </div>
  );
}
