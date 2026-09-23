export const STORAGE_KEY = "catalyst-v1";
export const ACCOUNTS_KEY = "catalyst-v1-accounts";
export const AUTH_SESSION_KEY = "catalyst-v1-session";

export const ESSENTIAL_APPS = [
  { id: "chrome", name: "Chrome", glyph: "CH", blurb: "Browser for research." },
  { id: "drive", name: "Google Drive", glyph: "GD", blurb: "IA folders and shared docs." },
  { id: "docs", name: "Docs", glyph: "DC", blurb: "Google Docs and class files." },
  { id: "gmail", name: "Gmail", glyph: "GM", blurb: "Teachers, CAS, university mail." },
  { id: "managebac", name: "School portal", glyph: "MB", blurb: "Homework sites stay available." },
  { id: "calculator", name: "Calculator", glyph: "CA", blurb: "Math AA and science papers." },
  { id: "phone", name: "Phone / SOS / Clock", glyph: "SOS", blurb: "Calls, emergency, and time." },
  { id: "spotify", name: "Spotify", glyph: "SP", blurb: "Study music stays available." },
  { id: "ai", name: "ChatGPT / Gemini", glyph: "AI", blurb: "Assistants for the laptop block." },
  { id: "maps", name: "Maps", glyph: "MAP", blurb: "Getting home after late study." },
] as const;

export type EssentialAppId = (typeof ESSENTIAL_APPS)[number]["id"];

export const TIER2_COST = 10;
export const TIER3_COST = 15;
export const NEMESIS_SURCHARGE = 1;
export const NEMESIS_UNLOCK_COST = TIER3_COST + NEMESIS_SURCHARGE;

export const TIER2_APPS = [
  { id: "photos", name: "Photos", glyph: "PH", blurb: "Camera roll, not a spiral." },
  { id: "food", name: "Food delivery", glyph: "FD", blurb: "Uber Eats, Deliveroo, and the rest." },
  { id: "flightradar", name: "Flightradar24", glyph: "FR", blurb: "Planes as a study break." },
  { id: "messages", name: "Messages", glyph: "SMS", blurb: "iMessage and texts." },
  { id: "camera", name: "Camera", glyph: "CAM", blurb: "A photo, then back to the IA." },
] as const;

export type Tier2Id = (typeof TIER2_APPS)[number]["id"];

export const TIER3_APPS = [
  { id: "instagram", name: "Instagram", glyph: "IG", blurb: "Stories, then Reels, then your IA." },
  { id: "tiktok", name: "TikTok", glyph: "TT", blurb: "The For You page that ate TOK." },
  { id: "snapchat", name: "Snapchat", glyph: "SC", blurb: "Streaks vs. the EE deadline." },
  { id: "reddit", name: "Reddit", glyph: "RD", blurb: "A ‘quick check’ with no bottom." },
  { id: "x", name: "X", glyph: "X", blurb: "One quote-tweet becomes an hour." },
  { id: "discord", name: "Discord", glyph: "DS", blurb: "Servers that eat the TOK hour." },
] as const;

export type Tier3Id = (typeof TIER3_APPS)[number]["id"];

export const NEMESIS_ONLY_APPS = [
  { id: "youtube", name: "YouTube", glyph: "YT", blurb: "One video becomes the whole block." },
  { id: "whatsapp", name: "WhatsApp", glyph: "WA", blurb: "Group chats that wait ten minutes." },
] as const;

export const NEMESIS_APPS = [...NEMESIS_ONLY_APPS, ...TIER3_APPS] as const;

export type NemesisId = (typeof NEMESIS_APPS)[number]["id"];
export type NemesisOnlyId = (typeof NEMESIS_ONLY_APPS)[number]["id"];

export const MOCK_TASKS = [
  {
    id: "bio-ia",
    title: "Biology IA first draft",
    subject: "Biology HL",
    due: "Fri",
    detail: "Write the exploration and methodology. 1,200 words left.",
  },
  {
    id: "chem-study",
    title: "Chemistry SL — energetics review",
    subject: "Chemistry SL",
    due: "Wed",
    detail: "Hess’s law worksheet and past-paper timing.",
  },
  {
    id: "ee-chapter",
    title: "EE chapter 2 — literature review",
    subject: "Extended Essay",
    due: "Next week",
    detail: "Annotate four sources and write 800 words.",
  },
  {
    id: "math-aa",
    title: "Math AA problem set 8",
    subject: "Mathematics AA HL",
    due: "Tomorrow",
    detail: "Integration by parts, questions 4–9.",
  },
  {
    id: "tok-essay",
    title: "TOK essay — knowledge & technology",
    subject: "Theory of Knowledge",
    due: "Mon",
    detail: "Finish object 2 analysis and the conclusion.",
  },
] as const;

export type TaskId = string;

export const SUBJECTS = [
  { id: "biology", label: "Biology HL" },
  { id: "cas", label: "CAS" },
  { id: "chemistry", label: "Chemistry SL" },
  { id: "cs", label: "Computer Science" },
  { id: "digital-societies", label: "Digital Societies" },
  { id: "economics", label: "Economics" },
  { id: "english", label: "English A" },
  { id: "ee", label: "Extended Essay" },
  { id: "geography", label: "Geography" },
  { id: "history", label: "History" },
  { id: "language-b", label: "Language B" },
  { id: "math-aa", label: "Mathematics AA HL" },
  { id: "music", label: "Music" },
  { id: "other", label: "Other" },
  { id: "physics", label: "Physics HL" },
  { id: "psychology", label: "Psychology" },
  { id: "tok", label: "Theory of Knowledge" },
  { id: "visual-arts", label: "Visual Arts" },
] as const;

