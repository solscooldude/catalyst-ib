"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { WEEKDAYS } from "@/lib/schedule";
import { cn } from "@/lib/utils";

const timeClass =
  "h-11 w-full rounded-xl border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30";

export function LockHoursPicker({
  days,
  start,
  end,
  error,
  onToggleDay,
  onStart,
  onEnd,
  onAdd,
  onPreset,
  onWeeknights,
  addLabel = "Save lock hours",
}: {
  days: number[];
  start: string;
  end: string;
  error?: string | null;
  onToggleDay: (day: number) => void;
  onStart: (value: string) => void;
  onEnd: (value: string) => void;
  onAdd: () => void;
  onPreset: () => void;
  onWeeknights?: () => void;
  addLabel?: string;
}) {
  return (
    <div className="space-y-4">
      <div>
        <Label>Days</Label>
        <div className="mt-2 flex flex-wrap gap-2">
          {WEEKDAYS.map((row) => {
            const on = days.includes(row.day);
            return (
              <button
                key={row.day}
                type="button"
                onClick={() => onToggleDay(row.day)}
                className={cn(
                  "rounded-full px-3 py-1.5 text-xs ring-1",
                  on
                    ? "bg-primary/15 text-foreground ring-primary/40"
                    : "text-muted-foreground ring-border",
                )}
              >
                {row.short}
              </button>
            );
          })}
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="lock-start">Start</Label>
          <input
            id="lock-start"
            type="time"
            value={start}
            onChange={(event) => onStart(event.target.value)}
            className={timeClass}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lock-end">End</Label>
          <input
            id="lock-end"
            type="time"
            value={end}
            onChange={(event) => onEnd(event.target.value)}
            className={timeClass}
          />
        </div>
      </div>
      {error ? (
        <p
          className={
            error.includes("already saved")
              ? "text-sm text-muted-foreground"
              : "text-sm text-rose-300"
          }
        >
          {error}
        </p>
      ) : null}
      <div className="flex flex-wrap gap-2">
        <Button type="button" className="h-11 rounded-full px-5" onClick={onAdd}>
          {addLabel}
        </Button>
        <Button
          type="button"
          variant="outline"
          className="h-11 rounded-full px-5"
          onClick={onPreset}
        >
          After school 4:30–7:30
        </Button>
        {onWeeknights ? (
          <Button
            type="button"
            variant="outline"
            className="h-11 rounded-full px-5"
            onClick={onWeeknights}
          >
            Weeknights 7–10pm
          </Button>
        ) : null}
      </div>
    </div>
  );
}
