(() => {
  function mount() {
    if (location.pathname !== "/" && location.pathname !== "") return;
    const app = document.getElementById("app");
    if (!app || app.dataset.fbHomeMounted === "true") return;
    app.dataset.fbHomeMounted = "true";
    app.innerHTML = `
      <main class="fb-home fb-intro" aria-label="FlyThe BG home">
        <video class="fb-home-video" aria-hidden="true" autoplay muted loop playsinline preload="auto"
          poster="https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/0bf7409c-9fa2-4bef-a49d-34903dcc91ad.png"
          src="https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/4b73c700-3112-4c07-bd48-0af2893dff7c.mp4"></video>
        <div class="fb-home-veil"></div>
        <div class="fb-home-frame">
          <header class="fb-home-header">
            <a class="fb-brand" href="/" aria-label="FlyThe BG home"><span class="fb-brand-mark">F</span><span>FlyThe BG</span></a>
            <nav class="fb-home-nav" aria-label="Primary">
              <a href="/features">Tools</a><a href="/remove-bg">Remove BG</a><a href="/image-compressor">Images</a><a href="/video-compressor">Video</a><a href="/blogs">Blogs</a>
            </nav>
            <div class="fb-home-actions">
              <a class="fb-btn ghost" href="/faq">FAQ</a>
              <a class="fb-btn solid" href="/remove-bg">Try for free</a>
              <a class="fb-btn ghost fb-home-menu" href="/features">Menu</a>
            </div>
          </header>
          <section class="fb-home-hero">
            <div class="fb-pill"><strong>FlyThe BG</strong><span>Privacy-first media tools</span></div>
            <h1 class="fb-home-title"><span>Make media lighter.</span><span>Keep your workflow moving.</span></h1>
            <p class="fb-home-sub">Remove image backgrounds with protected AI, compress images locally, and create smaller videos in your browser.</p>
            <div class="fb-home-cta">
              <a class="fb-btn solid" href="/remove-bg">Remove background</a>
              <a class="fb-btn ghost" href="/features">Explore tools</a>
            </div>
          </section>
          <section class="fb-tools" aria-label="FlyThe BG tools">
            <a class="fb-tool" href="/remove-bg"><small>01 · Protected AI</small><strong>Remove Background</strong><p>PNG, JPG and WEBP up to 15 MB.</p></a>
            <a class="fb-tool" href="/image-compressor"><small>02 · Browser local</small><strong>Compress Image</strong><p>Reduce image size without uploading the original.</p></a>
            <a class="fb-tool" href="/video-compressor"><small>03 · Browser local</small><strong>Compress Video</strong><p>Create a smaller WebM with visible progress.</p></a>
          </section>
        </div>
      </main>`;
    document.body.classList.remove("app-pending");
    const home = app.querySelector(".fb-home");
    const video = app.querySelector(".fb-home-video");
    const play = () => { if (video && video.paused) video.play().catch(() => {}); };
    play();
    video?.addEventListener("canplay", play, {once:false});
    document.addEventListener("visibilitychange", () => { if (!document.hidden) play(); }, {passive:true});
    ["pointerdown","touchstart","scroll"].forEach(type => window.addEventListener(type, play, {passive:true,once:true}));
    const start = () => home.classList.add("fb-playing");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      home.classList.remove("fb-intro");
    } else {
      requestAnimationFrame(() => requestAnimationFrame(start));
      setTimeout(() => home.classList.add("fb-playing"), 1800);
    }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount, {once:true});
  else mount();
})();