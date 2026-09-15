/** Future billing stub — no live subscribe UI. */
const KEY = "catalyst-v1:subscription";

export type SubscriptionState = {
  plan: "monthly";
  status: "active" | "canceled";
};

const DEFAULT: SubscriptionState = {
  plan: "monthly",
  status: "active",
};

export function readSubscription(): SubscriptionState {
  if (typeof window === "undefined") return DEFAULT;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return DEFAULT;
    const parsed = JSON.parse(raw) as Partial<SubscriptionState>;
    return {
      plan: "monthly",
      status: parsed.status === "canceled" ? "canceled" : "active",
    };
  } catch {
    return DEFAULT;
  }
}

export function writeSubscription(next: SubscriptionState) {
  window.localStorage.setItem(KEY, JSON.stringify(next));
}
