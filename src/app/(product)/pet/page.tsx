"use client";

import { Suspense, useEffect, useLayoutEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Spark } from "@/components/spark";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DRAIN_TIE,
  emptyPetScores,
  GENERIC_TIE_PROMPT,
  PET_QUIZ,
  petQuizOutcome,
  scorePetAnswer,
  type PetQuizScores,
} from "@/lib/pet-quiz";
import { ROUTES } from "@/lib/routes";
import { completePetQuiz } from "@/lib/store-core";
import {
  commitSpriteName,
  DEFAULT_SPRITE_NAME,
  displaySpriteName,
  SPRITE_NAME_MAX,
} from "@/lib/sprite-name";
import { SPECIES_PALETTES } from "@/lib/sprite-species";
import { studyStyleResult, type StudyStyleId } from "@/lib/study-style";
import { useCatalyst } from "@/lib/store";
import { applyUiTheme, restoreStoredUiTheme } from "@/lib/ui-theme";
import { cn } from "@/lib/utils";

type Step =
  | { kind: "ask"; index: number }
  | { kind: "tie"; styles: StudyStyleId[]; special: boolean }
  | { kind: "reveal"; style: StudyStyleId };

export default function PetQuizRoute() {
  return (
    <Suspense fallback={null}>
      <PetQuizPage />
    </Suspense>
  );
}

function PetQuizPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const state = useCatalyst();
  const retake = searchParams.get("retake") === "1";
  const [scores, setScores] = useState<PetQuizScores>(emptyPetScores);
  const [step, setStep] = useState<Step>({ kind: "ask", index: 0 });
  const [name, setName] = useState(() =>
    displaySpriteName(state.spriteName) === DEFAULT_SPRITE_NAME
      ? ""
      : displaySpriteName(state.spriteName),
  );
  const [applyLook, setApplyLook] = useState(!retake);

  useLayoutEffect(() => {
    applyUiTheme("dark", false);
    return () => restoreStoredUiTheme();
  }, []);

  useEffect(() => {
    if (!state.hydrated) return;
    if (!state.introSeen) {
      router.replace(ROUTES.intro);
      return;
    }
    if (state.petQuizComplete && !retake) {
      router.replace(
        state.profile.complete && state.schedule.length > 0
          ? ROUTES.home
          : ROUTES.profile,
      );
    }
  }, [
    state.hydrated,
    state.introSeen,
    state.petQuizComplete,
    state.profile.complete,
    state.schedule.length,
    retake,
    router,
  ]);

  function finishQuestion(optionIndex: number, index: number) {
    const nextScores = scorePetAnswer(scores, index, optionIndex);
    setScores(nextScores);
    if (index + 1 < PET_QUIZ.length) {
      setStep({ kind: "ask", index: index + 1 });
      return;
    }
    const outcome = petQuizOutcome(nextScores);
    if (outcome.kind === "winner") {
      const style = outcome.styles[0] ?? "bold-challenge";
      setStep({ kind: "reveal", style });
      return;
    }
    setStep({
      kind: "tie",
      styles: outcome.styles,
      special: outcome.kind === "drain-tie",
    });
  }

  function pickStyle(style: StudyStyleId) {
    setStep({ kind: "reveal", style });
  }

  function continueSetup() {
    if (step.kind !== "reveal") return;
    completePetQuiz(step.style, {
      applyGlow: retake ? applyLook : true,
      applyShape: retake ? applyLook : true,
    });
    if (!retake) {
      const saved = commitSpriteName(name || DEFAULT_SPRITE_NAME);
      setName(saved);
    }
    router.replace(retake ? ROUTES.settings : ROUTES.profile);
  }

  return (
    <div className="fixed inset-0 z-20 bg-[#0B0B0F]">
      <div className="mx-auto flex min-h-dvh w-full max-w-lg flex-col justify-center px-5 py-12">
        <section className="rounded-[1.75rem] border border-white/10 bg-[#18181B] px-6 py-10 shadow-[0_24px_80px_rgba(0,0,0,0.45)] sm:px-10">
          {step.kind === "ask" ? (
            <AskStep
              index={step.index}
              onPick={(optionIndex) => finishQuestion(optionIndex, step.index)}
            />
          ) : null}
          {step.kind === "tie" ? (
            <TieStep
              styles={step.styles}
              special={step.special}
              onPick={pickStyle}
            />
          ) : null}
          {step.kind === "reveal" ? (
            <RevealStep
              style={step.style}
              name={name}
              onName={setName}
              showName={!retake}
              applyLook={applyLook}
              onApplyLook={setApplyLook}
              confirmLook={retake}
              onContinue={continueSetup}
              continueLabel={retake ? "Save result" : "Set up account"}
            />
          ) : null}
        </section>
      </div>
    </div>
  );
}

