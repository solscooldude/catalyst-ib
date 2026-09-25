export type Friend = {
  code: string;
  name: string;
  avatarUrl: string | null;
  tokens: number;
  streakDays: number;
  studyMinutes: number;
  weeklyStudyMinutes: number;
  tasksCompleted: number;
};

export type FriendRequest = {
  id: string;
  code: string;
  name: string;
  avatarUrl: string | null;
  sentAt: number;
  direction: "in" | "out";
};

export const FRIEND_CODE_HINT =
  "4–12 characters. Letters, numbers, and hyphens. Must start and end with a letter or number.";

export function normalizeFriendCode(raw: string) {
  const next = raw.trim().toUpperCase().replace(/\s+/g, "");
  if (next.length < 4 || next.length > 12) return "";
  if (!/^[A-Z0-9][A-Z0-9-]{2,10}[A-Z0-9]$/.test(next)) return "";
  if (!/[A-Z]/.test(next)) return "";
  return next;
}

export function stubFriendFromCode(code: string): Friend {
  let hash = 0;
  for (const ch of code) hash = (hash * 33 + ch.charCodeAt(0)) >>> 0;
  return {
    code,
    name: "",
    avatarUrl: null,
    tokens: 6 + (hash % 48),
    streakDays: 1 + (hash % 18),
    studyMinutes: 40 + (hash % 320),
    weeklyStudyMinutes: 12 + (hash % 240),
    tasksCompleted: 1 + (hash % 12),
  };
}

/** True when the stored label is the auto ID (or a leftover "Friend AB12" stub). */
export function isGeneratedFriendName(name?: string | null, code?: string | null) {
  const trimmed = String(name ?? "").trim();
  if (!trimmed) return true;
  const normalizedCode = String(code ?? "")
    .trim()
    .toUpperCase();
  if (normalizedCode && trimmed.toUpperCase() === normalizedCode) return true;
  if (/^friend\s+[A-Z0-9]{4}$/i.test(trimmed)) return true;
  const suffix = normalizedCode.slice(-4);
  if (suffix && new RegExp(`^friend\\s+${suffix}$`, "i").test(trimmed)) return true;
  return false;
}

/** Setup username only — never the assigned friend ID. */
export function friendUsername(row: { name?: string; code?: string }) {
  const name = String(row.name ?? "").trim();
  if (!name || isGeneratedFriendName(name, row.code)) return "";
  return name.slice(0, 20);
}

export function friendDisplayName(row: { name?: string; code?: string }) {
  return friendUsername(row) || "Friend";
}

export function formatFriendId(code?: string | null) {
  const next = normalizeFriendCode(String(code ?? "")) || String(code ?? "").trim().toUpperCase();
  return next ? `ID ${next}` : "";
}

