import Link from "next/link";
import { cn } from "@/lib/utils";

export function Wordmark({
  href = "/",
  className,
}: {
  href?: string;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "font-heading inline-flex items-baseline gap-1 tracking-tight text-foreground",
        className,
      )}
    >
      <span className="text-[26px] font-semibold sm:text-[32px]">Catalyst</span>
      <span className="text-[22px] font-semibold text-muted-foreground sm:text-[28px]">
        IB
      </span>
    </Link>
  );
}
