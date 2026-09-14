import { SUBJECTS, type SubjectId } from "@/lib/constants";
import type { SessionLog } from "@/lib/store";

export function startOfWeek(now = new Date()) {
  const date = new Date(now);
  const day = date.getDay();
  const mondayOffset = day === 0 ? -6 : 1 - day;
  date.setDate(date.getDate() + mondayOffset);
  date.setHours(0, 0, 0, 0);
  return date;
}

export function startOfMonth(now = new Date()) {
  return new Date(now.getFullYear(), now.getMonth(), 1);
}

export function endOfMonth(now = new Date()) {
  return new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
}

export function logsInRange(logs: SessionLog[], start: Date, end: Date) {
  const from = start.getTime();
  const to = end.getTime();
  return logs.filter((log) => log.endedAt >= from && log.endedAt <= to);
}

export function formatDuration(ms: number) {
  const minutes = Math.max(0, Math.round(ms / 60000));
  if (minutes < 60) return `${minutes} min`;
  const hours = minutes / 60;
  return `${hours >= 10 ? hours.toFixed(0) : hours.toFixed(1)} h`;
}

export function formatHours(ms: number) {
  const hours = Math.max(0, ms / 3_600_000);
  if (hours === 0) return "0 h";
  if (hours < 1) return `${Math.round(hours * 60)} min`;
  return `${hours >= 10 ? hours.toFixed(0) : hours.toFixed(1)} h`;
}

export function subjectStacks(logs: SessionLog[]) {
  const totals = new Map<SubjectId, number>();
  for (const subject of SUBJECTS) totals.set(subject.id, 0);
  for (const log of logs) {
    totals.set(log.subjectId, (totals.get(log.subjectId) ?? 0) + log.durationMs);
  }
  return SUBJECTS.map((subject) => ({
    id: subject.id,
    label: subject.label,
    durationMs: totals.get(subject.id) ?? 0,
  }))
    .filter((row) => row.durationMs > 0)
    .sort((a, b) => b.durationMs - a.durationMs);
}

export function monthlyRoundup(logs: SessionLog[], now = new Date()) {
  const monthLogs = logsInRange(logs, startOfMonth(now), endOfMonth(now));
  const stacks = subjectStacks(monthLogs);
  const durationMs = monthLogs.reduce((sum, log) => sum + log.durationMs, 0);
  const tokensEarned = monthLogs.reduce(
    (sum, log) => sum + log.timeTokens + log.completionTokens,
    0,
  );
  const official = monthLogs.filter((log) => log.kind === "verified").length;
  return {
    durationMs,
    sessions: monthLogs.length,
    official,
    tokensEarned,
    topSubject: stacks[0] ?? null,
    monthLabel: now.toLocaleDateString([], { month: "long", year: "numeric" }),
  };
}

export function weekLabel(now = new Date()) {
  const start = startOfWeek(now);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  const startText = start.toLocaleDateString([], { day: "numeric", month: "short" });
  const endText = end.toLocaleDateString([], { day: "numeric", month: "short" });
  return `${startText} – ${endText}`;
}

export function getSubject(id: SubjectId) {
  return SUBJECTS.find((subject) => subject.id === id);
}
