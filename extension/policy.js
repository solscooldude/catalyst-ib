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
