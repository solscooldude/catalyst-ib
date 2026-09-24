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
  return {
    version: 1,
    updatedAt: now,
    schedule: normalizePolicySchedule(state.schedule),
    nemeses: [...state.nemeses],
    allowlistExtra: [...state.allowlistExtra],
    unlockedUntil: unlockedUntilFromUnlocks(state.unlocks, now),
    appOrigin: appOrigin(),
  };
}

export function unlocksHref() {
  return `${appOrigin()}${ROUTES.unlocks}`;
}
