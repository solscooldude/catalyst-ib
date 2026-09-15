"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Spark, type SparkMood } from "@/components/spark";
import { SpritePlaypen, type SparkGiftChip } from "@/components/sprite-playpen";
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
  sparkEvolution,
  sparkEvolutionLabel,
  todayStudyMs,
  verifiedStudyMs,
} from "@/lib/stats";
import { careMood, encodeSparkGift, SPARK_GIFT_MIME, type SparkGiftKind } from "@/lib/spark-play";
import { displaySpriteName } from "@/lib/sprite-name";
import { SparkHowTo } from "@/components/spark-howto";
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
    aura?: SparkAuraId;
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
  const ownedColors = SPARK_TINTS.filter((item) =>
    look.ownedSparkTints.includes(item.id),
  );
  const ownedClothes = SPARK_GEAR.filter((item) => look.ownedGear.includes(item.id));
  const ownedAuras = SPARK_AURAS.filter((item) => look.ownedAuras.includes(item.id));
  const ownedTrails = SPARK_TRAILS.filter((item) =>
    look.ownedTrails.includes(item.id),
  );
  const gifts: SparkGiftChip[] = [
    ...ownedClothes
      .filter((item) => item.id !== "none")
      .map((item) => ({
        kind: "gear" as const,
        id: item.id,
        name: item.name,
        gear: item.id,
        tint: look.sparkTint,
      })),
    ...ownedAuras
      .filter((item) => item.id !== "none")
      .map((item) => ({
        kind: "aura" as const,
        id: item.id,
        name: item.name,
        aura: item.id,
        tint: look.sparkTint,
      })),
    ...ownedColors
      .filter((item) => item.id !== look.sparkTint)
      .slice(0, 6)
      .map((item) => ({
        kind: "sparkTint" as const,
        id: item.id,
        name: item.name,
        tint: item.id,
      })),
  ];

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
    kind: "sparkTint" | "gear" | "aura" | "trail",
    id: string,
    owned: boolean,
  ) {
    if (!owned) {
      if (kind === "sparkTint") setTryOn((current) => ({ ...current, tint: id as SparkTintId }));
      if (kind === "gear") setTryOn((current) => ({ ...current, gear: id as SparkGearId }));
      if (kind === "aura") setTryOn((current) => ({ ...current, aura: id as SparkAuraId }));
      if (kind === "trail") setTryOn((current) => ({ ...current, trail: id as SparkTrailId }));
      setNotice("Preview.");
      return;
    }
    const result = equipAppearance(kind, id);
    if (result.ok) {
      if (kind === "sparkTint") setTryOn((current) => ({ ...current, tint: undefined }));
      if (kind === "gear") setTryOn((current) => ({ ...current, gear: undefined }));
      if (kind === "aura") setTryOn((current) => ({ ...current, aura: undefined }));
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

      <section id="snacks" className="flux-card scroll-mt-24 flex flex-col items-center px-5 py-8">
        <SpritePlaypen
          mood={mood}
          petPulse={petPulse}
          tint={tryOn.tint}
          gear={tryOn.gear}
          aura={tryOn.aura}
          trail={tryOn.trail}
          canFeed={snacksOnStage}
          celebrate={canCelebrate && !tucked}
          gifts={gifts}
          onGift={(kind, id) => wear(kind, id, true)}
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
        kind="sparkTint"
        items={ownedColors
          .filter((item) => item.kind === "solid")
          .map((item) => ({
            id: item.id,
            name: item.name,
            on: look.sparkTint === item.id || tryOn.tint === item.id,
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
        onWear={(id) => wear("sparkTint", id, true)}
      />
      <EquipRow
        title="Gradient · premium"
        kind="sparkTint"
        items={ownedColors
          .filter((item) => item.kind === "gradient")
          .map((item) => ({
            id: item.id,
            name: item.name,
            on: look.sparkTint === item.id || tryOn.tint === item.id,
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
        onWear={(id) => wear("sparkTint", id, true)}
      />
      <EquipRow
        title="Clothes"
        kind="gear"
        items={ownedClothes.map((item) => ({
          id: item.id,
          name: item.name,
          on: look.gear === item.id || tryOn.gear === item.id,
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
        onWear={(id) => wear("gear", id, true)}
      />
      <EquipRow
        title="Aura · Body glow"
        kind="aura"
        items={ownedAuras.map((item) => ({
          id: item.id,
          name: item.name,
          on: look.aura === item.id || tryOn.aura === item.id,
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
        onWear={(id) => wear("aura", id, true)}
      />
      <EquipRow
        title="Trail"
        kind="trail"
        items={ownedTrails.map((item) => ({
          id: item.id,
          name: item.name,
          on: look.trail === item.id || tryOn.trail === item.id,
          preview: (
            <Spark mood="idle" gear="none" trail={item.id} evolve={false} size={52} />
          ),
        }))}
        onWear={(id) => wear("trail", id, true)}
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
  kind,
  items,
  onWear,
}: {
  title: string;
  kind: SparkGiftKind;
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
          Buy looks in Appearance.
        </p>
      ) : (
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              draggable
              onClick={() => onWear(item.id)}
              onDragStart={(event) => {
                const payload = encodeSparkGift(kind, item.id);
                event.dataTransfer.setData(SPARK_GIFT_MIME, payload);
                event.dataTransfer.setData("text/plain", payload);
                event.dataTransfer.effectAllowed = "copy";
              }}
              className={cn(
                "flex items-center gap-3 rounded-2xl bg-white px-3 py-2 text-left shadow-[0_1px_2px_rgb(24_24_27/0.05)] dark:bg-zinc-900",
                item.on ? "ring-primary/45" : "ring-border",
              )}
            >
              <span className="flex size-14 items-center justify-center">
                {item.preview}
              </span>
              <span>
                <span className="block text-sm text-foreground">{item.name}</span>
                {item.on ? (
                  <span className="block text-xs text-muted-foreground">On</span>
                ) : (
                  <span className="block text-xs text-muted-foreground">
                    Drag onto the sprite
                  </span>
                )}
              </span>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
