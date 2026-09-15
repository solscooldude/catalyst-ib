import type { SessionKind } from "@/lib/store-core";

export const LAST_RECAP_KEY = "catalyst-v1:last-recap";

export type SessionRecap = {
  title: string;
  minutes: number;
  elapsedMs?: number;
  tokens: number;
  timeTokens: number;
  completionTokens: number;
  kind: SessionKind;
  endedAt: number;
};

/** Count-up clock: 0:00 → 24:18. Hours stay as extra minutes (70:05). */
export function formatElapsed(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export function recapElapsedMs(recap: Pick<SessionRecap, "minutes" | "elapsedMs">) {
  if (typeof recap.elapsedMs === "number" && recap.elapsedMs >= 0) {
    return recap.elapsedMs;
  }
  return Math.max(0, recap.minutes) * 60_000;
}

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
