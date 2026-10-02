import { cp, mkdir, rm } from "node:fs/promises";

await rm("public", { recursive: true, force: true });
await mkdir("public/assets", { recursive: true });
await mkdir("public/functions/api", { recursive: true });

await cp("index.html", "public/index.html");
await cp("assets/app.js", "public/assets/app.js");
await cp("assets/flythebg-logo.png", "public/assets/flythebg-logo.png");
await cp("assets/flythebg-logo.svg", "public/assets/flythebg-logo.svg");
await cp("assets/flythebg-icon.png", "public/assets/flythebg-icon.png");
await cp("assets/site.css", "public/assets/site.css");
await cp("assets/pill-nav.css", "public/assets/pill-nav.css");
await cp("assets/pill-nav.js", "public/assets/pill-nav.js");
await cp("assets/flythebg-home.css", "public/assets/flythebg-home.css");
await cp("assets/flythebg-home-fixes.css", "public/assets/flythebg-home-fixes.css");
await cp("assets/flythebg-home.js", "public/assets/flythebg-home.js");
await cp("worker.js", "public/worker.js");
await cp("functions/api/remove-bg.js", "public/functions/api/remove-bg.js");

for (const file of ["robots.txt", "sitemap.xml", "security.txt", "ads.txt"]) {
  await cp(file, "public/" + file);
}

console.log("Prepared public/ for Cloudflare Workers deployment.");
