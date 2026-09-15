"use client";

import { useEffect, useMemo, useState } from "react";
import { TokenAmount } from "@/components/mint-chip";
import { Button } from "@/components/ui/button";
import { UNLOCK_CATALOG, formatNemesisList } from "@/lib/constants";
import { spendUnlock, useCatalyst } from "@/lib/store";
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
    () => state.unlocks.filter((unlock) => unlock.expiresAt > now),
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
          <p className="mt-1 text-sm text-zinc-400">
            {active.length === 0
              ? "Nothing unlocked."
              : active
                  .map((unlock) => {
                    const left = Math.max(0, unlock.expiresAt - now);
                    return `${unlock.label} ${formatLeft(left)}`;
                  })
                  .join(" · ")}
          </p>
        </div>
      ) : (
        <p className="text-[11px] font-medium tracking-[0.16em] text-zinc-400 uppercase">
          Unlocks
        </p>
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
                "flex items-center justify-between gap-3 rounded-2xl bg-card ring-1 ring-border",
                compact ? "px-3 py-2" : "px-4 py-3",
              )}
            >
              <div className="min-w-0">
                <p className="truncate text-sm text-foreground">{label}</p>
                {left > 0 ? (
                  <p className="font-mono text-xs text-primary">{formatLeft(left)}</p>
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
    </div>
  );
}

function formatLeft(ms: number) {
  const mins = Math.floor(ms / 60000);
  const secs = Math.floor((ms % 60000) / 1000);
  return `${mins}:${String(secs).padStart(2, "0")} left`;
}
