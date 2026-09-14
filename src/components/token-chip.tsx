import { MintChip } from "@/components/mint-chip";
import { cn } from "@/lib/utils";

export function TokenChip({
  tokens,
  className,
}: {
  tokens: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/8 px-2.5 py-1 font-mono text-xs text-primary",
        className,
      )}
      aria-label={`${tokens} tokens`}
    >
      <MintChip size={14} />
      <span>{tokens}</span>
    </div>
  );
}
