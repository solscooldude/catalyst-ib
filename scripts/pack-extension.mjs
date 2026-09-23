import { execSync } from "node:child_process";
import { mkdirSync, existsSync, copyFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const publicDir = join(root, "public");
mkdirSync(publicDir, { recursive: true });
const publicZip = join(publicDir, "catalyst-lock-extension.zip");
execSync(`zip -r "${publicZip}" extension -x "*.test.mjs" -x "*.DS_Store"`, {
  cwd: root,
  stdio: "inherit",
});
console.log("wrote", publicZip);

const artifactDir = existsSync("/opt/cursor/artifacts")
  ? "/opt/cursor/artifacts"
  : join(root, "dist");
mkdirSync(artifactDir, { recursive: true });
const artifactZip = join(artifactDir, "catalyst-lock-extension.zip");
copyFileSync(publicZip, artifactZip);
console.log("wrote", artifactZip);
