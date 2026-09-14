"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { DemoBadge } from "@/components/demo-badge";
import { Spark, type SparkMood } from "@/components/spark";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { COMPLETION_BONUS, DEMO_TOKEN_MS, REAL_TOKEN_MS } from "@/lib/constants";
import {
  completeSession,
  getTask,
  markTaskDone,
  tokensFromElapsed,
  useCatalyst,
} from "@/lib/store";

function formatElapsed(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export default function FocusPage() {
  const router = useRouter();
  const state = useCatalyst();
  const [now, setNow] = useState(() => Date.now());
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!state.hydrated) return;
    if (!state.setupComplete) {
      router.replace("/app/setup");
      return;
    }
    if (!state.session) {
      router.replace("/app");
      return;
    }
    if (state.session.status === "locked") {
      router.replace("/app/lock");
    }
    if (state.session.status === "completed") {
      router.replace("/app/unlock");
    }
  }, [state.hydrated, state.setupComplete, state.session, router]);

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 250);
    return () => window.clearInterval(id);
  }, []);

  const session = state.session;
  const startedAt = session?.focusStartedAt ?? now;
  const elapsed = now - startedAt;
  const demoMode = session?.demoMode ?? state.demoMode;
  const interval = demoMode ? DEMO_TOKEN_MS : REAL_TOKEN_MS;
  const earned = tokensFromElapsed(elapsed, demoMode);
  const progress = Math.min(1, (elapsed % interval) / interval);
  const task = session ? getTask(session.taskId) : undefined;

  const ring = useMemo(() => {
    const radius = 86;
    const circ = 2 * Math.PI * radius;
    return { radius, circ, dash: circ * progress };
  }, [progress]);

  const taskMarkedDone = session?.taskMarkedDone ?? false;
  const justEarned = earned >= 1 && progress < 0.12;
  const mood: SparkMood = taskMarkedDone
    ? "done"
    : justEarned
      ? "earning"
      : "locked";

  if (!session || session.status !== "focus") return null;

  function finish() {
    const result = completeSession(earned);
    if (!result.ok) {
      setError(result.reason);
      return;
    }
    router.push("/app/unlock?earned=1");
  }

  return (
    <div className="mx-auto grid w-full max-w-4xl items-center gap-12 lg:grid-cols-[1fr_1fr]">
      <div className="flex flex-col items-center">
        <Spark
          mood={mood}
          taskId={session?.taskId}
          hint={task ? `${task.title} ${task.subject}` : undefined}
          size={72}
          className="mb-2"
        />
        <div className="relative size-64">
          <svg viewBox="0 0 200 200" className="size-full -rotate-90">
            <circle
              cx="100"
              cy="100"
              r={ring.radius}
              fill="none"
              stroke="rgb(244 244 245 / 0.06)"
              strokeWidth="8"
            />
            <circle
              cx="100"
              cy="100"
              r={ring.radius}
              fill="none"
              stroke="#5EEAD4"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${ring.dash} ${ring.circ}`}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="font-heading text-5xl text-foreground">
              {formatElapsed(elapsed)}
            </p>
            <p className="mt-1 font-mono text-xs text-primary">
              {earned} time token{earned === 1 ? "" : "s"}
              {taskMarkedDone ? ` + ${COMPLETION_BONUS}` : ""}
            </p>
          </div>
        </div>
        {demoMode ? (
          <DemoBadge className="mt-4">Demo speed · 30s = 1 token</DemoBadge>
        ) : (
          <p className="mt-4 text-xs text-muted-foreground">
            Real pace · 5 minutes = 1 token
          </p>
        )}
      </div>

      <div>
        <p className="text-xs tracking-[0.2em] text-primary uppercase">
          Focus session
        </p>
        <h1 className="mt-3 text-4xl text-foreground">{task?.title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{task?.detail}</p>
        {session.goal ? (
          <p className="mt-4 rounded-2xl bg-card px-4 py-3 text-sm text-foreground ring-1 ring-white/6">
            {session.goal}
          </p>
        ) : null}

        <label className="mt-8 flex items-start gap-3 rounded-2xl bg-card p-4 ring-1 ring-white/6">
          <Checkbox
            checked={session.taskMarkedDone}
            onCheckedChange={(value) => markTaskDone(Boolean(value))}
          />
          <span>
            <span className="text-sm text-foreground">
              Mark ManageBac task done
            </span>
            <span className="mt-1 block text-xs text-muted-foreground">
              Required to finish. Official tasks add +{COMPLETION_BONUS}{" "}
              tokens on top of time earned. Simulated ManageBac.
            </span>
          </span>
        </label>

        {error ? (
          <p className="mt-4 text-sm text-rose-300">{error}</p>
        ) : (
          <p className="mt-4 text-sm text-muted-foreground">
            Stay until a token lands, tick the task, then collect.
          </p>
        )}

        <Button className="mt-6 h-11 rounded-full px-6" onClick={finish}>
          Complete session
        </Button>
      </div>
    </div>
  );
}
