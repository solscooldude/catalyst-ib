import { NextRequest } from "next/server";
import { parseManageBacImport } from "@/lib/managebac";

export async function POST(request: NextRequest) {
  const json = (await request.json().catch(() => null)) as { url?: string } | null;
  const url = json?.url?.trim() ?? "";
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return Response.json(
      { ok: false, reason: "Use a full https calendar URL.", tasks: [] },
      { status: 400 },
    );
  }
  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
    return Response.json(
      { ok: false, reason: "Only http(s) calendar URLs.", tasks: [] },
      { status: 400 },
    );
  }
  const res = await fetch(parsed.toString(), { redirect: "follow" });
  if (!res.ok) {
    return Response.json(
      { ok: false, reason: "Could not fetch that calendar.", tasks: [] },
      { status: 502 },
    );
  }
  const text = await res.text();
  const tasks = parseManageBacImport(text);
  if (!tasks.length) {
    return Response.json({
      ok: false,
      reason: "That URL did not look like an ICS or task list.",
      tasks: [],
    });
  }
  return Response.json({ ok: true, tasks });
}
