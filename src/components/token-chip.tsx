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
        "token-chip inline-flex items-center gap-1.5 rounded-full border border-[#E8DCC4]/28 bg-[#F4EFE4]/10 px-2.5 py-1 font-mono text-xs text-[#F4EFE4]",
        className,
      )}
      aria-label={`${tokens} tokens`}
    >
      <MintChip size={14} tone="soft" />
      <span>{tokens}</span>
    </div>
  );
}
