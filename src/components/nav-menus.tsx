"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { ROUTES } from "@/lib/routes";
import { cn } from "@/lib/utils";

const GROUPS = [
  {
    id: "home",
    label: "Home",
    items: [
      { href: ROUTES.home, label: "Dashboard" },
      { href: ROUTES.sprite, label: "My Sprite" },
      { href: ROUTES.quiz, label: "Quiz" },
      { href: ROUTES.motivation, label: "Motivation" },
      { href: ROUTES.stats, label: "Stats" },
      { href: ROUTES.schedule, label: "Schedule" },
    ],
  },
  {
    id: "focus",
    label: "Focus",
    items: [
      { href: ROUTES.focus, label: "Focus" },
      { href: ROUTES.setup, label: "Setup" },
    ],
  },
  {
    id: "shop",
    label: "Shop",
    items: [
      { href: ROUTES.unlocks, label: "Unlocks" },
      { href: ROUTES.appearance, label: "Appearance" },
    ],
  },
] as const;

function groupActive(pathname: string, items: readonly { href: string }[]) {
  return items.some((item) => {
    if (item.href === ROUTES.home) return pathname === ROUTES.home;
    if (item.href === ROUTES.focus) {
      return (
        pathname === ROUTES.focus ||
        pathname === ROUTES.lock ||
        pathname === ROUTES.session
      );
    }
    return pathname === item.href || pathname.startsWith(`${item.href}/`);
  });
}

export function NavMenus({ compact = false }: { compact?: boolean }) {
  const pathname = usePathname();
  const [openId, setOpenId] = useState<string | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setOpenId(null);
  }, [pathname]);

  useEffect(() => {
    function onDoc(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpenId(null);
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpenId(null);
    }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className={cn(
        "flex items-center",
        compact ? "w-full justify-between gap-1" : "gap-1",
      )}
    >
      {GROUPS.map((group, index) => {
        const active = groupActive(pathname, group.items);
        const open = openId === group.id;
        const last = index === GROUPS.length - 1;
        return (
          <div key={group.id} className={cn("relative", compact && "min-w-0 flex-1")}>
            <button
              type="button"
              aria-expanded={open}
              onClick={() => setOpenId(open ? null : group.id)}
              className={cn(
                "inline-flex items-center gap-1 rounded-full text-foreground/90 transition-colors",
                compact
                  ? "w-full justify-center px-2 py-1.5 text-[13px]"
                  : "px-3 py-1.5 text-sm",
                active || open
                  ? "bg-white/6 text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {group.label}
              <ChevronDown className="size-3.5 opacity-70" />
            </button>
            {open ? (
              <div
                className={cn(
                  "absolute z-50 mt-2 min-w-44 rounded-2xl border border-white/8 bg-[#121218] p-1.5 shadow-[0_18px_40px_-24px_rgb(0_0_0_/_0.9)]",
                  last ? "right-0 left-auto" : "left-0",
                  compact && "min-w-[11.5rem]",
                )}
              >
                {group.items.map((item) => {
                  const itemActive =
                    item.href === ROUTES.home
                      ? pathname === ROUTES.home
                      : pathname === item.href ||
                        (item.href === ROUTES.focus &&
                          (pathname === ROUTES.lock || pathname === ROUTES.session));
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "block rounded-xl px-3 py-2.5 text-sm text-zinc-100",
                        itemActive
                          ? "bg-primary/12 text-foreground"
                          : "hover:bg-white/6 hover:text-foreground",
                      )}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
