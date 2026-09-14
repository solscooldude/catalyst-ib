"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { Spark, type SparkMood } from "@/components/spark";
import { TokenAmount } from "@/components/mint-chip";
import { TokenChip } from "@/components/token-chip";
import { Button } from "@/components/ui/button";
import {
  SPARK_GEAR,
  SPARK_TRAILS,
  SPARK_TINTS,
} from "@/lib/appearance";
import { FEED_COST, FEED_DAILY_LIMIT } from "@/lib/care";
import {
  formatHours,
  sparkEvolution,
  sparkEvolutionLabel,
  verifiedStudyMs,
} from "@/lib/stats";
import { ROUTES } from "@/lib/routes";
import { equipAppearance, feedSpark, useCatalyst } from "@/lib/store";
import { cn } from "@/lib/utils";

export default function SpritePage() {
  const state = useCatalyst();
  const [notice, setNotice] = useState<string | null>(null);
  const [mood, setMood] = useState<SparkMood>("idle");
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const drag = useRef<{ x: number; y: number; dragging: boolean }>({
    x: 0,
    y: 0,
    dragging: false,
  });
  const idleTimer = useRef(0);
  const look = state.appearance;
  const evo = sparkEvolution(state.logs);
  const official = verifiedStudyMs(state.logs);
  const lastDone = state.logs[state.logs.length - 1];
  const canHighFive = Boolean(
    lastDone && Date.now() - lastDone.endedAt < 12 * 60 * 1000,
  );
  const feedsLeft =
    state.feedDay === todayLocal()
      ? Math.max(0, FEED_DAILY_LIMIT - state.feedCount)
      : FEED_DAILY_LIMIT;

  function bumpIdle() {
    window.clearTimeout(idleTimer.current);
    idleTimer.current = window.setTimeout(() => setMood("sleepy"), 40000);
  }

  useEffect(() => {
    bumpIdle();
    return () => window.clearTimeout(idleTimer.current);
  }, []);

  function wear(
    kind: "sparkTint" | "gear" | "trail",
    id: string,
    owned: boolean,
  ) {
    if (!owned) {
      setNotice("Buy that in Appearance first.");
      return;
    }
    const result = equipAppearance(kind, id);
    setNotice(result.ok ? "Equipped." : result.reason);
  }

  function react(next: SparkMood, ms = 1600) {
    setMood(next);
    bumpIdle();
    window.setTimeout(() => setMood((current) => (current === next ? "idle" : current)), ms);
  }

  function onFeed() {
    const result = feedSpark();
    setNotice(result.ok ? "Snack time." : result.reason);
    if (result.ok) react("done", 1800);
  }

  function onPoke() {
    react("annoyed", 900);
    setNotice("Hey.");
  }

  function onHighFive() {
    if (!canHighFive) {
      setNotice("Finish a session first, then come high-five.");
      return;
    }
    react("done", 2000);
    setNotice("Nice work.");
  }

  function wake() {
    if (mood === "sleepy") {
      setMood("idle");
      setNotice("Up.");
    }
    bumpIdle();
  }

  return (
    <div className="mx-auto w-full max-w-3xl space-y-10">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs tracking-[0.2em] text-primary uppercase">
            My Sprite
          </p>
          <h1 className="mt-3 text-4xl text-foreground sm:text-5xl">
            Sit with your spark.
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
            Pet, feed, poke, drag, or let it doze. Official hours grow the
            glow. Login streak {state.streakDays} day
            {state.streakDays === 1 ? "" : "s"}
            {state.streakDays > 0 && state.streakDays % 7 === 0
              ? " · seven-day flare unlocked"
              : ""}.
          </p>
        </div>
        <TokenChip tokens={state.tokens} />
      </div>

      <section className="flex flex-col items-center rounded-[2rem] bg-card px-5 py-10 ring-1 ring-white/6">
        <div
          className="touch-none"
          style={{ transform: `translate(${offset.x}px, ${offset.y}px)` }}
          onPointerDown={(event) => {
            drag.current = { x: event.clientX, y: event.clientY, dragging: true };
            event.currentTarget.setPointerCapture(event.pointerId);
            wake();
          }}
          onPointerMove={(event) => {
            if (!drag.current.dragging) return;
            setOffset({
              x: event.clientX - drag.current.x,
              y: event.clientY - drag.current.y,
            });
          }}
          onPointerUp={() => {
            drag.current.dragging = false;
            setOffset({ x: 0, y: 0 });
          }}
        >
          <Spark
            mood={mood}
            size={268}
            pettable
            className="transition-transform duration-500 ease-out"
          />
        </div>
        <p className="mt-5 text-center text-xs text-muted-foreground">
          Tap to pet · drag and it springs back · idle and it sleeps
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          <Button className="h-10 rounded-full" onClick={onFeed}>
            Feed · <TokenAmount value={FEED_COST} />
            <span className="ml-1 text-xs opacity-80">{feedsLeft} left</span>
          </Button>
          <Button variant="outline" className="h-10 rounded-full" onClick={onPoke}>
            Poke
          </Button>
          <Button
            variant="outline"
            className="h-10 rounded-full"
            onClick={onHighFive}
          >
            High-five
          </Button>
          <Button asChild variant="ghost" className="h-10 rounded-full">
            <Link href={ROUTES.quiz}>Quiz</Link>
          </Button>
        </div>
        {notice ? <p className="mt-3 text-sm text-primary">{notice}</p> : null}
      </section>

      <section className="grid gap-3 sm:grid-cols-3">
        <StatusCard
          label="Care stage"
          value={sparkEvolutionLabel(evo.stage)}
          detail={`${Math.round(evo.glow * 100)}% glow`}
        />
        <StatusCard
          label="Official hours"
          value={formatHours(official)}
          detail="Verified ManageBac only"
        />
        <StatusCard
          label="Login streak"
          value={`${state.streakDays}`}
          detail="7 days unlocks Seven-day flare"
        />
      </section>

      <EquipRow
        title="Color"
        items={SPARK_TINTS.map((item) => ({
          id: item.id,
          name: item.name,
          owned: look.ownedSparkTints.includes(item.id),
          on: look.sparkTint === item.id,
          preview: (
            <Spark
              mood="idle"
              tint={item.id}
              gear="none"
              trail="none"
              evolve={false}
              size={52}
            />
          ),
        }))}
        onWear={(id, owned) => wear("sparkTint", id, owned)}
      />
      <EquipRow
        title="Clothes"
        items={SPARK_GEAR.map((item) => ({
          id: item.id,
          name: item.name,
          owned: look.ownedGear.includes(item.id),
          on: look.gear === item.id,
          preview: (
            <Spark
              mood="idle"
              tint={look.sparkTint}
              gear={item.id}
              trail="none"
              evolve={false}
              size={52}
            />
          ),
        }))}
        onWear={(id, owned) => wear("gear", id, owned)}
      />
      <EquipRow
        title="Trail"
        items={SPARK_TRAILS.map((item) => ({
          id: item.id,
          name: item.name,
          owned: look.ownedTrails.includes(item.id),
          on: look.trail === item.id,
          preview: (
            <Spark mood="idle" gear="none" trail={item.id} evolve={false} size={52} />
          ),
        }))}
        onWear={(id, owned) => wear("trail", id, owned)}
      />

      <p className="text-sm text-muted-foreground">
        Buy new closet pieces in{" "}
        <Link href={ROUTES.appearance} className="text-foreground underline">
          Appearance
        </Link>
        .
      </p>
    </div>
  );
}

