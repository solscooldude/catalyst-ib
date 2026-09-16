"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Spark, type SparkMood } from "@/components/spark";
import { SpritePlaypen } from "@/components/sprite-playpen";
import {
  SPARK_AURAS,
  SPARK_GEAR,
  SPARK_TRAILS,
  SPARK_TINTS,
  type SparkAuraId,
  type SparkGearId,
  type SparkTintId,
  type SparkTrailId,
} from "@/lib/appearance";
import { FEED_COST, FEED_DAILY_LIMIT, dayKey } from "@/lib/care";
import {
  formatHours,
  sparkEvolutionFromState,
  sparkEvolutionLabel,
  todayStudyMs,
  verifiedStudyMs,
} from "@/lib/stats";
import { CareStageInfo } from "@/components/care-stage-info";
import { AvoidFall } from "@/components/avoid-fall";
import { careMood, type SparkGiftKind } from "@/lib/spark-play";
import { displaySpriteName } from "@/lib/sprite-name";
import { SparkHowTo } from "@/components/spark-howto";
import { PageFrame } from "@/components/page-frame";
import { SpriteRename } from "@/components/sprite-rename";
import { setSpriteAsleep } from "@/lib/store-core";
import { equipAppearance, feedSpark, useCatalyst } from "@/lib/store";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/lib/routes";
import Link from "next/link";

export default function SpritePage() {
  const state = useCatalyst();
  const [notice, setNotice] = useState<string | null>(null);
  const [minigameLive, setMinigameLive] = useState(false);
  const tucked = state.spriteAsleep;
  const [mood, setMood] = useState<SparkMood>(() =>
    tucked ? "sleepy" : "idle",
  );
  const [petPulse, setPetPulse] = useState(0);
  const look = state.appearance;
  const evo = sparkEvolutionFromState(state);
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
  const ownedColors = purchased(SPARK_TINTS, look.ownedSparkTints);
  const ownedClothes = purchased(SPARK_GEAR, look.ownedGear);
  const ownedAuras = purchased(SPARK_AURAS, look.ownedAuras);
  const ownedTrails = purchased(SPARK_TRAILS, look.ownedTrails);

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

  function wear(kind: SparkGiftKind, id: string) {
    const owned =
      (kind === "sparkTint" && look.ownedSparkTints.includes(id as SparkTintId)) ||
      (kind === "gear" && look.ownedGear.includes(id as SparkGearId)) ||
      (kind === "aura" && look.ownedAuras.includes(id as SparkAuraId)) ||
      (kind === "trail" && look.ownedTrails.includes(id as SparkTrailId));
    if (!owned) {
      setNotice("Buy that in Appearance.");
      return;
    }
    const result = equipAppearance(kind, id);
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
        <div className="flex items-center justify-between gap-3">
          <p className="text-[11px] font-medium tracking-[0.18em] text-zinc-400 uppercase">
            My Sprite
          </p>
          <SparkHowTo />
        </div>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          {displaySpriteName(state.spriteName)}
        </h1>
      </section>

      <section className="flux-card px-6 py-6">
        <SpriteRename />
      </section>

      <section
        id="snacks"
        className={cn(
          "flux-card scroll-mt-24 flex flex-col items-center px-5 py-8",
          minigameLive && "opacity-35",
        )}
      >
        <SpritePlaypen
          mood={mood}
          petPulse={petPulse}
          canFeed={snacksOnStage}
          celebrate={canCelebrate && !tucked}
          onPet={onPet}
          onFeed={onFeedDrop}
          onSleep={() => setSpriteAsleep(true)}
          onWake={() => setSpriteAsleep(false)}
          onCelebrate={() => react("done", 900)}
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
          value={sparkEvolutionLabel(state.careStage)}
          hint={<CareStageInfo />}
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

      <AvoidFall onNotice={setNotice} onLiveChange={setMinigameLive} />

      <EquipRow
        title="Sprite colour"
        items={ownedColors
          .filter((item) => item.kind === "solid")
          .map((item) => ({
            id: item.id,
            name: item.name,
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
        onWear={(id) => wear("sparkTint", id)}
      />
      <EquipRow
        title="Sprite gradient"
        items={ownedColors
          .filter((item) => item.kind === "gradient")
          .map((item) => ({
            id: item.id,
            name: item.name,
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
        onWear={(id) => wear("sparkTint", id)}
      />
      <EquipRow
        title="Clothes"
        items={ownedClothes.map((item) => ({
          id: item.id,
          name: item.name,
          on: look.gear === item.id,
          preview: (
            <Spark
              mood="idle"
              tint={look.sparkTint}
              gear={item.id}
              trail="none"
              evolve={false}
              size={64}
            />
          ),
        }))}
        onWear={(id) => wear("gear", id)}
      />
      <EquipRow
        title="Aura · Body glow"
        items={ownedAuras.map((item) => ({
          id: item.id,
          name: item.name,
          on: look.aura === item.id,
          preview: (
            <Spark
              mood="idle"
              tint={look.sparkTint}
              gear="none"
              aura={item.id}
              trail="none"
              evolve={false}
              size={64}
            />
          ),
        }))}
        onWear={(id) => wear("aura", id)}
      />
      <EquipRow
        title="Trail"
        items={ownedTrails.map((item) => ({
          id: item.id,
          name: item.name,
          on: look.trail === item.id,
          preview: (
            <Spark mood="idle" gear="none" trail={item.id} evolve={false} size={52} />
          ),
        }))}
        onWear={(id) => wear("trail", id)}
      />

    </PageFrame>
  );
}

function StatusCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: ReactNode;
}) {
  return (
    <div className="flux-card px-4 py-4">
      <p className="inline-flex items-center gap-1.5 text-[11px] tracking-[0.14em] text-muted-foreground uppercase">
        {label}
        {hint}
      </p>
      <p className="mt-2 text-lg text-foreground">{value}</p>
    </div>
  );
}

function purchased<T extends { id: string }>(
  catalog: readonly T[],
  owned: readonly string[],
) {
  return catalog.filter((item) => item.id !== "none" && owned.includes(item.id));
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
    on: boolean;
    preview: ReactNode;
  }[];
  onWear: (id: string) => void;
}) {
  return (
    <section className="flux-card px-6 py-6">
      <h2 className="text-lg text-foreground">{title}</h2>
      {items.length === 0 ? (
        <p className="mt-3 text-sm text-muted-foreground">
          Buy looks in{" "}
          <Link href={ROUTES.appearance} className="text-foreground underline">
            Appearance
          </Link>
          .
        </p>
      ) : (
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onWear(item.id)}
              className={cn(
                "flex items-center gap-3 rounded-2xl bg-white px-3 py-2 text-left shadow-[0_1px_2px_rgb(24_24_27/0.05)] dark:bg-zinc-900",
                item.on ? "ring-1 ring-primary/45" : "ring-1 ring-border",
              )}
            >
              <span className="flex size-14 items-center justify-center">
                {item.preview}
              </span>
              <span>
                <span className="block text-sm text-foreground">{item.name}</span>
                <span className="block text-xs text-muted-foreground">
                  {item.on ? "On" : "Tap to wear"}
                </span>
              </span>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
