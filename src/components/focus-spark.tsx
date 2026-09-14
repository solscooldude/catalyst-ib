"use client";

import { useEffect, useRef, useState } from "react";
import { MintChip } from "@/components/mint-chip";
import { Spark, type SparkMood } from "@/components/spark";
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
  const [act, setAct] = useState<IdleAct>("rest");
  const gifted = useRef(false);

  useEffect(() => {
    let hold = 0;
    function play(next: IdleAct) {
      setAct(next);
      window.clearTimeout(hold);
      hold = window.setTimeout(() => setAct("rest"), next === "gift" ? 2600 : 5200);
    }

    function pick() {
      const roll = Math.random();
      if (!gifted.current && roll < 0.1) {
        gifted.current = true;
        const result = grantFocusGift();
        play(result.ok ? "gift" : "wander");
        return;
      }
      if (roll < 0.38) play("wander");
      else if (roll < 0.64) play("morph");
      else if (roll < 0.9) play("loop");
      else play("rest");
    }

    const first = window.setTimeout(pick, 9000 + Math.random() * 6000);
    const beat = window.setInterval(pick, 17000);
    return () => {
      window.clearTimeout(first);
      window.clearTimeout(hold);
      window.clearInterval(beat);
    };
  }, []);

  return (
    <div className="focus-quiet-stage">
      <div className={cn("focus-spark-stage", `focus-spark-${act}`)}>
        <Spark
          mood={mood}
          taskId={taskId}
          subject={subject}
          hint={hint}
          size={248}
          pettable
        />
        {act === "gift" ? (
          <span className="focus-token-drop" aria-live="polite">
            <MintChip size={16} tone="soft" />
            +1
          </span>
        ) : null}
      </div>
    </div>
  );
}
