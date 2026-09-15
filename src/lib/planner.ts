export type PlannerTodo = {
  id: string;
  title: string;
  done: boolean;
  createdAt: number;
};

export type PlannerEventKind = "class" | "test" | "deadline";

export type PlannerEvent = {
  id: string;
  title: string;
  day: number;
  time: string;
  kind: PlannerEventKind;
  date: string | null;
};

const TIME = /^([01]?\d|2[0-3]):([0-5]\d)$/;

export const PLANNER_KINDS: { id: PlannerEventKind; label: string }[] = [
  { id: "class", label: "Class" },
  { id: "test", label: "Test" },
  { id: "deadline", label: "Deadline" },
];

export function normalizePlannerTodos(raw?: unknown): PlannerTodo[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((row) => {
      if (!row || typeof row !== "object") return null;
      const item = row as Partial<PlannerTodo>;
      const title = typeof item.title === "string" ? item.title.trim() : "";
      if (!title || title.length > 80) return null;
      return {
        id: typeof item.id === "string" ? item.id : crypto.randomUUID(),
        title,
        done: Boolean(item.done),
        createdAt:
          typeof item.createdAt === "number" ? item.createdAt : Date.now(),
      };
    })
    .filter((row): row is PlannerTodo => row !== null)
    .slice(0, 40);
}

export function normalizePlannerEvents(raw?: unknown): PlannerEvent[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((row) => {
      if (!row || typeof row !== "object") return null;
      const item = row as Partial<PlannerEvent>;
      const title = typeof item.title === "string" ? item.title.trim() : "";
      const time = typeof item.time === "string" ? item.time : "";
      const day = typeof item.day === "number" ? item.day : -1;
      if (!title || title.length > 80 || !TIME.test(time)) return null;
      if (day < 0 || day > 6) return null;
      const kind: PlannerEventKind =
        item.kind === "test" || item.kind === "deadline" ? item.kind : "class";
      const date =
        typeof item.date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(item.date)
          ? item.date
          : null;
      return {
        id: typeof item.id === "string" ? item.id : crypto.randomUUID(),
        title,
        day,
        time,
        kind,
        date,
      };
    })
    .filter((row): row is PlannerEvent => row !== null)
    .slice(0, 60);
}

export function plannerKindLabel(kind: PlannerEventKind) {
  if (kind === "test") return "Test";
  if (kind === "deadline") return "Deadline";
  return "Class";
}
