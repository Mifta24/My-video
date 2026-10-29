#!/usr/bin/env python3
# Contact sheet 2x2 dari beberapa PNG: sheet.py out.png a.png b.png c.png d.png
import sys
from PIL import Image, ImageDraw
out, *fs = sys.argv[1:]
W, H = 960, 540
sh = Image.new("RGB", (W*2, H*2), "white")
for i, f in enumerate(fs[:4]):
    im = Image.open(f).convert("RGB").resize((W, H))
    d = ImageDraw.Draw(im); d.text((8, 8), f.split("_")[-1][:-4], fill=(255, 0, 0))
    sh.paste(im, ((i % 2)*W, (i//2)*H))
sh.save(out)
