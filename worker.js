import { onRequest } from "../functions/api/remove-bg.js";

const ROUTE_META = {
  "/": { title: "FlyThe BG — Free Background Remover & Media Tools Online", description: "Remove backgrounds online with protected AI, compress images locally, and reduce video size with free browser-based media tools from FlyThe BG." },
  "/features": { title: "Image & Video Tools — Background Remover | FlyThe BG", description: "Explore background removal, image compression, and video compression tools from FlyThe BG, with clear privacy and browser-processing boundaries." },
  "/remove-bg": { title: "Remove Background Online Free — PNG & JPG | FlyThe BG", description: "Remove image backgrounds online with protected AI. Process PNG, JPG, and WEBP images up to 15 MB and download a transparent result." },
  "/image-compressor": { title: "Compress Images Online — JPG, PNG & WEBP | FlyThe BG", description: "Compress JPG, PNG, and WEBP images in your browser to reduce file size without uploading the original image to FlyThe BG." },
  "/video-compressor": { title: "Compress Video Online — WebM Video Compressor | FlyThe BG", description: "Compress video online in your browser and create a smaller WebM file with visible progress while your original video stays on your device." },
  "/about": { title: "About FlyThe BG — Privacy-First Image & Video Tools", description: "Learn how FlyThe BG combines protected AI background removal with local-first image and video tools and clear processing boundaries." },
  "/faq": { title: "FlyThe BG FAQ — Background Removal & Compression Guide", description: "Get answers about background removal, local image compression, video compression, file limits, downloads, privacy, and mobile use on FlyThe BG." },
  "/privacy": { title: "Privacy Policy — FlyThe BG — Media Tools Online", description: "Read the FlyThe BG privacy policy covering local compression, background-removal requests, providers, processing, retention, and user rights." },
  "/terms": { title: "Terms of Use — FlyThe BG — Online Media Tools", description: "Read the FlyThe BG terms covering tool use, downloads, third-party services, availability, acceptable use, and user responsibilities." },
  "/contact": { title: "Contact FlyThe BG — Support & Privacy Requests", description: "Contact FlyThe BG for product support, privacy requests, corrections, accessibility problems, or security reports related to the website." },
  "/support": { title: "Support FlyThe BG — Keep the Project Running", description: "Support the independent FlyThe BG project through GitHub or Buy Me a Coffee. Supporting the project is optional and does not unlock features." },
  "/blog": { title: "FlyThe BG Journal — Image, Video & Privacy Guides", description: "Read practical guides about background removal, image compression, WebM video compression, browser processing, privacy, and media workflows." },
  "/blog/remove-background-online-privacy": { title: "Remove Background Online: Privacy Guide | FlyThe BG", description: "Learn what happens when you remove an image background online, what data may leave your device, and which privacy questions to ask." },
  "/blog/compress-images-in-browser": { title: "How to Compress Images in Your Browser | FlyThe BG", description: "Learn how browser-based image compression works, how file size changes, and why keeping the original image on your device matters." },
  "/blog/webm-video-compression-guide": { title: "WebM Video Compression Guide — Codecs & Size | FlyThe BG", description: "Learn how WebM video compression works in browsers, how codecs affect size and quality, and what to check for compatibility." },
  "/code-of-conduct": { title: "Code of Conduct — FlyThe BG Community", description: "Read the FlyThe BG community standards for respectful, constructive, inclusive, and privacy-conscious participation across the project." },
  "/accessibility": { title: "Accessibility — FlyThe BG Website & Tools", description: "Read how FlyThe BG approaches keyboard access, touch controls, reduced motion, readable content, and reporting accessibility barriers." },
  "/security": { title: "Security at FlyThe BG — Vulnerability Reporting", description: "Learn how FlyThe BG protects its media tools and how to report a security vulnerability or privacy-sensitive problem." },
  "/cookies": { title: "Cookies & Similar Technologies — FlyThe BG", description: "Read about cookies and similar browser or advertising technologies that may be used by FlyThe BG and its service providers." },
  "/changelog": { title: "FlyThe BG Changelog — Product & Privacy Updates", description: "See recent FlyThe BG changes across media tools, privacy, navigation, accessibility, performance, reliability, and SEO updates over time." },
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


function buildSeoFallback(route, meta, canonical) {
  const link = (href, label) => '<a href="' + href + '">' + label + "</a>";
  const common = [
    '<p>FlyThe BG is an independent web project for practical media processing. It combines protected AI background removal with browser-local image and video compression, so each tool can make its processing boundary clear before you start.</p>',
    '<p>For privacy details, see ' + link("/privacy", "the FlyThe BG Privacy Policy") + '. For answers about files, limits, mobile use, and downloads, visit ' + link("/faq", "the FAQ") + '.</p>'
  ];
  let sections = "";
  if (route === "/") {
    sections = '<h2>Free background removal and media tools</h2><p>Remove a background from a PNG, JPG, or WEBP image through the protected FlyThe BG AI route. Image compression and video compression are designed to run locally in your browser, keeping the original file on your device during those workflows.</p><h2>Choose the right tool</h2><p>' + link("/remove-bg", "Remove background online") + ' for AI background removal, ' + link("/image-compressor", "compress images online") + ' for browser-local JPEG compression, or ' + link("/video-compressor", "compress video online") + ' to create a smaller WebM file locally.</p><h2>Clear privacy boundaries</h2><p>No FlyThe BG account is required. The background-removal request is sent only when you select a supported image, accept the processing notice, and start the tool. Local compression does not upload the original media to FlyThe BG.</p><h2>Guides and answers</h2><p>Read the ' + link("/blog", "FlyThe BG Journal") + ' for practical media and privacy guides, or visit ' + link("/features", "all FlyThe BG tools") + ' to compare the available workflows.</p>';
  } else if (route === "/remove-bg") {
    sections = '<h2>Remove an image background online</h2><p>FlyThe BG removes backgrounds from supported PNG, JPG, and WEBP images through a protected AI processing route. Files up to 15 MB are accepted, and the result can be previewed and downloaded after processing.</p><h2>How background removal works</h2><p>Select one image, confirm the processing notice, and start the tool. The browser sends the selected image to the same-origin processing route; the Hugging Face credential stays server-side.</p><h2>Privacy before processing</h2><p>FlyThe BG does not provide an account gallery or persistent media library. Read the ' + link("/privacy", "privacy policy") + ' before using the tool if your image contains sensitive information.</p>';
  } else if (route === "/image-compressor") {
    sections = '<h2>Compress images in your browser</h2><p>FlyThe BG can resize and compress supported images locally in your browser. The original image stays on your device during the compression workflow, so no upload is required for this tool.</p><h2>Supported image workflow</h2><p>Select a PNG, JPG, WEBP, or compatible image and start the compressor. The tool creates a smaller JPEG version that you can download when processing finishes.</p><h2>Local-first processing</h2><p>Browser-local compression is useful when you want a smaller file for websites, messages, documents, or uploads without first sending the original image to FlyThe BG.</p>';
  } else if (route === "/video-compressor") {
    sections = '<h2>Compress video online in your browser</h2><p>FlyThe BG creates a smaller WebM video locally in a modern browser. Progress is shown while the video is resized and encoded, and the original file remains on your device.</p><h2>WebM video compression</h2><p>The browser uses its available media APIs to process video and produce a WebM output. File size and visual quality depend on the source video, dimensions, codec support, and browser.</p><h2>Keep the original on your device</h2><p>This tool is designed for local processing, so the original video is not uploaded to FlyThe BG as part of the compression workflow.</p>';
  } else if (route === "/blog") {
    sections = '<h2>Practical media guides</h2><p>The FlyThe BG Journal explains background removal privacy, browser-based image compression, WebM video compression, and practical questions about local media processing.</p><h2>Start with a guide</h2><p>Read the ' + link("/blog/remove-background-online-privacy", "background removal privacy guide") + ', the ' + link("/blog/compress-images-in-browser", "browser image compression guide") + ', or the ' + link("/blog/webm-video-compression-guide", "WebM video compression guide") + '.</p>';
  } else if (route.startsWith("/blog/")) {
    sections = '<h2>About this guide</h2><p>' + meta.description + '</p><h2>Explore FlyThe BG tools</h2><p>Compare ' + link("/remove-bg", "background removal") + ', ' + link("/image-compressor", "image compression") + ', and ' + link("/video-compressor", "video compression") + ' to see which workflow matches your file and privacy needs.</p>';
  } else {
    sections = '<h2>About this FlyThe BG page</h2><p>' + meta.description + '</p><h2>Explore the media toolkit</h2><p>Visit ' + link("/features", "FlyThe BG tools") + ' or read the ' + link("/faq", "FAQ") + ' for practical information. The site also publishes ' + link("/blog", "media and privacy guides") + ' to explain how the workflows operate.</p>';
  }
  return '<main class="seo-fallback" aria-label="FlyThe BG page content"><p class="eyebrow">FLYTHE BG</p><h1>' + meta.title + '</h1>' + sections + common.join("") + '<p><a href="' + canonical + '">Canonical page: ' + meta.title + "</a></p></main>";
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
  output = output.replace(/<div id="app">[\s\S]*?<\/div>/i, '<div id="app">' + buildSeoFallback(route, meta, canonical) + "</div>");
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
