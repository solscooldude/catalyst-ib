"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { TokenAmount } from "@/components/mint-chip";
import { ROUTES } from "@/lib/routes";
import { Button } from "@/components/ui/button";
import {
  TIER2_COST,
  TIER3_COST,
  UNLOCK_TIER_ROWS,
  unlockTierSpendId,
  type UnlockTier,
} from "@/lib/constants";
import { spendUnlockTier, useCatalyst } from "@/lib/store";
import { formatUnlockLeft } from "@/lib/unlock-time";
import { cn } from "@/lib/utils";

export function UnlockPanel({
  compact = false,
  collapsible = false,
  className,
}: {
  compact?: boolean;
  collapsible?: boolean;
  className?: string;
}) {
  const state = useCatalyst();
  const [now, setNow] = useState(() => Date.now());
  const [notice, setNotice] = useState<string | null>(null);
  const [open, setOpen] = useState(!collapsible);

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const active = useMemo(
    () =>
      state.unlocks
        .filter((unlock) => unlock.expiresAt > now)
        .sort((a, b) => a.expiresAt - b.expiresAt),
    [state.unlocks, now],
  );

  function buy(tier: UnlockTier) {
    const result = spendUnlockTier(tier);
    if (!result.ok) {
      setNotice(result.reason);
      return;
    }
    setNotice(
      result.stacked
        ? `Added time to ${result.unlock.label}.`
        : `Unlocked ${result.unlock.label}.`,
    );
  }

  return (
    <div className={cn(compact ? "space-y-2" : "space-y-3", className)}>
      {collapsible ? (
        <button
          type="button"
          className="flex w-full items-center justify-between rounded-2xl bg-card px-3 py-2 text-left ring-1 ring-border"
          aria-expanded={open}
          onClick={() => setOpen((current) => !current)}
        >
          <span className="text-[11px] font-medium tracking-[0.16em] text-zinc-400 uppercase">
            Unlocks
          </span>
          <span className="text-xs text-foreground">{open ? "Hide" : "Show"}</span>
        </button>
      ) : null}
      {!open && collapsible ? null : !compact ? (
        <div>
          <p className="text-[11px] font-medium tracking-[0.16em] text-zinc-400 uppercase">
            App unlocks
          </p>
          {active.length === 0 ? (
            <p className="font-heading mt-2 text-3xl text-foreground">Off</p>
          ) : (
            <div className="mt-2">
              <p className="font-heading text-4xl tabular-nums tracking-tight text-foreground">
                {formatUnlockLeft(Math.max(0, active[0].expiresAt - now))}
              </p>
              <div className="mt-3 space-y-1.5 rounded-2xl bg-primary/15 px-4 py-3">
                {active.map((unlock) => {
                  const left = Math.max(0, unlock.expiresAt - now);
                  return (
                    <p
                      key={unlock.id}
                      className="flex items-center justify-between gap-3 text-sm text-foreground"
                    >
                      <span>{unlock.label}</span>
                      <span className="font-mono tabular-nums">
                        {formatUnlockLeft(left)}
                      </span>
                    </p>
                  );
                })}
              </div>
            </div>
          )}
          <p className="mt-3 text-xs leading-5 text-muted-foreground">
            School tools stay allowed during lock. Spend unlocks a whole tier
            — not one app at a time.
          </p>
        </div>
      ) : (
        <div>
          {collapsible ? null : (
            <p className="text-[11px] font-medium tracking-[0.16em] text-zinc-400 uppercase">
              Unlocks
            </p>
          )}
          <p className="mt-1 text-[11px] leading-4 text-muted-foreground">
            School / essentials stay allowed. Unlock a whole tier.
          </p>
          {active.length > 0 ? (
            <p className="mt-1 font-mono text-xs text-primary">
              {active
                .map(
                  (unlock) =>
                    `${unlock.label} ${formatUnlockLeft(Math.max(0, unlock.expiresAt - now))}`,
                )
                .join(" · ")}
            </p>
          ) : null}
        </div>
      )}

      {collapsible && !open ? null : (
        <>
          <UnlockTierShop
            tokens={state.tokens}
            active={active}
            now={now}
            compact={compact}
            onBuy={buy}
          />
          {notice ? <p className="text-sm text-primary">{notice}</p> : null}
          <Link
            href={ROUTES.unlocks}
            className="inline-block text-xs text-zinc-400 hover:text-foreground"
          >
            Unlocks page
          </Link>
        </>
      )}
    </div>
  );
}

export function UnlockTierShop({
  tokens,
  active,
  now,
  compact = false,
  detailed = false,
  onBuy,
}: {
  tokens: number;
  active: { id: string; catalogId: string; expiresAt: number; label?: string }[];
  now: number;
  compact?: boolean;
  detailed?: boolean;
  onBuy: (tier: UnlockTier) => void;
}) {
  return (
    <div className={cn("grid gap-3", compact ? "grid-cols-1" : "sm:grid-cols-2")}>
      {([2, 3] as const).map((tier) => {
        const spendId = unlockTierSpendId(tier);
        const cost = tier === 2 ? TIER2_COST : TIER3_COST;
        const row = UNLOCK_TIER_ROWS.find((item) => item.id === spendId);
        const current = active.find((unlock) => unlock.catalogId === spendId);
        const left = current ? Math.max(0, current.expiresAt - now) : 0;
        const affordable = tokens >= cost;
        return (
          <div
            key={tier}
            className={cn(
              "flex flex-col gap-3 rounded-2xl bg-card ring-1",
              left > 0 ? "ring-primary/50" : "ring-border",
              compact ? "px-3 py-3" : "px-4 py-4",
            )}
          >
            <div>
              <p className="text-sm font-medium text-foreground">
                {tier === 2 ? "Unlock Tier 2" : "Unlock Tier 3"}
              </p>
              {detailed && row ? (
                <p className="mt-1 text-xs text-muted-foreground">{row.blurb}</p>
              ) : (
                <p className="mt-1 text-xs text-muted-foreground">
                  {cost} tokens / 10 min · whole tier
                </p>
              )}
              {left > 0 ? (
                <p className="font-heading mt-1 font-mono text-sm tabular-nums text-primary">
                  {formatUnlockLeft(left)} left
                </p>
              ) : null}
            </div>
            <Button
              className={cn("rounded-full", compact ? "h-10" : "h-11")}
              disabled={!affordable}
              onClick={() => onBuy(tier)}
            >
              <span className="inline-flex items-center gap-1.5">
                {left > 0 ? "Add time" : tier === 2 ? "Unlock Tier 2" : "Unlock Tier 3"}
                <TokenAmount value={cost} mark="ink" />
              </span>
            </Button>
          </div>
        );
      })}
    </div>
  );
}

/** @deprecated Use UnlockTierShop — kept so older imports still type-check. */
export const UnlockShopList = UnlockTierShop;
