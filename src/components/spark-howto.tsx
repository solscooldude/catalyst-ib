"use client";

import { useState } from "react";
import { Info } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { SPARK_HOW_TO } from "@/lib/spark-play";

export function SparkHowTo() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        aria-label="How to play with Spark"
        className="inline-flex size-8 items-center justify-center rounded-full text-zinc-400 ring-1 ring-border hover:text-foreground"
        onClick={() => setOpen(true)}
      >
        <Info className="size-4" />
      </button>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="bottom"
          className="z-50 mx-auto max-h-[70dvh] max-w-md gap-0 overflow-y-auto rounded-t-[1.5rem]"
        >
          <SheetHeader>
            <SheetTitle>Play with Spark</SheetTitle>
            <SheetDescription>Short taps. No extra copy on the page.</SheetDescription>
          </SheetHeader>
          <ul className="space-y-2.5 px-4 pb-8">
            {SPARK_HOW_TO.map((row) => (
              <li key={row.name} className="flex gap-3 text-sm">
                <span className="w-28 shrink-0 font-medium text-foreground">
                  {row.name}
                </span>
                <span className="text-muted-foreground">{row.how}</span>
              </li>
            ))}
          </ul>
        </SheetContent>
      </Sheet>
    </>
  );
}
