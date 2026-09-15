"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Moon } from "lucide-react";
import { ROUTES } from "@/lib/routes";
import {
  formatRemaining,
  formatWhen,
  formatWindow,
  remainingMs,
  upcomingWindow,
} from "@/lib/schedule";
import { useCatalyst } from "@/lib/store";

export function QuietHoursChip() {
  const state = useCatalyst();
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 15_000);
    return () => window.clearInterval(id);
  }, []);

  const next = upcomingWindow(state.schedule, now);

  return (
    <section className="flux-card flex flex-col gap-3 px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="inline-flex items-center gap-2 text-[11px] font-medium tracking-[0.16em] text-zinc-400 uppercase">
          <Moon className="size-3.5 text-primary" />
          Quiet hours
        </p>
        {state.schedule.length === 0 ? (
          <p className="mt-2 text-sm text-foreground">
            No lock window yet. Set one in Setup.
          </p>
        ) : next?.active ? (
          <>
            <p className="mt-2 text-sm font-medium text-foreground">
              On now · {formatWindow(next.window)}
            </p>
            <p className="mt-1 text-sm text-zinc-400">
              {formatRemaining(remainingMs(next.window, now))} left.
            </p>
          </>
        ) : (
          <>
            <p className="mt-2 text-sm font-medium text-foreground">
              {next
                ? `${formatWhen(next.startsAt, now)} · ${formatWindow(next.window)}`
                : "Every window is paused."}
            </p>
            <p className="mt-1 text-sm text-zinc-400">
              Today&apos;s lock hours from Setup.
            </p>
          </>
        )}
      </div>
      <Link
        href={ROUTES.schedule}
        className="text-sm font-medium text-zinc-700 underline-offset-4 hover:underline dark:text-zinc-200"
      >
        {state.schedule.length === 0 ? "Add hours" : "Edit hours"}
      </Link>
    </section>
  );
}
