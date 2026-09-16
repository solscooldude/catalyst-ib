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
      { href: ROUTES.planner, label: "Planner" },
      { href: ROUTES.stats, label: "Stats" },
      { href: ROUTES.schedule, label: "Schedule" },
    ],
  },
  {
    id: "focus",
    label: "Focus",
    href: ROUTES.focus,
    items: [
      { href: ROUTES.focus, label: "Focus" },
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
    id: "friends",
    label: "Friends",
    href: ROUTES.friends,
    items: [
      { href: `${ROUTES.friends}#play`, label: "Minigames" },
      { href: `${ROUTES.friends}#manage`, label: "Manage" },
      { href: `${ROUTES.friends}#board`, label: "Leaderboard" },
    ],
  },
  {
    id: "shop",
    label: "Shop",
    href: ROUTES.appearance,
    items: [
      { href: `${ROUTES.appearance}#sprite`, label: "Sprite shop" },
      { href: `${ROUTES.appearance}#app`, label: "App appearance" },
    ],
  },
] as const;

function itemPath(href: string) {
  return href.split("#")[0] ?? href;
}

const SPRITE_HASHES = new Set([
  "",
  "#",
  "#sprite",
  "#cosmetics",
  "#colours",
  "#gradients",
  "#auras",
  "#trails",
]);
const APP_HASHES = new Set(["#app", "#scenes", "#room", "#accents"]);
const FRIEND_HASHES = new Set(["", "#", "#play", "#manage", "#board"]);

function itemActive(pathname: string, hash: string, href: string) {
  const [path, anchor] = href.split("#");
  if (path === ROUTES.appearance && anchor === "sprite") {
    return pathname === path && SPRITE_HASHES.has(hash || "");
  }
  if (path === ROUTES.appearance && anchor === "app") {
    return pathname === path && APP_HASHES.has(hash);
  }
  if (path === ROUTES.friends) {
    if (anchor === "play") return pathname === path && FRIEND_HASHES.has(hash || "");
    if (anchor) return pathname === path && hash === `#${anchor}`;
    return pathname === path;
  }
  if (anchor) return pathname === path && hash === `#${anchor}`;
  return pathname === path;
}

function groupActive(pathname: string, group: (typeof GROUPS)[number]) {
  return (
    group.items.some((item) => pathname === itemPath(item.href)) ||
    (group.id === "focus" &&
      (pathname === ROUTES.lock || pathname === ROUTES.session))
  );
}

function MenuLinks({
  pathname,
  hash,
  onPick,
}: {
  pathname: string;
  hash: string;
  onPick?: () => void;
}) {
  const [open, setOpen] = useState<string | null>(
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
                "font-heading flex min-h-12 w-full items-center justify-between rounded-xl px-3.5 py-3 text-left text-sm font-semibold",
                active ? "text-foreground" : "text-zinc-500",
              )}
              aria-expanded={expanded}
              onClick={() => setOpen(expanded ? null : group.id)}
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
                      "flex min-h-12 items-center rounded-xl px-3.5 py-3 text-sm",
                      itemActive(pathname, hash, item.href)
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
  const [hash, setHash] = useState("");
  const root = useRef<HTMLElement>(null);
  const current = GROUPS.find((group) => groupActive(pathname, group));

  useEffect(() => {
    function syncHash() {
      setHash(window.location.hash);
    }
    syncHash();
    window.addEventListener("hashchange", syncHash);
    return () => window.removeEventListener("hashchange", syncHash);
  }, [pathname]);

  useEffect(() => {
    setOpen(null);
    setSheet(false);
  }, [pathname]);

  useEffect(() => {
    function onPointer(event: PointerEvent) {
      if (!root.current?.contains(event.target as Node)) setOpen(null);
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(null);
        setSheet(false);
      }
    }
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  function toggle(id: string) {
    setOpen((currentOpen) => (currentOpen === id ? null : id));
  }

  return (
    <>
      <nav
        ref={root}
        aria-label="Main"
        className="relative z-50 hidden items-center gap-1 overflow-visible md:flex"
      >
        {GROUPS.map((group) => {
          const active = groupActive(pathname, group);
          const shown = open === group.id;
          return (
            <div key={group.id} className="relative overflow-visible">
              <button
                type="button"
                className={cn(
                  "font-heading relative inline-flex min-h-11 items-center gap-1.5 rounded-full px-3.5 py-2.5 text-sm font-semibold transition-colors",
                  active
                    ? "font-medium text-foreground"
                    : "text-zinc-400 hover:text-foreground",
                )}
                aria-expanded={shown}
                aria-haspopup="menu"
                aria-controls={`nav-${group.id}`}
                onClick={() => toggle(group.id)}
                onKeyDown={(event) => {
                  if (event.key === "ArrowDown") {
                    event.preventDefault();
                    setOpen(group.id);
                  }
                }}
              >
                {group.label}
                <ChevronDown
                  className={cn(
                    "size-4 transition-transform",
                    shown && "rotate-180",
                  )}
                />
                {active ? (
                  <span className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-primary" />
                ) : null}
              </button>
              {shown ? (
                <div
                  id={`nav-${group.id}`}
                  role="menu"
                  className="absolute left-1/2 top-full z-50 w-56 -translate-x-1/2 pt-2"
                >
                  <div className="rounded-2xl bg-white p-1.5 shadow-[0_1px_2px_rgb(24_24_27/0.06),0_16px_36px_-20px_rgb(24_24_27/0.35)] dark:bg-zinc-900 dark:shadow-[0_0_0_1px_rgb(244_244_245/0.08)]">
                    {group.items.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        role="menuitem"
                        onClick={() => setOpen(null)}
                        className={cn(
                          "flex min-h-11 items-center rounded-xl px-3.5 py-2.5 text-sm",
                          itemActive(pathname, hash, item.href)
                            ? "bg-primary/15 text-foreground"
                            : "text-zinc-500 hover:bg-primary/10 hover:text-foreground",
                        )}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          );
        })}
      </nav>

      <nav aria-label="Main" className="flex items-center md:hidden">
        <button
          type="button"
          className="inline-flex min-h-11 items-center gap-1.5 rounded-full px-4 py-2.5 text-sm text-foreground ring-1 ring-border"
          aria-expanded={sheet}
          onClick={() => setSheet(true)}
        >
          {current?.label ?? "Menu"}
          <ChevronDown className="size-4 text-zinc-400" />
        </button>
        <Sheet open={sheet} onOpenChange={setSheet}>
          <SheetContent
            side="bottom"
            className="z-50 max-h-[85dvh] gap-0 overflow-y-auto rounded-t-[1.75rem] bg-white dark:bg-zinc-900"
          >
            <SheetHeader>
              <SheetTitle>Pages</SheetTitle>
            </SheetHeader>
            <div className="px-3 pb-8">
              <MenuLinks
                pathname={pathname}
                hash={hash}
                onPick={() => setSheet(false)}
              />
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </>
  );
}
