type ToolId = "remove-bg" | "image-compressor" | "video-compressor";
type Route = "/" | "/features" | "/about" | "/faq" | "/privacy" | "/terms" | "/contact";

const VIDEO = "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260912_104303_0c6d60b2-9353-408e-9449-585108a22fb5.mp4";
const POSTER = "https://d2ol7oe51mr4n9d.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/130837c4-0244-4f37-9c61-8d801d93fd29.jpg";

const state: Record<ToolId, boolean> = {
  "remove-bg": false,
  "image-compressor": false,
  "video-compressor": false
};

const esc = (value: string): string =>
  value.replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char] || char));

function shell(content: string, title: string): string {
  document.title = title;
  return `
    <div class="notice">Independent project · not currently operated as a registered company or business entity.</div>
    <header class="nav">
      <a class="brand" href="/" aria-label="FlyThe BG home"><span class="brand-mark">F</span><span>FlyThe BG</span></a>
      <nav aria-label="Primary">
        <a href="/features">Tools</a><a href="/about">About</a><a href="/faq">FAQ</a>
        <a href="/contact">Contact</a>
      </nav>
    </header>
    ${content}
    <footer class="footer">
      <div><strong>FlyThe BG</strong><span>Privacy-first media utilities.</span></div>
      <nav aria-label="Footer"><a href="/privacy">Privacy</a><a href="/terms">Terms</a><a href="/contact">Contact</a></nav>
      <small>© 2026 FlyThe BG · AGPL-3.0 · stackpilotfe@outlook.com</small>
    </footer>`;
}

function toolCard(id: ToolId, number: string, title: string, description: string, accept: string, note: string): string {
  return `
  <article class="tool-card reveal">
    <div class="tool-number">${number}</div>
    <h2>${title}</h2>
    <p>${description}</p>
    ${id === "remove-bg" ? `
      <label class="consent"><input type="checkbox" data-consent="remove-bg"> <span>I understand this image will be sent to FlyThe BG's protected processing route and its configured AI processor for the stated purpose.</span></label>
    ` : ""}
    <label class="dropzone" data-dropzone="${id}">
      <input data-input="${id}" type="file" accept="${accept}">
      <span class="drop-icon">↑</span>
      <b>Choose file</b>
      <small>${note}</small>
    </label>
    <p class="status" role="status" aria-live="polite" data-status="${id}">Ready.</p>
  </article>`;
}

function home(): string {
  return shell(`
    <main>
      <section class="hero">
        <video class="hero-video" autoplay muted loop playsinline preload="metadata" poster="${POSTER}" aria-hidden="true"><source src="${VIDEO}" type="video/mp4"></video>
        <div class="hero-shade"></div>
        <div class="hero-copy">
          <p class="eyebrow">PRIVATE-BY-DESIGN MEDIA TOOLS</p>
          <h1>Make the background disappear.</h1>
          <p>Useful image and video tools with less unnecessary data movement. Background removal uses a protected server route; compression stays in your browser.</p>
          <div class="actions"><a class="button primary" href="/features">Get started</a><a class="button ghost" href="#how">How it works</a></div>
        </div>
      </section>
      <section id="how" class="section split">
        <div><p class="eyebrow">01 · ARCHITECTURE</p><h2>Browser first. Server only where needed.</h2></div>
        <div><p>Image and video compression happen locally using browser APIs. Only background removal crosses the network, through a same-origin Cloudflare Function. The Hugging Face credential remains server-side.</p></div>
      </section>
      <section class="section">
        <div class="section-head"><p class="eyebrow">02 · TOOLS</p><h2>Choose your workflow.</h2><a class="text-link" href="/features">All tools →</a></div>
        <div class="grid">
          ${toolCard("remove-bg","01","Background Remover","Remove an image background with the private rembg-powered service.","image/png,image/jpeg,image/webp","PNG · JPG · WEBP · max 15 MB")}
          ${toolCard("image-compressor","02","Image Compressor","Resize and compress an image without uploading the original.","image/*","Local processing · no upload")}
          ${toolCard("video-compressor","03","Video Compressor","Reduce video size locally with browser MediaRecorder support.","video/*","Local processing · WebM output")}
        </div>
      </section>
      <section class="section notice-panel"><strong>Data minimisation is a design goal.</strong><span>No account is required. No advertising tracker or analytics library is bundled into the app.</span></section>
    </main>`, "FlyThe BG — Privacy-first media tools");
}

