#!/usr/bin/env python3
"""Sintesis SFX prosedural (stdlib saja, tanpa unduhan => bebas lisensi) untuk Suhuf Pengetahuan.
Output: public/suhuf-tambora/sfx/*.mp3 (mono 44.1 kHz). Deterministik (seed tetap).
Pakai: python3 scripts/gen-sfx-suhuf.py   (butuh ffmpeg di PATH atau FFMPEG env)
"""
import math, os, random, struct, subprocess, sys, wave, tempfile

SR = 44100
OUT = os.path.join(os.path.dirname(__file__), "..", "public", "suhuf-tambora", "sfx")
FFMPEG = os.environ.get("FFMPEG") or "ffmpeg"
rnd = random.Random(1815)


def n(sec):
    return int(SR * sec)


def noise(count):
    return [rnd.uniform(-1, 1) for _ in range(count)]


def lowpass(x, cutoff):
    # one-pole; cutoff boleh list (per sampel) atau angka
    y, prev = [], 0.0
    for i, v in enumerate(x):
        c = cutoff[i] if isinstance(cutoff, list) else cutoff
        a = 1 - math.exp(-2 * math.pi * c / SR)
        prev += a * (v - prev)
        y.append(prev)
    return y


def highpass(x, cutoff):
    lp = lowpass(x, cutoff)
    return [a - b for a, b in zip(x, lp)]


def env_exp(count, decay):
    return [math.exp(-i / SR * decay) for i in range(count)]


def fade(x, fin=0.01, fout=0.05):
    a, b = n(fin), n(fout)
    L = len(x)
    for i in range(min(a, L)):
        x[i] *= i / a
    for i in range(min(b, L)):
        x[L - 1 - i] *= i / b
    return x


def sine_sweep(count, f0, f1, expo=True):
    ph, out = 0.0, []
    for i in range(count):
        u = i / max(1, count - 1)
        f = f0 * (f1 / f0) ** u if expo else f0 + (f1 - f0) * u
        ph += 2 * math.pi * f / SR
        out.append(math.sin(ph))
    return out


def mix(*tracks):
    L = max(len(t) for t in tracks)
    out = [0.0] * L
    for t in tracks:
        for i, v in enumerate(t):
            out[i] += v
    return out


def mul(a, b):
    return [x * y for x, y in zip(a, b)]


def gain(x, g):
    return [v * g for v in x]


def delayed(x, sec):
    return [0.0] * n(sec) + x


# ---------- suara ----------
def boom():  # dentuman letusan
    c = n(2.6)
    body = mul(sine_sweep(c, 85, 26), env_exp(c, 1.7))
    crack = mul(lowpass(noise(c), 900), env_exp(c, 5.5))
    rum = mul(lowpass(noise(c), 140), env_exp(c, 1.1))
    return mix(gain(body, 1.0), gain(crack, 0.7), gain(rum, 0.9))


def rumble(sec=3.2):  # gemuruh bumi, naik-turun
    c = n(sec)
    x = lowpass(noise(c), 110)
    lfo = [0.65 + 0.35 * math.sin(2 * math.pi * 7.5 * i / SR) for i in range(c)]
    swell = [math.sin(math.pi * i / c) ** 0.7 for i in range(c)]
    return mul(mul(x, lfo), swell)


def riser(sec=3.0):  # tegangan naik sebelum dentuman
    c = n(sec)
    tone = sine_sweep(c, 55, 330)
    nz = lowpass(noise(c), [200 + 3800 * (i / c) ** 2 for i in range(c)])
    amp = [(i / c) ** 2.2 for i in range(c)]
    return mul(mix(gain(tone, 0.5), gain(nz, 1.3)), amp)


def whoosh(sec=0.8):  # transisi kartu
    c = n(sec)
    nz = noise(c)
    cut = [250 + 3200 * math.sin(math.pi * i / c) ** 1.5 for i in range(c)]
    x = lowpass(nz, cut)
    x = highpass(x, 120)
    amp = [math.sin(math.pi * i / c) ** 1.6 for i in range(c)]
    return mul(x, amp)


def pop():  # elemen muncul
    c = n(0.22)
    return mul(sine_sweep(c, 720, 340), env_exp(c, 20))


