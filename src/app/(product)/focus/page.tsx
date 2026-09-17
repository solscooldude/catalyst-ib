"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FocusStagePicker } from "@/components/focus-stage";
import { ManualTaskForm } from "@/components/manual-task-form";
import { StudyStartForm } from "@/components/study-start-form";
import { SelectedTaskChip } from "@/components/task-option";
import { SchoolTaskPick } from "@/components/school-task-pick";
import type { TaskId } from "@/lib/constants";
import { studySubjectOptions } from "@/lib/ib";
import { ROUTES } from "@/lib/routes";
import { groupSchoolTasksBySubject } from "@/lib/school-tasks";
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

function taskDetail(task: { subject: string; due: string }) {
  const due = task.due ? `due ${task.due}` : "no due date";
  return task.subject ? `${task.subject} · ${due}` : due;
}

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
    if (
      state.hydrated &&
      (state.session?.status === "locked" || state.session?.status === "focus")
    ) {
      router.replace(ROUTES.session);
    }
  }, [state.hydrated, state.session, router]);

  const diploma = useMemo(
    () => studySubjectOptions(state.profile),
    [state.profile],
  );
  const sections = useMemo(
    () => groupSchoolTasksBySubject(state.schoolTasks, diploma),
    [state.schoolTasks, diploma],
  );

  if (!state.setupComplete) return null;

  const nemesisApps = getNemeses(state.nemeses);
  const openTasks = state.schoolTasks.filter((task) => !task.done);
  const selectedTask = state.schoolTasks.find((task) => task.id === taskId);

  function begin() {
    if (!taskId) return;
    startSession({ taskId, goal });
    router.push(ROUTES.session);
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
            detail={selectedTask ? taskDetail(selectedTask) : undefined}
            empty="Pick a task, or start a study block below."
          />
        </div>

        <div className="mt-6 rounded-3xl bg-zinc-50 p-4 dark:bg-zinc-900">
          <h2 className="text-sm font-medium text-foreground">Add a task</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Title is enough. Subject and due date are optional. Checking a task
            done is a checklist only — tokens come from focus time.
          </p>
          <div className="mt-4">
            <ManualTaskForm />
          </div>
        </div>

        <div className="mt-6 space-y-7">
          {state.schoolTasks.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No tasks yet. Add one above, or start a study block by subject.
            </p>
          ) : (
            sections.map((section) => (
              <section key={section.key}>
                <h2 className="text-sm font-medium text-foreground">
                  {section.label}
                </h2>
                {section.tasks.length === 0 ? (
                  <p className="mt-3 text-sm text-muted-foreground">
                    No tasks in this subject yet.
                  </p>
                ) : (
                  <div className="mt-3 space-y-4">
                    {section.tasks.map((task) => (
                      <SchoolTaskPick
                        key={task.id}
                        task={task}
                        selected={taskId === task.id}
                        onSelect={() => setTaskId(task.id)}
                      />
                    ))}
                  </div>
                )}
              </section>
            ))
          )}
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          Tokens come from focused time on this tab. Marking a task done does
          not pay extra.
        </p>

        {state.schoolTasks.length > 0 && openTasks.length === 0 ? (
          <p className="mt-6 text-sm text-muted-foreground">
            All listed tasks are done. Add another, or start a study block.
          </p>
        ) : null}
      </div>

      <div className="flux-card h-fit p-6 sm:p-8">
        <h2 className="text-lg font-semibold text-foreground">Start</h2>
        <div className="mt-4">
          <SelectedTaskChip
            title={selectedTask?.title}
            detail={selectedTask ? taskDetail(selectedTask) : undefined}
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
            Start focus
            <ArrowRight className="size-4" />
          </Button>
          <Button asChild variant="ghost" className="h-11 w-full rounded-full">
            <Link href={ROUTES.stats}>Stats</Link>
          </Button>
        </div>
        <div className="mt-6">
          <UnlockPanel compact collapsible />
        </div>
      </div>

      <div
        id="study"
        className="flux-card h-fit p-6 sm:p-8 lg:col-span-2"
      >
        <h2 className="text-lg text-foreground">Study block</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Subject only — no task list required. Same earn path: stay on this
          tab.
        </p>
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
