# Local Python tools

FlyThe BG keeps the hosted Hugging Face credentials out of the repository.

To run background removal entirely on your own machine:

    python -m venv .venv
    # Windows: .venv\\Scripts\\activate
    # macOS/Linux: source .venv/bin/activate
    pip install -r tools/requirements.txt
    python tools/rembg_local.py input.jpg

The hosted website does not call this Python file. The website uses the
private Hugging Face Space through the Cloudflare Pages Function.
