"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { DemoBadge } from "@/components/demo-badge";
import { PhoneLock } from "@/components/phone-lock";
import { Spark } from "@/components/spark";
import { TokenChip } from "@/components/token-chip";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/routes";
import { SessionRecapCard } from "@/components/session-recap";
import { readSessionRecap } from "@/lib/session-recap";
import { PageFrame } from "@/components/page-frame";
import { UnlockTierShop } from "@/components/unlock-panel";
import {
  spendUnlockNemesis,
  spendUnlockTier,
  useCatalyst,
} from "@/lib/store";
import {
  ESSENTIAL_APPS,
  NEMESIS_APPS,
  NEMESIS_SURCHARGE,
  NEMESIS_UNLOCK_COST,
  TIER2_APPS,
  TIER3_APPS,
  TIER3_COST,
  type UnlockTier,
} from "@/lib/constants";

function UnlockInner() {
  const router = useRouter();
  const params = useSearchParams();
  const state = useCatalyst();
  const [now, setNow] = useState(() => Date.now());
  const [notice, setNotice] = useState<string | null>(null);
  const [arrivedAt] = useState(() => Date.now());
  const earned = params.get("earned") === "1";

  useEffect(() => {
    if (!state.hydrated) return;
    if (!state.setupComplete) router.replace(ROUTES.setup);
  }, [state.hydrated, state.setupComplete, router]);

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const lastSession =
    state.session?.status === "completed" ? state.session : null;
  const lastLog = state.logs[state.logs.length - 1];
  const stored = readSessionRecap();
  const paramMinutes = Number(params.get("minutes"));
  const paramElapsed = Number(params.get("elapsed"));
  const paramTokens = Number(params.get("tokens"));
  const elapsedMs =
    Number.isFinite(paramElapsed) && paramElapsed >= 0
      ? paramElapsed
      : (stored?.elapsedMs ?? lastLog?.durationMs ?? null);
  const minutes =
    Number.isFinite(paramMinutes) && paramMinutes >= 0
      ? paramMinutes
      : elapsedMs != null
        ? Math.round(elapsedMs / 60000)
        : (stored?.minutes ?? 0);
  const recap =
    earned
      ? {
          title:
            lastSession?.title ??
            stored?.title ??
            lastLog?.subjectLabel ??
            "Focus session",
          minutes,
          elapsedMs: elapsedMs ?? minutes * 60_000,
          tokens:
            Number.isFinite(paramTokens) && paramTokens >= 0
              ? paramTokens
              : (lastSession?.tokensEarned ?? stored?.tokens ?? 0),
          timeTokens:
            lastSession?.timeTokens ?? stored?.timeTokens ?? lastLog?.timeTokens ?? 0,
          completionTokens:
            lastSession?.completionTokens ??
            stored?.completionTokens ??
            lastLog?.completionTokens ??
            0,
          kind: lastSession?.kind ?? stored?.kind ?? "study",
          endedAt: lastSession?.completedAt ?? stored?.endedAt ?? Date.now(),
        }
      : null;
  const mood =
    recap && now - arrivedAt < 5200 ? "done" : "tempted";

  const active = useMemo(
    () => state.unlocks.filter((unlock) => unlock.expiresAt > now),
    [state.unlocks, now],
  );

  if (!state.setupComplete) return null;

  function buy(tier: UnlockTier) {
    const result = spendUnlockTier(tier);
    if (!result.ok) {
      setNotice(result.reason);
      return;
    }
    setNotice(
      result.stacked
        ? `Added time to ${result.unlock.label}. One timer, stacked.`
        : `Unlocked ${result.unlock.label}. Buy again to add more time.`,
    );
  }

  function buyNemesis() {
    const result = spendUnlockNemesis();
    if (!result.ok) {
      setNotice(result.reason);
      return;
    }
    setNotice(
      result.stacked
        ? `Added time to ${result.unlock.label}. One timer, stacked.`
        : `Opened ${result.unlock.label} (+${NEMESIS_SURCHARGE}). Buy again to add more time.`,
    );
  }

  return (
    <PageFrame className="grid gap-6 space-y-0 lg:grid-cols-[1.05fr_0.95fr]">
      <div className="flux-card px-6 py-8 sm:px-8">
        {recap ? <SessionRecapCard recap={recap} /> : null}

        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs tracking-[0.2em] text-muted-foreground uppercase">
              {recap ? "Session" : "App unlocks"}
            </p>
            <h1 className="mt-3 text-4xl text-foreground">
              {recap ? "Recap" : "Unlocks"}
            </h1>
          </div>
          <TokenChip tokens={state.tokens} />
        </div>

        <p className="mt-6 text-sm leading-6 text-muted-foreground">
          Buying unlocks a whole tier for the time block — not one app. Tier 3
          opens every social app. Opening a nemesis costs +{NEMESIS_SURCHARGE}{" "}
          on top of the Tier 3 price ({TIER3_COST}+{NEMESIS_SURCHARGE} ={" "}
          {NEMESIS_UNLOCK_COST}).
        </p>

        <div className="mt-5 space-y-3 text-sm">
          <TierDescribe
            title="School / allowed"
            note="Stay free. Not sold."
            apps={ESSENTIAL_APPS}
          />
          <TierDescribe
            title="Tier 2 includes"
            note="10 tokens / 10 min for the whole tier."
            apps={TIER2_APPS}
          />
          <TierDescribe
            title="Tier 3 — social"
            note="15 tokens / 10 min. Default-locked during quiet hours."
            apps={TIER3_APPS}
          />
          <TierDescribe
            title="Your nemeses"
            note={`${NEMESIS_UNLOCK_COST} tokens / 10 min (+${NEMESIS_SURCHARGE} on Tier 3).`}
            apps={
              state.nemeses.length > 0
                ? NEMESIS_APPS.filter((app) => state.nemeses.includes(app.id))
                : [{ id: "none", name: "None picked yet — finish Setup" }]
            }
          />
        </div>

        <div className="mt-6">
          <UnlockTierShop
            tokens={state.tokens}
            active={active}
            now={now}
            hasNemeses={state.nemeses.length > 0}
            onBuy={buy}
            onBuyNemesis={buyNemesis}
          />
        </div>

        {notice ? (
          <p className="mt-4 text-sm text-primary">{notice}</p>
        ) : null}

        <div className="mt-8">
          <p className="text-xs tracking-[0.16em] text-muted-foreground uppercase">
            Active
          </p>
          {active.length === 0 ? (
            <p className="mt-3 text-sm text-muted-foreground">Nothing unlocked.</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {active.map((unlock) => {
                const left = Math.max(0, unlock.expiresAt - now);
                const mins = Math.floor(left / 60000);
                const secs = Math.floor((left % 60000) / 1000);
                return (
                  <li
                    key={unlock.id}
                    className="flex items-center justify-between rounded-2xl bg-card px-4 py-3 text-sm ring-1 ring-border"
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

        <div className="mt-8 flex flex-wrap gap-2">
          <Button asChild variant="outline" className="h-11 rounded-full">
            <Link href={`${ROUTES.home}#unlocks`}>Home</Link>
          </Button>
          <Button asChild className="h-11 rounded-full">
            <Link href={ROUTES.focus}>Focus</Link>
          </Button>
        </div>
      </div>

      <div>
        <div className="mb-3 flex justify-center">
          <Spark
            mood={mood}
            act={recap && mood === "done" ? "celebrate" : undefined}
            flourish={recap ? "now" : "loop"}
            taskId={lastSession?.taskId}
            subject={lastSession?.subjectId}
            size={64}
            pettable
          />
        </div>
        <PhoneLock nemeses={state.nemeses} unlocks={state.unlocks} />
        <div className="mt-4 flex justify-center">
          <DemoBadge>Unlocks are simulated</DemoBadge>
        </div>
      </div>
    </PageFrame>
  );
}

function TierDescribe({
  title,
  note,
  apps,
}: {
  title: string;
  note: string;
  apps: readonly { id: string; name: string }[];
}) {
  return (
    <div className="rounded-2xl bg-card px-4 py-4 ring-1 ring-border">
      <p className="font-medium text-foreground">{title}</p>
      <p className="mt-1 text-muted-foreground">{note}</p>
      <ul className="mt-3 flex flex-wrap gap-1.5">
        {apps.map((app) => (
          <li
            key={app.id}
            className="rounded-full bg-background px-2.5 py-1 text-xs text-foreground ring-1 ring-border"
          >
            {app.name}
          </li>
        ))}
      </ul>
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
