"use client";

import { useEffect } from "react";
import { POLICY_MESSAGE } from "@/lib/domain-policy";
import { buildExtensionPolicy } from "@/lib/extension-sync";
import { useCatalyst } from "@/lib/store";

export function ExtensionSync() {
  const state = useCatalyst();

  useEffect(() => {
    if (!state.hydrated) return;
    const policy = buildExtensionPolicy(state);
    window.postMessage({ type: POLICY_MESSAGE, policy }, window.location.origin);
  }, [
    state.hydrated,
    state.schedule,
    state.nemeses,
    state.allowlistExtra,
    state.unlocks,
  ]);

  return null;
}
