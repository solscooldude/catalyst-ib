"use client";

import { setExtraMagical } from "@/lib/store-core";
import { cn } from "@/lib/utils";

export function ExtraMagicalToggle({
  on,
  unlocked,
}: {
  on: boolean;
  unlocked: boolean;
}) {
  return (
    <div className="sprite-extra-magical">
      <div>
        <p className="text-sm font-medium text-foreground">Extra Magical</p>
        <p className="text-xs text-muted-foreground">
          {unlocked
            ? "Glowing eyes, stronger aura, more sparkles, faint halo. Ethereal only."
            : "Unlocks at Ethereal."}
        </p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={unlocked && on}
        aria-label="Extra Magical"
        disabled={!unlocked}
        onClick={() => unlocked && setExtraMagical(!on)}
        className={cn(
          "sprite-extra-switch",
          unlocked && on && "is-on",
          !unlocked && "is-locked",
        )}
      >
        <span className="sprite-extra-knob" />
      </button>
    </div>
  );
}
