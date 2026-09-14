"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { PhoneLock } from "@/components/phone-lock";
import { DemoBadge } from "@/components/demo-badge";
import { MotivationNudge } from "@/components/motivation-nudge";
import { Spark } from "@/components/spark";
import { ROUTES } from "@/lib/routes";
import { enterFocus, sessionHint, sessionTitle, useCatalyst } from "@/lib/store";

export default function LockPage() {
  const router = useRouter();
  const state = useCatalyst();

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
    if (state.session.status === "focus") {
      router.replace(ROUTES.session);
    }
    if (state.session.status === "completed") {
      router.replace(ROUTES.unlocks);
    }
  }, [state.hydrated, state.setupComplete, state.session, router]);

  if (!state.session || state.session.status !== "locked") return null;

  const title = sessionTitle(state.session);

  function begin() {
    enterFocus();
    router.push(ROUTES.session);
  }

  return (
    <div className="mx-auto grid w-full max-w-4xl items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
      <div>
        <DemoBadge>Simulated phone lock</DemoBadge>
        <h1 className="mt-4 text-4xl text-foreground sm:text-5xl">
          Phone is locked. Laptop is the only door.
        </h1>
        <p className="mt-4 text-sm leading-6 text-muted-foreground">
          Social apps are grey. Emergency still works. This is a web mock —
          Catalyst is not talking to Screen Time.
        </p>
        <div className="mt-6 rounded-2xl bg-card p-4 ring-1 ring-white/6">
          <p className="text-xs tracking-[0.16em] text-muted-foreground uppercase">
            Working on
          </p>
          <p className="mt-2 text-lg text-foreground">{title}</p>
          {state.session.kind === "study" && state.session.plannedMinutes ? (
            <p className="mt-1 text-sm text-muted-foreground">
              Study block · {state.session.plannedMinutes} min · no +5 bonus
            </p>
          ) : state.session.goal ? (
            <p className="mt-1 text-sm text-muted-foreground">
              {state.session.goal}
            </p>
          ) : null}
        </div>
        <MotivationNudge motivation={state.motivation} />
      </div>
      <div className="flex flex-col items-center">
        <Spark
          mood="locked"
          taskId={state.session.taskId}
          subject={state.session.subjectId}
          hint={sessionHint(state.session)}
          size={88}
          className="mb-3"
        />
        <PhoneLock
          nemesis={state.nemesis}
          unlocks={state.unlocks}
          onBeginFocus={begin}
        />
      </div>
    </div>
  );
}
