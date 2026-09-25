import { sessionAccountId } from "@/lib/closet";
import {
  friendUsername,
  normalizeFriendAvatar,
  normalizeFriendCode,
  normalizeFriendRequests,
  type FriendRequest,
} from "@/lib/friends-model";
import { makeFriendCode } from "@/lib/identity";
import { ROUTES } from "@/lib/routes";

export type { Friend, FriendRequest } from "@/lib/friends-model";
export {
  FRIEND_CODE_HINT,
  formatFriendId,
  friendDisplayName,
  friendInitials,
  friendUsername,
  formatRequestTime,
  isGeneratedFriendName,
  normalizeFriend,
  normalizeFriendAvatar,
  normalizeFriendCode,
  normalizeFriendRequest,
  normalizeFriendRequests,
  normalizeFriends,
  overlayFriendProfile,
  rankFriends,
  shareableFriendAvatar,
  stubFriendFromCode,
} from "@/lib/friends-model";

const INBOX_KEY = "catalyst-v1:friend-inbox";
const DIRECTORY_KEY = "catalyst-v1:friend-directory";

const CLAIMS_KEY = "catalyst-v1:friend-code-claims";
const PLACEHOLDER_CODES = new Set(["CAT-WAIT1"]);

export const FRIEND_TABS = ["races", "manage", "board"] as const;
export type FriendTab = (typeof FRIEND_TABS)[number];

export const FRIEND_CODE_COPY =
  "Your assigned friend ID. Friends add you with this — they still see the username and photo you set during setup.";

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

export type FriendDirectoryEntry = {
  code: string;
  name: string;
  avatarUrl: string | null;
  weeklyStudyMinutes: number;
  tokens: number;
  streakDays: number;
};

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const parsed = JSON.parse(window.localStorage.getItem(key) ?? "null") as T;
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

export function publishFriendDirectory(entry: FriendDirectoryEntry) {
  const code = normalizeFriendCode(entry.code);
  if (!code || typeof window === "undefined") return;
  const directory = readJson<Record<string, FriendDirectoryEntry>>(DIRECTORY_KEY, {});
  directory[code] = {
    code,
    name: friendUsername(entry),
    avatarUrl: normalizeFriendAvatar(entry.avatarUrl),
    weeklyStudyMinutes: Math.max(0, Math.round(entry.weeklyStudyMinutes || 0)),
    tokens: Math.max(0, Math.round(entry.tokens || 0)),
    streakDays: Math.max(0, Math.round(entry.streakDays || 0)),
  };
  window.localStorage.setItem(DIRECTORY_KEY, JSON.stringify(directory));
}

export function lookupFriendDirectory(code: string): FriendDirectoryEntry | null {
  const next = normalizeFriendCode(code);
  if (!next) return null;
  const directory = readJson<Record<string, FriendDirectoryEntry>>(DIRECTORY_KEY, {});
  return directory[next] ?? null;
}

export function resolveFriendRow<T extends { code: string; name: string; avatarUrl: string | null }>(
  row: T,
): T {
  const listed = listedFriendProfile(row.code);
  if (!listed) return { ...row, name: friendUsername(row) };
  return {
    ...row,
    name: friendUsername({ name: listed.name || row.name, code: row.code }),
    avatarUrl: row.avatarUrl || listed.avatarUrl,
  };
}

export function listedFriendProfile(code: string) {
  const listed = lookupFriendDirectory(code);
  if (!listed) return null;
  return {
    code: listed.code,
    name: friendUsername(listed),
    avatarUrl: normalizeFriendAvatar(listed.avatarUrl),
    weeklyStudyMinutes: listed.weeklyStudyMinutes,
  };
}

export function pushLocalInbox(targetCode: string, request: FriendRequest) {
  const code = normalizeFriendCode(targetCode);
  if (!code || typeof window === "undefined") return;
  const inbox = readJson<Record<string, FriendRequest[]>>(INBOX_KEY, {});
  const current = normalizeFriendRequests(inbox[code]);
  if (current.some((row) => row.code === request.code && row.direction === "in")) {
    inbox[code] = current;
  } else {
    inbox[code] = normalizeFriendRequests([
      { ...request, direction: "in" },
      ...current,
    ]);
  }
  window.localStorage.setItem(INBOX_KEY, JSON.stringify(inbox));
}

export function readLocalInbox(myCode: string): FriendRequest[] {
  const code = normalizeFriendCode(myCode);
  if (!code) return [];
  const inbox = readJson<Record<string, FriendRequest[]>>(INBOX_KEY, {});
  return normalizeFriendRequests(inbox[code]).map((row) => ({
    ...row,
    direction: "in" as const,
  }));
}

export function removeLocalInbox(myCode: string, fromCode: string) {
  const mine = normalizeFriendCode(myCode);
  const theirs = normalizeFriendCode(fromCode);
  if (!mine || typeof window === "undefined") return;
  const inbox = readJson<Record<string, FriendRequest[]>>(INBOX_KEY, {});
  inbox[mine] = normalizeFriendRequests(inbox[mine]).filter(
    (row) => row.code !== theirs,
  );
  window.localStorage.setItem(INBOX_KEY, JSON.stringify(inbox));
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