export function normalizeFriendAvatar(raw?: string | null) {
  if (!raw || typeof raw !== "string") return null;
  const next = raw.trim();
  if (/^https:\/\//i.test(next) && next.length <= 500) return next.slice(0, 500);
  if (next.startsWith("data:image/") && next.length <= 80_000) return next;
  return null;
}

export function shareableFriendAvatar(raw?: string | null) {
  const next = normalizeFriendAvatar(raw);
  return next && /^https:\/\//i.test(next) ? next : null;
}

export function friendInitials(name: string) {
  const parts = String(name ?? "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  const letters = `${parts[0]?.[0] ?? ""}${parts[1]?.[0] ?? ""}`;
  return (letters || "?").toUpperCase().slice(0, 2);
}

export function formatRequestTime(sentAt: number, now = Date.now()) {
  const delta = Math.max(0, now - sentAt);
  if (delta < 45_000) return "Just now";
  if (delta < 60 * 60 * 1000) return `${Math.max(1, Math.round(delta / 60_000))}m ago`;
  if (delta < 24 * 60 * 60 * 1000) {
    return `${Math.max(1, Math.round(delta / 3_600_000))}h ago`;
  }
  return new Date(sentAt).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function normalizeFriend(raw: unknown): Friend | null {
  if (!raw || typeof raw !== "object") return null;
  const item = raw as Partial<Friend>;
  const code = normalizeFriendCode(String(item.code ?? ""));
  if (!code) return null;
  const stub = stubFriendFromCode(code);
  const weekly =
    typeof item.weeklyStudyMinutes === "number" && item.weeklyStudyMinutes >= 0
      ? Math.round(item.weeklyStudyMinutes)
      : stub.weeklyStudyMinutes;
  return {
    code,
    name: friendUsername({ name: item.name, code }),
    avatarUrl: normalizeFriendAvatar(item.avatarUrl),
    tokens:
      typeof item.tokens === "number" && item.tokens >= 0
        ? Math.round(item.tokens)
        : stub.tokens,
    streakDays:
      typeof item.streakDays === "number" && item.streakDays >= 1
        ? Math.round(item.streakDays)
        : stub.streakDays,
    studyMinutes:
      typeof item.studyMinutes === "number" && item.studyMinutes >= 0
        ? Math.round(item.studyMinutes)
        : stub.studyMinutes,
    weeklyStudyMinutes: weekly,
    tasksCompleted:
      typeof item.tasksCompleted === "number" && item.tasksCompleted >= 0
        ? Math.round(item.tasksCompleted)
        : stub.tasksCompleted,
  };
}

export function normalizeFriendRequest(raw: unknown): FriendRequest | null {
  if (!raw || typeof raw !== "object") return null;
  const item = raw as Partial<FriendRequest> & { fromCode?: string };
  const code = normalizeFriendCode(String(item.code ?? item.fromCode ?? ""));
  if (!code) return null;
  const direction = item.direction === "out" ? "out" : "in";
  const sentAt = Number(item.sentAt);
  return {
    id: String(item.id ?? `${direction}-${code}-${Number.isFinite(sentAt) ? sentAt : 0}`),
    code,
    name: friendUsername({ name: item.name, code }),
    avatarUrl: normalizeFriendAvatar(item.avatarUrl),
    sentAt: Number.isFinite(sentAt) && sentAt > 0 ? sentAt : Date.now(),
    direction,
  };
}

export function normalizeFriendRequests(raw: unknown): FriendRequest[] {
  if (!Array.isArray(raw)) return [];
  const seen = new Set<string>();
  const next: FriendRequest[] = [];
  for (const row of raw) {
    const item = normalizeFriendRequest(row);
    if (!item || seen.has(`${item.direction}:${item.code}`)) continue;
    seen.add(`${item.direction}:${item.code}`);
    next.push(item);
  }
  return next.sort((a, b) => b.sentAt - a.sentAt).slice(0, 40);
}

export function normalizeFriends(raw: unknown): Friend[] {
  if (!Array.isArray(raw)) return [];
  const seen = new Set<string>();
  const next: Friend[] = [];
  for (const row of raw) {
    const item = normalizeFriend(row);
    if (!item || seen.has(item.code)) continue;
    seen.add(item.code);
    next.push(item);
  }
  return next.slice(0, 24);
}

export function rankFriends<T extends { weeklyStudyMinutes: number; code?: string }>(
  rows: T[],
) {
  return [...rows].sort(
    (a, b) =>
      b.weeklyStudyMinutes - a.weeklyStudyMinutes ||
      (a.code ?? "").localeCompare(b.code ?? ""),
  );
}

export function overlayFriendProfile<
  T extends { code: string; name: string; avatarUrl: string | null },
>(
  row: T,
  profile: { name?: string; avatarUrl?: string | null; weeklyStudyMinutes?: number },
): T {
  const name = friendUsername({ name: profile.name, code: row.code }) || row.name;
  const avatarUrl = normalizeFriendAvatar(profile.avatarUrl) ?? row.avatarUrl;
  const weekly =
    typeof profile.weeklyStudyMinutes === "number" && profile.weeklyStudyMinutes >= 0
      ? Math.round(profile.weeklyStudyMinutes)
      : undefined;
  return {
    ...row,
    name,
    avatarUrl,
    ...("weeklyStudyMinutes" in row && weekly !== undefined
      ? { weeklyStudyMinutes: weekly }
      : {}),
  };
}
