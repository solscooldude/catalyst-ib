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
import { MOCK_TASKS, type TaskId } from "@/lib/constants";
import { ROUTES } from "@/lib/routes";
import { PageFrame } from "@/components/page-frame";
import { UnlockPanel } from "@/components/unlock-panel";
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
    <PageFrame className="grid gap-6 space-y-0 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="flux-card px-6 py-8 sm:px-8">
        <p className="text-[11px] font-medium tracking-[0.18em] text-zinc-400 uppercase">
          Focus
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          Pick the task.
        </h1>
        {nemesisApps.length > 0 ? (
          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            {nemesisApps.map((app) => (
              <span
                key={app.id}
                className="rounded-full border border-white/10 bg-white/4 px-2.5 py-0.5 text-[11px] text-foreground"
              >
                {app.name}
              </span>
            ))}
            <Link href={ROUTES.setup} className="text-xs text-zinc-400 hover:text-foreground">
              Edit
            </Link>
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
            empty="Pick a ManageBac task."
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
            All mock tasks are done.
          </p>
        ) : null}
      </div>

      <div className="flux-card h-fit p-6 sm:p-8">
        <h2 className="text-lg font-semibold text-foreground">Start</h2>
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
              className="focus-field"
            />
          </div>

          <label className="flex items-start gap-3 rounded-2xl bg-background/70 p-3 text-sm">
            <Checkbox
              checked={state.demoMode}
              onCheckedChange={(value) => setDemoMode(Boolean(value))}
            />
            <span className="text-foreground">Demo speed</span>
          </label>

          <Button
            className="h-11 w-full rounded-full"
            disabled={!taskId}
            onClick={begin}
          >
            Enter lock
            <ArrowRight className="size-4" />
          </Button>
          <Button asChild variant="ghost" className="h-11 w-full rounded-full">
            <Link href={ROUTES.stats}>Stats</Link>
          </Button>
        </div>
        <div className="mt-6">
          <UnlockPanel compact />
        </div>
      </div>

      <div
        id="study"
        className="flux-card h-fit p-6 sm:p-8 lg:col-span-2"
      >
        <h2 className="text-lg text-foreground">Study block</h2>
        <div className="mt-5 max-w-xl">
          <StudyStartForm />
        </div>
        <div className="mt-8">
          <h3 className="text-base text-foreground">Focus stage</h3>
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
    </PageFrame>
  );
}