function AskStep({
  index,
  onPick,
}: {
  index: number;
  onPick: (optionIndex: number) => void;
}) {
  const question = PET_QUIZ[index];
  if (!question) return null;
  return (
    <>
      <div className="flex items-center justify-between gap-3">
        <p className="text-[11px] font-medium tracking-[0.18em] text-zinc-400 uppercase">
          Your study vibe
        </p>
        <p className="text-[11px] text-zinc-500">
          {index + 1} / {PET_QUIZ.length}
        </p>
      </div>
      <h1 className="mt-4 text-2xl font-semibold tracking-tight text-zinc-50 sm:text-3xl">
        {question.prompt}
      </h1>
      <div className="mt-6 grid gap-2">
        {question.options.map((option, optionIndex) => (
          <button
            key={option.letter}
            type="button"
            onClick={() => onPick(optionIndex)}
            className="flex gap-3 rounded-2xl border border-white/10 bg-[#0B0B0F] px-4 py-3 text-left text-sm leading-relaxed text-zinc-200 hover:border-[#5EEAD4]/50 hover:text-zinc-50"
          >
            <span className="font-medium text-[#5EEAD4]">{option.letter}</span>
            <span>{option.text}</span>
          </button>
        ))}
      </div>
    </>
  );
}

function TieStep({
  styles,
  special,
  onPick,
}: {
  styles: StudyStyleId[];
  special: boolean;
  onPick: (style: StudyStyleId) => void;
}) {
  return (
    <>
      <p className="text-[11px] font-medium tracking-[0.18em] text-zinc-400 uppercase">
        Close call
      </p>
      <h1 className="mt-4 text-2xl font-semibold tracking-tight text-zinc-50 sm:text-3xl">
        {special ? DRAIN_TIE.prompt : GENERIC_TIE_PROMPT}
      </h1>
      <div className="mt-6 grid gap-2">
        {special
          ? DRAIN_TIE.options.map((row) => (
              <button
                key={row.style}
                type="button"
                onClick={() => onPick(row.style)}
                className="rounded-2xl border border-white/10 bg-[#0B0B0F] px-4 py-3 text-left text-sm text-zinc-200 hover:border-[#5EEAD4]/50"
              >
                {row.label}
              </button>
            ))
          : styles.map((id) => {
              const card = studyStyleResult(id);
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => onPick(id)}
                  className="rounded-2xl border border-white/10 bg-[#0B0B0F] px-4 py-3 text-left hover:border-[#5EEAD4]/50"
                >
                  <span className="block text-sm font-medium text-zinc-50">
                    {card.title}
                  </span>
                  <span className="mt-1 block text-xs text-zinc-400">
                    {card.line}
                  </span>
                </button>
              );
            })}
      </div>
    </>
  );
}

function RevealStep({
  style,
  name,
  onName,
  showName,
  applyLook,
  onApplyLook,
  confirmLook,
  onContinue,
  continueLabel,
}: {
  style: StudyStyleId;
  name: string;
  onName: (value: string) => void;
  showName: boolean;
  applyLook: boolean;
  onApplyLook: (value: boolean) => void;
  confirmLook: boolean;
  onContinue: () => void;
  continueLabel: string;
}) {
  const card = studyStyleResult(style);
  return (
    <>
      <p className="text-[11px] font-medium tracking-[0.18em] text-zinc-400 uppercase">
        Your sprite
      </p>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl">
        {card.title}
      </h1>
      <p className="mt-2 text-sm font-medium text-[#5EEAD4]">
        {SPECIES_PALETTES[card.species].label} · {card.glowName} glow
      </p>
      <p className="mt-3 text-sm leading-relaxed text-zinc-400">{card.line}</p>
      <div className="mt-6 flex justify-center">
        <Spark
          mood="done"
          size={168}
          evolve={false}
          shape={card.species}
          aura={card.aura}
        />
      </div>
      {confirmLook ? (
        <label className="mt-6 flex items-start gap-3 text-sm text-zinc-300">
          <input
            type="checkbox"
            checked={applyLook}
            onChange={(event) => onApplyLook(event.target.checked)}
            className="mt-1 size-4 accent-[#5EEAD4]"
          />
          <span>
            Also switch my animal to {SPECIES_PALETTES[card.species].label} and
            my glow to {card.glowName}. Leave unchecked to keep the look you
            already have — the title still updates.
          </span>
        </label>
      ) : null}
      {showName ? (
        <div className="mt-6 space-y-2">
          <Label htmlFor="pet-sprite-name" className="text-zinc-300">
            Name your sprite
          </Label>
          <Input
            id="pet-sprite-name"
            value={name}
            maxLength={SPRITE_NAME_MAX}
            placeholder={DEFAULT_SPRITE_NAME}
            onChange={(event) => onName(event.target.value)}
            className="h-11 border-white/10 bg-[#0B0B0F] text-zinc-50"
          />
        </div>
      ) : null}
      <Button
        type="button"
        className={cn("mt-6 h-11 w-full rounded-full")}
        onClick={onContinue}
      >
        {continueLabel}
      </Button>
    </>
  );
}
