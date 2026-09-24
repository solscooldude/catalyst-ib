import { describePopup } from "./policy.js";

const FALLBACK = "https://catalyst-study.vercel.app";

const statusEl = document.getElementById("status");
const detailEl = document.getElementById("status-detail");
const hoursEl = document.getElementById("hours");
const syncEl = document.getElementById("sync");
const unlocksEl = document.getElementById("unlocks");
const openEl = document.getElementById("open");

function paint(view) {
  statusEl.textContent = view.statusLabel;
  statusEl.className = `status ${view.status}`;
  detailEl.textContent = view.statusDetail;
  hoursEl.textContent = view.hours;
  syncEl.textContent = view.sync;
  unlocksEl.textContent = view.unlocks;
  openEl.href = view.openHref || FALLBACK;
}

async function readStored() {
  if (globalThis.chrome?.storage?.local) {
    const stored = await chrome.storage.local.get(["policy", "policyReceivedAt"]);
    return {
      policy: stored.policy || null,
      receivedAt: stored.policyReceivedAt || null,
    };
  }
  const fixture = new URLSearchParams(location.search).get("fixture");
  if (fixture === "on") {
    const now = Date.now();
    const clock = (ms) => {
      const d = new Date(ms);
      return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
    };
    return {
      policy: {
        version: 1,
        updatedAt: now - 12_000,
        schedule: [
          {
            days: [0, 1, 2, 3, 4, 5, 6],
            start: clock(now - 60 * 60 * 1000),
            end: clock(now + 2 * 60 * 60 * 1000),
            enabled: true,
          },
        ],
        unlockedUntil: { tier3: now + 8 * 60 * 1000 },
        appOrigin: FALLBACK,
      },
      receivedAt: now - 12_000,
    };
  }
  if (fixture === "off") {
    const now = Date.now();
    return {
      policy: {
        version: 1,
        updatedAt: now - 90_000,
        schedule: [
          { days: [1, 2, 3, 4, 5], start: "16:30", end: "19:30", enabled: true },
        ],
        unlockedUntil: {},
        appOrigin: FALLBACK,
      },
      receivedAt: now - 90_000,
    };
  }
  return { policy: null, receivedAt: null };
}

async function refresh() {
  const { policy, receivedAt } = await readStored();
  paint(describePopup(policy, Date.now(), receivedAt));
  if (globalThis.chrome?.runtime?.sendMessage) {
    chrome.runtime.sendMessage({ type: "REFRESH_BADGE" });
  }
}

openEl.addEventListener("click", (event) => {
  const href = openEl.href || FALLBACK;
  if (globalThis.chrome?.tabs?.create) {
    event.preventDefault();
    chrome.tabs.create({ url: href });
  }
});

refresh();
if (globalThis.chrome?.storage?.onChanged) {
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "local" && (changes.policy || changes.policyReceivedAt)) {
      void refresh();
    }
  });
}
setInterval(() => void refresh(), 1000);
