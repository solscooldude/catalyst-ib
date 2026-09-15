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

export function quizItemCaption(item: QuizItem, subjectIds: string[]) {
  const match = subjectIds
    .map((id) => getIbSubject(id))
    .find((row) => row && quizCourseKey(row) === item.course);
  const catalog = SUBJECTS.find((row) => row.id === item.subjectId);
  const name = match?.label ?? catalog?.label ?? item.topic;
  const level =
    match?.level ?? (item.levels.length === 1 ? item.levels[0] : null);
  return {
    name,
    topic: item.topic,
    level,
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
