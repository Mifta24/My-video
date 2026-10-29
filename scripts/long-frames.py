#!/usr/bin/env python3
# Hitung frame awal tiap adegan long (mengikuti timing.ts). Pakai: long-frames.py l01:1.5,4 l12:3 ...  -> daftar frame dipisah koma
import json, sys, os
base = os.path.join(os.path.dirname(__file__), "..", "src", "suhuf-bakteri")
spec = json.load(open(os.path.join(base, "vo/spec-long.json")))
dur = json.load(open(os.path.join(base, "vo/durations-long.json")))
TAIL = {"l01": .9, "l02": .9, "l22": 2.4, "l24": 1.0, "l26": 1.2, "l41": .9, "l42": 1.0, "l44": 1.0, "l45": 2.2}
FPS = 30
start = {}; frames = {}; f = 0
for s in spec["scenes"]:
    t = 0.45
    for c in s["clips"]:
        t += dur[c["id"]] + 0.42
    sec = t - 0.42 + TAIL.get(s["id"], 0.6)
    n = round(sec * FPS)
    start[s["id"]] = f; frames[s["id"]] = n; f += n
if __name__ == "__main__":
    out = []
    for a in sys.argv[1:]:
        sid, ts = a.split(":")
        for x in ts.split(","):
            out.append(start[sid] + min(frames[sid] - 1, round(float(x) * FPS)))
    print(",".join(map(str, out)))
    print("total", f, file=sys.stderr)
