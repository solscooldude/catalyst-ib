"use client";

import { useState } from "react";
import { Spark, type SparkMood } from "@/components/spark";
import { Button } from "@/components/ui/button";
import type { SparkAct } from "@/lib/spark-play";

const SEQUENCE: { act: SparkAct; mood: SparkMood; label: string; ms: number }[] = [
  { act: "sleep", mood: "sleepy", label: "Sleep", ms: 1600 },
  { act: "scrunch", mood: "idle", label: "Scrunch", ms: 1100 },
  { act: "wave", mood: "idle", label: "Mirror", ms: 1200 },
];

export default function SpriteMovesPage() {
  const [act, setAct] = useState<SparkAct>(null);
  const [mood, setMood] = useState<SparkMood>("idle");

  function play(next: (typeof SEQUENCE)[number]) {
    setAct(next.act);
    setMood(next.mood);
    window.setTimeout(() => {
      setAct((current) => (current === next.act ? null : current));
      setMood("idle");
    }, next.ms);
  }

  async function playAll() {
    for (const step of SEQUENCE) {
      play(step);
      await new Promise((resolve) => window.setTimeout(resolve, step.ms + 350));
    }
  }

  return (
    <div className="min-h-dvh bg-[#0B0B0F] px-6 py-10 text-zinc-50">
      <div className="mx-auto max-w-3xl">
        <p className="text-[11px] font-medium tracking-[0.18em] text-zinc-400 uppercase">
          Interactions
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
          Sleep · Scrunch · Mirror
        </h1>
        <div className="mt-5 flex flex-wrap gap-2">
          {SEQUENCE.map((step) => (
            <Button
              key={step.label}
              type="button"
              size="sm"
              variant={act === step.act ? "default" : "outline"}
              onClick={() => play(step)}
            >
              {step.label}
            </Button>
          ))}
          <Button type="button" size="sm" onClick={() => void playAll()}>
            Play all
          </Button>
        </div>
        <div
          id="sprite-moves-demo"
          className="mt-8 grid gap-4 sm:grid-cols-2"
        >
          <figure className="rounded-[1.5rem] border border-white/10 bg-[#18181B] px-4 py-8 text-center">
            <Spark
              mood={mood}
              act={act}
              shape="fox"
              aura="none"
              trail="none"
              evolve={false}
              stage="growing"
              extraMagical={false}
              size={220}
            />
            <figcaption className="mt-3 text-sm font-medium">Fox</figcaption>
          </figure>
          <figure className="rounded-[1.5rem] border border-white/10 bg-[#18181B] px-4 py-8 text-center">
            <Spark
              mood={mood}
              act={act}
              shape="cat"
              aura="none"
              trail="none"
              evolve={false}
              stage="growing"
              extraMagical={false}
              size={220}
            />
            <figcaption className="mt-3 text-sm font-medium">Cat</figcaption>
          </figure>
        </div>
      </div>
    </div>
  );
}
