"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { BuyLabel, TokenAmount } from "@/components/mint-chip";
import { Spark } from "@/components/spark";
import { Button } from "@/components/ui/button";
import {
  ACCENTS,
  ACCENT_SHADE_OPTIONS,
  BACKGROUNDS,
  COLLECTIONS,
  SHOP_FOCUS_SCENES,
  SPARK_GEAR,
  SPARK_TRAILS,
  SPARK_TINTS,
  type AccentId,
  type AccentShadeId,
  type SparkGearId,
  type SparkTintId,
  type SparkTrailId,
} from "@/lib/appearance";
import { FEED_COST, FEED_DAILY_LIMIT } from "@/lib/care";
import { ROUTES } from "@/lib/routes";
import {
  buyAppearance,
  equipAppearance,
  setAccentShade,
  type AppearanceKind,
  useCatalyst,
} from "@/lib/store";
import { nativeSelectClass } from "@/lib/select-class";
import { PageFrame } from "@/components/page-frame";
import { cn } from "@/lib/utils";

type Preview = {
  sparkTint?: SparkTintId;
  gear?: SparkGearId;
  trail?: SparkTrailId;
};

export default function AppearancePage() {
  const state = useCatalyst();
  const [notice, setNotice] = useState<string | null>(null);
  const [preview, setPreview] = useState<Preview>({});
  const look = state.appearance;
  const shownTint = preview.sparkTint ?? look.sparkTint;
  const shownGear = preview.gear ?? look.gear;
  const shownTrail = preview.trail ?? look.trail;
  const trying =
    preview.sparkTint != null || preview.gear != null || preview.trail != null;

  function act(kind: AppearanceKind, id: string, owned: boolean) {
    const result = owned ? equipAppearance(kind, id) : buyAppearance(kind, id);
    setNotice(result.ok ? (owned ? "Equipped." : "Bought and equipped.") : result.reason);
    if (result.ok) setPreview({});
  }

  function tryOn(kind: AppearanceKind, id: string) {
    if (kind === "sparkTint") {
      setPreview((current) => ({ ...current, sparkTint: id as SparkTintId }));
      setNotice("Preview.");
      return;
    }
    if (kind === "gear") {
      setPreview((current) => ({ ...current, gear: id as SparkGearId }));
      setNotice("Preview.");
      return;
    }
    if (kind === "trail") {
      setPreview((current) => ({ ...current, trail: id as SparkTrailId }));
      setNotice("Preview.");
    }
  }

  return (
    <PageFrame>
      <div className="flux-card flex flex-col items-center gap-6 px-6 py-8 sm:flex-row sm:items-start sm:justify-between sm:px-10">
        <div className="w-full">
          <p className="text-[11px] font-medium tracking-[0.18em] text-zinc-400 uppercase">
            Shop
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Closet
          </h1>
          <p className="mt-3 text-sm">
            <Link href={ROUTES.sprite} className="text-zinc-400 hover:text-foreground">
              My Sprite
            </Link>
          </p>
        </div>
        <div className="shrink-0 text-center">
          <Spark
            mood="idle"
            tint={shownTint}
            gear={shownGear}
            trail={shownTrail}
            size={132}
            pettable
          />
          {trying ? (
            <p className="mt-2 text-xs text-zinc-500">Preview</p>
          ) : null}
        </div>
      </div>

      {notice ? <p className="text-sm text-primary">{notice}</p> : null}

      <section id="scenes" className="flux-card scroll-mt-24 space-y-3 px-6 py-8">
        <h2 className="text-2xl text-foreground">Focus scenes</h2>
        <Group
          title="Behind Spark in a session"
          items={SHOP_FOCUS_SCENES}
          owned={(id) => look.ownedFocusThemes.includes(id)}
          equipped={(id) => look.focusTheme === id}
          onAct={(id, owned) => act("focusTheme", id, owned)}
          equipLabel="Use"
          swatch={(item) => <SceneSwatch id={item.id} />}
        />
      </section>

      <section id="snacks" className="flux-card scroll-mt-24 space-y-3 px-6 py-8">
        <h2 className="text-2xl text-foreground">Snacks</h2>
        <p className="text-sm text-zinc-400">
          <TokenAmount value={FEED_COST} /> · {FEED_DAILY_LIMIT} a day
        </p>
        <p className="text-sm">
          <Link href={`${ROUTES.sprite}#snacks`} className="text-foreground underline">
            Open the snack bowl
          </Link>
        </p>
      </section>

      <section id="trails" className="flux-card scroll-mt-24 space-y-3 px-6 py-8">
        <h2 className="text-2xl text-foreground">Trails</h2>
        <Group
          title="Spark trail only"
          items={SPARK_TRAILS.filter(
            (item) => item.id !== "week" || look.ownedTrails.includes("week"),
          )}
          owned={(id) => look.ownedTrails.includes(id)}
          equipped={(id) => look.trail === id}
          previewing={(id) => preview.trail === id}
          onAct={(id, owned) => act("trail", id, owned)}
          onTry={(id) => tryOn("trail", id)}
          swatch={(item) => (
            <Spark mood="idle" gear="none" trail={item.id} evolve={false} size={52} />
          )}
        />
      </section>

      <section className="scroll-mt-24 space-y-6">
      {COLLECTIONS.filter((collection) => collection.id !== "focus").map((collection) => (
        <section key={collection.id} className="flux-card space-y-6 px-6 py-8">
          <div>
            <p className="inline-flex items-center gap-1.5 text-[11px] tracking-[0.16em] text-primary uppercase">
              {collection.range}
            </p>
            <h2 className="mt-1 text-2xl text-foreground">{collection.name}</h2>
          </div>

          <AccentGroup
            items={ACCENTS.filter((item) => item.collection === collection.id)}
            owned={(id) => look.ownedAccents.includes(id)}
            equipped={(id) => look.accent === id}
            shade={look.accentShade}
            onAct={(id, owned) => act("accent", id, owned)}
            onShade={(id, shade) => {
              const result = setAccentShade(shade, id);
              setNotice(
                result.ok ? "Shade saved." : result.reason,
              );
            }}
          />

          <Group
            title="Room"
            items={BACKGROUNDS.filter((item) => item.collection === collection.id)}
            owned={(id) => look.ownedBackgrounds.includes(id)}
            equipped={(id) => look.background === id}
            onAct={(id, owned) => act("background", id, owned)}
            swatch={(item) => <BgSwatch id={item.id} />}
          />

          <Group
            title="Spark color"
            items={SPARK_TINTS.filter(
              (item) =>
                item.collection === collection.id && item.kind === "solid",
            )}
            owned={(id) => look.ownedSparkTints.includes(id)}
            equipped={(id) => look.sparkTint === id}
            previewing={(id) => preview.sparkTint === id}
            onAct={(id, owned) => act("sparkTint", id, owned)}
            onTry={(id) => tryOn("sparkTint", id)}
            swatch={(item) => (
              <Spark mood="idle" tint={item.id} gear="none" trail="none" evolve={false} size={52} />
            )}
          />

          <Group
            title="Spark gradient"
            items={SPARK_TINTS.filter(
              (item) =>
                item.collection === collection.id && item.kind === "gradient",
            )}
            owned={(id) => look.ownedSparkTints.includes(id)}
            equipped={(id) => look.sparkTint === id}
            previewing={(id) => preview.sparkTint === id}
            onAct={(id, owned) => act("sparkTint", id, owned)}
            onTry={(id) => tryOn("sparkTint", id)}
            swatch={(item) => (
              <Spark mood="idle" tint={item.id} gear="none" trail="none" evolve={false} size={52} />
            )}
          />

          <Group
            title="Clothes"
            items={SPARK_GEAR.filter((item) => item.collection === collection.id)}
            owned={(id) => look.ownedGear.includes(id)}
            equipped={(id) => look.gear === id}
            previewing={(id) => preview.gear === id}
            onAct={(id, owned) => act("gear", id, owned)}
            onTry={(id) => tryOn("gear", id)}
            swatch={(item) => (
              <Spark
                mood="idle"
                tint={look.sparkTint}
                gear={item.id}
                trail="none"
                evolve={false}
                size={52}
              />
            )}
          />

        </section>
      ))}
      </section>
    </PageFrame>
  );
}

