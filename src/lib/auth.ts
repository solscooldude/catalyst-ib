"use client";

import { useSyncExternalStore } from "react";
import { AUTH_SESSION_KEY } from "@/lib/constants";
import { isClerkConfigured } from "@/lib/clerk-config";
import { claimDailyLogin, hydrateStore } from "@/lib/store";
import { setUiTheme } from "@/lib/ui-theme";

export type AuthUser = {
  id: string;
  email: string;
  imageUrl?: string | null;
  source: "clerk" | "local";
};

export type AuthState = {
  hydrated: boolean;
  user: AuthUser | null;
  clerkConfigured: boolean;
};

const defaultAuth: AuthState = {
  hydrated: false,
  user: null,
  clerkConfigured: isClerkConfigured(),
};

let authState: AuthState = defaultAuth;
const listeners = new Set<() => void>();
let clerkSignOut: (() => Promise<void>) | null = null;

function emit() {
  listeners.forEach((listener) => listener());
}

export function hydrateAuth() {
  if (typeof window === "undefined") return;
  const clerkConfigured = isClerkConfigured();
  if (clerkConfigured) {
    if (!authState.hydrated) {
      authState = {
        hydrated: false,
        user: authState.user,
        clerkConfigured: true,
      };
      emit();
    }
    return;
  }
  const sessionId = window.localStorage.getItem(AUTH_SESSION_KEY);
  authState = {
    hydrated: true,
    clerkConfigured: false,
    user: sessionId
      ? { id: sessionId, email: "", source: "local" }
      : null,
  };
  emit();
}

export function syncClerkSession(input: {
  loaded: boolean;
  user: {
    id: string;
    primaryEmailAddress?: { emailAddress?: string } | null;
    emailAddresses?: Array<{ emailAddress?: string }>;
    imageUrl?: string | null;
  } | null;
  signOut?: () => Promise<void>;
}) {
  clerkSignOut = input.signOut ?? clerkSignOut;
  if (!input.loaded) {
    authState = {
      hydrated: false,
      clerkConfigured: true,
      user: authState.user,
    };
    emit();
    return;
  }
  const email =
    input.user?.primaryEmailAddress?.emailAddress ||
    input.user?.emailAddresses?.[0]?.emailAddress ||
    "";
  authState = {
    hydrated: true,
    clerkConfigured: true,
    user: input.user
      ? {
          id: input.user.id,
          email,
          imageUrl: input.user.imageUrl ?? null,
          source: "clerk",
        }
      : null,
  };
  emit();
}

export function subscribeAuth(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getAuthSnapshot() {
  return authState;
}

export function getAuthServerSnapshot() {
  return defaultAuth;
}

export function useAuth() {
  return useSyncExternalStore(
    subscribeAuth,
    getAuthSnapshot,
    getAuthServerSnapshot,
  );
}

export function startLocalSession() {
  if (isClerkConfigured()) {
    return { ok: false as const, reason: "Connect Clerk to sign in." };
  }
  const id = crypto.randomUUID();
  window.localStorage.setItem(AUTH_SESSION_KEY, id);
  authState = {
    hydrated: true,
    clerkConfigured: false,
    user: { id, email: "", source: "local" },
  };
  hydrateStore(id);
  claimDailyLogin();
  setUiTheme("dark");
  emit();
  return { ok: true as const };
}

export async function logOut() {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(AUTH_SESSION_KEY);
  }
  if (authState.clerkConfigured && clerkSignOut) {
    await clerkSignOut();
  }
  authState = {
    hydrated: true,
    clerkConfigured: isClerkConfigured(),
    user: null,
  };
  hydrateStore(null);
  emit();
}
