/**
 * functions/api/remove-bg.js
 *
 * Cloudflare Pages Function. With this file at functions/api/remove-bg.js,
 * Cloudflare automatically serves it at POST /api/remove-bg — no framework,
 * no build step, no next-on-pages/OpenNext needed, since the rest of the
 * site is plain static HTML.
 *
 * Flow:
 *   1. Browser POSTs multipart/form-data with a "file" field.
 *   2. We validate it, base64-encode it, and call the PRIVATE Hugging Face
 *      Space (running rembg on the Gradio SDK) using env.HF_ACCESS_TOKEN as
 *      a Bearer token.
 *   3. We decode the Space's response back into raw PNG bytes and stream
 *      them straight to the browser. Nothing is written to disk, a
 *      database, or a log anywhere in this function.
 *
 * SECRETS: HF_ACCESS_TOKEN, HF_SPACE_URL, and (optionally) HF_SPACE_API are
 * read from `env`, which Cloudflare Pages injects from the environment
 * variables you set in the dashboard (Settings -> Environment variables).
 * Nothing here is hardcoded — this file is safe to commit publicly.
 */

const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10 MB — keep in sync with the UI copy
const ALLOWED_TYPES = new Set(["image/png", "image/jpeg", "image/webp"]);

export async function onRequestPost(context) {
  const { request, env } = context;

  const HF_ACCESS_TOKEN = env.HF_ACCESS_TOKEN;
  const HF_SPACE_URL = env.HF_SPACE_URL;
  const HF_SPACE_API = env.HF_SPACE_API || "predict"; // "predict" | "queue"

  if (!HF_ACCESS_TOKEN || !HF_SPACE_URL) {
    return jsonError(
      "Server is missing HF_ACCESS_TOKEN or HF_SPACE_URL. Set them in the Cloudflare Pages dashboard under Settings -> Environment variables.",
      500
    );
  }

  let form;
  try {
    form = await request.formData();
  } catch {
    return jsonError("Expected multipart/form-data with a 'file' field.", 400);
  }

  const file = form.get("file");
  if (!file || typeof file.arrayBuffer !== "function") {
    return jsonError("Missing 'file' field.", 400);
  }
  if (!ALLOWED_TYPES.has(file.type)) {
    return jsonError(`Unsupported file type '${file.type}'. Use PNG, JPG, or WEBP.`, 415);
  }
  if (file.size > MAX_FILE_BYTES) {
    return jsonError(`File too large. Max ${MAX_FILE_BYTES / (1024 * 1024)}MB.`, 413);
  }

  const arrayBuffer = await file.arrayBuffer();
  const base64Input = `data:${file.type};base64,${arrayBufferToBase64(arrayBuffer)}`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 60_000); // Spaces can cold-start

  try {
    const resultBase64 =
      HF_SPACE_API === "queue"
        ? await callGradioQueueApi(HF_SPACE_URL, HF_ACCESS_TOKEN, base64Input, controller.signal)
        : await callGradioSyncApi(HF_SPACE_URL, HF_ACCESS_TOKEN, base64Input, controller.signal);

    const pngBytes = base64ToUint8Array(stripDataUrlPrefix(resultBase64));

    return new Response(pngBytes, {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    const message = err?.name === "AbortError" ? "The AI backend timed out. Please try again." : err?.message || "Unknown error.";
    return jsonError(message, 502);
  } finally {
    clearTimeout(timeout);
  }
}

// A GET to this path (e.g. someone visiting it directly) gets a friendly
// response instead of a confusing 405 with no body.
export async function onRequestGet() {
  return jsonError("This endpoint only accepts POST requests with an image file.", 405);
}

// ---------------------------------------------------------------------------
// Gradio API adapters
//
// TODO before going live: open your Space -> "Use via API" panel (bottom of
// the Space page) and confirm the exact input/output shape. Gradio 3.x apps
// commonly expose a synchronous /run/predict; Gradio 4.x/5.x apps commonly
// use an async /call/<api_name> + polling pattern. Both are implemented
// below, selected by the HF_SPACE_API env var ("predict" or "queue").
// ---------------------------------------------------------------------------

async function callGradioSyncApi(spaceUrl, token, base64Input, signal) {
  const res = await fetch(`${spaceUrl.replace(/\/$/, "")}/run/predict`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ data: [base64Input] }),
    signal,
  });

  if (!res.ok) {
    throw new Error(`Hugging Face Space returned ${res.status}: ${await safeText(res)}`);
  }

  const json = await res.json();
  const output = json?.data?.[0];
  if (!output) throw new Error("Unexpected response shape from the Space (no data[0]).");
  return output;
}

async function callGradioQueueApi(spaceUrl, token, base64Input, signal) {
  const base = spaceUrl.replace(/\/$/, "");
  const authHeaders = { Authorization: `Bearer ${token}` };

  const submitRes = await fetch(`${base}/call/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders },
    body: JSON.stringify({ data: [base64Input] }),
    signal,
  });
  if (!submitRes.ok) {
    throw new Error(`Hugging Face Space returned ${submitRes.status}: ${await safeText(submitRes)}`);
  }
  const { event_id } = await submitRes.json();
  if (!event_id) throw new Error("Space did not return an event_id for the queue call.");

  const resultRes = await fetch(`${base}/call/predict/${event_id}`, {
    method: "GET",
    headers: authHeaders,
    signal,
  });
  if (!resultRes.ok) {
    throw new Error(`Hugging Face Space returned ${resultRes.status}: ${await safeText(resultRes)}`);
  }

  const text = await resultRes.text();
  const dataLine = text
    .split("\n")
    .reverse()
    .find((line) => line.startsWith("data:"));
  if (!dataLine) throw new Error("Could not parse the Space's queue response.");

  const parsed = JSON.parse(dataLine.replace(/^data:\s*/, ""));
  const output = Array.isArray(parsed) ? parsed[0] : parsed?.data?.[0];
  if (!output) throw new Error("Unexpected queue response shape (no output image).");
  return output;
}

// ---------------------------------------------------------------------------
// Helpers (Workers-runtime safe — no Node `Buffer`)
// ---------------------------------------------------------------------------

function stripDataUrlPrefix(value) {
  const commaIndex = value.indexOf(",");
  return value.startsWith("data:") && commaIndex !== -1 ? value.slice(commaIndex + 1) : value;
}

function arrayBufferToBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }
  return btoa(binary);
}

function base64ToUint8Array(base64) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function safeText(res) {
  try {
    return await res.text();
  } catch {
    return "<no body>";
  }
}

function jsonError(message, status) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
