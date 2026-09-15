export const WEEKDAYS = [
  { day: 1, short: "Mon", label: "Monday" },
  { day: 2, short: "Tue", label: "Tuesday" },
  { day: 3, short: "Wed", label: "Wednesday" },
  { day: 4, short: "Thu", label: "Thursday" },
  { day: 5, short: "Fri", label: "Friday" },
  { day: 6, short: "Sat", label: "Saturday" },
  { day: 0, short: "Sun", label: "Sunday" },
] as const;

export type Weekday = (typeof WEEKDAYS)[number]["day"];

export type LockWindow = {
  id: string;
  days: number[];
  start: string;
  end: string;
  enabled: boolean;
};

const TIME = /^([01]?\d|2[0-3]):([0-5]\d)(?::[0-5]\d)?$/;
const DAY_ORDER = [1, 2, 3, 4, 5, 6, 0] as const;

export const WEEKNIGHT_PRESET: Omit<LockWindow, "id"> = {
  days: [1, 2, 3, 4, 5],
  start: "19:00",
  end: "22:00",
  enabled: true,
};

export function parseMinutes(hhmm: string) {
  const match = TIME.exec(hhmm.trim());
  if (!match) return null;
  return Number(match[1]) * 60 + Number(match[2]);
}

export function normalizeTime(hhmm: string) {
  const mins = parseMinutes(hhmm);
  if (mins == null) return null;
  return `${String(Math.floor(mins / 60)).padStart(2, "0")}:${String(mins % 60).padStart(2, "0")}`;
}

export function formatClock(hhmm: string) {
  const mins = parseMinutes(hhmm);
  if (mins == null) return hhmm;
  const hours = Math.floor(mins / 60);
  const minutes = mins % 60;
  const suffix = hours >= 12 ? "pm" : "am";
  const hour12 = hours % 12 || 12;
  return minutes === 0
    ? `${hour12}${suffix}`
    : `${hour12}:${String(minutes).padStart(2, "0")}${suffix}`;
}

export function formatDays(days: number[]) {
  const set = new Set(days);
  if (days.length === 7 && DAY_ORDER.every((day) => set.has(day))) {
    return "Every day";
  }
  if (days.length === 5 && [1, 2, 3, 4, 5].every((day) => set.has(day))) {
    return "Weeknights";
  }
  if (days.length === 2 && set.has(0) && set.has(6)) {
    return "Weekends";
  }
  return DAY_ORDER.filter((day) => set.has(day))
    .map((day) => WEEKDAYS.find((row) => row.day === day)?.short ?? "")
    .filter(Boolean)
    .join(" · ");
}

export function formatWindow(window: LockWindow) {
  const overnight = (parseMinutes(window.end) ?? 0) <= (parseMinutes(window.start) ?? 0);
  return `${formatDays(window.days)} · ${formatClock(window.start)}–${formatClock(window.end)}${
    overnight ? " (overnight)" : ""
  }`;
}

export function validateWindow(input: {
  days: number[];
  start: string;
  end: string;
}): { ok: true } | { ok: false; reason: string } {
  const days = [...new Set(input.days)].filter((day) =>
    WEEKDAYS.some((row) => row.day === day),
  );
  if (days.length === 0) {
    return { ok: false, reason: "Pick at least one day." };
  }
  const start = parseMinutes(input.start);
  const end = parseMinutes(input.end);
  if (start == null || end == null) {
    return { ok: false, reason: "Use a 24-hour time such as 19:00." };
  }
  if (start === end) {
    return { ok: false, reason: "Start and end cannot be the same time." };
  }
  return { ok: true };
}

export function normalizeWindow(
  raw?: Partial<LockWindow> | null,
): LockWindow | null {
  if (!raw) return null;
  const check = validateWindow({
    days: raw.days ?? [],
    start: raw.start ?? "",
    end: raw.end ?? "",
  });
  if (!check.ok) return null;
  const start = normalizeTime(raw.start ?? "");
  const end = normalizeTime(raw.end ?? "");
  if (!start || !end) return null;
  return {
    id: typeof raw.id === "string" && raw.id ? raw.id : crypto.randomUUID(),
    days: [...new Set(raw.days)].filter((day) =>
      WEEKDAYS.some((row) => row.day === day),
    ),
    start,
    end,
    enabled: raw.enabled !== false,
  };
}

