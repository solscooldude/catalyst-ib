"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, CircleCheck } from "lucide-react";
import { DemoBadge } from "@/components/demo-badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StudyStartForm } from "@/components/study-start-form";
import { MOCK_TASKS, type TaskId } from "@/lib/constants";
import { ROUTES } from "@/lib/routes";
import {
  getNemesis,
  setDemoMode,
  startSession,
  useCatalyst,
} from "@/lib/store";
import { cn } from "@/lib/utils";

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

  const nemesis = getNemesis(state.nemesis);
  const openTasks = MOCK_TASKS.filter(
    (task) => !state.tasks.find((row) => row.id === task.id)?.done,
  );

  function begin() {
    if (!taskId) return;
    startSession({ taskId, goal });
    router.push(ROUTES.lock);
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <div>
        <p className="text-xs tracking-[0.2em] text-primary uppercase">
          Laptop first
        </p>
        <h1 className="mt-3 text-4xl text-foreground sm:text-5xl">
          Pick the task. Then lock the phone.
        </h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Pick a ManageBac task or start your own study block. The phone locks
          after you begin. Equip Cat study, Desk window, or Library attic in
          Appearance if you want a room behind the timer.
        </p>
        {nemesis ? (
          <p className="mt-2 text-xs text-muted-foreground">
            Nemesis is {nemesis.name}.{" "}
            <Link href={ROUTES.setup} className="text-primary/80 hover:text-primary">
              Change it in Setup
            </Link>
            , not here.
          </p>
        ) : null}

        <div className="mt-8 space-y-3">
          {MOCK_TASKS.map((task) => {
            const done = state.tasks.find((row) => row.id === task.id)?.done;
            const selected = taskId === task.id;
            return (
              <button
                key={task.id}
                type="button"
                disabled={done}
                onClick={() => setTaskId(task.id)}
                className={cn(
                  "w-full rounded-2xl bg-card p-4 text-left ring-1 transition-colors",
                  done && "opacity-50",
                  selected ? "ring-primary/50" : "ring-white/6",
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm text-foreground">{task.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {task.subject} · due {task.due} · {task.detail}
                    </p>
                  </div>
                  {done ? (
                    <CircleCheck className="size-4 text-primary" />
                  ) : (
                    <DemoBadge>ManageBac</DemoBadge>
                  )}
                </div>
              </button>
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

      <div className="h-fit rounded-3xl bg-card p-6 ring-1 ring-white/6">
        <h2 className="text-lg text-foreground">Start a session</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Optional goal, then the simulated lock screen.
        </p>

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
        className="h-fit rounded-3xl bg-card p-6 ring-1 ring-white/6 lg:col-span-2"
      >
        <h2 className="text-lg text-foreground">Start your own study block</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Same lock as a ManageBac task. You pick the subject and what you are
          working on. Time tokens only — no +5.
        </p>
        <div className="mt-5 max-w-xl">
          <StudyStartForm />
        </div>
      </div>
    </div>
  );
}
