import { motivationReady } from "@/lib/ib";
import type { MotivationState } from "@/lib/ib";

export function MotivationNudge({
  motivation,
}: {
  motivation: MotivationState;
}) {
  if (!motivationReady(motivation) && !motivation.unlockNote) return null;
  return (
    <div className="mt-4 rounded-2xl bg-primary/8 p-4 ring-1 ring-primary/20">
      <p className="text-xs tracking-[0.16em] text-primary uppercase">
        Remember this
      </p>
      {motivation.colleges ? (
        <p className="mt-2 text-sm text-foreground">{motivation.colleges}</p>
      ) : null}
      {motivation.course ? (
        <p className="text-sm text-muted-foreground">{motivation.course}</p>
      ) : null}
      {motivation.why ? (
        <p className="mt-2 text-sm text-foreground">{motivation.why}</p>
      ) : null}
      {motivation.targetPoints ? (
        <p className="mt-1 text-xs text-muted-foreground">
          Target · {motivation.targetPoints} points
        </p>
      ) : null}
      {motivation.unlockNote ? (
        <p className="mt-2 text-sm text-muted-foreground">
          {motivation.unlockNote}
        </p>
      ) : null}
    </div>
  );
}