export function normalizeSchedule(raw?: unknown): LockWindow[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((row) => normalizeWindow(row as Partial<LockWindow>))
    .filter((row): row is LockWindow => Boolean(row))
    .slice(0, 8);
}

function minutesNow(now: Date) {
  return now.getHours() * 60 + now.getMinutes();
}

export function windowContains(window: LockWindow, now: Date) {
  if (!window.enabled) return false;
  const start = parseMinutes(window.start);
  const end = parseMinutes(window.end);
  if (start == null || end == null || start === end) return false;
  const mins = minutesNow(now);
  const today = now.getDay();
  const yesterday = (today + 6) % 7;
  if (end > start) {
    return window.days.includes(today) && mins >= start && mins < end;
  }
  if (mins >= start) return window.days.includes(today);
  return mins < end && window.days.includes(yesterday);
}

export function remainingMs(window: LockWindow, now: Date) {
  const start = parseMinutes(window.start);
  const end = parseMinutes(window.end);
  if (start == null || end == null) return 0;
  const endAt = new Date(now);
  if (end > start) {
    endAt.setHours(Math.floor(end / 60), end % 60, 0, 0);
  } else if (minutesNow(now) >= start) {
    endAt.setDate(endAt.getDate() + 1);
    endAt.setHours(Math.floor(end / 60), end % 60, 0, 0);
  } else {
    endAt.setHours(Math.floor(end / 60), end % 60, 0, 0);
  }
  return Math.max(0, endAt.getTime() - now.getTime());
}

export function activeWindow(windows: LockWindow[], now = new Date()) {
  return windows.find((window) => windowContains(window, now)) ?? null;
}

function nextStart(window: LockWindow, now: Date) {
  const start = parseMinutes(window.start);
  if (start == null || !window.enabled || window.days.length === 0) return null;
  const mins = minutesNow(now);
  for (let offset = 0; offset < 8; offset += 1) {
    const day = (now.getDay() + offset) % 7;
    if (!window.days.includes(day)) continue;
    if (offset === 0 && mins >= start) continue;
    const startAt = new Date(now);
    startAt.setDate(now.getDate() + offset);
    startAt.setHours(Math.floor(start / 60), start % 60, 0, 0);
    return startAt;
  }
  return null;
}

export function todaysLockWindow(windows: LockWindow[], now = new Date()) {
  const today = now.getDay();
  const active = activeWindow(windows, now);
  if (active) return active;
  return (
    windows.find((window) => window.enabled && window.days.includes(today)) ??
    null
  );
}

export function upcomingWindow(windows: LockWindow[], now = new Date()) {
  const current = activeWindow(windows, now);
  if (current) {
    return { window: current, startsAt: now, active: true as const };
  }
  let best: { window: LockWindow; startsAt: Date } | null = null;
  for (const window of windows) {
    const startsAt = nextStart(window, now);
    if (!startsAt) continue;
    if (!best || startsAt.getTime() < best.startsAt.getTime()) {
      best = { window, startsAt };
    }
  }
  return best ? { ...best, active: false as const } : null;
}

export function formatRemaining(ms: number) {
  const total = Math.max(0, Math.ceil(ms / 60_000));
  const hours = Math.floor(total / 60);
  const minutes = total % 60;
  if (hours && minutes) return `${hours}h ${minutes}m left`;
  if (hours) return `${hours}h left`;
  if (minutes) return `${minutes} min left`;
  return "Ending now";
}

export function formatWhen(date: Date, now = new Date()) {
  const sameDay =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  const isTomorrow =
    date.getFullYear() === tomorrow.getFullYear() &&
    date.getMonth() === tomorrow.getMonth() &&
    date.getDate() === tomorrow.getDate();
  const time = formatClock(
    `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`,
  );
  if (sameDay) return `Today · ${time}`;
  if (isTomorrow) return `Tomorrow · ${time}`;
  return `${date.toLocaleDateString([], { weekday: "short" })} · ${time}`;
}
