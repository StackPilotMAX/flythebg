#!/usr/bin/env python3
"""Local video compressor using an installed FFmpeg binary."""

from pathlib import Path
import argparse
import shutil
import subprocess

def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("input", type=Path)
    parser.add_argument("-o", "--output", type=Path)
    parser.add_argument("--crf", type=int, default=30)
    args = parser.parse_args()
    ffmpeg = shutil.which("ffmpeg")
    if not ffmpeg:
        raise SystemExit("FFmpeg is required and must be available on PATH.")
    destination = args.output or args.input.with_name(args.input.stem + "-compressed.webm")
    crf = max(18, min(45, args.crf))
    command = [
        ffmpeg, "-hide_banner", "-loglevel", "error", "-y",
        "-i", str(args.input), "-vf", "scale='min(1280,iw)':-2",
        "-c:v", "libvpx-vp9", "-crf", str(crf), "-b:v", "0",
        "-c:a", "libopus", "-b:a", "96k", str(destination),
    ]
    subprocess.run(command, check=True)
    print(f"Saved: {destination}")

if __name__ == "__main__":
    main()
