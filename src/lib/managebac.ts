import { inferSubjectId, type SchoolTask } from "@/lib/school-tasks";

export const SAMPLE_MANAGEBAC_TASKS: SchoolTask[] = [
  {
    id: "mb-bio-ia",
    title: "Biology IA first draft",
    subject: "Biology HL",
    subjectId: "biology",
    due: "Fri",
    detail: "Exploration and methodology. Pulled as a ManageBac-shaped task.",
    source: "managebac",
    courseName: "Biology HL",
    done: false,
  },
  {
    id: "mb-tok-essay",
    title: "TOK essay — knowledge & technology",
    subject: "Theory of Knowledge",
    subjectId: "tok",
    due: "Mon",
    detail: "Object 2 analysis and conclusion.",
    source: "managebac",
    courseName: "TOK",
    done: false,
  },
  {
    id: "mb-ee-ch2",
    title: "EE chapter 2 — literature review",
    subject: "Extended Essay",
    subjectId: "ee",
    due: "Next week",
    detail: "Annotate four sources and write 800 words.",
    source: "managebac",
    courseName: "Extended Essay",
    done: false,
  },
];

export function parseManageBacImport(raw: string): SchoolTask[] {
  const text = raw.trim();
  if (!text) return [];
  if (text.includes("BEGIN:VEVENT")) return parseIcs(text);
  const next: SchoolTask[] = [];
  const seen = new Set<string>();
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const parts = trimmed.split("|").map((part) => part.trim());
    const title = parts[0] ?? "";
    if (title.length < 3) continue;
    const subject = parts[1] || "Other";
    const due = parts[2] || "Soon";
    const detail = parts[3] || "Imported from a pasted ManageBac list.";
    const id = `mb-${slug(title)}`;
    if (seen.has(id)) continue;
    seen.add(id);
    next.push({
      id,
      title: title.slice(0, 120),
      subject: subject.slice(0, 48),
      subjectId: inferSubjectId(`${subject} ${title}`),
      due: due.slice(0, 32),
      detail: detail.slice(0, 200),
      source: "managebac",
      courseName: subject.slice(0, 80),
      done: false,
    });
  }
  return next.slice(0, 40);
}

function parseIcs(raw: string): SchoolTask[] {
  const blocks = raw.split("BEGIN:VEVENT").slice(1);
  const next: SchoolTask[] = [];
  for (const block of blocks) {
    const summary = icsField(block, "SUMMARY");
    if (!summary) continue;
    const description = icsField(block, "DESCRIPTION");
    const stamp = icsField(block, "DTSTART");
    next.push({
      id: `mb-${slug(summary)}`,
      title: summary.slice(0, 120),
      subject: inferLabel(summary),
      subjectId: inferSubjectId(summary),
      due: formatIcsDate(stamp) || "Soon",
      detail: (description || "Imported from an ICS calendar.").slice(0, 200),
      source: "managebac",
      done: false,
    });
  }
  return next.slice(0, 40);
}

function icsField(block: string, key: string) {
  const match = block.match(new RegExp(`^${key}[^:]*:(.+)$`, "m"));
  return match?.[1]?.replace(/\\n/g, " ").replace(/\\,/g, ",").trim() ?? "";
}

function formatIcsDate(raw: string) {
  const digits = raw.replace(/\D/g, "");
  if (digits.length < 8) return "";
  return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6, 8)}`;
}

function inferLabel(title: string) {
  const id = inferSubjectId(title);
  if (id === "other") return "ManageBac";
  return id;
}

function slug(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40) || "task";
}
