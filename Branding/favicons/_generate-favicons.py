"""
Génère les favicons PNG + .ico depuis le mark RADAR.
Reproduit fidèlement Branding/logo/mark.svg en pixels via PIL.

Usage: python Branding/favicons/_generate-favicons.py
"""
from __future__ import annotations
import os
import math
from pathlib import Path

from PIL import Image, ImageDraw

HERE = Path(__file__).parent
ROYAL       = (34, 81, 255, 255)   # #2251FF — Brand primary
ROYAL_LIGHT = (79, 115, 255, 255)  # #4F73FF — signal détecté (différencié des arcs)

# Coordonnées du mark (espace logique 64x64) — alignées sur logo/mark.svg
ORIGIN_X, ORIGIN_Y = 14, 50
ORIGIN_R = 3
ARC_RADII = [12, 24, 36]
ARC_OPACITIES = [1.0, 0.6, 0.3]
SIGNAL_X, SIGNAL_Y = 45, 22
SIGNAL_R = 2.5
STROKE_WIDTH = 3


def royal_with_alpha(opacity: float) -> tuple[int, int, int, int]:
    return ROYAL[0], ROYAL[1], ROYAL[2], int(255 * opacity)


def render_mark(size: int) -> Image.Image:
    """Rend le mark RADAR à une taille donnée, fond transparent."""
    # On dessine en supersampling x4 pour des arcs propres, puis on downscale
    SS = 4
    s = size * SS
    scale = s / 64.0  # facteur de mise à l'échelle vs viewBox 64x64

    img = Image.new("RGBA", (s, s), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Stroke épaisseur, mise à l'échelle
    sw = max(1, int(STROKE_WIDTH * scale))

    # 1. Origin dot (royal plein)
    cx, cy = ORIGIN_X * scale, ORIGIN_Y * scale
    rr = ORIGIN_R * scale
    draw.ellipse(
        (cx - rr, cy - rr, cx + rr, cy + rr),
        fill=ROYAL,
    )

    # 2. Arcs concentriques quart de cercle (top-right) depuis (ORIGIN_X, ORIGIN_Y)
    # Dans PIL, arc(box, start, end) — angles en degrés, 0 = 3h, sens horaire
    # Pour un arc qui va de 12h à 3h (top-right quadrant) : start=270, end=360
    for radius, opacity in zip(ARC_RADII, ARC_OPACITIES):
        bbox = (
            (ORIGIN_X - radius) * scale,
            (ORIGIN_Y - radius) * scale,
            (ORIGIN_X + radius) * scale,
            (ORIGIN_Y + radius) * scale,
        )
        # On utilise un layer séparé pour gérer la transparence
        if opacity < 1.0:
            layer = Image.new("RGBA", img.size, (0, 0, 0, 0))
            layer_draw = ImageDraw.Draw(layer)
            layer_draw.arc(bbox, start=270, end=360, fill=ROYAL, width=sw)
            # Applique l'opacité sur le canal alpha du layer
            r, g, b, a = layer.split()
            a = a.point(lambda px: int(px * opacity))
            layer = Image.merge("RGBA", (r, g, b, a))
            img = Image.alpha_composite(img, layer)
            draw = ImageDraw.Draw(img)
        else:
            draw.arc(bbox, start=270, end=360, fill=ROYAL, width=sw)

    # 3. Signal détecté (royal-light pour différencier des arcs)
    sx, sy = SIGNAL_X * scale, SIGNAL_Y * scale
    sr = SIGNAL_R * scale
    draw.ellipse(
        (sx - sr, sy - sr, sx + sr, sy + sr),
        fill=ROYAL_LIGHT,
    )

    # Downscale anti-alias
    return img.resize((size, size), Image.LANCZOS)


def main() -> None:
    sizes = [16, 32, 48, 64, 96, 180, 192, 512]
    for size in sizes:
        img = render_mark(size)
        out = HERE / f"favicon-{size}.png"
        img.save(out, "PNG", optimize=True)
        print(f"  ✓ {out.name}  ({size}x{size}, {out.stat().st_size} bytes)")

    # apple-touch-icon (alias de 180x180 sans suffixe pour conformité Apple)
    apple = HERE / "apple-touch-icon.png"
    render_mark(180).save(apple, "PNG", optimize=True)
    print(f"  ✓ {apple.name}")

    # favicon.ico multi-tailles (16, 32, 48)
    ico = HERE / "favicon.ico"
    render_mark(48).save(
        ico,
        format="ICO",
        sizes=[(16, 16), (32, 32), (48, 48)],
    )
    print(f"  ✓ {ico.name}  (multi-size 16/32/48)")

    print("\nGénération favicons terminée.")


if __name__ == "__main__":
    main()
