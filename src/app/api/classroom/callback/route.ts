import { NextRequest } from "next/server";
import {
  classroomCredentials,
  exchangeClassroomCode,
  fetchClassroomEmail,
  writeClassroomToken,
} from "@/lib/classroom-oauth";

export async function GET(request: NextRequest) {
  const origin = request.nextUrl.origin;
  if (!classroomCredentials().ready) {
    return Response.redirect(`${origin}/integrations?classroom=needs-credentials`);
  }
  const error = request.nextUrl.searchParams.get("error");
  const code = request.nextUrl.searchParams.get("code");
  if (error || !code) {
    return Response.redirect(`${origin}/integrations?classroom=denied`);
  }
  try {
    const accessToken = await exchangeClassroomCode(request, code);
    const email = await fetchClassroomEmail(accessToken);
    await writeClassroomToken({ accessToken, email });
    return Response.redirect(`${origin}/integrations?classroom=ok`);
  } catch {
    return Response.redirect(`${origin}/integrations?classroom=error`);
  }
}
