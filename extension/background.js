import {
  BLOCK_APPS,
  decideUrl,
  isAppCovered,
  lockForcedOn,
  lockIsOn,
  lockStatus,
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

async function readPolicy() {
  const stored = await chrome.storage.local.get(["policy", "extensionEnabled"]);
  return {
    ...(stored.policy || defaultPolicy()),
    extensionEnabled: stored.extensionEnabled !== false,
  };
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

async function refreshBadge() {
  const policy = await readPolicy();
  const status = lockStatus(policy);
  const text = status === "on" ? "ON" : status === "off" ? "OFF" : "?";
  const title =
    status === "on"
      ? "Catalyst Lock · ON"
      : status === "off"
        ? "Catalyst Lock · OFF"
        : "Catalyst Lock · not synced";
  await chrome.action.setBadgeText({ text });
  await chrome.action.setBadgeBackgroundColor({
    color: status === "on" ? "#5EEAD4" : status === "off" ? "#3F3F46" : "#52525B",
  });
  if (chrome.action.setBadgeTextColor) {
    await chrome.action.setBadgeTextColor({
      color: status === "on" ? "#042F2E" : "#F4F4F5",
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

async function enforce(tabId, url) {
  if (!url || isExtensionPage(url)) return;
  const policy = await readPolicy();
  const decision = decideUrl(url, policy, Date.now());
  if (decision.action !== "block") return;
  const key = `${tabId}:${url}`;
  if (recentlyHandled(key)) return;
  try {
    await chrome.tabs.update(tabId, { url: lockedUrl(policy, decision, url) });
  } catch {
    RECENT.delete(key);
  }
}

async function enforceAllTabs() {
  clearRecent();
  const tabs = await chrome.tabs.query({});
  await Promise.all(
    tabs.map((tab) =>
      tab.id && tab.url ? enforce(tab.id, tab.url) : Promise.resolve(),
    ),
  );
}

async function syncDeclarativeRules() {
  if (!chrome.declarativeNetRequest?.updateDynamicRules) return;
  const policy = await readPolicy();
  const existing = await chrome.declarativeNetRequest.getDynamicRules();
  const removeRuleIds = existing.map((rule) => rule.id);
  if (!lockIsOn(policy)) {
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
            extensionPath: `/locked.html?app=${encodeURIComponent(app.name)}&id=${app.id}&tier=${app.tier}&host=${encodeURIComponent(host)}&next=${encodeURIComponent(unlocksHref(policy))}`,
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

async function clearStoredOffDuringLock() {
  const stored = await chrome.storage.local.get(["policy", "extensionEnabled"]);
  const policy = {
    ...(stored.policy || defaultPolicy()),
    extensionEnabled: stored.extensionEnabled !== false,
  };
  if (lockForcedOn(policy) && stored.extensionEnabled === false) {
    await chrome.storage.local.set({ extensionEnabled: true });
  }
}

async function reevaluate(scanTabs = true) {
  await clearStoredOffDuringLock();
  await refreshBadge();
  await syncDeclarativeRules();
  if (scanTabs) await enforceAllTabs();
}

function ensureAlarm() {
  chrome.alarms.create(ALARM, { periodInMinutes: 1 });
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type === "SET_POLICY" && message.policy) {
    chrome.storage.local.get(["extensionEnabled"], (stored) => {
      const policy = { ...message.policy };
      delete policy.extensionEnabled;
      const writes = { policy, policyReceivedAt: Date.now() };
      if (lockForcedOn(policy) || stored.extensionEnabled === undefined) {
        writes.extensionEnabled = true;
      }
      chrome.storage.local.set(writes, () => {
        void reevaluate(true);
        sendResponse({ ok: true, forcedOn: lockForcedOn(policy) });
      });
    });
    return true;
  }
  if (message?.type === "SET_ENABLED") {
    chrome.storage.local.get(["policy", "extensionEnabled"], (stored) => {
      const policy = {
        ...(stored.policy || defaultPolicy()),
        extensionEnabled: stored.extensionEnabled !== false,
      };
      if (lockForcedOn(policy)) {
        void reevaluate(true);
        sendResponse({ ok: true, enabled: true, forced: true });
        return;
      }
      const enabled = message.enabled !== false;
      chrome.storage.local.set({ extensionEnabled: enabled }, () => {
        void reevaluate(true);
        sendResponse({ ok: true, enabled, forced: false });
      });
    });
    return true;
  }
  if (message?.type === "GET_POLICY") {
    readPolicy().then((policy) => sendResponse({ ok: true, policy }));
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
    reevaluate(false).then(() => sendResponse({ ok: true }));
    return true;
  }
  return false;
});

chrome.runtime.onInstalled.addListener(() => {
  ensureAlarm();
  chrome.storage.local.get("extensionEnabled", (stored) => {
    if (stored.extensionEnabled === undefined) {
      chrome.storage.local.set({ extensionEnabled: true }, () => {
        void reevaluate(true);
      });
      return;
    }
    void reevaluate(true);
  });
});
chrome.runtime.onStartup.addListener(() => {
  ensureAlarm();
  void reevaluate(true);
});
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name !== ALARM) return;
  void reevaluate(true);
});
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "local" && (changes.policy || changes.extensionEnabled)) {
    void reevaluate(true);
  }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  const url = changeInfo.url || tab.url;
  if (changeInfo.status === "loading" || changeInfo.url) {
    void enforce(tabId, url);
  }
});

chrome.tabs.onActivated.addListener((active) => {
  chrome.tabs.get(active.tabId, (tab) => {
    if (tab?.url) void enforce(tab.id, tab.url);
  });
});

chrome.webNavigation.onCommitted.addListener((details) => {
  if (details.frameId !== 0) return;
  void enforce(details.tabId, details.url);
});

ensureAlarm();
void reevaluate(true);
