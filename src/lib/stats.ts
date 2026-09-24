import { SUBJECTS, type SubjectId } from "@/lib/constants";
import type { SessionLog } from "@/lib/store-core";

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

export function verifiedStudyMs(logs: SessionLog[]) {
  return logs
    .filter((log) => log.kind === "verified")
    .reduce((sum, log) => sum + log.durationMs, 0);
}

export function studyMinutesFromLogs(logs: SessionLog[]) {
  return Math.round(
    logs.reduce((sum, log) => sum + Math.max(0, log.durationMs), 0) / 60000,
  );
}

export function formatStudyMinutes(minutes: number) {
  if (minutes < 60) return `${minutes} min`;
  const hours = minutes / 60;
  return `${hours >= 10 ? hours.toFixed(0) : hours.toFixed(1)} h`;
}

/** Local Monday 00:00 through Sunday 23:59:59.999. */
export function endOfWeek(now = new Date()) {
  const start = startOfWeek(now);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);
  return end;
}

export function weeklyStudyMinutes(logs: SessionLog[], now = new Date()) {
  return studyMinutesFromLogs(logsInRange(logs, startOfWeek(now), endOfWeek(now)));
}

export function formatWeeklyStudy(minutes: number) {
  return `This week · ${formatStudyMinutes(minutes)}`;
}

export {
  CARE_STAGE_GUIDE,
  CARE_STAGES,
  ETHEREAL_SCORE,
  LUMINARY_SCORE,
  mintGlowForStage,
  normalizeCareStage,
  sparkEvolutionLabel,
  stageFromScore,
  type CareStage,
} from "@/lib/care-stages";
import {
  ETHEREAL_SCORE,
  STAGE_LOOK,
  stageFromScore,
} from "@/lib/care-stages";

export type EvolutionExtras = {
  streakDays?: number;
  careActions?: number;
  hatched?: boolean;
};

export function careScore(input: {
  hours: number;
  streakDays: number;
  careActions: number;
}) {
  return input.hours + input.streakDays * 0.45 + input.careActions * 0.3;
}

export function sparkEvolution(logs: SessionLog[], extras: EvolutionExtras = {}) {
  const hours = verifiedStudyMs(logs) / 3_600_000;
  const streakDays = extras.streakDays ?? 0;
  const careActions = extras.careActions ?? 0;
  const hatched =
    extras.hatched ?? (logs.length > 0 || careActions > 0);
  const score = careScore({ hours, streakDays, careActions });
  const stage = stageFromScore(score, hatched);
  const look = STAGE_LOOK[stage];
  const t = Math.min(1, score / ETHEREAL_SCORE);
  return {
    hours,
    score,
    t,
    scale: look.scale,
    glow: look.glow,
    stage,
  };
}

export function sparkEvolutionFromState(state: {
  logs: SessionLog[];
  streakDays: number;
  careActions: number;
  spriteHatched: boolean;
}) {
  return sparkEvolution(state.logs, {
    streakDays: state.streakDays,
    careActions: state.careActions,
    hatched: state.spriteHatched,
  });
}

export function formatHours(ms: number) {
  const hours = Math.max(0, ms / 3_600_000);
  if (hours === 0) return "0 h";
  if (hours < 1) return `${Math.round(hours * 60)} min`;
  return `${hours >= 10 ? hours.toFixed(0) : hours.toFixed(1)} h`;
}

export function formatClock(ms: number) {
  const minutes = Math.max(0, Math.round(ms / 60000));
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (hours === 0) return `${rest}m`;
  return `${hours}h ${String(rest).padStart(2, "0")}m`;
}

export function todayStudyMs(logs: SessionLog[], now = new Date()) {
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  const from = start.getTime();
  return logs
    .filter((log) => log.endedAt >= from)
    .reduce((sum, log) => sum + log.durationMs, 0);
}

export function weekDayMarks(logs: SessionLog[], now = new Date()) {
  const start = startOfWeek(now);
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    const next = new Date(date);
    next.setDate(date.getDate() + 1);
    const from = date.getTime();
    const to = next.getTime();
    const studied = logs.some(
      (log) => log.endedAt >= from && log.endedAt < to,
    );
    return { key: dayKey(date), studied, isToday: dayKey(date) === dayKey(now) };
  });
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

export function endOfDay(now = new Date()) {
  const date = new Date(now);
  date.setHours(23, 59, 59, 999);
  return date;
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

export function weeklyRoundup(logs: SessionLog[], now = new Date()) {
  const weekLogs = logsInRange(logs, startOfWeek(now), endOfDay(now));
  const stacks = subjectStacks(weekLogs);
  const durationMs = weekLogs.reduce((sum, log) => sum + log.durationMs, 0);
  const tokensEarned = weekLogs.reduce(
    (sum, log) => sum + log.timeTokens + log.completionTokens,
    0,
  );
  return {
    durationMs,
    sessions: weekLogs.length,
    tokensEarned,
    topSubject: stacks[0] ?? null,
    weekLabel: weekLabel(now),
    empty: weekLogs.length === 0,
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

export type StudyDay = {
  key: string;
  date: Date;
  durationMs: number;
  sessions: number;
};

function dayKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function studyDayBuckets(logs: SessionLog[], weeks = 12, now = new Date()) {
  const end = new Date(now);
  end.setHours(23, 59, 59, 999);
  const start = startOfWeek(now);
  start.setDate(start.getDate() - (weeks - 1) * 7);

  const totals = new Map<string, { durationMs: number; sessions: number }>();
  for (const log of logs) {
    const date = new Date(log.endedAt);
    if (date < start || date > end) continue;
    const key = dayKey(date);
    const current = totals.get(key) ?? { durationMs: 0, sessions: 0 };
    totals.set(key, {
      durationMs: current.durationMs + log.durationMs,
      sessions: current.sessions + 1,
    });
  }

  const days: StudyDay[] = [];
  const cursor = new Date(start);
  const last = new Date(end);
  last.setHours(0, 0, 0, 0);
  while (cursor <= last) {
    const key = dayKey(cursor);
    const row = totals.get(key);
    days.push({
      key,
      date: new Date(cursor),
      durationMs: row?.durationMs ?? 0,
      sessions: row?.sessions ?? 0,
    });
    cursor.setDate(cursor.getDate() + 1);
  }
  return days;
}
