import { sessionAccountId } from "@/lib/closet";
import { makeFriendCode } from "@/lib/identity";
import { ROUTES } from "@/lib/routes";

export type Friend = {
  code: string;
  name: string;
  tokens: number;
  streakDays: number;
  studyMinutes: number;
  weeklyStudyMinutes: number;
  tasksCompleted: number;
};

const CLAIMS_KEY = "catalyst-v1:friend-code-claims";
const PLACEHOLDER_CODES = new Set(["CAT-WAIT1"]);

export const FRIEND_TABS = ["races", "manage", "board"] as const;
export type FriendTab = (typeof FRIEND_TABS)[number];

export const FRIEND_CODE_HINT =
  "4–12 characters. Letters, numbers, and hyphens. Must start and end with a letter or number.";

export const FRIEND_CODE_COPY =
  "Your assigned Catalyst friend code. Share it so friends can add you.";

export function normalizeFriendCode(raw: string) {
  const next = raw.trim().toUpperCase().replace(/\s+/g, "");
  if (next.length < 4 || next.length > 12) return "";
  if (!/^[A-Z0-9][A-Z0-9-]{2,10}[A-Z0-9]$/.test(next)) return "";
  if (!/[A-Z]/.test(next)) return "";
  return next;
}

function readClaims(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    const parsed = JSON.parse(
      window.localStorage.getItem(CLAIMS_KEY) ?? "{}",
    ) as Record<string, string>;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function writeClaims(claims: Record<string, string>) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CLAIMS_KEY, JSON.stringify(claims));
}

export function friendCodeOwner(code: string) {
  return readClaims()[code] ?? null;
}

export function claimFriendCode(code: string, accountId?: string | null) {
  const owner = accountId ?? sessionAccountId();
  if (!owner) return { ok: false as const, reason: "Sign in first." };
  const claims = readClaims();
  const taken = claims[code];
  if (taken && taken !== owner) {
    return { ok: false as const, reason: "That code is already taken." };
  }
  for (const [existing, id] of Object.entries(claims)) {
    if (id === owner && existing !== code) delete claims[existing];
  }
  claims[code] = owner;
  writeClaims(claims);
  return { ok: true as const };
}

function mintUniqueCode(owner: string | null) {
  for (let attempt = 0; attempt < 24; attempt += 1) {
    const extra =
      attempt === 0
        ? ""
        : String(attempt % 36).toUpperCase().replace("10", "A");
    const base = makeFriendCode();
    const code = normalizeFriendCode(`${base}${extra}`) || base;
    const taken = friendCodeOwner(code);
    if (!taken || taken === owner) return code;
  }
  return `CAT-${Date.now().toString(36).slice(-6).toUpperCase()}`;
}

/** Keep a unique custom code; otherwise assign a new system code. */
export function assignUniqueFriendCode(
  preferred?: string | null,
  accountId?: string | null,
) {
  const owner = accountId ?? sessionAccountId();
  const existing = normalizeFriendCode(String(preferred ?? ""));
  const usable =
    existing && !PLACEHOLDER_CODES.has(existing) ? existing : "";
  if (usable) {
    const taken = friendCodeOwner(usable);
    if (!taken || taken === owner) {
      if (owner) claimFriendCode(usable, owner);
      return usable;
    }
  }
  const next = mintUniqueCode(owner);
  if (owner) claimFriendCode(next, owner);
  return next;
}

export function stubFriendFromCode(code: string): Friend {
  let hash = 0;
  for (const ch of code) hash = (hash * 33 + ch.charCodeAt(0)) >>> 0;
  return {
    code,
    name: `Friend ${code.slice(-4)}`,
    tokens: 6 + (hash % 48),
    streakDays: 1 + (hash % 18),
    studyMinutes: 40 + (hash % 320),
    weeklyStudyMinutes: 12 + (hash % 240),
    tasksCompleted: 1 + (hash % 12),
  };
}

export function normalizeFriends(raw: unknown): Friend[] {
  if (!Array.isArray(raw)) return [];
  const seen = new Set<string>();
  const next: Friend[] = [];
  for (const row of raw) {
    if (!row || typeof row !== "object") continue;
    const item = row as Partial<Friend>;
    const code = normalizeFriendCode(String(item.code ?? ""));
    if (!code || seen.has(code)) continue;
    seen.add(code);
    const stub = stubFriendFromCode(code);
    const weekly =
      typeof item.weeklyStudyMinutes === "number" && item.weeklyStudyMinutes >= 0
        ? Math.round(item.weeklyStudyMinutes)
        : stub.weeklyStudyMinutes;
    next.push({
      code,
      name:
        typeof item.name === "string" && item.name.trim()
          ? item.name.trim().slice(0, 20)
          : stub.name,
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
    });
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

export function parseFriendTab(raw: string | null | undefined): FriendTab {
  const key = String(raw ?? "")
    .trim()
    .replace(/^#/, "")
    .toLowerCase();
  if (key === "manage" || key === "add" || key === "list" || key === "friends") {
    return "manage";
  }
  if (key === "board" || key === "leaderboard") return "board";
  return "races";
}

export function friendTabFromLocation() {
  if (typeof window === "undefined") return "races" as const;
  const tab = new URLSearchParams(window.location.search).get("tab");
  if (tab) return parseFriendTab(tab);
  return parseFriendTab(window.location.hash);
}

export function friendTabHref(tab: FriendTab) {
  return `${ROUTES.friends}?tab=${tab}`;
}
