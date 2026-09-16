"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Check, Link2 } from "lucide-react";
import { DemoBadge } from "@/components/demo-badge";
import { LockHoursPicker } from "@/components/lock-hours-picker";
import { Button } from "@/components/ui/button";
import { MOCK_TASKS, NEMESIS_APPS, type NemesisId } from "@/lib/constants";
import { ROUTES } from "@/lib/routes";
import { AFTER_SCHOOL_PRESET, WEEKNIGHT_PRESET, formatWindow } from "@/lib/schedule";
import { addLockWindow, completeSetup, connectManageBacSample, useCatalyst } from "@/lib/store";
import { sourceLabel } from "@/lib/school-tasks";
import { cn } from "@/lib/utils";

export default function SetupPage() {
  const router = useRouter();
  const state = useCatalyst();
  const [nemeses, setNemeses] = useState<NemesisId[]>(state.nemeses);
  const schoolReady =
    state.manageBacConnected ||
    state.classroomConnected ||
    state.schoolTasks.length > 0;
  const [connected, setConnected] = useState(schoolReady);
  const [connecting, setConnecting] = useState(false);
  const [setupError, setSetupError] = useState<string | null>(null);
  const tasksReady = connected || schoolReady;
  const listedTasks =
    state.schoolTasks.length > 0 ? state.schoolTasks : MOCK_TASKS;
  const [days, setDays] = useState<number[]>(AFTER_SCHOOL_PRESET.days);
  const [start, setStart] = useState(AFTER_SCHOOL_PRESET.start);
  const [end, setEnd] = useState(AFTER_SCHOOL_PRESET.end);
  const [lockError, setLockError] = useState<string | null>(null);

  useEffect(() => {
    if (schoolReady) setConnected(true);
  }, [schoolReady]);

  function toggle(id: NemesisId) {
    setNemeses((current) =>
      current.includes(id)
        ? current.filter((row) => row !== id)
        : [...current, id],
    );
  }

  function connectManageBac() {
    setConnecting(true);
    window.setTimeout(() => {
      connectManageBacSample(state.manageBacSchoolUrl);
      setConnected(true);
      setConnecting(false);
    }, 200);
  }

  function addWindow() {
    const result = addLockWindow({ days, start, end, enabled: true });
    setLockError(result.ok ? null : result.reason);
  }

  function addAfterSchool() {
    const result = addLockWindow(AFTER_SCHOOL_PRESET);
    setLockError(result.ok ? null : result.reason);
  }

  function addWeeknights() {
    const result = addLockWindow(WEEKNIGHT_PRESET);
    setLockError(result.ok ? null : result.reason);
  }

  function finish() {
    if (nemeses.length === 0) {
      setSetupError("Pick at least one Tier 3 app.");
      return;
    }
    if (!tasksReady) {
      setSetupError("Connect school tasks or load a sample first.");
      return;
    }
    if (state.schedule.length === 0) {
      setSetupError("Add lock hours first.");
      return;
    }
    const result = completeSetup(nemeses);
    if (!result.ok) {
      setSetupError(result.reason);
      return;
    }
    setSetupError(null);
    router.push(ROUTES.focus);
  }

  return (
    <div className="mx-auto w-full max-w-2xl flux-card px-6 py-8 sm:px-10">
      <p className="text-[11px] font-medium tracking-[0.18em] text-zinc-400 uppercase">Setup</p>
      <h1 className="mt-3 text-4xl text-foreground sm:text-5xl">
        Your Tier 3 nemeses
      </h1>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        Pick which apps sit in Tier 3 for the simulated lock. Spending still
        unlocks the whole tier for the time block — not one app. School tools
        stay free. YouTube stays in Tier 2.
      </p>

      <section className="mt-10">
        <h2 className="text-sm font-medium text-foreground">
          Multi-select your nemesis set
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {NEMESIS_APPS.map((app) => {
            const selected = nemeses.includes(app.id);
            return (
              <button
                key={app.id}
                type="button"
                onClick={() => toggle(app.id)}
                className={cn(
                  "rounded-2xl bg-zinc-50 p-4 text-left ring-1 transition-colors dark:bg-zinc-900",
                  selected
                    ? "ring-primary/50"
                    : "ring-transparent hover:ring-primary/20",
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="text-base text-foreground">{app.name}</span>
                  {selected ? <Check className="size-4 text-primary" /> : null}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{app.blurb}</p>
              </button>
            );
          })}
        </div>
      </section>

      <section className="mt-10 rounded-3xl bg-zinc-50 p-6 dark:bg-zinc-900">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-base text-foreground">School tasks</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Setup can stay simulated. Import or OAuth lives on Integrations.
            </p>
          </div>
          <DemoBadge>Simulated unless imported</DemoBadge>
        </div>

        {!tasksReady ? (
          <Button
            className="mt-5 h-11 rounded-full px-5"
            onClick={connectManageBac}
            disabled={connecting}
          >
            <Link2 className="size-4" />
            {connecting ? "Connecting…" : "Connect ManageBac"}
          </Button>
        ) : (
          <div className="mt-5 space-y-2">
            {listedTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-start justify-between gap-3 rounded-2xl bg-background/60 px-4 py-3"
              >
                <div>
                  <p className="text-sm text-foreground">{task.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {"source" in task ? `${sourceLabel(task.source)} · ` : ""}
                    {task.subject} · due {task.due}
                  </p>
                </div>
                <span className="font-mono text-[10px] tracking-wider text-primary uppercase">
                  {"done" in task && task.done ? "Done" : "Open"}
                </span>
              </div>
            ))}
          </div>
        )}
        <Button asChild variant="outline" className="mt-5 h-11 rounded-full px-5">
          <Link href={ROUTES.integrations}>Classroom + ManageBac import</Link>
        </Button>
      </section>

      <section className="mt-10 rounded-3xl bg-zinc-50 p-6 dark:bg-zinc-900">
        <h2 className="text-base text-foreground">Lock hours</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Required. This is the main feature — quiet hours when Catalyst locks
          the apps you picked.
        </p>
        {state.schedule.length > 0 ? (
          <ul className="mt-4 space-y-2">
            {state.schedule.map((window) => (
              <li
                key={window.id}
                className="rounded-2xl bg-background/60 px-4 py-3 text-sm text-foreground"
              >
                {formatWindow(window)}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-rose-300">
            Add at least one lock window to finish setup.
          </p>
        )}
        <div className="mt-5">
          <LockHoursPicker
            days={days}
            start={start}
            end={end}
            error={lockError}
            onToggleDay={(day) =>
              setDays((current) =>
                current.includes(day)
                  ? current.filter((row) => row !== day)
                  : [...current, day],
              )
            }
            onStart={setStart}
            onEnd={setEnd}
            onAdd={addWindow}
            onPreset={addAfterSchool}
            onWeeknights={addWeeknights}
          />
        </div>
      </section>

      {setupError ? (
        <p className="mt-6 text-sm text-rose-300">{setupError}</p>
      ) : null}
      <div className="mt-8 flex justify-end">
        <Button
          className="h-11 rounded-full px-6"
          disabled={nemeses.length === 0 || !tasksReady || state.schedule.length === 0}
          onClick={finish}
        >
          {state.setupComplete ? "Save setup" : "Lock in setup"}
        </Button>
      </div>
    </div>
  );
}
