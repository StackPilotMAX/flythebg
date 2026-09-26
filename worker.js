import { onRequest } from "../functions/api/remove-bg.js";

const ROUTE_META = {
  "/": { title: "FlyThe BG — Free Background Remover & Media Tools", description: "Remove backgrounds online with protected AI, compress images locally and reduce video size with FlyThe BG." },
  "/features": { title: "Image & Video Tools — FlyThe BG", description: "Explore FlyThe BG tools for background removal, image compression and browser-based video compression." },
  "/remove-bg": { title: "Remove Background Online Free — FlyThe BG", description: "Remove an image background online with FlyThe BG's protected AI route. PNG, JPG and WEBP up to 15 MB." },
  "/image-compressor": { title: "Compress Images Online — JPG & PNG — FlyThe BG", description: "Compress JPG, PNG and WEBP images in your browser without uploading the original file to FlyThe BG." },
  "/video-compressor": { title: "Compress Video Online — WebM — FlyThe BG", description: "Create a smaller WebM video locally in your browser with visible progress. Your original stays on your device." },
  "/about": { title: "About FlyThe BG — Privacy-First Media Tools", description: "Learn how FlyThe BG combines protected AI background removal with local-first image and video tools." },
  "/faq": { title: "FlyThe BG FAQ — Background Removal & Compression", description: "Find clear answers about FlyThe BG uploads, privacy, processing, downloads, mobile use and limits." },
  "/privacy": { title: "Privacy Policy — FlyThe BG", description: "Read how FlyThe BG handles local compression, background-removal requests, providers and result retention." },
  "/terms": { title: "Terms of Use — FlyThe BG", description: "Read the FlyThe BG terms covering tools, downloads, third-party services, availability and user responsibilities." },
  "/contact": { title: "Contact FlyThe BG", description: "Contact FlyThe BG for support, privacy requests, corrections and security reports." },
  "/support": { title: "Support FlyThe BG", description: "Support the FlyThe BG project through GitHub or Buy Me a Coffee. Support is optional." },
  "/blog": { title: "FlyThe BG Journal — Image, Video & Privacy Guides", description: "Practical FlyThe BG guides about background removal, image compression, video compression and privacy." },
  "/blog/remove-background-online-privacy": { title: "Remove Background Online: Privacy Questions to Ask", description: "A practical guide to what happens when you remove an image background online and how to evaluate privacy boundaries." },
  "/blog/compress-images-in-browser": { title: "How to Compress Images in Your Browser", description: "Learn how browser-based image compression works and what changes when the original file stays on your device." },
  "/blog/webm-video-compression-guide": { title: "WebM Video Compression Guide — FlyThe BG", description: "Learn how WebM video compression works in browsers, including codecs, sizing and compatibility." },
  "/code-of-conduct": { title: "Code of Conduct — FlyThe BG", description: "FlyThe BG community standards for respectful, constructive and privacy-conscious participation." },
  "/accessibility": { title: "Accessibility — FlyThe BG", description: "FlyThe BG accessibility information for keyboard, touch, reduced motion and reporting barriers." },
  "/security": { title: "Security — FlyThe BG", description: "FlyThe BG security guidance and private vulnerability reporting information." },
  "/cookies": { title: "Cookies & Similar Technologies — FlyThe BG", description: "Learn about cookies and similar browser or advertising technologies used by FlyThe BG." },
  "/changelog": { title: "Changelog — FlyThe BG", description: "Recent FlyThe BG product, privacy, navigation, accessibility and reliability changes." },
  "/404": { title: "Page Not Found — FlyThe BG", description: "The FlyThe BG page you requested could not be found." }
};
const ROUTES = new Set(Object.keys(ROUTE_META));
function normalizeRoute(pathname) {
  const normalized = pathname.replace(/\/+$/, "") || "/";
  return ROUTES.has(normalized) ? normalized : "/404";
}
const SITE_URL = "https://flythebg.com";
const GITHUB_URL = "https://github.com/StackPilotMAX/flythebg";
const INSTAGRAM_URL = "https://www.instagram.com/flythebg/";
const TOOL_ROUTES = new Set(["/remove-bg","/image-compressor","/video-compressor"]);

