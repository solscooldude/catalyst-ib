"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { BuyLabel, TokenAmount } from "@/components/mint-chip";
import { Spark } from "@/components/spark";
import { Button } from "@/components/ui/button";
import {
  ACCENTS,
  ACCENT_SHADE_OPTIONS,
  BACKGROUNDS,
  SHOP_FOCUS_SCENES,
  SPARK_AURAS,
  SPARK_GEAR,
  SPARK_TRAILS,
  SPARK_TINTS,
  type AccentId,
  type AccentShadeId,
  type BackgroundId,
  type SparkAuraId,
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
  setBackgroundShade,
  type AppearanceKind,
  useCatalyst,
} from "@/lib/store";
import { nativeSelectClass } from "@/lib/select-class";
import { PageFrame } from "@/components/page-frame";
import { cn } from "@/lib/utils";

type Preview = {
  sparkTint?: SparkTintId;
  gear?: SparkGearId;
  aura?: SparkAuraId;
  trail?: SparkTrailId;
};

const SHOP_TABS = [
  { id: "cosmetics", label: "Cosmetics" },
  { id: "colours", label: "Colours" },
  { id: "gradients", label: "Gradients" },
  { id: "auras", label: "Auras" },
  { id: "trails", label: "Trails" },
  { id: "scenes", label: "Focus scenes" },
  { id: "room", label: "Room" },
] as const;

type ShopTab = (typeof SHOP_TABS)[number]["id"];

