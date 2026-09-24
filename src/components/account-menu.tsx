"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/routes";
import { logOut, useAuth } from "@/lib/auth";
import { displayAvatar } from "@/lib/identity";
import { useCatalyst } from "@/lib/store";
import { setUiTheme, useUiTheme } from "@/lib/ui-theme";

export function AccountMenu() {
  const router = useRouter();
  const auth = useAuth();
  const theme = useUiTheme();
  const store = useCatalyst();
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const label =
    store.username.slice(0, 1).toUpperCase() ||
    auth.user?.email?.slice(0, 1).toUpperCase() ||
    "A";

  useEffect(() => {
    function onDoc(event: PointerEvent) {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const items = [
    { href: ROUTES.profile, label: "Profile" },
    { href: ROUTES.settings, label: "Account settings" },
  ];
  const handle = store.username || auth.user?.email?.split("@")[0] || "Account";

  return (
    <div ref={root} className="relative flex items-center gap-2.5">
      <span className="max-w-28 truncate text-sm font-medium text-foreground">
        {handle}
      </span>
      <button
        type="button"
        aria-label="Account"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((current) => !current)}
        className="font-heading grid size-9 place-items-center overflow-hidden rounded-full bg-primary text-sm font-semibold text-primary-foreground"
      >
        {displayAvatar(store.avatarDataUrl, store.avatarUrl || auth.user?.imageUrl) ? (
          <img
            src={
              displayAvatar(
                store.avatarDataUrl,
                store.avatarUrl || auth.user?.imageUrl,
              ) ?? ""
            }
            alt=""
            className="size-full object-cover"
          />
        ) : (
          label
        )}
      </button>
      {open ? (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-2 w-52 rounded-2xl bg-white p-1.5 shadow-[0_16px_36px_-20px_rgb(24_24_27/0.35)] dark:bg-zinc-900 dark:shadow-[0_0_0_1px_rgb(244_244_245/0.08)]"
        >
          <p className="px-3.5 pt-2 pb-1 text-[11px] font-medium tracking-[0.16em] text-zinc-400 uppercase">
            {handle}
          </p>
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              role="menuitem"
              onClick={() => setOpen(false)}
              className="flex min-h-11 items-center rounded-xl px-3.5 text-sm text-zinc-800 dark:text-zinc-100"
            >
              {item.label}
            </Link>
          ))}
          <button
            type="button"
            className="flex min-h-11 w-full items-center rounded-xl px-3.5 text-left text-sm text-zinc-600 dark:text-zinc-300"
            onClick={() => {
              setUiTheme(theme === "dark" ? "light" : "dark");
            }}
          >
            {theme === "dark" ? "Light chrome" : "Dark chrome"}
          </button>
          <button
            type="button"
            className="flex min-h-11 w-full items-center rounded-xl px-3.5 text-left text-sm text-zinc-600 dark:text-zinc-300"
            onClick={() => {
              setOpen(false);
              void logOut().then(() => router.push("/"));
            }}
          >
            Log out
          </button>
        </div>
      ) : null}
    </div>
  );
}
