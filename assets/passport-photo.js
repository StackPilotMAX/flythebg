
(function () {
  "use strict";

  const PHOTO_PRESETS = [
    { name: "35 × 45 mm — 3.5 × 4.5 cm", w: 3.5, h: 4.5, unit: "cm" },
    { name: "30 × 40 mm — 3 × 4 cm", w: 3, h: 4, unit: "cm" },
    { name: "40 × 50 mm — 4 × 5 cm", w: 4, h: 5, unit: "cm" },
    { name: "45 × 55 mm — 4.5 × 5.5 cm", w: 4.5, h: 5.5, unit: "cm" },
    { name: "2 × 2 in — 5.08 × 5.08 cm", w: 2, h: 2, unit: "in" },
    { name: "2 × 3 in — 5.08 × 7.62 cm", w: 2, h: 3, unit: "in" },
    { name: "2.5 × 3.5 in — 6.35 × 8.89 cm", w: 2.5, h: 3.5, unit: "in" },
    { name: "1.5 × 2 in — 3.81 × 5.08 cm", w: 1.5, h: 2, unit: "in" }
  ];

  const PAPER_SIZES = [
    { id: "a4", name: "A4", w: 8.2677, h: 11.6929, label: "21 × 29.7 cm" },
    { id: "a3", name: "A3", w: 11.6929, h: 16.5354, label: "29.7 × 42 cm" },
    { id: "a5", name: "A5", w: 5.8268, h: 8.2677, label: "14.8 × 21 cm" },
    { id: "a6", name: "A6", w: 4.1339, h: 5.8268, label: "10.5 × 14.8 cm" },
    { id: "a2", name: "A2", w: 16.5354, h: 23.3858, label: "42 × 59.4 cm" },
    { id: "b5", name: "B5", w: 6.9291, h: 9.8425, label: "17.6 × 25 cm" },
    { id: "letter", name: "Letter", w: 8.5, h: 11, label: "8.5 × 11 in" },
    { id: "legal", name: "Legal", w: 8.5, h: 14, label: "8.5 × 14 in" },
    { id: "executive", name: "Executive", w: 7.25, h: 10.5, label: "7.25 × 10.5 in" },
    { id: "ledger", name: "Ledger", w: 11, h: 17, label: "11 × 17 in" },
    { id: "statement", name: "Statement", w: 5.5, h: 8.5, label: "5.5 × 8.5 in" },
    { id: "photo4x6", name: "4 × 6 Photo Paper", w: 4, h: 6, label: "4 × 6 in" },
    { id: "photo5x7", name: "5 × 7 Photo Paper", w: 5, h: 7, label: "5 × 7 in" },
    { id: "photo8x10", name: "8 × 10 Photo Paper", w: 8, h: 10, label: "8 × 10 in" },
    { id: "tabloid", name: "Tabloid", w: 11, h: 17, label: "11 × 17 in" }
  ];

  const RECOMMENDED_COLORS = [
    { name: "Clean white", value: "#FFFFFF" },
    { name: "Warm off-white", value: "#F7F7F3" },
    { name: "Soft light blue", value: "#EAF4FF" },
    { name: "Neutral light gray", value: "#F1F2F4" }
  ];

  function mmToIn(v) { return v / 25.4; }
  function cmToIn(v) { return v / 2.54; }
  function inToCm(v) { return v * 2.54; }
  function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }
  function escapeHtml(value) {
    return String(value).replace(/[&<>"]/g, function (c) {
      return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c];
    });
  }

  function download(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.rel = "noopener";
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 120000);
  }

  function canvasBlob(canvas, type, quality) {
    return new Promise(function (resolve, reject) {
      canvas.toBlob(function (blob) {
        if (blob) resolve(blob);
        else reject(new Error("The browser could not create the image."));
      }, type || "image/png", quality);
    });
  }

  function loadImageFromBlob(blob) {
    return new Promise(function (resolve, reject) {
      const url = URL.createObjectURL(blob);
      const image = new Image();
      image.onload = function () {
        image.__flyObjectUrl = url;
        resolve(image);
      };
      image.onerror = function () {
        URL.revokeObjectURL(url);
        reject(new Error("The image preview could not be loaded."));
      };
      image.src = url;
    });
  }

  function rgbFromHex(hex) {
    const raw = String(hex || "#FFFFFF").replace("#", "");
    const value = raw.length === 3 ? raw.split("").map(function (x) { return x + x; }).join("") : raw;
    return {
      r: parseInt(value.slice(0, 2), 16) || 255,
      g: parseInt(value.slice(2, 4), 16) || 255,
      b: parseInt(value.slice(4, 6), 16) || 255
    };
  }

  function hexFromRgb(r, g, b) {
    return "#" + [r, g, b].map(function (v) {
      return clamp(Math.round(Number(v) || 0), 0, 255).toString(16).padStart(2, "0");
    }).join("").toUpperCase();
  }

  function makePhotoPage() {
    const root = document.querySelector("#passport-photo-root");
    if (!root || root.dataset.ready === "1") return;
    root.dataset.ready = "1";

    root.innerHTML = [
      '<div class="passport-head">',
        '<div class="passport-head-copy">',
          '<p class="eyebrow">FLYTHE BG · 04</p>',
          '<h1>Passport Size Visa Photo Maker</h1>',
          '<p>Create print-ready ID, passport and visa-style photo sheets from one image. Crop precisely, choose background treatment, set the physical photo size, choose your paper, then print or download.</p>',
        '</div>',
        '<div class="passport-progress" aria-label="Photo maker steps">',
          '<div class="passport-progress-track"><span data-pp-progress></span></div>',
          '<span data-pp-step-label>STEP 1 OF 7</span>',
        '</div>',
      '</div>',

      '<section class="passport-workspace">',
        '<aside class="passport-stepper" aria-label="Workflow steps">',
          '<button class="passport-step-dot is-active" type="button" data-pp-jump="0"><span>01</span><b>Upload</b><small>Photo + terms</small></button>',
          '<button class="passport-step-dot" type="button" data-pp-jump="1"><span>02</span><b>Crop</b><small>Select the area</small></button>',
          '<button class="passport-step-dot" type="button" data-pp-jump="2"><span>03</span><b>Background</b><small>Keep or remove</small></button>',
          '<button class="passport-step-dot" type="button" data-pp-jump="3"><span>04</span><b>Background style</b><small>Color + preview</small></button>',
          '<button class="passport-step-dot" type="button" data-pp-jump="4"><span>05</span><b>Photo size</b><small>cm or inches</small></button>',
          '<button class="passport-step-dot" type="button" data-pp-jump="5"><span>06</span><b>Paper</b><small>Sheet size</small></button>',
          '<button class="passport-step-dot" type="button" data-pp-jump="6"><span>07</span><b>Copies</b><small>Generate sheet</small></button>',
        '</aside>',

        '<div class="passport-slides" data-pp-slides>',
          '<section class="passport-slide is-active" data-pp-slide="0" aria-labelledby="pp-title-1">',
            '<div class="passport-slide-title"><span>STEP 01</span><h2 id="pp-title-1">Upload the photo you want to use.</h2><p>PNG, JPG and WEBP are supported. Your original stays in the browser until you choose to send a cropped version for background removal.</p></div>',
            '<div class="passport-upload-grid">',
              '<label class="passport-upload-zone" data-pp-upload-zone>',
                '<input type="file" accept="image/png,image/jpeg,image/webp" data-pp-file>',
                '<span class="passport-upload-icon">↑</span>',
                '<strong>Drop a photo here</strong>',
                '<small>or tap to browse your device</small>',
                '<em>One image · local-first workflow</em>',
              '</label>',
              '<div class="passport-source-preview" data-pp-source-preview hidden>',
                '<div class="passport-preview-image-wrap"><img alt="Selected photo preview" data-pp-source-image></div>',
                '<div class="passport-file-meta"><strong data-pp-file-name>Photo selected</strong><span data-pp-file-dims></span></div>',
              '</div>',
            '</div>',
            '<label class="passport-consent"><input type="checkbox" data-pp-consent><span class="passport-consent-box">✓</span><span><strong>I accept the FlyThe BG <a href="/terms" target="_blank" rel="noopener">Terms</a> and <a href="/privacy" target="_blank" rel="noopener">Privacy Policy</a> for this workflow.</strong><small>I understand that the image only leaves my browser if I choose AI background removal later. I have permission to process this photo.</small></span></label>',
            '<p class="passport-status" role="status" aria-live="polite" data-pp-status>Choose a photo and accept the notice to continue.</p>',
            '<div class="passport-nav"><span></span><button class="button primary" type="button" data-pp-next disabled>Continue to crop →</button></div>',
          '</section>',

          '<section class="passport-slide" data-pp-slide="1" aria-labelledby="pp-title-2" hidden>',
            '<div class="passport-slide-title"><span>STEP 02</span><h2 id="pp-title-2">Select the exact area you need.</h2><p>Works with 9:16, 16:9, square or any other image ratio. Drag the crop box or resize a corner; nothing about the original photo is changed.</p></div>',
            '<div class="passport-editor-grid">',
              '<div class="passport-canvas-shell"><canvas class="passport-crop-canvas" data-pp-crop-canvas></canvas></div>',
              '<aside class="passport-crop-tools">',
                '<div class="passport-control-group"><span>Crop shape</span><div class="passport-chip-grid"><button type="button" class="passport-chip is-active" data-pp-aspect="free">Free</button><button type="button" class="passport-chip" data-pp-aspect="0.7777778">35:45</button><button type="button" class="passport-chip" data-pp-aspect="1">1:1</button><button type="button" class="passport-chip" data-pp-aspect="0.6666667">2:3</button><button type="button" class="passport-chip" data-pp-aspect="0.75">3:4</button></div></div>',
                '<div class="passport-crop-readout"><span>Selected area</span><strong data-pp-crop-size>—</strong><small data-pp-crop-ratio>Ratio: —</small></div>',
                '<div class="passport-editor-tip"><b>Tip</b><span>Keep the subject centered and leave enough headroom. The final physical size comes in the next step.</span></div>',
              '</aside>',
            '</div>',
            '<div class="passport-nav"><button class="button ghost" type="button" data-pp-back>← Back</button><button class="button primary" type="button" data-pp-next>Use this area →</button></div>',
          '</section>',

          '<section class="passport-slide" data-pp-slide="2" aria-labelledby="pp-title-3" hidden>',
            '<div class="passport-slide-title"><span>STEP 03</span><h2 id="pp-title-3">What should happen to the background?</h2><p>Choose the route once. If you remove the background, FlyThe BG reuses the existing protected AI endpoint and the same Cloudflare server-side Hugging Face token you already configured. No Hugging Face Space changes are made.</p></div>',
            '<div class="passport-choice-grid">',
              '<button type="button" class="passport-choice is-selected" data-pp-bg-choice="remove"><span class="passport-choice-icon">✦</span><strong>Remove background</strong><small>Send only the cropped image to the existing FlyThe BG AI route and create a transparent result.</small></button>',
              '<button type="button" class="passport-choice" data-pp-bg-choice="keep"><span class="passport-choice-icon">◌</span><strong>Keep original background</strong><small>Everything stays in the browser and the selected background remains part of the photo.</small></button>',
            '</div>',
            '<div class="passport-callout" data-pp-ai-note><b>Protected AI route</b><span>The browser never receives the Hugging Face token. The existing worker handles the protected request.</span></div>',
            '<p class="passport-status" role="status" aria-live="polite" data-pp-bg-status>Remove background is selected.</p>',
            '<div class="passport-nav"><button class="button ghost" type="button" data-pp-back>← Back</button><button class="button primary" type="button" data-pp-bg-next>Continue →</button></div>',
          '</section>',

          '<section class="passport-slide" data-pp-slide="3" aria-labelledby="pp-title-4" hidden>',
            '<div class="passport-slide-title"><span>STEP 04</span><h2 id="pp-title-4">Choose the background look.</h2><p>Use a recommended neutral option, pick any color, or enter exact RGB values. Background styling is enabled for AI-removed images; an untouched original background is preserved.</p></div>',
            '<div class="passport-background-grid">',
              '<div class="passport-result-stage"><div class="passport-result-frame"><img alt="Passport photo preview" data-pp-result-image></div><span data-pp-ai-badge>AI background removed</span></div>',
              '<div class="passport-color-panel">',
                '<div class="passport-control-group"><span>Recommended for photo documents</span><div class="passport-swatches" data-pp-swatches></div></div><div class="passport-control-group"><span>Use a custom background image</span><label class="passport-bg-image-picker"><input type="file" accept="image/png,image/jpeg,image/webp" data-pp-background-image><span>Choose background image</span></label><button type="button" class="passport-clear-bg" data-pp-clear-background-image>Use color only</button></div>',
                '<div class="passport-color-row"><label>Color picker<input type="color" value="#FFFFFF" data-pp-color></label><label>HEX<input type="text" value="#FFFFFF" maxlength="7" data-pp-hex></label></div>',
                '<div class="passport-rgb-row"><label>R<input type="number" min="0" max="255" value="255" data-pp-r></label><label>G<input type="number" min="0" max="255" value="255" data-pp-g></label><label>B<input type="number" min="0" max="255" value="255" data-pp-b></label></div>',
                '<div class="passport-control-group"><span>Background status</span><p class="passport-mini-note" data-pp-bg-help>White is the default neutral choice. Check the official destination requirements before submission because different authorities can use different photo rules.</p></div>',
              '</div>',
            '</div>',
            '<p class="passport-status" role="status" aria-live="polite" data-pp-color-status>Background ready.</p>',
            '<div class="passport-nav"><button class="button ghost" type="button" data-pp-back>← Back</button><button class="button primary" type="button" data-pp-next>Set photo size →</button></div>',
          '</section>',

          '<section class="passport-slide" data-pp-slide="4" aria-labelledby="pp-title-5" hidden>',
            '<div class="passport-slide-title"><span>STEP 05</span><h2 id="pp-title-5">Set the physical photo size.</h2><p>Use centimeters or inches. The maker keeps your measurement in physical units and uses print pixels only when it creates the final sheet.</p></div>',
            '<div class="passport-settings-card">',
              '<div class="passport-unit-tabs"><button type="button" class="passport-chip is-active" data-pp-photo-unit="cm">Centimeters</button><button type="button" class="passport-chip" data-pp-photo-unit="in">Inches</button></div>',
              '<div class="passport-form-grid">',
                '<label>Width<input type="number" min="0.5" max="10" step="0.01" value="3.5" data-pp-photo-w></label>',
                '<label>Height<input type="number" min="0.5" max="15" step="0.01" value="4.5" data-pp-photo-h></label>',
              '</div>',
              '<div class="passport-preset-row"><span>Common presets</span><select data-pp-photo-preset><option value="">Choose a preset</option></select></div>',
              '<div class="passport-validation" data-pp-photo-validation>Enter a usable width and height.</div>',
              '<div class="passport-dpi-note" data-pp-photo-quality>Print target: 300 DPI when the browser can allocate the required canvas.</div>',
            '</div>',
            '<div class="passport-size-preview"><div class="passport-size-silhouette" data-pp-size-box></div><span data-pp-size-label>3.5 × 4.5 cm</span></div>',
            '<div class="passport-nav"><button class="button ghost" type="button" data-pp-back>← Back</button><button class="button primary" type="button" data-pp-next>Choose paper →</button></div>',
          '</section>',

          '<section class="passport-slide" data-pp-slide="5" aria-labelledby="pp-title-6" hidden>',
            '<div class="passport-slide-title"><span>STEP 06</span><h2 id="pp-title-6">Choose the paper you will print on.</h2><p>More than ten common paper sizes are built in. The current unit is shown directly beside every size so there is no guesswork.</p></div>',
            '<div class="passport-settings-card">',
              '<div class="passport-unit-tabs"><button type="button" class="passport-chip is-active" data-pp-paper-unit="cm">Centimeters</button><button type="button" class="passport-chip" data-pp-paper-unit="in">Inches</button></div>',
              '<label class="passport-paper-select">Paper size<select data-pp-paper></select></label>',
              '<div class="passport-form-grid">',
                '<label>Margin<input type="number" min="0" max="2" step="0.01" value="0.2" data-pp-margin></label>',
                '<label>Gap between photos<input type="number" min="0" max="1" step="0.01" value="0.08" data-pp-gap></label>',
              '</div>',
              '<div class="passport-paper-info" data-pp-paper-info></div>',
              '<div class="passport-validation" data-pp-layout-validation></div>',
            '</div>',
            '<div class="passport-paper-preview"><div class="passport-mini-paper" data-pp-paper-preview><span>PHOTO SHEET</span></div></div>',
            '<div class="passport-nav"><button class="button ghost" type="button" data-pp-back>← Back</button><button class="button primary" type="button" data-pp-next>Choose copies →</button></div>',
          '</section>',

          '<section class="passport-slide" data-pp-slide="6" aria-labelledby="pp-title-7" hidden>',
            '<div class="passport-slide-title"><span>STEP 07</span><h2 id="pp-title-7">How many photos should the sheet contain?</h2><p>The maker calculates the maximum that fits on your chosen paper before anything is generated.</p></div>',
            '<div class="passport-copies-card">',
              '<div class="passport-max-stat"><span>Maximum that fits</span><strong data-pp-max-copies>—</strong><small data-pp-layout-summary>—</small></div>',
              '<label class="passport-quantity">Number of photos<input type="number" min="1" value="1" data-pp-qty></label>',
              '<div class="passport-quantity-chips"><button type="button" class="passport-chip" data-pp-qty-preset="1">1</button><button type="button" class="passport-chip" data-pp-qty-preset="4">4</button><button type="button" class="passport-chip" data-pp-qty-preset="8">8</button><button type="button" class="passport-chip" data-pp-qty-preset="12">12</button><button type="button" class="passport-chip" data-pp-qty-preset="24">24</button></div>',
              '<div class="passport-validation" data-pp-qty-validation></div>',
              '<div class="passport-result-actions">',
                '<button class="button primary huge" type="button" data-pp-generate>Generate photo sheet ✦</button>',
                '<button class="button ghost" type="button" data-pp-reset>Start over</button>',
              '</div>',
            '</div>',
            '<div class="passport-final-card" data-pp-final hidden>',
              '<div class="passport-final-preview"><canvas data-pp-final-canvas></canvas></div>',
              '<div class="passport-final-copy"><span class="eyebrow">RESULT READY</span><h3>Your print sheet is ready.</h3><p data-pp-final-summary></p><div class="passport-final-buttons"><button class="button primary" type="button" data-pp-download-png>Download PNG</button><button class="button ghost" type="button" data-pp-download-jpg>Download JPG</button></div><small>The generated sheet stays in this browser tab until you leave or start over.</small></div>',
            '</div>',
            '<div class="passport-nav"><button class="button ghost" type="button" data-pp-back>← Back</button><span></span></div>',
          '</section>',
        '</div>',
      '</section>',
      '<p class="processing-note">By using FlyThe BG, you accept our <a href="/privacy">Privacy Policy</a> and <a href="/terms">Terms</a>. Photo requirements can vary by authority and destination; verify the final specification before submitting official documents.</p>',
    ].join("");

    const state = {
      step: 0,
      file: null,
      sourceUrl: "",
      image: null,
      crop: null,
      cropAspect: null,
      bgMode: "remove",
      resultUrl: "",
      resultImage: null,
      color: "#FFFFFF",
      backgroundImage: null,
      backgroundImageUrl: "",
      photoUnit: "cm",
      photoW: 3.5,
      photoH: 4.5,
      paperUnit: "cm",
      paperId: "a4",
      margin: 0.2,
      gap: 0.08,
      quantity: 1,
      finalCanvas: null,
      busy: false
    };

    const q = function (selector) { return root.querySelector(selector); };
    const qa = function (selector) { return Array.from(root.querySelectorAll(selector)); };
    const slides = qa("[data-pp-slide]");
    const dots = qa("[data-pp-jump]");
    const cropCanvas = q("[data-pp-crop-canvas]");
    const cropCtx = cropCanvas.getContext("2d");
    let cropDrag = null;

    function setStatus(message, selector) {
      const node = q(selector || "[data-pp-status]");
      if (node) node.textContent = message;
    }

    function updateHeader() {
      const pct = ((state.step + 1) / slides.length) * 100;
      const bar = q("[data-pp-progress]");
      const label = q("[data-pp-step-label]");
      if (bar) bar.style.width = pct + "%";
      if (label) label.textContent = "STEP " + String(state.step + 1).padStart(2, "0") + " OF " + slides.length;
      dots.forEach(function (dot, i) {
        dot.classList.toggle("is-active", i === state.step);
        dot.classList.toggle("is-complete", i < state.step);
      });
      slides.forEach(function (slide, i) {
        const active = i === state.step;
        slide.hidden = !active;
        slide.classList.toggle("is-active", active);
      });
      if (state.step === 1) {
        requestAnimationFrame(drawCrop);
      }
      if (state.step === 3) {
        requestAnimationFrame(updateResultPreview);
      }
      if (state.step === 4) updatePhotoSizeUI();
      if (state.step === 5) updatePaperUI();
      if (state.step === 6) updateCopiesUI();
    }

    function canGoNextFromUpload() {
      const next = q('[data-pp-next]');
      if (state.step === 0 && next) next.disabled = !(state.file && q("[data-pp-consent]").checked);
    }

    function goTo(step) {
      if (state.busy) return;
      if (step < state.step && step >= 0) {
        state.step = step;
        updateHeader();
        return;
      }
      if (step === state.step + 1) {
        if (state.step === 0 && !(state.file && q("[data-pp-consent]").checked)) {
          setStatus("Choose a photo and accept the notice first.");
          return;
        }
        if (state.step === 1 && !state.crop) {
          setStatus("Select an area first.", "[data-pp-status]");
          return;
        }
        if (state.step === 2) {
          state.step = 2;
          prepareBackgroundResult().then(function () {
            if (!state.busy) {
              state.step = 3;
              updateHeader();
            }
          });
          return;
        }
        if (state.step === 3) {
          state.step = 4;
        } else if (state.step === 4) {
          updatePhotoValidation();
          if (!isPhotoSizeValid()) return;
          state.step = 5;
        } else if (state.step === 5) {
          updateLayoutValidation();
          if (!isLayoutUsable()) return;
          state.step = 6;
        } else {
          state.step = step;
        }
        updateHeader();
      }
    }

    function setupUpload() {
      const input = q("[data-pp-file]");
      const zone = q("[data-pp-upload-zone]");
      input.addEventListener("change", function () {
        const file = input.files && input.files[0];
        if (!file) return;
        handleFile(file);
      });
      ["dragenter", "dragover"].forEach(function (type) {
        zone.addEventListener(type, function (event) {
          event.preventDefault();
          zone.classList.add("dragging");
        });
      });
      ["dragleave", "drop"].forEach(function (type) {
        zone.addEventListener(type, function (event) {
          event.preventDefault();
          zone.classList.remove("dragging");
        });
      });
      zone.addEventListener("drop", function (event) {
        const file = event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0];
        if (file) handleFile(file);
      });
      q("[data-pp-consent]").addEventListener("change", canGoNextFromUpload);
      q("[data-pp-next]").addEventListener("click", function () { goTo(1); });
    }

    function handleFile(file) {
      if (!/^image\/(png|jpeg|webp)$/.test(file.type)) {
        setStatus("Please choose a PNG, JPG or WEBP image.");
        return;
      }
      if (file.size > 15 * 1024 * 1024) {
        setStatus("This image is above the 15 MB limit. Choose a smaller file.");
        return;
      }
      if (state.sourceUrl) URL.revokeObjectURL(state.sourceUrl);
      state.file = file;
      state.sourceUrl = URL.createObjectURL(file);
      const image = new Image();
      image.onload = function () {
        state.image = image;
        state.crop = initialCrop();
        const sourceImage = q("[data-pp-source-image]");
        sourceImage.src = state.sourceUrl;
        q("[data-pp-source-preview]").hidden = false;
        q("[data-pp-file-name]").textContent = file.name;
        q("[data-pp-file-dims]").textContent = image.naturalWidth + " × " + image.naturalHeight + " px";
        canGoNextFromUpload();
        setStatus("Photo loaded. Accept the notice, then continue to crop.");
      };
      image.onerror = function () { setStatus("The selected image could not be opened."); };
      image.src = state.sourceUrl;
    }

    function initialCrop() {
      if (!state.image) return null;
      const w = state.image.naturalWidth;
      const h = state.image.naturalHeight;
      const ratio = state.cropAspect;
      if (!ratio) {
        const cw = w * 0.82;
        const ch = h * 0.82;
        return { x: (w - cw) / 2, y: (h - ch) / 2, w: cw, h: ch };
      }
      return cropForAspect(ratio, w * 0.82, h * 0.82);
    }

    function cropForAspect(ratio, maxW, maxH) {
      if (!state.image) return null;
      const iw = state.image.naturalWidth;
      const ih = state.image.naturalHeight;
      let w = Math.min(maxW, maxH * ratio);
      let h = w / ratio;
      if (h > maxH) {
        h = maxH;
        w = h * ratio;
      }
      w = Math.min(w, iw * 0.96);
      h = Math.min(h, ih * 0.96);
      if (w / h > ratio) w = h * ratio;
      else h = w / ratio;
      return { x: (iw - w) / 2, y: (ih - h) / 2, w: w, h: h };
    }

    function getRenderScale() {
      if (!state.image) return 1;
      return Math.min(1100 / state.image.naturalWidth, 700 / state.image.naturalHeight, 1);
    }

    function resizeCropCanvas() {
      if (!state.image || !cropCanvas) return;
      const scale = getRenderScale();
      cropCanvas.width = Math.max(1, Math.round(state.image.naturalWidth * scale));
      cropCanvas.height = Math.max(1, Math.round(state.image.naturalHeight * scale));
      drawCrop();
    }

    function cropToCanvas(crop) {
      const scale = getRenderScale();
      return {
        x: crop.x * scale,
        y: crop.y * scale,
        w: crop.w * scale,
        h: crop.h * scale
      };
    }

    function drawCrop() {
      if (!state.image || !cropCtx || !cropCanvas) return;
      resizeCropCanvasSafe();
      const c = state.crop || initialCrop();
      if (!c) return;
      const scaled = cropToCanvas(c);
      cropCtx.clearRect(0, 0, cropCanvas.width, cropCanvas.height);
      cropCtx.drawImage(state.image, 0, 0, cropCanvas.width, cropCanvas.height);
      cropCtx.save();
      cropCtx.fillStyle = "rgba(0,0,0,.62)";
      cropCtx.fillRect(0, 0, cropCanvas.width, cropCanvas.height);
      cropCtx.globalCompositeOperation = "destination-out";
      cropCtx.fillRect(scaled.x, scaled.y, scaled.w, scaled.h);
      cropCtx.restore();

      cropCtx.save();
      cropCtx.strokeStyle = "#68d8ff";
      cropCtx.lineWidth = Math.max(2, cropCanvas.width / 500);
      cropCtx.strokeRect(scaled.x, scaled.y, scaled.w, scaled.h);
      cropCtx.strokeStyle = "rgba(255,255,255,.42)";
      cropCtx.lineWidth = 1;
      for (let i = 1; i < 3; i++) {
        cropCtx.beginPath();
        cropCtx.moveTo(scaled.x + scaled.w * i / 3, scaled.y);
        cropCtx.lineTo(scaled.x + scaled.w * i / 3, scaled.y + scaled.h);
        cropCtx.stroke();
        cropCtx.beginPath();
        cropCtx.moveTo(scaled.x, scaled.y + scaled.h * i / 3);
        cropCtx.lineTo(scaled.x + scaled.w, scaled.y + scaled.h * i / 3);
        cropCtx.stroke();
      }
      const handles = [
        [scaled.x, scaled.y], [scaled.x + scaled.w, scaled.y],
        [scaled.x, scaled.y + scaled.h], [scaled.x + scaled.w, scaled.y + scaled.h]
      ];
      cropCtx.fillStyle = "#FFFFFF";
      handles.forEach(function (p) {
        cropCtx.beginPath();
        cropCtx.arc(p[0], p[1], 6, 0, Math.PI * 2);
        cropCtx.fill();
      });
      cropCtx.restore();
      const dim = q("[data-pp-crop-size]");
      const ratio = q("[data-pp-crop-ratio]");
      if (dim) dim.textContent = Math.round(c.w) + " × " + Math.round(c.h) + " px";
      if (ratio) ratio.textContent = "Ratio: " + (c.w / c.h).toFixed(3);
    }

    function resizeCropCanvasSafe() {
      if (!state.image || !cropCanvas) return;
      const scale = getRenderScale();
      const width = Math.max(1, Math.round(state.image.naturalWidth * scale));
      const height = Math.max(1, Math.round(state.image.naturalHeight * scale));
      if (cropCanvas.width !== width || cropCanvas.height !== height) {
        cropCanvas.width = width;
        cropCanvas.height = height;
      }
    }

    function clientToImage(event) {
      const rect = cropCanvas.getBoundingClientRect();
      const scaleX = state.image.naturalWidth / rect.width;
      const scaleY = state.image.naturalHeight / rect.height;
      return {
        x: clamp((event.clientX - rect.left) * scaleX, 0, state.image.naturalWidth),
        y: clamp((event.clientY - rect.top) * scaleY, 0, state.image.naturalHeight)
      };
    }

    function hitHandle(point) {
      if (!state.crop) return null;
      const c = cropToCanvas(state.crop);
      const candidates = {
        nw: [c.x, c.y], ne: [c.x + c.w, c.y],
        sw: [c.x, c.y + c.h], se: [c.x + c.w, c.y + c.h]
      };
      const rect = cropCanvas.getBoundingClientRect();
      const displayScale = rect.width / cropCanvas.width;
      const threshold = 18 / Math.max(0.1, displayScale);
      for (const key in candidates) {
        const dx = point.x * getRenderScale() - candidates[key][0];
        const dy = point.y * getRenderScale() - candidates[key][1];
        if (Math.hypot(dx, dy) <= threshold) return key;
      }
      return null;
    }

    function insideCrop(point) {
      if (!state.crop) return false;
      return point.x >= state.crop.x && point.x <= state.crop.x + state.crop.w &&
        point.y >= state.crop.y && point.y <= state.crop.y + state.crop.h;
    }

    cropCanvas.addEventListener("pointerdown", function (event) {
      if (!state.image || !state.crop) return;
      cropCanvas.setPointerCapture(event.pointerId);
      const point = clientToImage(event);
      const handle = hitHandle(point);
      cropDrag = {
        mode: handle || (insideCrop(point) ? "move" : "new"),
        start: point,
        original: { x: state.crop.x, y: state.crop.y, w: state.crop.w, h: state.crop.h }
      };
    });

    cropCanvas.addEventListener("pointermove", function (event) {
      if (!cropDrag || !state.image) return;
      const point = clientToImage(event);
      const start = cropDrag.start;
      const o = cropDrag.original;
      const minSize = Math.max(24, Math.min(state.image.naturalWidth, state.image.naturalHeight) * 0.03);

      if (cropDrag.mode === "move") {
        state.crop.x = clamp(o.x + point.x - start.x, 0, state.image.naturalWidth - o.w);
        state.crop.y = clamp(o.y + point.y - start.y, 0, state.image.naturalHeight - o.h);
      } else if (cropDrag.mode === "new") {
        const x = Math.min(start.x, point.x);
        const y = Math.min(start.y, point.y);
        const w = Math.max(minSize, Math.abs(point.x - start.x));
        const h = Math.max(minSize, Math.abs(point.y - start.y));
        state.crop = {
          x: clamp(x, 0, state.image.naturalWidth - minSize),
          y: clamp(y, 0, state.image.naturalHeight - minSize),
          w: clamp(w, minSize, state.image.naturalWidth - x),
          h: clamp(h, minSize, state.image.naturalHeight - y)
        };
      } else {
        resizeCropFromHandle(cropDrag.mode, point, o, minSize);
      }
      drawCrop();
    });

    ["pointerup", "pointercancel"].forEach(function (type) {
      cropCanvas.addEventListener(type, function () {
        cropDrag = null;
      });
    });

    function resizeCropFromHandle(handle, point, o, minSize) {
      let left = o.x, top = o.y, right = o.x + o.w, bottom = o.y + o.h;
      if (handle === "nw") { left = clamp(point.x, 0, right - minSize); top = clamp(point.y, 0, bottom - minSize); }
      if (handle === "ne") { right = clamp(point.x, left + minSize, state.image.naturalWidth); top = clamp(point.y, 0, bottom - minSize); }
      if (handle === "sw") { left = clamp(point.x, 0, right - minSize); bottom = clamp(point.y, top + minSize, state.image.naturalHeight); }
      if (handle === "se") { right = clamp(point.x, left + minSize, state.image.naturalWidth); bottom = clamp(point.y, top + minSize, state.image.naturalHeight); }
      state.crop = { x: left, y: top, w: right - left, h: bottom - top };
      if (state.cropAspect) {
        const fitted = cropForAspect(state.cropAspect, state.crop.w, state.crop.h);
        fitted.x = clamp(state.crop.x, 0, state.image.naturalWidth - fitted.w);
        fitted.y = clamp(state.crop.y, 0, state.image.naturalHeight - fitted.h);
        state.crop = fitted;
      }
    }

    qa("[data-pp-aspect]").forEach(function (button) {
      button.addEventListener("click", function () {
        qa("[data-pp-aspect]").forEach(function (b) { b.classList.remove("is-active"); });
        button.classList.add("is-active");
        state.cropAspect = button.dataset.ppAspect === "free" ? null : Number(button.dataset.ppAspect);
        if (state.image) state.crop = state.cropAspect ? cropForAspect(state.cropAspect, state.crop.w, state.crop.h) : state.crop;
        drawCrop();
      });
    });

    function extractCropCanvas() {
      if (!state.image || !state.crop) throw new Error("Select a crop area before continuing.");
      const crop = state.crop;
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(crop.w));
      canvas.height = Math.max(1, Math.round(crop.h));
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("The browser could not prepare the crop.");
      ctx.drawImage(state.image, crop.x, crop.y, crop.w, crop.h, 0, 0, canvas.width, canvas.height);
      return canvas;
    }

    async function prepareBackgroundResult() {
      if (state.busy) return;
      state.busy = true;
      const status = q("[data-pp-bg-status]");
      const call = function (message) { status.textContent = message; };
      q("[data-pp-bg-next]").disabled = true;
      try {
        const cropCanvasResult = extractCropCanvas();
        if (state.bgMode === "keep") {
          state.resultUrl = state.resultUrl ? state.resultUrl : cropCanvasResult.toDataURL("image/png");
          state.resultImage = await loadImageFromBlob(await canvasBlob(cropCanvasResult, "image/png"));
          call("Original background kept. Nothing was uploaded.");
          setResultBadge();
          return;
        }
        call("Preparing your cropped image for the existing protected AI route…");
        const blob = await canvasBlob(cropCanvasResult, "image/png");
        const response = await fetch("/api/remove-bg", {
          method: "POST",
          headers: { "Content-Type": "image/png", "Accept": "image/png" },
          body: blob
        });
        if (!response.ok) {
          let message = "Background removal failed.";
          try {
            const data = await response.json();
            if (data && data.error) message = data.error;
          } catch (_) {}
          throw new Error(message);
        }
        call("AI finished. Preparing the photo preview…");
        if (state.resultImage && state.resultImage.__flyObjectUrl) URL.revokeObjectURL(state.resultImage.__flyObjectUrl);
        state.resultImage = await loadImageFromBlob(await response.blob());
        state.resultUrl = state.resultImage.__flyObjectUrl || "";
        call("Background removed. Choose your final background style next.");
        setResultBadge();
      } catch (error) {
        call(error instanceof Error ? error.message : "Background processing failed.");
        throw error;
      } finally {
        state.busy = false;
        q("[data-pp-bg-next]").disabled = false;
      }
    }

    function setResultBadge() {
      const badge = q("[data-pp-ai-badge]");
      const note = q("[data-pp-bg-help]");
      const colorInputs = qa("[data-pp-color], [data-pp-hex], [data-pp-r], [data-pp-g], [data-pp-b], [data-pp-background-image], [data-pp-clear-background-image]");
      const disabled = state.bgMode === "keep";
      colorInputs.forEach(function (input) { input.disabled = disabled; });
      badge.textContent = disabled ? "Original background kept" : "AI background removed";
      note.textContent = disabled
        ? "The original background is preserved. Background controls are disabled because no background was removed."
        : "White is a neutral default. You can also place the cut-out on a browser-local custom background image. Check the exact destination requirements before submitting official photos.";
      updateResultPreview();
    }

    function updateResultPreview() {
      const frame = q("[data-pp-result-image]");
      if (!state.resultImage || !frame) return;
      frame.src = state.resultImage.src;
      frame.style.background = state.color;
      frame.style.backgroundImage = state.backgroundImageUrl ? "url(\"" + state.backgroundImageUrl + "\")" : "none";
      frame.style.backgroundSize = "cover";
      frame.style.backgroundPosition = "center";
      q("[data-pp-color-status]").textContent = state.bgMode === "keep" ? "Original background retained." : "Background color: " + state.color;
    }

    function composePhotoCanvas() {
      if (!state.resultImage) throw new Error("Your photo result is not ready yet.");
      const unit = state.photoUnit;
      const widthIn = unit === "cm" ? cmToIn(state.photoW) : state.photoW;
      const heightIn = unit === "cm" ? cmToIn(state.photoH) : state.photoH;
      const dpi = 300;
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(50, Math.round(widthIn * dpi));
      canvas.height = Math.max(50, Math.round(heightIn * dpi));
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Photo canvas is unavailable.");
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.fillStyle = state.color;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      if (state.backgroundImage) {
        const bw = state.backgroundImage.naturalWidth;
        const bh = state.backgroundImage.naturalHeight;
        const bgScale = Math.max(canvas.width / bw, canvas.height / bh);
        const bgW = bw * bgScale;
        const bgH = bh * bgScale;
        ctx.drawImage(state.backgroundImage, (canvas.width - bgW) / 2, (canvas.height - bgH) / 2, bgW, bgH);
      }
      const iw = state.resultImage.naturalWidth;
      const ih = state.resultImage.naturalHeight;
      const scale = Math.max(canvas.width / iw, canvas.height / ih);
      const dw = iw * scale;
      const dh = ih * scale;
      ctx.drawImage(state.resultImage, (canvas.width - dw) / 2, (canvas.height - dh) / 2, dw, dh);
      return canvas;
    }

    function currentPhotoInches() {
      return {
        w: state.photoUnit === "cm" ? cmToIn(state.photoW) : state.photoW,
        h: state.photoUnit === "cm" ? cmToIn(state.photoH) : state.photoH
      };
    }

    function updatePhotoPresetOptions() {
      const select = q("[data-pp-photo-preset]");
      if (!select) return;
      select.innerHTML = '<option value="">Choose a preset</option>' + PHOTO_PRESETS.map(function (p, i) {
        return '<option value="' + i + '">' + escapeHtml(p.name) + "</option>";
      }).join("");
    }

    function setPhotoUnit(unit) {
      if (unit === state.photoUnit) return;
      if (unit === "in") {
        state.photoW = cmToIn(state.photoW);
        state.photoH = cmToIn(state.photoH);
      } else {
        state.photoW = inToCm(state.photoW);
        state.photoH = inToCm(state.photoH);
      }
      state.photoUnit = unit;
      qa("[data-pp-photo-unit]").forEach(function (b) { b.classList.toggle("is-active", b.dataset.ppPhotoUnit === unit); });
      updatePhotoSizeUI();
    }

    function updatePhotoSizeUI() {
      const w = q("[data-pp-photo-w]");
      const h = q("[data-pp-photo-h]");
      if (w) w.value = Number(state.photoW).toFixed(2);
      if (h) h.value = Number(state.photoH).toFixed(2);
      const label = q("[data-pp-size-label]");
      if (label) label.textContent = Number(state.photoW).toFixed(2) + " × " + Number(state.photoH).toFixed(2) + " " + state.photoUnit;
      const box = q("[data-pp-size-box]");
      if (box) {
        const ratio = state.photoW / state.photoH;
        box.style.width = Math.min(220, 120 * ratio) + "px";
        box.style.height = Math.min(220, 120) + "px";
      }
      updatePhotoValidation();
    }

    function isPhotoSizeValid() {
      const w = Number(state.photoW), h = Number(state.photoH);
      return Number.isFinite(w) && Number.isFinite(h) && w > 0 && h > 0 && w <= 20 && h <= 20;
    }

    function updatePhotoValidation() {
      const node = q("[data-pp-photo-validation]");
      if (!node) return;
      if (!isPhotoSizeValid()) {
        node.className = "passport-validation is-error";
        node.textContent = "These dimensions cannot be used. Enter positive measurements within the supported range.";
        return;
      }
      const cropRatio = state.crop ? state.crop.w / state.crop.h : 0;
      const targetRatio = state.photoW / state.photoH;
      const mismatch = cropRatio ? Math.abs(cropRatio - targetRatio) / targetRatio : 0;
      if (mismatch > 0.08) {
        node.className = "passport-validation is-warning";
        node.textContent = "Warning: your selected crop ratio does not closely match the requested photo size. The final output will center-crop to avoid stretching.";
      } else {
        node.className = "passport-validation is-ok";
        node.textContent = "Dimensions are usable and closely match your selected crop.";
      }
    }

    function setPaperUnit(unit) {
      state.paperUnit = unit;
      qa("[data-pp-paper-unit]").forEach(function (b) { b.classList.toggle("is-active", b.dataset.ppPaperUnit === unit); });
      updatePaperUI();
    }

    function paperById() {
      return PAPER_SIZES.find(function (paper) { return paper.id === state.paperId; }) || PAPER_SIZES[0];
    }

    function currentPaperDimensions() {
      const paper = paperById();
      return state.paperUnit === "cm"
        ? { w: inToCm(paper.w), h: inToCm(paper.h), suffix: "cm" }
        : { w: paper.w, h: paper.h, suffix: "in" };
    }

    function layoutInfo() {
      const paper = paperById();
      const photo = currentPhotoInches();
      const marginIn = state.paperUnit === "cm" ? cmToIn(state.margin) : state.margin;
      const gapIn = state.paperUnit === "cm" ? cmToIn(state.gap) : state.gap;
      const usableW = paper.w - marginIn * 2;
      const usableH = paper.h - marginIn * 2;
      const cols = usableW >= photo.w ? Math.floor((usableW + gapIn) / (photo.w + gapIn)) : 0;
      const rows = usableH >= photo.h ? Math.floor((usableH + gapIn) / (photo.h + gapIn)) : 0;
      const colsR = paper.h >= photo.w + marginIn * 2 ? Math.floor((paper.h - marginIn * 2 + gapIn) / (photo.w + gapIn)) : 0;
      const rowsR = paper.w >= photo.h + marginIn * 2 ? Math.floor((paper.w - marginIn * 2 + gapIn) / (photo.h + gapIn)) : 0;
      const normal = cols * rows;
      const rotated = colsR * rowsR;
      const useRotated = rotated > normal;
      return { paper: paper, photo: photo, marginIn: marginIn, gapIn: gapIn, cols: cols, rows: rows, colsR: colsR, rowsR: rowsR, max: Math.max(normal, rotated), normal: normal, rotated: rotated, useRotated: useRotated, workingW: useRotated ? paper.h : paper.w, workingH: useRotated ? paper.w : paper.h };
    }

    function updatePaperUI() {
      const select = q("[data-pp-paper]");
      if (select) {
        select.innerHTML = PAPER_SIZES.map(function (p) {
          const label = state.paperUnit === "cm"
            ? inToCm(p.w).toFixed(1) + " × " + inToCm(p.h).toFixed(1) + " cm"
            : p.w.toFixed(2) + " × " + p.h.toFixed(2) + " in";
          return '<option value="' + p.id + '">' + escapeHtml(p.name + " — " + label) + "</option>";
        }).join("");
        select.value = state.paperId;
      }
      const info = currentPaperDimensions();
      const paperInfo = q("[data-pp-paper-info]");
      if (paperInfo) paperInfo.textContent = info.w.toFixed(2) + " × " + info.h.toFixed(2) + " " + info.suffix;
      const layout = layoutInfo();
      const validation = q("[data-pp-layout-validation]");
      if (!layout.max) {
        validation.className = "passport-validation is-error";
        validation.textContent = "These photo dimensions cannot be used on the selected paper with the current margins and gap.";
      } else {
        validation.className = "passport-validation is-ok";
        validation.textContent = "Maximum capacity: " + layout.max + " photos. The sheet will center the layout with balanced margins.";
      }
      drawPaperMini(layout);
    }

    function isLayoutUsable() {
      return layoutInfo().max > 0;
    }

    function drawPaperMini(layout) {
      const node = q("[data-pp-paper-preview]");
      if (!node) return;
      const aspect = layout.paper.w / layout.paper.h;
      node.style.width = (aspect >= 1 ? 260 : 210) + "px";
      node.style.height = (aspect >= 1 ? 210 : Math.round(260 / aspect)) + "px";
      node.innerHTML = "";
      const photoAspect = layout.photo.w / layout.photo.h;
      const cols = Math.max(1, layout.max ? (layout.useRotated ? layout.colsR || 1 : layout.cols) : 1);
      const rows = Math.max(1, layout.max ? (layout.useRotated ? layout.rowsR || 1 : layout.rows) : 1);
      const used = Math.min(layout.max, 12);
      const miniW = 100 / cols;
      const miniH = 100 / rows;
      for (let i = 0; i < used; i++) {
        const photo = document.createElement("span");
        photo.className = "passport-mini-photo";
        photo.style.width = "calc(" + miniW + "% - 4px)";
        photo.style.height = "calc(" + miniH + "% - 4px)";
        photo.style.aspectRatio = photoAspect;
        photo.style.background = state.color;
        node.appendChild(photo);
      }
    }

    function updateCopiesUI() {
      const layout = layoutInfo();
      q("[data-pp-max-copies]").textContent = String(layout.max || 0);
      q("[data-pp-layout-summary]").textContent = layout.max ? ((layout.useRotated ? layout.colsR : layout.cols) + " × " + (layout.useRotated ? layout.rowsR : layout.rows) + (layout.useRotated ? " landscape layout" : " portrait layout")) : "No valid layout";
      const qty = q("[data-pp-qty]");
      if (qty) {
        qty.max = String(layout.max || 1);
        qty.value = String(Math.min(Number(state.quantity) || 1, layout.max || 1));
      }
      validateQuantity();
    }

    function validateQuantity() {
      const node = q("[data-pp-qty-validation]");
      const layout = layoutInfo();
      const qty = Number(q("[data-pp-qty]").value);
      state.quantity = qty;
      if (!layout.max || !Number.isInteger(qty) || qty < 1 || qty > layout.max) {
        node.className = "passport-validation is-error";
        node.textContent = !layout.max
          ? "The selected dimensions cannot fit on this paper."
          : "You requested " + qty + " photos, but only " + layout.max + " fit on this paper.";
        return false;
      }
      node.className = "passport-validation is-ok";
      node.textContent = qty + " photo" + (qty === 1 ? "" : "s") + " will be placed on the sheet.";
      return true;
    }

    function updateResultAfterColor() {
      if (!state.resultImage) return;
      updateResultPreview();
      updatePaperUI();
      updateCopiesUI();
    }

    qa("[data-pp-bg-choice]").forEach(function (button) {
      button.addEventListener("click", function () {
        if (state.busy) return;
        qa("[data-pp-bg-choice]").forEach(function (b) { b.classList.remove("is-selected"); });
        button.classList.add("is-selected");
        state.bgMode = button.dataset.ppBgChoice;
        q("[data-pp-ai-note]").hidden = state.bgMode !== "remove";
        q("[data-pp-bg-status]").textContent = state.bgMode === "remove"
          ? "Remove background is selected. Continue to run the existing protected AI route."
          : "Keep original background is selected. The photo will stay in your browser.";
        if (state.bgMode === "keep") {
          q("[data-pp-ai-note]").hidden = true;
        }
      });
    });

    q("[data-pp-bg-next]").addEventListener("click", function () {
      goTo(3);
    });

    qa("[data-pp-color], [data-pp-hex], [data-pp-r], [data-pp-g], [data-pp-b]").forEach(function (input) {
      input.addEventListener("input", function () {
        if (input.disabled) return;
        let hex = state.color;
        if (input.matches("[data-pp-color]")) hex = input.value;
        else if (input.matches("[data-pp-hex]")) {
          const value = input.value.trim();
          if (/^#[0-9A-Fa-f]{6}$/.test(value)) hex = value;
        } else {
          hex = hexFromRgb(q("[data-pp-r]").value, q("[data-pp-g]").value, q("[data-pp-b]").value);
        }
        state.color = hex.toUpperCase();
        const rgb = rgbFromHex(state.color);
        q("[data-pp-color]").value = state.color;
        q("[data-pp-hex]").value = state.color;
        q("[data-pp-r]").value = String(rgb.r);
        q("[data-pp-g]").value = String(rgb.g);
        q("[data-pp-b]").value = String(rgb.b);
        updateResultAfterColor();
      });
    });

    q("[data-pp-swatches]").innerHTML = RECOMMENDED_COLORS.map(function (color) {
      return '<button type="button" class="passport-swatch" style="--swatch:' + color.value + '" data-pp-swatch="' + color.value + '" aria-label="' + color.name + '"></button>';
    }).join("");

    qa("[data-pp-swatch]").forEach(function (button) {
      button.addEventListener("click", function () {
        if (state.bgMode === "keep") return;
        const hex = button.dataset.ppSwatch;
        state.color = hex;
        const rgb = rgbFromHex(hex);
        q("[data-pp-color]").value = hex;
        q("[data-pp-hex]").value = hex;
        q("[data-pp-r]").value = String(rgb.r);
        q("[data-pp-g]").value = String(rgb.g);
        q("[data-pp-b]").value = String(rgb.b);
        updateResultAfterColor();
      });
    });

    q("[data-pp-background-image]").addEventListener("change", function (event) {
      if (state.bgMode === "keep") return;
      const file = event.target.files && event.target.files[0];
      if (!file) return;
      if (!/^image\\/(png|jpeg|webp)$/.test(file.type)) {
        q("[data-pp-color-status]").textContent = "Please choose a PNG, JPG or WEBP background image.";
        return;
      }
      if (state.backgroundImageUrl) URL.revokeObjectURL(state.backgroundImageUrl);
      const url = URL.createObjectURL(file);
      const image = new Image();
      image.onload = function () {
        state.backgroundImage = image;
        state.backgroundImageUrl = url;
        q("[data-pp-color-status]").textContent = "Custom background image selected.";
        updateResultAfterColor();
      };
      image.onerror = function () {
        URL.revokeObjectURL(url);
        q("[data-pp-color-status]").textContent = "The background image could not be opened.";
      };
      image.src = url;
    });

    q("[data-pp-clear-background-image]").addEventListener("click", function () {
      if (state.backgroundImageUrl) URL.revokeObjectURL(state.backgroundImageUrl);
      state.backgroundImage = null;
      state.backgroundImageUrl = "";
      q("[data-pp-background-image]").value = "";
      q("[data-pp-color-status]").textContent = "Using the selected background color.";
      updateResultAfterColor();
    });

    qa("[data-pp-photo-unit]").forEach(function (button) {
      button.addEventListener("click", function () { setPhotoUnit(button.dataset.ppPhotoUnit); });
    });

    q("[data-pp-photo-preset]").addEventListener("change", function (event) {
      const index = Number(event.target.value);
      if (!Number.isInteger(index) || !PHOTO_PRESETS[index]) return;
      const preset = PHOTO_PRESETS[index];
      if (preset.unit === "cm") {
        state.photoUnit = "cm";
        state.photoW = preset.w;
        state.photoH = preset.h;
      } else {
        state.photoUnit = "in";
        state.photoW = preset.w;
        state.photoH = preset.h;
      }
      qa("[data-pp-photo-unit]").forEach(function (b) { b.classList.toggle("is-active", b.dataset.ppPhotoUnit === state.photoUnit); });
      updatePhotoSizeUI();
    });

    [q("[data-pp-photo-w]"), q("[data-pp-photo-h]")].forEach(function (input, index) {
      input.addEventListener("input", function () {
        const value = Number(input.value);
        if (index === 0) state.photoW = value;
        else state.photoH = value;
        updatePhotoSizeUI();
      });
    });

    qa("[data-pp-paper-unit]").forEach(function (button) {
      button.addEventListener("click", function () { setPaperUnit(button.dataset.ppPaperUnit); });
    });

    q("[data-pp-paper]").addEventListener("change", function (event) {
      state.paperId = event.target.value;
      updatePaperUI();
      updateCopiesUI();
    });

    [q("[data-pp-margin]"), q("[data-pp-gap]")].forEach(function (input, index) {
      input.addEventListener("input", function () {
        const value = Math.max(0, Number(input.value) || 0);
        if (index === 0) state.margin = value;
        else state.gap = value;
        updatePaperUI();
        updateCopiesUI();
      });
    });

    q("[data-pp-qty]").addEventListener("input", validateQuantity);
    qa("[data-pp-qty-preset]").forEach(function (button) {
      button.addEventListener("click", function () {
        q("[data-pp-qty]").value = button.dataset.ppQtyPreset;
        validateQuantity();
      });
    });

    q("[data-pp-generate]").addEventListener("click", generateSheet);
    q("[data-pp-reset]").addEventListener("click", resetWorkflow);

    qa("[data-pp-back]").forEach(function (button) {
      button.addEventListener("click", function () { goTo(Math.max(0, state.step - 1)); });
    });

    qa("[data-pp-next]").forEach(function (button) {
      if (button.dataset.ppNext !== undefined) button.addEventListener("click", function () { goTo(state.step + 1); });
    });

    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        const target = Number(dot.dataset.ppJump);
        if (target <= state.step) goTo(target);
      });
    });

    function generateSheet() {
      if (!validateQuantity()) return;
      if (!isPhotoSizeValid()) {
        updatePhotoValidation();
        state.step = 4;
        updateHeader();
        return;
      }
      const layout = layoutInfo();
      const requestedDpi = 300;
      const paperW = layout.workingW;
      const paperH = layout.workingH;
      const approxPixels = paperW * requestedDpi * paperH * requestedDpi;
      const dpi = approxPixels > 45_000_000 ? Math.max(150, Math.floor(Math.sqrt(45_000_000 / (paperW * paperH)))) : requestedDpi;
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(paperW * dpi));
      canvas.height = Math.max(1, Math.round(paperH * dpi));
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        setStatus("Your browser could not create the print sheet.", "[data-pp-qty-validation]");
        return;
      }
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const photoCanvas = composePhotoCanvas();
      const pw = layout.photo.w * dpi;
      const ph = layout.photo.h * dpi;
      const gap = layout.gapIn * dpi;
      const margin = layout.marginIn * dpi;
      const cols = layout.useRotated ? Math.max(1, layout.colsR) : Math.max(1, layout.cols);
      const rows = layout.useRotated ? Math.max(1, layout.rowsR) : Math.max(1, layout.rows);
      const capacity = cols * rows;
      const qty = Math.min(state.quantity, capacity);
      const usedW = cols * pw + (cols - 1) * gap;
      const usedH = Math.ceil(qty / cols) * ph + (Math.ceil(qty / cols) - 1) * gap;
      const startX = (canvas.width - usedW) / 2;
      const startY = (canvas.height - usedH) / 2;

      for (let i = 0; i < qty; i++) {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const x = startX + col * (pw + gap);
        const y = startY + row * (ph + gap);
        ctx.drawImage(photoCanvas, x, y, pw, ph);
      }

      state.finalCanvas = canvas;
      q("[data-pp-final]").hidden = false;
      const finalCanvas = q("[data-pp-final-canvas]");
      finalCanvas.width = canvas.width;
      finalCanvas.height = canvas.height;
      const previewScale = Math.min(1, 720 / canvas.width);
      finalCanvas.style.width = Math.round(canvas.width * previewScale) + "px";
      finalCanvas.style.height = Math.round(canvas.height * previewScale) + "px";
      finalCanvas.getContext("2d").drawImage(canvas, 0, 0);
      q("[data-pp-final-summary]").textContent =
        qty + " photo" + (qty === 1 ? "" : "s") + " · " +
        Number(state.photoW).toFixed(2) + " × " + Number(state.photoH).toFixed(2) + " " + state.photoUnit +
        " · " + PAPER_SIZES.find(function (p) { return p.id === state.paperId; }).name +
        " · " + (layout.useRotated ? "landscape layout" : "portrait layout") + " · generated at " + dpi + " DPI.";
      if (dpi < 300) {
        q("[data-pp-final-summary]").textContent += " The selected paper is large, so the browser used a lower DPI to stay within a safe canvas size.";
      }
      q("[data-pp-download-png]").onclick = async function () {
        const blob = await canvasBlob(canvas, "image/png");
        download(blob, "flythebg-passport-photo-sheet.png");
      };
      q("[data-pp-download-jpg]").onclick = async function () {
        const blob = await canvasBlob(canvas, "image/jpeg", 0.95);
        download(blob, "flythebg-passport-photo-sheet.jpg");
      };
      setTimeout(function () {
        q("[data-pp-final]").scrollIntoView({ behavior: "smooth", block: "center" });
      }, 80);
    }

    function resetWorkflow() {
      if (state.sourceUrl) URL.revokeObjectURL(state.sourceUrl);
      if (state.resultImage && state.resultImage.__flyObjectUrl) URL.revokeObjectURL(state.resultImage.__flyObjectUrl);
      state.file = null;
      state.sourceUrl = "";
      state.image = null;
      state.crop = null;
      state.cropAspect = null;
      state.bgMode = "remove";
      state.resultUrl = "";
      state.resultImage = null;
      if (state.backgroundImageUrl) URL.revokeObjectURL(state.backgroundImageUrl);
      state.backgroundImage = null;
      state.backgroundImageUrl = "";
      state.color = "#FFFFFF";
      state.photoUnit = "cm";
      state.photoW = 3.5;
      state.photoH = 4.5;
      state.paperUnit = "cm";
      state.paperId = "a4";
      state.margin = 0.2;
      state.gap = 0.08;
      state.quantity = 1;
      state.finalCanvas = null;
      q("[data-pp-file]").value = "";
      q("[data-pp-source-preview]").hidden = true;
      q("[data-pp-consent]").checked = false;
      q("[data-pp-bg-choice]").classList.add("is-selected");
      qa("[data-pp-bg-choice]").forEach(function (b, i) { b.classList.toggle("is-selected", i === 0); });
      q("[data-pp-ai-note]").hidden = false;
      q("[data-pp-final]").hidden = true;
      q("[data-pp-color]").value = "#FFFFFF";
      q("[data-pp-hex]").value = "#FFFFFF";
      q("[data-pp-r]").value = "255";
      q("[data-pp-g]").value = "255";
      q("[data-pp-b]").value = "255";
      if (q("[data-pp-background-image]")) q("[data-pp-background-image]").value = "";
      setResultBadge();
      updatePhotoSizeUI();
      updatePaperUI();
      state.step = 0;
      updateHeader();
      canGoNextFromUpload();
      setStatus("Choose a photo and accept the notice to continue.");
    }

    window.addEventListener("resize", function () {
      if (state.step === 1) resizeCropCanvas();
    });

    updatePhotoPresetOptions();
    updateHeader();
    resizeCropCanvas();
    setupUpload();
    updatePhotoSizeUI();
    updatePaperUI();
    updateCopiesUI();
    canGoNextFromUpload();
  }

  // Routing is owned by src/app.ts. This module only exposes a deterministic mount function.
  window.__flyPassportWire = makePhotoPage;

})();
