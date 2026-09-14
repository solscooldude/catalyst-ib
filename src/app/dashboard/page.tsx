"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Spark } from "@/components/spark";
import { TokenChip } from "@/components/token-chip";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import {
  formatHours,
  monthlyRoundup,
  startOfMonth,
  subjectStacks,
} from "@/lib/stats";
import { SUBJECTS } from "@/lib/constants";
import { useCatalyst } from "@/lib/store";

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
        </div>
        <Spark
          mood={session?.status === "focus" ? "locked" : "idle"}
          taskId={session?.taskId}
          subject={
            session ? undefined : (roundup.topSubject?.id ?? stacks[0]?.id)
          }
          hint={
            session
              ? undefined
              : (roundup.topSubject?.label ??
                SUBJECTS.find((row) => row.id === stacks[0]?.id)?.label)
          }
          size={56}
          className="hidden shrink-0 sm:block"
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
            <Link href={session.status === "locked" ? "/app/lock" : "/app/focus"}>
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
            <Link href="/app/setup">
              Open setup
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-3">
          <Button asChild className="h-11 rounded-full">
            <Link href="/app">
              Start focus
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-11 rounded-full">
            <Link href="/app/unlock">Unlock shop</Link>
          </Button>
          <Button asChild variant="outline" className="h-11 rounded-full">
            <Link href="/app/stats#log">Add study session</Link>
          </Button>
        </div>
      )}

      <section className="rounded-[2rem] bg-card p-6 ring-1 ring-white/6">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-xs tracking-[0.16em] text-primary uppercase">
              Monthly roundup
            </p>
            <h2 className="mt-2 text-2xl text-foreground">{roundup.monthLabel}</h2>
          </div>
          <Button asChild variant="ghost" size="sm">
            <Link href="/app/stats">Full stats</Link>
          </Button>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <MiniStat label="Time" value={formatHours(roundup.durationMs)} />
          <MiniStat label="Top subject" value={roundup.topSubject?.label ?? "—"} />
          <MiniStat label="Sessions" value={String(roundup.sessions)} />
          <MiniStat label="Tokens earned" value={String(roundup.tokensEarned)} />
        </div>
      </section>

      <section>
        <h2 className="text-lg text-foreground">Subject stack</h2>
        <p className="mt-1 text-xs text-muted-foreground">This month</p>
        {stacks.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">
            No minutes logged yet. Start a focus block or add a study session.
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
