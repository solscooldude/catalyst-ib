"use client";

import { useEffect, useRef, useState } from "react";
import { SparkleMark } from "@/components/brand-marks";
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
  const [act, setAct] = useState<SparkAct>(null);
  const [idle, setIdle] = useState<IdleAct>("rest");
  const gifted = useRef(false);
  const holdTimer = useRef(0);
  const moved = useRef(false);
  const zone = useRef<"peak" | "face" | "body">("body");
  const [star, setStar] = useState<{ id: number; left: number } | null>(null);

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

  function down(event: React.PointerEvent<HTMLDivElement>) {
    const box = stageRef.current?.getBoundingClientRect();
    moved.current = false;
    zone.current = box
      ? hitZone(event.clientX - box.left, event.clientY - box.top, box.width, box.height)
      : "body";
    window.clearTimeout(holdTimer.current);
    holdTimer.current = window.setTimeout(() => {
      if (!moved.current) {
        setAct((current) => (current === "sleep" ? null : "sleep"));
      }
    }, 620);
  }

  function move() {
    moved.current = true;
    window.clearTimeout(holdTimer.current);
    if (zone.current === "peak") setAct("scrunch");
  }

  function up() {
    window.clearTimeout(holdTimer.current);
    if (act === "scrunch") {
      play("scrunch", 80);
      return;
    }
    if (!moved.current) {
      if (act === "sleep") {
        return;
      }
      if (mood === "done") play("celebrate", 900);
      else if (zone.current === "face") play("boop", 700);
    }
  }

  return (
    <div className="focus-quiet-stage">
      <div
        ref={stageRef}
        className={cn("focus-spark-stage", `focus-spark-${idle}`)}
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
      </div>
    </div>
  );
}
