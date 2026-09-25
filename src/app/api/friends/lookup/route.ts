import { auth } from "@clerk/nextjs/server";
import { isClerkServerConfigured } from "@/lib/clerk-config";
import { findUserByFriendCode, profileFromUser } from "@/lib/friend-server";
import { normalizeFriendCode } from "@/lib/friends";

export const runtime = "nodejs";

function unconfigured() {
  return Response.json(
    { error: "connect-auth", configured: false },
    { status: 503 },
  );
}

export async function GET(request: Request) {
  if (!isClerkServerConfigured()) return unconfigured();
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const code = normalizeFriendCode(
    new URL(request.url).searchParams.get("code") ?? "",
  );
  if (!code) {
    return Response.json({ error: "invalid-code" }, { status: 400 });
  }
  const user = await findUserByFriendCode(code);
  const profile = user ? profileFromUser(user) : null;
  if (!profile || user?.id === userId) {
    return Response.json({ error: "not-found" }, { status: 404 });
  }
  return Response.json({ ok: true, profile });
}