def tick():  # teks muncul
    c = n(0.09)
    return mul(sine_sweep(c, 2000, 1500), env_exp(c, 55))


def thud():  # hantaman berat
    c = n(0.7)
    return mix(mul(sine_sweep(c, 110, 40), env_exp(c, 7)), gain(mul(lowpass(noise(c), 400), env_exp(c, 25)), 0.5))


def ding(sec=1.8):  # lonceng halus
    c = n(sec)
    out = [0.0] * c
    for f, g, d in [(1318.5, 1.0, 2.6), (1975.5, 0.35, 3.4), (2637, 0.15, 5.0)]:
        out = mix(out, gain(mul(sine_sweep(c, f, f, expo=False), env_exp(c, d)), g))
    return out


def shimmer(sec=2.4):  # kabut partikel / embun beku
    c = n(sec)
    parts = []
    for f in (2093, 2637, 3136, 4186):
        tr = [0.5 + 0.5 * math.sin(2 * math.pi * rnd.uniform(3, 6) * i / SR + rnd.uniform(0, 6)) for i in range(c)]
        parts.append(mul(gain(sine_sweep(c, f, f, expo=False), 0.25), tr))
    hiss = highpass(noise(c), 5000)
    amp = [math.sin(math.pi * i / c) ** 1.2 for i in range(c)]
    return mul(mix(*parts, gain(hiss, 0.12)), amp)


def wind(sec=4.0):  # angin dingin
    c = n(sec)
    cut = [380 + 260 * math.sin(2 * math.pi * 0.45 * i / SR) for i in range(c)]
    x = lowpass(noise(c), cut)
    amp = [math.sin(math.pi * i / c) ** 0.8 for i in range(c)]
    return mul(x, amp)


def sweep_up(sec=2.6):  # kolom abu naik
    c = n(sec)
    tone = mul(sine_sweep(c, 120, 900), [(i / c) ** 0.6 for i in range(c)])
    nz = mul(lowpass(noise(c), [300 + 1800 * i / c for i in range(c)]), [(i / c) ** 0.8 for i in range(c)])
    amp = [1.0 if i < c * 0.8 else (c - i) / (c * 0.2) for i in range(c)]
    return mul(mix(gain(tone, 0.5), gain(nz, 0.8)), amp)


def sonar(sec=3.0):  # gelombang dentum merambat
    c = n(sec)
    out = [0.0] * c
    for k, (t0, g) in enumerate([(0.0, 1.0), (0.55, 0.55), (1.15, 0.3), (1.8, 0.15)]):
        p = mul(sine_sweep(n(0.9), 150, 70), env_exp(n(0.9), 4.2))
        out = mix(out, gain(delayed(p, t0), g))
    return out[:c]


def dim_down(sec=1.6):  # cahaya meredup
    c = n(sec)
    return mul(mul(sine_sweep(c, 520, 160), env_exp(c, 2.2)), [min(1.0, i / n(0.05)) for i in range(c)])


SOUNDS = {
    "boom": boom, "rumble": rumble, "riser": riser, "whoosh": whoosh, "pop": pop, "tick": tick,
    "thud": thud, "ding": ding, "shimmer": shimmer, "wind": wind, "sweep-up": sweep_up,
    "sonar": sonar, "dim-down": dim_down,
}


def write_mp3(name, x):
    peak = max(1e-9, max(abs(v) for v in x))
    x = fade([v / peak * 0.89 for v in x])
    os.makedirs(OUT, exist_ok=True)
    with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as tmp:
        path = tmp.name
    with wave.open(path, "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(b"".join(struct.pack("<h", int(max(-1, min(1, v)) * 32767)) for v in x))
    dst = os.path.join(OUT, f"{name}.mp3")
    subprocess.run([FFMPEG, "-y", "-loglevel", "error", "-i", path, "-b:a", "128k", dst], check=True)
    os.unlink(path)
    print(f"{name}: {len(x) / SR:.2f}s -> {dst}")


if __name__ == "__main__":
    only = sys.argv[1:]
    for k, fn in SOUNDS.items():
        if not only or k in only:
            write_mp3(k, fn())
