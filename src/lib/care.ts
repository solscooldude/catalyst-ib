import type { SubjectId } from "@/lib/constants";

export function dayKey(now = new Date()) {
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

export function yesterdayKey(now = new Date()) {
  const next = new Date(now);
  next.setDate(next.getDate() - 1);
  return dayKey(next);
}

export const FEED_COST = 1;
export const FEED_DAILY_LIMIT = 3;
export const LOGIN_TOKEN = 1;
export const STREAK_REWARD_DAY = 7;
export const QUIZ_TOKEN = 1;

export type QuizItem = {
  id: string;
  subjectId: SubjectId;
  prompt: string;
  choices: [string, string, string];
  answer: 0 | 1 | 2;
};

export const QUIZ_BANK: QuizItem[] = [
  {
    id: "bio-1",
    subjectId: "biology",
    prompt: "Which organelle runs aerobic respiration?",
    choices: ["Chloroplast", "Mitochondrion", "Ribosome"],
    answer: 1,
  },
  {
    id: "chem-1",
    subjectId: "chemistry",
    prompt: "pH 3 is…",
    choices: ["Acidic", "Neutral", "Basic"],
    answer: 0,
  },
  {
    id: "math-1",
    subjectId: "math-aa",
    prompt: "The derivative of x² is…",
    choices: ["x", "2x", "2"],
    answer: 1,
  },
  {
    id: "tok-1",
    subjectId: "tok",
    prompt: "In TOK, a knowledge claim is…",
    choices: ["A feeling", "A statement about knowledge", "A citation"],
    answer: 1,
  },
  {
    id: "ee-1",
    subjectId: "ee",
    prompt: "An EE literature review should…",
    choices: ["List sources only", "Argue with sources", "Skip citations"],
    answer: 1,
  },
  {
    id: "eng-1",
    subjectId: "english",
    prompt: "A thesis in a paper 1 is…",
    choices: ["A plot summary", "The guiding claim", "A quote dump"],
    answer: 1,
  },
  {
    id: "hist-1",
    subjectId: "history",
    prompt: "A useful history essay always…",
    choices: ["Names one date", "Uses evidence to argue", "Avoids historians"],
    answer: 1,
  },
  {
    id: "phys-1",
    subjectId: "physics",
    prompt: "Acceleration is the rate of change of…",
    choices: ["Mass", "Velocity", "Distance"],
    answer: 1,
  },
  {
    id: "cs-1",
    subjectId: "cs",
    prompt: "A loop that never ends is…",
    choices: ["A compiler", "An infinite loop", "A stack"],
    answer: 1,
  },
  {
    id: "psych-1",
    subjectId: "psychology",
    prompt: "An independent variable is…",
    choices: ["What you measure", "What you change", "The sample size"],
    answer: 1,
  },
];

export function pickQuiz(subjectIds: string[], count = 3): QuizItem[] {
  const preferred = QUIZ_BANK.filter((row) => subjectIds.includes(row.subjectId));
  const pool = preferred.length >= count ? preferred : QUIZ_BANK;
  return [...pool].sort(() => Math.random() - 0.5).slice(0, count);
}
