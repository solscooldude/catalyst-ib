"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { ChevronDown, Monitor, Sparkles } from "lucide-react";
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
  shopCatalog,
  type AccentId,
  type AccentShadeId,
  type BackgroundId,
  type SparkAuraId,
  type SparkGearId,
  type SparkTintId,
  type SparkTrailId,
} from "@/lib/appearance";
import { FEED_COST, FEED_DAILY_LIMIT } from "@/lib/care";
import { followInPageHref, listenInPageNav } from "@/lib/in-page-nav";
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
import { rotateShopSection, shopRefreshCue } from "@/lib/shop-rotation";
import { PageFrame } from "@/components/page-frame";
import { cn } from "@/lib/utils";

type Preview = {
  sparkTint?: SparkTintId;
  gear?: SparkGearId;
  aura?: SparkAuraId;
  trail?: SparkTrailId;
};

const SPRITE_TABS = [
  { id: "cosmetics", label: "Cosmetics" },
  { id: "colours", label: "Colours" },
  { id: "gradients", label: "Gradients" },
  { id: "auras", label: "Auras" },
  { id: "trails", label: "Trails" },
] as const;

const APP_TABS = [
  { id: "scenes", label: "Focus scenes" },
  { id: "room", label: "Rooms" },
] as const;

type ShopRealm = "sprite" | "app";
type ShopTab =
  | (typeof SPRITE_TABS)[number]["id"]
  | (typeof APP_TABS)[number]["id"];

