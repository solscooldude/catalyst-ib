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
    href: ROUTES.appearance,
    label: "Shop",
    match: (path: string) =>
      path === ROUTES.appearance || path === ROUTES.unlocks,
  },
] as const;

export function TopNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Main" className="flex items-center gap-1 sm:gap-5">
      {LINKS.map((link) => {
        const active = link.match(pathname);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "relative px-1.5 py-2 text-[13px] transition-colors sm:text-sm",
              active
                ? "font-medium text-foreground"
                : "text-zinc-400 hover:text-foreground",
            )}
          >
            {link.label}
            {active ? (
              <span className="absolute inset-x-2 -bottom-0.5 h-0.5 rounded-full bg-primary" />
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}
