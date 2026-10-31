#!/usr/bin/env python3
"""SFX tambahan Suhuf #03 (Pulau Run): stamp, flip, shuffle, waves, giggle.

Python murni, deterministik, bebas lisensi. Output: public/suhuf-pulau-run/sfx/*.mp3
Run: python3 scripts/gen-sfx-pulau-run.py /path/ke/ffmpeg
"""
import math
import random
import struct
import subprocess
import sys
import tempfile
import wave
from pathlib import Path

SR = 22050
OUT = Path(__file__).resolve().parent.parent / "public" / "suhuf-pulau-run" / "sfx"
FFMPEG = sys.argv[1] if len(sys.argv) > 1 else "ffmpeg"
rnd = random.Random(1616)
OUT.mkdir(parents=True, exist_ok=True)


def save(name, samples, peak=0.5):
    m = max(1e-9, max(abs(s) for s in samples))
    data = b"".join(struct.pack("<h", int(max(-1, min(1, s / m * peak)) * 32767)) for s in samples)
    with tempfile.TemporaryDirectory() as d:
        w = str(Path(d) / "x.wav")
        with wave.open(w, "wb") as f:
            f.setnchannels(1)
            f.setsampwidth(2)
            f.setframerate(SR)
            f.writeframes(data)
        subprocess.run([FFMPEG, "-y", "-v", "error", "-i", w, "-b:a", "96k", str(OUT / (name + ".mp3"))], check=True)
    print("ok", name, round(len(samples) / SR, 2), "s")


def lp(xs, a):
    y, out = 0.0, []
    for x in xs:
        y += a * (x - y)
        out.append(y)
    return out


# stamp: benturan rendah + klik pendek
n = int(SR * 0.32)
st = []
for k in range(n):
    t = k / SR
    f = 150 * math.exp(-t * 9) + 50
    s = math.sin(2 * math.pi * f * t) * math.exp(-t * 14)
    if t < 0.012:
        s += (rnd.random() * 2 - 1) * (1 - t / 0.012) * 0.9
    st.append(s)
save("stamp", st, 0.8)

# flip: dua kepakan kartu
n = int(SR * 0.34)
raw = lp([rnd.random() * 2 - 1 for _ in range(n)], 0.55)
fl = []
for k, v in enumerate(raw):
    t = k / SR
    e = math.exp(-(((t - 0.06) / 0.035) ** 2)) + 0.8 * math.exp(-(((t - 0.19) / 0.05) ** 2))
    fl.append(v * e)
save("flip", fl, 0.6)

# shuffle: banyak letupan noise pendek
n = int(SR * 0.9)
sh = [0.0] * n
t0 = 0.02
while t0 < 0.8:
    i = int(t0 * SR)
    ln = int(SR * rnd.uniform(0.012, 0.03))
    for k in range(ln):
        if i + k < n:
            sh[i + k] += (rnd.random() * 2 - 1) * (1 - k / ln) * rnd.uniform(0.4, 1.0)
    t0 += rnd.uniform(0.025, 0.06)
save("shuffle", lp(sh, 0.6), 0.55)

# waves: dua ayunan ombak
n = int(SR * 3.0)
nz = lp([rnd.random() * 2 - 1 for _ in range(n)], 0.12)
wv = []
for k, v in enumerate(nz):
    t = k / SR
    e = (0.5 + 0.5 * math.sin(2 * math.pi * t / 1.5 - 1.2)) ** 2
    wv.append(v * e * min(1, t / 0.2) * min(1, (3.0 - t) / 0.4))
save("waves", wv, 0.5)

# giggle: tiga kicau naik kecil
gg = []
for f0 in (620, 760, 900):
    ln = int(SR * 0.075)
    for k in range(ln):
        t = k / SR
        gg.append(math.sin(2 * math.pi * (f0 + 160 * t / 0.075) * t) * math.sin(math.pi * k / ln) ** 0.7)
    gg += [0.0] * int(SR * 0.035)
save("giggle", gg, 0.5)
