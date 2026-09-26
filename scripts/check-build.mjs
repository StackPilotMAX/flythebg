import { access, readFile, stat } from "node:fs/promises";
const required = [
  "public/index.html",
  "public/assets/app.js",
  "public/assets/site.css",
  "public/assets/pill-nav.css",
  "public/assets/pill-nav.js",
  "public/worker.js",
  "public/functions/api/remove-bg.js",
  "public/robots.txt",
  "public/sitemap.xml",
  "public/security.txt"
];
for (const file of required) {
  await access(file);
  if ((await stat(file)).size === 0) throw new Error("Empty deployment artifact: " + file);
}
const [worker, app, html] = await Promise.all([
  readFile("public/worker.js", "utf8"),
  readFile("public/assets/app.js", "utf8"),
  readFile("public/index.html", "utf8")
]);
if (!worker.includes("/api/remove-bg")) throw new Error("Worker API route missing");
if (!app.includes("FlyThe BG")) throw new Error("Compiled app branding missing");
if (!html.includes("assets/app.js")) throw new Error("HTML shell app entry missing");
if (html.includes('rel="canonical" href="https://flythebg.com/"')) throw new Error("Static root canonical must not be shared by every SPA route");
if (!app.includes("application/ld+json")) throw new Error("Route structured-data generation missing");
if (!app.includes("BreadcrumbList")) throw new Error("Client BreadcrumbList schema missing");
if (!worker.includes("ROUTE_META") || !worker.includes("applyRouteMeta")) throw new Error("Server-side route SEO metadata missing");
if (!worker.includes("application/ld+json") || !worker.includes("SoftwareApplication") || !worker.includes("Organization")) throw new Error("Server Schema.org graph missing");
if (!worker.includes("status: isMissing ? 404 : 200")) throw new Error("Unknown routes must return HTTP 404");
console.log("FlyThe BG deployment artifact smoke checks passed.");
