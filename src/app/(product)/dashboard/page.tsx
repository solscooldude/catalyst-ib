"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Spark } from "@/components/spark";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import {
  formatHours,
  monthlyRoundup,
  sparkEvolution,
  sparkEvolutionLabel,
  subjectStacks,
  startOfMonth,
  verifiedStudyMs,
} from "@/lib/stats";
import { SUBJECTS } from "@/lib/constants";
import { ROUTES } from "@/lib/routes";
import { sessionHint, useCatalyst } from "@/lib/store";

export default function DashboardPage() {
  const auth = useAuth();
  const state = useCatalyst();
  const [now] = useState(() => new Date());
  const roundup = monthlyRoundup(state.logs, now);
  const stacks = subjectStacks(
    state.logs.filter((log) => log.endedAt >= startOfMonth(now).getTime()),
  );
  const session = state.session;
  const firstName = auth.user?.email.split("@")[0] ?? "there";
  const evo = sparkEvolution(state.logs);
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
    <div className="mx-auto w-full max-w-lg space-y-8">
      <section className="soft-panel px-6 py-10 sm:px-10">
        <div className="flex flex-col items-center text-center">
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
            size={200}
            pettable
          />
          <p className="mt-6 text-xs tracking-[0.2em] text-muted-foreground uppercase">
            Home
          </p>
          <h1 className="mt-2 text-4xl text-foreground sm:text-5xl">
            Hi, {firstName}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Spark is {sparkEvolutionLabel(evo.stage)}
          </p>
          <div className="mt-7 grid w-full grid-cols-2 gap-3">
            <QuietStat
              label="Streak"
              value={`${state.streakDays} day${state.streakDays === 1 ? "" : "s"}`}
            />
            <QuietStat
              label="Study time"
              value={formatHours(verifiedStudyMs(state.logs))}
            />
          </div>
          <Button asChild className="mt-8 h-11 rounded-full px-8">
            <Link href={continueHref}>
              {continueLabel}
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </section>

      {session?.status === "locked" || session?.status === "focus" ? (
        <p className="text-center text-sm text-muted-foreground">
          {session.status === "locked"
            ? "Phone is locked. Return to the lock screen when you are ready."
            : "A focus block is running."}
        </p>
      ) : null}

      <nav className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
        <Link href={ROUTES.quiz} className="hover:text-foreground">
          Quiz
        </Link>
        <Link href={ROUTES.stats} className="hover:text-foreground">
          Stats
        </Link>
        <Link href={ROUTES.schedule} className="hover:text-foreground">
          Schedule
        </Link>
        <Link href={ROUTES.profile} className="hover:text-foreground">
          Profile
        </Link>
        <Link href={ROUTES.motivation} className="hover:text-foreground">
          Motivation
        </Link>
      </nav>
    </div>
  );
}

function QuietStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-muted/70 px-4 py-3 text-left">
      <p className="text-[11px] tracking-[0.14em] text-muted-foreground uppercase">
        {label}
      </p>
      <p className="mt-1 text-sm text-foreground">{value}</p>
    </div>
  );
}
