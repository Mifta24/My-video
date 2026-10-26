"""Parse the Suhuf script .md (ADEGAN B1..B10) into src/suhuf-tambora/long/spec.json.

- Strips "[VERIFIKASI ...]" markers (never spoken / never shown).
- Removes Indonesian thousand separators (4.300 -> 4300) so TTS reads them as numbers.
- Splits narration into sentences; each sentence becomes one VO clip (id like b04_03).
Run: python3 scripts/build-long-spec.py
"""
import json
import re
from pathlib import Path

root = Path(__file__).resolve().parent.parent
md = (root / "src/suhuf-tambora/Suhuf-Pengetahuan-01-Tahun-Tanpa-Musim-Panas-script.md").read_text()

pat = re.compile(r'^ADEGAN (B\d+) \| ([^\n]*)\nNARASI: "(.*?)"\nVISUAL: (.*?)\nCATATAN: (.*?)$', re.S | re.M)


def clean(t: str) -> str:
    t = re.sub(r"\s*\[(?:VERIFIKASI|[^\]]*terverifikasi)[^\]]*\]", "", t)
    t = re.sub(r"(?<=\d)\.(?=\d{3}\b)", "", t)
    t = re.sub(r"\s+", " ", t).strip()
    return t


def sentences(t: str):
    parts = re.split(r"(?<=[.!?])\s+(?=[A-Z\"])", t)
    return [p.strip() for p in parts if p.strip()]


scenes = []
for m in pat.finditer(md):
    sid, head, nar, vis, cat = m.groups()
    n = int(sid[1:])
    sents = sentences(clean(nar))
    scenes.append({
        "id": sid.lower(),
        "title": head.split("|")[-1].strip() if "|" in head else head.strip(),
        "clips": [{"id": f"b{n:02d}_{i + 1:02d}", "text": s} for i, s in enumerate(sents)],
    })

out = {"voice": "id-ID-ArdiNeural", "rate": "+0%", "scenes": scenes}
(root / "src/suhuf-tambora/long/spec.json").write_text(json.dumps(out, ensure_ascii=False, indent=2) + "\n")
tot = sum(len(c["text"].split()) for s in scenes for c in s["clips"])
print(len(scenes), "scenes", sum(len(s["clips"]) for s in scenes), "clips", tot, "words")
for s in scenes:
    print(s["id"], s["title"], len(s["clips"]))
