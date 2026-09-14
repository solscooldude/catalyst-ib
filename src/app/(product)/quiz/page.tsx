"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Spark } from "@/components/spark";
import { TokenAmount } from "@/components/mint-chip";
import { Button } from "@/components/ui/button";
import { pickQuiz } from "@/lib/care";
import { ROUTES } from "@/lib/routes";
import { scoreQuiz, useCatalyst } from "@/lib/store";

export default function QuizPage() {
  const state = useCatalyst();
  const items = useMemo(
    () => pickQuiz(state.profile.subjects, 3),
    [state.profile.subjects],
  );
  const [index, setIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [done, setDone] = useState(state.quizDay !== null && state.quizDay === todayLocal());
  const [gained, setGained] = useState(0);
  const [mood, setMood] = useState<"idle" | "done" | "tempted">("idle");

  const item = items[index];
  const already = state.quizDay === todayLocal();

  function choose(choice: number) {
    if (picked !== null || already) return;
    setPicked(choice);
    const ok = choice === item.answer;
    setMood(ok ? "done" : "tempted");
    const nextCorrect = correct + (ok ? 1 : 0);
    setCorrect(nextCorrect);
    window.setTimeout(() => {
      if (index + 1 >= items.length) {
        const result = scoreQuiz(nextCorrect);
        setGained(result.ok ? result.gained : 0);
        setDone(true);
        return;
      }
      setIndex((value) => value + 1);
      setPicked(null);
      setMood("idle");
    }, 700);
  }

  return (
    <div className="mx-auto w-full max-w-2xl space-y-8">
      <div>
        <p className="text-xs tracking-[0.2em] text-primary uppercase">Quiz</p>
        <h1 className="mt-3 text-4xl text-foreground sm:text-5xl">
          Three quick checks.
        </h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Drawn from your IB subjects. Right answers pay{" "}
          <TokenAmount value={1} /> each. Once a day.
        </p>
      </div>

      <div className="flex justify-center">
        <Spark mood={mood} size={160} pettable />
      </div>

      {already && !done ? (
        <p className="text-sm text-muted-foreground">
          Already done today. Come back tomorrow. Last run: {state.quizCorrect}{" "}
          right.
        </p>
      ) : done ? (
        <div className="rounded-3xl bg-card p-6 ring-1 ring-white/6">
          <p className="text-lg text-foreground">
            {correct} of {items.length} right.
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            {gained > 0 ? (
              <>
                Paid <TokenAmount value={gained} />.
              </>
            ) : (
              "Tokens already counted for today."
            )}
          </p>
          <Button asChild className="mt-5 h-10 rounded-full">
            <Link href={ROUTES.sprite}>Back to My Sprite</Link>
          </Button>
        </div>
      ) : item ? (
        <div className="rounded-3xl bg-card p-6 ring-1 ring-white/6">
          <p className="text-xs text-muted-foreground">
            {index + 1} / {items.length}
          </p>
          <p className="mt-2 text-lg text-foreground">{item.prompt}</p>
          <div className="mt-5 grid gap-2">
            {item.choices.map((choice, choiceIndex) => {
              const show = picked !== null;
              const right = choiceIndex === item.answer;
              return (
                <Button
                  key={choice}
                  type="button"
                  variant={show && right ? "default" : "outline"}
                  className="h-11 justify-start rounded-full"
                  disabled={picked !== null}
                  onClick={() => choose(choiceIndex)}
                >
                  {choice}
                </Button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function todayLocal() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}
