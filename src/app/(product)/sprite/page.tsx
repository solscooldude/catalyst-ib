"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { Spark, type SparkMood } from "@/components/spark";
import { SpritePlaypen } from "@/components/sprite-playpen";
import { TokenAmount } from "@/components/mint-chip";
import { Button } from "@/components/ui/button";
import {
  SPARK_GEAR,
  SPARK_TRAILS,
  SPARK_TINTS,
  type SparkGearId,
  type SparkTintId,
  type SparkTrailId,
} from "@/lib/appearance";
import { FEED_COST, FEED_DAILY_LIMIT } from "@/lib/care";
import {
  formatHours,
  sparkEvolution,
  sparkEvolutionLabel,
  todayStudyMs,
  verifiedStudyMs,
} from "@/lib/stats";
import { ROUTES } from "@/lib/routes";
import { careMood } from "@/lib/spark-play";
import { displaySpriteName } from "@/lib/sprite-name";
import { SpriteRename } from "@/components/sprite-rename";
import { equipAppearance, feedSpark, useCatalyst } from "@/lib/store";
import { cn } from "@/lib/utils";

export default function SpritePage() {
  const state = useCatalyst();
  const [notice, setNotice] = useState<string | null>(null);
  const [mood, setMood] = useState<SparkMood>(() => "idle");
  const [petPulse, setPetPulse] = useState(0);
  const [tryOn, setTryOn] = useState<{
    tint?: SparkTintId;
    gear?: SparkGearId;
    trail?: SparkTrailId;
  }>({});
  const idleTimer = useRef(0);
  const pokeAt = useRef(0);
  const tucked = useRef(false);
  const look = state.appearance;
  const evo = sparkEvolution(state.logs);
  const official = verifiedStudyMs(state.logs);
  const lastDone = state.logs[state.logs.length - 1];
  const todayMs = todayStudyMs(state.logs);
  const canCelebrate = Boolean(
    lastDone && Date.now() - lastDone.endedAt < 30 * 60 * 1000,
  );
  const feedsLeft =
    state.feedDay === todayLocal()
      ? Math.max(0, FEED_DAILY_LIMIT - state.feedCount)
      : FEED_DAILY_LIMIT;

  function restMood() {
    return careMood(state.streakDays, todayMs);
  }

  function bumpIdle() {
    window.clearTimeout(idleTimer.current);
    idleTimer.current = window.setTimeout(() => setMood("sleepy"), 40000);
  }

  useEffect(() => {
    if (tucked.current) return;
    setMood(careMood(state.streakDays, todayMs));
    bumpIdle();
    return () => window.clearTimeout(idleTimer.current);
  }, [state.streakDays, todayMs]);

  function wear(
    kind: "sparkTint" | "gear" | "trail",
    id: string,
    owned: boolean,
  ) {
    if (!owned) {
      if (kind === "sparkTint") setTryOn((current) => ({ ...current, tint: id as SparkTintId }));
      if (kind === "gear") setTryOn((current) => ({ ...current, gear: id as SparkGearId }));
      if (kind === "trail") setTryOn((current) => ({ ...current, trail: id as SparkTrailId }));
      setNotice("Preview only. Buy it in Appearance to keep.");
      return;
    }
    const result = equipAppearance(kind, id);
    if (result.ok) {
      if (kind === "sparkTint") setTryOn((current) => ({ ...current, tint: undefined }));
      if (kind === "gear") setTryOn((current) => ({ ...current, gear: undefined }));
      if (kind === "trail") setTryOn((current) => ({ ...current, trail: undefined }));
    }
    setNotice(result.ok ? "Equipped." : result.reason);
  }

  function react(next: SparkMood, ms = 1600) {
    setMood(next);
    bumpIdle();
    window.setTimeout(() => setMood((current) => (current === next ? restMood() : current)), ms);
  }

  function onPet() {
    if (mood === "eating" || mood === "sleepy") return;
    setPetPulse((value) => value + 1);
    bumpIdle();
  }

  function onFeedDrop() {
    if (mood === "eating") return false;
    const result = feedSpark();
    if (!result.ok) {
      setNotice(result.reason);
      return false;
    }
    setMood("eating");
    setNotice("Nom.");
    bumpIdle();
    window.setTimeout(() => {
      setMood("done");
      setPetPulse((value) => value + 1);
      setNotice("Snack time.");
      bumpIdle();
      window.setTimeout(() => {
        setMood((current) => (current === "done" ? restMood() : current));
      }, 1800);
    }, 1200);
    return true;
  }

  function onPoke() {
    if (mood === "eating") return;
    const now = Date.now();
    if (now - pokeAt.current < 2400) {
      setNotice("Give it a second.");
      return;
    }
    pokeAt.current = now;
    react("annoyed", 900);
    setNotice("Hey.");
  }

  function onHighFive() {
    if (mood === "eating") return;
    react("done", 2000);
    setNotice("Nice work.");
  }

  return (
    <div className="mx-auto w-full max-w-3xl space-y-4">
      <section className="flux-card px-6 py-8 sm:px-10">
        <p className="text-[11px] font-medium tracking-[0.18em] text-zinc-400 uppercase">
          My Sprite
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          {displaySpriteName(state.spriteName)}
        </h1>
        <p className="mt-3 text-sm">
          <Link href={ROUTES.quiz} className="text-zinc-400 hover:text-foreground">
            Quiz
          </Link>
        </p>
      </section>

      <section className="flux-card px-6 py-6">
        <SpriteRename />
      </section>

      <section id="snacks" className="flux-card scroll-mt-24 flex flex-col items-center px-5 py-8">
        <SpritePlaypen
          mood={mood}
          petPulse={petPulse}
          tint={tryOn.tint}
          gear={tryOn.gear}
          trail={tryOn.trail}
          canFeed={
            feedsLeft > 0 && state.tokens >= FEED_COST && mood !== "eating"
          }
          celebrate={canCelebrate}
          onPet={onPet}
          onFeed={onFeedDrop}
          onSleep={() => {
            tucked.current = true;
            window.clearTimeout(idleTimer.current);
            setMood("sleepy");
            setNotice("Tucked in.");
          }}
          onWake={() => {
            tucked.current = false;
            setMood(restMood());
            bumpIdle();
            setNotice("Up.");
          }}
          onCelebrate={() => {
            react("done", 900);
            setNotice("Again!");
          }}
          onHighFive={() => {
            react("done", 2000);
            setNotice("Nice work.");
          }}
          onCatch={(ok, reason) => {
            setNotice(ok ? "Caught a token." : (reason ?? "Missed it."));
          }}
        />
        {feedsLeft === 0 ? (
          <p className="mt-2 text-center text-xs text-zinc-400">Snacks tomorrow.</p>
        ) : (
          <p className="mt-2 text-center text-xs text-zinc-400">
            <TokenAmount value={FEED_COST} />
          </p>
        )}
        <div className="mt-5 flex flex-wrap justify-center gap-2">
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
        items={SPARK_TRAILS.filter(
          (item) => item.id !== "week" || look.ownedTrails.includes("week"),
        ).map((item) => ({
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
    <div className="flux-card px-4 py-4">
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
    <section className="flux-card px-6 py-6">
      <h2 className="text-lg text-foreground">{title}</h2>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onWear(item.id, item.owned)}
            className={cn(
              "flex items-center gap-3 rounded-2xl bg-white px-3 py-2 text-left shadow-[0_1px_2px_rgb(24_24_27/0.05)] dark:bg-zinc-900",
              item.on ? "ring-primary/45" : "ring-border",
              !item.owned && "opacity-60",
            )}
          >
            <span className="flex size-14 items-center justify-center">
              {item.preview}
            </span>
            <span>
              <span className="block text-sm text-foreground">{item.name}</span>
              <span className="block text-xs text-muted-foreground">
                {item.on ? "On" : item.owned ? "Tap to wear" : "Tap to preview"}
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
