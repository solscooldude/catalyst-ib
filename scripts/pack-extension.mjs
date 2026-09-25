import { execSync } from "node:child_process";
import { mkdirSync, existsSync, copyFileSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const publicDir = join(root, "public");
mkdirSync(publicDir, { recursive: true });
const manifest = JSON.parse(
  readFileSync(join(root, "extension/manifest.json"), "utf8"),
);
writeFileSync(
  join(publicDir, "extension-version.json"),
  `${JSON.stringify({ version: manifest.version, name: manifest.name }, null, 2)}\n`,
);
const publicZip = join(publicDir, "catalyst-lock-extension.zip");
const namedZip = join(publicDir, "unzip-then-select-the-extension-folder.zip");
execSync(`zip -r "${publicZip}" extension -x "*.test.mjs" -x "*.DS_Store"`, {
  cwd: root,
  stdio: "inherit",
});
copyFileSync(publicZip, namedZip);
console.log("wrote", publicZip);
console.log("wrote", namedZip);

const artifactDir = existsSync("/opt/cursor/artifacts")
  ? "/opt/cursor/artifacts"
  : join(root, "dist");
mkdirSync(artifactDir, { recursive: true });
const artifactZip = join(artifactDir, "catalyst-lock-extension.zip");
copyFileSync(publicZip, artifactZip);
copyFileSync(
  namedZip,
  join(artifactDir, "unzip-then-select-the-extension-folder.zip"),
);
console.log("wrote", artifactZip);
