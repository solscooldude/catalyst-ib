#!/usr/bin/env python3
"""Key studio-grey plates to soft-edged transparent WebP cutouts."""

from __future__ import annotations

from collections import deque
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

SRC = Path("/tmp/sprites-all/sprites")
DEST = Path("/workspace/public/sprites")
SPECIES = ("fox", "bunny", "deer", "cat", "axolotl", "dragon")
STAGES = ("egg", "hatchling", "growing", "luminary", "ethereal")
OUT_SIZE = 512
MIN_OPAQUE = 0.045 * OUT_SIZE * OUT_SIZE


def luma_of(rgb: np.ndarray) -> np.ndarray:
    return 0.2126 * rgb[..., 0] + 0.7152 * rgb[..., 1] + 0.0722 * rgb[..., 2]


def border_seed(arr: np.ndarray) -> tuple[np.ndarray, float, float]:
    border = np.concatenate(
        [arr[0], arr[-1], arr[:, 0], arr[:, -1], arr[1], arr[-2], arr[:, 1], arr[:, -2]],
        axis=0,
    )
    seed = np.median(border, axis=0)
    dist = np.sqrt(((border - seed) ** 2).sum(axis=1))
    thr = float(min(24.0, max(14.0, np.percentile(dist, 88) * 1.35)))
    return seed, thr, float(luma_of(seed))


def flood_background(arr: np.ndarray) -> np.ndarray:
    h, w, _ = arr.shape
    seed, dist_thr, seed_luma = border_seed(arr)
    chroma = arr.max(axis=2) - arr.min(axis=2)
    dist = np.sqrt(((arr - seed) ** 2).sum(axis=2))
    luma = luma_of(arr)

    def is_bg(y: int, x: int) -> bool:
        d = float(dist[y, x])
        c = float(chroma[y, x])
        L = float(luma[y, x])
        if c > 28:
            return False
        # Black fur is darker than mid-grey studio — never key it.
        if seed_luma > 22 and L < seed_luma - 10:
            return False
        if d <= dist_thr and c < 18:
            return True
        if d <= 12 and c < 14:
            return True
        return False

    visited = np.zeros((h, w), dtype=bool)
    bg = np.zeros((h, w), dtype=bool)
    queue: deque[tuple[int, int]] = deque()
    for x in range(w):
        queue.append((0, x))
        queue.append((h - 1, x))
    for y in range(h):
        queue.append((y, 0))
        queue.append((y, w - 1))

    while queue:
        y, x = queue.popleft()
        if visited[y, x]:
            continue
        visited[y, x] = True
        if not is_bg(y, x):
            continue
        bg[y, x] = True
        if y + 1 < h and not visited[y + 1, x]:
            queue.append((y + 1, x))
        if y > 0 and not visited[y - 1, x]:
            queue.append((y - 1, x))
        if x + 1 < w and not visited[y, x + 1]:
            queue.append((y, x + 1))
        if x > 0 and not visited[y, x - 1]:
            queue.append((y, x - 1))

    return bg


def square_from_rgba(cropped: Image.Image) -> Image.Image:
    cw, ch = cropped.size
    side = max(cw, ch)
    canvas = Image.new("RGBA", (side, side), (0, 0, 0, 0))
    canvas.paste(cropped, ((side - cw) // 2, (side - ch) // 2), cropped)
    return canvas.resize((OUT_SIZE, OUT_SIZE), Image.Resampling.LANCZOS)


def cutout(path: Path) -> Image.Image:
    rgb = Image.open(path).convert("RGB")
    arr = np.asarray(rgb).astype(np.float32)
    bg = flood_background(arr)
    alpha = np.where(bg, 0, 255).astype(np.uint8)
    aimg = Image.fromarray(alpha, "L")
    aimg = aimg.filter(ImageFilter.MinFilter(3))
    aimg = aimg.filter(ImageFilter.GaussianBlur(radius=1.4))
    alpha = np.asarray(aimg)
    ys, xs = np.where(alpha > 24)
    if xs.size == 0:
        return fallback_square(rgb)
    pad = 20
    h, w = alpha.shape
    x0, x1 = max(0, int(xs.min()) - pad), min(w, int(xs.max()) + 1 + pad)
    y0, y1 = max(0, int(ys.min()) - pad), min(h, int(ys.max()) + 1 + pad)
    cropped = Image.fromarray(
        np.dstack([arr[y0:y1, x0:x1].astype(np.uint8), alpha[y0:y1, x0:x1]]),
        "RGBA",
    )
    out = square_from_rgba(cropped)
    opaque = int((np.asarray(out.getchannel("A")) > 200).sum())
    if opaque < MIN_OPAQUE:
        return fallback_square(rgb)
    return out


def fallback_square(rgb: Image.Image) -> Image.Image:
    """Keep the painted subject; dark studio stays (room is already dark)."""
    w, h = rgb.size
    side = min(w, h)
    left = (w - side) // 2
    top = max(0, (h - side) // 2 - side // 12)
    crop = rgb.crop((left, top, left + side, top + side)).resize(
        (OUT_SIZE, OUT_SIZE),
        Image.Resampling.LANCZOS,
    )
    return crop.convert("RGBA")


def main() -> None:
    DEST.mkdir(parents=True, exist_ok=True)
    for species in SPECIES:
        out_dir = DEST / species
        out_dir.mkdir(parents=True, exist_ok=True)
        for stage in STAGES:
            src = SRC / species / f"{stage}.png"
            dest = out_dir / f"{stage}.webp"
            if not src.exists():
                raise FileNotFoundError(src)
            plate = cutout(src)
            plate.save(dest, "WEBP", quality=86, method=6)
            a = np.asarray(plate.getchannel("A"))
            print(
                f"{species}/{stage}.webp {dest.stat().st_size} "
                f"opaque={(a > 200).sum()} soft={((a > 0) & (a <= 200)).sum()} "
                f"clear={(a == 0).sum()}",
                flush=True,
            )


if __name__ == "__main__":
    main()
