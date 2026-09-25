import { spawn } from "node:child_process";

// Never inject runtime secrets during builds or write them to temporary files.
// Set HF_ACCESS_TOKEN as a Cloudflare Worker runtime secret in the dashboard
// or with `wrangler secret put HF_ACCESS_TOKEN` in a trusted terminal.
const command = process.platform === "win32" ? "npx.cmd" : "npx";
const child = spawn(command, ["--yes", "wrangler", "deploy"], {
  stdio: "inherit",
  env: process.env
});
child.on("error", error => {
  console.error("Unable to launch Wrangler:", error.message);
  process.exitCode = 1;
});
child.on("exit", code => {
  process.exitCode = code ?? 1;
});
