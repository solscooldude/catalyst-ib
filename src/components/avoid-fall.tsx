"use client";

import { useEffect, useRef, useState } from "react";
import { Spark } from "@/components/spark";
import "@/app/sprite-motion.css";
import { Button } from "@/components/ui/button";
import { playSfx } from "@/lib/sfx";
import { awardDodgeBonus } from "@/lib/spark-gift";
import { cn } from "@/lib/utils";

const GAME_MS = 20_000;
const TOKEN_SURVIVE_MS = 12_000;
const SPRITE_W = 13;
const HAZARD_W = 7.2;
const ENTER_MS = 420;

type HazardKind = "phone" | "scroll" | "notif";
type Hazard = {
  id: number;
  x: number;
  y: number;
  w: number;
  speed: number;
  kind: HazardKind;
};

const KINDS: HazardKind[] = ["phone", "scroll", "notif"];

export function AvoidFall({
  onNotice,
  onLiveChange,
}: {
  onNotice: (text: string) => void;
  onLiveChange?: (live: boolean) => void;
}) {
  const [live, setLive] = useState(false);
  const [entering, setEntering] = useState(false);
  const [leftMs, setLeftMs] = useState(GAME_MS);
  const [spriteX, setSpriteX] = useState(50);
  const [hazards, setHazards] = useState<Hazard[]>([]);
  const [dodged, setDodged] = useState(0);
  const [hit, setHit] = useState(false);
  const [lastScore, setLastScore] = useState<{
    dodged: number;
    survivedMs: number;
    tokens: number;
  } | null>(null);

  const liveRef = useRef(false);
  const xRef = useRef(50);
  const keys = useRef({ left: false, right: false });
  const hazardsRef = useRef<Hazard[]>([]);
  const dodgedRef = useRef(0);
  const endAt = useRef(0);
  const startedAt = useRef(0);
  const raf = useRef(0);
  const spawnAt = useRef(0);
  const nextId = useRef(1);
  const enterTimer = useRef(0);
  const fieldRef = useRef<HTMLDivElement>(null);

  function stopLive(next: boolean) {
    liveRef.current = next;
    setLive(next);
    onLiveChange?.(next);
  }

  useEffect(() => {
    return () => {
      liveRef.current = false;
      window.cancelAnimationFrame(raf.current);
      window.clearTimeout(enterTimer.current);
    };
  }, []);

  useEffect(() => {
    if (!live) return;

    function onKey(event: KeyboardEvent, down: boolean) {
      const key = event.key.toLowerCase();
      if (
        event.key === "ArrowLeft" ||
        event.key === "ArrowRight" ||
        key === "a" ||
        key === "d"
      ) {
        event.preventDefault();
      }
      if (event.key === "ArrowLeft" || key === "a") keys.current.left = down;
      if (event.key === "ArrowRight" || key === "d") keys.current.right = down;
    }
    const down = (event: KeyboardEvent) => onKey(event, true);
    const up = (event: KeyboardEvent) => onKey(event, false);
    window.addEventListener("keydown", down, { passive: false });
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, [live]);

  function finish(reason: "time" | "hit") {
    window.cancelAnimationFrame(raf.current);
    const survivedMs = Math.min(GAME_MS, Date.now() - startedAt.current);
    const score = dodgedRef.current;
    stopLive(false);
    setEntering(false);
    setHazards([]);
    hazardsRef.current = [];
    keys.current = { left: false, right: false };
    setHit(reason === "hit");

    let tokens = 0;
    if (survivedMs >= TOKEN_SURVIVE_MS) {
      const bonus = awardDodgeBonus();
      if (bonus.ok) {
        tokens = 1;
        playSfx("catch");
      } else if (bonus.reason) {
        onNotice(bonus.reason);
      }
    } else {
      onNotice("Survive 12 seconds for a token.");
    }
    setLastScore({ dodged: score, survivedMs, tokens });
    if (tokens > 0) {
      onNotice(
        reason === "time"
          ? `Cleared the round. +1 token · ${score} dodged.`
          : `Hit — still lasted ${(survivedMs / 1000).toFixed(0)}s. +1 token.`,
      );
    }
  }

  function frame(now: number) {
    if (!liveRef.current) return;
    const remain = Math.max(0, endAt.current - Date.now());
    setLeftMs(remain);
    if (remain === 0) {
      finish("time");
      return;
    }

    const dir = (keys.current.right ? 1 : 0) - (keys.current.left ? 1 : 0);
    xRef.current = Math.min(100 - SPRITE_W / 2, Math.max(SPRITE_W / 2, xRef.current + dir * 1.15));
    setSpriteX(xRef.current);

    if (now >= spawnAt.current) {
      const elapsed = Date.now() - startedAt.current;
      const gap = Math.max(420, 820 - elapsed / 28);
      spawnAt.current = now + gap;
      const kind = KINDS[Math.floor(Math.random() * KINDS.length)] ?? "phone";
      hazardsRef.current = [
        ...hazardsRef.current,
        {
          id: nextId.current,
          x: 8 + Math.random() * 84,
          y: -8,
          w: HAZARD_W + Math.random() * 2.2,
          speed: 0.55 + Math.random() * 0.45 + elapsed / 18000,
          kind,
        },
      ];
      nextId.current += 1;
    }

    let hitNow = false;
    const next: Hazard[] = [];
    let passed = 0;
    for (const hazard of hazardsRef.current) {
      const y = hazard.y + hazard.speed;
      if (y > 108) {
        passed += 1;
        continue;
      }
      const overlapX = Math.abs(hazard.x - xRef.current) < (hazard.w + SPRITE_W) / 2 - 1.2;
      const overlapY = y > 74 && y < 96;
      if (overlapX && overlapY) {
        hitNow = true;
        break;
      }
      next.push({ ...hazard, y });
    }
    if (hitNow) {
      playSfx("hit");
      finish("hit");
      return;
    }
    if (passed) {
      dodgedRef.current += passed;
      setDodged(dodgedRef.current);
    }
    hazardsRef.current = next;
    setHazards(next);
    raf.current = window.requestAnimationFrame(frame);
  }

  function start() {
    window.cancelAnimationFrame(raf.current);
    dodgedRef.current = 0;
    nextId.current = 1;
    hazardsRef.current = [];
    xRef.current = 50;
    keys.current = { left: false, right: false };
    setDodged(0);
    setHazards([]);
    setSpriteX(50);
    setHit(false);
    setLastScore(null);
    setLeftMs(GAME_MS);
    setEntering(true);
    stopLive(true);
    playSfx("boop");
    window.clearTimeout(enterTimer.current);
    enterTimer.current = window.setTimeout(() => {
      setEntering(false);
      startedAt.current = Date.now();
      endAt.current = Date.now() + GAME_MS;
      spawnAt.current = performance.now() + 280;
      raf.current = window.requestAnimationFrame(frame);
    }, ENTER_MS);
  }

  function nudge(dir: -1 | 1) {
    if (!liveRef.current) return;
    keys.current.left = dir < 0;
    keys.current.right = dir > 0;
  }

  function release() {
    keys.current = { left: false, right: false };
  }

  function pointerSteer(event: React.PointerEvent<HTMLDivElement>) {
    if (!liveRef.current) return;
    const box = fieldRef.current?.getBoundingClientRect();
    if (!box) return;
    const next = ((event.clientX - box.left) / box.width) * 100;
    xRef.current = Math.min(100 - SPRITE_W / 2, Math.max(SPRITE_W / 2, next));
    setSpriteX(xRef.current);
  }

  return (
    <section className="flux-card relative overflow-hidden px-6 py-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg text-foreground">
            Avoid falling objects — minigame
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {live
              ? `${Math.ceil(leftMs / 1000)}s · ${dodged} dodged`
              : "Arrow keys or A/D. Dodge phones and scrolls for 20s."}
          </p>
        </div>
        <Button
          type="button"
          variant={live ? "outline" : "default"}
          className="h-10 rounded-full px-5"
          disabled={live}
          onClick={start}
        >
          Play
        </Button>
      </div>

      <div
        ref={fieldRef}
        role="application"
        aria-label="Avoid falling objects playfield"
        className={cn(
          "relative mt-4 h-64 overflow-hidden rounded-2xl ring-1 ring-border",
          live ? "bg-[#0B0B0F]" : "bg-zinc-50 dark:bg-zinc-900",
        )}
        onPointerDown={pointerSteer}
        onPointerMove={(event) => {
          if (event.buttons) pointerSteer(event);
        }}
      >
        {live
          ? hazards.map((hazard) => (
              <span
                key={hazard.id}
                className={cn(
                  "avoid-hazard",
                  hazard.kind === "phone" && "avoid-hazard-phone",
                  hazard.kind === "scroll" && "avoid-hazard-scroll",
                  hazard.kind === "notif" && "avoid-hazard-notif",
                )}
                style={{
                  left: `${hazard.x}%`,
                  top: `${hazard.y}%`,
                  width: `${hazard.w}%`,
                }}
                aria-hidden
              />
            ))
          : (
            <p className="absolute inset-x-4 top-8 text-center text-sm text-muted-foreground">
              {lastScore
                ? `${(lastScore.survivedMs / 1000).toFixed(0)}s · ${lastScore.dodged} dodged${
                    lastScore.tokens ? " · +1 token" : ""
                  }`
                : "Your sprite drops in when you play."}
            </p>
          )}

        <div
          className={cn(
            "avoid-sprite",
            entering && "is-entering",
            hit && !live && "is-hit",
            !live && !lastScore && "is-waiting",
          )}
          style={{ left: `${spriteX}%` }}
        >
          <Spark
            mood={hit ? "annoyed" : live ? "locked" : "idle"}
            size={84}
            flourish={live ? "loop" : "now"}
          />
        </div>
      </div>

      <div className="mt-4 flex justify-center gap-3 md:hidden">
        <Button
          type="button"
          variant="outline"
          className="h-11 flex-1 rounded-full"
          disabled={!live}
          onPointerDown={() => nudge(-1)}
          onPointerUp={release}
          onPointerLeave={release}
        >
          Left
        </Button>
        <Button
          type="button"
          variant="outline"
          className="h-11 flex-1 rounded-full"
          disabled={!live}
          onPointerDown={() => nudge(1)}
          onPointerUp={release}
          onPointerLeave={release}
        >
          Right
        </Button>
      </div>
    </section>
  );
}
