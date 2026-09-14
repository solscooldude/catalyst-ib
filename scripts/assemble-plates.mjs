import { mkdirSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "public/focus");
const chunkBase =
  process.env.FOCUS_PLATE_CHUNKS_BASE ??
  "https://raw.githubusercontent.com/solscooldude/catalyst-ib/main/public/focus/chunks";

const plates = {
  "cat-afternoon.jpg": 3,
  "cat-night.jpg": 2,
  "cat-sunset.jpg": 3,
  "desk-afternoon.jpg": 4,
  "desk-night.jpg": 2,
  "desk-sunset.jpg": 3,
  "lib-afternoon.jpg": 4,
  "lib-night.jpg": 2,
  "lib-sunset.jpg": 3,
};

async function assemble(name, count) {
  const dest = join(outDir, name);
  if (existsSync(dest) && !process.env.FOCUS_PLATE_FORCE) {
    console.log("keep", name);
    return;
  }
  const parts = [];
  for (let i = 0; i < count; i++) {
    const url = `${chunkBase}/${name}.${i}.b64`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Failed to fetch ${url}: ${res.status}`);
    }
    parts.push((await res.text()).replace(/\s/g, ""));
  }
  mkdirSync(outDir, { recursive: true });
  const buf = Buffer.from(parts.join(""), "base64");
  writeFileSync(dest, buf);
  console.log("assembled", name, buf.length);
}

await Promise.all(
  Object.entries(plates).map(([name, count]) => assemble(name, count)),
);
