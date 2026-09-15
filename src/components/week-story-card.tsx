"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Download, Share } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  drawWeekStory,
  shareWeekStory,
  STORY_HEIGHT,
  STORY_WIDTH,
  type WeekStoryStats,
  weekStoryPngBlob,
  weekStoryFilename,
} from "@/lib/week-story";
import { cn } from "@/lib/utils";

export function WeekStoryPreview({
  story,
  className,
}: {
  story: WeekStoryStats;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const labelId = useId();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let cancelled = false;
    drawWeekStory(ctx, story);
    if (typeof document !== "undefined" && "fonts" in document) {
      void document.fonts.ready.then(() => {
        if (!cancelled) drawWeekStory(ctx, story);
      });
    }
    return () => {
      cancelled = true;
    };
  }, [story]);

  return (
    <div className={cn("mx-auto w-[min(100%,17.5rem)]", className)}>
      <canvas
        ref={canvasRef}
        width={STORY_WIDTH}
        height={STORY_HEIGHT}
        className="aspect-[9/16] w-full rounded-[1.6rem] bg-[#F4F4F5] shadow-[0_18px_50px_rgba(15,15,20,0.12)] ring-1 ring-zinc-200/80"
        role="img"
        aria-labelledby={labelId}
      />
      <p id={labelId} className="sr-only">
        {story.empty
          ? `Weekly Instagram Story card for ${story.weekLabel}. No sessions yet.`
          : `Weekly Instagram Story card for ${story.weekLabel}. Top subject ${story.topSubject}, ${story.streakDays} day streak, ${story.studyLabel} studied, ${story.tokensEarned} tokens.`}
      </p>
    </div>
  );
}

export function WeekStoryActions({
  story,
  className,
}: {
  story: WeekStoryStats;
  className?: string;
}) {
  const [status, setStatus] = useState<
    "idle" | "working" | "saved" | "shared" | "error"
  >("idle");
  const [error, setError] = useState<string | null>(null);

  async function save() {
    setStatus("working");
    setError(null);
    try {
      const blob = await weekStoryPngBlob(story);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = weekStoryFilename();
      document.body.append(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 2_000);
      setStatus("saved");
    } catch {
      setStatus("error");
      setError("Couldn’t make the image. Try Save again.");
    }
  }

  async function share() {
    setStatus("working");
    setError(null);
    try {
      const result = await shareWeekStory(story);
      setStatus(result === "shared" ? "shared" : "saved");
    } catch (cause) {
      if (cause instanceof DOMException && cause.name === "AbortError") {
        setStatus("idle");
        return;
      }
      setStatus("error");
      setError("Share didn’t go through. Save the PNG instead.");
    }
  }

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex flex-col gap-2 sm:flex-row">
        <Button
          type="button"
          onClick={() => void save()}
          disabled={status === "working"}
          className="h-11 flex-1 rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground shadow-none hover:bg-primary/85"
        >
          <Download className="size-4" />
          {status === "working" ? "Making Story…" : "Save 9:16 image"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => void share()}
          disabled={status === "working"}
          className="h-11 flex-1 rounded-full"
        >
          <Share className="size-4" />
          Share
        </Button>
      </div>
      {status === "saved" ? (
        <p className="text-sm text-muted-foreground">
          Saved a 1080×1920 PNG — drop it into Instagram Stories.
        </p>
      ) : null}
      {status === "shared" ? (
        <p className="text-sm text-muted-foreground">
          Shared. Post it as a Story so the 9:16 crop stays intact.
        </p>
      ) : null}
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}
