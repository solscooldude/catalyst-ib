"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { PhoneLock } from "@/components/phone-lock";
import { DemoBadge } from "@/components/demo-badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ROUTES } from "@/lib/routes";
import {
  WEEKDAYS,
  AFTER_SCHOOL_PRESET,
  activeWindow,
  formatRemaining,
  formatWindow,
  remainingMs,
  validateWindow,
} from "@/lib/schedule";
import {
  addLockWindow,
  removeLockWindow,
  updateLockWindow,
  useCatalyst,
} from "@/lib/store";
import { PageFrame } from "@/components/page-frame";
import { cn } from "@/lib/utils";

const timeClass =
  "h-11 w-full rounded-xl border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30";

export default function SchedulePage() {
  const router = useRouter();
  const state = useCatalyst();
  const [days, setDays] = useState<number[]>(AFTER_SCHOOL_PRESET.days);
  const [start, setStart] = useState(AFTER_SCHOOL_PRESET.start);
  const [end, setEnd] = useState(AFTER_SCHOOL_PRESET.end);
  const [error, setError] = useState<string | null>(null);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    if (state.hydrated && !state.setupComplete) {
      router.replace(ROUTES.setup);
    }
  }, [state.hydrated, state.setupComplete, router]);

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 15_000);
    return () => window.clearInterval(id);
  }, []);

  const preview = useMemo(
    () => validateWindow({ days, start, end }),
    [days, start, end],
  );
  const current = activeWindow(state.schedule, now);

  function toggleDay(day: number) {
    setDays((currentDays) =>
      currentDays.includes(day)
        ? currentDays.filter((row) => row !== day)
        : [...currentDays, day],
    );
  }

  function addWindow() {
    const result = addLockWindow({ days, start, end, enabled: true });
    if (!result.ok) {
      setError(result.reason);
      return;
    }
    setError(null);
  }

  function addAfterSchool() {
    const result = addLockWindow(AFTER_SCHOOL_PRESET);
    if (!result.ok) setError(result.reason);
    else setError(null);
  }

  if (!state.setupComplete) return null;

  return (
    <PageFrame className="grid gap-10 space-y-0 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="space-y-6">
        <div className="flux-card px-6 py-8 sm:px-8">
          <p className="text-[11px] font-medium tracking-[0.18em] text-zinc-400 uppercase">
            Lock schedule
          </p>
          <h1 className="mt-3 text-4xl text-foreground sm:text-5xl">
            Quiet hours
          </h1>
          <DemoBadge className="mt-4">Simulated schedule</DemoBadge>
        </div>

        {current ? (
          <div className="flux-card p-5 ring-1 ring-primary/25">
            <p className="text-xs tracking-[0.16em] text-primary uppercase">
              Window on now
            </p>
            <p className="mt-2 text-sm text-foreground">
              {formatWindow(current)}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {formatRemaining(remainingMs(current, now))}
            </p>
          </div>
        ) : null}

        <section className="space-y-4">
          <h2 className="text-lg text-foreground">Your windows</h2>
          {state.schedule.length === 0 ? (
            <div className="flux-card p-5">
              <p className="text-sm text-foreground">No lock hours yet.</p>
              <Button
                className="mt-4 h-10 rounded-full"
                variant="outline"
                onClick={addAfterSchool}
              >
                Add after school 4:30–7:30
              </Button>
            </div>
          ) : (
            <ul className="space-y-2">
              {state.schedule.map((window) => {
                const on = current?.id === window.id;
                return (
                  <li
                    key={window.id}
                    className={cn(
                      "flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-card px-4 py-3 ring-1",
                      on ? "ring-primary/30" : "ring-border",
                      !window.enabled && "opacity-50",
                    )}
                  >
                    <div>
                      <p className="text-sm text-foreground">
                        {formatWindow(window)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {on
                          ? "Active now"
                          : window.enabled
                            ? "Scheduled"
                            : "Paused"}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-muted-foreground"
                        onClick={() =>
                          updateLockWindow(window.id, {
                            enabled: !window.enabled,
                          })
                        }
                      >
                        {window.enabled ? "Pause" : "Resume"}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-rose-300"
                        onClick={() => removeLockWindow(window.id)}
                      >
                        Remove
                      </Button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <section className="flux-card p-6">
          <h2 className="text-lg text-foreground">Add a window</h2>

          <div className="mt-5 space-y-4">
            <div className="space-y-2">
              <Label>Days</Label>
              <div className="flex flex-wrap gap-2">
                {WEEKDAYS.map((day) => {
                  const selected = days.includes(day.day);
                  return (
                    <button
                      key={day.day}
                      type="button"
                      onClick={() => toggleDay(day.day)}
                      className={cn(
                        "rounded-full px-3 py-1.5 text-sm ring-1",
                        selected
                          ? "bg-primary/15 text-foreground ring-primary/40"
                          : "text-muted-foreground ring-white/10",
                      )}
                    >
                      {day.short}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="lock-start">Start</Label>
                <input
                  id="lock-start"
                  type="time"
                  className={timeClass}
                  value={start}
                  onChange={(event) => setStart(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lock-end">End</Label>
                <input
                  id="lock-end"
                  type="time"
                  className={timeClass}
                  value={end}
                  onChange={(event) => setEnd(event.target.value)}
                />
              </div>
            </div>

            <p className="text-sm text-muted-foreground">
              {preview.ok
                ? `${formatWindow({ id: "preview", days, start, end, enabled: true })}`
                : preview.reason}
            </p>
            {error ? <p className="text-sm text-rose-300">{error}</p> : null}

            <Button
              className="h-11 rounded-full px-6"
              disabled={!preview.ok}
              onClick={addWindow}
            >
              Save window
            </Button>
          </div>
        </section>
      </div>

      <div className="flex flex-col items-center lg:pt-16">
        <PhoneLock
          nemeses={state.nemeses}
          unlocks={state.unlocks}
          locked={Boolean(current)}
          compact
        />
      </div>
    </PageFrame>
  );
}
