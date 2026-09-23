import { execSync } from "node:child_process";
import { mkdirSync, existsSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const outDir = existsSync("/opt/cursor/artifacts")
  ? "/opt/cursor/artifacts"
  : join(root, "dist");
mkdirSync(outDir, { recursive: true });
const zip = join(outDir, "catalyst-lock-extension.zip");
execSync(`zip -r "${zip}" extension -x "*.test.mjs"`, { cwd: root, stdio: "inherit" });
console.log("wrote", zip);
