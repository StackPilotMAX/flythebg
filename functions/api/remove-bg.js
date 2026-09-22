const MAX_BYTES = 15 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/png", "image/jpeg", "image/webp"]);
const ORIGIN = "https://flythebg.com";
const SPACE_URL = "https://StackPilotMAX-bg-remover-api.hf.space";
const API_NAME = "/remove_background";

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

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

async function wakeSpace(token) {
  // A visitor request to a sleeping Space causes Hugging Face to start it.
  // We authenticate this request because the Space is private.
  const response = await fetch(SPACE_URL, {
    method: "GET",
    headers: { "Authorization": "Bearer " + token }
  });

  return response.status;
}

async function readSseResult(response) {
  const text = await response.text();
  for (const event of text.split(/\n\n+/)) {
    const eventName = event.split(/\n/).find(value => value.startsWith("event:"))?.slice(6).trim();
    const line = event.split(/\n/).find(value => value.startsWith("data:"));
    if (!line) continue;
    const payload = line.slice(5).trim();
    if (!payload || payload === "[DONE]") continue;
    try {
      const parsed = JSON.parse(payload);
      if (eventName === "complete") return parsed?.[0] ?? parsed;
      if (parsed?.msg === "process_completed") return parsed.output?.data?.[0] ?? parsed.output?.data ?? parsed.data?.[0] ?? parsed.data;
      if (eventName === "error" || parsed?.msg === "process_error") throw new Error("The background-removal processor failed.");
    } catch (error) {
      if (error instanceof Error && error.message === "The background-removal processor failed.") throw error;
    }
  }
  throw new Error("The background-removal processor returned no result.");
}

async function uploadFile(token, bytes, type) {
  const form = new FormData();
  form.append("files", new Blob([bytes], { type }), "input");
  const response = await fetch(SPACE_URL.replace(/\/$/, "") + "/gradio_api/upload", {
    method: "POST",
    headers: { "Authorization": "Bearer " + token },
    body: form
  });

  if (!response.ok) {
    throw new Error(
      response.status === 404
        ? "Hugging Face Space is unavailable or the token does not have access (404)."
        : "AI processor rejected the file upload (" + response.status + ")."
    );
  }

  const uploaded = await response.json();
  const path = Array.isArray(uploaded) ? uploaded[0] : uploaded?.path;
  if (!path) throw new Error("AI processor returned no uploaded file path.");
  return path;
}

async function gradioCall(token, input) {
  const endpoint = SPACE_URL.replace(/\/$/, "") + "/gradio_api/call/" + API_NAME.slice(1);
  let lastStatus = 0;

  // A sleeping Space can take time to boot. Start it before uploading.
  await wakeSpace(token).catch(() => {});
  await sleep(1500);

  for (let attempt = 1; attempt <= 5; attempt++) {
    try {
      const filePath = await uploadFile(token, input.bytes, input.type);

      const start = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token
        },
        body: JSON.stringify({
          data: [{
            path: filePath,
            meta: { _type: "gradio.FileData" },
            orig_name: "input"
          }]
        })
      });

      lastStatus = start.status;

      if (start.ok) {
        const payload = await start.json();
        if (!payload?.event_id) return payload?.data?.[0] ?? payload?.data ?? payload;

        const events = await fetch(endpoint + "/" + encodeURIComponent(payload.event_id), {
          headers: {
            "Accept": "text/event-stream",
            "Authorization": "Bearer " + token
          }
        });

        if (!events.ok) throw new Error("AI processor did not return a completed result.");
        return readSseResult(events);
      }
    } catch (error) {
      if (error instanceof Error && !/\\b(404|502|503)\\b/.test(error.message)) throw error;
    }

    if (lastStatus === 404 || lastStatus === 502 || lastStatus === 503 || lastStatus === 0) {
      await wakeSpace(token).catch(() => {});
      await sleep(1800 * attempt);
      continue;
    }

    throw new Error("AI processor rejected the request (" + lastStatus + ").");
  }

  throw new Error("AI processor is unavailable after multiple startup attempts (" + lastStatus + ").");
}
function dataUrl(bytes, type) {
  let binary = "";
  for (let i = 0; i < bytes.length; i += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(i, Math.min(i + 0x8000, bytes.length)));
  }
  return "data:" + type + ";base64," + btoa(binary);
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
    return new Response(bytes, { headers: { "Content-Type": match[1] || "image/png" } });
  }

  if (value && typeof value === "object") {
    if (value.url) return outputResponse(value.url);
    if (value.path && /^https?:\/\//i.test(value.path)) return outputResponse(value.path);
    if (value.data) return outputResponse(value.data);
  }

  throw new Error("AI processor returned an unsupported result format.");
}

export async function onRequest(context) {
  if (context.request.method === "OPTIONS") return new Response(null, { status: 204, headers: headers() });
  if (context.request.method !== "POST") return fail("POST one image to this endpoint.", 405);

  const token = context.env.HF_ACCESS_TOKEN;
  if (!token) return fail("Background removal is not configured.", 503);

  const contentType = (context.request.headers.get("content-type") || "").split(";")[0].toLowerCase();
  if (!ALLOWED_TYPES.has(contentType)) return fail("Only PNG, JPG and WEBP images are accepted.", 415);

  const length = Number(context.request.headers.get("content-length") || "0");
  if (length > MAX_BYTES) return fail("Image exceeds the 15 MB limit.", 413);

  const body = await context.request.arrayBuffer();
  if (!body.byteLength) return fail("No image was received.");
  if (body.byteLength > MAX_BYTES) return fail("Image exceeds the 15 MB limit.", 413);

  try {
    const input = {
      bytes: new Uint8Array(body),
      type: contentType
    };

    const result = await gradioCall(token, input);
    const image = await outputResponse(result);

    return new Response(image.body, {
      status: 200,
      headers: headers({
        "Content-Type": image.headers.get("Content-Type") || "image/png",
        "Content-Disposition": 'attachment; filename="flythebg-no-bg.png"'
      })
    });
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Background removal failed.", 502);
  }
}
