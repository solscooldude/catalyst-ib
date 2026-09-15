"use client";

import { usePathname, useRouter } from "next/navigation";
import { Wordmark } from "@/components/wordmark";
import { TokenChip } from "@/components/token-chip";
import { DemoBadge } from "@/components/demo-badge";
import { IdleSubjectPopup } from "@/components/idle-subject-popup";
import { SceneBackground } from "@/components/scene-background";
import { ThemeToggle } from "@/components/theme-toggle";
import { TopNav } from "@/components/top-nav";
import { Button } from "@/components/ui/button";
import { logOut, useAuth } from "@/lib/auth";
import { isRoomFocusTheme } from "@/lib/focus-scene";
import { ROUTES } from "@/lib/routes";
import { resetDemo, useCatalyst } from "@/lib/store";
import { useUiTheme } from "@/lib/ui-theme";
import { cn } from "@/lib/utils";

export function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const state = useCatalyst();
  const auth = useAuth();
  const uiTheme = useUiTheme();
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
      {sessionView || roomLock || uiTheme === "light" ? null : (
        <SceneBackground id={state.appearance.background} />
      )}
      {sessionView ? null : (
        <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-xl">
          <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-3 px-4">
            <Wordmark href={ROUTES.home} />
            <TopNav />
            <div className="flex items-center gap-1 sm:gap-2">
              <TokenChip tokens={state.tokens} />
              <ThemeToggle />
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
                className="hidden text-muted-foreground sm:inline-flex"
                onClick={handleLogout}
              >
                Log out
              </Button>
            </div>
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
            <div className="h-8 w-48 animate-pulse rounded-full bg-muted" />
            <div className="h-48 animate-pulse rounded-3xl bg-muted" />
          </div>
        ) : (
          children
        )}
      </main>
      {sessionView ? null : (
        <footer className="relative z-10 border-t border-border px-4 py-4">
          <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
            <DemoBadge>Demo accounts · no real Screen Time</DemoBadge>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="sm:hidden"
                onClick={handleLogout}
              >
                Log out
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="xl:hidden"
                onClick={handleReset}
              >
                Reset demo
              </Button>
            </div>
          </div>
        </footer>
      )}
      {sessionView ? null : <IdleSubjectPopup />}
    </div>
  );
}
