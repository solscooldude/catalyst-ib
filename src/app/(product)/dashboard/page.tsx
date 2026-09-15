"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Check, Clock3, Flame, Heart } from "lucide-react";
import { QuietHoursChip } from "@/components/quiet-hours-chip";
import { Spark } from "@/components/spark";
import { UnlockPanel } from "@/components/unlock-panel";
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
import { careMood } from "@/lib/spark-play";
import { displaySpriteName } from "@/lib/sprite-name";
import { sessionHint, useCatalyst } from "@/lib/store";
import { cn } from "@/lib/utils";

function greeting(now: Date) {
  const hour = now.getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export default function DashboardPage() {
  const state = useCatalyst();
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const tick = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(tick);
  }, []);
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
      <p className="font-heading px-1 text-2xl text-foreground sm:text-3xl">
        {greeting(now)}.
      </p>

      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.9fr_0.9fr]">
        <section className="flux-card px-6 py-7 sm:px-8">
          <p className="text-[11px] font-medium tracking-[0.18em] text-zinc-400 uppercase">
            Current sprite
          </p>
          <div className="mt-3 flex items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl tracking-tight text-foreground sm:text-5xl">
                {displaySpriteName(state.spriteName)}
              </h1>
              {evo.stage === "ember" ? null : (
                <p className="mt-2 max-w-[14rem] text-sm text-zinc-400">
                  {evo.stage}
                </p>
              )}
              <Button
                asChild
                className="mt-5 h-11 rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground shadow-none hover:bg-primary/85"
              >
                <Link href={continueHref}>
                  <Heart className="size-4 fill-current" />
                  {continueLabel}
                </Link>
              </Button>
            </div>
            <Spark
              mood={
                session?.status === "focus"
                  ? "locked"
                  : careMood(state.streakDays, todayMs)
              }
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
              size={132}
              pettable
            />
          </div>
        </section>

        <section className="flux-card px-6 py-7">
          <p className="inline-flex items-center gap-2 text-[11px] font-medium tracking-[0.16em] text-zinc-400 uppercase">
            <Flame className="size-3.5 text-primary" />
            Streak
          </p>
          <p className="font-heading mt-3 text-4xl tracking-tight text-foreground">
            {state.streakDays} day{state.streakDays === 1 ? "" : "s"}
          </p>
          <div className="mt-5 flex items-center gap-1.5">
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
        </section>

        <section className="flux-card px-6 py-7">
          <p className="inline-flex items-center gap-2 text-[11px] font-medium tracking-[0.16em] text-zinc-400 uppercase">
            <Clock3 className="size-3.5 text-primary" />
            Study time
          </p>
          <p className="font-heading mt-3 text-4xl tracking-tight text-foreground">
            {formatClock(todayMs)}
          </p>
          <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
            <div
              className="h-full rounded-full bg-primary"
              style={{ width: `${Math.max(todayMs > 0 ? 8 : 0, progress * 100)}%` }}
            />
          </div>
        </section>
      </div>

      <QuietHoursChip />

      <section className="flux-card px-6 py-6">
        <UnlockPanel />
      </section>
    </div>
  );
}
