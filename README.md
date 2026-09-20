# FlyThe BG — flythebg.com

Plain static site + one Cloudflare Pages Function. No framework, no build step.

```
index.html                    Home: hero, about, live tool, FAQ, footer
privacy-policy.html           Legal
terms-of-service.html         Legal
functions/api/remove-bg.js    POST /api/remove-bg — the real backend
_headers                      Basic security headers
wrangler.toml                 Local `wrangler pages dev` config only
```

## Deploy (Cloudflare Pages dashboard)

1. Connect this GitHub repo (`StackPilotMAX/flythebg`) to a new Pages project.
2. Framework preset: **None**. Build command: *(leave empty)*. Output directory: `/`.
3. Settings → Environment variables (Production **and** Preview) — never commit these:
   - `HF_ACCESS_TOKEN` — your Hugging Face token
   - `HF_SPACE_URL` — e.g. `https://your-username-your-space.hf.space`
   - `HF_SPACE_API` — `predict` (default) or `queue`, see note below
4. Push to `main` → Pages auto-builds and deploys. No secrets live in this repo.

## One thing to verify before going live

Open your Space's **"Use via API"** panel once to confirm the exact input/output
shape (Gradio 3.x apps use a sync `/run/predict`; 4.x/5.x often use an async
`/call/<name>` + poll pattern). Both are implemented in
`functions/api/remove-bg.js`, switched by `HF_SPACE_API`; adjust the `TODO`
block there if your Space's field names differ.
