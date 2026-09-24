import { decideUrl, lockForcedOn, lockStatus } from "./policy.js";

const CHECKED = new Set();

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

async function enforce(tabId, url) {
  if (!url || isExtensionPage(url)) return;
  const key = `${tabId}:${url}`;
  if (CHECKED.has(key)) return;
  const policy = await readPolicy();
  const decision = decideUrl(url, policy, Date.now());
  if (decision.action !== "block") return;
  CHECKED.add(key);
  const locked = new URL(chrome.runtime.getURL("locked.html"));
  locked.searchParams.set("app", decision.name);
  locked.searchParams.set("id", decision.appId);
  locked.searchParams.set("tier", decision.tier);
  locked.searchParams.set("host", new URL(url).hostname);
  locked.searchParams.set(
    "next",
    policy.appOrigin
      ? `${policy.appOrigin.replace(/\/$/, "")}/unlocks`
      : "https://catalyst-study.vercel.app/unlocks",
  );
  try {
    await chrome.tabs.update(tabId, { url: locked.toString() });
  } catch {
    CHECKED.delete(key);
  }
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type === "SET_POLICY" && message.policy) {
    chrome.storage.local.get(["extensionEnabled"], (stored) => {
      const policy = { ...message.policy };
      delete policy.extensionEnabled;
      chrome.storage.local.set(
        { policy, policyReceivedAt: Date.now() },
        () => {
          void refreshBadge();
          sendResponse({ ok: true, forcedOn: lockForcedOn(policy) });
        },
      );
      if (stored.extensionEnabled === undefined) {
        chrome.storage.local.set({ extensionEnabled: true });
      }
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
        void refreshBadge();
        sendResponse({ ok: true, enabled: true, forced: true });
        return;
      }
      const enabled = message.enabled !== false;
      chrome.storage.local.set({ extensionEnabled: enabled }, () => {
        void refreshBadge();
        sendResponse({ ok: true, enabled, forced: false });
      });
    });
    return true;
  }
  if (message?.type === "GET_POLICY") {
    readPolicy().then((policy) => sendResponse({ ok: true, policy }));
    return true;
  }
  if (message?.type === "REFRESH_BADGE") {
    refreshBadge().then(() => sendResponse({ ok: true }));
    return true;
  }
  return false;
});

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get("extensionEnabled", (stored) => {
    if (stored.extensionEnabled === undefined) {
      chrome.storage.local.set({ extensionEnabled: true }, () => {
        void refreshBadge();
      });
      return;
    }
    void refreshBadge();
  });
});
chrome.runtime.onStartup.addListener(() => {
  void refreshBadge();
});
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "local" && (changes.policy || changes.extensionEnabled)) {
    void refreshBadge();
  }
});
void refreshBadge();

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  const url = changeInfo.url || tab.url;
  if (changeInfo.status === "loading" || changeInfo.url) {
    void enforce(tabId, url);
  }
});

chrome.webNavigation.onCommitted.addListener((details) => {
  if (details.frameId !== 0) return;
  void enforce(details.tabId, details.url);
});
