"use client";

import { Info } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CARE_STAGE_GUIDE } from "@/lib/stats";

export function CareStageInfo() {
  return (
    <Popover>
      <PopoverTrigger
        aria-label="What care stages mean"
        className="inline-flex size-6 items-center justify-center rounded-full text-zinc-400 ring-1 ring-border hover:text-foreground"
      >
        <Info className="size-3.5" />
      </PopoverTrigger>
      <PopoverContent side="bottom" align="start">
        <p className="text-[11px] font-medium tracking-[0.16em] text-zinc-400 uppercase">
          Care stages
        </p>
        <ul className="mt-3 space-y-2.5">
          {CARE_STAGE_GUIDE.map((row) => (
            <li key={row.stage}>
              <p className="text-sm font-medium text-foreground">{row.label}</p>
              <p className="text-xs leading-relaxed text-muted-foreground">
                {row.how}
              </p>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-muted-foreground">
          Study time, login streak, and care (snacks, quiz, token catch) all
          move the sprite up. Egg hatches on the first real focus or snack.
        </p>
      </PopoverContent>
    </Popover>
  );
}
