import { onRequest } from "../functions/api/remove-bg.js";

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

    return withSecurityHeaders(await env.ASSETS.fetch(request));
  }
};
