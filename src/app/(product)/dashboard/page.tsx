"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Check, Clock3, Flame, Heart, Minus, Plus } from "lucide-react";
import { SparkleMark } from "@/components/brand-marks";
import { QuietHoursChip } from "@/components/quiet-hours-chip";
import { Spark, type SparkMood } from "@/components/spark";
import { UnlockPanel } from "@/components/unlock-panel";
import { Button } from "@/components/ui/button";
import { SUBJECTS, type SubjectId, type TaskId } from "@/lib/constants";
import { ROUTES } from "@/lib/routes";
import { catchSparkToken } from "@/lib/spark-gift";
import { careMood, type SparkAct } from "@/lib/spark-play";
import {
  formatClock,
  monthlyRoundup,
  sparkEvolutionFromState,
  sparkEvolutionLabel,
  startOfMonth,
  subjectStacks,
  todayStudyMs,
  weekDayMarks,
} from "@/lib/stats";
import { displaySpriteName } from "@/lib/sprite-name";
import { PageFrame } from "@/components/page-frame";
import { WeekStoryShareDialog } from "@/components/week-story-share";
import { sessionHint, setDailyGoalMinutes, useCatalyst } from "@/lib/store";
import {
  DAILY_GOAL_STEP_MINUTES,
  MAX_DAILY_GOAL_MINUTES,
  MIN_DAILY_GOAL_MINUTES,
  formatDailyGoal,
} from "@/lib/daily-goal";
import { buildWeekStory } from "@/lib/week-story";
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
  const [storyNow] = useState(() => new Date());

  useEffect(() => {
    const tick = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(tick);
  }, []);
  const story = useMemo(
    () =>
      buildWeekStory(
        state.logs,
        state.streakDays,
        displaySpriteName(state.spriteName),
        storyNow,
      ),
    [state.logs, state.streakDays, state.spriteName, storyNow],
  );
  const roundup = monthlyRoundup(state.logs, now);
  const stacks = subjectStacks(
    state.logs.filter((log) => log.endedAt >= startOfMonth(now).getTime()),
  );
  const session = state.session;
  const evo = sparkEvolutionFromState(state);
  const todayMs = todayStudyMs(state.logs, now);
  const week = weekDayMarks(state.logs, now);
  const dailyGoalMs = state.dailyGoalMinutes * 60 * 1000;
  const progress = Math.min(1, todayMs / dailyGoalMs);
  const continueHref =
    session?.status === "locked" || session?.status === "focus"
      ? ROUTES.session
      : state.setupComplete
        ? ROUTES.focus
        : ROUTES.setup;
  const lastDone = state.logs[state.logs.length - 1];
  const continueLabel =
    session?.status === "locked" || session?.status === "focus"
      ? "Continue"
      : state.setupComplete
        ? "Start focus"
        : "Finish setup";

  return (
    <PageFrame>
      <div className="flex flex-wrap items-end justify-between gap-3 px-1 pt-1">
        <p className="font-heading text-2xl text-foreground sm:text-3xl">
          {greeting(now)}.
        </p>
        <WeekStoryShareDialog story={story} />
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.2fr_0.9fr_0.9fr]">
        <section className="flux-card px-6 py-8 sm:px-8">
          <p className="text-[11px] font-medium tracking-[0.18em] text-zinc-400 uppercase">
            Current sprite
          </p>
          <div className="mt-3 flex items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl tracking-tight text-foreground sm:text-5xl">
                {displaySpriteName(state.spriteName)}
              </h1>
              {state.careStage === "egg" ? null : (
                <p className="mt-2 max-w-[14rem] text-sm text-zinc-400">
                  {sparkEvolutionLabel(state.careStage)}
                </p>
              )}
              <Button
                asChild
                className="mt-5 h-11 rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground shadow-none hover:bg-primary/85"
              >
                <Link href={ROUTES.sprite}>
                  <Heart className="size-4 fill-current" />
                  My Sprite
                </Link>
              </Button>
            </div>
            <HomeSpark
              mood={
                session?.status === "focus"
                  ? "locked"
                  : lastDone && Date.now() - lastDone.endedAt < 30 * 60 * 1000
                    ? "done"
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
              celebrate={Boolean(
                lastDone && Date.now() - lastDone.endedAt < 30 * 60 * 1000,
              )}
            />
          </div>
        </section>

        <section className="flux-card px-6 py-8">
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

        <section className="flux-card px-6 py-8">
          <p className="inline-flex items-center gap-2 text-[11px] font-medium tracking-[0.16em] text-zinc-400 uppercase">
            <Clock3 className="size-3.5 text-primary" />
            Study time
          </p>
          <p className="font-heading mt-3 text-4xl tracking-tight text-foreground">
            {formatClock(todayMs)}
          </p>
          <p className="mt-2 text-sm text-zinc-500">
            Goal {formatDailyGoal(state.dailyGoalMinutes)}
          </p>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
            <div
              className="h-full rounded-full bg-primary"
              style={{ width: `${Math.max(todayMs > 0 ? 8 : 0, progress * 100)}%` }}
            />
          </div>
          <div className="mt-4 flex items-center gap-2">
            <button
              type="button"
              className="inline-flex size-9 items-center justify-center rounded-full ring-1 ring-border text-foreground disabled:opacity-40"
              aria-label="Lower daily goal"
              disabled={state.dailyGoalMinutes <= MIN_DAILY_GOAL_MINUTES}
              onClick={() =>
                setDailyGoalMinutes(state.dailyGoalMinutes - DAILY_GOAL_STEP_MINUTES)
              }
            >
              <Minus className="size-4" />
            </button>
            <span className="min-w-[4.5rem] text-center text-sm text-foreground">
              {formatDailyGoal(state.dailyGoalMinutes)}
            </span>
            <button
              type="button"
              className="inline-flex size-9 items-center justify-center rounded-full ring-1 ring-border text-foreground disabled:opacity-40"
              aria-label="Raise daily goal"
              disabled={state.dailyGoalMinutes >= MAX_DAILY_GOAL_MINUTES}
              onClick={() =>
                setDailyGoalMinutes(state.dailyGoalMinutes + DAILY_GOAL_STEP_MINUTES)
              }
            >
              <Plus className="size-4" />
            </button>
          </div>
          <Button
            asChild
            className="mt-5 h-11 w-full rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground shadow-none hover:bg-primary/85"
          >
            <Link href={continueHref}>{continueLabel}</Link>
          </Button>
        </section>
      </div>

      <section id="unlocks" className="flux-card scroll-mt-24 px-6 py-8 sm:px-8">
        <UnlockPanel />
      </section>

      <QuietHoursChip />
    </PageFrame>
  );
}

