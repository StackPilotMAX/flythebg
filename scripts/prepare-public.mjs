import { cp, mkdir, rm } from "node:fs/promises";

await rm("public", { recursive: true, force: true });
await mkdir("public/assets", { recursive: true });

await cp("index.html", "public/index.html");
await cp("assets/app.js", "public/assets/app.js");
await cp("assets/site.css", "public/assets/site.css");
for (const file of ["robots.txt", "sitemap.xml", "security.txt"]) {
  await cp(file, "public/" + file);
}

console.log("Prepared public/ for Cloudflare Workers Assets deployment.");
