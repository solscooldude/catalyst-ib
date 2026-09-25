import { auth, clerkClient } from "@clerk/nextjs/server";
import { isClerkServerConfigured } from "@/lib/clerk-config";
import {
  fanOutPublicProfile,
  listsFromSnapshot,
  peerCodesFromSnapshot,
  profileFromUser,
  selfProfileFromSnapshot,
  patchUserCatalyst,
} from "@/lib/friend-server";
import { normalizeFriendCode } from "@/lib/friends";
import { normalizeAvatar, normalizeAvatarUrl, normalizeUsername } from "@/lib/identity";

export const runtime = "nodejs";

function unconfigured() {
  return Response.json(
    { error: "connect-auth", configured: false },
    { status: 503 },
  );
}

function dataUrlToFile(dataUrl: string): File | null {
  const match = /^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/.exec(dataUrl);
  if (!match) return null;
  const buf = Buffer.from(match[2], "base64");
  if (!buf.length || buf.length > 80_000) return null;
  return new File([buf], "avatar.jpg", { type: match[1] });
}

async function uploadProfileImage(userId: string, dataUrl: string) {
  const file = dataUrlToFile(dataUrl);
  if (!file) return null;
  const client = await clerkClient();
  try {
    await client.users.updateUserProfileImage(userId, { file });
    const user = await client.users.getUser(userId);
    return normalizeAvatarUrl(user.imageUrl);
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  if (!isClerkServerConfigured()) return unconfigured();
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as {
    username?: string;
    avatarUrl?: string | null;
    avatarDataUrl?: string | null;
    weeklyStudyMinutes?: number;
    peerCodes?: string[];
  };

  const username = normalizeUsername(body.username);
  const remoteAvatar = normalizeAvatarUrl(body.avatarUrl);
  const localAvatar = normalizeAvatar(body.avatarDataUrl);
  const uploaded = localAvatar ? await uploadProfileImage(userId, localAvatar) : null;

  const snapshot = await patchUserCatalyst(userId, (current) => ({
    ...current,
    username: username || current.username,
    avatarUrl: uploaded || remoteAvatar || current.avatarUrl,
    weeklyStudyMinutes:
      typeof body.weeklyStudyMinutes === "number" && body.weeklyStudyMinutes >= 0
        ? Math.round(body.weeklyStudyMinutes)
        : current.weeklyStudyMinutes,
  }));

  const client = await clerkClient();
  const meUser = await client.users.getUser(userId);
  const profile =
    profileFromUser(meUser) ?? selfProfileFromSnapshot(snapshot, meUser.imageUrl);

  const peers = [
    ...(Array.isArray(body.peerCodes) ? body.peerCodes : []),
    ...peerCodesFromSnapshot(snapshot),
  ]
    .map((code) => normalizeFriendCode(code))
    .filter(Boolean);

  await fanOutPublicProfile(profile.code, profile, peers);

  return Response.json({
    ok: true,
    profile,
    ...listsFromSnapshot(snapshot),
  });
}
