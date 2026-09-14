"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { MintChip, TokenAmount } from "@/components/mint-chip";
import { Spark } from "@/components/spark";
import { Button } from "@/components/ui/button";
import {
  ACCENTS,
  BACKGROUNDS,
  COLLECTIONS,
  FOCUS_THEMES,
  SPARK_GEAR,
  SPARK_TRAILS,
  SPARK_TINTS,
} from "@/lib/appearance";
import { ROUTES } from "@/lib/routes";
import {
  buyAppearance,
  equipAppearance,
  type AppearanceKind,
  useCatalyst,
} from "@/lib/store";
import { cn } from "@/lib/utils";

export default function AppearancePage() {
  const state = useCatalyst();
  const [notice, setNotice] = useState<string | null>(null);
  const look = state.appearance;

  function act(kind: AppearanceKind, id: string, owned: boolean) {
    const result = owned ? equipAppearance(kind, id) : buyAppearance(kind, id);
    setNotice(result.ok ? (owned ? "Equipped." : "Bought and equipped.") : result.reason);
  }

  return (
    <div className="mx-auto w-full max-w-3xl space-y-12">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs tracking-[0.2em] text-primary uppercase">
            Appearance shop
          </p>
          <h1 className="mt-3 text-4xl text-foreground sm:text-5xl">
            A small closet. Four collections.
          </h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Starter pieces stay cheap. Night sky is mid. Elite gold is rare.
            Focus scenes sit on the lock and timer. Cat, desk, and library
            keep one camera and drift from afternoon to night. Rocket stays
            deferred. Dress the spark on My Sprite. It grows from official
            study hours, not shop buys.
          </p>
          <p className="mt-3 text-sm">
            <Link href={ROUTES.sprite} className="text-foreground underline">
              Care and equip on My Sprite
            </Link>
          </p>
        </div>
        <Spark mood="idle" size={132} pettable className="hidden shrink-0 sm:block" />
      </div>

      {notice ? <p className="text-sm text-primary">{notice}</p> : null}

      {COLLECTIONS.map((collection) => (
        <section key={collection.id} className="space-y-6">
          <div>
            <p className="inline-flex items-center gap-1.5 text-[11px] tracking-[0.16em] text-primary uppercase">
              <MintChip size={11} />
              {collection.range}
            </p>
            <h2 className="mt-1 text-2xl text-foreground">{collection.name}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{collection.copy}</p>
          </div>

          <Group
            title="Accent"
            items={ACCENTS.filter((item) => item.collection === collection.id)}
            owned={(id) => look.ownedAccents.includes(id)}
            equipped={(id) => look.accent === id}
            onAct={(id, owned) => act("accent", id, owned)}
            swatch={(item) => (
              <span className="size-8 rounded-full" style={{ background: item.hex }} />
            )}
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
            items={SPARK_TINTS.filter((item) => item.collection === collection.id)}
            owned={(id) => look.ownedSparkTints.includes(id)}
            equipped={(id) => look.sparkTint === id}
            onAct={(id, owned) => act("sparkTint", id, owned)}
            blurb="Same spark, different light."
            swatch={(item) => (
              <Spark mood="idle" tint={item.id} gear="none" trail="none" evolve={false} size={52} />
            )}
          />

          <Group
            title="Clothes"
            items={SPARK_GEAR.filter((item) => item.collection === collection.id)}
            owned={(id) => look.ownedGear.includes(id)}
            equipped={(id) => look.gear === id}
            onAct={(id, owned) => act("gear", id, owned)}
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

          <Group
            title="Trail"
            items={SPARK_TRAILS.filter((item) => item.collection === collection.id)}
            owned={(id) => look.ownedTrails.includes(id)}
            equipped={(id) => look.trail === id}
            onAct={(id, owned) => act("trail", id, owned)}
            swatch={(item) => (
              <Spark mood="idle" gear="none" trail={item.id} evolve={false} size={52} />
            )}
          />

          <Group
            title="Focus scene"
            items={FOCUS_THEMES.filter((item) => item.collection === collection.id)}
            owned={(id) => look.ownedFocusThemes.includes(id)}
            equipped={(id) => look.focusTheme === id}
            onAct={(id, owned) => act("focusTheme", id, owned)}
            equipLabel="Use"
            swatch={(item) => <FocusSwatch id={item.id} />}
          />
        </section>
      ))}
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
  onAct,
  swatch,
  blurb,
  equipLabel = "Wear",
}: {
  title: string;
  items: readonly T[];
  owned: (id: T["id"]) => boolean;
  equipped: (id: T["id"]) => boolean;
  onAct: (id: T["id"], owned: boolean) => void;
  swatch: (item: T) => ReactNode;
  blurb?: string;
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
              blurb={item.blurb ?? blurb ?? ""}
              cost={item.cost}
              owned={has}
              equipped={on}
              equipLabel={equipLabel}
              onClick={() => onAct(item.id, has)}
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
          "bg-[linear-gradient(135deg,#0a1a16_0%,#14241c_40%,#1a1430_100%)]",
      )}
    />
  );
}

function FocusSwatch({ id }: { id: string }) {
  const plate =
    id === "cat"
      ? "/focus/cat-afternoon.jpg"
      : id === "desk"
        ? "/focus/desk-afternoon.jpg"
        : id === "library"
          ? "/focus/lib-afternoon.jpg"
          : null;
  if (plate) {
    return (
      <span
        className="size-10 overflow-hidden rounded-xl ring-1 ring-white/15"
        style={{
          backgroundImage: `url(${plate})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
    );
  }
  if (id === "rocket") {
    return (
      <span className="size-8 rounded-full bg-[linear-gradient(180deg,#071018_0%,#12382c_55%,#1a2a18_100%)] ring-1 ring-white/15" />
    );
  }
  return <span className="size-8 rounded-full bg-[#0B0B0F] ring-1 ring-white/15" />;
}

function ShopCard({
  name,
  blurb,
  cost,
  owned,
  equipped,
  equipLabel = "Wear",
  onClick,
  children,
}: {
  name: string;
  blurb: string;
  cost: number;
  owned: boolean;
  equipped: boolean;
  equipLabel?: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-4 rounded-2xl bg-card p-4 ring-1",
        equipped ? "ring-primary/45" : "ring-white/6",
      )}
    >
      <div className="flex size-14 items-center justify-center">{children}</div>
      <div className="min-w-0 flex-1">
        <p className="text-sm text-foreground">{name}</p>
        <p className="text-xs text-muted-foreground">{blurb}</p>
      </div>
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
          <span className="inline-flex items-center gap-1">
            Buy · <TokenAmount value={cost} />
          </span>
        )}
      </Button>
    </div>
  );
}
