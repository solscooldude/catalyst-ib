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
        "inline-flex items-center gap-2 text-[15px] font-medium tracking-tight text-foreground",
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-primary shadow-[0_0_12px_rgb(94_234_212_/_0.8)]" />
      Catalyst
    </Link>
  );
}
