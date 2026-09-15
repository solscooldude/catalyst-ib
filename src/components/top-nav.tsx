"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ROUTES } from "@/lib/routes";
import { cn } from "@/lib/utils";

const LINKS = [
  {
    href: ROUTES.home,
    label: "Home",
    match: (path: string) => path === ROUTES.home,
  },
  {
    href: ROUTES.focus,
    label: "Focus",
    match: (path: string) =>
      path === ROUTES.focus || path === ROUTES.lock || path === ROUTES.session,
  },
  {
    href: ROUTES.sprite,
    label: "Sprite",
    match: (path: string) => path === ROUTES.sprite || path === ROUTES.quiz,
  },
  {
    href: ROUTES.unlocks,
    label: "Shop",
    match: (path: string) =>
      path === ROUTES.unlocks || path === ROUTES.appearance,
  },
] as const;

export function TopNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Main" className="flex items-center gap-0.5 sm:gap-1">
      {LINKS.map((link) => {
        const active = link.match(pathname);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "rounded-full px-2.5 py-1.5 text-[13px] transition-colors sm:px-3 sm:text-sm",
              active
                ? "bg-foreground/6 text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
