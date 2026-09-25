import { auth, clerkClient } from "@clerk/nextjs/server";
import { isClerkServerConfigured } from "@/lib/clerk-config";
import {
  compactCloudSnapshot,
  extractCloudSnapshot,
  isCloudEmpty,
  type CloudSnapshot,
} from "@/lib/cloud-state";

export const runtime = "nodejs";

function unconfigured() {
  return Response.json(
    {
      error: "connect-auth",
      configured: false,
      message: "Set Clerk keys to sync this account across browsers.",
    },
    { status: 503 },
  );
}

async function readSnapshot(userId: string) {
  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const raw = (user.privateMetadata as { catalyst?: unknown } | undefined)
    ?.catalyst;
  if (!raw || typeof raw !== "object") return null;
  return extractCloudSnapshot(raw as CloudSnapshot);
}

export async function GET() {
  if (!isClerkServerConfigured()) return unconfigured();
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const snapshot = await readSnapshot(userId);
  return Response.json({
    configured: true,
    empty: isCloudEmpty(snapshot),
    snapshot,
  });
}

export async function PUT(request: Request) {
  if (!isClerkServerConfigured()) return unconfigured();
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = (await request.json()) as { snapshot?: unknown };
  const snapshot = compactCloudSnapshot(
    extractCloudSnapshot((body.snapshot ?? {}) as CloudSnapshot),
  );
  const client = await clerkClient();
  if (snapshot.friendCode) {
    try {
      await client.users.updateUser(userId, { externalId: snapshot.friendCode });
    } catch {
      // Code already claimed as another account's external id.
    }
  }
  await client.users.updateUserMetadata(userId, {
    privateMetadata: { catalyst: snapshot },
    publicMetadata: {
      username: snapshot.username,
      friendCode: snapshot.friendCode,
      avatarUrl: snapshot.avatarUrl,
      weeklyStudyMinutes: snapshot.weeklyStudyMinutes,
    },
  });
  return Response.json({ ok: true, snapshot, empty: isCloudEmpty(snapshot) });
}
