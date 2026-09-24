import {
  MOCK_TASKS,
  SUBJECTS,
  TASK_SUBJECT,
  type SubjectId,
  type TaskId,
} from "@/lib/constants";
import { TASK_DESCRIPTION_MAX } from "@/lib/task-description";

export { TASK_DESCRIPTION_MAX } from "@/lib/task-description";

export type TaskSource = "managebac" | "classroom" | "demo" | "manual";

export type SchoolTask = {
  id: TaskId;
  title: string;
  subject: string;
  subjectId: SubjectId;
  due: string;
  detail: string;
  source: TaskSource;
  courseName?: string;
  done: boolean;
  submitted?: boolean;
};

const SOURCE: TaskSource[] = ["managebac", "classroom", "demo", "manual"];

export function sourceLabel(_source: TaskSource) {
  return "Task";
}

export function subjectLabel(subjectId: SubjectId) {
  return SUBJECTS.find((row) => row.id === subjectId)?.label ?? "Other";
}

export function groupSchoolTasksBySubject(
  tasks: SchoolTask[],
  diploma: Array<{ id: string; label: string; statId: SubjectId }>,
) {
  const assigned = new Set<string>();
  const sections: Array<{ key: string; label: string; tasks: SchoolTask[] }> =
    [];

  for (const option of diploma) {
    const exact = tasks.filter(
      (task) =>
        !assigned.has(task.id) &&
        task.subject.toLowerCase() === option.label.toLowerCase(),
    );
    exact.forEach((task) => assigned.add(task.id));
    const byStat = tasks.filter(
      (task) => !assigned.has(task.id) && task.subjectId === option.statId,
    );
    byStat.forEach((task) => assigned.add(task.id));
    sections.push({
      key: option.id,
      label: option.label,
      tasks: [...exact, ...byStat],
    });
  }

  const leftover = tasks.filter((task) => !assigned.has(task.id));
  const extra = new Map<string, SchoolTask[]>();
  for (const task of leftover) {
    const label = task.subject || subjectLabel(task.subjectId);
    const list = extra.get(label) ?? [];
    list.push(task);
    extra.set(label, list);
  }
  for (const [label, list] of extra) {
    sections.push({ key: `extra-${label}`, label, tasks: list });
  }

  if (diploma.length === 0 && sections.length === 0) {
    return [
      {
        key: "all",
        label: "School tasks",
        tasks,
      },
    ];
  }

  return sections;
}

export function inferSubjectId(label: string): SubjectId {
  const lower = label.toLowerCase();
  const hit = SUBJECTS.find(
    (row) =>
      lower.includes(row.label.toLowerCase()) ||
      lower.includes(row.id.replaceAll("-", " ")),
  );
  if (hit) return hit.id;
  if (/\bbio/.test(lower)) return "biology";
  if (/\bchem/.test(lower)) return "chemistry";
  if (/\bphys/.test(lower)) return "physics";
  if (/\btok|theory of knowledge/.test(lower)) return "tok";
  if (/\bee|extended essay/.test(lower)) return "ee";
  if (/\bmath|aa\b|ai\b/.test(lower)) return "math-aa";
  if (/\bhist/.test(lower)) return "history";
  if (/\becon/.test(lower)) return "economics";
  if (/\bpsych/.test(lower)) return "psychology";
  if (/\benglish|lang/.test(lower)) return "english";
  if (/\bcas\b/.test(lower)) return "cas";
  return "other";
}

export function mockTasksAsSchool(doneIds?: Iterable<string>): SchoolTask[] {
  const done = new Set(doneIds);
  return MOCK_TASKS.map((task) => ({
    id: task.id,
    title: task.title,
    subject: task.subject,
    subjectId: TASK_SUBJECT[task.id] ?? "other",
    due: task.due,
    detail: task.detail,
    source: "demo" as const,
    done: done.has(task.id),
  }));
}

export function normalizeSchoolTask(raw: unknown): SchoolTask | null {
  if (!raw || typeof raw !== "object") return null;
  const item = raw as Partial<SchoolTask>;
  const id = String(item.id ?? "").trim().slice(0, 64);
  const title = String(item.title ?? "").trim().slice(0, 120);
  if (!id || title.length < 3) return null;
  const subject = String(item.subject ?? "Other").trim().slice(0, 48) || "Other";
  const subjectId =
    SUBJECTS.some((row) => row.id === item.subjectId)
      ? (item.subjectId as SubjectId)
      : inferSubjectId(`${subject} ${title}`);
  const source = SOURCE.includes(item.source as TaskSource)
    ? (item.source as TaskSource)
    : "demo";
  return {
    id,
    title,
    subject,
    subjectId,
    due: String(item.due ?? "").trim().slice(0, 32),
    detail: String(item.detail ?? "").trim().slice(0, TASK_DESCRIPTION_MAX),
    source,
    courseName: item.courseName?.trim().slice(0, 80) || undefined,
    done: Boolean(item.done),
    submitted: Boolean(item.submitted),
  };
}

export function normalizeSchoolTasks(raw: unknown): SchoolTask[] {
  if (!Array.isArray(raw)) return [];
  const seen = new Set<string>();
  const next: SchoolTask[] = [];
  for (const row of raw) {
    const task = normalizeSchoolTask(row);
    if (!task || seen.has(task.id)) continue;
    seen.add(task.id);
    next.push(task);
  }
  return next.slice(0, 80);
}

export function mergeSchoolTasks(
  current: SchoolTask[],
  incoming: SchoolTask[],
) {
  const byId = new Map(current.map((row) => [row.id, row]));
  for (const task of incoming) {
    const prev = byId.get(task.id);
    byId.set(task.id, {
      ...task,
      done: prev?.done ?? task.done,
      submitted: prev?.submitted ?? task.submitted,
    });
  }
  return [...byId.values()].slice(0, 80);
}

export function openSchoolTasks(tasks: SchoolTask[]) {
  return tasks.filter((task) => !task.done);
}

export function taskSubjectId(
  taskId: string | undefined,
  tasks: SchoolTask[],
): SubjectId {
  if (!taskId) return "other";
  return (
    tasks.find((row) => row.id === taskId)?.subjectId ??
    TASK_SUBJECT[taskId] ??
    "other"
  );
}