export type SubjectId = (typeof SUBJECTS)[number]["id"];

export const TASK_SUBJECT: Record<TaskId, SubjectId> = {
  "bio-ia": "biology",
  "tok-essay": "tok",
  "math-aa": "math-aa",
  "chem-study": "chemistry",
  "ee-chapter": "ee",
};

export const COMPLETION_BONUS = 5;

export const UNLOCK_CATALOG = [
  ...TIER2_APPS.map((app) => ({
    ...app,
    tier: 2 as const,
    intensity: "Tier 2 · medium",
    cost: TIER2_COST,
    minutes: 10,
  })),
  ...TIER3_APPS.map((app) => ({
    ...app,
    tier: 3 as const,
    intensity: "Tier 3 · social",
    cost: TIER3_COST,
    minutes: 10,
  })),
  ...NEMESIS_ONLY_APPS.map((app) => ({
    ...app,
    tier: 3 as const,
    intensity: "Nemesis · +1",
    cost: NEMESIS_UNLOCK_COST,
    minutes: 10,
  })),
] as const;

export type UnlockCatalogId = (typeof UNLOCK_CATALOG)[number]["id"];
export type UnlockTier = 2 | 3;
export type UnlockTierSpendId = "tier2" | "tier3";
export type UnlockSpendId = UnlockCatalogId | UnlockTierSpendId | "nemesis";

export function unlockTierSpendId(tier: UnlockTier): UnlockTierSpendId {
  return tier === 2 ? "tier2" : "tier3";
}

export function isUnlockTierSpendId(id: string): id is UnlockTierSpendId {
  return id === "tier2" || id === "tier3";
}

export function isNemesisSpendId(id: string): id is "nemesis" {
  return id === "nemesis";
}

export function isUnlockSpendId(id: string): id is UnlockSpendId {
  return isNemesisSpendId(id) || isUnlockTierSpendId(id) || isUnlockCatalogId(id);
}

export const UNLOCK_TIER_ROWS = [
  {
    id: "essentials",
    name: "School / essentials",
    intensity: "Always allowed",
    cost: 0,
    blurb: "Chrome, Drive, Docs, Gmail, school portal, Calculator, Phone/SOS/Clock, Spotify, ChatGPT/Gemini, Maps. Cost 0 — not sold in the shop.",
  },
  {
    id: "tier2",
    name: "Tier 2",
    intensity: "Medium",
    cost: TIER2_COST,
    blurb: "10 tokens per 10 minutes for the whole tier. Photos, food delivery, Flightradar24, Messages, Camera.",
  },
  {
    id: "tier3",
    name: "Tier 3 — social",
    intensity: "High",
    cost: TIER3_COST,
    blurb: "15 tokens per 10 minutes for every social app: Instagram, TikTok, Snapchat, Reddit, X, Discord. Nemesis picks stay locked until you pay the +1.",
  },
  {
    id: "nemesis",
    name: "Open nemesis",
    intensity: "High · +1",
    cost: NEMESIS_UNLOCK_COST,
    blurb: "16 tokens per 10 minutes (+1 on top of Tier 3). Opens the worst apps you picked in Setup — YouTube, WhatsApp, or a social you marked as a nemesis.",
  },
] as const;

/**
 * Token award rates. New accounts use the live rate (1 token / 2 minutes).
 * `demoMode` is a labeled testing toggle only: 10 tokens per 20 seconds.
 */
export const DEMO_TOKEN_BLOCK_MS = 20 * 1000;
export const DEMO_TOKENS_PER_BLOCK = 10;
export const REAL_TOKEN_MS = 2 * 60 * 1000;
/** Alias for the demo award block. Not a mid-session tick. */
export const DEMO_TOKEN_MS = DEMO_TOKEN_BLOCK_MS;
/** Lock / scene time compression only — not the award loop. */
export const DEMO_TIME_COMPRESS_MS = 30 * 1000;
export const REAL_TIME_COMPRESS_MS = 5 * 60 * 1000;
export const REAL_UNLOCK_MS = 10 * 60 * 1000;
export const DEMO_UNLOCK_MS = 60 * 1000;

export function isEssentialAppId(id: string): id is EssentialAppId {
  return ESSENTIAL_APPS.some((app) => app.id === id);
}

export function isUnlockCatalogId(id: string): id is UnlockCatalogId {
  return UNLOCK_CATALOG.some((item) => item.id === id);
}

export function isNemesisId(id: string): id is NemesisId {
  return NEMESIS_APPS.some((app) => app.id === id);
}

export function isTier3Id(id: string): id is Tier3Id {
  return TIER3_APPS.some((app) => app.id === id);
}

export function isNemesisOnlyId(id: string): id is NemesisOnlyId {
  return NEMESIS_ONLY_APPS.some((app) => app.id === id);
}

export function getUnlockItem(id: string) {
  return UNLOCK_CATALOG.find((item) => item.id === id);
}

export function unlocksByTier(tier: UnlockTier) {
  return UNLOCK_CATALOG.filter((item) => item.tier === tier);
}

export function formatNemesisList(ids: readonly NemesisId[]): string {
  const names = NEMESIS_APPS.filter((app) => ids.includes(app.id)).map(
    (app) => app.name,
  );
  if (names.length === 0) return "your nemesis apps";
  if (names.length === 1) return names[0];
  if (names.length === 2) return `${names[0]} and ${names[1]}`;
  return `${names.slice(0, -1).join(", ")}, and ${names[names.length - 1]}`;
}
