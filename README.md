# FlyThe BG — flythebg.com

FlyThe BG is an independent, non-registered media-tools project.

## Architecture

- **Cloudflare Pages** hosts the static website and Pages Functions.
- **TypeScript** (`src/`) contains the browser media-tool source and strict types.
- **Python** (`tools/`) provides a real local `rembg` workflow for anyone cloning the AGPL repository.
- **Cloudflare Function** (`functions/api/remove-bg.js`) proxies background-removal requests to the private Hugging Face Space.
- Image/video compression is browser-side; those files are not uploaded to FlyThe BG.
- No Hugging Face credential is stored in source code.

The repository deliberately contains substantial TypeScript and Python source instead of making everything a single HTML/JavaScript file. TypeScript is compiled for the browser runtime; Python is the local/offline path for running `rembg` without the hosted API.

## Production setup

Cloudflare Pages:

1. Connect `StackPilotMAX/flythebg`.
2. Build command: `npm run build`
3. Build output directory: `.`
4. Set these **Cloudflare dashboard secrets only**:
   - `HF_ACCESS_TOKEN`
   - `HF_SPACE_URL`
   - `HF_SPACE_API` (usually `predict`, depending on the Space API name)

Never put these values in HTML, TypeScript, Python, GitHub Actions, or committed configuration.

## Hugging Face / Gradio note

The private Space API shape must match the endpoint configured by `HF_SPACE_API`. The Pages Function uses Gradio's HTTP call/event pattern and normalizes common URL/data outputs. If the Space exposes a custom input component or a different API name, set the exact API name from the Space's **Use via API** panel.

## Local Python background remover

A clone can run background removal locally:

```bash
python -m venv .venv
# Windows: .venv\\Scripts\\activate
# macOS/Linux: source .venv/bin/activate
pip install -r tools/requirements.txt
python tools/rembg_local.py photo.jpg
```

This path does not need `HF_ACCESS_TOKEN` and does not contact FlyThe BG.

## Licensing

The project is distributed under **AGPL-3.0**. The hosted service's private deployment credentials are configuration, not source code. Cloning the repository does not reveal the production Hugging Face token.

## Current tools

- Background Remover — private Hugging Face `rembg` backend
- Image Compressor — browser-side
- Video Compressor — browser-side

Future tools can be added without moving user media to the server unless their architecture explicitly requires it.

Contact: stackpilotfe@outlook.com
