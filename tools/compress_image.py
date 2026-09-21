#!/usr/bin/env python3
"""Local image compressor. Source files never leave the machine."""

from pathlib import Path
import argparse
from PIL import Image

def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("input", type=Path)
    parser.add_argument("-o", "--output", type=Path)
    parser.add_argument("--quality", type=int, default=72)
    parser.add_argument("--max-side", type=int, default=2400)
    args = parser.parse_args()
    quality = max(1, min(95, args.quality))
    with Image.open(args.input) as image:
        image = image.convert("RGB")
        image.thumbnail((args.max_side, args.max_side), Image.Resampling.LANCZOS)
        destination = args.output or args.input.with_name(args.input.stem + "-compressed.jpg")
        image.save(destination, "JPEG", quality=quality, optimize=True)
    print(f"Saved: {destination}")

if __name__ == "__main__":
    main()
