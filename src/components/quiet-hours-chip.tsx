"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Moon } from "lucide-react";
import { ROUTES } from "@/lib/routes";
import {
  formatClock,
  formatWindow,
  todaysLockWindow,
  windowContains,
} from "@/lib/schedule";
import { useCatalyst } from "@/lib/store";

export function QuietHoursChip() {
  const state = useCatalyst();
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 15_000);
    return () => window.clearInterval(id);
  }, []);

  const today = todaysLockWindow(state.schedule, now);
  const line =
    state.schedule.length === 0
      ? "No lock window yet."
      : today
        ? windowContains(today, now)
          ? `On now · ${formatClock(today.start)}–${formatClock(today.end)}`
          : `Today · ${formatClock(today.start)}–${formatClock(today.end)}`
        : "Off today.";

  return (
    <section className="flux-card flex flex-col gap-3 px-6 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8">
      <p className="inline-flex items-center gap-2 text-sm font-medium text-foreground">
        <Moon className="size-3.5 text-primary" />
        <span className="sr-only">Quiet hours</span>
        {line}
      </p>
      <Link
        href={ROUTES.schedule}
        className="text-sm font-medium text-zinc-700 underline-offset-4 hover:underline dark:text-zinc-200"
        title={today ? formatWindow(today) : "Set lock hours"}
      >
        {state.schedule.length === 0 ? "Add hours" : "Edit hours"}
      </Link>
    </section>
  );
}
