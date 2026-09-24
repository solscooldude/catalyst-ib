"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FocusHud } from "@/components/focus-hud";
import { FocusSpark } from "@/components/focus-spark";
import { FocusStage } from "@/components/focus-stage";
import { UnlockPanel } from "@/components/unlock-panel";
import { Spark, type SparkMood } from "@/components/spark";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { REAL_TOKEN_MS, SUBJECTS } from "@/lib/constants";
import { ROUTES } from "@/lib/routes";
import {
  completeSession,
  creditLiveSessionTokens,
  enterFocus,
  markTaskDone,
  pauseSession,
  plannedLockMs,
  resumeSession,
  sessionElapsedMs,
  sessionHint,
  sessionTitle,
  useCatalyst,
} from "@/lib/store";
import { formatElapsed } from "@/lib/session-recap";
import { readStudyBuddySit, writeStudyBuddySit } from "@/lib/study-buddy";

export default function FocusPage() {
  const router = useRouter();
  const state = useCatalyst();
  const [now, setNow] = useState(() => Date.now());
  const [error, setError] = useState<string | null>(null);
  const [sit, setSit] = useState(false);
  const session = state.session;

  useEffect(() => {
    setSit(readStudyBuddySit());
  }, []);

  useEffect(() => {
    if (!state.hydrated) return;
    if (!state.setupComplete) {
      router.replace(ROUTES.setup);
      return;
    }
    if (!state.session) {
      router.replace(ROUTES.focus);
      return;
    }
    if (state.session.status === "locked") {
      enterFocus();
    }
    if (state.session.status === "completed") {
      router.replace(ROUTES.focus);
    }
  }, [state.hydrated, state.setupComplete, state.session, router]);

  useEffect(() => {
    const id = window.setInterval(() => {
      const stamp = Date.now();
      setNow(stamp);
      creditLiveSessionTokens(stamp);
    }, 250);
    return () => window.clearInterval(id);
  }, []);

  const paused = Boolean(session?.pausedAt);
  const elapsed = session ? sessionElapsedMs(session, now) : 0;
  const title = session ? sessionTitle(session) : "";
  const subjectLabel = session
    ? (SUBJECTS.find((row) => row.id === session.subjectId)?.label ?? null)
    : null;
  const goalMs = session ? plannedLockMs(session) : null;
  const taskMarkedDone = session?.taskMarkedDone ?? false;
  const mood: SparkMood = paused
    ? "idle"
    : session?.kind === "verified" && taskMarkedDone
      ? "done"
      : "locked";

  if (!session || session.status !== "focus") return null;

  function finish() {
    const result = completeSession();
    if (!result.ok) {
      setError(result.reason);
      return;
    }
    router.push(ROUTES.focus);
  }

  return (
    <div className="focus-session focus-session-stage" data-focus-canvas="">
      <FocusStage />
      {sit ? null : (
        <FocusSpark
          mood={mood}
          taskId={session.taskId}
          subject={session.subjectId}
          hint={sessionHint(session)}
        />
      )}
      <FocusHud
        time={formatElapsed(elapsed)}
        progress={goalMs ? Math.min(1, elapsed / goalMs) : null}
        tokens={state.tokens}
        task={title}
        buddy={
          sit ? (
            <Spark
              mood={mood}
              taskId={session.taskId}
              subject={session.subjectId}
              hint={sessionHint(session)}
              size={92}
              pettable
              flourish="loop"
              className="spark-sit"
            />
          ) : null
        }
      />

      <div className="focus-session-panel" data-focus-board="">
        <p className="focus-board-kicker">
          {paused ? "Paused" : "Focus session"}
        </p>
        <h1 className="focus-board-title mt-2 font-heading text-2xl sm:text-3xl">
          {title}
        </h1>
        {subjectLabel ? (
          <p className="focus-board-subject mt-1 text-sm">{subjectLabel}</p>
        ) : null}
        {session.goal && session.kind === "verified" ? (
          <p className="focus-board-copy mt-3 text-sm">{session.goal}</p>
        ) : null}

        <label className="focus-board-row mt-5 flex items-start gap-3">
          <Checkbox
            checked={sit}
            onCheckedChange={(value) => {
              const next = Boolean(value);
              setSit(next);
              writeStudyBuddySit(next);
            }}
          />
          <span>
            <span className="text-sm text-white">Study buddy sit</span>
            <span className="mt-1 block text-xs text-zinc-100">
              The sprite sits beside the timer. Quiet idle.
            </span>
          </span>
        </label>

        {session.kind === "verified" ? (
          <label className="focus-board-row mt-4 flex items-start gap-3">
            <Checkbox
              checked={session.taskMarkedDone}
              onCheckedChange={(value) => markTaskDone(Boolean(value))}
            />
            <span>
              <span className="text-sm text-white">
                Mark task done
              </span>
              <span className="focus-board-copy mt-1 block text-xs">
                Checklist only. Tokens come from focus time.
              </span>
            </span>
          </label>
        ) : null}

        {goalMs ? (
          <p className="mt-3 text-xs text-muted-foreground">
            Soft goal {session.plannedMinutes} min
            {elapsed >= goalMs
              ? " · reached"
              : ` · ${formatElapsed(elapsed)}`}
          </p>
        ) : null}

        <p className="mt-4 text-xs text-muted-foreground">
          {REAL_TOKEN_MS / 60000} minutes = 1 token
        </p>

        {error ? <p className="mt-3 text-sm text-rose-300">{error}</p> : null}

        <div className="mt-5">
          <UnlockPanel compact collapsible />
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <Button
            variant="outline"
            className="h-11 rounded-full px-6"
            onClick={() => (paused ? resumeSession() : pauseSession())}
          >
            {paused ? "Resume" : "Pause"}
          </Button>
          <Button className="h-11 rounded-full px-6" onClick={finish}>
            End focus
          </Button>
        </div>
      </div>
    </div>
  );
}
