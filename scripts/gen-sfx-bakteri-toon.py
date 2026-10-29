#!/usr/bin/env python3
"""SFX tambahan + musik latar ceria untuk Shorts V3 (Suhuf #02). Python murni (tanpa numpy), bebas lisensi.

Output: public/suhuf-bakteri/sfx/{toonbed,plop,tingtong,crowd}.mp3 (deterministik).
Run: FFMPEG=/path/ffmpeg python3 scripts/gen-sfx-bakteri-toon.py
"""
import math
import os
import random
import struct
import subprocess
import tempfile
import wave

SR = 22050
OUT = os.path.join(os.path.dirname(__file__), "..", "public", "suhuf-bakteri", "sfx")
FFMPEG = os.environ.get("FFMPEG") or "ffmpeg"
rnd = random.Random(1972)


def buf(sec):
    return [0.0] * int(SR * sec)


def add(dst, src, at):
    i = int(at * SR)
    for k, v in enumerate(src):
        j = i + k
        if j >= len(dst):
            j -= len(dst)  # bungkus melingkar supaya loop mulus
            if j >= len(dst):
                break
        dst[j] += v


def pluck(freq, dur, amp=1.0, bright=0.3):
    n = int(SR * dur)
    out = []
    for k in range(n):
        t = k / SR
        e = math.exp(-t * 7.0) * min(1.0, t / 0.004)
        s = math.sin(2 * math.pi * freq * t) + bright * math.sin(4 * math.pi * freq * t) * math.exp(-t * 14)
        out.append(s * e * amp)
    return out


def bass_note(freq, dur, amp=1.0):
    n = int(SR * dur)
    return [math.sin(2 * math.pi * freq * (k / SR)) * math.exp(-(k / SR) * 3.2) * min(1, (k / SR) / 0.01) * amp for k in range(n)]


def bed():
    # Do mayor ceria: C - Am - F - G, 120 bpm (bar = 2 dtk), 16 bar = 32 dtk, loop mulus.
    chords = {
        "C": ([261.63, 329.63, 392.0, 523.25], 130.81),
        "Am": ([220.0, 261.63, 329.63, 440.0], 110.0),
        "F": ([174.61, 220.0, 261.63, 349.23], 87.31),
        "G": ([196.0, 246.94, 293.66, 392.0], 98.0),
    }
    prog = ["C", "Am", "F", "G"] * 4
    out = buf(32.0)
    penta = [523.25, 587.33, 659.25, 783.99, 880.0]
    for bar, name in enumerate(prog):
        notes, root = chords[name]
        t0 = bar * 2.0
        # arpeggio per 1/8 not (0,25 dtk)
        order = [0, 1, 2, 3, 2, 1, 2, 1]
        for i, idx in enumerate(order):
            add(out, pluck(notes[idx], 0.5, 0.55 if i % 2 == 0 else 0.4), t0 + i * 0.25)
        add(out, bass_note(root, 0.9, 0.9), t0)
        add(out, bass_note(root, 0.7, 0.6), t0 + 1.0)
        # melodi lonceng jarang di bar ganjil
        if bar % 2 == 1:
            for j, at in enumerate((0.5, 1.0, 1.5)):
                f = penta[(bar * 3 + j * 2 + rnd.randint(0, 2)) % len(penta)]
                add(out, pluck(f, 0.6, 0.28, 0.5), t0 + at)
    return out


def plop():
    n = int(SR * 0.28)
    out = []
    ph = 0.0
    for k in range(n):
        t = k / SR
        f = 700 * math.exp(-t * 9) + 180
        ph += 2 * math.pi * f / SR
        out.append(math.sin(ph) * math.exp(-t * 14))
    return out


def tingtong():
    out = buf(1.4)
    for at, f in ((0.0, 880.0), (0.38, 659.25)):
        n = int(SR * 1.0)
        note = [(math.sin(2 * math.pi * f * k / SR) + 0.25 * math.sin(4 * math.pi * f * k / SR)) * math.exp(-(k / SR) * 3.4) * min(1, (k / SR) / 0.004) for k in range(n)]
        add(out, note, at)
    return out


def crowd():
    # dengung riuh: noise lowpass + gelombang amplitudo pelan
    n = int(SR * 3.0)
    y1 = y2 = 0.0
    out = []
    for k in range(n):
        x = rnd.uniform(-1, 1)
        y1 += 0.12 * (x - y1)
        y2 += 0.08 * (y1 - y2)
        t = k / SR
        am = (0.55 + 0.45 * math.sin(2 * math.pi * 2.3 * t) * math.sin(2 * math.pi * 0.7 * t + 1)) * min(1, t / 0.5) * min(1, (3.0 - t) / 0.6)
        out.append(y2 * am)
    return out


def write(name, x, target):
    peak = max(1e-9, max(abs(v) for v in x))
    x = [v / peak * target for v in x]
    with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as tmp:
        path = tmp.name
    with wave.open(path, "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(b"".join(struct.pack("<h", int(max(-1, min(1, v)) * 32767)) for v in x))
    os.makedirs(OUT, exist_ok=True)
    subprocess.run([FFMPEG, "-y", "-loglevel", "error", "-i", path, "-ar", "44100", "-b:a", "160k", os.path.join(OUT, f"{name}.mp3")], check=True)
    os.unlink(path)
    print(f"{name}: {len(x) / SR:.2f}s")


if __name__ == "__main__":
    write("toonbed", bed(), 0.7)
    write("plop", plop(), 0.5)
    write("tingtong", tingtong(), 0.5)
    write("crowd", crowd(), 0.5)
