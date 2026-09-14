"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Wordmark } from "@/components/wordmark";
import { TokenChip } from "@/components/token-chip";
import { DemoBadge } from "@/components/demo-badge";
import { Button } from "@/components/ui/button";
import { logOut, useAuth } from "@/lib/auth";
import { resetDemo, useCatalyst } from "@/lib/store";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/dashboard", label: "Home" },
  { href: "/app", label: "Focus" },
  { href: "/app/stats", label: "Stats" },
  { href: "/app/unlock", label: "Unlocks" },
  { href: "/app/setup", label: "Setup" },
];

function isActive(pathname: string, href: string) {
  if (href === "/dashboard") return pathname === "/dashboard";
  if (href === "/app") {
    return (
      pathname === "/app" ||
      pathname.startsWith("/app/lock") ||
      pathname.startsWith("/app/focus")
    );
  }
  return pathname.startsWith(href);
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const state = useCatalyst();
  const auth = useAuth();

  function handleReset() {
    resetDemo();
    router.push("/app/setup");
  }

  function handleLogout() {
    logOut();
    router.push("/");
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-30 border-b border-white/6 bg-[#0b0b0f]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-3 px-4">
          <Wordmark href="/dashboard" />
          <nav className="hidden items-center gap-1 md:flex">
            {NAV.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-full px-3 py-1.5 text-sm transition-colors",
                    active
                      ? "bg-white/6 text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="flex items-center gap-2">
            <TokenChip tokens={state.tokens} />
            <Button
              variant="ghost"
              size="sm"
              className="hidden text-muted-foreground lg:inline-flex"
              onClick={handleReset}
            >
              Reset demo
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground"
              onClick={handleLogout}
            >
              Log out
            </Button>
          </div>
        </div>
        <div className="flex gap-1 overflow-x-auto px-4 pb-2 md:hidden">
          {NAV.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-full px-3 py-1 text-xs",
                  active
                    ? "bg-white/6 text-foreground"
                    : "text-muted-foreground",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </header>
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-8 sm:py-12">
        {!state.hydrated || !auth.hydrated ? (
          <div className="grid gap-4">
            <div className="h-8 w-48 animate-pulse rounded-full bg-white/6" />
            <div className="h-48 animate-pulse rounded-3xl bg-white/4" />
          </div>
        ) : (
          children
        )}
      </main>
      <footer className="border-t border-white/6 px-4 py-4">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
          <DemoBadge>Demo accounts · no real Screen Time</DemoBadge>
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={handleReset}
          >
            Reset demo
          </Button>
        </div>
      </footer>
    </div>
  );
}
