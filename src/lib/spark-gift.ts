import { sessionAccountId } from "@/lib/closet";
import { dayKey } from "@/lib/care";
import { setState } from "@/lib/store-core";

export function catchSparkToken() {
  if (typeof window === "undefined") {
    return { ok: false as const, reason: "Unavailable." };
  }
  const today = dayKey();
  const account = sessionAccountId() ?? "guest";
  const key = `catalyst-v1:catch:${account}:${today}`;
  const used = Number(window.localStorage.getItem(key) ?? "0");
  if (used >= 3) {
    return { ok: false as const, reason: "Caught enough stars today." };
  }
  window.localStorage.setItem(key, String(used + 1));
  setState((current) => ({
    ...current,
    tokens: current.tokens + 1,
    careActions: current.careActions + 1,
  }));
  return { ok: true as const, remaining: 2 - used };
}

export function awardDodgeBonus() {
  if (typeof window === "undefined") {
    return { ok: false as const, reason: "Unavailable." };
  }
  const today = dayKey();
  const account = sessionAccountId() ?? "guest";
  const key = `catalyst-v1:dodge:${account}:${today}`;
  const used = Number(window.localStorage.getItem(key) ?? "0");
  if (used >= 2) {
    return { ok: false as const, reason: "Dodge bonus already claimed today." };
  }
  window.localStorage.setItem(key, String(used + 1));
  setState((current) => ({
    ...current,
    tokens: current.tokens + 1,
    careActions: current.careActions + 1,
  }));
  return { ok: true as const, remaining: 1 - used };
}
