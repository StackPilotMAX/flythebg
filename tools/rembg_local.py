#!/usr/bin/env python3
"""
FlyThe BG local background-removal helper.

This is intentionally separate from the hosted Cloudflare Function.
It lets someone who clones the AGPL repository run rembg locally without
putting a hosted Hugging Face credential into the clone.
"""

from pathlib import Path
import argparse

from PIL import Image
from rembg import remove


def process(source: Path, destination: Path) -> None:
    with Image.open(source) as image:
        output = remove(image)
        output.save(destination, "PNG")


def main() -> None:
    parser = argparse.ArgumentParser(description="Remove an image background locally with rembg.")
    parser.add_argument("input", type=Path)
    parser.add_argument("-o", "--output", type=Path)
    args = parser.parse_args()

    destination = args.output or args.input.with_name(args.input.stem + "-no-bg.png")
    process(args.input, destination)
    print(f"Saved: {destination}")


if __name__ == "__main__":
    main()