function AccentGroup({
  items,
  owned,
  equipped,
  shade,
  onAct,
  onShade,
}: {
  items: readonly (typeof ACCENTS)[number][];
  owned: (id: AccentId) => boolean;
  equipped: (id: AccentId) => boolean;
  shade: AccentShadeId;
  onAct: (id: AccentId, owned: boolean) => void;
  onShade: (id: AccentId, shade: AccentShadeId) => void;
}) {
  if (items.length === 0) return null;
  return (
    <div>
      <h3 className="text-sm text-muted-foreground">Accent colour</h3>
      <p className="mt-1 text-xs text-zinc-500">
        Buy the colour once. Then pick Pastel, Normal, or Deep.
      </p>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {items.map((item) => {
          const has = owned(item.id);
          const on = equipped(item.id);
          return (
            <ShopCard
              key={item.id}
              name={item.name}
              blurb={item.blurb}
              cost={item.cost}
              owned={has}
              equipped={on}
              extra={
                has ? (
                  <label className="block">
                    <span className="sr-only">Shade for {item.name}</span>
                    <select
                      className={cn(nativeSelectClass, "h-8 min-w-[7.25rem] text-xs")}
                      value={shade}
                      onChange={(event) =>
                        onShade(item.id, event.target.value as AccentShadeId)
                      }
                    >
                      {ACCENT_SHADE_OPTIONS.map((option) => (
                        <option key={option.id} value={option.id}>
                          {option.name}
                        </option>
                      ))}
                    </select>
                  </label>
                ) : null
              }
              onClick={() => onAct(item.id, has)}
            >
              <span className="flex size-8 overflow-hidden rounded-full ring-1 ring-zinc-200/80">
                <span
                  className="h-full flex-1"
                  style={{ background: item.shades.pastel.hex }}
                />
                <span
                  className="h-full flex-1"
                  style={{ background: item.shades.normal.hex }}
                />
                <span
                  className="h-full flex-1"
                  style={{ background: item.shades.deep.hex }}
                />
              </span>
            </ShopCard>
          );
        })}
      </div>
    </div>
  );
}

