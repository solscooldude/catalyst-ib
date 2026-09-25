// Sprite lab page — keep this comment so GitHub file writes do not strip the directive.
"use client";

import { useState } from "react";
import { Spark } from "@/components/spark";
import { Button } from "@/components/ui/button";
import type { SparkAct } from "@/lib/spark-play";
import type { SpriteSpeciesId } from "@/lib/sprite-species";

const CAST: { id: SpriteSpeciesId; label: string }[] = [
  { id: "fox", label: "Fox" },
  { id: "cat", label: "Cat" },
  { id: "dragon", label: "Dragon" },
];

export default function SpriteSpinPage() {
  const [act, setAct] = useState<SparkAct>(null);

  function spin() {
    setAct("spin");
    window.setTimeout(() => {
      setAct((current) => (current === "spin" ? null : current));
    }, 860);
  }

  return (
    <div className="min-h-dvh bg-[#0B0B0F] px-6 py-10 text-zinc-50">
      <div className="mx-auto max-w-4xl">
        <p className="text-[11px] font-medium tracking-[0.18em] text-zinc-400 uppercase">
          Interactions
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
          Spin
        </h1>
        <p className="mt-2 max-w-xl text-sm text-zinc-400">
          One rigid turn around the body centre — ears, wings, spikes, and hats
          stay attached.
        </p>
        <div className="mt-5">
          <Button type="button" size="sm" onClick={spin}>
            {act === "spin" ? "Spinning…" : "Spin"}
          </Button>
        </div>
        <div
          id="sprite-spin-demo"
          className="mt-8 grid gap-4 sm:grid-cols-3"
        >
          {CAST.map((row) => (
            <figure
              key={row.id}
              className="rounded-[1.5rem] border border-white/10 bg-[#18181B] px-4 py-8 text-center"
            >
              <Spark
                mood="idle"
                act={act}
                shape={row.id}
                aura="none"
                trail="none"
                evolve={false}
                stage="growing"
                extraMagical={false}
                size={200}
              />
              <figcaption className="mt-3 text-sm font-medium">
                {row.label}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </div>
  );
}
