import { cn } from "@/lib/utils";

export function MintChip({
  size = 16,
  className,
}: {
  size?: number;
  className?: string;
}) {
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
        fill="#5EEAD4"
        stroke="#5EEAD4"
        strokeWidth="2.6"
        strokeLinejoin="round"
      />
      <path
        d="M15.6 8.15a4.35 4.35 0 1 0 0 7.7"
        fill="none"
        stroke="#0B0B0F"
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
    <span className={cn("inline-flex items-center gap-1 font-mono", className)}>
      <MintChip size={13} />
      <span>{value}</span>
    </span>
  );
}