function buildBreadcrumb(route, meta, canonical) {
  if (route === "/") return null;
  const items = [{ "@type": "ListItem", position: 1, name: "Home", item: SITE_URL + "/" }];
  if (route.startsWith("/blog/")) {
    items.push({ "@type": "ListItem", position: 2, name: "Blog", item: SITE_URL + "/blog" });
    items.push({ "@type": "ListItem", position: 3, name: meta.title });
  } else if (TOOL_ROUTES.has(route)) {
    items.push({ "@type": "ListItem", position: 2, name: "Tools", item: SITE_URL + "/features" });
    items.push({ "@type": "ListItem", position: 3, name: meta.title });
  } else {
    items.push({ "@type": "ListItem", position: 2, name: meta.title, item: canonical });
  }
  return { "@type": "BreadcrumbList", "@id": canonical + "#breadcrumb", itemListElement: items };
}

function buildStructuredData(route, canonical, meta) {
  const organization = {
    "@type": "Organization",
    "@id": SITE_URL + "/#organization",
    name: "FlyThe BG",
    url: SITE_URL + "/",
    description: "Independent privacy-focused media tools and background-removal project.",
    email: "support@flythebg.com",
    sameAs: [GITHUB_URL, INSTAGRAM_URL]
  };
  const website = {
    "@type": "WebSite",
    "@id": SITE_URL + "/#website",
    name: "FlyThe BG",
    url: SITE_URL + "/",
    description: "Media tools for background removal, image compression and browser-based video compression.",
    inLanguage: "en",
    publisher: { "@id": SITE_URL + "/#organization" }
  };
  const graph = [organization, website];
  const application = {
    "@type": ["SoftwareApplication", "WebApplication"],
    "@id": TOOL_ROUTES.has(route) ? canonical : SITE_URL + "/#application",
    name: TOOL_ROUTES.has(route) ? meta.title.replace(" — FlyThe BG", "") : "FlyThe BG",
    url: canonical,
    description: meta.description,
    applicationCategory: "MultimediaApplication",
    operatingSystem: "Web",
    browserRequirements: "Requires JavaScript and a modern web browser.",
    isAccessibleForFree: true,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    publisher: { "@id": SITE_URL + "/#organization" }
  };

  if (route === "/") {
    graph.push(application);
    return { "@context": "https://schema.org", "@graph": graph };
  }
  if (TOOL_ROUTES.has(route)) graph.push(application);

  const breadcrumb = buildBreadcrumb(route, meta, canonical);
  if (route.startsWith("/blog/")) {
    graph.push({
      "@type": "BlogPosting",
      "@id": canonical + "#article",
      headline: meta.title,
      description: meta.description,
      url: canonical,
      inLanguage: "en",
      mainEntityOfPage: canonical,
      author: { "@id": SITE_URL + "/#organization" },
      publisher: { "@id": SITE_URL + "/#organization" },
      articleSection: "FlyThe BG Journal"
    });
  } else {
    graph.push({
      "@type": "WebPage",
      "@id": canonical + "#webpage",
      name: meta.title,
      description: meta.description,
      url: canonical,
      inLanguage: "en",
      isPartOf: { "@id": SITE_URL + "/#website" },
      publisher: { "@id": SITE_URL + "/#organization" }
    });
  }
  if (breadcrumb) graph.push(breadcrumb);
  return { "@context": "https://schema.org", "@graph": graph };
}

