"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Link2 } from "lucide-react";
import { DemoBadge } from "@/components/demo-badge";
import { Button } from "@/components/ui/button";
import { MOCK_TASKS, NEMESIS_APPS, type NemesisId } from "@/lib/constants";
import { ROUTES } from "@/lib/routes";
import { completeSetup, useCatalyst } from "@/lib/store";
import { cn } from "@/lib/utils";

export default function SetupPage() {
  const router = useRouter();
  const state = useCatalyst();
  const [nemeses, setNemeses] = useState<NemesisId[]>(state.nemeses);
  const [connected, setConnected] = useState(state.manageBacConnected);
  const [connecting, setConnecting] = useState(false);

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
      setConnected(true);
      setConnecting(false);
    }, 700);
  }

  function finish() {
    if (nemeses.length === 0 || !connected) return;
    completeSetup(nemeses);
    router.push(ROUTES.focus);
  }

  return (
    <div className="mx-auto w-full max-w-2xl flux-card px-6 py-8 sm:px-8">
      <p className="text-[11px] font-medium tracking-[0.18em] text-zinc-400 uppercase">Setup</p>
      <h1 className="mt-3 text-4xl text-foreground sm:text-5xl">
        Name the apps that steal the block.
      </h1>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        Pick one or more nemesis apps. Catalyst remembers the set — you do not
        re-pick at the start of every focus. Change the list here when you
        need to. Then connect a mock ManageBac so the demo has IB work to
        prove.
      </p>

      <section className="mt-10">
        <h2 className="text-sm font-medium text-foreground">Your nemesis apps</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Tap to add or remove. At least one.
        </p>
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
                <p className="mt-1 text-sm text-muted-foreground">{app.blurb}</p>
              </button>
            );
          })}
        </div>
      </section>

      <section className="mt-10 rounded-3xl bg-zinc-50 p-6 dark:bg-zinc-900">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-base text-foreground">Connect ManageBac</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Simulated school tasks. Nothing leaves this browser.
            </p>
          </div>
          <DemoBadge>Simulated ManageBac</DemoBadge>
        </div>

        {!connected ? (
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
            {MOCK_TASKS.map((task) => (
              <div
                key={task.id}
                className="flex items-start justify-between gap-3 rounded-2xl bg-background/60 px-4 py-3"
              >
                <div>
                  <p className="text-sm text-foreground">{task.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {task.subject} · due {task.due}
                  </p>
                </div>
                <span className="font-mono text-[10px] tracking-wider text-primary uppercase">
                  Open
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      <div className="mt-8 flex justify-end">
        <Button
          className="h-11 rounded-full px-6"
          disabled={nemeses.length === 0 || !connected}
          onClick={finish}
        >
          {state.setupComplete ? "Save setup" : "Lock in setup"}
        </Button>
      </div>
    </div>
  );
}
