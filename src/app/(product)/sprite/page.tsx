"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Spark, type SparkMood } from "@/components/spark";
import { SpritePlaypen } from "@/components/sprite-playpen";
import {
  SPARK_GEAR,
  SPARK_TRAILS,
  SPARK_TINTS,
  type SparkGearId,
  type SparkTintId,
  type SparkTrailId,
} from "@/lib/appearance";
import { FEED_COST, FEED_DAILY_LIMIT, dayKey } from "@/lib/care";
import {
  formatHours,
  sparkEvolution,
  sparkEvolutionLabel,
  todayStudyMs,
  verifiedStudyMs,
} from "@/lib/stats";
import { careMood } from "@/lib/spark-play";
import { displaySpriteName } from "@/lib/sprite-name";
import { PageFrame } from "@/components/page-frame";
import { SpriteRename } from "@/components/sprite-rename";
import { setSpriteAsleep } from "@/lib/store-core";
import { equipAppearance, feedSpark, useCatalyst } from "@/lib/store";
import { cn } from "@/lib/utils";

export default function SpritePage() {
  const state = useCatalyst();
  const [notice, setNotice] = useState<string | null>(null);
  const tucked = state.spriteAsleep;
  const [mood, setMood] = useState<SparkMood>(() =>
    tucked ? "sleepy" : "idle",
  );
  const [petPulse, setPetPulse] = useState(0);
  const [tryOn, setTryOn] = useState<{
    tint?: SparkTintId;
    gear?: SparkGearId;
    trail?: SparkTrailId;
  }>({});
  const look = state.appearance;
  const evo = sparkEvolution(state.logs);
  const official = verifiedStudyMs(state.logs);
  const lastDone = state.logs[state.logs.length - 1];
  const todayMs = todayStudyMs(state.logs);
  const canCelebrate = Boolean(
    lastDone && Date.now() - lastDone.endedAt < 30 * 60 * 1000,
  );
  const feedsLeft =
    state.feedDay === dayKey()
      ? Math.max(0, FEED_DAILY_LIMIT - state.feedCount)
      : FEED_DAILY_LIMIT;
  const snacksOnStage =
    !tucked && feedsLeft > 0 && state.tokens >= FEED_COST && mood !== "eating";

  function restMood(): SparkMood {
    const next = careMood(state.streakDays, todayMs);
    return next === "sleepy" ? "idle" : next;
  }

  useEffect(() => {
    if (tucked) {
      setMood("sleepy");
      return;
    }
    setMood((current) => (current === "eating" ? current : restMood()));
  }, [tucked, state.streakDays, todayMs]);

  function wear(
    kind: "sparkTint" | "gear" | "trail",
    id: string,
    owned: boolean,
  ) {
    if (!owned) {
      if (kind === "sparkTint") setTryOn((current) => ({ ...current, tint: id as SparkTintId }));
      if (kind === "gear") setTryOn((current) => ({ ...current, gear: id as SparkGearId }));
      if (kind === "trail") setTryOn((current) => ({ ...current, trail: id as SparkTrailId }));
      setNotice("Preview.");
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
    if (tucked) return;
    setMood(next);
    window.setTimeout(() => setMood((current) => (current === next ? restMood() : current)), ms);
  }

  function onPet() {
    if (tucked || mood === "eating") return;
    setPetPulse((value) => value + 1);
  }

  function onFeedDrop() {
    if (tucked || mood === "eating") return false;
    const result = feedSpark();
    if (!result.ok) {
      setNotice(result.reason);
      return false;
    }
    setMood("eating");
    setNotice(null);
    window.setTimeout(() => {
      setMood("done");
      setPetPulse((value) => value + 1);
      window.setTimeout(() => {
        setMood((current) => (current === "done" ? restMood() : current));
      }, 1800);
    }, 1200);
    return true;
  }

  return (
    <PageFrame width="mid">
      <section className="flux-card px-6 py-8 sm:px-10">
        <p className="text-[11px] font-medium tracking-[0.18em] text-zinc-400 uppercase">
          My Sprite
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          {displaySpriteName(state.spriteName)}
        </h1>
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
          canFeed={snacksOnStage}
          celebrate={canCelebrate && !tucked}
          onPet={onPet}
          onFeed={onFeedDrop}
          onSleep={() => setSpriteAsleep(true)}
          onWake={() => setSpriteAsleep(false)}
          onCelebrate={() => react("done", 900)}
          onHighFive={() => react("done", 2000)}
          onCatch={(ok, reason) => {
            if (!ok && reason) setNotice(reason);
          }}
        />
        {feedsLeft === 0 ? (
          <p className="mt-3 text-center text-xs text-zinc-400">Snacks tomorrow.</p>
        ) : null}
        {notice ? <p className="mt-3 text-sm text-primary">{notice}</p> : null}
      </section>

      <section className="grid gap-3 sm:grid-cols-3">
        <StatusCard
          label="Care stage"
          value={sparkEvolutionLabel(evo.stage)}
        />
        <StatusCard
          label="Official hours"
          value={formatHours(official)}
        />
        <StatusCard
          label="Login streak"
          value={`${state.streakDays}`}
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

    </PageFrame>
  );
}

function StatusCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flux-card px-4 py-4">
      <p className="text-[11px] tracking-[0.14em] text-muted-foreground uppercase">
        {label}
      </p>
      <p className="mt-2 text-lg text-foreground">{value}</p>
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
              {item.on ? (
                <span className="block text-xs text-muted-foreground">On</span>
              ) : null}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
