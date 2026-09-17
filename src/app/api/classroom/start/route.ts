import { NextRequest } from "next/server";
import {
  classroomCredentials,
  googleAuthUrl,
} from "@/lib/classroom-oauth";

export async function GET(request: NextRequest) {
  if (!classroomCredentials().ready) {
    return Response.redirect(
      new URL("/focus?classroom=needs-credentials", request.nextUrl.origin),
    );
  }
  const state = crypto.randomUUID();
  return Response.redirect(googleAuthUrl(request, state));
}
