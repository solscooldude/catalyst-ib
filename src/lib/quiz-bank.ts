import { SUBJECTS } from "@/lib/constants";
import { getIbSubject, type IbLevel, type IbSubject } from "@/lib/ib";
import { sourceLabel, type SchoolTask } from "@/lib/school-tasks";
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
  { source: string; title: string }
> = {
  tok: { source: "Homework", title: "TOK essay — knowledge & technology" },
  ee: { source: "Homework", title: "EE chapter 2 — literature review" },
  cas: { source: "Homework", title: "CAS reflection — evidence log" },
  biology: { source: "Homework", title: "Biology IA first draft" },
  chemistry: { source: "Homework", title: "Chemistry SL — energetics review" },
  physics: { source: "Homework", title: "Physics HL — past paper 2" },
  "math-aa": { source: "Homework", title: "Math AA problem set 8" },
  "math-ai": { source: "Homework", title: "Math AI — modelling homework" },
  history: { source: "Homework", title: "History IA — investigation question" },
  geography: { source: "Homework", title: "Geography IA — fieldwork write-up" },
  economics: { source: "Homework", title: "Economics commentary 2" },
  business: { source: "Homework", title: "Business IA — supporting docs" },
  psychology: { source: "Homework", title: "Psychology IA — method section" },
  "lang-a": { source: "Homework", title: "English A IO practice" },
  "lang-b": { source: "Homework", title: "Language B written assignment" },
  "lang-ab": { source: "Homework", title: "Ab initio — text-type draft" },
  latin: { source: "Homework", title: "Latin unseen + morphology" },
  "visual-arts": { source: "Homework", title: "Visual Arts — comparative study" },
  music: { source: "Homework", title: "Music — experimenting with music" },
  theatre: { source: "Homework", title: "Theatre — research presentation" },
  sehs: { source: "Homework", title: "SEHS — energy systems quiz" },
  cs: { source: "Homework", title: "CS IA — criterion B plan" },
  "computer-science": { source: "Homework", title: "CS IA — criterion B plan" },
  ess: { source: "Homework", title: "ESS IA — investigation design" },
  philosophy: { source: "Homework", title: "Philosophy — stimulus paper" },
  "global-politics": { source: "Homework", title: "Global politics — engagement activity" },
  "digital-societies": { source: "Homework", title: "Digital societies — inquiry draft" },
  "design-tech": { source: "Homework", title: "Design tech — design brief" },
  film: { source: "Homework", title: "Film — textual analysis" },
  dance: { source: "Homework", title: "Dance — composition task" },
};

export function quizAssignment(item: QuizItem) {
  return (
    COURSE_ASSIGNMENTS[item.course] ??
    COURSE_ASSIGNMENTS[item.subjectId] ?? {
      source: "Homework",
      title: `${item.topic} class task`,
    }
  );
}

export function quizItemCaption(
  item: QuizItem,
  subjectIds: string[],
  schoolTasks: SchoolTask[] = [],
) {
  const match = subjectIds
    .map((id) => getIbSubject(id))
    .find((row) => row && quizCourseKey(row) === item.course);
  const catalog = SUBJECTS.find((row) => row.id === item.subjectId);
  const name = match?.label ?? catalog?.label ?? item.topic;
  const level =
    match?.level ?? (item.levels.length === 1 ? item.levels[0] : null);
  const live = schoolTasks.find(
    (task) =>
      !task.done &&
      (task.subjectId === item.subjectId ||
        task.subject.toLowerCase().includes(item.topic.toLowerCase()) ||
        task.title.toLowerCase().includes(item.topic.toLowerCase().split(" ")[0] ?? "")),
  );
  const assignment = quizAssignment(item);
  return {
    name,
    topic: item.topic,
    level,
    source: live ? sourceLabel(live.source) : assignment.source,
    assignment: live ? live.title : assignment.title,
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

export function pickQuiz(
  subjectIds: string[],
  count = QUIZ_LENGTH,
  extraSubjectIds: string[] = [],
): QuizItem[] {
  const selected = [...new Set([...subjectIds, ...extraSubjectIds])]
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
