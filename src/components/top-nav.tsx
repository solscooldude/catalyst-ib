"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { SparkleMark } from "@/components/sparkle-mark";
import { cn } from "@/lib/cn";
import { ROUTES } from "@/lib/routes";
import { useCatalyst } from "@/lib/store";

const NAV = [
  { href: ROUTES.home, label: "Home" },
  { href: ROUTES.unlocks, label: "Unlocks" },
  {
    href: ROUTES.appearance,
    label: "Shop",
    children: [
      { href: `${ROUTES.appearance}#rooms`, label: "Appearance" },
      { href: `${ROUTES.appearance}#scenes`, label: "Focus scenes" },
      { href: `${ROUTES.appearance}#trails`, label: "Trails" },
      { href: ROUTES.snacks, label: "Snacks" },
    ],
  },
  { href: ROUTES.focus, label: "Focus" },
  { href: ROUTES.sprite, label: "Sprite" },
];

function isActive(pathname: string, href: string) {
  if (href === ROUTES.home) return pathname === ROUTES.home;
  return pathname === href || pathname.startsWith(`${href}/`);
}

function ShopMenu({
  pathname,
  open,
  onOpen,
  onClose,
}: {
  pathname: string;
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
}) {
  const menuId = useId();
  const wrapRef = useRef<HTMLDivElement>(null);
  const shop = NAV[2];
  const active = isActive(pathname, shop.href);

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: PointerEvent) => {
      if (!wrapRef.current?.contains(event.target as Node)) onClose();
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        className={cn("nav-link", active && "is-active")}
        aria-expanded={open}
        aria-controls={menuId}
        aria-haspopup="menu"
        onClick={() => (open ? onClose() : onOpen())}
      >
        Shop
      </button>
      {open ? (
        <div
          id={menuId}
          role="menu"
          className="absolute left-0 top-full z-30 mt-2 min-w-44 rounded-[1.1rem] border border-zinc-200/80 bg-white p-1.5 shadow-[0_16px_40px_rgba(24,24,27,0.12)] dark:border-zinc-800 dark:bg-zinc-950"
        >
          {shop.children?.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              role="menuitem"
              className="block rounded-xl px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:text-zinc-200 dark:hover:bg-zinc-900"
              onClick={onClose}
            >
              {item.label}
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function TopNav() {
  const pathname = usePathname();
  const { state } = useCatalyst();
  const [shopOpen, setShopOpen] = useState(false);

  return (
    <header className="sticky top-0 z-20 border-b border-zinc-200/70 bg-[#F4F4F5]/88 backdrop-blur-md dark:border-zinc-800/80 dark:bg-[#0B0B0F]/88">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href={ROUTES.home} className="flex items-center gap-2.5">
          <span className="display-font text-[1.05rem] font-semibold tracking-[-0.04em] text-zinc-950 dark:text-zinc-50">
            Catalyst
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {NAV.map((item) =>
            item.children ? (
              <ShopMenu
                key={item.href}
                pathname={pathname}
                open={shopOpen}
                onOpen={() => setShopOpen(true)}
                onClose={() => setShopOpen(false)}
              />
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className={cn("nav-link", isActive(pathname, item.href) && "is-active")}
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href={ROUTES.unlocks}
            className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-[0.78rem] font-semibold text-zinc-800 ring-1 ring-zinc-200/80 dark:bg-zinc-950 dark:text-zinc-100 dark:ring-zinc-800"
          >
            <SparkleMark className="h-3.5 w-3.5" />
            <span className="tabular-nums">{state.tokens}</span>
          </Link>
          <Link href={ROUTES.account} className="nav-link">
            Account
          </Link>
        </div>
      </div>

      <nav
        className="flex gap-1 overflow-x-auto px-4 pb-2 md:hidden"
        aria-label="Mobile"
      >
        {NAV.flatMap((item) =>
          item.children
            ? item.children.map((child) => (
                <Link
                  key={child.href}
                  href={child.href}
                  className="nav-link shrink-0"
                >
                  {child.label}
                </Link>
              ))
            : [
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "nav-link shrink-0",
                    isActive(pathname, item.href) && "is-active",
                  )}
                >
                  {item.label}
                </Link>,
              ],
        )}
      </nav>
    </header>
  );
}
