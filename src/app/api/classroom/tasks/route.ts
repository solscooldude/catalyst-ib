import { classroomWorkToTasks } from "@/lib/classroom";
import {
  classroomCredentials,
  fetchClassroomWork,
  readClassroomToken,
} from "@/lib/classroom-oauth";

export async function GET() {
  if (!classroomCredentials().ready) {
    return Response.json(
      { ok: false, reason: "needs-credentials", tasks: [] },
      { status: 401 },
    );
  }
  const token = await readClassroomToken();
  if (!token) {
    return Response.json(
      { ok: false, reason: "not-connected", tasks: [] },
      { status: 401 },
    );
  }
  try {
    const work = await fetchClassroomWork(token.accessToken);
    return Response.json({
      ok: true,
      email: token.email ?? null,
      tasks: classroomWorkToTasks(work),
    });
  } catch (error) {
    return Response.json(
      {
        ok: false,
        reason: error instanceof Error ? error.message : "Classroom sync failed.",
        tasks: [],
      },
      { status: 502 },
    );
  }
}
