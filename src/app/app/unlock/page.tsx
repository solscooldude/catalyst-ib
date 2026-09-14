"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { DemoBadge } from "@/components/demo-badge";
import { PhoneLock } from "@/components/phone-lock";
import { Spark, type SparkMood } from "@/components/spark";
import { TokenChip } from "@/components/token-chip";
import { Button } from "@/components/ui/button";
import { UNLOCK_CATALOG } from "@/lib/constants";
import {
  getNemesis,
  spendUnlock,
  useCatalyst,
} from "@/lib/store";

function UnlockInner() {
  const router = useRouter();
  const params = useSearchParams();
  const state = useCatalyst();
  const [now, setNow] = useState(() => Date.now());
  const [notice, setNotice] = useState<string | null>(null);
  const [mood, setMood] = useState<SparkMood>("tempted");
  const earned = params.get("earned") === "1";

  useEffect(() => {
    if (!state.hydrated) return;
    if (!state.setupComplete) router.replace("/app/setup");
  }, [state.hydrated, state.setupComplete, router]);

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (earned) {
      setMood("done");
      const timeout = window.setTimeout(() => setMood("tempted"), 3200);
      return () => window.clearTimeout(timeout);
    }
    setMood("tempted");
  }, [earned]);

  const nemesis = getNemesis(state.nemesis);
  const lastEarned = state.session?.status === "completed" ? state.session.tokensEarned : 0;
  const active = useMemo(
    () => state.unlocks.filter((unlock) => unlock.expiresAt > now),
    [state.unlocks, now],
  );

  if (!state.setupComplete) return null;

  function buy(id: (typeof UNLOCK_CATALOG)[number]["id"]) {
    const result = spendUnlock(id);
    if (!result.ok) {
      setNotice(result.reason);
      return;
    }
    setNotice(`Unlocked ${result.unlock.label} for a short window.`);
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
      <div>
        {earned && lastEarned > 0 ? (
          <div className="mb-8 rounded-3xl bg-primary/10 p-5 ring-1 ring-primary/20">
            <p className="text-xs tracking-[0.16em] text-primary uppercase">
              Session paid out
            </p>
            <p className="mt-2 font-heading text-3xl text-foreground">
              +{lastEarned} token{lastEarned === 1 ? "" : "s"}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              ManageBac task marked done. Balance updated in this browser.
            </p>
          </div>
        ) : null}

        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs tracking-[0.2em] text-primary uppercase">
              Unlock shop
            </p>
            <h1 className="mt-3 text-4xl text-foreground">Spend the proof.</h1>
          </div>
          <TokenChip tokens={state.tokens} />
        </div>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Ten minutes on a real install. In demo speed, unlocks last 60 seconds
          so you can watch the phone light back up.
        </p>

        <div className="mt-8 space-y-3">
          {UNLOCK_CATALOG.map((item) => {
            const label = item.id === "nemesis" ? (nemesis?.name ?? "Nemesis") : item.name;
            const affordable = state.tokens >= item.cost;
            return (
              <div
                key={item.id}
                className="flex flex-col gap-3 rounded-2xl bg-card p-4 ring-1 ring-white/6 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-sm text-foreground">{label}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.intensity} · {item.blurb}
                  </p>
                </div>
                <Button
                  className="h-10 rounded-full"
                  disabled={!affordable}
                  onClick={() => buy(item.id)}
                >
                  Unlock · {item.cost}
                </Button>
              </div>
            );
          })}
        </div>

        {notice ? (
          <p className="mt-4 text-sm text-primary">{notice}</p>
        ) : null}

        <div className="mt-8">
          <p className="text-xs tracking-[0.16em] text-muted-foreground uppercase">
            Active windows
          </p>
          {active.length === 0 ? (
            <p className="mt-3 text-sm text-muted-foreground">
              Nothing unlocked. Earn a session, then buy ten minutes.
            </p>
          ) : (
            <ul className="mt-3 space-y-2">
              {active.map((unlock) => {
                const left = Math.max(0, unlock.expiresAt - now);
                const mins = Math.floor(left / 60000);
                const secs = Math.floor((left % 60000) / 1000);
                return (
                  <li
                    key={unlock.id}
                    className="flex items-center justify-between rounded-2xl bg-card px-4 py-3 text-sm ring-1 ring-white/6"
                  >
                    <span>{unlock.label}</span>
                    <span className="font-mono text-primary">
                      {mins}:{String(secs).padStart(2, "0")} left
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <Button asChild variant="outline" className="mt-8 h-11 rounded-full">
          <Link href="/app">Start another focus block</Link>
        </Button>
      </div>

      <div>
        <div className="mb-3 flex justify-center">
          <Spark mood={mood} size={64} />
        </div>
        <PhoneLock nemesis={state.nemesis} unlocks={state.unlocks} />
        <div className="mt-4 flex justify-center">
          <DemoBadge>Unlocks are simulated</DemoBadge>
        </div>
      </div>
    </div>
  );
}

export default function UnlockPage() {
  return (
    <Suspense
      fallback={
        <div className="h-48 animate-pulse rounded-3xl bg-white/4" />
      }
    >
      <UnlockInner />
    </Suspense>
  );
}