function HomeSpark({
  mood,
  taskId,
  subject,
  hint,
  celebrate,
}: {
  mood: SparkMood;
  taskId?: TaskId;
  subject?: SubjectId;
  hint?: string;
  celebrate: boolean;
}) {
  const [act, setAct] = useState<SparkAct>(celebrate ? "celebrate" : null);
  const [star, setStar] = useState<{ left: number } | null>(null);

  useEffect(() => {
    if (celebrate) setAct("celebrate");
  }, [celebrate]);

  useEffect(() => {
    const first = window.setTimeout(spawn, 9000);
    const beat = window.setInterval(spawn, 22000);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(beat);
    };
  }, []);

  function spawn() {
    setStar({ left: 18 + Math.random() * 54 });
    window.setTimeout(() => setStar(null), 3400);
  }

  return (
    <div className="relative" onClick={() => celebrate && setAct("celebrate")}>
      <Spark
        mood={mood}
        taskId={taskId}
        subject={subject}
        hint={hint}
        size={132}
        pettable
        act={act}
      />
      {star ? (
        <button
          type="button"
          aria-label="Catch a token"
          className="sprite-catch-star"
          style={{ left: `${star.left}%`, top: "4%" }}
          onClick={() => {
            catchSparkToken();
            setStar(null);
          }}
        >
          <SparkleMark size={18} />
        </button>
      ) : null}
    </div>
  );
}
