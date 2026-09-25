# FlyThe BG

## Deployment status and private-repository access

**GitHub repository:** `StackPilotMAX/flythebg` (currently private; production branch: `main`). **Hosting:** Cloudflare Workers with static Workers Assets; this is not a Netlify deployment. GitHub Actions typechecking/build success does **not** prove that Cloudflare's Git-connected builder can clone the repository or deploy the domain.

If Cloudflare stays at **Initializing** and never reaches cloning, installing or building, the failure is upstream of this project's build scripts. In Cloudflare, check the Workers Builds GitHub connection and verify the Cloudflare GitHub app has access to this **private** repository. Re-authorize/reconnect the app if the repository was made private after the integration was established. Also check Cloudflare's status and build logs. A source-code commit cannot force Cloudflare's initialization queue to advance.

**Independent fallback:** GitHub Actions > **Deploy Cloudflare (GitHub fallback)** > Run workflow on `main`. This route builds in GitHub and deploys via Cloudflare's API, avoiding Cloudflare's Git clone/build pipeline. Configure `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` as GitHub Actions secrets; the token needs the account's Workers Scripts Edit permission. Set `HF_ACCESS_TOKEN` **only** as a Cloudflare production Worker runtime secret, not a GitHub build secret. This fallback is manual so it does not race Cloudflare auto-deployments. See [deployment recovery runbook](docs/DEPLOYMENT_RUNBOOK.md).

### Public repository and secret-safety policy

The repository may be made public only after reviewing **the entire Git history**, not just current files. Never commit or paste actual Hugging Face, GitHub, Cloudflare or other API tokens, private keys, `.dev.vars`, `.env` files or credentials into source, docs, screenshots, workflow YAML or build logs. `.env.example` must contain placeholders only. Production credentials belong in Cloudflare Worker runtime secrets; GitHub deployment credentials belong in GitHub Actions encrypted secrets.

Both CI and manual deployment run `node scripts/check-secrets.mjs`, which checks the **current working tree** for several recognizable token/key patterns without printing detected values. This is a preventive check, **not proof that no credentials have ever been leaked**. It cannot detect every token format, previous commits, deleted files, forks, external logs or screenshots. Enable GitHub secret scanning and push protection where available. Before switching visibility to public, inspect full history with a dedicated scanner such as Gitleaks, review Actions logs and rotate/revoke any credential ever committed or exposed. Removing a token from the latest commit or making the repository private does not revoke it.

The deploy script never embeds `HF_ACCESS_TOKEN` into build artifacts or writes it to a temporary file. It uses Wrangler; configure runtime secrets separately. Do not print environment variables in CI. If any secret may have been exposed, **revoke and rotate it before publishing**.


FlyThe BG is an independent, non-registered media-tools project.

## Major architecture

The public website is intentionally HTML-light:

