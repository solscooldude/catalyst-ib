export const POLICY_MESSAGE = "CATALYST_LOCK_POLICY";

export const DEFAULT_ALLOW_HOSTS = [
  "docs.google.com",
  "drive.google.com",
  "classroom.google.com",
  "sheets.google.com",
  "slides.google.com",
  "mail.google.com",
  "calendar.google.com",
  "wikipedia.org",
  "wikimedia.org",
  "khanacademy.org",
  "quizlet.com",
  "notion.so",
  "notion.site",
  "chatgpt.com",
  "chat.openai.com",
  "claude.ai",
  "gemini.google.com",
  "managebac.com",
  "localhost",
  "127.0.0.1",
  "catalyst-ib.vercel.app",
];

export const BLOCK_APPS = [
  { id: "photos", name: "Photos", tier: "tier2", hosts: ["photos.google.com"] },
  {
    id: "food",
    name: "Food delivery",
    tier: "tier2",
    hosts: [
      "ubereats.com",
      "deliveroo.com",
      "doordash.com",
      "grubhub.com",
      "just-eat.com",
    ],
  },
  {
    id: "flightradar",
    name: "Flightradar24",
    tier: "tier2",
    hosts: ["flightradar24.com"],
  },
  {
    id: "messages",
    name: "Messages",
    tier: "tier2",
    hosts: ["messages.google.com"],
  },
  { id: "instagram", name: "Instagram", tier: "tier3", hosts: ["instagram.com"] },
  { id: "tiktok", name: "TikTok", tier: "tier3", hosts: ["tiktok.com"] },
  { id: "snapchat", name: "Snapchat", tier: "tier3", hosts: ["snapchat.com"] },
  { id: "reddit", name: "Reddit", tier: "tier3", hosts: ["reddit.com"] },
  { id: "x", name: "X", tier: "tier3", hosts: ["x.com", "twitter.com"] },
  {
    id: "discord",
    name: "Discord",
    tier: "tier3",
    hosts: ["discord.com", "discord.gg"],
  },
  {
    id: "youtube",
    name: "YouTube",
    tier: "nemesis",
    hosts: ["youtube.com", "youtu.be"],
  },
  {
    id: "whatsapp",
    name: "WhatsApp",
    tier: "nemesis",
    hosts: ["whatsapp.com", "web.whatsapp.com"],
  },
];

const NEMESIS_ONLY = new Set(["youtube", "whatsapp"]);

export function hostMatches(host, pattern) {
  const h = String(host || "").toLowerCase();
  const p = String(pattern || "")
    .toLowerCase()
    .replace(/^\*\./, "");
  return h === p || h.endsWith(`.${p}`);
}

export function hostnameFromUrl(url) {
  try {
    return new URL(url).hostname.toLowerCase();
  } catch {
    return "";
  }
}

function parseClock(hhmm) {
  const match = /^([01]?\d|2[0-3]):([0-5]\d)/.exec(String(hhmm || "").trim());
  if (!match) return null;
  return Number(match[1]) * 60 + Number(match[2]);
}

export function windowContains(window, now) {
  if (!window || window.enabled === false) return false;
  const start = parseClock(window.start);
  const end = parseClock(window.end);
  if (start == null || end == null || start === end) return false;
  const mins = now.getHours() * 60 + now.getMinutes();
  const today = now.getDay();
  const yesterday = (today + 6) % 7;
  const days = window.days || [];
  if (end > start) return days.includes(today) && mins >= start && mins < end;
  if (mins >= start) return days.includes(today);
  return mins < end && days.includes(yesterday);
}

export function inLockHours(schedule, now = new Date()) {
  return (schedule || []).some((window) => windowContains(window, now));
}

export function isAllowlisted(host, extra = []) {
  return [...DEFAULT_ALLOW_HOSTS, ...extra].some((pattern) =>
    hostMatches(host, pattern),
  );
}

export function findBlockApp(host) {
  return BLOCK_APPS.find((app) =>
    app.hosts.some((pattern) => hostMatches(host, pattern)),
  );
}

export function isAppCovered(appId, unlockedUntil = {}, nemeses = [], now = Date.now()) {
  const live = (id) => (unlockedUntil[id] || 0) > now;
  if (nemeses.includes(appId)) return live("nemesis") || live(appId);
  if (NEMESIS_ONLY.has(appId)) return true;
  const app = BLOCK_APPS.find((row) => row.id === appId);
  if (!app) return live(appId);
  if (app.tier === "tier2") return live(appId) || live("tier2");
  return live(appId) || live("tier3");
}

