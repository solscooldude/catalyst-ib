import { SUBJECTS } from "@/lib/constants";
import { getIbSubject, type IbLevel, type IbSubject } from "@/lib/ib";
import { QUIZ_BANK_A, type QuizItem } from "@/lib/quiz-questions-a";
import { QUIZ_BANK_B } from "@/lib/quiz-questions-b";

export type { QuizItem };
export const QUIZ_LENGTH = 10;
export const QUIZ_BANK: QuizItem[] = [...QUIZ_BANK_A, ...QUIZ_BANK_B];

export function quizCourseKey(subject: IbSubject): string {
  const id = subject.course;
  if (id.includes("-a-langlit") || id.includes("-a-lit") || id === "self-taught-a") {
    return "lang-a";
  }
  if (id.endsWith("-ab")) return "lang-ab";
  if (subject.group === 2 && id !== "latin") return "lang-b";
  return id;
}

const COURSE_ASSIGNMENTS: Record<
  string,
  { source: "ManageBac" | "Google Classroom"; title: string }
> = {
  tok: { source: "ManageBac", title: "TOK essay — knowledge & technology" },
  ee: { source: "ManageBac", title: "EE chapter 2 — literature review" },
  cas: { source: "ManageBac", title: "CAS reflection — evidence log" },
  biology: { source: "ManageBac", title: "Biology IA first draft" },
  chemistry: { source: "Google Classroom", title: "Chemistry SL — energetics review" },
  physics: { source: "Google Classroom", title: "Physics HL — past paper 2" },
  "math-aa": { source: "Google Classroom", title: "Math AA problem set 8" },
  "math-ai": { source: "Google Classroom", title: "Math AI — modelling homework" },
  history: { source: "ManageBac", title: "History IA — investigation question" },
  geography: { source: "ManageBac", title: "Geography IA — fieldwork write-up" },
  economics: { source: "Google Classroom", title: "Economics commentary 2" },
  business: { source: "Google Classroom", title: "Business IA — supporting docs" },
  psychology: { source: "ManageBac", title: "Psychology IA — method section" },
  "lang-a": { source: "ManageBac", title: "English A IO practice" },
  "lang-b": { source: "Google Classroom", title: "Language B written assignment" },
  "lang-ab": { source: "Google Classroom", title: "Ab initio — text-type draft" },
  latin: { source: "Google Classroom", title: "Latin unseen + morphology" },
  "visual-arts": { source: "ManageBac", title: "Visual Arts — comparative study" },
  music: { source: "ManageBac", title: "Music — experimenting with music" },
  theatre: { source: "ManageBac", title: "Theatre — research presentation" },
  sehs: { source: "Google Classroom", title: "SEHS — energy systems quiz" },
  cs: { source: "Google Classroom", title: "CS IA — criterion B plan" },
  "computer-science": { source: "Google Classroom", title: "CS IA — criterion B plan" },
  ess: { source: "ManageBac", title: "ESS IA — investigation design" },
  philosophy: { source: "ManageBac", title: "Philosophy — stimulus paper" },
  "global-politics": { source: "ManageBac", title: "Global politics — engagement activity" },
  "digital-societies": { source: "Google Classroom", title: "Digital societies — inquiry draft" },
  "design-tech": { source: "Google Classroom", title: "Design tech — design brief" },
  film: { source: "ManageBac", title: "Film — textual analysis" },
  dance: { source: "ManageBac", title: "Dance — composition task" },
};

export function quizAssignment(item: QuizItem) {
  return (
    COURSE_ASSIGNMENTS[item.course] ??
    COURSE_ASSIGNMENTS[item.subjectId] ?? {
      source: "ManageBac" as const,
      title: `${item.topic} class task`,
    }
  );
}

export function quizItemCaption(item: QuizItem, subjectIds: string[]) {
  const match = subjectIds
    .map((id) => getIbSubject(id))
    .find((row) => row && quizCourseKey(row) === item.course);
  const catalog = SUBJECTS.find((row) => row.id === item.subjectId);
  const name = match?.label ?? catalog?.label ?? item.topic;
  const level =
    match?.level ?? (item.levels.length === 1 ? item.levels[0] : null);
  const assignment = quizAssignment(item);
  return {
    name,
    topic: item.topic,
    level,
    source: assignment.source,
    assignment: assignment.title,
  };
}

function shuffle<T>(items: T[]): T[] {
  const next = [...items];
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

function matchesBucket(item: QuizItem, key: string, level: IbLevel | "core") {
  if (item.course !== key) return false;
  if (level === "core") return true;
  return item.levels.includes(level);
}

export function pickQuiz(subjectIds: string[], count = QUIZ_LENGTH): QuizItem[] {
  const selected = subjectIds
    .map((id) => getIbSubject(id))
    .filter((row): row is IbSubject => Boolean(row));

  const buckets: { key: string; level: IbLevel | "core" }[] = [
    ...selected.map((row) => ({
      key: quizCourseKey(row),
      level: row.level,
    })),
    { key: "tok", level: "core" },
    { key: "ee", level: "core" },
  ];

  const used = new Set<string>();
  const picked: QuizItem[] = [];

  function take(key: string, level: IbLevel | "core") {
    const pool = shuffle(QUIZ_BANK.filter((item) => matchesBucket(item, key, level)));
    const next = pool.find((item) => !used.has(item.id));
    if (!next) return null;
    used.add(next.id);
    return next;
  }

  let safety = 0;
  while (picked.length < count && safety < count * Math.max(2, buckets.length)) {
    let added = false;
    for (const bucket of buckets) {
      if (picked.length >= count) break;
      const item = take(bucket.key, bucket.level);
      if (item) {
        picked.push(item);
        added = true;
      }
    }
    safety += 1;
    if (!added) break;
  }

  if (picked.length < count) {
    for (const item of shuffle(QUIZ_BANK)) {
      if (picked.length >= count) break;
      if (used.has(item.id)) continue;
      const ok = buckets.some((bucket) => matchesBucket(item, bucket.key, bucket.level));
      if (!ok) continue;
      used.add(item.id);
      picked.push(item);
    }
  }

  if (picked.length < count) {
    for (const item of shuffle(QUIZ_BANK)) {
      if (picked.length >= count) break;
      if (used.has(item.id)) continue;
      used.add(item.id);
      picked.push(item);
    }
  }

  return picked.slice(0, count);
}
