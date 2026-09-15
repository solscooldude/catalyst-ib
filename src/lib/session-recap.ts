import type { SessionKind } from "@/lib/store-core";

export const LAST_RECAP_KEY = "catalyst-v1:last-recap";

export type SessionRecap = {
  title: string;
  minutes: number;
  tokens: number;
  timeTokens: number;
  completionTokens: number;
  kind: SessionKind;
  endedAt: number;
};

export function writeSessionRecap(recap: SessionRecap) {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(LAST_RECAP_KEY, JSON.stringify(recap));
  } catch {
    /* quota */
  }
}

export function readSessionRecap(): SessionRecap | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(LAST_RECAP_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SessionRecap;
  } catch {
    return null;
  }
}
