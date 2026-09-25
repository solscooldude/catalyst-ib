"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import {
  POLICY_MESSAGE,
  PRESENT_MESSAGE,
  REQUEST_POLICY_MESSAGE,
} from "@/lib/domain-policy";
import { buildExtensionPolicy } from "@/lib/extension-sync";
import { useCatalyst } from "@/lib/store";

const ExtensionConnectedContext = createContext(false);

export function useExtensionConnected() {
  return useContext(ExtensionConnectedContext);
}

export function ExtensionSync({ children }: { children?: React.ReactNode }) {
  const state = useCatalyst();
  const [connected, setConnected] = useState(false);
  const policyRef = useRef(state.hydrated ? buildExtensionPolicy(state) : null);

  if (state.hydrated) {
    policyRef.current = buildExtensionPolicy(state);
  }

  useEffect(() => {
    function publish() {
      const policy = policyRef.current;
      if (!policy) return;
      window.postMessage(
        { type: POLICY_MESSAGE, policy },
        window.location.origin,
      );
    }

    function onMessage(event: MessageEvent) {
      if (event.origin !== window.location.origin) return;
      if (event.source !== window) return;
      const type = event.data?.type;
      if (type === PRESENT_MESSAGE || type === REQUEST_POLICY_MESSAGE) {
        setConnected(true);
        publish();
      }
    }

    window.addEventListener("message", onMessage);
    publish();
    return () => window.removeEventListener("message", onMessage);
  }, []);

  useEffect(() => {
    if (!state.hydrated) return;
    const policy = buildExtensionPolicy(state);
    policyRef.current = policy;
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
    const beat = window.setInterval(publish, 3000);
    return () => {
      document.removeEventListener("visibilitychange", onVis);
      window.clearInterval(beat);
    };
  }, [
    state.hydrated,
    state.schedule,
    state.nemeses,
    state.allowlistExtra,
    state.unlocks,
    state.session,
  ]);

  return (
    <ExtensionConnectedContext.Provider value={connected}>
      {children ?? null}
    </ExtensionConnectedContext.Provider>
  );
}
