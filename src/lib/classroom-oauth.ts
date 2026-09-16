import { cookies } from "next/headers";
import type { NextRequest } from "next/server";

export const CLASSROOM_COOKIE = "catalyst-classroom";
const SCOPES = [
  "openid",
  "email",
  "https://www.googleapis.com/auth/classroom.courses.readonly",
  "https://www.googleapis.com/auth/classroom.coursework.me.readonly",
].join(" ");

export function classroomCredentials() {
  const clientId = process.env.GOOGLE_CLIENT_ID?.trim() ?? "";
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim() ?? "";
  return {
    clientId,
    clientSecret,
    ready: Boolean(clientId && clientSecret),
  };
}

export function classroomRedirectUri(request: NextRequest) {
  return (
    process.env.GOOGLE_REDIRECT_URI?.trim() ||
    `${request.nextUrl.origin}/api/classroom/callback`
  );
}

export function googleAuthUrl(request: NextRequest, state: string) {
  const { clientId } = classroomCredentials();
  const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", classroomRedirectUri(request));
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", SCOPES);
  url.searchParams.set("access_type", "offline");
  url.searchParams.set("prompt", "consent");
  url.searchParams.set("include_granted_scopes", "true");
  url.searchParams.set("state", state);
  return url.toString();
}

export type ClassroomToken = {
  accessToken: string;
  email?: string;
};

export async function readClassroomToken(): Promise<ClassroomToken | null> {
  const jar = await cookies();
  const raw = jar.get(CLASSROOM_COOKIE)?.value;
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as ClassroomToken;
    if (!parsed.accessToken) return null;
    return parsed;
  } catch {
    return null;
  }
}

export async function writeClassroomToken(token: ClassroomToken) {
  const jar = await cookies();
  jar.set(CLASSROOM_COOKIE, JSON.stringify(token), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function exchangeClassroomCode(
  request: NextRequest,
  code: string,
) {
  const { clientId, clientSecret } = classroomCredentials();
  const body = new URLSearchParams({
    code,
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: classroomRedirectUri(request),
    grant_type: "authorization_code",
  });
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Google token exchange failed.");
  }
  const json = (await res.json()) as { access_token?: string };
  if (!json.access_token) throw new Error("Google did not return an access token.");
  return json.access_token;
}

export async function fetchClassroomEmail(accessToken: string) {
  const res = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) return "";
  const json = (await res.json()) as { email?: string };
  return json.email ?? "";
}

type Course = { id?: string; name?: string };
type Work = {
  id?: string;
  title?: string;
  description?: string;
  dueDate?: { year?: number; month?: number; day?: number };
};

export async function fetchClassroomWork(accessToken: string) {
  const coursesRes = await fetch(
    "https://classroom.googleapis.com/v1/courses?courseStates=ACTIVE&pageSize=20",
    { headers: { Authorization: `Bearer ${accessToken}` } },
  );
  if (!coursesRes.ok) {
    throw new Error("Classroom courses could not be read.");
  }
  const coursesJson = (await coursesRes.json()) as { courses?: Course[] };
  const courses = coursesJson.courses ?? [];
  const items: {
    id: string;
    title: string;
    description?: string;
    dueDate?: { year: number; month: number; day: number };
    courseName?: string;
  }[] = [];
  for (const course of courses) {
    if (!course.id) continue;
    const workRes = await fetch(
      `https://classroom.googleapis.com/v1/courses/${course.id}/courseWork?pageSize=20`,
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );
    if (!workRes.ok) continue;
    const workJson = (await workRes.json()) as { courseWork?: Work[] };
    for (const work of workJson.courseWork ?? []) {
      if (!work.id || !work.title) continue;
      items.push({
        id: `${course.id}-${work.id}`,
        title: work.title,
        description: work.description,
        dueDate:
          work.dueDate?.year && work.dueDate.month && work.dueDate.day
            ? {
                year: work.dueDate.year,
                month: work.dueDate.month,
                day: work.dueDate.day,
              }
            : undefined,
        courseName: course.name,
      });
    }
  }
  return items;
}
