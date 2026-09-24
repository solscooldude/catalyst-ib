import { defaultAppOrigin } from "@/lib/app-origin";
import {
  normalizePolicySchedule,
  unlockedUntilFromUnlocks,
  type ExtensionPolicy,
} from "@/lib/domain-policy";
import { ROUTES } from "@/lib/routes";
import type { CatalystState } from "@/lib/store-core";

export function appOrigin() {
  return defaultAppOrigin();
}

export function buildExtensionPolicy(
  state: CatalystState,
  now = Date.now(),
): ExtensionPolicy {
  const session = state.session;
  const sessionActive = Boolean(
    session &&
      (session.status === "locked" || session.status === "focus") &&
      !session.pausedAt,
  );
  return {
    version: 1,
    updatedAt: now,
    schedule: normalizePolicySchedule(state.schedule),
    nemeses: [...state.nemeses],
    allowlistExtra: [...state.allowlistExtra],
    unlockedUntil: unlockedUntilFromUnlocks(state.unlocks, now),
    appOrigin: appOrigin(),
    sessionActive,
  };
}

export function unlocksHref() {
  return `${appOrigin()}${ROUTES.unlocks}`;
}
