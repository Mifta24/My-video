"""Parse Bagian 6 (teks rekam) dari script Suhuf #02 menjadi spec VO Shorts dan Long.

- Shorts: S-01..S-11 -> src/suhuf-bakteri/vo/spec-shorts.json (klip s01_01 ...)
- Long:   L-01..L-43 -> src/suhuf-bakteri/vo/spec-long.json  (klip l01_01 ...)
Setiap kalimat = satu klip VO. `text` = yang tampil di subtitle, `say` (opsional) = ejaan untuk TTS.
Run: python3 scripts/build-spec-bakteri.py
PERINGATAN: menimpa spec dan menomori ulang klip. Setelah adegan dibangun, edit spec langsung.
"""
import json
import re
from pathlib import Path

root = Path(__file__).resolve().parent.parent
md = (root / "src/suhuf-bakteri/Suhuf-Pengetahuan-02-Mitos-10-1-script.md").read_text()
rekam = md[md.index("## 6. Teks rekam"):]
shorts_md = rekam[rekam.index("### 6A"):rekam.index("### 6B")]
long_md = rekam[rekam.index("### 6B"):]

# Ejaan untuk TTS (subtitle tetap memakai teks asli).
SAY = [
    ("@suhufpengetahuan", "Suhuf Pengetahuan"),
    ("pH-nya", "pe-ha-nya"),
    ("NIH", "en-ai-eich"),
    ("back-of-the-envelope", "bek of de envelop"),
    ("MRI", "em-er-i"),
]


def sentences(t: str):
    parts = re.split(r"(?<=[.!?])\s+(?=[A-Z@\"])", t.strip())
    return [p.strip() for p in parts if p.strip()]


def clip(cid: str, text: str):
    say = text
    for a, b in SAY:
        say = say.replace(a, b)
    c = {"id": cid, "text": text}
    if say != text:
        c["say"] = say
    return c


def build(block: str, prefix: str):
    scenes, bab = [], None
    for line in block.splitlines():
        m = re.match(r"^#### Bab (\d+) - (.*)$", line)
        if m:
            bab = {"n": int(m.group(1)), "title": m.group(2).strip()}
            continue
        m = re.match(rf"^\*\*{prefix.upper()}-(\d+)\*\* (.*)$", line)
        if not m:
            continue
        n = int(m.group(1))
        sid = f"{prefix}{n:02d}"
        scene = {"id": sid, "clips": [clip(f"{sid}_{i + 1:02d}", s) for i, s in enumerate(sentences(m.group(2)))]}
        if bab:
            scene["bab"] = bab["n"]
            scene["babTitle"] = bab["title"]
        scenes.append(scene)
    return scenes


for name, block, prefix, rate in [("shorts", shorts_md, "s", "+0%"), ("long", long_md, "l", "-4%")]:
    scenes = build(block, prefix)
    out = {"voice": "id-ID-ArdiNeural", "rate": rate, "scenes": scenes}
    path = root / f"src/suhuf-bakteri/vo/spec-{name}.json"
    path.write_text(json.dumps(out, ensure_ascii=False, indent=1) + "\n")
    words = sum(len(c["text"].split()) for s in scenes for c in s["clips"])
    print(name, len(scenes), "scenes", sum(len(s["clips"]) for s in scenes), "clips", words, "words")
