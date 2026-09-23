import { decideUrl } from "./policy.js";

const CHECKED = new Set();

async function readPolicy() {
  const stored = await chrome.storage.local.get("policy");
  return (
    stored.policy || {
      version: 1,
      schedule: [],
      nemeses: [],
      allowlistExtra: [],
      unlockedUntil: {},
      appOrigin: "https://catalyst-ib.vercel.app",
    }
  );
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
      : "https://catalyst-ib.vercel.app/unlocks",
  );
  try {
    await chrome.tabs.update(tabId, { url: locked.toString() });
  } catch {
    CHECKED.delete(key);
  }
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type === "SET_POLICY" && message.policy) {
    chrome.storage.local.set({ policy: message.policy }, () => {
      sendResponse({ ok: true });
    });
    return true;
  }
  if (message?.type === "GET_POLICY") {
    readPolicy().then((policy) => sendResponse({ ok: true, policy }));
    return true;
  }
  return false;
});

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
