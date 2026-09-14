import { cn } from "@/lib/utils";

export function MintChip({
  size = 16,
  className,
  tone = "solid",
}: {
  size?: number;
  className?: string;
  tone?: "solid" | "soft";
}) {
  const soft = tone === "soft";
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={cn("shrink-0", className)}
      aria-hidden
    >
      <polygon
        points="12,2.4 20.2,7.1 20.2,16.9 12,21.6 3.8,16.9 3.8,7.1"
        fill={soft ? "#F4EFE4" : "#5EEAD4"}
        stroke={soft ? "#D6C7A8" : "#5EEAD4"}
        strokeWidth={soft ? "1.7" : "2.6"}
        strokeLinejoin="round"
      />
      <path
        d="M15.6 8.15a4.35 4.35 0 1 0 0 7.7"
        fill="none"
        stroke={soft ? "#3F6F68" : "#0B0B0F"}
        strokeWidth="2.15"
        strokeLinecap="round"
      />
    </svg>
  );
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
        "token-amount inline-flex items-center gap-1 rounded-full border border-[#C9B896] bg-[#F4EFE4] px-1.5 py-0.5 font-mono text-[13px] font-semibold text-[#2A2420]",
        className,
      )}
    >
      <MintChip size={13} tone="soft" />
      <span>{value}</span>
    </span>
  );
}
