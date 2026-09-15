"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DemoBadge } from "@/components/demo-badge";
import { FocusHud } from "@/components/focus-hud";
import { FocusSpark } from "@/components/focus-spark";
import { FocusStage } from "@/components/focus-stage";
import { TokenAmount } from "@/components/mint-chip";
import { type SparkMood } from "@/components/spark";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { COMPLETION_BONUS, DEMO_TOKEN_MS, REAL_TOKEN_MS } from "@/lib/constants";
import { ROUTES } from "@/lib/routes";
import {
  completeSession,
  markTaskDone,
  plannedLockMs,
  sessionHint,
  sessionTitle,
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
      router.replace(ROUTES.setup);
      return;
    }
    if (!state.session) {
      router.replace(ROUTES.focus);
      return;
    }
    if (state.session.status === "locked") {
      router.replace(ROUTES.lock);
    }
    if (state.session.status === "completed") {
      router.replace(ROUTES.unlocks);
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
  const tokenProgress = Math.min(1, (elapsed % interval) / interval);
  const title = session ? sessionTitle(session) : "";
  const planned = session ? plannedLockMs(session) : null;
  const remaining = planned ? Math.max(0, planned - elapsed) : 0;
  const sessionProgress = planned
    ? Math.min(1, elapsed / planned)
    : tokenProgress;
  const taskMarkedDone = session?.taskMarkedDone ?? false;
  const justEarned = earned >= 1 && tokenProgress < 0.12;
  const mood: SparkMood =
    session?.kind === "study"
      ? remaining === 0
        ? "done"
        : justEarned
          ? "earning"
          : "locked"
      : taskMarkedDone
        ? "done"
        : justEarned
          ? "earning"
          : "locked";

  const liveTokens =
    state.tokens +
    earned +
    (session?.kind === "verified" && taskMarkedDone ? COMPLETION_BONUS : 0);

  if (!session || session.status !== "focus") return null;

  function finish() {
    const result = completeSession(earned);
    if (!result.ok) {
      setError(result.reason);
      return;
    }
    router.push(`${ROUTES.unlocks}?earned=1`);
  }

  return (
    <div className="focus-session focus-session-stage">
      <FocusStage />
      <FocusSpark
        mood={mood}
        taskId={session.taskId}
        subject={session.subjectId}
        hint={sessionHint(session)}
      />
      <FocusHud
        time={formatElapsed(elapsed)}
        progress={sessionProgress}
        tokens={liveTokens}
      />

      <div className="focus-session-panel">
        <p className="text-[11px] tracking-[0.18em] text-primary uppercase">
          Focus session
        </p>
        <h1 className="mt-2 font-heading text-2xl text-foreground sm:text-3xl">
          {title}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {session.kind === "study"
            ? "Personal study block. Time tokens only."
            : "Official ManageBac task."}
        </p>
        {session.goal && session.kind === "verified" ? (
          <p className="mt-3 text-sm text-foreground/90">{session.goal}</p>
        ) : null}

        {session.kind === "verified" ? (
          <label className="mt-5 flex items-start gap-3">
            <Checkbox
              checked={session.taskMarkedDone}
              onCheckedChange={(value) => markTaskDone(Boolean(value))}
            />
            <span>
              <span className="text-sm text-foreground">
                Mark ManageBac task done
              </span>
              <span className="mt-1 block text-xs text-muted-foreground">
                Required to finish. Official tasks add{" "}
                <TokenAmount value={COMPLETION_BONUS} /> on top of time earned.
              </span>
            </span>
          </label>
        ) : (
          <p className="mt-5 text-sm text-muted-foreground">
            Stay for the full block. Leaving early awards nothing.
          </p>
        )}

        {planned ? (
          <p className="mt-3 text-xs text-muted-foreground">
            {remaining > 0
              ? `${formatElapsed(remaining)} left in this block`
              : "Block complete"}
          </p>
        ) : null}

        {demoMode ? (
          <DemoBadge className="mt-4">Demo speed · 30s = 1 token</DemoBadge>
        ) : (
          <p className="mt-4 text-xs text-muted-foreground">
            Real pace · 5 minutes = 1 token
          </p>
        )}

        {error ? (
          <p className="mt-3 text-sm text-rose-300">{error}</p>
        ) : (
          <p className="mt-3 text-xs text-muted-foreground">
            {session.kind === "study"
              ? "Tokens land with time. No completion bonus on personal blocks."
              : "Stay until a token lands, tick the task, then collect."}
          </p>
        )}

        <Button className="mt-5 h-11 rounded-full px-6" onClick={finish}>
          Complete session
        </Button>
      </div>
    </div>
  );
}
