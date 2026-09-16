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
    kicker: "Welcome",
    title: "Welcome to Catalyst, let's get started",
    body: "A short tour of why this exists, then you finish your account — profile and after-school lock hours — before Home.",
  },
  {
    kicker: "The problem",
    title: "The problem",
    body: "A lot of IB students struggle with procrastination, constant phone distractions, passive scrolling on other devices, or with staying motivated during intense workloads like IAs, TOK essays, or the full IB grind.",
  },
  {
    kicker: "The tool",
    title: "The tool",
    body: "An AI-powered productivity app that rewards verified active work (not just absence from phone) with a gamified token economy.",
  },
  {
    kicker: "Focus",
    title: "Focus",
    body: "Your time to complete your work, log your time and earn tokens for studying.",
  },
  {
    kicker: "Sprite",
    title: "Sprite",
    body: "Your sprite will hatch now with a task completed or by feeding it, keep it growing by studying.",
  },
  {
    kicker: "Tokens",
    title: "Tokens",
    body: "Tokens allow you to unlock your app tiers. More studying = more tokens.",
  },
  {
    kicker: "Account",
    title: "Finish setting up account",
    body: "Next: your IB profile and required lock hours. Default after-school window is 4:30–7:30. You can change it. Then you land on Home.",
  },
] as const;

function nextAfterIntro(state: {
  profile: { complete: boolean };
  schedule: unknown[];
}) {
  return state.profile.complete && state.schedule.length > 0
    ? ROUTES.home
    : ROUTES.profile;
}

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
      router.replace(nextAfterIntro(state));
    }
  }, [state.hydrated, state.introSeen, state.profile.complete, state.schedule.length, router]);

  function finish() {
    completeIntro();
    router.replace(nextAfterIntro(state));
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
          {index === 4 ? (
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
                {last ? "Set up account" : "Next"}
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
