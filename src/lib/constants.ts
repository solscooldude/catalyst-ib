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
    id: "tok-essay",
    title: "TOK essay — knowledge & technology",
    subject: "Theory of Knowledge",
    due: "Mon",
    detail: "Finish object 2 analysis and the conclusion.",
  },
  {
    id: "math-aa",
    title: "Math AA problem set 8",
    subject: "Mathematics AA HL",
    due: "Tomorrow",
    detail: "Integration by parts, questions 4–9.",
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
] as const;

export type TaskId = (typeof MOCK_TASKS)[number]["id"];

export const SUBJECTS = [
  { id: "biology", label: "Biology HL" },
  { id: "tok", label: "Theory of Knowledge" },
  { id: "math-aa", label: "Mathematics AA HL" },
  { id: "chemistry", label: "Chemistry SL" },
  { id: "ee", label: "Extended Essay" },
  { id: "english", label: "English A" },
  { id: "history", label: "History" },
  { id: "other", label: "Other" },
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
    name: "Nemesis app",
    intensity: "High",
    cost: 8,
    minutes: 10,
    blurb: "The app you chose in setup. Highest token cost.",
  },
] as const;

export type UnlockCatalogId = (typeof UNLOCK_CATALOG)[number]["id"];

export const REAL_TOKEN_MS = 5 * 60 * 1000;
export const DEMO_TOKEN_MS = 30 * 1000;
export const REAL_UNLOCK_MS = 10 * 60 * 1000;
export const DEMO_UNLOCK_MS = 60 * 1000;

export const PRICING = {
  trial: "1 month free",
  then: "$9.99 / month",
};