function StatusCard({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="rounded-3xl bg-card px-4 py-4 ring-1 ring-white/6">
      <p className="text-[11px] tracking-[0.14em] text-muted-foreground uppercase">
        {label}
      </p>
      <p className="mt-2 text-lg text-foreground">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{detail}</p>
    </div>
  );
}

function EquipRow({
  title,
  items,
  onWear,
}: {
  title: string;
  items: {
    id: string;
    name: string;
    owned: boolean;
    on: boolean;
    preview: ReactNode;
  }[];
  onWear: (id: string, owned: boolean) => void;
}) {
  return (
    <section>
      <h2 className="text-lg text-foreground">{title}</h2>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onWear(item.id, item.owned)}
            className={cn(
              "flex items-center gap-3 rounded-2xl bg-card px-3 py-2 text-left ring-1",
              item.on ? "ring-primary/45" : "ring-white/6",
              !item.owned && "opacity-60",
            )}
          >
            <span className="flex size-14 items-center justify-center">
              {item.preview}
            </span>
            <span>
              <span className="block text-sm text-foreground">{item.name}</span>
              <span className="block text-xs text-muted-foreground">
                {item.on ? "On" : item.owned ? "Tap to wear" : "Buy in Appearance"}
              </span>
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}

function todayLocal() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}
