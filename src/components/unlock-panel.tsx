"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { TokenAmount } from "@/components/mint-chip";
import { ROUTES } from "@/lib/routes";
import {
  NEMESIS_SURCHARGE,
  NEMESIS_UNLOCK_COST,
  TIER2_COST,
  TIER3_COST,
  UNLOCK_TIER_ROWS,
  unlockTierSpendId,
  type UnlockTier,
} from "@/lib/constants";
import {
  UNLOCK_MINUTES,
  type UnlockMinutes,
} from "@/lib/domain-policy";
import { spendUnlockNemesis, spendUnlockTier, useCatalyst } from "@/lib/store";
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
  const [minutes, setMinutes] = useState<UnlockMinutes>(10);

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
    const result = spendUnlockTier(tier, minutes);
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

  function buyNemesis() {
    const result = spendUnlockNemesis(minutes);
    if (!result.ok) {
      setNotice(result.reason);
      return;
    }
    setNotice(
      result.stacked
        ? `Added time to ${result.unlock.label}.`
        : `Opened ${result.unlock.label} (+${NEMESIS_SURCHARGE}).`,
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
            School tools stay allowed during lock. The Chrome extension
            enforces this on other tabs. Tier 3 opens every social app.
            Opening a nemesis costs +{NEMESIS_SURCHARGE} on top of that.
          </p>
          <DurationPicker minutes={minutes} onChange={setMinutes} />
        </div>
      ) : (
        <div>
          {collapsible ? null : (
            <p className="text-[11px] font-medium tracking-[0.16em] text-zinc-400 uppercase">
              Unlocks
            </p>
          )}
          <p className="mt-1 text-[11px] leading-4 text-muted-foreground">
            School sites stay allowed. The extension blocks distractors.
            Nemesis is +{NEMESIS_SURCHARGE}.
          </p>
          <DurationPicker minutes={minutes} onChange={setMinutes} compact />
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
            minutes={minutes}
            compact={compact}
            hasNemeses={state.nemeses.length > 0}
            onBuy={buy}
            onBuyNemesis={buyNemesis}
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
  minutes = 10,
  compact = false,
  detailed = false,
  hasNemeses = false,
  onBuy,
  onBuyNemesis,
}: {
  tokens: number;
  active: { id: string; catalogId: string; expiresAt: number; label?: string }[];
  now: number;
  minutes?: UnlockMinutes;
  compact?: boolean;
  detailed?: boolean;
  hasNemeses?: boolean;
  onBuy: (tier: UnlockTier) => void;
  onBuyNemesis?: () => void;
}) {
  const blocks = Math.max(1, Math.round(minutes / 10));
  return (
    <div className={cn("grid gap-3", compact ? "grid-cols-1" : "sm:grid-cols-2")}>
      {([2, 3] as const).map((tier) => {
        const spendId = unlockTierSpendId(tier);
        const cost = (tier === 2 ? TIER2_COST : TIER3_COST) * blocks;
        const row = UNLOCK_TIER_ROWS.find((item) => item.id === spendId);
        const current = active.find((unlock) => unlock.catalogId === spendId);
        const left = current ? Math.max(0, current.expiresAt - now) : 0;
        const affordable = tokens >= cost;
        const label = tier === 2 ? "Unlock Tier 2" : "Unlock Tier 3";
        return (
          <button
            key={tier}
            type="button"
            disabled={!affordable}
            onClick={() => onBuy(tier)}
            className={cn(
              "text-left transition-colors disabled:opacity-45",
              compact
                ? "flex min-h-14 items-center justify-between rounded-2xl px-4 py-3"
                : "min-h-[8.5rem] rounded-[1.75rem] px-6 py-6",
              left > 0 || affordable
                ? "bg-primary text-primary-foreground shadow-[0_16px_40px_-24px_rgb(94_234_212/0.9)] ring-2 ring-primary"
                : "bg-card text-foreground ring-2 ring-border",
            )}
          >
            <p
              className={cn(
                "font-semibold tracking-tight",
                compact ? "text-lg" : "text-2xl",
              )}
            >
              {left > 0 ? `Add time · ${label}` : label}
            </p>
            <p
              className={cn(
                compact ? "text-sm" : "mt-2 text-sm",
                left > 0 || affordable
                  ? "text-primary-foreground/80"
                  : "text-zinc-500",
              )}
            >
              <span className="inline-flex items-center gap-1.5">
                <TokenAmount
                  value={cost}
                  mark={left > 0 || affordable ? "cream" : "ink"}
                />
                / {minutes} min · {tier === 2 ? "whole tier" : "all social"}
              </span>
            </p>
            {left > 0 ? (
              <p
                className={cn(
                  "font-heading font-mono tabular-nums",
                  compact ? "mt-1 text-xs" : "mt-3 text-sm",
                )}
              >
                {formatUnlockLeft(left)} left
              </p>
            ) : detailed && row ? (
              <p
                className={cn(
                  "mt-3 text-xs",
                  left > 0 || affordable
                    ? "text-primary-foreground/75"
                    : "text-zinc-500",
                )}
              >
                {row.blurb}
              </p>
            ) : null}
          </button>
        );
      })}
      {hasNemeses && onBuyNemesis ? (
        <NemesisUnlockButton
          tokens={tokens}
          active={active}
          now={now}
          minutes={minutes}
          compact={compact}
          detailed={detailed}
          onBuy={onBuyNemesis}
        />
      ) : null}
    </div>
  );
}

