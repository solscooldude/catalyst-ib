import {
  classroomCredentials,
  fetchClassroomWork,
  readClassroomToken,
} from "@/lib/classroom-oauth";

export async function GET() {
  if (!classroomCredentials().ready) {
    return Response.json(
      { ok: false, reason: "needs-credentials", rows: [] },
      { status: 401 },
    );
  }
  const token = await readClassroomToken();
  if (!token) {
    return Response.json(
      { ok: false, reason: "not-connected", rows: [] },
      { status: 401 },
    );
  }
  try {
    const work = await fetchClassroomWork(token.accessToken);
    const rows: Array<{ id: string; submitted: boolean }> = [];
    for (const item of work) {
      const [courseId, workId] = item.id.split("-");
      if (!courseId || !workId) continue;
      const res = await fetch(
        `https://classroom.googleapis.com/v1/courses/${courseId}/courseWork/${workId}/studentSubmissions?userId=me`,
        { headers: { Authorization: `Bearer ${token.accessToken}` } },
      );
      if (!res.ok) {
        rows.push({ id: `cls-${item.id}`.slice(0, 64), submitted: false });
        continue;
      }
      const json = (await res.json()) as {
        studentSubmissions?: Array<{ state?: string }>;
      };
      const state = json.studentSubmissions?.[0]?.state ?? "";
      const submitted = ["TURNED_IN", "RETURNED"].includes(state);
      rows.push({
        id: item.id.startsWith("cls-") ? item.id : `cls-${item.id}`.slice(0, 64),
        submitted,
      });
    }
    return Response.json({ ok: true, rows });
  } catch (error) {
    return Response.json(
      {
        ok: false,
        reason:
          error instanceof Error ? error.message : "Submission check failed.",
        rows: [],
      },
      { status: 502 },
    );
  }
}
