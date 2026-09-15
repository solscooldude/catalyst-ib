"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/routes";
import {
  formatRemaining,
  formatWhen,
  formatWindow,
  remainingMs,
  upcomingWindow,
} from "@/lib/schedule";
import { useCatalyst } from "@/lib/store";

export function ScheduleStatus() {
  const state = useCatalyst();
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 15_000);
    return () => window.clearInterval(id);
  }, []);

  const next = upcomingWindow(state.schedule, now);

  if (state.schedule.length === 0) {
    return (
      <div className="flux-card p-5">
        <p className="text-xs tracking-[0.16em] text-primary uppercase">
          Lock schedule
        </p>
        <p className="mt-2 text-sm text-foreground">
          Set the hours the phone should stay locked. No tokens for the
          schedule itself — start a study block or official task to earn.
        </p>
        <Button asChild variant="outline" className="mt-4 h-10 rounded-full">
          <Link href={ROUTES.schedule}>
            Add lock hours
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
    );
  }

  if (next?.active) {
    return (
      <div className="flux-card p-5 ring-1 ring-primary/25">
        <p className="text-xs tracking-[0.16em] text-primary uppercase">
          Lock window on
        </p>
        <p className="mt-2 text-sm text-foreground">
          {formatWindow(next.window)}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          {formatRemaining(remainingMs(next.window, now))}. Simulated phone
          lock — start a session if you want tokens.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button asChild className="h-10 rounded-full">
            <Link href={`${ROUTES.focus}#study`}>
              Start a study block
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-10 rounded-full">
            <Link href={ROUTES.schedule}>Edit hours</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flux-card p-5">
      <p className="text-xs tracking-[0.16em] text-primary uppercase">
        Next lock window
      </p>
      <p className="mt-2 text-sm text-foreground">
        {next
          ? `${formatWhen(next.startsAt, now)} · ${formatWindow(next.window)}`
          : "Every window is paused."}
      </p>
      <p className="mt-1 text-sm text-muted-foreground">
        Recurring hours. The schedule does not award tokens.
      </p>
      <Button asChild variant="outline" className="mt-4 h-10 rounded-full">
        <Link href={ROUTES.schedule}>Edit schedule</Link>
      </Button>
    </div>
  );
}