- index.html is only the secure document shell and mount point.
- src/app.ts owns routing, UI rendering, tool state and browser behavior.
- assets/site.css owns presentation.
- A Cloudflare Worker provides the server-side boundary; its background-removal handler lives in `functions/api/remove-bg.js`.
- tools/*.py provides real local Python utilities for rembg, image compression and FFmpeg video compression.
- The hosted background-removal processor is the only workflow that requires a server request.
- Background removal runs through the FlyThe BG Cloudflare Worker and a Hugging Face Spaces-hosted rembg processor; FlyThe BG does not provide persistent image storage, a storage bucket or an image gallery.
- Image/video compression is browser-local and does not upload the source file.

## DPDP Act 2023 / Rules 2025 design review

The site has been redesigned around the main operational principles relevant to a small service processing digital personal data in India:

1. Clear notice: the privacy page explains categories of data, purposes, the background-removal processor boundary, rights and contact route.
2. Purpose-specific action: background removal shows a processing notice and requires an affirmative checkbox before upload.
3. Data minimisation: no account is required; compression stays in the browser; background removal accepts only the required image types and has a 15 MB limit.
4. No intentional image library: the application does not expose an account or persistent image gallery.
5. Rights/grievance route: the privacy page publishes the project email for access, correction, erasure, consent and grievance requests.
6. Children: the privacy notice acknowledges the Act's under-18 definition and avoids intentionally designing the service to solicit children's data.
7. Security: same-origin API routing, HTTPS deployment, CSP, HSTS, nosniff, restrictive permissions, no client-side AI credential, no-store API responses, type/size validation and robots exclusion for /api/.
8. Processor boundary: the Hugging Face credential is read only by the Cloudflare Function. The rembg model runs on Hugging Face Spaces. FlyThe BG does not intentionally retain uploaded background-removal images after the processing flow, but the external Gradio runtime can create transient processing files while a request is running. Space-level cleanup/retention must be configured and verified separately.
10. Request isolation: each background-removal request is expected to receive only its own result. The Space application must not use shared global image state or shared filenames that could cross requests.
11. Retention transparency: FlyThe BG does not claim that an external processor has zero transient storage unless that behavior has been technically verified. The privacy notice describes this boundary explicitly.
9. No advertising tracker in the application: the source does not bundle analytics/advertising tracking code. Any future advertising integration must be separately reviewed for privacy, notice and consent implications.

### Important legal status

The DPDP Act 2023 and Digital Personal Data Protection Rules 2025 are the governing sources, and the Rules have staged commencement. This repository therefore uses a future-ready implementation rather than claiming that the website is legally certified compliant. Legal applicability and obligations depend on the actual operation, users, processing, exemptions and applicable commencement dates.

Official sources:
- https://www.meity.gov.in/static/uploads/2024/02/Digital-Personal-Data-Protection-Act-2023-1.pdf
- https://www.meity.gov.in/static/uploads/2025/11/53450e6e5dc0bfa85ebd78686cadad39.pdf

## Hugging Face Spaces / rembg processing

FlyThe BG uses Hugging Face Spaces as the hosted AI processing boundary for background removal. The source image is sent only after the user explicitly selects it, accepts the processing notice and starts the operation. The website does not expose the Hugging Face credential to the browser.

A public Space is not automatically the same thing as a storage service: Hugging Face documents that Spaces can be public, protected or private, and Gradio may create temporary files for uploaded inputs and outputs while processing. Public visibility also makes the Space source visible and the running app directly accessible. For a privacy-first deployment, keep the Space private when the account/plan and integration permit it; use protected visibility if available and you need the app reachable without publishing source code. citeturn0search0turn0search5

User 1 and User 2 should receive results associated with their own request/event. This isolation must be enforced by the Space application itself: do not use shared global variables, fixed shared filenames, persistent image queues, or a shared output file for concurrent requests. Temporary uploaded/processed files should be cleaned up after the request where the Space implementation permits it. Gradio documents that uploaded files can be temporary runtime files and can be exposed through its file-serving mechanisms, so the Space should use the latest secure configuration and minimal allowed paths. citeturn0search4turn0search6

The FlyThe BG privacy notice therefore says **no intentional persistent FlyThe BG image storage**, rather than making the stronger and unverifiable claim that no transient bytes can ever exist inside the external processor.

Production runs on Cloudflare Workers + Workers Assets. Keep the repository on the `main` branch; production changes are committed directly there.

Build:
- `npm install`
- `npm run build`
- `npx wrangler deploy`

Required Cloudflare secret:
- `HF_ACCESS_TOKEN` — Secret only.

The Hugging Face Space and API endpoint are fixed in the server-side Worker. The rembg model can take around 20–25 seconds to start after a cold start; the Worker provides a 35-second startup grace period before reporting that the processor did not become ready. Never put the Hugging Face token in GitHub, HTML, TypeScript, public build output, localStorage, sessionStorage or `wrangler.toml`.

The browser may read the public GitHub repository API only to show the current star count. It does not use a GitHub token.

### Support payments

The `/support` page links to `https://www.buymeacoffee.com/flythebg`. Payment is completed on Buy Me a Coffee's own page. FlyThe BG does not process cards, verify payment status, or mark a user as having paid after a redirect.

### Brand / trademark notice

FlyThe BG is independent. OpenAI, GPT, ChatGPT, Anthropic, Claude, Google, Gemini, xAI, Grok, Hugging Face, GitHub, Buy Me a Coffee and other names or marks referenced in the site belong to their respective owners. References are descriptive and do not imply sponsorship, endorsement, partnership or ownership by FlyThe BG.

## Local Python

Create a local environment:

    python -m venv .venv
    pip install -r tools/requirements.txt

Background removal:

    python tools/rembg_local.py photo.jpg

Image compression:

    python tools/compress_image.py photo.jpg --quality 72

Video compression requires FFmpeg:

    python tools/compress_video.py video.mp4

These local workflows do not need the hosted Hugging Face token.

## Routes

- /
- /features
- /about
- /faq
- /privacy
- /terms
- /contact

The application uses one UI shell. Workers Assets SPA fallback handles clean routes.

## Licensing

AGPL-3.0.

## Contact

support@flythebg.com

This is the official FlyThe BG support address for product questions, privacy requests, security reports and project communication.
