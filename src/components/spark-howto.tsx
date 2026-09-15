"use client";

import { useState } from "react";
import { Info } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SPARK_HOW_TO } from "@/lib/spark-play";

export function SparkHowTo() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        aria-label="How to play with the sprite"
        className="inline-flex size-8 items-center justify-center rounded-full text-zinc-400 ring-1 ring-border hover:text-foreground"
        onClick={() => setOpen(true)}
      >
        <Info className="size-4" />
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="flex max-h-[min(82dvh,36rem)] w-[min(28rem,calc(100vw-1.5rem))] max-w-md flex-col overflow-hidden p-0 sm:max-w-md">
          <DialogHeader className="shrink-0 px-5 pt-5 pr-12">
            <DialogTitle>Play with the sprite</DialogTitle>
            <DialogDescription>Short taps. No extra copy on the page.</DialogDescription>
          </DialogHeader>
          <ul className="min-h-0 flex-1 space-y-2.5 overflow-y-auto px-5 pb-6">
            {SPARK_HOW_TO.map((row) => (
              <li key={row.name} className="flex gap-3 text-sm">
                <span className="w-28 shrink-0 font-medium text-foreground">
                  {row.name}
                </span>
                <span className="text-muted-foreground">{row.how}</span>
              </li>
            ))}
          </ul>
        </DialogContent>
      </Dialog>
    </>
  );
}
