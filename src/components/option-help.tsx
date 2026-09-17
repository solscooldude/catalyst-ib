"use client";

import { Info } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function OptionHelp({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Popover>
      <PopoverTrigger
        type="button"
        aria-label={`What is ${title}?`}
        className="inline-flex size-6 shrink-0 items-center justify-center rounded-full text-zinc-400 ring-1 ring-border hover:text-foreground"
        onClick={(event) => event.stopPropagation()}
      >
        <Info className="size-3.5" />
      </PopoverTrigger>
      <PopoverContent side="bottom" align="start">
        <p className="text-[11px] font-medium tracking-[0.16em] text-zinc-400 uppercase">
          What is this?
        </p>
        <p className="font-heading mt-2 text-sm text-foreground">{title}</p>
        <div className="mt-2 space-y-2 text-xs leading-relaxed text-muted-foreground">
          {children}
        </div>
      </PopoverContent>
    </Popover>
  );
}
