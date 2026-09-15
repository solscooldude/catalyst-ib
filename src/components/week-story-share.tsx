"use client";

import { useState } from "react";
import { Share } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  WeekStoryActions,
  WeekStoryPreview,
} from "@/components/week-story-card";
import type { WeekStoryStats } from "@/lib/week-story";

export function WeekStoryPanel({ story }: { story: WeekStoryStats }) {
  return (
    <section className="flux-card p-6 sm:p-8">
      <div className="grid items-start gap-8 lg:grid-cols-[17.5rem_1fr]">
        <WeekStoryPreview story={story} />
        <div>
          <p className="text-xs tracking-[0.16em] text-primary uppercase">
            This week
          </p>
          <h2 className="mt-2 text-2xl text-foreground">Share a Story card</h2>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            A 9:16 image for Instagram Stories — top subject, streak, study
            time, tokens, the sprite peeking in, and the mint Catalyst mark.
          </p>
          <p className="mt-4 text-sm text-foreground">
            {story.empty
              ? `${story.weekLabel} · nothing logged yet. The card still exports.`
              : `${story.weekLabel} · ${story.topSubject} led the week.`}
          </p>
          <WeekStoryActions story={story} className="mt-6" />
        </div>
      </div>
    </section>
  );
}

export function WeekStoryShareDialog({ story }: { story: WeekStoryStats }) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="h-11 rounded-full px-4"
        >
          <Share className="size-4" />
          Share this week
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>This week on Catalyst</DialogTitle>
          <DialogDescription>
            Save a 1080×1920 PNG and post it as an Instagram Story.
          </DialogDescription>
        </DialogHeader>
        <WeekStoryPreview story={story} className="mt-1" />
        <WeekStoryActions story={story} className="mt-4" />
      </DialogContent>
    </Dialog>
  );
}