function tabFromHash(hash: string): ShopTab {
  const key = hash.replace(/^#/, "");
  if (key === "colours") return "colours";
  if (key === "gradients" || key === "spark-gradient") return "gradients";
  if (key === "auras") return "auras";
  if (key === "trails") return "trails";
  if (key === "scenes" || key === "app") return "scenes";
  if (key === "room" || key === "accents") return "room";
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
    return listenInPageNav(() => {
      setTab(tabFromHash(window.location.hash));
    });
  }, []);

  const shownRealm: ShopRealm =
    tab === "scenes" || tab === "room" ? "app" : "sprite";

  function openRealm(next: ShopRealm) {
    openTab(next === "app" ? "scenes" : "cosmetics");
  }

  function openTab(next: ShopTab) {
    setTab(next);
    followInPageHref(`${ROUTES.appearance}#${next}`);
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
            Token shop
          </h1>
          <p className="mt-3 text-sm">
            <Link href={ROUTES.sprite} className="text-zinc-400 hover:text-foreground">
              My Sprite
            </Link>
          </p>
        </div>
        <div className="w-full shrink-0 text-center sm:w-auto sm:min-w-[16rem]">
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

      <div className="grid gap-4 sm:grid-cols-2">
        <ShopRealmCard
          title="Sprite shop"
          copy="Clothes, colours, glow, and trails."
          icon={Sparkles}
          selected={shownRealm === "sprite"}
          tabs={SPRITE_TABS}
          tab={shownRealm === "sprite" ? tab : "cosmetics"}
          onOpen={() => openRealm("sprite")}
          onPick={openTab}
        />
        <ShopRealmCard
          title="App appearance"
          copy="Focus scenes and rooms."
          icon={Monitor}
          selected={shownRealm === "app"}
          tabs={APP_TABS}
          tab={shownRealm === "app" ? tab : "scenes"}
          onOpen={() => openRealm("app")}
          onPick={openTab}
        />
      </div>

      <section className="flux-card scroll-mt-24 space-y-6 px-6 py-8">
        {tab === "cosmetics" ? (
          <>
            <div>
              <h2 className="text-2xl text-foreground">Cosmetics</h2>
              <p className="mt-1 text-sm text-zinc-500">
                Clothes for the sprite. Try before you buy.
              </p>
            </div>
            <Group
              title="Clothes"
              cue={shopRefreshCue()}
              items={rotateShopSection(
                shopCatalog(SPARK_GEAR),
                "clothes",
                look.ownedGear,
              )}
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
              <h2 className="text-2xl text-foreground">Sprite colour</h2>
              <p className="mt-1 text-sm text-zinc-500">
                Solid body colours. One equipped at a time.
              </p>
            </div>
            <Group
              title="Solid body"
              cue={shopRefreshCue()}
              items={rotateShopSection(
                SPARK_TINTS.filter((item) => item.kind === "solid"),
                "colours",
                look.ownedSparkTints,
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
          </>
        ) : null}

        {tab === "gradients" ? (
          <>
            <div>
              <h2 className="text-2xl text-foreground">Sprite gradient</h2>
              <p className="mt-1 text-sm text-zinc-500">
                Premium two-tone sprite washes. 40–44, Aurora 90. No shade dropdown.
              </p>
            </div>
            <Group
              title="Gradient body"
              cue={shopRefreshCue()}
              items={rotateShopSection(
                SPARK_TINTS.filter((item) => item.kind === "gradient"),
                "gradients",
                look.ownedSparkTints,
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
          </>
        ) : null}

        {tab === "auras" ? (
          <>
            <div>
              <h2 className="text-2xl text-foreground">Aura · Body glow</h2>
              <p className="mt-1 text-sm text-zinc-500">
                Colour of the soft glow around the drop. Quiz starters plus
                shop glows. One at a time. Not a prop, trail, or ring.
              </p>
            </div>
            <Group
              title="Glow colour"
              cue={shopRefreshCue()}
              items={rotateShopSection(SPARK_AURAS, "auras", look.ownedAuras)}
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
                  size={72}
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
                Motion behind the sprite. No Pastel / Normal / Deep — that
                dropdown is for rooms.
              </p>
            </div>
            <Group
              title="Motion"
              cue={shopRefreshCue()}
              items={rotateShopSection(
                shopCatalog(SPARK_TRAILS),
                "trails",
                look.ownedTrails,
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
                Behind the sprite in a session. Night sky is free.
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
                star dots stay as they are. Accent buttons live here too.
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

function ShopRealmCard({
  title,
  copy,
  icon: Icon,
  selected,
  tabs,
  tab,
  onOpen,
  onPick,
}: {
  title: string;
  copy: string;
  icon: typeof Sparkles;
  selected: boolean;
  tabs: readonly { id: ShopTab; label: string }[];
  tab: ShopTab;
  onOpen: () => void;
  onPick: (next: ShopTab) => void;
}) {
  return (
    <div
      className={cn(
        "rounded-[1.75rem] px-6 py-6 sm:px-7",
        selected
          ? "bg-primary text-primary-foreground shadow-[0_16px_40px_-24px_rgb(94_234_212/0.9)] ring-2 ring-primary"
          : "bg-card ring-2 ring-border",
      )}
    >
      <button type="button" onClick={onOpen} className="w-full text-left">
        <span
          className={cn(
            "inline-flex size-11 items-center justify-center rounded-2xl",
            selected ? "bg-black/10" : "bg-primary/15 text-primary",
          )}
        >
          <Icon className="size-5" />
        </span>
        <p className="mt-4 text-3xl font-semibold tracking-tight">{title}</p>
        <p
          className={cn(
            "mt-2 text-sm",
            selected ? "text-primary-foreground/80" : "text-zinc-500",
          )}
        >
          {copy}
        </p>
      </button>
      <label className="mt-5 block">
        <span
          className={cn(
            "mb-2 inline-flex items-center gap-1 text-sm font-semibold",
            selected ? "text-primary-foreground" : "text-foreground",
          )}
        >
          {title}
          <ChevronDown className="size-4" />
        </span>
        <span className="relative block">
          <select
            className={cn(
              nativeSelectClass,
              "h-14 appearance-none pr-10 text-base",
              selected &&
                "border-primary-foreground/40 bg-white text-zinc-900",
            )}
            value={tab}
            aria-label={`${title} section`}
            onChange={(event) => onPick(event.target.value as ShopTab)}
          >
            {tabs.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
          <ChevronDown
            className="pointer-events-none absolute top-1/2 right-3 size-5 -translate-y-1/2 text-zinc-500"
            aria-hidden
          />
        </span>
      </label>
    </div>
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
  cue,
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
  cue?: string;
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
      {cue ? <p className="mt-1 text-xs text-zinc-500">{cue}</p> : null}
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
