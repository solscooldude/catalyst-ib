"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Clock3, Flame, Heart } from "lucide-react";
import { Spark } from "@/components/spark";
import { Button } from "@/components/ui/button";
import { SUBJECTS } from "@/lib/constants";
import { ROUTES } from "@/lib/routes";
import {
  formatClock,
  monthlyRoundup,
  sparkEvolution,
  startOfMonth,
  subjectStacks,
  todayStudyMs,
  weekDayMarks,
} from "@/lib/stats";
import { sessionHint, useCatalyst } from "@/lib/store";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  const state = useCatalyst();
  const [now] = useState(() => new Date());
  const roundup = monthlyRoundup(state.logs, now);
  const stacks = subjectStacks(
    state.logs.filter((log) => log.endedAt >= startOfMonth(now).getTime()),
  );
  const session = state.session;
  const evo = sparkEvolution(state.logs);
  const todayMs = todayStudyMs(state.logs, now);
  const week = weekDayMarks(state.logs, now);
  const dailyGoalMs = 2 * 60 * 60 * 1000;
  const progress = Math.min(1, todayMs / dailyGoalMs);
  const continueHref =
    session?.status === "locked"
      ? ROUTES.lock
      : session?.status === "focus"
        ? ROUTES.session
        : state.setupComplete
          ? ROUTES.focus
          : ROUTES.setup;
  const continueLabel =
    session?.status === "locked" || session?.status === "focus"
      ? "Continue"
      : state.setupComplete
        ? "Start focus"
        : "Finish setup";

  return (
    <div className="mx-auto w-full max-w-5xl space-y-4">
      <section className="flux-card px-6 py-8 sm:px-10 sm:py-10">
        <div className="grid items-center gap-8 sm:grid-cols-[1fr_auto]">
          <div>
            <p className="text-[11px] font-medium tracking-[0.18em] text-zinc-400 uppercase">
              Current sprite
            </p>
            <h1 className="mt-3 text-5xl font-semibold tracking-tight text-foreground sm:text-6xl">
              Spark
            </h1>
            <p className="mt-3 max-w-sm text-sm leading-6 text-zinc-400">
              Your focus buddy. Soft glow, calm energy
              {evo.stage === "ember" ? "." : ` · ${evo.stage} from official hours.`}
            </p>
            <Button
              asChild
              className="mt-7 h-11 rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground shadow-none hover:bg-primary/85"
            >
              <Link href={continueHref}>
                <Heart className="size-4 fill-current" />
                {continueLabel}
              </Link>
            </Button>
          </div>
          <div className="flex justify-center sm:justify-end">
            <Spark
              mood={session?.status === "focus" ? "locked" : "idle"}
              taskId={session?.taskId}
              subject={
                session?.subjectId ?? roundup.topSubject?.id ?? stacks[0]?.id
              }
              hint={
                session
                  ? sessionHint(session)
                  : (roundup.topSubject?.label ??
                    SUBJECTS.find((row) => row.id === stacks[0]?.id)?.label)
              }
              size={196}
              pettable
            />
          </div>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        <section className="flux-card px-6 py-6">
          <p className="inline-flex items-center gap-2 text-[11px] font-medium tracking-[0.16em] text-zinc-400 uppercase">
            <Flame className="size-3.5 text-primary" />
            Focus streak
          </p>
          <p className="mt-3 text-4xl font-semibold tracking-tight text-foreground">
            {state.streakDays} day{state.streakDays === 1 ? "" : "s"}
          </p>
          <div className="mt-4 flex items-center justify-between gap-3">
            <p className="text-sm text-zinc-400">
              {state.streakDays > 0 ? "Keep it going!" : "Log in after a session."}
            </p>
            <div className="flex items-center gap-1.5">
              {week.map((day) => (
                <span
                  key={day.key}
                  className={cn(
                    "flex size-5 items-center justify-center rounded-full",
                    day.studied
                      ? "bg-primary text-primary-foreground"
                      : "bg-zinc-100 dark:bg-zinc-800",
                  )}
                  aria-label={day.studied ? "Studied" : "No session"}
                >
                  {day.studied ? <Check className="size-3" strokeWidth={3} /> : null}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="flux-card px-6 py-6">
          <p className="inline-flex items-center gap-2 text-[11px] font-medium tracking-[0.16em] text-zinc-400 uppercase">
            <Clock3 className="size-3.5 text-primary" />
            Today’s study time
          </p>
          <p className="mt-3 text-4xl font-semibold tracking-tight text-foreground">
            {formatClock(todayMs)}
          </p>
          <div className="mt-4 flex items-center justify-between gap-4">
            <p className="text-sm text-zinc-400">
              {todayMs > 0 ? "Nice progress today" : "No official minutes yet"}
            </p>
            <div className="h-1.5 w-28 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${Math.max(todayMs > 0 ? 8 : 0, progress * 100)}%` }}
              />
            </div>
          </div>
        </section>
      </div>

      {session?.status === "locked" || session?.status === "focus" ? (
        <p className="px-2 text-sm text-zinc-400">
          {session.status === "locked"
            ? "Phone is locked. Return to the lock screen when you are ready."
            : "A focus block is running."}
        </p>
      ) : null}

    </div>
  );
}
