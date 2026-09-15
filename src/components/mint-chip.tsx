import { HexChipMark } from "@/components/brand-marks";
import { TokenChip } from "@/components/token-chip";
import { cn } from "@/lib/utils";

export function MintChip({
  size = 16,
  className,
}: {
  size?: number;
  className?: string;
  tone?: "solid" | "soft";
}) {
  return <HexChipMark size={size} className={className} />;
}

export function TokenAmount({
  value,
  className,
}: {
  value: number | string;
  className?: string;
}) {
  if (typeof value === "number") {
    return <TokenChip tokens={value} className={cn("px-2 py-0.5", className)} />;
  }
  return (
    <span
      className={cn(
        "token-amount inline-flex items-center gap-1 rounded-full bg-white px-1.5 py-0.5 text-[13px] font-medium text-zinc-800 shadow-[0_0_0_1px_rgb(24_24_27/0.06)] dark:bg-zinc-900 dark:text-zinc-100",
        className,
      )}
    >
      <HexChipMark size={13} />
      <span>{value}</span>
    </span>
  );
}
