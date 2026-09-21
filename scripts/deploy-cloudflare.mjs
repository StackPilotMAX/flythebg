import { spawn } from "node:child_process";
import { writeFile, unlink } from "node:fs/promises";

const token = process.env.HF_ACCESS_TOKEN;
const secretFile = "/tmp/flythebg-cloudflare-secrets.env";

if (!token) {
  console.error("HF_ACCESS_TOKEN is missing from the Cloudflare Workers Build environment.");
  process.exit(1);
}

try {
  await writeFile(secretFile, `HF_ACCESS_TOKEN=${JSON.stringify(token)}\n`, { mode: 0o600 });

  const command = process.platform === "win32" ? "npx.cmd" : "npx";
  const child = spawn(command, ["wrangler", "deploy", "--secrets-file", secretFile], {
    stdio: "inherit",
    env: process.env
  });

  const exitCode = await new Promise((resolve, reject) => {
    child.on("error", reject);
    child.on("exit", code => resolve(code ?? 1));
  });

  process.exitCode = exitCode;
} finally {
  await unlink(secretFile).catch(() => {});
}
