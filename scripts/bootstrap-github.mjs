import { execSync } from "node:child_process";
import {
  cpSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";

const root = process.cwd();

function collectTree(dir, prefix = "") {
  if (!existsSync(dir)) return [];
  const out = [];
  for (const name of readdirSync(dir)) {
    const rel = prefix ? `${prefix}/${name}` : name;
    const full = join(dir, name);
    const stat = statSync(full);
    if (stat.isDirectory()) out.push(...collectTree(full, rel));
    else out.push([rel, readFileSync(full)]);
  }
  return out;
}

const localSrc = collectTree(join(root, "src"), "src");

const staging = join(tmpdir(), `catalyst-ib-${Date.now()}`);
mkdirSync(staging, { recursive: true });

execSync(
  "curl -fsSL https://codeload.github.com/solscooldude/catalyst-ib/tar.gz/refs/heads/main | tar -xz --strip-components=1",
  { cwd: staging, stdio: "inherit" },
);
cpSync(staging, root, { recursive: true });
rmSync(staging, { recursive: true, force: true });

for (const [rel, buf] of localSrc) {
  const dest = join(root, rel);
  mkdirSync(dirname(dest), { recursive: true });
  writeFileSync(dest, buf);
}

rmSync(join(root, "src/lib/focus-plates.ts"), { force: true });
rmSync(join(root, "src/app/api/plates"), { recursive: true, force: true });

const focusScene = join(root, "src/lib/focus-scene.ts");
if (existsSync(focusScene)) {
  const source = readFileSync(focusScene, "utf8");
  writeFileSync(
    focusScene,
    source.replaceAll("/api/plates/", "/focus/"),
  );
}

const chunkBase =
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
const outDir = join(root, "public/focus");
mkdirSync(outDir, { recursive: true });

await Promise.all(
  Object.entries(plates).map(async ([name, count]) => {
    const parts = [];
    for (let i = 0; i < count; i++) {
      const url = `${chunkBase}/${name}.${i}.b64`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
      parts.push((await res.text()).replace(/\s/g, ""));
    }
    const dest = join(outDir, name);
    writeFileSync(dest, Buffer.from(parts.join(""), "base64"));
    console.log("assembled", name);
  }),
);
