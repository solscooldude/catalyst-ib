"use client";

import { usePathname } from "next/navigation";
import { Wordmark } from "@/components/wordmark";
import { AccountMenu } from "@/components/account-menu";
import { NavTokenPill } from "@/components/nav-token-pill";
import { IdleSubjectPopup } from "@/components/idle-subject-popup";
import { SceneBackground } from "@/components/scene-background";
import { TopNav } from "@/components/top-nav";
import { useAuth } from "@/lib/auth";
import { isRoomFocusTheme } from "@/lib/focus-scene";
import { ROUTES } from "@/lib/routes";
import { useCatalyst } from "@/lib/store";
import { cn } from "@/lib/utils";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const state = useCatalyst();
  const auth = useAuth();
  const sessionView = pathname === ROUTES.session;
  const roomLock =
    pathname === ROUTES.lock && isRoomFocusTheme(state.appearance.focusTheme);

  return (
    <div
      className={cn(
        "relative flex min-h-dvh flex-col",
        sessionView && "bg-transparent",
      )}
    >
      {sessionView || roomLock ? null : (
        <SceneBackground id={state.appearance.background} />
      )}
      {sessionView ? null : (
        <header className="sticky top-0 z-50 overflow-visible bg-background/90 backdrop-blur-xl">
          <div className="mx-auto grid h-16 max-w-5xl grid-cols-[1fr_auto_1fr] items-center gap-3 overflow-visible px-4 sm:h-[4.5rem]">
            <Wordmark href={ROUTES.home} />
            <TopNav />
            <div className="flex items-center justify-end gap-2">
              <NavTokenPill />
              <AccountMenu />
            </div>
          </div>
        </header>
      )}
      <main
        className={cn(
          "relative z-10 flex w-full flex-1 flex-col",
          sessionView
            ? "max-w-none bg-transparent px-0 py-0"
            : "mx-auto w-full max-w-5xl px-4 pb-16 pt-6 sm:pt-8",
        )}
      >
        {!state.hydrated || !auth.hydrated ? (
          <div className="grid gap-4">
            <div className="h-8 w-48 animate-pulse rounded-full bg-muted" />
            <div className="h-48 animate-pulse rounded-[1.75rem] bg-muted" />
          </div>
        ) : (
          children
        )}
      </main>
      {sessionView ? null : (
        <footer className="relative z-10 px-4 py-8">
          <p className="mx-auto max-w-5xl text-center text-xs text-muted-foreground">
            Demo accounts · no real Screen Time
          </p>
        </footer>
      )}
      {sessionView ? null : <IdleSubjectPopup />}
    </div>
  );
}
