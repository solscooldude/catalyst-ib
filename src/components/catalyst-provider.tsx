"use client";

import { useEffect, useRef, useState } from "react";
import { ExtensionSync } from "@/components/extension-sync";
import { StreakAwardDialog } from "@/components/streak-award-dialog";
import { ThemeApplier } from "@/components/theme-applier";
import { TooltipProvider } from "@/components/ui/tooltip";
import { getAuthSnapshot, hydrateAuth, subscribeAuth, useAuth } from "@/lib/auth";
import { isClerkConfigured } from "@/lib/clerk-config";
import { loadCloudState, saveCloudState } from "@/lib/cloud-sync";
import { syncFriendsFromServer } from "@/lib/friends-client";
import {
  claimDailyLogin,
  getSnapshot,
  hydrateStore,
  saveIdentity,
  useCatalyst,
} from "@/lib/store";

export function CloudNotice({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <div className="mx-auto w-full max-w-5xl px-4 pt-3">
      <p className="rounded-2xl bg-primary/12 px-4 py-3 text-sm text-foreground ring-1 ring-primary/30">
        {message}
      </p>
    </div>
  );
}

export function CatalystProvider({ children }: { children: React.ReactNode }) {
  const auth = useAuth();
  const store = useCatalyst();
  const [notice, setNotice] = useState<string | null>(null);
  const cloudReady = useRef(false);
  const lastUserId = useRef<string | null>(null);

  useEffect(() => {
    hydrateAuth();
    if (!isClerkConfigured()) {
      const userId = getAuthSnapshot().user?.id ?? null;
      hydrateStore(userId);
      if (userId) claimDailyLogin();
      cloudReady.current = true;
    }
    const unsub = subscribeAuth(() => {
      const next = getAuthSnapshot();
      if (!next.hydrated) return;
      if (next.user?.id === lastUserId.current && store.hydrated) return;
      lastUserId.current = next.user?.id ?? null;
      hydrateStore(next.user?.id ?? null);
      if (next.user?.id) claimDailyLogin();
    });
    return () => {
      unsub();
    };
  }, [store.hydrated]);

  useEffect(() => {
    if (!auth.hydrated || !auth.user || auth.user.source !== "clerk") return;
    let cancelled = false;
    cloudReady.current = false;
    const imageUrl = auth.user.imageUrl;
    void loadCloudState(auth.user.id).then((result) => {
      if (cancelled) return;
      cloudReady.current = true;
      setNotice(result.message);
      claimDailyLogin();
      const current = getSnapshot();
      if (imageUrl && !current.avatarUrl && !current.avatarDataUrl) {
        saveIdentity({ avatarUrl: imageUrl });
      }
      void syncFriendsFromServer();
    });
    return () => {
      cancelled = true;
    };
  }, [auth.hydrated, auth.user]);

  useEffect(() => {
    if (!auth.user || auth.user.source !== "clerk" || !store.hydrated) return;
    if (!cloudReady.current) return;
    const timer = window.setTimeout(() => {
      void saveCloudState().catch(() => {
        setNotice("Could not save to your account. Retry from Account settings.");
      });
    }, 900);
    return () => window.clearTimeout(timer);
  }, [
    auth.user,
    store.hydrated,
    store.tokens,
    store.schedule,
    store.nemeses,
    store.allowlistExtra,
    store.unlocks,
    store.username,
    store.avatarUrl,
    store.appearance,
    store.spriteName,
    store.spriteSpecies,
    store.petQuizComplete,
    store.extraMagical,
    store.dailyGoalMinutes,
    store.setupComplete,
    store.introSeen,
    store.profile,
    store.demoMode,
    store.streakAwardsShown,
    store.pendingStreakAward,
    store.lastLoginDay,
    store.streakDays,
    store.friendCode,
    store.friends,
    store.incomingRequests,
    store.outgoingRequests,
  ]);

  return (
    <TooltipProvider>
      <ThemeApplier />
      <ExtensionSync>
        <CloudNotice message={notice} />
        <StreakAwardDialog />
        {children}
      </ExtensionSync>
    </TooltipProvider>
  );
}
