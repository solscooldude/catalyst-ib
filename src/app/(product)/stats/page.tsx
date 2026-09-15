"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { TokenAmount } from "@/components/mint-chip";
import { CoreSubjects } from "@/components/core-subjects";
import { Spark } from "@/components/spark";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StudyCalendar } from "@/components/study-calendar";
import { StudyStartForm } from "@/components/study-start-form";
import { SUBJECTS } from "@/lib/constants";
import { ROUTES } from "@/lib/routes";
import {
  formatDuration,
  formatHours,
  logsInRange,
  monthlyRoundup,
  startOfMonth,
  startOfWeek,
  subjectStacks,
  weekLabel,
} from "@/lib/stats";
import { PageFrame } from "@/components/page-frame";
import { useCatalyst } from "@/lib/store";
import { cn } from "@/lib/utils";

export default function StatsPage() {
  const router = useRouter();
  const state = useCatalyst();
  const [range, setRange] = useState<"week" | "month">("month");

  useEffect(() => {
    if (state.hydrated && !state.setupComplete) {
      router.replace(ROUTES.setup);
    }
  }, [state.hydrated, state.setupComplete, router]);

  const [now] = useState(() => new Date());
  const roundup = monthlyRoundup(state.logs, now);
  const rangedLogs = logsInRange(
    state.logs,
    range === "week" ? startOfWeek(now) : startOfMonth(now),
    now,
  );
  const stacks = subjectStacks(rangedLogs);
  const maxMs = stacks[0]?.durationMs ?? 0;
  const recent = [...state.logs].reverse().slice(0, 8);

  if (!state.setupComplete) return null;

  return (
    <PageFrame>
      <div className="flux-card flex items-start justify-between gap-4 px-6 py-8 sm:px-8">
        <div>
          <p className="text-[11px] font-medium tracking-[0.18em] text-zinc-400 uppercase">
            Stats
          </p>
          <h1 className="mt-3 text-4xl text-foreground sm:text-5xl">
            Time by subject
          </h1>
        </div>
        <Spark
          mood="idle"
          subject={stacks[0]?.id ?? recent[0]?.subjectId}
          hint={
            stacks[0]?.label ??
            SUBJECTS.find((row) => row.id === recent[0]?.subjectId)?.label
          }
          size={88}
          pettable
          className="hidden shrink-0 sm:block"
        />
      </div>

      <CoreSubjects />

      <StudyCalendar logs={state.logs} now={now} />

      <section className="flux-card p-6 sm:p-8">
        <div>
          <p className="text-xs tracking-[0.16em] text-primary uppercase">
            Monthly roundup
          </p>
          <h2 className="mt-2 text-2xl text-foreground">{roundup.monthLabel}</h2>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <RoundupStat label="Time" value={formatHours(roundup.durationMs)} />
          <RoundupStat
            label="Top subject"
            value={roundup.topSubject?.label ?? "—"}
          />
          <RoundupStat label="Sessions" value={String(roundup.sessions)} />
          <RoundupStat
            label="Tokens"
            value={<TokenAmount value={roundup.tokensEarned} />}
          />
        </div>
      </section>

      <section className="flux-card p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg text-foreground">Subject stack</h2>
          <Tabs
            value={range}
            onValueChange={(value) => setRange(value as "week" | "month")}
          >
            <TabsList>
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="month">Month</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          {range === "week" ? weekLabel(now) : roundup.monthLabel}
        </p>
        {stacks.length === 0 ? (
          <p className="mt-6 rounded-2xl bg-muted/60 px-4 py-6 text-sm text-muted-foreground">
            No time in this range.
          </p>
        ) : (
          <ul className="mt-5 space-y-3">
            {stacks.map((row) => (
              <li key={row.id}>
                <div className="mb-1.5 flex items-baseline justify-between gap-3 text-sm">
                  <span className="text-foreground">{row.label}</span>
                  <span className="font-mono text-xs text-primary">
                    {formatDuration(row.durationMs)}
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
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

      <section id="study" className="flux-card p-6 sm:p-8">
        <h2 className="text-lg text-foreground">Start a study block</h2>
        <div className="mt-5">
          <StudyStartForm />
        </div>
      </section>

      <section className="flux-card p-6 sm:p-8">
        <h2 className="text-lg text-foreground">Recent</h2>
        {recent.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">
            Nothing logged yet.
          </p>
        ) : (
          <ul className="mt-4 space-y-2">
            {recent.map((log) => (
              <li
                key={log.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-muted/50 px-4 py-3 text-sm"
              >
                <div>
                  <p className="text-foreground">{log.subjectLabel}</p>
                  <p className="text-xs text-muted-foreground">
                    {log.kind === "verified" ? "Official task" : "Study block"}
                    {log.note ? ` · ${log.note}` : ""}
                  </p>
                </div>
                <div className="text-right font-mono text-xs text-primary">
                  <p>{formatDuration(log.durationMs)}</p>
                  <p className={cn(log.completionTokens ? "" : "text-muted-foreground")}>
                    +{log.timeTokens}
                    {log.completionTokens ? ` +${log.completionTokens}` : ""}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </PageFrame>
  );
}

function RoundupStat({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="rounded-2xl bg-background/60 px-3 py-3">
      <p className="text-[11px] tracking-[0.14em] text-muted-foreground uppercase">
        {label}
      </p>
      <div className="font-heading mt-1 truncate text-xl text-foreground">{value}</div>
    </div>
  );
}
