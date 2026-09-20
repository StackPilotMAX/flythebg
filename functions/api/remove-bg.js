const json = (data, status = 200) => new Response(JSON.stringify(data), {
  status,
  headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" }
});

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "https://flythebg.com",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400"
  };
}

function withCors(response) {
  const headers = new Headers(response.headers);
  for (const [key, value] of Object.entries(corsHeaders())) headers.set(key, value);
  return new Response(response.body, { status: response.status, headers });
}

function error(message, status = 400) {
  return withCors(json({ error: message }, status));
}

function dataUrlFromBytes(bytes, contentType) {
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, Math.min(i + chunk, bytes.length)));
  }
  return `data:${contentType};base64,${btoa(binary)}`;
}

async function readSseResult(response) {
  const text = await response.text();
  const events = text.split(/\n\n+/);
  let result = null;
  for (const event of events) {
    const line = event.split("\n").find(value => value.startsWith("data:"));
    if (!line) continue;
    const payload = line.slice(5).trim();
    if (!payload || payload === "[DONE]") continue;
    try {
      const parsed = JSON.parse(payload);
      if (parsed?.msg === "process_completed") result = parsed.output?.data ?? parsed.data;
      else if (parsed?.data) result = parsed.data;
    } catch {}
  }
  return result;
}

async function fetchOutput(value, fallbackType = "image/png") {
  if (typeof value === "string" && /^https?:\/\//i.test(value)) {
    const response = await fetch(value);
    if (!response.ok) throw new Error("The AI service returned an unreadable result.");
    return response;
  }
  if (typeof value === "string" && value.startsWith("data:")) {
    const match = value.match(/^data:([^;]+);base64,(.*)$/s);
    if (!match) throw new Error("The AI service returned an invalid image.");
    const binary = Uint8Array.from(atob(match[2]), c => c.charCodeAt(0));
    return new Response(binary, { headers: { "Content-Type": match[1] || fallbackType } });
  }
  if (value && typeof value === "object") {
    if (typeof value.url === "string") return fetchOutput(value.url, fallbackType);
    if (typeof value.path === "string" && /^https?:\/\//i.test(value.path)) return fetchOutput(value.path, fallbackType);
    if (typeof value.data === "string") return fetchOutput(value.data, fallbackType);
  }
  throw new Error("The AI service returned an unsupported output format.");
}

async function gradioCall(space, apiName, input) {
  const endpoint = `${space.replace(/\/$/, "")}/gradio_api/call/${encodeURIComponent(apiName.replace(/^\//, ""))}`;
  const start = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${space.__token || ""}` },
    body: JSON.stringify({ data: [input] })
  });
  if (!start.ok) throw new Error(`Hugging Face Space request failed (${start.status}).`);
  const payload = await start.json();
  if (!payload.event_id) return payload.data ?? payload;
  const events = await fetch(`${endpoint}/${encodeURIComponent(payload.event_id)}`, {
    headers: { "Accept": "text/event-stream" }
  });
  if (!events.ok) throw new Error("The Hugging Face Space did not return a completed result.");
  return readSseResult(events);
}

export async function onRequest(context) {
  if (context.request.method === "OPTIONS") return withCors(new Response(null, { status: 204 }));
  if (context.request.method !== "POST") return error("POST an image to this endpoint.", 405);

  const token = context.env.HF_ACCESS_TOKEN;
  const spaceUrl = context.env.HF_SPACE_URL;
  const apiName = context.env.HF_SPACE_API || "predict";

  if (!token || !spaceUrl) return error("Background removal is not configured on the server.", 503);

  const contentType = context.request.headers.get("content-type") || "";
  if (!/^image\/(png|jpeg|webp)$/i.test(contentType)) return error("Only PNG, JPG, and WEBP images are accepted.", 415);

  const body = await context.request.arrayBuffer();
  if (!body.byteLength) return error("No image was received.");
  if (body.byteLength > 15 * 1024 * 1024) return error("Image is too large. Maximum size is 15 MB.", 413);

  const bytes = new Uint8Array(body);
  const input = {
    path: "input",
    url: dataUrlFromBytes(bytes, contentType),
    meta: { _type: "gradio.FileData" }
  };

  try {
    // The token exists only inside this server-side function and is never
    // returned to the browser.
    const space = new String(spaceUrl);
    space.__token = token;
    const result = await gradioCall(space, apiName, input);
    const output = Array.isArray(result) ? result[0] : result;
    const image = await fetchOutput(output);
    const headers = new Headers(image.headers);
    headers.set("Content-Type", "image/png");
    headers.set("Content-Disposition", 'attachment; filename="flythebg-no-bg.png"');
    headers.set("Cache-Control", "no-store");
    return withCors(new Response(image.body, { status: 200, headers }));
  } catch (err) {
    return error(err instanceof Error ? err.message : "Background removal failed.", 502);
  }
}
