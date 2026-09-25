const MAX_BYTES = 15 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/png", "image/jpeg", "image/webp"]);
const ORIGIN = "https://flythebg.com";
const SPACE_URL = "https://StackPilotMAX-bg-remover-api.hf.space";
const API_NAME = "/remove_background";
const STARTUP_GRACE_MS = 90_000;
const MAX_JOB_MS = 180_000;
const RETRY_DELAY_MS = 4_000;

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
  // Keep wake-up entirely server-side. A browser tab must never be needed.
  const auth = { "Authorization": "Bearer " + token, "Cache-Control": "no-cache" };
  const checks = [SPACE_URL, SPACE_URL + "/gradio_api/info"];
  let lastStatus = 0;
  for (const url of checks) {
    try {
      const response = await fetch(url, { method: "GET", headers: auth, cache: "no-store" });
      lastStatus = response.status;
      if (response.ok || response.status === 401 || response.status === 403) return response.status;
    } catch {}
  }
  return lastStatus;
}

async function readSseResult(response) {
  // Gradio returns Server-Sent Events, sometimes with CRLF and multiple data lines.
  // Read the stream incrementally so a queued job does not require buffering all events.
  if (!response.body) throw new Error("AI processor returned an empty event stream.");
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let lastOutput;
  const deadline = Date.now() + MAX_JOB_MS;

  function parseEvent(block) {
    let name = "";
    const data = [];
    for (const line of block.split(/\n/)) {
      if (line.startsWith("event:")) name = line.slice(6).trim();
      if (line.startsWith("data:")) data.push(line.slice(5).trimStart());
    }
    if (!data.length) return;
    const raw = data.join("\n");
    if (!raw || raw === "[DONE]") return;
    let payload;
    try { payload = JSON.parse(raw); } catch { return; }
    if (name === "error" || payload?.msg === "process_error")
      throw new Error("The background-removal processor failed.");
    if (name === "complete" || payload?.msg === "process_completed")
      return { done: true, value: payload?.output?.data?.[0] ?? payload?.data?.[0] ?? (Array.isArray(payload) ? payload[0] : payload) };
    if (name === "generating" && payload != null) lastOutput = Array.isArray(payload) ? payload[0] : payload;
  }

  try {
    while (Date.now() < deadline) {
      const { value, done } = await reader.read();
      buffer += decoder.decode(value || new Uint8Array(), { stream: !done }).replace(/\r\n/g, "\n");
      let boundary;
      while ((boundary = buffer.indexOf("\n\n")) !== -1) {
        const block = buffer.slice(0, boundary);
        buffer = buffer.slice(boundary + 2);
        const result = parseEvent(block);
        if (result?.done) return result.value;
      }
      if (done) {
        const result = parseEvent(buffer);
        if (result?.done) return result.value;
        break;
      }
    }
  } finally {
    await reader.cancel().catch(() => {});
  }
  if (lastOutput != null) return lastOutput;
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
  const startedAt = Date.now();
  let lastStatus = 0;
  let lastError = "";

  // A sleeping Space can take 20–25 seconds to boot and initialize rembg.
  // Retry the complete upload/prediction sequence from the Worker so the
  // browser never has to open or keep the Hugging Face Space alive.
  while (Date.now() - startedAt < STARTUP_GRACE_MS) {
    const wakeStatus = await wakeSpace(token);
    if (wakeStatus === 401 || wakeStatus === 403) {
      throw new Error("Hugging Face rejected the server-side access token (" + wakeStatus + ").");
    }

    try {
      const filePath = await uploadFile(token, input.bytes, input.type);
      const startResponse = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token,
          "Cache-Control": "no-cache"
        },
        body: JSON.stringify({
          data: [{
            path: filePath,
            meta: { _type: "gradio.FileData" },
            orig_name: "input"
          }]
        })
      });

      lastStatus = startResponse.status;
      if (startResponse.ok) {
        const payload = await startResponse.json();
        if (!payload?.event_id) return payload?.data?.[0] ?? payload?.data ?? payload;

        const events = await fetch(
          endpoint + "/" + encodeURIComponent(payload.event_id),
          {
            headers: {
              "Accept": "text/event-stream",
              "Authorization": "Bearer " + token,
              "Cache-Control": "no-cache"
            }
          }
        );
        if (!events.ok) {
          lastStatus = events.status;
          lastError = "AI processor did not return the event stream (" + events.status + ").";
        } else {
          return readSseResult(events);
        }
      } else {
        lastError = "Gradio request returned HTTP " + startResponse.status + ".";
      }
    } catch (error) {
      lastError = error instanceof Error ? error.message : String(error);
      if (/server-side access token/i.test(lastError)) throw new Error(lastError);
    }

    if (lastStatus === 404 || lastStatus === 408 || lastStatus === 429 ||
        lastStatus === 502 || lastStatus === 503 || lastStatus === 504 || lastStatus === 0 ||
        (lastStatus >= 500 && lastStatus < 600)) {
      const remaining = STARTUP_GRACE_MS - (Date.now() - startedAt);
      if (remaining <= 0) break;
      await sleep(Math.min(RETRY_DELAY_MS, remaining));
      continue;
    }

    throw new Error(lastError || "AI processor rejected the request (" + lastStatus + ").");
  }

  throw new Error(
    "The Hugging Face background-removal Space is still starting after " +
    Math.round(STARTUP_GRACE_MS / 1000) +
    " seconds. Please try again in a moment."
  );
}

function dataUrl(bytes, type) {
  let binary = "";
  for (let i = 0; i < bytes.length; i += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(i, Math.min(i + 0x8000, bytes.length)));
  }
  return "data:" + type + ";base64," + btoa(binary);
}

async function outputResponse(value, token) {
  if (typeof value === "string" && /^https?:\/\//i.test(value)) {
    const url = new URL(value);
    if (url.protocol !== "https:" || !url.hostname.endsWith(".hf.space")) throw new Error("AI result URL is not a Hugging Face Space.");
    const response = await fetch(url, { headers: { Authorization: "Bearer " + token } });
    if (!response.ok) throw new Error("AI result could not be retrieved.");
    return response;
  }

  if (typeof value === "string" && value.startsWith("/")) return outputResponse(SPACE_URL + "/gradio_api/file=" + encodeURIComponent(value), token);

  if (typeof value === "string" && value.startsWith("data:")) {
    const match = value.match(/^data:([^;]+);base64,(.*)$/s);
    if (!match) throw new Error("Invalid AI result.");
    const bytes = Uint8Array.from(atob(match[2]), char => char.charCodeAt(0));
    return new Response(bytes, { headers: { "Content-Type": match[1] || "image/png" } });
  }

  if (value && typeof value === "object") {
    if (value.url) return outputResponse(value.url, token);
    if (value.path && /^https?:\/\//i.test(value.path)) return outputResponse(value.path, token);
    if (value.data) return outputResponse(value.data, token);
    if (value.path && typeof value.path === "string" && value.path.startsWith("/")) return outputResponse(SPACE_URL + "/gradio_api/file=" + encodeURIComponent(value.path), token);
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
    const image = await outputResponse(result, token);

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
