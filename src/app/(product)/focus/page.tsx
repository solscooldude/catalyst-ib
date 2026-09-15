"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FocusStagePicker } from "@/components/focus-stage";
import { StudyStartForm } from "@/components/study-start-form";
import { SelectedTaskChip, TaskOption } from "@/components/task-option";
import { MOCK_TASKS, formatNemesisList, type TaskId } from "@/lib/constants";
import { ROUTES } from "@/lib/routes";
import {
  buyAppearance,
  equipAppearance,
  getNemeses,
  setDemoMode,
  startSession,
  useCatalyst,
} from "@/lib/store";

export default function AppHomePage() {
  const router = useRouter();
  const state = useCatalyst();
  const [taskId, setTaskId] = useState<TaskId | "">("");
  const [goal, setGoal] = useState("");

  useEffect(() => {
    if (state.hydrated && !state.setupComplete) {
      router.replace(ROUTES.setup);
    }
  }, [state.hydrated, state.setupComplete, router]);

  useEffect(() => {
    if (state.hydrated && state.session?.status === "locked") {
      router.replace(ROUTES.lock);
    }
    if (state.hydrated && state.session?.status === "focus") {
      router.replace(ROUTES.session);
    }
  }, [state.hydrated, state.session, router]);

  if (!state.setupComplete) return null;

  const nemesisApps = getNemeses(state.nemeses);
  const openTasks = MOCK_TASKS.filter(
    (task) => !state.tasks.find((row) => row.id === task.id)?.done,
  );
  const selectedTask = MOCK_TASKS.find((task) => task.id === taskId);

  function begin() {
    if (!taskId) return;
    startSession({ taskId, goal });
    router.push(ROUTES.lock);
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="flux-card px-6 py-8 sm:px-8">
        <p className="text-[11px] font-medium tracking-[0.18em] text-zinc-400 uppercase">
          Laptop first
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          Pick the task. Then lock the phone.
        </h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Pick a ManageBac task or start your own study block. The phone locks
          after you begin. Focus is a large spark on a quiet stage — tap it
          to pet it.
        </p>
        {nemesisApps.length > 0 ? (
          <div className="mt-3">
            <div className="flex flex-wrap gap-1.5">
              {nemesisApps.map((app) => (
                <span
                  key={app.id}
                  className="rounded-full border border-white/10 bg-white/4 px-2.5 py-0.5 text-[11px] text-foreground"
                >
                  {app.name}
                </span>
              ))}
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Locked set: {formatNemesisList(state.nemeses)}.{" "}
              <Link href={ROUTES.setup} className="text-primary/80 hover:text-primary">
                Edit in Setup
              </Link>
              . You do not re-pick when a session starts.
            </p>
          </div>
        ) : null}

        <div className="mt-6">
          <SelectedTaskChip
            title={selectedTask?.title}
            detail={
              selectedTask
                ? `${selectedTask.subject} · due ${selectedTask.due}`
                : undefined
            }
            empty="Pick a ManageBac task below. The name stays visible here after you choose."
          />
        </div>

        <div className="mt-5 space-y-3">
          {MOCK_TASKS.map((task) => {
            const done = state.tasks.find((row) => row.id === task.id)?.done;
            return (
              <TaskOption
                key={task.id}
                title={task.title}
                detail={`${task.subject} · due ${task.due} · ${task.detail}`}
                selected={taskId === task.id}
                disabled={done}
                onSelect={() => setTaskId(task.id)}
              />
            );
          })}
        </div>

        {openTasks.length === 0 ? (
          <p className="mt-6 text-sm text-muted-foreground">
            Every mock task is marked done. Reset the demo to run the loop
            again.
          </p>
        ) : null}
      </div>

      <div className="flux-card h-fit p-6 sm:p-8">
        <h2 className="text-lg font-semibold text-foreground">Start a session</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Optional goal, then the simulated lock screen.
        </p>
        <div className="mt-4">
          <SelectedTaskChip
            title={selectedTask?.title}
            detail={
              selectedTask
                ? `${selectedTask.subject} · due ${selectedTask.due}`
                : undefined
            }
          />
        </div>

        <div className="mt-5 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="goal">Goal for this block</Label>
            <Input
              id="goal"
              value={goal}
              onChange={(event) => setGoal(event.target.value)}
              placeholder="Finish methodology. No phone until the draft exists."
              className="h-11 rounded-xl"
            />
          </div>

          <label className="flex items-start gap-3 rounded-2xl bg-background/70 p-3 text-sm">
            <Checkbox
              checked={state.demoMode}
              onCheckedChange={(value) => setDemoMode(Boolean(value))}
            />
            <span>
              <span className="text-foreground">Demo speed</span>
              <span className="mt-0.5 block text-xs text-muted-foreground">
                30 seconds = 1 token. Real pace is 5 minutes = 1 token.
              </span>
            </span>
          </label>

          <Button
            className="h-11 w-full rounded-full"
            disabled={!taskId}
            onClick={begin}
          >
            Enter lock
            <ArrowRight className="size-4" />
          </Button>
          <Button asChild variant="outline" className="h-11 w-full rounded-full">
            <Link href={ROUTES.unlocks}>Spend tokens instead</Link>
          </Button>
          <Button asChild variant="ghost" className="h-11 w-full rounded-full">
            <Link href={ROUTES.stats}>Stats</Link>
          </Button>
        </div>
      </div>

      <div
        id="study"
        className="flux-card h-fit p-6 sm:p-8 lg:col-span-2"
      >
        <h2 className="text-lg text-foreground">Start your own study block</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Same lock as a ManageBac task. You pick the subject and what you are
          working on. Time tokens only — no +5.
        </p>
        <div className="mt-5 max-w-xl">
          <StudyStartForm />
        </div>
        <div className="mt-8">
          <h3 className="text-base text-foreground">Focus stage</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Stays behind Spark in light and dark. Night sky is free.
          </p>
          <div className="mt-4">
            <FocusStagePicker
              value={state.appearance.focusTheme}
              owned={(id) =>
                state.appearance.ownedFocusThemes.includes(
                  id as (typeof state.appearance.ownedFocusThemes)[number],
                )
              }
              onPick={(id, owned) => {
                if (owned) equipAppearance("focusTheme", id);
                else buyAppearance("focusTheme", id);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
