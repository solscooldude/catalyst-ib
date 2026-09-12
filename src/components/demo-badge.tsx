import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function DemoBadge({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "h-6 border-primary/25 bg-primary/8 px-2.5 font-mono text-[10px] tracking-[0.14em] text-primary uppercase",
        className,
      )}
    >
      {children}
    </Badge>
  );
}