function features(): string {
  return shell(`
    <main class="page">
      <section class="page-hero"><p class="eyebrow">TOOLS</p><h1>Get started.</h1><p>Pick a tool below. Each workflow states where your file is processed before you submit it.</p></section>
      <section class="grid feature-grid">
        ${toolCard("remove-bg","01","Background Remover","AI-assisted background removal. The image is transmitted to the same-origin server route and then to the configured private processor.","image/png,image/jpeg,image/webp","PNG · JPG · WEBP · max 15 MB")}
        ${toolCard("image-compressor","02","Image Compressor","Canvas-based resizing and JPEG compression run entirely in your browser.","image/*","No server upload")}
        ${toolCard("video-compressor","03","Video Compressor","MediaRecorder-based WebM compression runs locally. Browser support varies by device.","video/*","No server upload")}
      </section>
    </main>`, "Tools — FlyThe BG");
}

function about(): string {
  return shell(`<main class="page prose"><p class="eyebrow">ABOUT</p><h1>A small project with a strict data boundary.</h1><p>FlyThe BG is an independent project. It is intentionally lightweight: Cloudflare Pages serves the UI, TypeScript owns browser interactions, and Python provides local tooling for people who clone the AGPL repository.</p><h2>Why this architecture?</h2><p>Keeping compression in the browser means the original file does not need to reach our infrastructure. Background removal is different because the hosted rembg service requires server-side credentials; that credential is stored only in Cloudflare configuration.</p><h2>Independent project</h2><p>FlyThe BG is currently not operated as a registered company or business entity. The contact address <a href="mailto:stackpilotfe@outlook.com">stackpilotfe@outlook.com</a> is used for project communication.</p></main>`, "About — FlyThe BG");
}

function faq(): string {
  return shell(`<main class="page prose"><p class="eyebrow">FAQ</p><h1>Questions, answered plainly.</h1>
  <details open><summary>Does FlyThe BG upload every file?</summary><p>No. Image and video compression are designed to run in your browser. Background removal is the exception and requires a network request to the protected processing route.</p></details>
  <details><summary>Do you store uploaded images?</summary><p>The FlyThe BG application is designed not to intentionally persist submitted image bytes. The background-removal request is forwarded to the configured private processor; processor-side handling must be governed by that deployment's configuration and policies.</p></details>
  <details><summary>Is the Hugging Face token public?</summary><p>No. It must exist only as a Cloudflare Pages secret. It is never placed in HTML, TypeScript, Python, or public configuration.</p></details>
  <details><summary>Can I exercise privacy rights?</summary><p>Yes. See the Privacy page for access, correction, erasure, grievance and consent information. Requests can be sent to stackpilotfe@outlook.com.</p></details>
  <details><summary>Can I run it locally?</summary><p>Yes. The repository includes Python utilities and a local rembg workflow. A clone does not contain the hosted Hugging Face credential.</p></details>
  </main>`, "FAQ — FlyThe BG");
}

function privacy(): string {
  return shell(`<main class="page prose legal"><p class="eyebrow">PRIVACY</p><h1>Privacy Policy</h1><p class="muted">Effective: 21 September 2026 · India-focused notice</p>
  <p>FlyThe BG is an independent, non-registered project. This policy explains the project's intended handling of digital personal data when you use flythebg.com. It is written with the Digital Personal Data Protection Act, 2023 (DPDP Act) and the notified Digital Personal Data Protection Rules, 2025 in mind. It is not a legal opinion and should be reviewed by qualified counsel before being treated as a formal compliance certification.</p>
  <h2>1. Data we receive</h2><ul><li><strong>Background-removal images:</strong> the image you deliberately select and submit.</li><li><strong>Contact messages:</strong> information you choose to include when you email the project.</li><li><strong>Technical request data:</strong> Cloudflare infrastructure may process normal connection metadata required to deliver and protect the service. The site does not intentionally build an advertising profile from it.</li></ul>
  <h2>2. Purposes</h2><p>Submitted images are processed solely to provide the requested background-removal result. Contact information is used to respond to your message, handle privacy requests, security reports or project communication. Technical data is used for delivery, security, abuse prevention and reliability.</p>
  <h2>3. Notice and consent</h2><p>Before background removal, the interface presents a purpose-specific notice and requires an affirmative checkbox. This is intended to make the processing clear before submission. You are not required to create an account. Compression tools are designed to process files locally and therefore do not require an upload to FlyThe BG.</p>
  <h2>4. Withdrawal and deletion</h2><p>You can stop future image processing simply by not submitting a file. Because the service is designed not to maintain a user image library, there is no account-based image store to delete. If you believe personal data connected with your use remains under FlyThe BG's control, email <a href="mailto:stackpilotfe@outlook.com">stackpilotfe@outlook.com</a> with enough information to identify the request, without sending unnecessary sensitive data.</p>
  <h2>5. Your rights</h2><p>Subject to applicable law and the Act's conditions, you may request information about processing, correction and erasure, withdraw consent where processing is based on consent, and use the grievance route. Requests should be made to the project email above. We may need reasonable information to verify a request before acting.</p>
  <h2>6. Children</h2><p>The DPDP Act treats a person under 18 as a child and the Rules provide special requirements for children's data. FlyThe BG does not intentionally design its tools for children and does not knowingly seek to collect children's personal data. Do not submit a child's personal image unless the applicable lawful requirements and permissions are satisfied.</p>
  <h2>7. Processors and transfers</h2><p>Background removal is sent from the Cloudflare server-side function to the project's configured private Hugging Face Space. Cloudflare and the configured processor therefore act as infrastructure/service providers for the processing flow. The operator should configure these services with appropriate security, retention and contractual controls. Cross-border processing, if any, is handled subject to applicable law and the terms of the configured providers.</p>
  <h2>8. Security</h2><p>The production design uses HTTPS, same-origin API routing, no client-side secret, strict response headers, size/type validation, no-store responses for image results, and a server-side credential boundary. No security measure is perfect; suspected incidents should be reported promptly to the project email.</p>
  <h2>9. Retention</h2><p>FlyThe BG does not intentionally maintain a persistent image repository. Operational providers may retain limited technical records according to their own configurations and policies. The operator should configure processor retention to the minimum needed for the service.</p>
  <h2>10. Changes and complaints</h2><p>This notice may change as the project evolves or legal requirements change. For privacy complaints or requests, contact <a href="mailto:stackpilotfe@outlook.com">stackpilotfe@outlook.com</a>. If a grievance is not resolved through the project contact route, applicable law may provide additional routes to the Data Protection Board of India.</p>
  <h2>11. Contact</h2><p>Privacy contact: <a href="mailto:stackpilotfe@outlook.com">stackpilotfe@outlook.com</a>. This address is used because FlyThe BG is currently an independent, non-registered project.</p>
  </main>`, "Privacy Policy — FlyThe BG");
}

