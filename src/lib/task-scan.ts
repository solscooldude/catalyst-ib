import { parseManageBacImport } from "@/lib/managebac";
import {
  inferSubjectId,
  subjectLabel,
  type SchoolTask,
} from "@/lib/school-tasks";

export function extractPdfText(bytes: Uint8Array) {
  const raw = Buffer.from(bytes).toString("latin1");
  const chunks: string[] = [];
  const paren = raw.matchAll(/\(((?:\\.|[^\\)]){3,})\)/g);
  for (const match of paren) {
    chunks.push(match[1].replace(/\\n/g, "\n").replace(/\\(.)/g, "$1"));
  }
  const tj = raw.matchAll(/\[([\s\S]*?)\]\s*TJ/g);
  for (const match of tj) {
    const inner = match[1].matchAll(/\((?:\\.|[^\\)])+\)/g);
    for (const part of inner) {
      chunks.push(part[0].slice(1, -1).replace(/\\n/g, "\n").replace(/\\(.)/g, "$1"));
    }
  }
  return chunks.join("\n");
}

function looseLines(text: string): SchoolTask[] {
  const next: SchoolTask[] = [];
  const seen = new Set<string>();
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.replace(/\s+/g, " ").trim();
    if (trimmed.length < 6 || trimmed.length > 160) continue;
    if (!/[A-Za-z]/.test(trimmed)) continue;
    if (!/\b(due|ia|tok|ee|hl|sl|essay|draft|quiz|lab|problem|homework|assignment)\b/i.test(trimmed)) {
      continue;
    }
    const id = `scan-${trimmed.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 36)}`;
    if (seen.has(id)) continue;
    seen.add(id);
    next.push({
      id,
      title: trimmed.slice(0, 120),
      subject: subjectLabel(inferSubjectId(trimmed)),
      subjectId: inferSubjectId(trimmed),
      due: "Soon",
      detail: "Extracted from an upload.",
      source: "managebac",
      done: false,
    });
  }
  return next.slice(0, 24);
}

export function scanTasksFromText(text: string): SchoolTask[] {
  const imported = parseManageBacImport(text);
  if (imported.length) return imported;
  return looseLines(text);
}

export async function scanTasksWithOpenAi(input: {
  mime: string;
  bytes: Uint8Array;
  name: string;
}): Promise<SchoolTask[] | { reason: string }> {
  const key = process.env.OPENAI_API_KEY?.trim();
  if (!key) return { reason: "needs-ai-key" };
  const data = Buffer.from(input.bytes).toString("base64");
  const isImage = input.mime.startsWith("image/");
  const content: Array<Record<string, unknown>> = [
    {
      type: "text",
      text: "Extract school assignments. Return JSON {\"tasks\":[{\"title\",\"subject\",\"due\",\"detail\"}]}. No scrape. Only tasks you can see.",
    },
  ];
  if (isImage) {
    content.push({
      type: "image_url",
      image_url: { url: `data:${input.mime};base64,${data}` },
    });
  } else {
    content.push({
      type: "text",
      text: extractPdfText(input.bytes).slice(0, 8000) || input.name,
    });
  }
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [{ role: "user", content }],
    }),
  });
  if (!res.ok) {
    return { reason: "AI scan failed. You can still add tasks by hand." };
  }
  const json = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const raw = json.choices?.[0]?.message?.content ?? "{}";
  let parsed: { tasks?: Array<Record<string, string>> };
  try {
    parsed = JSON.parse(raw) as { tasks?: Array<Record<string, string>> };
  } catch {
    return { reason: "AI scan returned unreadable JSON." };
  }
  return (parsed.tasks ?? []).slice(0, 24).map((row, index) => {
    const title = String(row.title ?? "").trim() || `Scanned task ${index + 1}`;
    return {
      id: `scan-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 36) || index}`,
      title: title.slice(0, 120),
      subject: String(row.subject ?? "Other").slice(0, 48),
      subjectId: inferSubjectId(`${row.subject ?? ""} ${title}`),
      due: String(row.due ?? "Soon").slice(0, 32),
      detail: String(row.detail ?? "Extracted from an AI scan.").slice(0, 200),
      source: "managebac" as const,
      done: false,
    };
  });
}
