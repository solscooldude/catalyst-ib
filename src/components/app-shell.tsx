"use client";

import { usePathname, useRouter } from "next/navigation";
import { Wordmark } from "@/components/wordmark";
import { TokenChip } from "@/components/token-chip";
import { DemoBadge } from "@/components/demo-badge";
import { IdleSubjectPopup } from "@/components/idle-subject-popup";
import { NavMenus } from "@/components/nav-menus";
import { SceneBackground } from "@/components/scene-background";
import { Button } from "@/components/ui/button";
import { logOut, useAuth } from "@/lib/auth";
import { isRoomFocusTheme } from "@/lib/focus-scene";
import { ROUTES } from "@/lib/routes";
import { resetDemo, useCatalyst } from "@/lib/store";
import { cn } from "@/lib/utils";

export function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const state = useCatalyst();
  const auth = useAuth();
  const sessionView = pathname === ROUTES.session;
  const roomLock =
    pathname === ROUTES.lock && isRoomFocusTheme(state.appearance.focusTheme);

  function handleReset() {
    resetDemo();
    router.push(ROUTES.setup);
  }

  function handleLogout() {
    logOut();
    router.push("/");
  }

  return (
    <div className="relative flex min-h-dvh flex-col">
      {sessionView || roomLock ? null : (
        <SceneBackground id={state.appearance.background} />
      )}
      {sessionView ? null : (
      <header className="sticky top-0 z-30 border-b border-white/6 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-3 px-4">
          <Wordmark href={ROUTES.home} />
          <nav className="hidden lg:block">
            <NavMenus />
          </nav>
          <div className="flex items-center gap-2">
            <TokenChip tokens={state.tokens} />
            <Button
              variant="ghost"
              size="sm"
              className="hidden text-muted-foreground xl:inline-flex"
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
        <div className="px-4 pb-2 lg:hidden">
          <NavMenus compact />
        </div>
      </header>
      )}
      <main
        className={cn(
          "relative z-10 flex w-full flex-1 flex-col",
          sessionView
            ? "max-w-none px-0 py-0"
            : "mx-auto max-w-5xl px-4 py-8 sm:py-12",
        )}
      >
        {!state.hydrated || !auth.hydrated ? (
          <div className="grid gap-4">
            <div className="h-8 w-48 animate-pulse rounded-full bg-white/6" />
            <div className="h-48 animate-pulse rounded-3xl bg-white/4" />
          </div>
        ) : (
          children
        )}
      </main>
      {sessionView ? null : (
        <footer className="relative z-10 border-t border-white/6 px-4 py-4">
          <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
            <DemoBadge>Demo accounts · no real Screen Time</DemoBadge>
            <Button
              variant="ghost"
              size="sm"
              className="xl:hidden"
              onClick={handleReset}
            >
              Reset demo
            </Button>
          </div>
        </footer>
      )}
      {sessionView ? null : <IdleSubjectPopup />}
    </div>
  );
}
