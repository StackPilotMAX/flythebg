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

## Cloudflare Pages deployment

Use the GitHub repository directly on the main branch.

Build settings:
- Framework preset: None
- Build command: npm run build
- Build output directory: .
- Production branch: main

The build compiles src/app.ts to assets/app.js.

### Required Cloudflare environment secrets

Set these in the Cloudflare Pages project under the production environment:

- HF_ACCESS_TOKEN — Secret
- HF_SPACE_URL — environment variable
- HF_SPACE_API — exact Gradio API name from the private Space's Use via API panel

Never put the Hugging Face token in GitHub, HTML, TypeScript, Python, wrangler.toml, public build output, localStorage or sessionStorage.

### Cloudflare security settings

Enable/configure in the Cloudflare dashboard:

- Always Use HTTPS
- Modern TLS settings
- WAF managed rules
- Bot protection appropriate to your traffic
- Rate limiting for POST /api/remove-bg
- Conservative per-IP upload/request limits
- Security notifications for the zone
- Do not cache /api/*

The repository _headers file is an application-level layer; dashboard controls should remain enabled as a second layer.

## Hugging Face / Gradio

The exact private Space API schema is deployment-specific. HF_SPACE_API must match the API name exposed by the Space. The function uses the Gradio HTTP call/event pattern and supports common URL/data outputs.

Before production use, test the private Space's exact FileData input/output schema. The repository deliberately does not hard-code or publish the private Space credential.

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
