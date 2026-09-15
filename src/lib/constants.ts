export const STORAGE_KEY = "catalyst-v1";
export const ACCOUNTS_KEY = "catalyst-v1-accounts";
export const AUTH_SESSION_KEY = "catalyst-v1-session";

export const NEMESIS_APPS = [
  { id: "tiktok", name: "TikTok", blurb: "The For You page that ate TOK." },
  { id: "instagram", name: "Instagram", blurb: "Stories, then Reels, then your IA." },
  { id: "snapchat", name: "Snapchat", blurb: "Streaks vs. the EE deadline." },
  { id: "x", name: "X", blurb: "One quote-tweet becomes an hour." },
  { id: "reddit", name: "Reddit", blurb: "A ‘quick check’ with no bottom." },
] as const;

export type NemesisId = (typeof NEMESIS_APPS)[number]["id"];

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

export type TaskId = (typeof MOCK_TASKS)[number]["id"];

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
  {
    id: "notes",
    name: "Notes",
    intensity: "Low distraction",
    cost: 2,
    minutes: 10,
    blurb: "Notes or a document. Lowest token cost.",
  },
  {
    id: "youtube",
    name: "YouTube",
    intensity: "Medium",
    cost: 4,
    minutes: 10,
    blurb: "Videos. Medium token cost.",
  },
  {
    id: "nemesis",
    name: "Nemesis apps",
    intensity: "High",
    cost: 8,
    minutes: 10,
    blurb: "The apps you named in setup. Highest token cost.",
  },
] as const;

export type UnlockCatalogId = (typeof UNLOCK_CATALOG)[number]["id"];

/**
 * Token award rates. `demoMode` stays ON for the Vercel web demo.
 * Production target (flip demoMode off later): 1 token per 2 minutes.
 * Demo (current): 10 tokens per 20 seconds, tallied once on End.
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

export function isNemesisId(id: string): id is NemesisId {
  return NEMESIS_APPS.some((app) => app.id === id);
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
