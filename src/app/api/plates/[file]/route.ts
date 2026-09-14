import { NextResponse } from "next/server";
import { FOCUS_PLATE_B64, FOCUS_PLATE_FILES } from "@/lib/focus-plates";

export function generateStaticParams() {
  return FOCUS_PLATE_FILES.map((file) => ({ file: `${file}.jpg` }));
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ file: string }> },
) {
  const { file } = await context.params;
  const key = file.replace(/\.jpg$/i, "");
  const b64 = FOCUS_PLATE_B64[key];
  if (!b64) {
    return new NextResponse("Not found", { status: 404 });
  }
  return new NextResponse(Buffer.from(b64, "base64"), {
    headers: {
      "Content-Type": "image/jpeg",
      "Cache-Control": "public, max-age=86400, immutable",
    },
  });
}
