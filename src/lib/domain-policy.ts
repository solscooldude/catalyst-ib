import type { UnlockSpendId } from "@/lib/constants";
import {
  isNemesisId,
  isNemesisOnlyId,
  isUnlockCatalogId,
  isUnlockTierSpendId,
} from "@/lib/constants";

export type PolicyTier = "tier2" | "tier3" | "nemesis";

export type HostEntry = {
  id: string;
  label: string;
  hosts: readonly string[];
};

export type BlockApp = {
  id: string;
  name: string;
  tier: PolicyTier;
  hosts: readonly string[];
};

export const DEFAULT_ALLOWLIST: readonly HostEntry[] = [
  {
    id: "docs",
    label: "Google Docs",
    hosts: ["docs.google.com"],
  },
  {
    id: "drive",
    label: "Google Drive",
    hosts: ["drive.google.com"],
  },
  {
    id: "classroom",
    label: "Google Classroom",
    hosts: ["classroom.google.com"],
  },
  {
    id: "sheets",
    label: "Google Sheets",
    hosts: ["sheets.google.com"],
  },
  {
    id: "slides",
    label: "Google Slides",
    hosts: ["slides.google.com"],
  },
  {
    id: "gmail",
    label: "Gmail",
    hosts: ["mail.google.com"],
  },
  {
    id: "calendar",
    label: "Google Calendar",
    hosts: ["calendar.google.com"],
  },
  {
    id: "wikipedia",
    label: "Wikipedia",
    hosts: ["wikipedia.org", "wikimedia.org"],
  },
  {
    id: "khan",
    label: "Khan Academy",
    hosts: ["khanacademy.org"],
  },
  {
    id: "quizlet",
    label: "Quizlet",
    hosts: ["quizlet.com"],
  },
  {
    id: "notion",
    label: "Notion",
    hosts: ["notion.so", "notion.site"],
  },
  {
    id: "chatgpt",
    label: "ChatGPT",
    hosts: ["chatgpt.com", "chat.openai.com"],
  },
  {
    id: "claude",
    label: "Claude",
    hosts: ["claude.ai"],
  },
  {
    id: "gemini",
    label: "Gemini",
    hosts: ["gemini.google.com"],
  },
  {
    id: "managebac",
    label: "ManageBac",
    hosts: ["managebac.com"],
  },
  {
    id: "localhost",
    label: "Localhost",
    hosts: ["localhost", "127.0.0.1"],
  },
  {
    id: "catalyst",
    label: "Catalyst",
    hosts: [
      "catalyst-study.vercel.app",
      "catalyst-focus.vercel.app",
      "catalyst-ib.vercel.app",
    ],
  },
];

