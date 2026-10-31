#!/usr/bin/env python3
"""Parse narasi Long Suhuf #03 (Pulau Run) dari script Don -> src/suhuf-pulau-run/vo/spec-long.json.

Narasi TIDAK diubah: setiap kalimat = satu klip VO (`text` = subtitle). `say` hanya ejaan TTS (mis. handle).
Run: python3 src/suhuf-pulau-run/vo/build-spec-long.py
"""
import json
import re
from pathlib import Path

here = Path(__file__).resolve().parent
md = (here.parent / "Suhuf-Pengetahuan-03-Pulau-Run-long-script.md").read_text()
SAY = [("@suhufpengetahuan", "Suhuf Pengetahuan")]


def sentences(t):
    parts = re.split(r"(?<=[.!?])\s+(?=[A-Z@\"])", t.strip())
    return [p.strip() for p in parts if p.strip()]


babs = [(m.start(), int(m.group(1)), m.group(2).strip()) for m in re.finditer(r"^### BAB (\d+) - (.+)$", md, re.M)]
scenes = []
for m in re.finditer(r"^L-(\d+) \| .*?\| (.*?)\nNARASI: (.*?)\n", md, re.M):
    sid = f"l{int(m.group(1)):02d}"
    bab = [b for b in babs if b[0] < m.start()][-1]
    clips = []
    for i, s in enumerate(sentences(m.group(3))):
        say = s
        for a, b in SAY:
            say = say.replace(a, b)
        c = {"id": f"{sid}_{i + 1:02d}", "text": s}
        if say != s:
            c["say"] = say
        clips.append(c)
    scenes.append({"id": sid, "title": m.group(2).strip(), "bab": bab[1], "babTitle": bab[2], "clips": clips})

out = {"voice": "id-ID-ArdiNeural", "rate": "-2%", "scenes": scenes}
(here / "spec-long.json").write_text(json.dumps(out, ensure_ascii=False, indent=1) + "\n")
words = sum(len(c["text"].split()) for s in scenes for c in s["clips"])
narr = " ".join(m.group(1) for m in re.finditer(r"^NARASI: (.*)$", md, re.M))
joined = " ".join(c["text"] for s in scenes for c in s["clips"])
assert joined.split() == narr.split(), "narasi spec != narasi script"
print(len(scenes), "scenes", sum(len(s["clips"]) for s in scenes), "clips", words, "words (identik dengan script)")
