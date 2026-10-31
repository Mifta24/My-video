#!/usr/bin/env python3
"""Parse narasi Shorts Suhuf #03 (Pulau Run) dari script Don -> src/suhuf-pulau-run/vo/spec-shorts.json.

Setiap kalimat = satu klip VO. `text` = subtitle, `say` (opsional) = ejaan TTS.
Run: python3 scripts/build-spec-pulau-run.py
"""
import json
import re
from pathlib import Path

root = Path(__file__).resolve().parent.parent
md = (root / "src/suhuf-pulau-run/Suhuf-Pengetahuan-03-Pulau-Run-script.md").read_text()
SAY = [("@suhufpengetahuan", "Suhuf Pengetahuan")]


def sentences(t):
    parts = re.split(r"(?<=[.!?])\s+(?=[A-Z@\"])", t.strip())
    return [p.strip() for p in parts if p.strip()]


scenes = []
for m in re.finditer(r"^S-(\d+) \| .*?\nNARASI: (.*?)\n", md, re.M):
    sid = f"s{int(m.group(1)):02d}"
    clips = []
    for i, s in enumerate(sentences(m.group(2))):
        say = s
        for a, b in SAY:
            say = say.replace(a, b)
        c = {"id": f"{sid}_{i + 1:02d}", "text": s}
        if say != s:
            c["say"] = say
        clips.append(c)
    scenes.append({"id": sid, "clips": clips})

out = {"voice": "id-ID-ArdiNeural", "rate": "-2%", "scenes": scenes}
(root / "src/suhuf-pulau-run/vo/spec-shorts.json").write_text(json.dumps(out, ensure_ascii=False, indent=1) + "\n")
words = sum(len(c["text"].split()) for s in scenes for c in s["clips"])
print(len(scenes), "scenes", sum(len(s["clips"]) for s in scenes), "clips", words, "words")
