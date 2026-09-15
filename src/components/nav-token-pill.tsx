"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { TokenChip } from "@/components/token-chip";
import { ROUTES } from "@/lib/routes";
import { formatUnlockLeft } from "@/lib/unlock-time";
import { useCatalyst } from "@/lib/store";

export function NavTokenPill() {
  const state = useCatalyst();
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const soonest = useMemo(() => {
    const active = state.unlocks.filter((unlock) => unlock.expiresAt > now);
    if (active.length === 0) return null;
    return Math.min(...active.map((unlock) => unlock.expiresAt - now));
  }, [state.unlocks, now]);

  const live = soonest != null ? `${formatUnlockLeft(soonest)} on` : null;

  return (
    <Link
      href={`${ROUTES.home}#unlocks`}
      aria-label={
        live
          ? `${state.tokens} tokens · unlock ${live}`
          : `${state.tokens} tokens · app unlocks`
      }
      title="App unlocks"
      className="rounded-full transition-opacity hover:opacity-80"
    >
      <TokenChip tokens={state.tokens} live={live} />
    </Link>
  );
}
