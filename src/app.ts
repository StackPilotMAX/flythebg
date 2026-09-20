type ToolId = "remove-bg" | "image-compressor" | "video-compressor";

interface ToolState {
  busy: boolean;
  progress: number;
}

const state: Record<ToolId, ToolState> = {
  "remove-bg": { busy: false, progress: 0 },
  "image-compressor": { busy: false, progress: 0 },
  "video-compressor": { busy: false, progress: 0 }
};

const $ = <T extends Element>(selector: string): T | null =>
  document.querySelector<T>(selector);

function setStatus(tool: ToolId, message: string, progress = 0): void {
  const box = $<HTMLElement>(`[data-status="${tool}"]`);
  if (box) box.textContent = message;
  state[tool].progress = progress;
}

function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

async function removeBackground(file: File): Promise<void> {
  setStatus("remove-bg", "Uploading securely…", 15);
  const response = await fetch("/api/remove-bg", {
    method: "POST",
    headers: { "Content-Type": file.type || "application/octet-stream" },
    body: file
  });
  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(detail || `Background removal failed (${response.status})`);
  }
  setStatus("remove-bg", "Preparing your PNG…", 85);
  const blob = await response.blob();
  downloadBlob(blob, file.name.replace(/\.[^.]+$/, "") + "-no-bg.png");
  setStatus("remove-bg", "Done — PNG downloaded.", 100);
}

async function compressImage(file: File, quality = 0.72): Promise<void> {
  setStatus("image-compressor", "Reading image locally…", 20);
  const bitmap = await createImageBitmap(file);
  const maxSide = 2400;
  const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Your browser cannot create a canvas.");
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  setStatus("image-compressor", "Compressing locally — nothing uploaded.", 65);
  const blob = await new Promise<Blob>((resolve, reject) =>
    canvas.toBlob(
      value => value ? resolve(value) : reject(new Error("Image compression failed.")),
      "image/jpeg",
      quality
    )
  );
  downloadBlob(blob, file.name.replace(/\.[^.]+$/, "") + "-compressed.jpg");
  setStatus("image-compressor", "Done — compressed image downloaded.", 100);
}

async function compressVideo(file: File): Promise<void> {
  if (!("MediaRecorder" in window)) {
    throw new Error("This browser does not expose MediaRecorder. Try the latest Chrome or Edge.");
  }

  setStatus("video-compressor", "Loading video locally…", 10);
  const source = document.createElement("video");
  source.muted = true;
  source.playsInline = true;
  source.src = URL.createObjectURL(file);
  await source.play().catch(() => undefined);

  const canvas = document.createElement("canvas");
  const maxWidth = 1280;
  const scale = Math.min(1, maxWidth / Math.max(1, source.videoWidth || 1280));
  canvas.width = Math.max(2, Math.round((source.videoWidth || 1280) * scale));
  canvas.height = Math.max(2, Math.round((source.videoHeight || 720) * scale));
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Video canvas is unavailable.");

  const stream = canvas.captureStream(30);
  const mime = MediaRecorder.isTypeSupported("video/webm;codecs=vp9")
    ? "video/webm;codecs=vp9"
    : "video/webm";
  const recorder = new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: 2_000_000 });
  const chunks: Blob[] = [];
  recorder.ondataavailable = event => { if (event.data.size) chunks.push(event.data); };

  const done = new Promise<void>((resolve, reject) => {
    recorder.onerror = () => reject(new Error("Video compression failed."));
    recorder.onstop = () => resolve();
  });

  recorder.start(250);
  const duration = Number.isFinite(source.duration) ? source.duration : 0;
  const start = performance.now();

  const draw = (): void => {
    if (source.ended) {
      recorder.stop();
      return;
    }
    ctx.drawImage(source, 0, 0, canvas.width, canvas.height);
    const elapsed = (performance.now() - start) / 1000;
    setStatus("video-compressor", `Compressing locally… ${duration ? Math.min(100, Math.round((elapsed / duration) * 100)) : 0}%`, duration ? Math.min(99, Math.round((elapsed / duration) * 100)) : 40);
    requestAnimationFrame(draw);
  };
  draw();
  await done;
  URL.revokeObjectURL(source.src);
  const blob = new Blob(chunks, { type: "video/webm" });
  downloadBlob(blob, file.name.replace(/\.[^.]+$/, "") + "-compressed.webm");
  setStatus("video-compressor", "Done — compressed video downloaded.", 100);
}

function wireInput(input: HTMLInputElement, tool: ToolId): void {
  input.addEventListener("change", async () => {
    const file = input.files?.[0];
    if (!file || state[tool].busy) return;
    state[tool].busy = true;
    try {
      if (tool === "remove-bg") await removeBackground(file);
      else if (tool === "image-compressor") await compressImage(file);
      else await compressVideo(file);
    } catch (error) {
      setStatus(tool, error instanceof Error ? error.message : "Something went wrong.");
    } finally {
      state[tool].busy = false;
      input.value = "";
    }
  });
}

function init(): void {
  (["remove-bg", "image-compressor", "video-compressor"] as ToolId[]).forEach(tool => {
    const input = $<HTMLInputElement>(`[data-input="${tool}"]`);
    if (input) wireInput(input, tool);
  });

  document.querySelectorAll<HTMLElement>("[data-reveal]").forEach(element => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          element.classList.add("is-visible");
          observer.unobserve(element.target);
        }
      });
    }, { threshold: 0.12 });
    observer.observe(element);
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init, { once: true });
} else {
  init();
}
