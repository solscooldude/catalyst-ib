import { auth, clerkClient } from "@clerk/nextjs/server";
import { isClerkServerConfigured } from "@/lib/clerk-config";
import {
  becomeFriendsOnSnapshot,
  findUserByFriendCode,
  friendFromProfile,
  listsFromSnapshot,
  profileFromUser,
  requestFromProfile,
  selfProfileFromSnapshot,
  patchUserCatalyst,
} from "@/lib/friend-server";
import { normalizeFriendCode, normalizeFriendRequests } from "@/lib/friends";

export const runtime = "nodejs";

function unconfigured() {
  return Response.json(
    { error: "connect-auth", configured: false },
    { status: 503 },
  );
}

export async function POST(request: Request) {
  if (!isClerkServerConfigured()) return unconfigured();
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = (await request.json()) as { code?: string };
  const code = normalizeFriendCode(body.code ?? "");
  if (!code) {
    return Response.json({ error: "invalid-code" }, { status: 400 });
  }

  const client = await clerkClient();
  const meUser = await client.users.getUser(userId);
  const meProfile = profileFromUser(meUser);
  const otherUser = await findUserByFriendCode(code);
  const otherProfile = otherUser ? profileFromUser(otherUser) : null;
  if (!meProfile || !otherUser || !otherProfile || otherUser.id === userId) {
    return Response.json({ error: "not-found" }, { status: 404 });
  }

  const meFriend = friendFromProfile(meProfile);
  const otherFriend = friendFromProfile(otherProfile);
  const now = Date.now();

  let becameFriends = false;
  const mine = await patchUserCatalyst(userId, (current) => {
    const friends = current.friends ?? [];
    if (friends.some((row) => row.code === code)) return current;
    const incoming = normalizeFriendRequests(current.incomingRequests);
    if (incoming.some((row) => row.code === code)) {
      becameFriends = true;
      return becomeFriendsOnSnapshot(current, otherFriend);
    }
    const outgoing = normalizeFriendRequests(current.outgoingRequests);
    if (outgoing.some((row) => row.code === code)) return current;
    return {
      ...current,
      outgoingRequests: [
        requestFromProfile(otherProfile, "out", now),
        ...outgoing,
      ],
    };
  });

  await patchUserCatalyst(otherUser.id, (current) => {
    const friends = current.friends ?? [];
    if (friends.some((row) => row.code === meProfile.code) || becameFriends) {
      return becomeFriendsOnSnapshot(current, meFriend);
    }
    const incoming = normalizeFriendRequests(current.incomingRequests);
    const outgoing = normalizeFriendRequests(current.outgoingRequests);
    if (outgoing.some((row) => row.code === meProfile.code)) {
      becameFriends = true;
      return becomeFriendsOnSnapshot(current, meFriend);
    }
    if (incoming.some((row) => row.code === meProfile.code)) return current;
    return {
      ...current,
      incomingRequests: [
        requestFromProfile(
          selfProfileFromSnapshot(mine, meUser.imageUrl),
          "in",
          now,
        ),
        ...incoming,
      ],
    };
  });

  if (becameFriends) {
    await patchUserCatalyst(userId, (current) =>
      becomeFriendsOnSnapshot(current, otherFriend),
    );
  }

  const latest = await patchUserCatalyst(userId, (current) => current);
  return Response.json({
    ok: true,
    becameFriends,
    profile: otherProfile,
    request: becameFriends
      ? undefined
      : requestFromProfile(otherProfile, "out", now),
    ...listsFromSnapshot(latest),
  });
}