function terms(): string {
  return shell(`<main class="page prose legal"><p class="eyebrow">TERMS</p><h1>Terms of Service</h1><p class="muted">Effective: 21 September 2026</p>
  <p>FlyThe BG is an independent project, not currently operated as a registered company or business entity. These terms describe use of the website and its tools.</p>
  <h2>1. Permitted use</h2><p>Use the tools only for lawful purposes and only with content you are permitted to process. Do not use the service to infringe privacy, copyright, publicity or other rights, or to facilitate fraud, abuse or unlawful activity.</p>
  <h2>2. Your content</h2><p>You retain your rights in files you submit. You are responsible for having the necessary rights and permissions. The service does not transfer ownership of your source content.</p>
  <h2>3. Automated results</h2><p>AI-assisted results can be imperfect. Review outputs before relying on them, especially for identity, legal, commercial, safety or other high-impact uses.</p>
  <h2>4. Availability</h2><p>The project is evolving and may be unavailable, rate-limited or changed without notice. No particular uptime or result accuracy is promised.</p>
  <h2>5. Abuse controls</h2><p>Requests may be rejected or access restricted where necessary to protect the service, infrastructure, users or comply with law.</p>
  <h2>6. Contact</h2><p>Questions: <a href="mailto:stackpilotfe@outlook.com">stackpilotfe@outlook.com</a>.</p>
  <h2>7. Legal review</h2><p>These terms are a project-facing notice, not a substitute for jurisdiction-specific legal advice. Mandatory consumer, privacy and other statutory rights are not intended to be excluded where they cannot lawfully be excluded.</p>
  </main>`, "Terms — FlyThe BG");
}

function contact(): string {
  return shell(`<main class="page prose"><p class="eyebrow">CONTACT</p><h1>Talk to the project.</h1><p>FlyThe BG is currently an independent, non-registered project, so project communication is handled through one dedicated email address.</p><a class="contact-card" href="mailto:stackpilotfe@outlook.com"><span>Email</span><strong>stackpilotfe@outlook.com</strong></a><p class="muted">For privacy requests, deletion/correction requests, security reports or general feedback, include only the information necessary for us to understand the request.</p></main>`, "Contact — FlyThe BG");
}

function normalizePath(): Route {
  const p = window.location.pathname.replace(/\/+$/, "") || "/";
  if (p === "/features" || p === "/features.html") return "/features";
  if (p === "/about" || p === "/about.html") return "/about";
  if (p === "/faq" || p === "/faq.html") return "/faq";
  if (p === "/privacy" || p === "/privacy-policy.html") return "/privacy";
  if (p === "/terms" || p === "/terms-of-service.html") return "/terms";
  if (p === "/contact") return "/contact";
  return "/";
}

function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function status(tool: ToolId, message: string): void {
  const el = document.querySelector<HTMLElement>(`[data-status="${tool}"]`);
  if (el) el.textContent = message;
}

