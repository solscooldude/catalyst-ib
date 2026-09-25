import { clerkClient } from "@clerk/nextjs/server";
import {
  compactCloudSnapshot,
  extractCloudSnapshot,
  type CloudSnapshot,
  type CloudSource,
} from "@/lib/cloud-state";
import {
  friendUsername,
  normalizeFriend,
  normalizeFriendCode,
  normalizeFriendRequests,
  normalizeFriends,
  overlayFriendProfile,
  shareableFriendAvatar,
  stubFriendFromCode,
  type Friend,
  type FriendRequest,
} from "@/lib/friends";
import { normalizeAvatarUrl, normalizeUsername } from "@/lib/identity";

export type PublicFriendProfile = {
  code: string;
  name: string;
  avatarUrl: string | null;
  weeklyStudyMinutes: number;
  tokens: number;
  streakDays: number;
};

type ClerkUser = Awaited<
  ReturnType<Awaited<ReturnType<typeof clerkClient>>["users"]["getUser"]>
>;

function catalystFromUser(user: ClerkUser): CloudSnapshot {
  const raw = (user.privateMetadata as { catalyst?: CloudSource } | undefined)
    ?.catalyst;
  return extractCloudSnapshot(raw ?? {});
}

function matchesCode(user: ClerkUser, code: string) {
  const publicCode = normalizeFriendCode(
    String(
      (user.publicMetadata as { friendCode?: string } | undefined)?.friendCode ??
        "",
    ),
  );
  const privateCode = normalizeFriendCode(
    String(catalystFromUser(user).friendCode ?? ""),
  );
  const external = normalizeFriendCode(String(user.externalId ?? ""));
  return publicCode === code || privateCode === code || external === code;
}

export function profileFromUser(user: ClerkUser): PublicFriendProfile | null {
  const snap = catalystFromUser(user);
  const publicMeta = (user.publicMetadata ?? {}) as {
    username?: string;
    friendCode?: string;
    avatarUrl?: string;
    weeklyStudyMinutes?: number;
  };
  const code = normalizeFriendCode(
    publicMeta.friendCode || snap.friendCode || user.externalId || "",
  );
  if (!code) return null;
  const name =
    normalizeUsername(publicMeta.username || snap.username) ||
    friendUsername({ name: user.username ?? "", code });
  return {
    code,
    name,
    avatarUrl:
      shareableFriendAvatar(publicMeta.avatarUrl) ||
      normalizeAvatarUrl(user.imageUrl) ||
      shareableFriendAvatar(snap.avatarUrl),
    weeklyStudyMinutes: Math.max(
      0,
      Math.round(
        Number(publicMeta.weeklyStudyMinutes ?? snap.weeklyStudyMinutes ?? 0) ||
          0,
      ),
    ),
    tokens: snap.tokens,
    streakDays: snap.streakDays,
  };
}

export function friendFromProfile(profile: PublicFriendProfile): Friend {
  const stub = stubFriendFromCode(profile.code);
  return (
    normalizeFriend({
      ...stub,
      name: profile.name,
      avatarUrl: profile.avatarUrl,
      weeklyStudyMinutes: profile.weeklyStudyMinutes,
      tokens: profile.tokens,
      streakDays: profile.streakDays,
    }) ?? stub
  );
}

export async function findUserByFriendCode(code: string) {
  const next = normalizeFriendCode(code);
  if (!next) return null;
  const client = await clerkClient();
  const byExternal = await client.users.getUserList({
    externalId: [next],
    limit: 5,
  });
  const externalHit = byExternal.data.find((user) => matchesCode(user, next));
  if (externalHit) return externalHit;

  const byQuery = await client.users.getUserList({ query: next, limit: 20 });
  const queryHit = byQuery.data.find((user) => matchesCode(user, next));
  if (queryHit) return queryHit;

  let offset = 0;
  while (offset < 200) {
    const page = await client.users.getUserList({ limit: 50, offset });
    const found = page.data.find((user) => matchesCode(user, next));
    if (found) return found;
    if (page.data.length < 50) break;
    offset += 50;
  }
  return null;
}

async function writeSnapshot(userId: string, snapshot: CloudSnapshot) {
  const client = await clerkClient();
  const compact = compactCloudSnapshot(snapshot);
  if (compact.friendCode) {
    try {
      await client.users.updateUser(userId, { externalId: compact.friendCode });
    } catch {
      // Already claimed.
    }
  }
  await client.users.updateUserMetadata(userId, {
    privateMetadata: { catalyst: compact },
    publicMetadata: {
      username: compact.username,
      friendCode: compact.friendCode,
      avatarUrl: compact.avatarUrl,
      weeklyStudyMinutes: compact.weeklyStudyMinutes,
    },
  });
  return compact;
}

