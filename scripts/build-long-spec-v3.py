"""Bangun src/suhuf-bakteri/vo/spec-long.json (Long V3, L-01..L-45) dari Bagian 6B script md.
Narasi disalin persis; satu klip = satu kalimat. Run: python3 scripts/build-long-spec-v3.py
"""
import json
import re
from pathlib import Path

root = Path(__file__).resolve().parent.parent
md = (root / "src/suhuf-bakteri/Suhuf-Pengetahuan-02-Mitos-10-1-script.md").read_text()
sec = md.split("### 6B. Video panjang")[1].split("## 7. Serah terima")[0]

bab, title, scenes, cur = 0, "", [], None
SAY = {
    "tahun 1972": "tahun seribu sembilan ratus tujuh puluh dua",
    "@suhufpengetahuan": "Suhuf Pengetahuan",
}
for line in sec.splitlines():
    m = re.match(r"#### Bab (\d+) - (.+)", line)
    if m:
        bab, title = int(m.group(1)), m.group(2).strip()
        continue
    m = re.match(r"\*\*L-(\d\d)\*\* (?:_\(opsional\)_ )?(.+)", line)
    if not m:
        continue
    sid, text = f"l{m.group(1)}", m.group(2).strip()
    parts = re.split(r"(?<=[.!?])(?:\"?)\s+(?=[A-Z\"])", text)
    # pecah di akhir kalimat tanpa memotong tanda kutip penutup
    parts = [p for p in re.split(r"(?<=[.!?])\s+|(?<=[.!?]\")\s+", text) if p]
    clips = []
    for i, p in enumerate(parts, 1):
        c = {"id": f"{sid}_{i:02d}", "text": p}
        say = p
        for k, v in SAY.items():
            say = say.replace(k, v)
        if say != p:
            c["say"] = say
        clips.append(c)
    s = {"id": sid, "clips": clips, "bab": bab, "babTitle": title}
    if sid in ("l40", "l41"):
        s["toilet"] = True
    scenes.append(s)

assert len(scenes) == 45, len(scenes)
spec = {"voice": "id-ID-ArdiNeural", "rate": "-4%", "scenes": scenes}
(root / "src/suhuf-bakteri/vo/spec-long.json").write_text(json.dumps(spec, indent=1, ensure_ascii=False) + "\n")
words = sum(len(c["text"].split()) for s in scenes for c in s["clips"])
print(len(scenes), "scenes", sum(len(s["clips"]) for s in scenes), "clips", words, "words")
