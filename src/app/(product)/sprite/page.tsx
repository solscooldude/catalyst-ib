"use client";

import { useState } from "react";
import Link from "next/link";
import { Spark } from "@/components/spark";
import { Button } from "@/components/ui/button";
import {
  SPARK_GEAR,
  SPARK_TRAILS,
  SPARK_TINTS,
} from "@/lib/appearance";
import {
  formatHours,
  sparkEvolution,
  sparkEvolutionLabel,
  verifiedStudyMs,
} from "@/lib/stats";
import { ROUTES } from "@/lib/routes";
import { equipAppearance, useCatalyst } from "@/lib/store";
import { cn } from "@/lib/utils";

export default function SpritePage() {
  const state = useCatalyst();
  const [notice, setNotice] = useState<string | null>(null);
  const look = state.appearance;
  const evo = sparkEvolution(state.logs);
  const official = verifiedStudyMs(state.logs);

  function wear(
    kind: "sparkTint" | "gear" | "trail",
    id: string,
    owned: boolean,
  ) {
    if (!owned) {
      setNotice("Buy that in Appearance first.");
      return;
    }
    const result = equipAppearance(kind, id);
    setNotice(result.ok ? "Equipped." : result.reason);
  }

  return (
    <div className="mx-auto w-full max-w-3xl space-y-10">
      <div>
        <p className="text-xs tracking-[0.2em] text-primary uppercase">
          My Sprite
        </p>
        <h1 className="mt-3 text-4xl text-foreground sm:text-5xl">
          Sit with your spark.
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
          Tap to pet. Equip what you already own. Official ManageBac hours
          grow the glow — the shop does not.
        </p>
      </div>

      <section className="flex flex-col items-center rounded-[2rem] bg-card px-5 py-10 ring-1 ring-white/6">
        <Spark mood="idle" size={268} pettable />
        <p className="mt-5 text-center text-xs text-muted-foreground">
          Tap the spark
        </p>
        {notice ? (
          <p className="mt-3 text-sm text-primary">{notice}</p>
        ) : null}
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
          label="Sessions"
          value={String(state.logs.length)}
          detail={`${state.tokens} tokens on hand`}
        />
      </section>

      <EquipRow
        title="Color"
        items={SPARK_TINTS.map((item) => ({
          id: item.id,
          name: item.name,
          owned: look.ownedSparkTints.includes(item.id),
          on: look.sparkTint === item.id,
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
        }))}
        onWear={(id, owned) => wear("gear", id, owned)}
      />
      <EquipRow
        title="Trail"
        items={SPARK_TRAILS.map((item) => ({
          id: item.id,
          name: item.name,
          owned: look.ownedTrails.includes(item.id),
          on: look.trail === item.id,
        }))}
        onWear={(id, owned) => wear("trail", id, owned)}
      />

      <p className="text-sm text-muted-foreground">
        Rooms and new closet pieces live in{" "}
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
    <div className="rounded-3xl bg-card px-4 py-4 ring-1 ring-white/6">
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
  items: { id: string; name: string; owned: boolean; on: boolean }[];
  onWear: (id: string, owned: boolean) => void;
}) {
  return (
    <section>
      <h2 className="text-lg text-foreground">{title}</h2>
      <div className="mt-3 flex flex-wrap gap-2">
        {items.map((item) => (
          <Button
            key={item.id}
            type="button"
            size="sm"
            variant={item.on ? "outline" : item.owned ? "secondary" : "ghost"}
            className={cn(
              "h-9 rounded-full",
              !item.owned && "text-muted-foreground",
            )}
            disabled={item.on}
            onClick={() => onWear(item.id, item.owned)}
          >
            {item.on ? `${item.name} · on` : item.name}
          </Button>
        ))}
      </div>
    </section>
  );
}
