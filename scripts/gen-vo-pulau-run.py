"""Generate VO Suhuf #03 (Pulau Run) dari src/suhuf-pulau-run/vo/spec-{shorts,long}.json (edge-tts).

Hanya klip yang teksnya berubah (hash di manifest.json) yang dibuat ulang.
Menulis public/suhuf-pulau-run/vo[-long]/<id>.mp3 dan src/suhuf-pulau-run/vo/durations-<name>.json.
Pakai --measure-only setelah mengganti mp3 dengan rekaman manusia (nama file sama).
Run: ~/projects/tts-venv/venv/bin/python scripts/gen-vo-pulau-run.py [shorts|long]
"""
import asyncio
import hashlib
import json
import subprocess
import sys
from pathlib import Path

root = Path(__file__).resolve().parent.parent
import os
FFMPEG = os.environ.get("FFMPEG") or "/opt/homebrew/bin/ffmpeg"
FFPROBE = os.environ.get("FFPROBE") or "/opt/homebrew/bin/ffprobe"


def duration(path: Path) -> float:
    r = subprocess.run([FFPROBE, "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(path)],
                       capture_output=True, text=True, check=True)
    return round(float(r.stdout.strip()), 3)


async def synth(spec, clip, out_dir, sem):
    import edge_tts
    async with sem:
        path = out_dir / f"{clip['id']}.mp3"
        raw = out_dir / f"{clip['id']}.raw.mp3"
        for attempt in range(4):
            try:
                await edge_tts.Communicate(clip.get("say", clip["text"]), spec["voice"], rate=spec["rate"]).save(str(raw))
                break
            except Exception:  # noqa: BLE001
                if attempt == 3:
                    raise
                await asyncio.sleep(2 * (attempt + 1))
        subprocess.run([FFMPEG, "-y", "-v", "error", "-i", str(raw), "-af",
                        "silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.05,"
                        "areverse,silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.12,areverse,"
                        "loudnorm=I=-16:TP=-1.5:LRA=11",
                        "-ar", "44100", "-b:a", "160k", str(path)], check=True)
        raw.unlink()


async def run(name: str):
    spec = json.loads((root / f"src/suhuf-pulau-run/vo/spec-{name}.json").read_text())
    out_dir = root / Path("public/suhuf-pulau-run/vo" if name == "shorts" else "public/suhuf-pulau-run/vo-long")
    out_dir.mkdir(parents=True, exist_ok=True)
    manifest_path = out_dir / "manifest.json"
    manifest = json.loads(manifest_path.read_text()) if manifest_path.exists() else {}
    clips = [c for s in spec["scenes"] for c in s["clips"]]
    h = lambda c: hashlib.sha1((spec["voice"] + spec["rate"] + c.get("say", c["text"])).encode()).hexdigest()[:12]
    todo = [] if "--measure-only" in sys.argv else [
        c for c in clips if manifest.get(c["id"]) != h(c) or not (out_dir / f"{c['id']}.mp3").exists()]
    print(name, len(todo), "of", len(clips), "clips to generate")
    sem = asyncio.Semaphore(4)
    await asyncio.gather(*(synth(spec, c, out_dir, sem) for c in todo))
    for c in todo:
        manifest[c["id"]] = h(c)
    manifest_path.write_text(json.dumps(manifest, indent=1) + "\n")
    durations = {c["id"]: duration(out_dir / f"{c['id']}.mp3") for c in clips}
    (root / f"src/suhuf-pulau-run/vo/durations-{name}.json").write_text(json.dumps(durations, indent=1) + "\n")
    total = sum(durations.values())
    print(f"{name}: speech {total:.1f}s = {total / 60:.2f} min")


names = [a for a in sys.argv[1:] if not a.startswith("--")] or ["shorts", "long"]
for n in names:
    asyncio.run(run(n))
