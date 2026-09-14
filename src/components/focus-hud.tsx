import { MintChip } from "@/components/mint-chip";
import { cn } from "@/lib/utils";

export function FocusHud({
  time,
  progress,
  tokens,
  className,
}: {
  time: string;
  progress: number;
  tokens: number;
  className?: string;
}) {
  const width = Math.min(100, Math.max(0, progress * 100));

  return (
    <div className={cn("focus-hud", className)}>
      <div className="focus-hud-timer" aria-label={`Session time ${time}`}>
        <p className="focus-hud-digits">{time}</p>
        <div className="focus-hud-track" aria-hidden>
          <span className="focus-hud-fill" style={{ width: `${width}%` }} />
        </div>
      </div>
      <div
        className="focus-hud-tokens"
        aria-label={`${tokens} tokens`}
      >
        <MintChip size={16} tone="soft" />
        <span>{tokens}</span>
      </div>
    </div>
  );
}
