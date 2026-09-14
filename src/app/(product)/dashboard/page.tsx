"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Spark } from "@/components/spark";
import { CoreSubjects } from "@/components/core-subjects";
import { ScheduleStatus } from "@/components/schedule-status";
import { StudyCalendar } from "@/components/study-calendar";
import { TokenChip } from "@/components/token-chip";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import {
  formatHours,
  monthlyRoundup,
  sparkEvolution,
  sparkEvolutionLabel,
  startOfMonth,
  subjectStacks,
  verifiedStudyMs,
} from "@/lib/stats";
import { SUBJECTS } from "@/lib/constants";
import { motivationReady } from "@/lib/ib";
import { ROUTES } from "@/lib/routes";
import { sessionHint, useCatalyst } from "@/lib/store";

export default function DashboardPage() {
  const auth = useAuth();
  const state = useCatalyst();
  const [now] = useState(() => new Date());
  const roundup = monthlyRoundup(state.logs, now);
  const stacks = subjectStacks(
    state.logs.filter((log) => log.endedAt >= startOfMonth(now).getTime()),
  ).slice(0, 4);
  const maxMs = stacks[0]?.durationMs ?? 0;
  const session = state.session;
  const firstName = auth.user?.email.split("@")[0] ?? "there";
  const evo = sparkEvolution(state.logs);

  return (
    <div className="mx-auto w-full max-w-3xl space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs tracking-[0.2em] text-primary uppercase">
            Dashboard
          </p>
          <h1 className="mt-3 text-4xl text-foreground sm:text-5xl">
            Hi, {firstName}
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            {auth.user?.email} · demo account in this browser
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            Spark is {sparkEvolutionLabel(evo.stage)} ·{" "}
            {formatHours(verifiedStudyMs(state.logs))} official
          </p>
        </div>
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
          size={112}
          pettable
          className="shrink-0"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <TokenChip tokens={state.tokens} />
        <span className="text-sm text-muted-foreground">
          {formatHours(roundup.durationMs)} this month · {roundup.sessions}{" "}
          session{roundup.sessions === 1 ? "" : "s"}
        </span>
      </div>

      {session?.status === "locked" || session?.status === "focus" ? (
        <div className="rounded-3xl bg-card p-5 ring-1 ring-primary/25">
          <p className="text-xs tracking-[0.16em] text-primary uppercase">
            Session in progress
          </p>
          <p className="mt-2 text-sm text-foreground">
            {session.status === "locked"
              ? "Phone is locked. Return to the lock screen."
              : "A focus block is running."}
          </p>
          <Button asChild className="mt-4 h-10 rounded-full">
            <Link href={session.status === "locked" ? ROUTES.lock : ROUTES.session}>
              Continue
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      ) : null}

      {!state.setupComplete ? (
        <div className="rounded-3xl bg-card p-5 ring-1 ring-white/6">
          <p className="text-sm text-foreground">Finish setup to start focus.</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Pick a nemesis app and connect the mock ManageBac list.
          </p>
          <Button asChild className="mt-4 h-10 rounded-full">
            <Link href={ROUTES.setup}>
              Open setup
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-3">
          <Button asChild className="h-11 rounded-full">
            <Link href={ROUTES.focus}>
              Start focus
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-11 rounded-full">
            <Link href={ROUTES.unlocks}>Unlock shop</Link>
          </Button>
          <Button asChild variant="outline" className="h-11 rounded-full">
            <Link href={`${ROUTES.focus}#study`}>Start a study block</Link>
          </Button>
        </div>
      )}

      <CoreSubjects compact />

      <ScheduleStatus />

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-3xl bg-card p-5 ring-1 ring-white/6">
          <p className="text-xs tracking-[0.16em] text-primary uppercase">
            Profile
          </p>
          <p className="mt-2 text-sm text-foreground">
            {state.profile.complete
              ? `Class of ${state.profile.classYear} · ${state.profile.subjects.length} group subjects`
              : "Add your class year and six group subjects."}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            TOK and EE are already on this diploma.
          </p>
          <Button asChild variant="outline" className="mt-4 h-10 rounded-full">
            <Link href={ROUTES.profile}>
              {state.profile.complete ? "Edit profile" : "Finish profile"}
            </Link>
          </Button>
        </div>
        <div className="rounded-3xl bg-card p-5 ring-1 ring-white/6">
          <p className="text-xs tracking-[0.16em] text-primary uppercase">
            Motivation
          </p>
          <p className="mt-2 text-sm text-foreground">
            {motivationReady(state.motivation)
              ? state.motivation.colleges
              : "Write the colleges and the reason the phone stays locked."}
          </p>
          <Button asChild variant="outline" className="mt-4 h-10 rounded-full">
            <Link href={ROUTES.motivation}>
              {motivationReady(state.motivation) ? "Edit motivation" : "Add motivation"}
            </Link>
          </Button>
        </div>
      </div>

      <section className="rounded-[2rem] bg-card p-6 ring-1 ring-white/6">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-xs tracking-[0.16em] text-primary uppercase">
              Monthly roundup
            </p>
            <h2 className="mt-2 text-2xl text-foreground">{roundup.monthLabel}</h2>
          </div>
          <Button asChild variant="ghost" size="sm">
            <Link href={ROUTES.stats}>Full stats</Link>
          </Button>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <MiniStat label="Time" value={formatHours(roundup.durationMs)} />
          <MiniStat label="Top subject" value={roundup.topSubject?.label ?? "—"} />
          <MiniStat label="Sessions" value={String(roundup.sessions)} />
          <MiniStat label="Tokens earned" value={String(roundup.tokensEarned)} />
        </div>
      </section>

      <StudyCalendar logs={state.logs} now={now} />

      <section>
        <h2 className="text-lg text-foreground">Subject stack</h2>
        <p className="mt-1 text-xs text-muted-foreground">This month</p>
        {stacks.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">
            No minutes logged yet. Start a focus or study block.
          </p>
        ) : (
          <ul className="mt-4 space-y-3">
            {stacks.map((row) => (
              <li key={row.id}>
                <div className="mb-1.5 flex justify-between text-sm">
                  <span>{row.label}</span>
                  <span className="font-mono text-xs text-primary">
                    {formatHours(row.durationMs)}
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/6">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{
                      width: `${maxMs ? Math.max(6, (row.durationMs / maxMs) * 100) : 0}%`,
                    }}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-background/60 px-3 py-3">
      <p className="text-[11px] tracking-[0.14em] text-muted-foreground uppercase">
        {label}
      </p>
      <p className="mt-1 truncate text-sm text-foreground">{value}</p>
    </div>
  );
}
