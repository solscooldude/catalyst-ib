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
      <span className="text-[17px] font-semibold">Catalyst</span>
      <span className="text-[13px] font-medium text-muted-foreground">IB</span>
    </Link>
  );
}
