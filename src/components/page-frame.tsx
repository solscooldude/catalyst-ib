import { cn } from "@/lib/utils";

export function PageFrame({
  children,
  width = "wide",
  className,
}: {
  children: React.ReactNode;
  width?: "wide" | "mid" | "form";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full space-y-6",
        width === "wide" && "max-w-5xl",
        width === "mid" && "max-w-3xl",
        width === "form" && "max-w-2xl",
        className,
      )}
    >
      {children}
    </div>
  );
}