function tabFromHash(hash: string): ShopTab {
  const key = hash.replace(/^#/, "");
  if (key === "colours" || key === "accents") return "colours";
  if (key === "gradients" || key === "spark-gradient") return "gradients";
  if (key === "auras") return "auras";
  if (key === "trails") return "trails";
  if (key === "scenes") return "scenes";
  if (key === "room") return "room";
  return "cosmetics";
}

export default function AppearancePage() {
  const state = useCatalyst();
  const [notice, setNotice] = useState<string | null>(null);
  const [preview, setPreview] = useState<Preview>({});
  const [tab, setTab] = useState<ShopTab>("cosmetics");
  const look = state.appearance;
  const shownTint = preview.sparkTint ?? look.sparkTint;
  const shownGear = preview.gear ?? look.gear;
  const shownAura = preview.aura ?? look.aura;
  const shownTrail = preview.trail ?? look.trail;
  const trying =
    preview.sparkTint != null ||
    preview.gear != null ||
    preview.aura != null ||
    preview.trail != null;

  function act(kind: AppearanceKind, id: string, owned: boolean) {
    const result = owned ? equipAppearance(kind, id) : buyAppearance(kind, id);
    setNotice(result.ok ? (owned ? "Equipped." : "Bought and equipped.") : result.reason);
    if (result.ok) setPreview({});
  }

  useEffect(() => {
    function sync() {
      setTab(tabFromHash(window.location.hash));
    }
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  function openTab(next: ShopTab) {
    setTab(next);
    const url = `${ROUTES.appearance}#${next}`;
    window.history.replaceState(null, "", url);
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
    if (kind === "aura") {
      setPreview((current) => ({ ...current, aura: id as SparkAuraId }));
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
            aura={shownAura}
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

      <div
        role="tablist"
        aria-label="Shop categories"
        className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {SHOP_TABS.map((item) => {
          const on = tab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={on}
              className={cn(
                "shrink-0 rounded-full px-3.5 py-2 text-sm font-medium ring-1 transition-colors",
                on
                  ? "bg-primary/15 text-foreground ring-primary/40"
                  : "bg-card text-zinc-500 ring-border hover:text-foreground",
              )}
              onClick={() => openTab(item.id)}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      <section className="flux-card scroll-mt-24 space-y-6 px-6 py-8">
        {tab === "cosmetics" ? (
          <>
            <div>
              <h2 className="text-2xl text-foreground">Cosmetics</h2>
              <p className="mt-1 text-sm text-zinc-500">
                Clothes and solid Spark body colours. Try before you buy.
              </p>
            </div>
            <Group
              title="Clothes"
              items={SPARK_GEAR}
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
                  aura="none"
                  trail="none"
                  evolve={false}
                  size={64}
                />
              )}
            />
            <Group
              title="Solid body colours"
              items={SPARK_TINTS.filter((item) => item.kind === "solid")}
              owned={(id) => look.ownedSparkTints.includes(id)}
              equipped={(id) => look.sparkTint === id}
              previewing={(id) => preview.sparkTint === id}
              onAct={(id, owned) => act("sparkTint", id, owned)}
              onTry={(id) => tryOn("sparkTint", id)}
              swatch={(item) => (
                <Spark mood="idle" tint={item.id} gear="none" trail="none" evolve={false} size={52} />
              )}
            />
            <p className="text-sm text-zinc-400">
              Snacks are on{" "}
              <Link href={`${ROUTES.sprite}#snacks`} className="text-foreground underline">
                My Sprite
              </Link>
              {" · "}
              <TokenAmount value={FEED_COST} /> · {FEED_DAILY_LIMIT} a day
            </p>
          </>
        ) : null}

        {tab === "colours" ? (
          <>
            <div>
              <h2 className="text-2xl text-foreground">Colours</h2>
              <p className="mt-1 text-sm text-zinc-500">
                Accent hues for buttons and chrome. Buy the colour once, then
                Pastel / Normal / Deep.
              </p>
            </div>
            <AccentGroup
              items={ACCENTS}
              owned={(id) => look.ownedAccents.includes(id)}
              equipped={(id) => look.accent === id}
              shade={look.accentShade}
              onAct={(id, owned) => act("accent", id, owned)}
              onShade={(id, shade) => {
                const result = setAccentShade(shade, id);
                setNotice(result.ok ? "Shade saved." : result.reason);
              }}
            />
          </>
        ) : null}

        {tab === "gradients" ? (
          <>
            <div>
              <h2 className="text-2xl text-foreground">Gradients</h2>
              <p className="mt-1 text-sm text-zinc-500">
                Premium two-tone Spark washes. 40–44, Aurora 90. No shade dropdown.
              </p>
            </div>
            <Group
              title="Spark body"
              items={SPARK_TINTS.filter((item) => item.kind === "gradient")}
              owned={(id) => look.ownedSparkTints.includes(id)}
              equipped={(id) => look.sparkTint === id}
              previewing={(id) => preview.sparkTint === id}
              onAct={(id, owned) => act("sparkTint", id, owned)}
              onTry={(id) => tryOn("sparkTint", id)}
              swatch={(item) => (
                <Spark mood="idle" tint={item.id} gear="none" trail="none" evolve={false} size={52} />
              )}
            />
          </>
        ) : null}

        {tab === "auras" ? (
          <>
            <div>
              <h2 className="text-2xl text-foreground">Auras</h2>
              <p className="mt-1 text-sm text-zinc-500">
                Soft colour glow around Spark. One at a time.
              </p>
            </div>
            <Group
              title="Glow"
              items={SPARK_AURAS}
              owned={(id) => look.ownedAuras.includes(id)}
              equipped={(id) => look.aura === id}
              previewing={(id) => preview.aura === id}
              onAct={(id, owned) => act("aura", id, owned)}
              onTry={(id) => tryOn("aura", id)}
              swatch={(item) => (
                <Spark
                  mood="idle"
                  tint={look.sparkTint}
                  gear="none"
                  aura={item.id}
                  trail="none"
                  evolve={false}
                  size={52}
                />
              )}
            />
          </>
        ) : null}

        {tab === "trails" ? (
          <>
            <div>
              <h2 className="text-2xl text-foreground">Trails</h2>
              <p className="mt-1 text-sm text-zinc-500">
                Spark trail only. No Pastel / Normal / Deep — that dropdown is
                for colours and rooms.
              </p>
            </div>
            <Group
              title="Motion"
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
          </>
        ) : null}

        {tab === "scenes" ? (
          <>
            <div>
              <h2 className="text-2xl text-foreground">Focus scenes</h2>
              <p className="mt-1 text-sm text-zinc-500">
                Behind Spark in a session. Night sky is free.
              </p>
            </div>
            <Group
              title="Session backdrop"
              items={SHOP_FOCUS_SCENES}
              owned={(id) => look.ownedFocusThemes.includes(id)}
              equipped={(id) => look.focusTheme === id}
              onAct={(id, owned) => act("focusTheme", id, owned)}
              equipLabel="Use"
              swatch={(item) => <SceneSwatch id={item.id} />}
            />
          </>
        ) : null}

        {tab === "room" ? (
          <>
            <div>
              <h2 className="text-2xl text-foreground">Room</h2>
              <p className="mt-1 text-sm text-zinc-500">
                App chrome hue. Buy once, then Pastel / Normal / Deep. Void and
                star dots stay as they are.
              </p>
            </div>
            <RoomGroup
              items={BACKGROUNDS}
              owned={(id) => look.ownedBackgrounds.includes(id)}
              equipped={(id) => look.background === id}
              shade={look.backgroundShade}
              onAct={(id, owned) => act("background", id, owned)}
              onShade={(id, next) => {
                const result = setBackgroundShade(next, id);
                setNotice(result.ok ? "Shade saved." : result.reason);
              }}
            />
          </>
        ) : null}
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

function RoomGroup({
  items,
  owned,
  equipped,
  shade,
  onAct,
  onShade,
}: {
  items: readonly (typeof BACKGROUNDS)[number][];
  owned: (id: BackgroundId) => boolean;
  equipped: (id: BackgroundId) => boolean;
  shade: AccentShadeId;
  onAct: (id: BackgroundId, owned: boolean) => void;
  onShade: (id: BackgroundId, shade: AccentShadeId) => void;
}) {
  if (items.length === 0) return null;
  return (
    <div>
      <h3 className="text-sm text-muted-foreground">Room colour</h3>
      <p className="mt-1 text-xs text-zinc-500">
        Buy the hue once. Then pick Pastel, Normal, or Deep. Void and star dots stay as they are.
      </p>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {items.map((item) => {
          const has = owned(item.id);
          const on = equipped(item.id);
          const wash = item.kind === "wash" ? item.shades : null;
          return (
            <ShopCard
              key={item.id}
              name={item.name}
              blurb={item.blurb}
              cost={item.cost}
              owned={has}
              equipped={on}
              extra={
                has && wash ? (
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
              {wash ? (
                <span className="flex size-8 overflow-hidden rounded-full ring-1 ring-zinc-200/80">
                  <span
                    className="h-full flex-1"
                    style={{ background: wash.pastel.swatch }}
                  />
                  <span
                    className="h-full flex-1"
                    style={{ background: wash.normal.swatch }}
                  />
                  <span
                    className="h-full flex-1"
                    style={{ background: wash.deep.swatch }}
                  />
                </span>
              ) : (
                <BgSwatch id={item.id} />
              )}
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
        id === "stars" &&
          "bg-[#07080d] shadow-[inset_1px_1px_0_#fff8,inset_-8px_-10px_0_-6px_#fff5]",
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
      <div className="flex size-16 items-center justify-center overflow-visible">
        {children}
      </div>
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
