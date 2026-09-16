"use client";

import { Check } from "lucide-react";
import type { SchoolProvider } from "@/lib/school-provider";
import { providerLabel } from "@/lib/school-provider";
import { cn } from "@/lib/utils";

export function SchoolProviderPicker({
  value,
  onPick,
}: {
  value: SchoolProvider | null;
  onPick: (provider: SchoolProvider) => void;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {(["managebac", "classroom"] as const).map((id) => {
        const selected = value === id;
        return (
          <button
            key={id}
            type="button"
            onClick={() => onPick(id)}
            className={cn(
              "rounded-2xl bg-zinc-50 p-4 text-left ring-1 transition-colors dark:bg-zinc-900",
              selected
                ? "ring-primary/50"
                : "ring-transparent hover:ring-primary/20",
            )}
          >
            <div className="flex items-center justify-between gap-3">
              <span className="text-base text-foreground">
                {providerLabel(id)}
              </span>
              {selected ? <Check className="size-4 text-primary" /> : null}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {id === "classroom"
                ? "Personal Google. Live pull when OAuth keys are set."
                : "No student OAuth. Scan, ICS, or add by hand — no scrape."}
            </p>
          </button>
        );
      })}
    </div>
  );
}
