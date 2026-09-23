import { unlockedUntilFromUnlocks, type ExtensionPolicy } from "@/lib/domain-policy";
import { ROUTES } from "@/lib/routes";
import type { CatalystState } from "@/lib/store-core";

export function appOrigin() {
  if (typeof window === "undefined") return "https://catalyst-ib.vercel.app";
  return window.location.origin;
}

export function buildExtensionPolicy(
  state: CatalystState,
  now = Date.now(),
): ExtensionPolicy {
  return {
    version: 1,
    updatedAt: now,
    schedule: state.schedule.map((window) => ({
      days: window.days,
      start: window.start,
      end: window.end,
      enabled: window.enabled,
    })),
    nemeses: [...state.nemeses],
    allowlistExtra: [...state.allowlistExtra],
    unlockedUntil: unlockedUntilFromUnlocks(state.unlocks, now),
    appOrigin: appOrigin(),
  };
}

export function unlocksHref() {
  return `${appOrigin()}${ROUTES.unlocks}`;
}
