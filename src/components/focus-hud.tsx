import { SparkleMark } from "@/components/brand-marks";
import { cn } from "@/lib/utils";

export function FocusHud({
  time,
  progress,
  tokens,
  name,
  task,
  className,
}: {
  time: string;
  progress: number;
  tokens: number;
  name?: string;
  task?: string;
  className?: string;
}) {
  const width = Math.min(100, Math.max(0, progress * 100));

  return (
    <div className={cn("focus-hud", className)}>
      {name ? (
        <p className="font-heading mb-1 text-center text-sm text-foreground/90">
          {name}
        </p>
      ) : null}
      {task ? (
        <p className="mb-2 text-center text-xs font-medium text-zinc-800 dark:text-zinc-100">
          {task}
        </p>
      ) : null}
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
        <SparkleMark size={16} />
        <span>{tokens}</span>
      </div>
    </div>
  );
}
