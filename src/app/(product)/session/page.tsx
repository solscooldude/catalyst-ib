"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DemoBadge } from "@/components/demo-badge";
import { FocusHud } from "@/components/focus-hud";
import { FocusSpark } from "@/components/focus-spark";
import { FocusStage } from "@/components/focus-stage";
import { TokenAmount } from "@/components/mint-chip";
import { UnlockPanel } from "@/components/unlock-panel";
import { type SparkMood } from "@/components/spark";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { COMPLETION_BONUS, DEMO_TOKEN_MS, REAL_TOKEN_MS } from "@/lib/constants";
import { ROUTES } from "@/lib/routes";
import { displaySpriteName } from "@/lib/sprite-name";
import {
  completeSession,
  markTaskDone,
  pauseSession,
  resumeSession,
  sessionElapsedMs,
  sessionHint,
  sessionTitle,
  tokensFromElapsed,
  useCatalyst,
} from "@/lib/store";

function formatElapsed(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
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
  const paused = Boolean(session?.pausedAt);
  const elapsed = session ? sessionElapsedMs(session, now) : 0;
  const demoMode = session?.demoMode ?? state.demoMode;
  const interval = demoMode ? DEMO_TOKEN_MS : REAL_TOKEN_MS;
  const earned = tokensFromElapsed(elapsed, demoMode);
  const tokenProgress = Math.min(1, (elapsed % interval) / interval);
  const title = session ? sessionTitle(session) : "";
  const goalMs = session?.plannedMinutes
    ? session.demoMode
      ? Math.round(session.plannedMinutes * 60 * 1000 * (DEMO_TOKEN_MS / REAL_TOKEN_MS))
      : session.plannedMinutes * 60 * 1000
    : null;
  const taskMarkedDone = session?.taskMarkedDone ?? false;
  const justEarned = earned >= 1 && tokenProgress < 0.12;
  const mood: SparkMood = paused
    ? "idle"
    : session?.kind === "study"
      ? justEarned
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
    const minutes = Math.max(0, Math.round(elapsed / 60000));
    router.push(
      `${ROUTES.unlocks}?earned=1&minutes=${minutes}&tokens=${result.totalTokens}`,
    );
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
        progress={tokenProgress}
        tokens={liveTokens}
        name={displaySpriteName(state.spriteName)}
        task={title}
      />

      <div className="focus-session-panel">
        <p className="text-[11px] tracking-[0.18em] text-primary uppercase">
          {paused ? "Paused" : "Focus session"}
        </p>
        <h1 className="mt-2 font-heading text-2xl text-foreground sm:text-3xl">
          {title}
        </h1>
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
                Adds <TokenAmount value={COMPLETION_BONUS} />
              </span>
            </span>
          </label>
        ) : null}

        {goalMs ? (
          <p className="mt-3 text-xs text-muted-foreground">
            Soft goal {session.plannedMinutes} min
            {elapsed >= goalMs ? " · reached" : ` · ${formatElapsed(elapsed)} in`}
          </p>
        ) : null}

        {demoMode ? (
          <DemoBadge className="mt-4">Demo speed · 30s = 1 token</DemoBadge>
        ) : (
          <p className="mt-4 text-xs text-muted-foreground">
            Real pace · 5 minutes = 1 token
          </p>
        )}

        {error ? <p className="mt-3 text-sm text-rose-300">{error}</p> : null}

        <div className="mt-5">
          <UnlockPanel compact />
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
