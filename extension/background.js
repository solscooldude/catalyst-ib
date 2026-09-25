import {
  BLOCK_APPS,
  decideUrl,
  describePopup,
  isAppCovered,
  lockForcedOn,
  nextStoredEnabled,
  normalizePolicySchedule,
  shouldInstallBlockRules,
} from "./policy.js";

const RECENT = new Map();
const RECENT_MS = 1500;
const ALARM = "catalyst-lock-tick";

function defaultPolicy() {
  return {
    version: 1,
    schedule: [],
    nemeses: [],
    allowlistExtra: [],
    unlockedUntil: {},
    appOrigin: "https://catalyst-study.vercel.app",
  };
}

function hydratePolicy(stored, now = new Date()) {
  const raw = stored?.policy && typeof stored.policy === "object"
    ? stored.policy
    : defaultPolicy();
  const policy = {
    ...raw,
    schedule: normalizePolicySchedule(raw.schedule),
    nemeses: Array.isArray(raw.nemeses) ? raw.nemeses : [],
    allowlistExtra: Array.isArray(raw.allowlistExtra) ? raw.allowlistExtra : [],
    unlockedUntil:
      raw.unlockedUntil && typeof raw.unlockedUntil === "object"
        ? raw.unlockedUntil
        : {},
    appOrigin: raw.appOrigin || "https://catalyst-study.vercel.app",
  };
  policy.extensionEnabled = nextStoredEnabled(
    stored?.extensionEnabled,
    policy,
    now,
  );
  return policy;
}

async function readStored() {
  return chrome.storage.local.get([
    "policy",
    "extensionEnabled",
    "policyReceivedAt",
  ]);
}

async function readPolicy(now = new Date()) {
  return hydratePolicy(await readStored(), now);
}

function recentlyHandled(key) {
  const exp = RECENT.get(key);
  if (exp && exp > Date.now()) return true;
  RECENT.set(key, Date.now() + RECENT_MS);
  return false;
}

function clearRecent() {
  RECENT.clear();
}

async function refreshBadge(policy) {
  const current = policy || (await readPolicy());
  const view = describePopup(current, Date.now());
  const text =
    view.status === "on" ? "ON" : view.status === "off" ? "OFF" : "?";
  const title =
    view.status === "on"
      ? "Catalyst Lock · ON"
      : view.status === "off"
        ? "Catalyst Lock · OFF"
        : "Catalyst Lock · not synced";
  await chrome.action.setBadgeText({ text });
  await chrome.action.setBadgeBackgroundColor({
    color:
      view.status === "on"
        ? "#5EEAD4"
        : view.status === "off"
          ? "#3F3F46"
          : "#52525B",
  });
  if (chrome.action.setBadgeTextColor) {
    await chrome.action.setBadgeTextColor({
      color: view.status === "on" ? "#042F2E" : "#F4F4F5",
    });
  }
  await chrome.action.setTitle({ title });
}

function isExtensionPage(url) {
  return Boolean(url && url.startsWith(chrome.runtime.getURL("")));
}

function unlocksHref(policy) {
  const origin = String(policy?.appOrigin || "https://catalyst-study.vercel.app")
    .trim()
    .replace(/\/$/, "");
  return `${origin || "https://catalyst-study.vercel.app"}/unlocks`;
}

function lockedUrl(policy, decision, url) {
  const locked = new URL(chrome.runtime.getURL("locked.html"));
  locked.searchParams.set("app", decision.name);
  locked.searchParams.set("id", decision.appId);
  locked.searchParams.set("tier", decision.tier);
  try {
    locked.searchParams.set("host", new URL(url).hostname);
  } catch {
    locked.searchParams.set("host", decision.appId);
  }
  locked.searchParams.set("next", unlocksHref(policy));
  return locked.toString();
}

/**
 * Persist enabled=true during a lock window, then install or drop DNR rules.
 * Every trigger (alarm, startup, policy sync, tab navigation) must run this
 * so a leftover Off cannot skip redirects.
 */
async function applyLockState({ scanTabs = true } = {}) {
  const now = new Date();
  const stored = await readStored();
  const policy = hydratePolicy(stored, now);
  if (stored.extensionEnabled !== policy.extensionEnabled) {
    await chrome.storage.local.set({
      extensionEnabled: policy.extensionEnabled,
    });
  }
  try {
    await refreshBadge(policy);
  } catch {
    /* badge APIs are best-effort */
  }
  try {
    await syncDeclarativeRules(policy);
  } catch {
    /* tab redirects still run below */
  }
  if (scanTabs) {
    try {
      await enforceAllTabs(policy);
    } catch {
      /* individual tab updates are best-effort */
    }
  }
  return policy;
}

async function enforce(tabId, url, policy) {
  if (!url || isExtensionPage(url)) return;
  const current = policy || (await applyLockState({ scanTabs: false }));
  const decision = decideUrl(url, current, Date.now());
  if (decision.action !== "block") return;
  const key = `${tabId}:${url}`;
  if (recentlyHandled(key)) return;
  try {
    await chrome.tabs.update(tabId, { url: lockedUrl(current, decision, url) });
  } catch {
    RECENT.delete(key);
  }
}

async function enforceAllTabs(policy) {
  clearRecent();
  const current = policy || (await applyLockState({ scanTabs: false }));
  const tabs = await chrome.tabs.query({});
  await Promise.all(
    tabs.map((tab) =>
      tab.id && tab.url ? enforce(tab.id, tab.url, current) : Promise.resolve(),
    ),
  );
}

