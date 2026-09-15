import { SparkleMark } from "@/components/brand-marks";
import { cn } from "@/lib/utils";

export function TokenChip({
  tokens,
  live,
  className,
}: {
  tokens: number;
  live?: string | null;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "token-chip inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-[13px] font-semibold text-zinc-800 shadow-[0_1px_2px_rgb(24_24_27/0.06),0_0_0_1px_rgb(24_24_27/0.06)] dark:bg-zinc-900 dark:text-zinc-100 dark:shadow-[0_0_0_1px_rgb(244_244_245/0.08)]",
        live && "pr-2",
        className,
      )}
      aria-label={live ? `${tokens} tokens · ${live}` : `${tokens} tokens`}
    >
      <SparkleMark size={13} className="text-[#5EEAD4]" />
      <span className="tabular-nums">{tokens.toLocaleString()}</span>
      {live ? (
        <span className="rounded-full bg-primary/20 px-1.5 py-0.5 font-mono text-[10px] font-semibold tracking-tight text-primary-foreground">
          {live}
        </span>
      ) : null}
    </div>
  );
}
