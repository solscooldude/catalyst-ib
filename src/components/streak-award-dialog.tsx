"use client";

import { Spark } from "@/components/spark";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { SparkGearId, SparkTrailId } from "@/lib/appearance";
import { dismissStreakAward, useCatalyst } from "@/lib/store";

export function StreakAwardDialog() {
  const state = useCatalyst();
  const award = state.pendingStreakAward;
  const look = state.appearance;

  function close() {
    dismissStreakAward();
  }

  return (
    <Dialog
      open={Boolean(award)}
      onOpenChange={(open) => {
        if (!open) close();
      }}
    >
      <DialogContent className="max-w-sm" showCloseButton>
        {award ? (
          <>
            <DialogHeader>
              <DialogTitle>
                {award.days}-day streak
              </DialogTitle>
              <DialogDescription>
                Your sprite unlocked {award.name}. Wear it on My Sprite — it is
                not sold in the shop.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-center py-2">
              <Spark
                mood="done"
                tint={look.sparkTint}
                gear={
                  award.kind === "gear" ? (award.id as SparkGearId) : look.gear
                }
                aura={look.aura}
                trail={
                  award.kind === "trail"
                    ? (award.id as SparkTrailId)
                    : look.trail
                }
                size={132}
              />
            </div>
            <DialogFooter>
              <Button className="h-11 w-full rounded-full" onClick={close}>
                Nice
              </Button>
            </DialogFooter>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
