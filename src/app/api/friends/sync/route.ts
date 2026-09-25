import { auth, clerkClient } from "@clerk/nextjs/server";
import { extractCloudSnapshot, type CloudSource } from "@/lib/cloud-state";
import { isClerkServerConfigured } from "@/lib/clerk-config";
import {
  findUserByFriendCode,
  friendFromProfile,
  listsFromSnapshot,
  profileFromUser,
  type PublicFriendProfile,
  patchUserCatalyst,
} from "@/lib/friend-server";
import { friendDisplayName } from "@/lib/friends";

export const runtime = "nodejs";

function unconfigured() {
  return Response.json(
    { error: "connect-auth", configured: false },
    { status: 503 },
  );
}

export async function GET() {
  if (!isClerkServerConfigured()) return unconfigured();
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const client = await clerkClient();
  const meUser = await client.users.getUser(userId);
  const me = profileFromUser(meUser);
  const current = listsFromSnapshot(
    extractCloudSnapshot(
      ((meUser.privateMetadata as { catalyst?: CloudSource } | undefined)
        ?.catalyst ?? {}) as CloudSource,
    ),
  );

  const codes = [
    ...new Set([
      ...current.friends.map((row) => row.code),
      ...current.incomingRequests.map((row) => row.code),
      ...current.outgoingRequests.map((row) => row.code),
    ]),
  ];

  const profiles: PublicFriendProfile[] = [];
  for (const code of codes) {
    const user = await findUserByFriendCode(code);
    const profile = user ? profileFromUser(user) : null;
    if (profile) profiles.push(profile);
  }

  const byCode = new Map(profiles.map((row) => [row.code, row]));
  const mine = await patchUserCatalyst(userId, (snap) => ({
    ...snap,
    friends: (snap.friends ?? current.friends).map((row) => {
      const hit = byCode.get(row.code);
      if (!hit) return row;
      return friendFromProfile(hit);
    }),
    incomingRequests: (snap.incomingRequests ?? current.incomingRequests).map(
      (row) => {
        const hit = byCode.get(row.code);
        if (!hit) return row;
        return {
          ...row,
          name: friendDisplayName({ name: hit.name, code: row.code }),
          avatarUrl: hit.avatarUrl,
        };
      },
    ),
    outgoingRequests: (snap.outgoingRequests ?? current.outgoingRequests).map(
      (row) => {
        const hit = byCode.get(row.code);
        if (!hit) return row;
        return {
          ...row,
          name: friendDisplayName({ name: hit.name, code: row.code }),
          avatarUrl: hit.avatarUrl,
        };
      },
    ),
  }));

  return Response.json({
    ok: true,
    me,
    profiles,
    ...listsFromSnapshot(mine),
  });
}