export function decideUrl(url, policy, now = Date.now()) {
  if (!url || /^(chrome|about|moz-extension|edge|devtools):/i.test(url)) {
    return { action: "allow", reason: "unknown" };
  }
  const host = hostnameFromUrl(url);
  if (!host) return { action: "allow", reason: "unknown" };
  if (isAllowlisted(host, policy.allowlistExtra || [])) {
    return { action: "allow", reason: "allowlist" };
  }
  if (!inLockHours(policy.schedule || [], new Date(now))) {
    return { action: "allow", reason: "outside-hours" };
  }
  const app = findBlockApp(host);
  if (!app) return { action: "allow", reason: "unknown" };
  if (isAppCovered(app.id, policy.unlockedUntil || {}, policy.nemeses || [], now)) {
    return { action: "allow", reason: "unlocked", appId: app.id, name: app.name };
  }
  return {
    action: "block",
    reason: "lock",
    appId: app.id,
    name: app.name,
    tier: app.tier,
  };
}

const DAY_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const UNLOCK_LABELS = {
  tier2: "Tier 2",
  tier3: "Tier 3",
  nemesis: "Nemesis",
};

export function formatClock(hhmm) {
  const mins = parseClock(hhmm);
  if (mins == null) return String(hhmm || "");
  const hours = Math.floor(mins / 60);
  const minutes = mins % 60;
  const suffix = hours >= 12 ? "pm" : "am";
  const hour12 = hours % 12 || 12;
  return minutes === 0
    ? `${hour12}${suffix}`
    : `${hour12}:${String(minutes).padStart(2, "0")}${suffix}`;
}

export function formatDays(days) {
  const list = Array.isArray(days) ? days : [];
  const set = new Set(list);
  if (list.length === 7 && [0, 1, 2, 3, 4, 5, 6].every((day) => set.has(day))) {
    return "Every day";
  }
  if (list.length === 5 && [1, 2, 3, 4, 5].every((day) => set.has(day))) {
    return "Weeknights";
  }
  if (list.length === 2 && set.has(0) && set.has(6)) return "Weekends";
  return [1, 2, 3, 4, 5, 6, 0]
    .filter((day) => set.has(day))
    .map((day) => DAY_SHORT[day])
    .join(" · ");
}

export function formatWindowLite(window) {
  if (!window) return "";
  const start = parseClock(window.start);
  const end = parseClock(window.end);
  const overnight = start != null && end != null && end <= start;
  return `${formatDays(window.days)} · ${formatClock(window.start)}–${formatClock(window.end)}${
    overnight ? " (overnight)" : ""
  }`;
}

export function formatUnlockLeft(ms) {
  if (ms <= 0) return "ended";
  const total = Math.ceil(ms / 1000);
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60);
    return `${hours}h ${minutes % 60}m`;
  }
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export function formatSyncedAgo(at, now = Date.now()) {
  if (!at) return null;
  const delta = Math.max(0, now - Number(at));
  const seconds = Math.floor(delta / 1000);
  if (seconds < 10) return "just now";
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function policyIsSynced(policy) {
  return Boolean(policy && typeof policy.updatedAt === "number");
}

export function lockStatus(policy, now = new Date()) {
  if (!policyIsSynced(policy)) return "unknown";
  return inLockHours(policy.schedule || [], now) ? "on" : "off";
}

export function activeUnlockRows(unlockedUntil = {}, now = Date.now()) {
  return Object.entries(unlockedUntil)
    .filter(([, exp]) => Number(exp) > now)
    .map(([id, exp]) => ({
      id,
      label: UNLOCK_LABELS[id] || id,
      leftMs: Number(exp) - now,
    }))
    .sort((a, b) => a.leftMs - b.leftMs);
}

export function catalystOrigin(policy) {
  const raw = String(policy?.appOrigin || "https://catalyst-ib.vercel.app").trim();
  return raw.replace(/\/$/, "") || "https://catalyst-ib.vercel.app";
}

export function describePopup(policy, now = Date.now(), receivedAt = null) {
  const status = lockStatus(policy, new Date(now));
  const synced = policyIsSynced(policy);
  const windows = (policy?.schedule || []).filter((row) => row && row.enabled !== false);
  const unlocks = activeUnlockRows(policy?.unlockedUntil, now);
  const ago = formatSyncedAgo(receivedAt || policy?.updatedAt, now);
  return {
    status,
    statusLabel: status === "on" ? "ON" : status === "off" ? "OFF" : "Unknown",
    statusDetail:
      status === "on"
        ? "In lock hours"
        : status === "off"
          ? "Outside lock hours"
          : "No policy synced yet",
    hours:
      !synced || windows.length === 0
        ? "No schedule synced — open Catalyst"
        : windows.map(formatWindowLite).join("\n"),
    sync: synced
      ? `Catalyst tab synced${ago ? ` · ${ago}` : ""}`
      : "Not synced — open Catalyst",
    unlocks:
      unlocks.length === 0
        ? "None"
        : unlocks
            .map((row) => `${row.label} · ${formatUnlockLeft(row.leftMs)} left`)
            .join("\n"),
    openHref: catalystOrigin(policy),
  };
}