export const BLOCK_APPS: readonly BlockApp[] = [
  {
    id: "photos",
    name: "Photos",
    tier: "tier2",
    hosts: ["photos.google.com"],
  },
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
  {
    id: "instagram",
    name: "Instagram",
    tier: "tier3",
    hosts: ["instagram.com"],
  },
  {
    id: "tiktok",
    name: "TikTok",
    tier: "tier3",
    hosts: ["tiktok.com"],
  },
  {
    id: "snapchat",
    name: "Snapchat",
    tier: "tier3",
    hosts: ["snapchat.com"],
  },
  {
    id: "reddit",
    name: "Reddit",
    tier: "tier3",
    hosts: ["reddit.com"],
  },
  {
    id: "x",
    name: "X",
    tier: "tier3",
    hosts: ["x.com", "twitter.com"],
  },
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

export type LockWindowLite = {
  days: number[];
  start: string;
  end: string;
  enabled?: boolean;
};

export type ExtensionPolicy = {
  version: 1;
  updatedAt: number;
  schedule: LockWindowLite[];
  nemeses: string[];
  allowlistExtra: string[];
  unlockedUntil: Partial<Record<string, number>>;
  appOrigin: string;
  sessionActive?: boolean;
};

export const POLICY_MESSAGE = "CATALYST_LOCK_POLICY";
export const PRESENT_MESSAGE = "CATALYST_LOCK_PRESENT";
export const REQUEST_POLICY_MESSAGE = "CATALYST_LOCK_REQUEST_POLICY";
export const UNLOCK_MINUTES = [10, 20, 30] as const;
export type UnlockMinutes = (typeof UNLOCK_MINUTES)[number];

export function normalizeHost(raw: string) {
  const trimmed = raw.trim().toLowerCase();
  if (!trimmed) return "";
  try {
    const url = trimmed.includes("://")
      ? new URL(trimmed)
      : new URL(`https://${trimmed}`);
    return url.hostname.replace(/\.+$/, "");
  } catch {
    return trimmed
      .replace(/^https?:\/\//, "")
      .split("/")[0]
      .replace(/^www\./, "")
      .replace(/\.+$/, "");
  }
}

export function normalizeHostList(raw: unknown, max = 40) {
  if (!Array.isArray(raw)) return [];
  const next = raw
    .map((item) => normalizeHost(String(item ?? "")))
    .filter(Boolean);
  return [...new Set(next)].slice(0, max);
}

export function hostMatches(host: string, pattern: string) {
  const h = host.toLowerCase();
  const p = pattern.toLowerCase().replace(/^\*\./, "");
  return h === p || h.endsWith(`.${p}`);
}

export function hostnameFromUrl(url: string) {
  try {
    return new URL(url).hostname.toLowerCase();
  } catch {
    return "";
  }
}

function parseClock(hhmm: string) {
  const match = /^([01]?\d|2[0-3]):([0-5]\d)/.exec(hhmm.trim());
  if (!match) return null;
  return Number(match[1]) * 60 + Number(match[2]);
}

const DAY_ALIASES: Record<string, number> = {
  sun: 0,
  sunday: 0,
  mon: 1,
  monday: 1,
  tue: 2,
  tues: 2,
  tuesday: 2,
  wed: 3,
  wednesday: 3,
  thu: 4,
  thur: 4,
  thurs: 4,
  thursday: 4,
  fri: 5,
  friday: 5,
  sat: 6,
  saturday: 6,
};

function parseWeekday(day: unknown): number | null {
  if (typeof day === "number" && Number.isInteger(day) && day >= 0 && day <= 6) {
    return day;
  }
  const raw = String(day ?? "")
    .trim()
    .toLowerCase();
  if (raw in DAY_ALIASES) return DAY_ALIASES[raw];
  const numeric = Number(raw);
  if (Number.isInteger(numeric) && numeric >= 0 && numeric <= 6) return numeric;
  return null;
}

function coerceDays(raw: unknown): number[] {
  const list = Array.isArray(raw)
    ? raw
    : typeof raw === "string"
      ? raw.split(/[,\s]+/)
      : [];
  return [
    ...new Set(
      list
        .map((day) => parseWeekday(day))
        .filter((day): day is number => day != null),
    ),
  ];
}

export function normalizePolicyWindow(
  raw?: (LockWindowLite & Record<string, unknown>) | null,
): LockWindowLite | null {
  if (!raw || typeof raw !== "object") return null;
  const days = coerceDays(raw.days ?? raw.day ?? raw.weekdays);
  const start = raw.start ?? raw.from ?? raw.begin;
  const end = raw.end ?? raw.to ?? raw.finish;
  if (!days.length || typeof start !== "string" || typeof end !== "string") {
    return null;
  }
  if (parseClock(start) == null || parseClock(end) == null) return null;
  return {
    days,
    start,
    end,
    enabled: raw.enabled !== false && raw.on !== false,
  };
}

function policyWindowKey(window: LockWindowLite) {
  const start = parseClock(window.start);
  const end = parseClock(window.end);
  const days = [...window.days].filter((day) => day >= 0 && day <= 6).sort((a, b) => a - b);
  return `${days.join(",")}|${start}|${end}`;
}

export function normalizePolicySchedule(raw?: unknown): LockWindowLite[] {
  if (!Array.isArray(raw)) return [];
  const out: LockWindowLite[] = [];
  const seen = new Set<string>();
  for (const row of raw) {
    const window = normalizePolicyWindow(row as LockWindowLite);
    if (!window) continue;
    const key = policyWindowKey(window);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(window);
  }
  return out;
}

export function windowContains(window: LockWindowLite, now: Date) {
  const normalized = normalizePolicyWindow(window);
  if (!normalized || normalized.enabled === false) return false;
  const start = parseClock(normalized.start);
  const end = parseClock(normalized.end);
  if (start == null || end == null || start === end) return false;
  const mins = now.getHours() * 60 + now.getMinutes();
  const today = now.getDay();
  const yesterday = (today + 6) % 7;
  if (end > start) {
    return normalized.days.includes(today) && mins >= start && mins < end;
  }
  if (mins >= start) return normalized.days.includes(today);
  return mins < end && normalized.days.includes(yesterday);
}

export function inLockHours(schedule: LockWindowLite[], now = new Date()) {
  return schedule.some((window) => windowContains(window, now));
}

export function defaultAllowHosts() {
  return DEFAULT_ALLOWLIST.flatMap((entry) => entry.hosts);
}

export function isAllowlisted(host: string, extra: readonly string[] = []) {
  const patterns = [...defaultAllowHosts(), ...extra.map(normalizeHost)];
  return patterns.some((pattern) => hostMatches(host, pattern));
}

export function findBlockApp(host: string) {
  return BLOCK_APPS.find((app) =>
    app.hosts.some((pattern) => hostMatches(host, pattern)),
  );
}

export function isAppCovered(
  appId: string,
  unlockedUntil: Partial<Record<string, number>>,
  nemeses: readonly string[],
  now = Date.now(),
) {
  const live = (id: string) => (unlockedUntil[id] ?? 0) > now;
  if (isNemesisId(appId) && nemeses.includes(appId)) {
    return live("nemesis") || live(appId);
  }
  if (isNemesisOnlyId(appId)) return true;
  if (!isUnlockCatalogId(appId)) return false;
  const app = BLOCK_APPS.find((row) => row.id === appId);
  if (!app) return live(appId);
  if (app.tier === "tier2") return live(appId) || live("tier2");
  return live(appId) || live("tier3");
}

export type PolicyDecision =
  | { action: "allow"; reason: "outside-hours" | "allowlist" | "unknown" | "unlocked"; appId?: string; name?: string }
  | { action: "block"; reason: "lock"; appId: string; name: string; tier: PolicyTier };

export function decideUrl(
  url: string,
  policy: Pick<
    ExtensionPolicy,
    "schedule" | "nemeses" | "allowlistExtra" | "unlockedUntil" | "sessionActive"
  > & { extensionEnabled?: boolean },
  now = Date.now(),
): PolicyDecision {
  if (url.startsWith("chrome") || url.startsWith("about:") || url.startsWith("moz-extension")) {
    return { action: "allow", reason: "unknown" };
  }
  const host = hostnameFromUrl(url);
  if (!host) return { action: "allow", reason: "unknown" };
  if (isAllowlisted(host, policy.allowlistExtra)) {
    return { action: "allow", reason: "allowlist" };
  }
  const forced =
    inLockHours(policy.schedule, new Date(now)) || Boolean(policy.sessionActive);
  const preferred = policy.extensionEnabled !== false;
  if (!forced && !preferred) {
    return { action: "allow", reason: "outside-hours" };
  }
  const app = findBlockApp(host);
  if (!app) return { action: "allow", reason: "unknown" };
  if (isAppCovered(app.id, policy.unlockedUntil, policy.nemeses, now)) {
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

export function unlockedUntilFromUnlocks(
  unlocks: { catalogId: string; expiresAt: number }[],
  now = Date.now(),
) {
  const next: Partial<Record<UnlockSpendId, number>> = {};
  for (const unlock of unlocks) {
    if (unlock.expiresAt <= now) continue;
    if (
      !isUnlockCatalogId(unlock.catalogId) &&
      !isUnlockTierSpendId(unlock.catalogId) &&
      unlock.catalogId !== "nemesis"
    ) {
      continue;
    }
    const id = unlock.catalogId as UnlockSpendId;
    next[id] = Math.max(next[id] ?? 0, unlock.expiresAt);
  }
  return next;
}

export function emptyPolicy(appOrigin: string): ExtensionPolicy {
  return {
    version: 1,
    updatedAt: Date.now(),
    schedule: [],
    nemeses: [],
    allowlistExtra: [],
    unlockedUntil: {},
    appOrigin,
  };
}