async function removeBackground(file: File): Promise<void> {
  status("remove-bg", "Uploading to the protected processing route…");
  const response = await fetch("/api/remove-bg", { method: "POST", headers: { "Content-Type": file.type }, body: file });
  if (!response.ok) throw new Error((await response.text().catch(() => "")) || `Request failed (${response.status})`);
  const blob = await response.blob();
  downloadBlob(blob, file.name.replace(/\.[^.]+$/, "") + "-no-bg.png");
  status("remove-bg", "Done — PNG downloaded.");
}

async function compressImage(file: File): Promise<void> {
  status("image-compressor", "Processing locally…");
  const bitmap = await createImageBitmap(file);
  const maxSide = 2400;
  const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas is unavailable.");
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  const blob = await new Promise<Blob>((resolve, reject) => canvas.toBlob(v => v ? resolve(v) : reject(new Error("Compression failed.")), "image/jpeg", .72));
  downloadBlob(blob, file.name.replace(/\.[^.]+$/, "") + "-compressed.jpg");
  status("image-compressor", "Done — original stayed in your browser.");
}

async function compressVideo(file: File): Promise<void> {
  if (!("MediaRecorder" in window)) throw new Error("MediaRecorder is unavailable in this browser.");
  status("video-compressor", "Processing locally…");
  const source = document.createElement("video");
  source.muted = true; source.playsInline = true; source.src = URL.createObjectURL(file);
  await new Promise<void>((resolve, reject) => { source.onloadedmetadata = () => resolve(); source.onerror = () => reject(new Error("Video could not be read.")); });
  const canvas = document.createElement("canvas");
  const scale = Math.min(1, 1280 / Math.max(1, source.videoWidth));
  canvas.width = Math.max(2, Math.round(source.videoWidth * scale));
  canvas.height = Math.max(2, Math.round(source.videoHeight * scale));
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Video canvas is unavailable.");
  const stream = canvas.captureStream(30);
  const mime = MediaRecorder.isTypeSupported("video/webm;codecs=vp9") ? "video/webm;codecs=vp9" : "video/webm";
  const recorder = new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: 2000000 });
  const chunks: Blob[] = [];
  recorder.ondataavailable = e => { if (e.data.size) chunks.push(e.data); };
  const done = new Promise<void>((resolve, reject) => { recorder.onstop = () => resolve(); recorder.onerror = () => reject(new Error("Video compression failed.")); });
  recorder.start(250);
  source.currentTime = 0;
  await source.play();
  const draw = () => {
    if (source.ended) { recorder.stop(); return; }
    ctx.drawImage(source, 0, 0, canvas.width, canvas.height);
    if (source.duration) status("video-compressor", `Processing locally… ${Math.min(99, Math.round(source.currentTime / source.duration * 100))}%`);
    requestAnimationFrame(draw);
  };
  draw();
  await done;
  URL.revokeObjectURL(source.src);
  downloadBlob(new Blob(chunks, { type: "video/webm" }), file.name.replace(/\\.[^.]+$/, "") + "-compressed.webm");
  status("video-compressor", "Done — original stayed in your browser.");
}

function wireTools(): void {
  document.querySelectorAll<HTMLInputElement>("[data-input]").forEach(input => {
    input.addEventListener("change", async () => {
      const file = input.files?.[0];
      const tool = input.dataset.input as ToolId | undefined;
      if (!file || !tool || state[tool]) return;
      if (tool === "remove-bg" && !document.querySelector<HTMLInputElement>('[data-consent="remove-bg"]')?.checked) {
        status(tool, "Please confirm the processing notice before uploading.");
        input.value = "";
        return;
      }
      state[tool] = true;
      try {
        if (tool === "remove-bg") await removeBackground(file);
        else if (tool === "image-compressor") await compressImage(file);
        else await compressVideo(file);
      } catch (error) {
        status(tool, error instanceof Error ? error.message : "Something went wrong.");
      } finally {
        state[tool] = false;
        input.value = "";
      }
    });
  });
  document.querySelectorAll<HTMLElement>(".reveal").forEach(el => {
    const observer = new IntersectionObserver(entries => entries.forEach(e => {
      if (e.isIntersecting) { (e.target as HTMLElement).classList.add("visible"); observer.unobserve(e.target); }
    }), { threshold: .1 });
    observer.observe(el);
  });
}

function mount(): void {
  const route = normalizePath();
  const content = route === "/" ? home() : route === "/features" ? features() : route === "/about" ? about() : route === "/faq" ? faq() : route === "/privacy" ? privacy() : route === "/terms" ? terms() : contact();
  const app = document.getElementById("app");
  if (app) app.innerHTML = content;
  wireTools();
}

mount();
