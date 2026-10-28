#!/usr/bin/env python3
"""SFX + musik latar prosedural (numpy, tanpa unduhan => bebas lisensi) untuk Suhuf #02 Mitos 10:1.
Output: public/suhuf-bakteri/sfx/*.mp3. Deterministik (seed tetap).
Semua SFX dinormalisasi ke puncak -6 dBFS supaya tidak menyentak; volume akhir diatur di Sfx.tsx.
Run: ~/projects/tts-venv/venv/bin/python scripts/gen-sfx-bakteri.py [nama ...]
"""
import os
import subprocess
import sys
import tempfile
import wave

import numpy as np

SR = 44100
OUT = os.path.join(os.path.dirname(__file__), "..", "public", "suhuf-bakteri", "sfx")
FFMPEG = os.environ.get("FFMPEG") or "/opt/homebrew/bin/ffmpeg"
rng = np.random.default_rng(1972)


def t_(sec):
    return np.arange(int(SR * sec)) / SR


def noise(sec):
    return rng.uniform(-1, 1, int(SR * sec))


def onepole(x, cutoff):
    cutoff = np.broadcast_to(np.asarray(cutoff, dtype=float), x.shape)
    a = 1 - np.exp(-2 * np.pi * cutoff / SR)
    y = np.empty_like(x)
    prev = 0.0
    for i in range(len(x)):
        prev += a[i] * (x[i] - prev)
        y[i] = prev
    return y


def lp(x, c):
    return onepole(onepole(x, c), c)


def hp(x, c):
    return x - onepole(x, c)


def bp(x, lo, hi):
    return lp(hp(x, lo), hi)


def env(sec, attack=0.005, decay=8.0):
    t = t_(sec)
    a = np.clip(t / max(attack, 1e-4), 0, 1)
    return a * np.exp(-t * decay)


def sweep(sec, f0, f1, expo=True):
    t = t_(sec)
    u = t / max(t[-1], 1e-9)
    f = f0 * (f1 / f0) ** u if expo else f0 + (f1 - f0) * u
    return np.sin(2 * np.pi * np.cumsum(f) / SR)


def tone(sec, f):
    return np.sin(2 * np.pi * f * t_(sec))


def place(dst, src, at):
    i = int(at * SR)
    end = min(len(dst), i + len(src))
    dst[i:end] += src[: end - i]
    return dst


# ---------- suara ----------
def tick():  # titik muncul: klik kayu kecil, lembut
    s = 0.07
    return tone(s, 2600) * env(s, 0.001, 70) * 0.6 + bp(noise(s), 2000, 6000) * env(s, 0.0005, 120) * 0.4


def pop():  # elemen muncul
    s = 0.2
    return sweep(s, 900, 420) * env(s, 0.002, 22)


def whoosh():  # transisi lembut
    s = 0.7
    u = t_(s) / s
    x = onepole(noise(s), 300 + 2600 * np.sin(np.pi * u) ** 1.5)
    return hp(x, 150) * np.sin(np.pi * u) ** 1.8


def bass():  # ketukan "10 : 1": sub hangat + klik
    s = 1.6
    body = sweep(s, 72, 44) * env(s, 0.004, 2.6)
    click = lp(noise(s), 1200) * env(s, 0.001, 40) * 0.5
    return body + click


def strike():  # coretan spidol
    s = 0.42
    u = t_(s) / s
    x = bp(noise(s), 1200 + 2500 * u, 6000)
    am = 0.7 + 0.3 * np.sin(2 * np.pi * 38 * t_(s))
    return x * am * np.sin(np.pi * u) ** 0.6


def pencil():  # pensil menulis: goresan pendek berulang
    s = 1.4
    out = np.zeros(int(SR * s))
    at = 0.0
    while at < s - 0.15:
        d = rng.uniform(0.07, 0.16)
        g = bp(noise(d), 2500, 7000) * np.sin(np.pi * t_(d) / d) * rng.uniform(0.5, 1)
        place(out, g, at)
        at += d + rng.uniform(0.02, 0.07)
    return out


def page():  # lembar kertas dibalik
    s = 0.9
    u = t_(s) / s
    x = bp(noise(s), 500, 5000) * np.sin(np.pi * u) ** 1.2
    crinkle = bp(noise(s), 3000, 9000) * (rng.uniform(0, 1, len(u)) > 0.985) * 3
    return x + crinkle * np.sin(np.pi * u)


def ding():  # lonceng halus
    s = 2.0
    out = np.zeros(int(SR * s))
    for f, g, d in [(1046.5, 1.0, 2.4), (1568, 0.4, 3.2), (2093, 0.18, 4.5)]:
        out += tone(s, f) * env(s, 0.003, d) * g
    return out


def reveal():  # dua nada naik: momen hasil
    s = 2.2
    out = np.zeros(int(SR * s))
    for at, f in [(0.0, 587.3), (0.16, 880.0)]:
        n = tone(s - at, f) * env(s - at, 0.004, 2.0) + tone(s - at, f * 2) * env(s - at, 0.004, 3.5) * 0.25
        place(out, n, at)
    return out


def count():  # penghitung naik: klik makin rapat
    s = 1.3
    out = np.zeros(int(SR * s))
    at, gap = 0.0, 0.11
    while at < s - 0.08:
        place(out, tick() * 0.8, at)
        at += gap
        gap = max(0.035, gap * 0.88)
    return out


