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
