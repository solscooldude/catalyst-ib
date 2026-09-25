const POLICY_MESSAGE = "CATALYST_LOCK_POLICY";
const PRESENT_MESSAGE = "CATALYST_LOCK_PRESENT";
const REQUEST_POLICY_MESSAGE = "CATALYST_LOCK_REQUEST_POLICY";

let lastPostedAt = 0;

function announce() {
  window.postMessage({ type: PRESENT_MESSAGE }, window.location.origin);
  window.postMessage({ type: REQUEST_POLICY_MESSAGE }, window.location.origin);
}

function sendPolicy(policy, attempt = 0) {
  if (!policy || typeof policy !== "object") return;
  try {
    chrome.runtime.sendMessage({ type: "SET_POLICY", policy }, () => {
      const err = chrome.runtime.lastError;
      if (err && attempt < 8) {
        window.setTimeout(
          () => sendPolicy(policy, attempt + 1),
          200 * (attempt + 1),
        );
        return;
      }
      if (!err) lastPostedAt = Date.now();
    });
  } catch {
    if (attempt < 8) {
      window.setTimeout(
        () => sendPolicy(policy, attempt + 1),
        200 * (attempt + 1),
      );
    }
  }
}

function policyFromCloud(snapshot) {
  if (!snapshot || typeof snapshot !== "object") return null;
  const now = Date.now();
  const unlockedUntil = {};
  for (const unlock of snapshot.unlocks || []) {
    const expiresAt = Number(unlock?.expiresAt);
    const id = String(unlock?.catalogId || "");
    if (!id || !Number.isFinite(expiresAt) || expiresAt <= now) continue;
    unlockedUntil[id] = Math.max(unlockedUntil[id] || 0, expiresAt);
  }
  return {
    version: 1,
    updatedAt: now,
    schedule: Array.isArray(snapshot.schedule) ? snapshot.schedule : [],
    nemeses: Array.isArray(snapshot.nemeses) ? snapshot.nemeses : [],
    allowlistExtra: Array.isArray(snapshot.allowlistExtra)
      ? snapshot.allowlistExtra
      : [],
    unlockedUntil,
    appOrigin: window.location.origin,
    sessionActive: false,
  };
}

async function pullCloudPolicy() {
  if (Date.now() - lastPostedAt < 15_000) return;
  try {
    const res = await fetch(`${window.location.origin}/api/account/state`, {
      credentials: "include",
      cache: "no-store",
    });
    if (!res.ok) return;
    const data = await res.json();
    const policy = policyFromCloud(data?.snapshot);
    if (policy) sendPolicy(policy);
  } catch {
    /* stay on postMessage */
  }
}

window.addEventListener("message", (event) => {
  if (event.source !== window || event.origin !== window.location.origin) return;
  const data = event.data;
  if (!data || typeof data !== "object") return;
  if (data.type === POLICY_MESSAGE && data.policy) {
    sendPolicy(data.policy);
    return;
  }
  if (data.type === "CATALYST_LOCK_SET_ENABLED") {
    try {
      chrome.runtime.sendMessage({
        type: "SET_ENABLED",
        enabled: data.enabled !== false,
      });
    } catch {
      /* worker waking */
    }
  }
});

document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") {
    announce();
    void pullCloudPolicy();
  }
});
window.addEventListener("pageshow", () => {
  announce();
  void pullCloudPolicy();
});

announce();
void pullCloudPolicy();

window.setInterval(() => {
  announce();
  void pullCloudPolicy();
}, 2500);
