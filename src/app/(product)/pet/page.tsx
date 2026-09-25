"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Spark } from "@/components/spark";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AXOLOTL_DRAGON_TIE,
  emptyPetScores,
  GENERIC_TIE_PROMPT,
  PET_QUIZ,
  petQuizOutcome,
  scorePetAnswer,
  SPECIES_REVEAL,
  type PetQuizScores,
} from "@/lib/pet-quiz";
import { ROUTES } from "@/lib/routes";
import { completePetQuiz, setSpriteSpecies } from "@/lib/store-core";
import {
  commitSpriteName,
  DEFAULT_SPRITE_NAME,
  displaySpriteName,
  SPRITE_NAME_MAX,
} from "@/lib/sprite-name";
import type { SpriteSpeciesId } from "@/lib/sprite-species";
import { useCatalyst } from "@/lib/store";
import { applyUiTheme, restoreStoredUiTheme } from "@/lib/ui-theme";
import { cn } from "@/lib/utils";

type Step =
  | { kind: "ask"; index: number }
  | { kind: "tie"; species: SpriteSpeciesId[]; special: boolean }
  | { kind: "reveal"; species: SpriteSpeciesId };

export default function PetQuizPage() {
  const router = useRouter();
  const state = useCatalyst();
  const [scores, setScores] = useState<PetQuizScores>(emptyPetScores);
  const [step, setStep] = useState<Step>({ kind: "ask", index: 0 });
  const [name, setName] = useState(() =>
    displaySpriteName(state.spriteName) === DEFAULT_SPRITE_NAME
      ? ""
      : displaySpriteName(state.spriteName),
  );

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
    if (state.petQuizComplete) {
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
      const species = outcome.species[0] ?? "fox";
      setSpriteSpecies(species);
      setStep({ kind: "reveal", species });
      return;
    }
    setStep({
      kind: "tie",
      species: outcome.species,
      special: outcome.kind === "axolotl-dragon",
    });
  }

  function pickSpecies(species: SpriteSpeciesId) {
    setSpriteSpecies(species);
    setStep({ kind: "reveal", species });
  }

  function continueSetup() {
    if (step.kind !== "reveal") return;
    completePetQuiz(step.species);
    const saved = commitSpriteName(name || DEFAULT_SPRITE_NAME);
    setName(saved);
    router.replace(ROUTES.profile);
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
              species={step.species}
              special={step.special}
              onPick={pickSpecies}
            />
          ) : null}
          {step.kind === "reveal" ? (
            <RevealStep
              species={step.species}
              name={name}
              onName={setName}
              onContinue={continueSetup}
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
          Your sprite
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
  species,
  special,
  onPick,
}: {
  species: SpriteSpeciesId[];
  special: boolean;
  onPick: (species: SpriteSpeciesId) => void;
}) {
  return (
    <>
      <p className="text-[11px] font-medium tracking-[0.18em] text-zinc-400 uppercase">
        Close call
      </p>
      <h1 className="mt-4 text-2xl font-semibold tracking-tight text-zinc-50 sm:text-3xl">
        {special ? AXOLOTL_DRAGON_TIE.prompt : GENERIC_TIE_PROMPT}
      </h1>
      <div className="mt-6 grid gap-2">
        {special
          ? AXOLOTL_DRAGON_TIE.options.map((row) => (
              <button
                key={row.species}
                type="button"
                onClick={() => onPick(row.species)}
                className="rounded-2xl border border-white/10 bg-[#0B0B0F] px-4 py-3 text-left text-sm text-zinc-200 hover:border-[#5EEAD4]/50"
              >
                {row.label}
              </button>
            ))
          : species.map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => onPick(id)}
                className="rounded-2xl border border-white/10 bg-[#0B0B0F] px-4 py-3 text-left hover:border-[#5EEAD4]/50"
              >
                <span className="block text-sm font-medium text-zinc-50">
                  {SPECIES_REVEAL[id].label}
                </span>
                <span className="mt-1 block text-xs text-zinc-400">
                  {SPECIES_REVEAL[id].line}
                </span>
              </button>
            ))}
      </div>
    </>
  );
}

function RevealStep({
  species,
  name,
  onName,
  onContinue,
}: {
  species: SpriteSpeciesId;
  name: string;
  onName: (value: string) => void;
  onContinue: () => void;
}) {
  const card = SPECIES_REVEAL[species];
  return (
    <>
      <p className="text-[11px] font-medium tracking-[0.18em] text-zinc-400 uppercase">
        Your sprite
      </p>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl">
        {card.label}
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-zinc-400">{card.line}</p>
      <div className="mt-6 flex justify-center">
        <Spark mood="done" size={168} evolve={false} />
      </div>
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
      <Button
        type="button"
        className={cn("mt-6 h-11 w-full rounded-full")}
        onClick={onContinue}
      >
        Set up account
      </Button>
    </>
  );
}
