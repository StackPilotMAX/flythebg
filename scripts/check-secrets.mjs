import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";

const excluded = new Set([".git", "node_modules", "public", ".wrangler", ".venv", "dist", "coverage"]);
const textExtensions = new Set([".js", ".mjs", ".ts", ".tsx", ".json", ".toml", ".yml", ".yaml", ".md", ".html", ".css", ".txt", ".xml", ".py", ".sh"]);
const explicit = new Set([".env.example", ".gitignore"]);
const failures = [];
let checked = 0;
const patterns = [
  { name: "Hugging Face access token", regex: /\bhf_[A-Za-z0-9]{20,}\b/g },
  { name: "GitHub token", regex: /\b(?:ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9]{20,}\b/g },
  { name: "GitHub fine-grained token", regex: /\bgithub_pat_[A-Za-z0-9_]{30,}\b/g },
  { name: "Cloudflare API token assignment", regex: /\bCLOUDFLARE_API_TOKEN\s*[:=]\s*["']?[A-Za-z0-9_-]{35,}/g },
  { name: "Private key block", regex: /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/g }
];
async function walk(dir = ".") {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (excluded.has(entry.name)) continue;
    const path = join(dir, entry.name);
    if (entry.isDirectory()) { await walk(path); continue; }
    if (!entry.isFile() || !(textExtensions.has(entry.name.slice(entry.name.lastIndexOf("."))) || explicit.has(entry.name))) continue;
    const content = await readFile(path, "utf8");
    checked++;
    for (const {name, regex} of patterns) {
      regex.lastIndex = 0;
      for (const match of content.matchAll(regex)) {
        const line = content.slice(0, match.index).split("\n").length;
        failures.push(path + ":" + line + " possible " + name);
      }
    }
  }
}
await walk();
if (failures.length) {
  console.error("Potential secrets detected; no secret values are printed:");
  failures.forEach(f => console.error("::error::" + f));
  process.exitCode = 1;
} else console.log("Current working-tree secret pattern check passed (" + checked + " files). This does NOT scan Git history or prove no secrets were ever exposed.");
