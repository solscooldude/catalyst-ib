"use client";

import { Spark } from "@/components/spark";
import { SPECIES_PALETTES, SPRITE_SPECIES } from "@/lib/sprite-species";

export default function SpriteFacesPage() {
  return (
    <div className="min-h-dvh bg-[#0B0B0F] px-6 py-10 text-zinc-50">
      <div className="mx-auto max-w-5xl">
        <p className="text-[11px] font-medium tracking-[0.18em] text-zinc-400 uppercase">
          Face close-ups
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">
          Fox idle vs petted
        </h1>
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          <figure
            id="fox-idle-close"
            className="rounded-[1.75rem] border border-white/10 bg-[#18181B] px-4 pt-10 pb-5"
          >
            <div className="flex justify-center">
              <Spark
                mood="idle"
                shape="fox"
                aura="none"
                trail="none"
                evolve={false}
                stage="growing"
                size={280}
              />
            </div>
            <figcaption className="mt-2 text-center text-sm font-medium">
              Fox idle
            </figcaption>
          </figure>
          <figure
            id="fox-petted-close"
            className="rounded-[1.75rem] border border-white/10 bg-[#18181B] px-4 pt-10 pb-5"
          >
            <div className="flex justify-center">
              <Spark
                mood="done"
                shape="fox"
                aura="none"
                trail="none"
                evolve={false}
                stage="growing"
                size={280}
              />
            </div>
            <figcaption className="mt-2 text-center text-sm font-medium">
              Fox petted
            </figcaption>
          </figure>
        </div>

        <h2 className="mt-12 text-2xl font-semibold tracking-tight">
          Fox hats
        </h2>
        <p className="mt-2 text-sm text-zinc-400">
          Taller ears still clear a beanie, headphones, and the cap.
        </p>
        <div
          id="fox-hats"
          className="mt-6 grid grid-cols-3 gap-4"
        >
          {(
            [
              ["beanie", "Beanie"],
              ["phones", "Headphones"],
              ["cap", "Cap"],
            ] as const
          ).map(([gear, label]) => (
            <figure
              key={gear}
              className="rounded-[1.5rem] border border-white/10 bg-[#18181B] px-2 pt-8 pb-3"
            >
              <div className="flex justify-center">
                <Spark
                  mood="idle"
                  shape="fox"
                  gear={gear}
                  aura="none"
                  trail="none"
                  evolve={false}
                  stage="growing"
                  size={200}
                />
              </div>
              <figcaption className="mt-1 text-center text-sm font-medium">
                {label}
              </figcaption>
            </figure>
          ))}
        </div>

        <h2 className="mt-12 text-2xl font-semibold tracking-tight">
          Tuxedo cat
        </h2>
        <p className="mt-2 text-sm text-zinc-400">
          Black coat, white bib and blaze, pink nose on the muzzle. Magenta
          glow at Ethereal.
        </p>
        <div
          id="cat-tuxedo-close"
          className="mt-6 grid gap-4 sm:grid-cols-2"
        >
          <figure
            id="cat-growing-close"
            className="rounded-[1.5rem] border border-white/10 bg-[#18181B] px-2 pt-8 pb-3"
          >
            <div className="flex justify-center">
              <Spark
                mood="idle"
                shape="cat"
                aura="none"
                trail="none"
                evolve={false}
                stage="growing"
                size={260}
              />
            </div>
            <figcaption className="mt-1 text-center text-sm font-medium">
              Cat · Growing
            </figcaption>
          </figure>
          <figure
            id="cat-ethereal-close"
            className="rounded-[1.5rem] border border-white/10 bg-[#18181B] px-2 pt-8 pb-3"
          >
            <div className="flex justify-center">
              <Spark
                mood="idle"
                shape="cat"
                aura="magenta"
                trail="none"
                evolve={false}
                stage="ethereal"
                extraMagical
                size={260}
              />
            </div>
            <figcaption className="mt-1 text-center text-sm font-medium">
              Cat · Ethereal
            </figcaption>
          </figure>
        </div>

        <h2 className="mt-12 text-2xl font-semibold tracking-tight">
          Cat ears
        </h2>
        <p className="mt-2 text-sm text-zinc-400">
          Pointed ears stay on top of the head at every expression, with a
          pink inner and a light rim.
        </p>
        <div
          id="cat-ears-close"
          className="mt-6 grid gap-4 sm:grid-cols-2"
        >
          {(
            [
              ["idle", "Cat idle"],
              ["done", "Cat petted"],
              ["sleepy", "Cat sleepy"],
              ["annoyed", "Cat annoyed"],
            ] as const
          ).map(([mood, label]) => (
            <figure
              key={mood}
              className="rounded-[1.5rem] border border-white/10 bg-[#18181B] px-2 pt-8 pb-3"
            >
              <div className="flex justify-center">
                <Spark
                  mood={mood}
                  shape="cat"
                  aura="none"
                  trail="none"
                  evolve={false}
                  stage="growing"
                  size={240}
                />
              </div>
              <figcaption className="mt-1 text-center text-sm font-medium">
                {label}
              </figcaption>
            </figure>
          ))}
        </div>

        <h2 className="mt-12 text-2xl font-semibold tracking-tight">
          All six · idle
        </h2>
        <div
          id="faces-six-close"
          className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3"
        >
          {SPRITE_SPECIES.map((id) => (
            <figure
              key={id}
              className="rounded-[1.5rem] border border-white/10 bg-[#18181B]"
            >
              <div className="flex justify-center px-2 pt-8">
                <Spark
                  mood="idle"
                  shape={id}
                  aura="none"
                  trail="none"
                  evolve={false}
                  stage="growing"
                  size={200}
                />
              </div>
              <figcaption className="px-3 pb-3 text-center text-sm font-medium">
                {SPECIES_PALETTES[id].label}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </div>
  );
}
