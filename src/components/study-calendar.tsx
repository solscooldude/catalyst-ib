"use client";

import { formatDuration, studyDayBuckets } from "@/lib/stats";
import type { SessionLog } from "@/lib/store";
import { cn } from "@/lib/utils";

const WEEKDAYS = ["M", "T", "W", "T", "F", "S", "S"];

function intensity(durationMs: number, maxMs: number) {
  if (durationMs <= 0 || maxMs <= 0) return 0;
  const ratio = durationMs / maxMs;
  if (ratio > 0.75) return 4;
  if (ratio > 0.45) return 3;
  if (ratio > 0.2) return 2;
  return 1;
}

export function StudyCalendar({
  logs,
  weeks = 12,
  now = new Date(),
}: {
  logs: SessionLog[];
  weeks?: number;
  now?: Date;
}) {
  const days = studyDayBuckets(logs, weeks, now);
  const maxMs = days.reduce((max, day) => Math.max(max, day.durationMs), 0);
  const studied = days.filter((day) => day.durationMs > 0).length;
  const peak = days.reduce(
    (best, day) => (day.durationMs > best.durationMs ? day : best),
    days[0],
  );

  return (
    <section className="rounded-[2rem] bg-card p-6 ring-1 ring-white/6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs tracking-[0.16em] text-primary uppercase">
            Study calendar
          </p>
          <h2 className="mt-2 text-2xl text-foreground">Days you showed up</h2>
        </div>
        <p className="text-xs text-muted-foreground">
          {studied} study day{studied === 1 ? "" : "s"} · last {weeks} weeks
        </p>
      </div>

      {studied === 0 ? (
        <p className="mt-6 text-sm text-muted-foreground">
          No sessions in this stretch yet. Finish a focus block or log study
          time and the cells will fill in.
        </p>
      ) : (
        <p className="mt-3 text-sm text-muted-foreground">
          Strongest day:{" "}
          {peak?.date.toLocaleDateString([], {
            weekday: "short",
            month: "short",
            day: "numeric",
          })}{" "}
          · {formatDuration(peak?.durationMs ?? 0)}
        </p>
      )}

      <div className="mt-5 overflow-x-auto">
        <div className="grid w-fit grid-cols-7 gap-1.5">
          {WEEKDAYS.map((label, index) => (
            <span
              key={`${label}-${index}`}
              className="text-center text-[10px] text-muted-foreground"
            >
              {label}
            </span>
          ))}
          {days.map((day) => {
            const level = intensity(day.durationMs, maxMs);
            const label = day.date.toLocaleDateString([], {
              month: "short",
              day: "numeric",
            });
            return (
              <div
                key={day.key}
                title={
                  day.durationMs
                    ? `${label} · ${formatDuration(day.durationMs)} · ${day.sessions} session${day.sessions === 1 ? "" : "s"}`
                    : `${label} · no study`
                }
                className={cn(
                  "size-3.5 rounded-[5px] sm:size-4",
                  level === 0 && "bg-white/6",
                  level === 1 && "bg-primary/25",
                  level === 2 && "bg-primary/45",
                  level === 3 && "bg-primary/70",
                  level === 4 && "bg-primary",
                )}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
