# FlyThe BG

FlyThe BG is an independent, non-registered media-tools project.

## Major architecture

The public website is intentionally HTML-light:

- index.html is only the secure document shell and mount point.
- src/app.ts owns routing, UI rendering, tool state and browser behavior.
- assets/site.css owns presentation.
- Cloudflare Pages Functions provide the small server-side boundary.
- tools/*.py provides real local Python utilities for rembg, image compression and FFmpeg video compression.
- The hosted background-removal processor is the only workflow that requires a server request.
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
8. Processor boundary: the Hugging Face credential is read only by the Cloudflare Function. Processor retention and contractual settings must be configured in the external service.
9. No advertising tracker in the application: the source does not bundle analytics/advertising tracking code. Any future advertising integration must be separately reviewed for privacy, notice and consent implications.

### Important legal status

The DPDP Act 2023 and Digital Personal Data Protection Rules 2025 are the governing sources, and the Rules have staged commencement. This repository therefore uses a future-ready implementation rather than claiming that the website is legally certified compliant. Legal applicability and obligations depend on the actual operation, users, processing, exemptions and applicable commencement dates.

Official sources:
- https://www.meity.gov.in/static/uploads/2024/02/Digital-Personal-Data-Protection-Act-2023-1.pdf
- https://www.meity.gov.in/static/uploads/2025/11/53450e6e5dc0bfa85ebd78686cadad39.pdf

## Cloudflare Workers deployment

Production runs on Cloudflare Workers + Workers Assets. Keep the repository on the `main` branch; production changes are committed directly there.

Build:
- `npm install`
- `npm run build`
- `npx wrangler deploy`

Required Cloudflare secret:
- `HF_ACCESS_TOKEN` — Secret only.

The private Hugging Face Space and API name are fixed in the server-side Worker. Never put the Hugging Face token in GitHub, HTML, TypeScript, public build output, localStorage, sessionStorage or `wrangler.toml`.

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

The old multi-page HTML files were removed so the application has one UI shell. Cloudflare Pages _redirects provides clean SPA routes.

## Licensing

AGPL-3.0.

## Contact

stackpilotfe@outlook.com

This address is used because FlyThe BG is currently an independent, non-registered project.
