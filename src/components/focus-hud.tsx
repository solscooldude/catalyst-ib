import { SparkleMark } from "@/components/brand-marks";
import { cn } from "@/lib/utils";

export function FocusHud({
  time,
  progress,
  tokens,
  task,
  className,
}: {
  time: string;
  progress?: number | null;
  tokens: number;
  task?: string;
  className?: string;
}) {
  const showTrack = progress != null && Number.isFinite(progress);
  const width = showTrack ? Math.min(100, Math.max(0, progress * 100)) : 0;

  return (
    <div className={cn("focus-hud", className)}>
      <div className="focus-hud-timer" aria-label={`Session time ${time}`}>
        {task ? (
          <p className="focus-hud-task mb-1 text-center text-xs font-medium">
            {task}
          </p>
        ) : null}
        <p className="focus-hud-digits">{time}</p>
        {showTrack ? (
          <div className="focus-hud-track" aria-hidden>
            <span className="focus-hud-fill" style={{ width: `${width}%` }} />
          </div>
        ) : null}
      </div>
      <div className="focus-hud-tokens" aria-label={`${tokens} tokens`}>
        <SparkleMark size={16} />
        <span>{tokens}</span>
      </div>
    </div>
  );
}