export async function patchUserCatalyst(
  userId: string,
  patch: (current: CloudSnapshot) => CloudSnapshot,
) {
  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const next = patch(catalystFromUser(user));
  return writeSnapshot(userId, next);
}

function upsertFriend(list: Friend[] | undefined, friend: Friend) {
  const current = normalizeFriends(list);
  if (current.some((row) => row.code === friend.code)) {
    return current.map((row) =>
      row.code === friend.code ? { ...row, ...friend } : row,
    );
  }
  return [...current, friend].slice(0, 24);
}

function withoutCode<T extends { code: string }>(
  list: T[] | undefined,
  code: string,
) {
  return (list ?? []).filter((row) => row.code !== code);
}

export function becomeFriendsOnSnapshot(
  snapshot: CloudSnapshot,
  other: Friend,
): CloudSnapshot {
  return {
    ...snapshot,
    friends: upsertFriend(snapshot.friends, other),
    incomingRequests: withoutCode(snapshot.incomingRequests, other.code),
    outgoingRequests: withoutCode(snapshot.outgoingRequests, other.code),
  };
}

export function listsFromSnapshot(snapshot: CloudSnapshot) {
  return {
    friends: normalizeFriends(snapshot.friends),
    incomingRequests: normalizeFriendRequests(snapshot.incomingRequests).filter(
      (row) => row.direction === "in",
    ),
    outgoingRequests: normalizeFriendRequests(snapshot.outgoingRequests).map(
      (row) => ({ ...row, direction: "out" as const }),
    ),
  };
}

export function requestFromProfile(
  profile: PublicFriendProfile,
  direction: "in" | "out",
  sentAt = Date.now(),
): FriendRequest {
  return {
    id: `${direction}-${profile.code}-${sentAt}`,
    code: profile.code,
    name: profile.name,
    avatarUrl: profile.avatarUrl,
    sentAt,
    direction,
  };
}

export function selfProfileFromSnapshot(
  snapshot: CloudSnapshot,
  imageUrl?: string | null,
): PublicFriendProfile {
  const code = snapshot.friendCode;
  return {
    code,
    name: normalizeUsername(snapshot.username) || friendUsername({ name: "", code }),
    avatarUrl:
      shareableFriendAvatar(snapshot.avatarUrl) || normalizeAvatarUrl(imageUrl),
    weeklyStudyMinutes: snapshot.weeklyStudyMinutes,
    tokens: snapshot.tokens,
    streakDays: snapshot.streakDays,
  };
}

export function overlayProfileOnSnapshot(
  snapshot: CloudSnapshot,
  code: string,
  profile: Pick<PublicFriendProfile, "name" | "avatarUrl" | "weeklyStudyMinutes">,
) {
  const next = normalizeFriendCode(code);
  if (!next) return snapshot;
  const patch = {
    name: profile.name,
    avatarUrl: profile.avatarUrl,
    weeklyStudyMinutes: profile.weeklyStudyMinutes,
  };
  return {
    ...snapshot,
    friends: (snapshot.friends ?? []).map((row) =>
      row.code === next ? overlayFriendProfile(row, patch) : row,
    ),
    incomingRequests: (snapshot.incomingRequests ?? []).map((row) =>
      row.code === next ? overlayFriendProfile(row, patch) : row,
    ),
    outgoingRequests: (snapshot.outgoingRequests ?? []).map((row) =>
      row.code === next ? overlayFriendProfile(row, patch) : row,
    ),
  };
}

export async function fanOutPublicProfile(
  myCode: string,
  profile: PublicFriendProfile,
  peerCodes: string[],
) {
  const mine = normalizeFriendCode(myCode);
  if (!mine) return;
  const unique = [
    ...new Set(peerCodes.map((code) => normalizeFriendCode(code)).filter(Boolean)),
  ].filter((code) => code !== mine);
  for (const code of unique) {
    const user = await findUserByFriendCode(code);
    if (!user) continue;
    await patchUserCatalyst(user.id, (snap) =>
      overlayProfileOnSnapshot(snap, mine, profile),
    );
  }
}

export function peerCodesFromSnapshot(snapshot: CloudSnapshot) {
  return [
    ...(snapshot.friends ?? []).map((row) => row.code),
    ...(snapshot.incomingRequests ?? []).map((row) => row.code),
    ...(snapshot.outgoingRequests ?? []).map((row) => row.code),
  ];
}