export function DurationPicker({
  minutes,
  onChange,
  compact = false,
}: {
  minutes: UnlockMinutes;
  onChange: (value: UnlockMinutes) => void;
  compact?: boolean;
}) {
  return (
    <div className={cn("flex flex-wrap gap-2", compact ? "mt-2" : "mt-4")}>
      {UNLOCK_MINUTES.map((value) => (
        <button
          key={value}
          type="button"
          onClick={() => onChange(value)}
          className={cn(
            "h-9 rounded-full px-3 text-xs ring-1",
            minutes === value
              ? "bg-primary/15 text-foreground ring-primary/40"
              : "text-muted-foreground ring-border",
          )}
        >
          {value} min
        </button>
      ))}
    </div>
  );
}

function NemesisUnlockButton({
  tokens,
  active,
  now,
  minutes = 10,
  compact,
  detailed,
  onBuy,
}: {
  tokens: number;
  active: { id: string; catalogId: string; expiresAt: number; label?: string }[];
  now: number;
  minutes?: UnlockMinutes;
  compact: boolean;
  detailed: boolean;
  onBuy: () => void;
}) {
  const blocks = Math.max(1, Math.round(minutes / 10));
  const cost = NEMESIS_UNLOCK_COST * blocks;
  const row = UNLOCK_TIER_ROWS.find((item) => item.id === "nemesis");
  const current = active.find((unlock) => unlock.catalogId === "nemesis");
  const left = current ? Math.max(0, current.expiresAt - now) : 0;
  const affordable = tokens >= cost;
  return (
    <button
      type="button"
      disabled={!affordable}
      onClick={onBuy}
      className={cn(
        "text-left transition-colors disabled:opacity-45",
        compact
          ? "flex min-h-14 items-center justify-between rounded-2xl px-4 py-3"
          : "min-h-[8.5rem] rounded-[1.75rem] px-6 py-6 sm:col-span-2",
        left > 0 || affordable
          ? "bg-primary text-primary-foreground shadow-[0_16px_40px_-24px_rgb(94_234_212/0.9)] ring-2 ring-primary"
          : "bg-card text-foreground ring-2 ring-border",
      )}
    >
      <div className={cn(compact && "flex flex-1 items-center justify-between gap-3")}>
        <p
          className={cn(
            "font-semibold tracking-tight",
            compact ? "text-lg" : "text-2xl",
          )}
        >
          {left > 0 ? "Add time · Open nemesis" : "Open nemesis"}
        </p>
        <p
          className={cn(
            compact ? "text-sm" : "mt-2 text-sm",
            left > 0 || affordable
              ? "text-primary-foreground/80"
              : "text-zinc-500",
          )}
        >
          <span className="inline-flex flex-wrap items-center gap-1.5">
            <TokenAmount
              value={cost}
              mark={left > 0 || affordable ? "cream" : "ink"}
            />
            / {minutes} min
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase",
                left > 0 || affordable
                  ? "bg-black/15 text-primary-foreground"
                  : "bg-primary/15 text-primary",
              )}
            >
              +{NEMESIS_SURCHARGE} on Tier 3
            </span>
          </span>
        </p>
      </div>
      {left > 0 ? (
        <p
          className={cn(
            "font-heading font-mono tabular-nums",
            compact ? "mt-1 text-xs" : "mt-3 text-sm",
          )}
        >
          {formatUnlockLeft(left)} left
        </p>
      ) : detailed && row ? (
        <p
          className={cn(
            "mt-3 text-xs",
            left > 0 || affordable
              ? "text-primary-foreground/75"
              : "text-zinc-500",
          )}
        >
          {row.blurb}
        </p>
      ) : (
        <p
          className={cn(
            compact ? "sr-only" : "mt-3 text-xs",
            left > 0 || affordable
              ? "text-primary-foreground/75"
              : "text-zinc-500",
          )}
        >
          {TIER3_COST}+{NEMESIS_SURCHARGE} = {NEMESIS_UNLOCK_COST}. Your worst
          apps stay locked until you pay the extra token.
        </p>
      )}
    </button>
  );
}

/** @deprecated Use UnlockTierShop — kept so older imports still type-check. */
export const UnlockShopList = UnlockTierShop;
