"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { POLICY_MESSAGE, PRESENT_MESSAGE } from "@/lib/domain-policy";
import { buildExtensionPolicy } from "@/lib/extension-sync";
import { useCatalyst } from "@/lib/store";

const ExtensionConnectedContext = createContext(false);

export function useExtensionConnected() {
  return useContext(ExtensionConnectedContext);
}

export function ExtensionSync({ children }: { children?: React.ReactNode }) {
  const state = useCatalyst();
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    function onMessage(event: MessageEvent) {
      if (event.origin !== window.location.origin) return;
      if (event.source !== window) return;
      if (event.data?.type === PRESENT_MESSAGE) setConnected(true);
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  useEffect(() => {
    if (!state.hydrated) return;
    const policy = buildExtensionPolicy(state);
    function publish() {
      window.postMessage(
        { type: POLICY_MESSAGE, policy },
        window.location.origin,
      );
    }
    publish();
    function onVis() {
      if (document.visibilityState === "visible") publish();
    }
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [
    state.hydrated,
    state.schedule,
    state.nemeses,
    state.allowlistExtra,
    state.unlocks,
  ]);

  return (
    <ExtensionConnectedContext.Provider value={connected}>
      {children ?? null}
    </ExtensionConnectedContext.Provider>
  );
}
