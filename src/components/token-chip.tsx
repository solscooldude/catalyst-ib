import { Coins } from "lucide-react";
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
    >
      <Coins className="size-3.5" />
      <span>{tokens}</span>
      <span className="text-primary/70">tokens</span>
    </div>
  );
}
