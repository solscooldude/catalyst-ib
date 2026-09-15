"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Spark } from "@/components/spark";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/routes";
import { completeIntro, useCatalyst } from "@/lib/store";
import { applyUiTheme, restoreStoredUiTheme } from "@/lib/ui-theme";

const SLIDES = [
  {
    kicker: "The problem",
    title: "Apps eat the IB block.",
    body: "You sit down for ManageBac. Ten minutes later you are in a feed.",
  },
  {
    kicker: "The tool",
    title: "Catalyst holds the phone.",
    body: "You start a focus block. The apps you named wait until you end the session.",
  },
  {
    kicker: "Focus",
    title: "The timer counts up. You end it.",
    body: "No fake countdown. Stay as long as the work needs. Tokens tick while you stay.",
  },
  {
    kicker: "Sprite",
    title: "It starts as an egg.",
    body: "First real focus or snack hatches it. Then Hatchling → Luminary as you study. You still think about the next block because the sprite is waiting — not because of a pep talk.",
  },
  {
    kicker: "Tokens",
    title: "Earn time. Unlock a tier.",
    body: "Focus pays tokens. Spend them on Unlock Tier 2 or Unlock Tier 3 — the whole tier, not one app at a time.",
  },
  {
    kicker: "Ready",
    title: "Go to Home.",
    body: "Pick a task, start focus, hatch the egg.",
  },
] as const;

export default function IntroPage() {
  const router = useRouter();
  const state = useCatalyst();
  const [index, setIndex] = useState(0);

  useLayoutEffect(() => {
    applyUiTheme("dark", false);
    return () => restoreStoredUiTheme();
  }, []);

  useEffect(() => {
    if (state.hydrated && state.introSeen) {
      router.replace(state.setupComplete ? ROUTES.home : ROUTES.profile);
    }
  }, [state.hydrated, state.introSeen, state.setupComplete, router]);

  function finish() {
    completeIntro();
    router.replace(state.profile.complete ? ROUTES.home : ROUTES.profile);
  }

  const slide = SLIDES[index];
  const last = index === SLIDES.length - 1;

  return (
    <div className="fixed inset-0 z-20 bg-[#0B0B0F]">
      <div className="mx-auto flex min-h-dvh w-full max-w-lg flex-col justify-center px-5 py-12">
        <section className="rounded-[1.75rem] border border-white/10 bg-[#18181B] px-6 py-10 shadow-[0_24px_80px_rgba(0,0,0,0.45)] sm:px-10">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[11px] font-medium tracking-[0.18em] text-zinc-400 uppercase">
              {slide.kicker}
            </p>
            <p className="text-[11px] text-zinc-500">
              {index + 1} / {SLIDES.length}
            </p>
          </div>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl">
            {slide.title}
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-zinc-400">
            {slide.body}
          </p>
          {index === 3 ? (
            <div className="mt-6 flex justify-center">
              <Spark mood="idle" size={120} />
            </div>
          ) : null}
          <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              className="text-sm text-zinc-400 hover:text-zinc-100"
              onClick={finish}
            >
              Skip
            </button>
            <div className="flex gap-2">
              {index > 0 ? (
                <Button
                  type="button"
                  variant="outline"
                  className="h-11 rounded-full px-5"
                  onClick={() => setIndex((value) => value - 1)}
                >
                  Back
                </Button>
              ) : null}
              <Button
                type="button"
                className="h-11 rounded-full px-6"
                onClick={() => {
                  if (last) finish();
                  else setIndex((value) => value + 1);
                }}
              >
                {last ? "Get started" : "Next"}
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
