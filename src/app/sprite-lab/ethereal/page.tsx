"use client";

import { Spark } from "@/components/spark";

export default function EtherealLabPage() {
  return (
    <div className="min-h-dvh bg-[#0B0B0F] px-6 py-10 text-zinc-50">
      <div className="mx-auto max-w-4xl">
        <p className="text-[11px] font-medium tracking-[0.18em] text-zinc-400 uppercase">
          Ethereal
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">
          Pulse vs Extra Magical
        </h1>
        <div
          id="ethereal-demo"
          className="mt-8 grid gap-4 sm:grid-cols-2"
        >
          <figure className="rounded-[1.5rem] border border-white/10 bg-[#18181B] px-4 py-8 text-center">
            <Spark
              mood="idle"
              shape="fox"
              aura="amber"
              trail="none"
              evolve={false}
              stage="ethereal"
              extraMagical={false}
              size={220}
            />
            <figcaption className="mt-4 text-sm font-medium">
              Fox · Ethereal
            </figcaption>
          </figure>
          <figure className="rounded-[1.5rem] border border-white/10 bg-[#18181B] px-4 py-8 text-center">
            <Spark
              mood="idle"
              shape="fox"
              aura="amber"
              trail="none"
              evolve={false}
              stage="ethereal"
              extraMagical
              size={220}
            />
            <figcaption className="mt-4 text-sm font-medium">
              Fox · Extra Magical
            </figcaption>
          </figure>
          <figure className="rounded-[1.5rem] border border-white/10 bg-[#18181B] px-4 py-8 text-center">
            <Spark
              mood="idle"
              shape="deer"
              aura="grove"
              trail="none"
              evolve={false}
              stage="ethereal"
              extraMagical={false}
              size={220}
            />
            <figcaption className="mt-4 text-sm font-medium">
              Deer · Ethereal
            </figcaption>
          </figure>
          <figure className="rounded-[1.5rem] border border-white/10 bg-[#18181B] px-4 py-8 text-center">
            <Spark
              mood="idle"
              shape="deer"
              aura="grove"
              trail="none"
              evolve={false}
              stage="ethereal"
              extraMagical
              size={220}
            />
            <figcaption className="mt-4 text-sm font-medium">
              Deer · Extra Magical
            </figcaption>
          </figure>
        </div>
      </div>
    </div>
  );
}
