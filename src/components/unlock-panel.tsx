"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { TokenAmount } from "@/components/mint-chip";
import { ROUTES } from "@/lib/routes";
import { Button } from "@/components/ui/button";
import { UNLOCK_CATALOG, formatNemesisList } from "@/lib/constants";
import { spendUnlock, useCatalyst } from "@/lib/store";
import { formatUnlockLeft } from "@/lib/unlock-time";
import { cn } from "@/lib/utils";

export function UnlockPanel({
  compact = false,
  className,
}: {
  compact?: boolean;
  className?: string;
}) {
  const state = useCatalyst();
  const [now, setNow] = useState(() => Date.now());
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const nemesisLabel = formatNemesisList(state.nemeses);
  const active = useMemo(
    () =>
      state.unlocks
        .filter((unlock) => unlock.expiresAt > now)
        .sort((a, b) => a.expiresAt - b.expiresAt),
    [state.unlocks, now],
  );

  function buy(id: (typeof UNLOCK_CATALOG)[number]["id"]) {
    const result = spendUnlock(id);
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
      {!compact ? (
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
        </div>
      ) : (
        <div>
          <p className="text-[11px] font-medium tracking-[0.16em] text-zinc-400 uppercase">
            Unlocks
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

      <div className={cn("space-y-2", compact && "space-y-1.5")}>
        {UNLOCK_CATALOG.map((item) => {
          const label = item.id === "nemesis" ? nemesisLabel : item.name;
          const affordable = state.tokens >= item.cost;
          const current = active.find((unlock) => unlock.catalogId === item.id);
          const left = current ? Math.max(0, current.expiresAt - now) : 0;
          return (
            <div
              key={item.id}
              className={cn(
                "flex items-center justify-between gap-3 rounded-2xl bg-card ring-1",
                left > 0 ? "ring-primary/50" : "ring-border",
                compact ? "px-3 py-2" : "px-4 py-3",
              )}
            >
              <div className="min-w-0">
                <p className="truncate text-sm text-foreground">{label}</p>
                {left > 0 ? (
                  <p className="font-heading font-mono text-sm tabular-nums text-primary">
                    {formatUnlockLeft(left)} left
                  </p>
                ) : compact ? null : (
                  <p className="text-xs text-muted-foreground">{item.intensity}</p>
                )}
              </div>
              <Button
                className={cn("rounded-full", compact ? "h-9 px-3" : "h-10")}
                disabled={!affordable}
                onClick={() => buy(item.id)}
              >
                <span className="inline-flex items-center gap-1.5">
                  {left > 0 ? "Add time" : "Unlock"}
                  <TokenAmount value={item.cost} mark="ink" />
                </span>
              </Button>
            </div>
          );
        })}
      </div>
      {notice ? <p className="text-sm text-primary">{notice}</p> : null}
      <Link
        href={ROUTES.unlocks}
        className="inline-block text-xs text-zinc-400 hover:text-foreground"
      >
        Unlocks page
      </Link>
    </div>
  );
}
