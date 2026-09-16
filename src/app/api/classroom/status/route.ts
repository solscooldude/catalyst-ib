import { classroomCredentials, readClassroomToken } from "@/lib/classroom-oauth";

export async function GET() {
  const token = await readClassroomToken();
  return Response.json({
    credentialsReady: classroomCredentials().ready,
    connected: Boolean(token),
    email: token?.email ?? null,
  });
}