async function applyThenEnforce(tabId, url) {
  const policy = await applyLockState({ scanTabs: false });
  await enforce(tabId, url, policy);
}

async function syncDeclarativeRules(policy) {
  if (!chrome.declarativeNetRequest?.updateDynamicRules) return;
  const existing = await chrome.declarativeNetRequest.getDynamicRules();
  const removeRuleIds = existing.map((rule) => rule.id);
  if (!shouldInstallBlockRules(policy)) {
    if (removeRuleIds.length) {
      await chrome.declarativeNetRequest.updateDynamicRules({ removeRuleIds });
    }
    return;
  }
  const now = Date.now();
  const addRules = [];
  let id = 1;
  for (const app of BLOCK_APPS) {
    if (
      isAppCovered(app.id, policy.unlockedUntil || {}, policy.nemeses || [], now)
    ) {
      continue;
    }
    for (const host of app.hosts) {
      addRules.push({
        id: id++,
        priority: 1,
        action: {
          type: "redirect",
          redirect: {
            url: lockedUrl(policy, { name: app.name, appId: app.id, tier: app.tier }, `https://${host}/`),
          },
        },
        condition: {
          urlFilter: `||${host}^`,
          resourceTypes: ["main_frame"],
        },
      });
    }
  }
  await chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds,
    addRules,
  });
}

function ensureAlarm() {
  chrome.alarms.create(ALARM, { periodInMinutes: 1 });
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type === "SET_POLICY" && message.policy) {
    chrome.storage.local.get(["extensionEnabled"], (stored) => {
      const incoming = { ...message.policy };
      delete incoming.extensionEnabled;
      incoming.schedule = normalizePolicySchedule(incoming.schedule);
      if (typeof incoming.updatedAt !== "number") {
        incoming.updatedAt = Date.now();
      }
      const enabled = nextStoredEnabled(
        stored.extensionEnabled,
        incoming,
        new Date(),
      );
      chrome.storage.local.set(
        {
          policy: incoming,
          policyReceivedAt: Date.now(),
          extensionEnabled: enabled,
        },
        () => {
          void applyLockState({ scanTabs: true }).then((policy) => {
            sendResponse({
              ok: true,
              forcedOn: lockForcedOn(policy),
              enabled: policy.extensionEnabled,
            });
          });
        },
      );
    });
    return true;
  }
  if (message?.type === "SET_ENABLED") {
    chrome.storage.local.get(["policy", "extensionEnabled"], (stored) => {
      const policy = hydratePolicy(stored);
      if (lockForcedOn(policy)) {
        chrome.storage.local.set({ extensionEnabled: true }, () => {
          void applyLockState({ scanTabs: true }).then((next) => {
            sendResponse({
              ok: true,
              enabled: true,
              forced: true,
              view: describePopup(next, Date.now(), stored.policyReceivedAt),
            });
          });
        });
        return;
      }
      const enabled = message.enabled !== false;
      chrome.storage.local.set({ extensionEnabled: enabled }, () => {
        void applyLockState({ scanTabs: true }).then((next) => {
          sendResponse({
            ok: true,
            enabled,
            forced: false,
            view: describePopup(next, Date.now(), stored.policyReceivedAt),
          });
        });
      });
    });
    return true;
  }
  if (message?.type === "GET_POLICY" || message?.type === "GET_LOCK_STATE") {
    void applyLockState({ scanTabs: false }).then(async (policy) => {
      const stored = await readStored();
      sendResponse({
        ok: true,
        policy,
        view: describePopup(policy, Date.now(), stored.policyReceivedAt),
      });
    });
    return true;
  }
  if (message?.type === "GET_VERSION") {
    sendResponse({
      ok: true,
      version: chrome.runtime.getManifest().version,
    });
    return false;
  }
  if (message?.type === "REFRESH_BADGE") {
    applyLockState({ scanTabs: false }).then(async (policy) => {
      const stored = await readStored();
      sendResponse({
        ok: true,
        policy,
        view: describePopup(policy, Date.now(), stored.policyReceivedAt),
      });
    });
    return true;
  }
  return false;
});

chrome.runtime.onInstalled.addListener(() => {
  ensureAlarm();
  void applyLockState({ scanTabs: true });
});
chrome.runtime.onStartup.addListener(() => {
  ensureAlarm();
  void applyLockState({ scanTabs: true });
});
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name !== ALARM) return;
  void applyLockState({ scanTabs: true });
});
chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== "local") return;
  if (changes.policy || changes.extensionEnabled) {
    void applyLockState({ scanTabs: true });
  }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  const url = changeInfo.url || tab.url;
  if (changeInfo.status === "loading" || changeInfo.url) {
    void applyThenEnforce(tabId, url);
  }
});

chrome.tabs.onActivated.addListener((active) => {
  chrome.tabs.get(active.tabId, (tab) => {
    if (tab?.url) void applyThenEnforce(tab.id, tab.url);
  });
});

chrome.webNavigation.onBeforeNavigate.addListener((details) => {
  if (details.frameId !== 0) return;
  void applyThenEnforce(details.tabId, details.url);
});

chrome.webNavigation.onCommitted.addListener((details) => {
  if (details.frameId !== 0) return;
  void applyThenEnforce(details.tabId, details.url);
});

ensureAlarm();
void applyLockState({ scanTabs: true });

globalThis.catalystLockDebug = {
  applyLockState,
  hydratePolicy,
  nextStoredEnabled,
};
