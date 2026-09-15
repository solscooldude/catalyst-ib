import { HexChipMark, SparkleMark } from "@/components/brand-marks";
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
  return (
    <span
      className={cn(
        "token-amount inline-flex items-center gap-1 text-[13px] font-semibold text-zinc-800 dark:text-zinc-100",
        className,
      )}
    >
      <SparkleMark size={13} />
      <span className="tabular-nums">{value}</span>
    </span>
  );
}
