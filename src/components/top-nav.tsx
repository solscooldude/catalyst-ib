"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ROUTES } from "@/lib/routes";
import { cn } from "@/lib/utils";

const GROUPS = [
  {
    id: "home",
    label: "Home",
    href: ROUTES.home,
    items: [
      { href: ROUTES.home, label: "Dashboard" },
      { href: ROUTES.motivation, label: "Motivation" },
      { href: ROUTES.stats, label: "Stats" },
      { href: ROUTES.schedule, label: "Schedule" },
      { href: ROUTES.profile, label: "Profile" },
    ],
  },
  {
    id: "focus",
    label: "Focus",
    href: ROUTES.focus,
    items: [
      { href: ROUTES.focus, label: "Focus session" },
      { href: ROUTES.setup, label: "Setup" },
    ],
  },
  {
    id: "sprite",
    label: "Sprite",
    href: ROUTES.sprite,
    items: [
      { href: ROUTES.sprite, label: "My Sprite" },
      { href: ROUTES.quiz, label: "Quiz" },
    ],
  },
  {
    id: "shop",
    label: "Shop",
    href: ROUTES.appearance,
    items: [
      { href: ROUTES.appearance, label: "Appearance" },
      { href: ROUTES.unlocks, label: "Unlocks" },
    ],
  },
] as const;

function groupActive(pathname: string, group: (typeof GROUPS)[number]) {
  return (
    group.items.some((item) => pathname === item.href) ||
    (group.id === "focus" &&
      (pathname === ROUTES.lock || pathname === ROUTES.session))
  );
}

function MenuLinks({
  pathname,
  onPick,
}: {
  pathname: string;
  onPick?: () => void;
}) {
  const [open, setOpen] = useState(
    () => GROUPS.find((group) => groupActive(pathname, group))?.id ?? "home",
  );

  return (
    <div className="space-y-1">
      {GROUPS.map((group) => {
        const expanded = open === group.id;
        const active = groupActive(pathname, group);
        return (
          <div key={group.id}>
            <button
              type="button"
              className={cn(
                "flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm",
                active ? "text-foreground" : "text-zinc-500",
              )}
              aria-expanded={expanded}
              onClick={() => setOpen(expanded ? "" : group.id)}
            >
              {group.label}
              <ChevronDown
                className={cn(
                  "size-4 transition-transform",
                  expanded && "rotate-180",
                )}
              />
            </button>
            {expanded ? (
              <div className="mb-1 space-y-0.5 pb-1 pl-1">
                {group.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onPick}
                    className={cn(
                      "block rounded-xl px-3 py-2 text-[13px]",
                      pathname === item.href
                        ? "bg-primary/15 text-foreground"
                        : "text-zinc-500 hover:bg-primary/10 hover:text-foreground",
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

export function TopNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState<string | null>(null);
  const [sheet, setSheet] = useState(false);
  const root = useRef<HTMLElement>(null);
  const current = GROUPS.find((group) => groupActive(pathname, group));

  useEffect(() => {
    setOpen(null);
    setSheet(false);
  }, [pathname]);

  useEffect(() => {
    function onPointer(event: PointerEvent) {
      if (!root.current?.contains(event.target as Node)) setOpen(null);
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(null);
    }
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <>
      <nav
        ref={root}
        aria-label="Main"
        className="hidden items-center gap-0.5 sm:gap-3 md:flex"
      >
        {GROUPS.map((group) => {
          const active = groupActive(pathname, group);
          const shown = open === group.id;
          return (
            <div
              key={group.id}
              className="relative"
              onMouseEnter={() => setOpen(group.id)}
              onMouseLeave={() =>
                setOpen((currentOpen) =>
                  currentOpen === group.id ? null : currentOpen,
                )
              }
            >
              <div className="flex items-center">
                <Link
                  href={group.href}
                  className={cn(
                    "relative px-1.5 py-2 text-[13px] transition-colors sm:px-2 sm:text-sm",
                    active
                      ? "font-medium text-foreground"
                      : "text-zinc-400 hover:text-foreground",
                  )}
                >
                  {group.label}
                  {active ? (
                    <span className="absolute inset-x-1 -bottom-0.5 h-0.5 rounded-full bg-primary" />
                  ) : null}
                </Link>
                <button
                  type="button"
                  className="rounded-full p-1 text-zinc-400 hover:text-foreground"
                  aria-expanded={shown}
                  aria-controls={`nav-${group.id}`}
                  aria-label={`${group.label} menu`}
                  onClick={() =>
                    setOpen((currentOpen) =>
                      currentOpen === group.id ? null : group.id,
                    )
                  }
                >
                  <ChevronDown
                    className={cn(
                      "size-3.5 transition-transform",
                      shown && "rotate-180",
                    )}
                  />
                </button>
              </div>
              {shown ? (
                <div
                  id={`nav-${group.id}`}
                  className="absolute left-1/2 top-full z-40 mt-1 w-44 -translate-x-1/2 rounded-2xl bg-white p-1.5 shadow-[0_1px_2px_rgb(24_24_27/0.06),0_16px_36px_-20px_rgb(24_24_27/0.35)] dark:bg-zinc-900 dark:shadow-[0_0_0_1px_rgb(244_244_245/0.08)]"
                >
                  {group.items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "block rounded-xl px-3 py-2 text-[13px]",
                        pathname === item.href
                          ? "bg-primary/15 text-foreground"
                          : "text-zinc-500 hover:bg-primary/10 hover:text-foreground",
                      )}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
          );
        })}
      </nav>

      <nav aria-label="Main" className="flex items-center md:hidden">
        <button
          type="button"
          className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-[13px] text-foreground ring-1 ring-border"
          aria-expanded={sheet}
          onClick={() => setSheet(true)}
        >
          {current?.label ?? "Menu"}
          <ChevronDown className="size-3.5 text-zinc-400" />
        </button>
        <Sheet open={sheet} onOpenChange={setSheet}>
          <SheetContent
            side="bottom"
            className="gap-0 rounded-t-[1.75rem] bg-white dark:bg-zinc-900"
          >
            <SheetHeader>
              <SheetTitle>Pages</SheetTitle>
            </SheetHeader>
            <div className="px-3 pb-6">
              <MenuLinks pathname={pathname} onPick={() => setSheet(false)} />
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </>
  );
}
