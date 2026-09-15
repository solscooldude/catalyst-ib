"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Spark } from "@/components/spark";
import { type SparkAct } from "@/lib/spark-play";
import { TokenAmount } from "@/components/mint-chip";
import { Button } from "@/components/ui/button";
import { pickQuiz, quizItemCaption, QUIZ_LENGTH } from "@/lib/care";
import { ROUTES } from "@/lib/routes";
import { PageFrame } from "@/components/page-frame";
import { scoreQuiz, useCatalyst } from "@/lib/store";

export default function QuizPage() {
  const state = useCatalyst();
  const items = useMemo(
    () => pickQuiz(state.profile.subjects, QUIZ_LENGTH),
    [state.profile.subjects],
  );
  const [index, setIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [done, setDone] = useState(
    state.quizDay !== null && state.quizDay === todayLocal(),
  );
  const [gained, setGained] = useState(0);
  const [mood, setMood] = useState<"idle" | "done" | "tempted">("idle");
  const [act, setAct] = useState<SparkAct>(null);

  const item = items[index];
  const already = state.quizDay === todayLocal();
  const caption = item ? quizItemCaption(item, state.profile.subjects) : null;

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
        setAct("celebrate");
        return;
      }
      setIndex((value) => value + 1);
      setPicked(null);
      setMood("idle");
    }, 700);
  }

  return (
    <PageFrame width="form">
      <div className="flux-card px-6 py-8 sm:px-8">
        <p className="text-[11px] font-medium tracking-[0.18em] text-zinc-400 uppercase">Quiz</p>
        <h1 className="mt-3 text-4xl text-foreground sm:text-5xl">
          Daily quiz
        </h1>
        <p className="mt-3 text-sm text-zinc-400">
          <TokenAmount value={1} /> each · once a day
        </p>
      </div>

      <div className="flex justify-center">
        <button
          type="button"
          className="border-0 bg-transparent p-0"
          aria-label="Replay Spark celebration"
          onClick={() => {
            if (done) setAct("celebrate");
          }}
        >
          <Spark mood={mood} size={160} pettable act={act} />
        </button>
      </div>

      {already && !done ? (
        <p className="text-sm text-muted-foreground">
          Already done today. Come back tomorrow. Last run: {state.quizCorrect}{" "}
          of {QUIZ_LENGTH} right.
        </p>
      ) : done ? (
        <div className="flux-card p-6">
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
        <div className="flux-card p-6">
          <p className="text-xs text-muted-foreground">
            {index + 1} / {items.length}
            {caption ? (
              <>
                {" "}
                · {caption.name}
                {caption.level ? ` · ${caption.level}` : ""} · {caption.topic}
              </>
            ) : null}
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
                  className="h-auto min-h-11 justify-start whitespace-normal rounded-full py-2.5 text-left"
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
    </PageFrame>
  );
}

function todayLocal() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}
