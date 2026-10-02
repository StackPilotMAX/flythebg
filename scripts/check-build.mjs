import { access, readFile, stat } from "node:fs/promises";
const required = [
  "public/index.html",
  "public/assets/app.js",
  "public/assets/site.css",
  "public/assets/pill-nav.css",
  "public/assets/pill-nav.js",
  "public/assets/flythebg-home.js",
  "public/assets/flythebg-home.css",
  "public/assets/flythebg-home-fixes.css",
  "public/assets/flythebg-logo.svg",
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
if (!worker.includes('output = output.replace("</head>"')) throw new Error("Server-side canonical injection missing");
if (!app.includes("application/ld+json")) throw new Error("Route structured-data generation missing");
if (!app.includes("BreadcrumbList")) throw new Error("Client BreadcrumbList schema missing");
if (!worker.includes("ROUTE_META") || !worker.includes("applyRouteMeta")) throw new Error("Server-side route SEO metadata missing");
if (!worker.includes("application/ld+json") || !worker.includes("SoftwareApplication") || !worker.includes("Organization")) throw new Error("Server Schema.org graph missing");
if (!worker.includes("return { body: output, status: 200, nonce }")) throw new Error("SPA fallback response contract missing");
if (!worker.includes('return ROUTES.has(normalized) ? normalized : "/";')) throw new Error("Unknown routes must resolve to the FlyThe BG home route");
console.log("FlyThe BG deployment artifact smoke checks passed.");
