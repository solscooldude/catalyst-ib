"use client";

import { Spark } from "@/components/spark";
import { SPECIES_PALETTES, SPRITE_SPECIES } from "@/lib/sprite-species";
import { STUDY_STYLES, studyStyleResult } from "@/lib/study-style";

const SPECIES_AURA = {
  fox: "amber",
  bunny: "pearl",
  deer: "grove",
  cat: "magenta",
  axolotl: "hotpink",
  dragon: "mint",
} as const;

export default function SpriteLabPage() {
  const result = studyStyleResult("deep-dive");
  return (
    <div className="min-h-dvh bg-[#0B0B0F] px-5 py-10 text-zinc-50">
      <div className="mx-auto max-w-5xl">
        <p className="text-[11px] font-medium tracking-[0.18em] text-zinc-400 uppercase">
          Sprite animals
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">
          Growing · all six
        </h1>
        <p className="mt-2 text-sm text-zinc-400">
          Soft SVG animals. Natural fur, species noses, no cat heart mark.
        </p>
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {SPRITE_SPECIES.map((id) => (
            <figure
              key={id}
              className="rounded-[1.5rem] border border-white/10 bg-[#18181B] px-4 py-6 text-center"
            >
              <div className="flex justify-center">
                <Spark
                  mood="idle"
                  shape={id}
                  aura={SPECIES_AURA[id]}
                  trail="none"
                  evolve={false}
                  stage="growing"
                  size={132}
                />
              </div>
              <figcaption className="mt-3 text-sm font-medium">
                {SPECIES_PALETTES[id].label}
              </figcaption>
            </figure>
          ))}
        </div>

        <section className="mt-12 rounded-[1.75rem] border border-white/10 bg-[#18181B] px-6 py-10 sm:px-10">
          <p className="text-[11px] font-medium tracking-[0.18em] text-zinc-400 uppercase">
            Ethereal
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight">
            Cat · magenta / violet
          </h2>
          <p className="mt-2 text-sm text-zinc-400">
            Signature glow only. No heart painted on the body.
          </p>
          <div className="mt-6 flex justify-center">
            <Spark
              mood="idle"
              size={188}
              evolve={false}
              stage="ethereal"
              shape="cat"
              aura="magenta"
            />
          </div>
        </section>

        <section className="mt-12 rounded-[1.75rem] border border-white/10 bg-[#18181B] px-6 py-10 sm:px-10">
          <p className="text-[11px] font-medium tracking-[0.18em] text-zinc-400 uppercase">
            Quiz result
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight">
            {result.title}
          </h2>
          <p className="mt-2 text-sm font-medium text-[#5EEAD4]">
            {SPECIES_PALETTES[result.species].label} · {result.glowName} glow
          </p>
          <p className="mt-3 text-sm leading-relaxed text-zinc-400">
            {result.line}
          </p>
          <div className="mt-6 flex justify-center">
            <Spark
              mood="done"
              size={168}
              evolve={false}
              shape={result.species}
              aura={result.aura}
            />
          </div>
        </section>

        <section className="mt-10 text-sm text-zinc-500">
          <p className="font-medium text-zinc-300">All six results</p>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {STUDY_STYLES.map((id) => {
              const card = studyStyleResult(id);
              return (
                <li key={id}>
                  {card.title} — {SPECIES_PALETTES[card.species].label},{" "}
                  {card.glowName}
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </div>
  );
}
