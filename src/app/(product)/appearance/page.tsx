"use client";

import { useState } from "react";
import { Spark } from "@/components/spark";
import { Button } from "@/components/ui/button";
import {
  ACCENTS,
  BACKGROUNDS,
  SPARK_GEAR,
  SPARK_TINTS,
} from "@/lib/appearance";
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
    <div className="mx-auto w-full max-w-3xl space-y-10">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs tracking-[0.2em] text-primary uppercase">
            Appearance shop
          </p>
          <h1 className="mt-3 text-4xl text-foreground sm:text-5xl">
            Spend tokens on the room and the spark.
          </h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Accents change buttons and highlights. Backgrounds stay quiet.
            Spark tints and accessories are just for the mascot. Mint is free
            for every new account.
          </p>
        </div>
        <Spark mood="idle" size={104} className="hidden shrink-0 sm:block" />
      </div>

      {notice ? <p className="text-sm text-primary">{notice}</p> : null}

      <ShopSection
        title="Site accent"
        copy="Replaces mint across buttons, chips, and the calendar."
      >
        <div className="grid gap-3 sm:grid-cols-2">
          {ACCENTS.map((item) => {
            const owned = look.ownedAccents.includes(item.id);
            const equipped = look.accent === item.id;
            return (
              <ShopCard
                key={item.id}
                name={item.name}
                blurb={item.blurb}
                cost={item.cost}
                owned={owned}
                equipped={equipped}
                onClick={() => act("accent", item.id, owned)}
              >
                <span
                  className="size-8 rounded-full"
                  style={{ background: item.hex }}
                />
              </ShopCard>
            );
          })}
        </div>
      </ShopSection>

      <ShopSection
        title="Background"
        copy="A faint shift in the page. Nothing loud."
      >
        <div className="grid gap-3 sm:grid-cols-2">
          {BACKGROUNDS.map((item) => {
            const owned = look.ownedBackgrounds.includes(item.id);
            const equipped = look.background === item.id;
            return (
              <ShopCard
                key={item.id}
                name={item.name}
                blurb={item.blurb}
                cost={item.cost}
                owned={owned}
                equipped={equipped}
                onClick={() => act("background", item.id, owned)}
              >
                <span
                  className={cn(
                    "size-8 rounded-full ring-1 ring-white/15",
                    item.id === "void" && "bg-[#0B0B0F]",
                    item.id === "dusk" && "bg-[#1b1524]",
                    item.id === "mist" && "bg-[#171c24]",
                    item.id === "grove" && "bg-[#141c18]",
                  )}
                />
              </ShopCard>
            );
          })}
        </div>
      </ShopSection>

      <ShopSection
        title="Spark color"
        copy="Recolor the mascot without changing the site accent."
      >
        <div className="grid gap-3 sm:grid-cols-2">
          {SPARK_TINTS.map((item) => {
            const owned = look.ownedSparkTints.includes(item.id);
            const equipped = look.sparkTint === item.id;
            return (
              <ShopCard
                key={item.id}
                name={item.name}
                blurb="Same spark, different light."
                cost={item.cost}
                owned={owned}
                equipped={equipped}
                onClick={() => act("sparkTint", item.id, owned)}
              >
                <Spark
                  mood="idle"
                  tint={item.id}
                  gear="none"
                  size={52}
                />
              </ShopCard>
            );
          })}
        </div>
      </ShopSection>

      <ShopSection
        title="Spark clothes"
        copy="A few starter pieces. One at a time."
      >
        <div className="grid gap-3 sm:grid-cols-2">
          {SPARK_GEAR.map((item) => {
            const owned = look.ownedGear.includes(item.id);
            const equipped = look.gear === item.id;
            return (
              <ShopCard
                key={item.id}
                name={item.name}
                blurb={item.blurb}
                cost={item.cost}
                owned={owned}
                equipped={equipped}
                onClick={() => act("gear", item.id, owned)}
              >
                <Spark
                  mood="idle"
                  tint={look.sparkTint}
                  gear={item.id}
                  size={52}
                />
              </ShopCard>
            );
          })}
        </div>
      </ShopSection>
    </div>
  );
}

function ShopSection({
  title,
  copy,
  children,
}: {
  title: string;
  copy: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="text-lg text-foreground">{title}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{copy}</p>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function ShopCard({
  name,
  blurb,
  cost,
  owned,
  equipped,
  onClick,
  children,
}: {
  name: string;
  blurb: string;
  cost: number;
  owned: boolean;
  equipped: boolean;
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
        {equipped ? "On" : owned ? "Wear" : cost === 0 ? "Take" : `Buy · ${cost}`}
      </Button>
    </div>
  );
}
