import { auth, clerkClient } from "@clerk/nextjs/server";
import { isClerkServerConfigured } from "@/lib/clerk-config";
import {
  becomeFriendsOnSnapshot,
  findUserByFriendCode,
  friendFromProfile,
  listsFromSnapshot,
  profileFromUser,
  patchUserCatalyst,
} from "@/lib/friend-server";
import { normalizeFriendCode } from "@/lib/friends";

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
  const body = (await request.json()) as {
    code?: string;
    action?: "accept" | "decline" | "cancel";
  };
  const code = normalizeFriendCode(body.code ?? "");
  const action = body.action;
  if (!code || !["accept", "decline", "cancel"].includes(String(action))) {
    return Response.json({ error: "invalid" }, { status: 400 });
  }

  const client = await clerkClient();
  const meUser = await client.users.getUser(userId);
  const meProfile = profileFromUser(meUser);
  const otherUser = await findUserByFriendCode(code);
  const otherProfile = otherUser ? profileFromUser(otherUser) : null;
  if (!meProfile) {
    return Response.json({ error: "not-found" }, { status: 404 });
  }

  if (action === "accept") {
    if (!otherUser || !otherProfile) {
      return Response.json({ error: "not-found" }, { status: 404 });
    }
    const mine = await patchUserCatalyst(userId, (current) =>
      becomeFriendsOnSnapshot(current, friendFromProfile(otherProfile)),
    );
    await patchUserCatalyst(otherUser.id, (current) =>
      becomeFriendsOnSnapshot(current, friendFromProfile(meProfile)),
    );
    return Response.json({
      ok: true,
      becameFriends: true,
      profile: otherProfile,
      ...listsFromSnapshot(mine),
    });
  }

  const mine = await patchUserCatalyst(userId, (current) => ({
    ...current,
    incomingRequests:
      action === "decline"
        ? (current.incomingRequests ?? []).filter((row) => row.code !== code)
        : current.incomingRequests,
    outgoingRequests:
      action === "cancel"
        ? (current.outgoingRequests ?? []).filter((row) => row.code !== code)
        : current.outgoingRequests,
  }));

  if (otherUser) {
    await patchUserCatalyst(otherUser.id, (current) => ({
      ...current,
      incomingRequests:
        action === "cancel"
          ? (current.incomingRequests ?? []).filter(
              (row) => row.code !== meProfile.code,
            )
          : current.incomingRequests,
      outgoingRequests:
        action === "decline"
          ? (current.outgoingRequests ?? []).filter(
              (row) => row.code !== meProfile.code,
            )
          : current.outgoingRequests,
    }));
  }

  return Response.json({
    ok: true,
    profile: otherProfile,
    ...listsFromSnapshot(mine),
  });
}