function applyRouteMeta(html, canonical, meta, isMissing) {
  const escapeHtml = value => String(value).replace(/[&<>"]/g, char => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", "\"":"&quot;" }[char]));
  const nonce = crypto.randomUUID().replace(/-/g, "");
  const route = isMissing ? "/404" : normalizeRoute(new URL(canonical).pathname);
  const schema = JSON.stringify(buildStructuredData(route, canonical, meta)).replace(/</g, "\\u003c");
  let output = html;
  output = output.replace(/<title>[^<]*<\/title>/i, "<title>" + escapeHtml(meta.title) + "</title>");
  output = output.replace(/<meta name="description"[^>]*>/i, '<meta name="description" content="' + escapeHtml(meta.description) + '">');
  output = output.replace(/<meta property="og:title"[^>]*>/i, '<meta property="og:title" content="' + escapeHtml(meta.title) + '">');
  output = output.replace(/<meta property="og:description"[^>]*>/i, '<meta property="og:description" content="' + escapeHtml(meta.description) + '">');
  output = output.replace(/<meta name="twitter:title"[^>]*>/i, '<meta name="twitter:title" content="' + escapeHtml(meta.title) + '">');
  output = output.replace(/<meta name="twitter:description"[^>]*>/i, '<meta name="twitter:description" content="' + escapeHtml(meta.description) + '">');
  output = output.replace(/\s*<link rel="canonical"[^>]*>/i, "");
  output = output.replace(/\s*<meta name="csp-nonce"[^>]*>/i, "");
  output = output.replace(/\s*<script type="application\/ld\+json"[^>]*>[^<]*<\/script>/gi, "");
  output = output.replace("</head>", '<meta name="csp-nonce" content="' + nonce + '"><link rel="canonical" href="' + escapeHtml(canonical) + '"><script type="application/ld+json" data-fly-server-schema nonce="' + nonce + '">' + schema + '</script></head>');
  output = output.replace(/<meta name="robots"[^>]*>/i, isMissing ? '<meta name="robots" content="noindex,follow,noarchive">' : '<meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1">');
  return { body: output, status: isMissing ? 404 : 200, nonce };
}

const SECURITY_HEADERS = {
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "no-referrer",
  "X-Frame-Options": "DENY",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  "Cross-Origin-Opener-Policy": "same-origin",
  "Content-Security-Policy": "default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; form-action 'self'; script-src 'self'; style-src 'self'; connect-src 'self' https://api.github.com; img-src 'self' data: blob: https://d2ol7oe51mr4n9d.cloudfront.net; media-src 'self' https://d8j0ntlcm91z4.cloudfront.net https://d2ol7oe51mr4n9d.cloudfront.net; font-src 'self'; worker-src 'self' blob:; manifest-src 'self'"
};

function withSecurityHeaders(response) {
  const headers = new Headers(response.headers);
  for (const [key, value] of Object.entries(SECURITY_HEADERS)) headers.set(key, value);
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/remove-bg") {
      return onRequest({ request, env, params: {}, waitUntil: () => {} });
    }

    if (url.pathname === "/ads.txt") {
      return new Response("google.com, pub-7486274445029717, DIRECT, f08c47fec0942fa0\\n", {
        status: 200,
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "public, max-age=3600"
        }
      });
    }

    const assetResponse = await env.ASSETS.fetch(request);
    const contentType = assetResponse.headers.get("Content-Type") || "";
    if (!contentType.includes("text/html")) return withSecurityHeaders(assetResponse);
    const route = normalizeRoute(url.pathname);
    const meta = ROUTE_META[route] || ROUTE_META["/404"];
    const html = await assetResponse.text();
    const transformed = applyRouteMeta(html, url.origin + route, meta, route === "/404" && !ROUTE_META[url.pathname]);
    const response = new Response(transformed.body, { status: transformed.status, headers: new Headers(assetResponse.headers) });
    response.headers.set("Content-Type","text/html; charset=utf-8");
    response.headers.set("Cache-Control","public, max-age=0, must-revalidate");
    const secured = withSecurityHeaders(response);
    const csp = SECURITY_HEADERS["Content-Security-Policy"].replace("script-src 'self'", "script-src 'self' 'nonce-" + transformed.nonce + "'");
    secured.headers.set("Content-Security-Policy", csp);
    return secured;
  }
};
