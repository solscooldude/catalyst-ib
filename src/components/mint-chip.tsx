import { SparkleMark } from "@/components/brand-marks";
import { cn } from "@/lib/utils";

/** Currency mark only. Never a hex / circled C. */
export function MintChip({
  size = 16,
  className,
}: {
  size?: number;
  className?: string;
  tone?: "solid" | "soft";
}) {
  return <SparkleMark size={size} className={cn("text-[#5EEAD4]", className)} />;
}

export function TokenAmount({
  value,
  className,
  mark = "mint",
}: {
  value: number | string;
  className?: string;
  mark?: "mint" | "ink";
}) {
  return (
    <span
      className={cn(
        "token-amount inline-flex items-center gap-1 text-[13px] font-semibold",
        mark === "ink"
          ? "text-zinc-800 dark:text-zinc-100"
          : "text-zinc-800 dark:text-zinc-100",
        className,
      )}
    >
      <SparkleMark
        size={13}
        className={
          mark === "ink" ? "text-zinc-800 dark:text-zinc-100" : "text-[#5EEAD4]"
        }
      />
      <span className="tabular-nums">{value}</span>
    </span>
  );
}

export function BuyLabel({ cost }: { cost: number }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      Buy
      <TokenAmount value={cost} mark="ink" />
    </span>
  );
}