function Group<
  T extends { id: string; name: string; cost: number; blurb?: string },
>({
  title,
  items,
  owned,
  equipped,
  previewing,
  onAct,
  onTry,
  swatch,
  equipLabel = "Wear",
}: {
  title: string;
  items: readonly T[];
  owned: (id: T["id"]) => boolean;
  equipped: (id: T["id"]) => boolean;
  previewing?: (id: T["id"]) => boolean;
  onAct: (id: T["id"], owned: boolean) => void;
  onTry?: (id: T["id"]) => void;
  swatch: (item: T) => ReactNode;
  equipLabel?: string;
}) {
  if (items.length === 0) return null;
  return (
    <div>
      <h3 className="text-sm text-muted-foreground">{title}</h3>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {items.map((item) => {
          const has = owned(item.id);
          const on = equipped(item.id);
          return (
            <ShopCard
              key={item.id}
              name={item.name}
              blurb={item.blurb}
              cost={item.cost}
              owned={has}
              equipped={on}
              previewing={previewing?.(item.id) ?? false}
              equipLabel={equipLabel}
              onClick={() => onAct(item.id, has)}
              onTry={onTry ? () => onTry(item.id) : undefined}
            >
              {swatch(item)}
            </ShopCard>
          );
        })}
      </div>
    </div>
  );
}

function BgSwatch({ id }: { id: string }) {
  return (
    <span
      className={cn(
        "size-8 rounded-full ring-1 ring-white/15",
        id === "void" && "bg-[#0B0B0F]",
        id === "dusk" && "bg-[#1b1524]",
        id === "mist" && "bg-[#171c24]",
        id === "grove" && "bg-[#141c18]",
        id === "stars" &&
          "bg-[#07080d] shadow-[inset_1px_1px_0_#fff8,inset_-8px_-10px_0_-6px_#fff5]",
        id === "aurora" &&
          "bg-[linear-gradient(135deg,#efe8f6_0%,#e9d5ff_45%,#c4b5fd_100%)]",
        id === "lilac" && "bg-[#e9d5ff]",
        id === "blush" && "bg-[#fecdd3]",
        id === "babyblue" && "bg-[#bfdbfe]",
      )}
    />
  );
}

function SceneSwatch({ id }: { id: string }) {
  return (
    <span
      className={cn(
        "size-8 rounded-full ring-1 ring-white/15",
        id === "nightsky" && "bg-[#0b1224]",
        id === "sea" && "bg-[#0a3a70]",
        id === "math" && "bg-[#1a1a22]",
      )}
    />
  );
}

function ShopCard({
  name,
  blurb,
  cost,
  owned,
  equipped,
  previewing = false,
  equipLabel = "Wear",
  extra,
  onClick,
  onTry,
  children,
}: {
  name: string;
  blurb?: string;
  cost: number;
  owned: boolean;
  equipped: boolean;
  previewing?: boolean;
  equipLabel?: string;
  extra?: ReactNode;
  onClick: () => void;
  onTry?: () => void;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-4 rounded-2xl bg-zinc-50 p-4 dark:bg-zinc-900",
        equipped
          ? "ring-1 ring-primary/45"
          : previewing
            ? "ring-1 ring-primary/25"
            : "",
      )}
    >
      <div className="flex size-14 items-center justify-center">{children}</div>
      <div className="min-w-0 flex-1">
        <p className="text-sm text-foreground">{name}</p>
        {blurb ? <p className="mt-0.5 text-xs text-zinc-500">{blurb}</p> : null}
      </div>
      <div className="flex flex-col items-end gap-1.5">
        {extra}
        {!owned && onTry ? (
          <Button
            size="sm"
            variant="outline"
            className="h-8 rounded-full"
            onClick={onTry}
          >
            Try
          </Button>
        ) : null}
        <Button
          size="sm"
          variant={equipped ? "outline" : "default"}
          className="h-9 rounded-full"
          disabled={equipped}
          onClick={onClick}
        >
          {equipped ? (
            "On"
          ) : owned ? (
            equipLabel
          ) : cost === 0 ? (
            "Take"
          ) : (
            <BuyLabel cost={cost} />
          )}
        </Button>
      </div>
    </div>
  );
}
