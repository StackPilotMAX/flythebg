const MAX_BYTES = 15 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/png", "image/jpeg", "image/webp"]);
const ORIGIN = "https://flythebg.com";

function headers(extra = {}) {
  return {
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "no-referrer",
    "Access-Control-Allow-Origin": ORIGIN,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    ...extra
  };
}

function json(data, status) {
  return new Response(JSON.stringify(data), {
    status,
    headers: headers({ "Content-Type": "application/json; charset=utf-8" })
  });
}

function fail(message, status = 400) {
  return json({ error: message }, status);
}

async function readSseResult(response) {
  const text = await response.text();
  let result = null;

  for (const event of text.split(/\n\n+/)) {
    const line = event.split(/\n/).find(value => value.startsWith("data:"));
    if (!line) continue;

    const payload = line.slice(5).trim();
    if (!payload || payload === "[DONE]") continue;

    try {
      const parsed = JSON.parse(payload);
      if (parsed?.msg === "process_completed") {
        result = parsed.output?.data ?? parsed.data;
      } else if (parsed?.data) {
        result = parsed.data;
      }
    } catch {
      // Ignore non-JSON SSE frames.
    }
  }

  return result;
}

async function gradioCall(space, token, apiName, input) {
  const base = space.replace(/\/$/, "");
  const name = apiName.replace(/^\//, "");
  const endpoint = `${base}/gradio_api/call/${encodeURIComponent(name)}`;

  const start = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ data: [input] })
  });

  if (!start.ok) {
    throw new Error(`AI processor rejected the request (${start.status}).`);
  }

  const payload = await start.json();
  if (!payload.event_id) return payload.data ?? payload;

  const events = await fetch(`${endpoint}/${encodeURIComponent(payload.event_id)}`, {
    headers: {
      "Accept": "text/event-stream",
      "Authorization": `Bearer ${token}`
    }
  });

  if (!events.ok) {
    throw new Error("AI processor did not return a completed result.");
  }

  return readSseResult(events);
}

function dataUrl(bytes, type) {
  let binary = "";
  for (let i = 0; i < bytes.length; i += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(i, Math.min(i + 0x8000, bytes.length)));
  }
  return `data:${type};base64,${btoa(binary)}`;
}

async function outputResponse(value) {
  if (typeof value === "string" && /^https?:\/\//i.test(value)) {
    const response = await fetch(value);
    if (!response.ok) throw new Error("AI result could not be retrieved.");
    return response;
  }

  if (typeof value === "string" && value.startsWith("data:")) {
    const match = value.match(/^data:([^;]+);base64,(.*)$/s);
    if (!match) throw new Error("Invalid AI result.");

    const bytes = Uint8Array.from(atob(match[2]), char => char.charCodeAt(0));
    return new Response(bytes, {
      headers: { "Content-Type": match[1] || "image/png" }
    });
  }

  if (value && typeof value === "object") {
    if (value.url) return outputResponse(value.url);
    if (value.path && /^https?:\/\//i.test(value.path)) return outputResponse(value.path);
    if (value.data) return outputResponse(value.data);
  }

  throw new Error("AI processor returned an unsupported result format.");
}

export async function onRequest(context) {
  if (context.request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: headers() });
  }

  if (context.request.method !== "POST") {
    return fail("POST one image to this endpoint.", 405);
  }

  const token = context.env.HF_ACCESS_TOKEN;
  const space = context.env.HF_SPACE_URL;
  const apiName = context.env.HF_SPACE_API;

  if (!token || !space || !apiName) {
    return fail("Background removal is not configured.", 503);
  }

  const contentType = (context.request.headers.get("content-type") || "")
    .split(";")[0]
    .toLowerCase();

  if (!ALLOWED_TYPES.has(contentType)) {
    return fail("Only PNG, JPG and WEBP images are accepted.", 415);
  }

  const length = Number(context.request.headers.get("content-length") || "0");
  if (length > MAX_BYTES) {
    return fail("Image exceeds the 15 MB limit.", 413);
  }

  const body = await context.request.arrayBuffer();
  if (!body.byteLength) return fail("No image was received.");
  if (body.byteLength > MAX_BYTES) {
    return fail("Image exceeds the 15 MB limit.", 413);
  }

  try {
    const input = {
      path: "input",
      url: dataUrl(new Uint8Array(body), contentType),
      meta: { _type: "gradio.FileData" }
    };

    const result = await gradioCall(space, token, apiName, input);
    const output = Array.isArray(result) ? result[0] : result;
    const image = await outputResponse(output);

    return new Response(image.body, {
      status: 200,
      headers: headers({
        "Content-Type": "image/png",
        "Content-Disposition": 'attachment; filename="flythebg-no-bg.png"'
      })
    });
  } catch (error) {
    return fail(
      error instanceof Error ? error.message : "Background removal failed.",
      502
    );
  }
}
