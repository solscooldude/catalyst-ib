import { BRAND_INK, BRAND_MINT, SPARK_BODY_PATH } from "@/lib/spark-silhouette";
import { cn } from "@/lib/utils";

function BrandEyes() {
  return (
    <>
      <circle cx="39.2" cy="60" r="5.5" fill={BRAND_INK} />
      <circle cx="60.8" cy="60" r="5.5" fill={BRAND_INK} />
      <circle cx="41.2" cy="58.2" r="1.7" fill="#fff" />
      <circle cx="62.8" cy="58.2" r="1.7" fill="#fff" />
    </>
  );
}

export function SparkMark({
  size = 24,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      viewBox="18 2 64 98"
      width={size}
      height={size}
      className={cn("shrink-0", className)}
      aria-hidden
    >
      <path d={SPARK_BODY_PATH} fill={BRAND_MINT} />
      <BrandEyes />
    </svg>
  );
}

export function AppIconMark({
  size = 28,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      className={cn("shrink-0", className)}
      aria-hidden
    >
      <rect width="64" height="64" rx="16" fill={BRAND_INK} />
      <g transform="translate(10.5 6) scale(0.43)">
        <path d={SPARK_BODY_PATH} fill={BRAND_MINT} />
        <BrandEyes />
      </g>
    </svg>
  );
}

export function HexChipMark({
  size = 16,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      className={cn("shrink-0", className)}
      aria-hidden
    >
      <polygon
        points="16,2.2 27.6,8.7 27.6,23.3 16,29.8 4.4,23.3 4.4,8.7"
        fill="none"
        stroke={BRAND_MINT}
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <g transform="translate(7.4 5.2) scale(0.17)">
        <path d={SPARK_BODY_PATH} fill={BRAND_MINT} />
        <BrandEyes />
      </g>
    </svg>
  );
}

export function SparkleMark({
  size = 14,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 16 16"
      width={size}
      height={size}
      className={cn("shrink-0", className)}
      aria-hidden
    >
      <path
        d="M8 1.1 9.15 6.2 14.9 8 9.15 9.8 8 14.9 6.85 9.8 1.1 8l5.75-1.8Z"
        fill={BRAND_MINT}
      />
    </svg>
  );
}

export function BrandC({
  size = 22,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      className={cn("shrink-0", className)}
      aria-hidden
    >
      <path
        d="M46 14.5c-10.6-6.4-24.2-3.4-31 7.6-7.2 11.6-4.4 26.8 6.8 34.2 8.4 5.6 19.4 5 27.2-0.6"
        fill="none"
        stroke={BRAND_MINT}
        strokeWidth="11.5"
        strokeLinecap="round"
      />
      <circle cx="36.2" cy="31.4" r="3.15" fill={BRAND_INK} />
      <circle cx="45.4" cy="31.4" r="3.15" fill={BRAND_INK} />
      <circle cx="37.3" cy="30.3" r="0.95" fill="#fff" />
      <circle cx="46.5" cy="30.3" r="0.95" fill="#fff" />
    </svg>
  );
}
