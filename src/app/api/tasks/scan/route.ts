import { NextRequest } from "next/server";
import {
  extractPdfText,
  scanTasksFromText,
  scanTasksWithOpenAi,
} from "@/lib/task-scan";

export async function POST(request: NextRequest) {
  const form = await request.formData();
  const file = form.get("file");
  const pasted = String(form.get("text") ?? "");
  if (typeof file !== "object" || file === null || !("arrayBuffer" in file)) {
    const tasks = scanTasksFromText(pasted);
    if (!tasks.length) {
      return Response.json(
        { ok: false, reason: "Upload a screenshot, PDF, ICS, or paste a task list.", tasks: [] },
        { status: 400 },
      );
    }
    return Response.json({ ok: true, mode: "text", tasks, usedAi: false });
  }
  const blob = file as File;
  const bytes = new Uint8Array(await blob.arrayBuffer());
  const mime = blob.type || "application/octet-stream";
  const name = blob.name || "upload";
  const asText = new TextDecoder("utf-8", { fatal: false }).decode(bytes);
  if (
    mime.includes("text") ||
    mime.includes("csv") ||
    name.endsWith(".ics") ||
    name.endsWith(".txt") ||
    asText.includes("BEGIN:VEVENT") ||
    asText.includes("|")
  ) {
    const tasks = scanTasksFromText(asText);
    if (tasks.length) {
      return Response.json({ ok: true, mode: "text", tasks, usedAi: false });
    }
  }
  if (mime === "application/pdf" || name.endsWith(".pdf")) {
    const pdfText = extractPdfText(bytes);
    const fromPdf = scanTasksFromText(pdfText);
    if (fromPdf.length) {
      return Response.json({ ok: true, mode: "pdf", tasks: fromPdf, usedAi: false });
    }
  }
  const ai = await scanTasksWithOpenAi({ mime, bytes, name });
  if (Array.isArray(ai)) {
    return Response.json({
      ok: ai.length > 0,
      mode: "ai",
      tasks: ai,
      usedAi: true,
      reason: ai.length ? undefined : "The scan found no tasks.",
    });
  }
  return Response.json({
    ok: false,
    mode: "needs-ai-key",
    tasks: [],
    usedAi: false,
    reason:
      ai.reason === "needs-ai-key"
        ? "Screenshot scan needs OPENAI_API_KEY. Upload an ICS, PDF export, or add tasks by hand."
        : ai.reason,
  });
}
