#!/usr/bin/env python3
"""Generate the social share images public/og.png (EN) and public/og-zh.png (ZH).

1200x630, paper-and-ink style matching the site: #FAF9F6 paper, #1A1A1A ink,
one ink-blue accent (#1e4d8c). The book mark redraws public/favicon.svg at
large size (outer outline + centre spine + faint text lines on both pages).
Rerun after changing the site name or tagline:  python3 scripts/make-og.py
"""
import os
import random
from PIL import Image, ImageDraw, ImageFont

random.seed(42)
W, H = 1200, 630
PAPER = (250, 249, 246)
INK = (26, 26, 26)
GREY = (168, 164, 156)
SUB = (74, 72, 68)
ACCENT = (30, 77, 140)
OUT_DIR = "public"

SERIF_LATIN = "/usr/share/fonts/truetype/noto/NotoSerif-Bold.ttf"
SERIF_CJK_TTC = "/usr/share/fonts/opentype/noto/NotoSerifCJK-Bold.ttc"


def latin(size):
    return ImageFont.truetype(SERIF_LATIN, size)


def cjk(size, index=2):
    # NotoSerifCJK-Bold.ttc face order: 0 JP, 1 KR, 2 SC, 3 TC, 4 HK
    return ImageFont.truetype(SERIF_CJK_TTC, size, index=index)


def paper_bg():
    img = Image.new("RGB", (W, H), PAPER)
    px = img.load()
    for _ in range(W * H // 120):
        x, y = random.randrange(W), random.randrange(H)
        d = random.randint(-4, 4)
        p = px[x, y]
        px[x, y] = (p[0] + d, p[1] + d, p[2] + d)
    return img


def draw_book(d, cx, cy, s):
    """Open book in the favicon's geometry: outline, spine, faint text lines."""
    w2, h2 = s * 0.82, s * 0.92
    x0, y0, x1, y1 = cx - w2 / 2, cy - h2 / 2, cx + w2 / 2, cy + h2 / 2
    d.rectangle([x0, y0, x1, y1], outline=INK, width=9)
    d.line([cx, y0, cx, y1], fill=INK, width=5)
    for side in (-1, 1):
        for i in range(5):
            ly = y0 + h2 * (0.22 + i * 0.14)
            a = cx + side * w2 * 0.10
            b = cx + side * w2 * 0.40
            d.line([min(a, b), ly, max(a, b), ly], fill=GREY, width=5)


def make(lines, sub, headline_font, sub_font, hsize, wordmark_y, start_y, gap, path):
    img = paper_bg()
    d = ImageDraw.Draw(img)
    # double hairline frame, like a library catalog card
    d.rectangle([36, 36, W - 36, H - 36], outline=(90, 86, 80), width=2)
    d.rectangle([46, 46, W - 46, H - 46], outline=(178, 174, 166), width=1)

    draw_book(d, 268, H // 2, 300)

    tx = 500
    d.text((tx, wordmark_y), " ".join(list("NAV.E-INK.ME")), font=latin(30), fill=ACCENT)
    y = start_y
    for line in lines:
        d.text((tx, y), line, font=headline_font, fill=INK)
        y += gap
    rule_y = start_y + (len(lines) - 1) * gap + int(hsize * 1.28)
    d.rectangle([tx + 2, rule_y, tx + 66, rule_y + 4], fill=ACCENT)
    d.text((tx, rule_y + 40), sub, font=sub_font, fill=SUB)
    img.save(path, optimize=True)
    print("wrote", path)


if __name__ == "__main__":
    os.makedirs(OUT_DIR, exist_ok=True)
    make(["Legal Ebook", "Resources"],
         "Libraries · Stores · Loans · Apps · Tools",
         latin(74), latin(32), 74, 150, 200, 86, f"{OUT_DIR}/og.png")
    make(["电子书资源导航"],
         "免费书库 · 商城 · 借阅 · 应用 · 工具",
         cjk(84), cjk(40), 84, 172, 224, 86, f"{OUT_DIR}/og-zh.png")