def scale():  # timbangan: ketukan kayu + getar
    s = 1.0
    knock = sweep(s, 260, 180) * env(s, 0.002, 18)
    rattle = bp(noise(s), 800, 2500) * env(s, 0.002, 9) * 0.25 * (0.6 + 0.4 * np.sin(2 * np.pi * 22 * t_(s)))
    return knock + rattle


def door():  # pintu halus: derit pendek + tutup lembut
    s = 1.3
    creak = np.zeros(int(SR * s))
    c = 0.55
    cr = bp(noise(c), 600, 1400) * (0.5 + 0.5 * np.sign(np.sin(2 * np.pi * 34 * t_(c)))) * np.sin(np.pi * t_(c) / c)
    place(creak, cr * 0.5, 0.0)
    thump = sweep(0.6, 120, 60) * env(0.6, 0.003, 12) + lp(noise(0.6), 500) * env(0.6, 0.001, 30) * 0.4
    place(creak, thump, 0.6)
    return creak


def hmm():  # nada rendah "hmm"
    s = 1.6
    vib = 1 + 0.01 * np.sin(2 * np.pi * 5 * t_(s))
    x = np.sin(2 * np.pi * np.cumsum(165 * vib) / SR) + 0.5 * np.sin(2 * np.pi * np.cumsum(220 * vib) / SR)
    a = np.clip(t_(s) / 0.25, 0, 1) * np.clip((s - t_(s)) / 0.6, 0, 1)
    return lp(x, 900) * a


def shimmer():  # ketidakpastian: kilau halus bergetar
    s = 2.2
    out = np.zeros(int(SR * s))
    for f in (1760, 2217, 2637, 3520):
        tr = 0.5 + 0.5 * np.sin(2 * np.pi * rng.uniform(3, 7) * t_(s) + rng.uniform(0, 6))
        out += tone(s, f) * tr * 0.25
    return (out + hp(noise(s), 6000) * 0.1) * np.sin(np.pi * t_(s) / s) ** 1.2


def shrink():  # kolom menyusut: sapuan turun
    s = 0.9
    return place(sweep(s, 640, 150) * env(s, 0.01, 3.2) * 0.8, whoosh() * 0.4, 0.0)


def bed():  # musik latar ambient: Dm9 - Bbmaj7 - Fmaj7 - Cadd9, 8 dtk per akor, loop mulus 32 dtk
    chords = [
        [146.83, 220.0, 261.63, 349.23, 329.63],
        [116.54, 233.08, 293.66, 349.23, 440.0],
        [174.61, 220.0, 261.63, 329.63, 392.0],
        [130.81, 196.0, 261.63, 293.66, 329.63],
    ]
    per, total = 8.0, 32.0
    n = int(SR * total)
    out = np.zeros(n)
    for k, ch in enumerate(chords):
        L = per + 3.0  # ekor tumpang tindih
        tt = t_(L)
        a = np.clip(tt / 2.2, 0, 1) ** 1.5 * np.clip((L - tt) / 3.2, 0, 1)
        voice = np.zeros(len(tt))
        for j, f in enumerate(ch):
            for det in (-0.12, 0.12):
                ph = 2 * np.pi * (f + det) * tt + j
                voice += (np.sin(ph) + 0.18 * np.sin(2 * ph)) * (0.9 if j == 0 else 0.45)
        voice *= a * (0.85 + 0.15 * np.sin(2 * np.pi * 0.13 * tt + k))
        i0 = int(SR * (k * per - 1.0)) % n
        idx = (np.arange(len(voice)) + i0) % n  # bungkus melingkar => loop tanpa sambungan
        np.add.at(out, idx, voice)
    out = lp(out, 1800)
    air = lp(hp(noise(total), 3000), 7000) * 0.015
    return out + air


SOUNDS = {
    "tick": tick, "pop": pop, "whoosh": whoosh, "bass": bass, "strike": strike, "pencil": pencil,
    "page": page, "ding": ding, "reveal": reveal, "count": count, "scale": scale, "door": door,
    "hmm": hmm, "shimmer": shimmer, "shrink": shrink, "bed": bed,
}


def write_mp3(name, x):
    x = np.asarray(x, dtype=float)
    peak = max(1e-9, np.max(np.abs(x)))
    target = 0.5 if name != "bed" else 0.7  # -6 dBFS untuk SFX
    x = x / peak * target
    f = min(len(x) // 4, int(SR * 0.008))
    if name != "bed":
        x[:f] *= np.linspace(0, 1, f)
        x[-int(SR * 0.04):] *= np.linspace(1, 0, int(SR * 0.04))
    os.makedirs(OUT, exist_ok=True)
    with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as tmp:
        path = tmp.name
    with wave.open(path, "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((np.clip(x, -1, 1) * 32767).astype("<i2").tobytes())
    dst = os.path.join(OUT, f"{name}.mp3")
    subprocess.run([FFMPEG, "-y", "-loglevel", "error", "-i", path, "-b:a", "160k", dst], check=True)
    os.unlink(path)
    print(f"{name}: {len(x) / SR:.2f}s")


if __name__ == "__main__":
    only = sys.argv[1:]
    for k, fn in SOUNDS.items():
        if not only or k in only:
            write_mp3(k, fn())
