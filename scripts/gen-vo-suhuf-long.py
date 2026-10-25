"""Generate VO for the long Suhuf video from src/suhuf-tambora/long/spec.json (edge-tts).

Only clips whose text changed (hash in manifest.json) are regenerated.
Writes public/suhuf-tambora/vo-long/<id>.mp3 and src/suhuf-tambora/long/durations.json.
Use --measure-only after replacing mp3 files with a human recording.
Run: ~/projects/tts-venv/venv/bin/python scripts/gen-vo-suhuf-long.py
"""
import asyncio
import hashlib
import json
import subprocess
import sys
from pathlib import Path

root = Path(__file__).resolve().parent.parent
spec = json.loads((root / "src/suhuf-tambora/long/spec.json").read_text())
out_dir = root / "public/suhuf-tambora/vo-long"
out_dir.mkdir(parents=True, exist_ok=True)
manifest_path = out_dir / "manifest.json"
manifest = json.loads(manifest_path.read_text()) if manifest_path.exists() else {}


def duration(path: Path) -> float:
    r = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(path)],
                       capture_output=True, text=True, check=True)
    return round(float(r.stdout.strip()), 3)


async def synth(clip, sem):
    import edge_tts
    async with sem:
        path = out_dir / f"{clip['id']}.mp3"
        raw = out_dir / f"{clip['id']}.raw.mp3"
        for attempt in range(4):
            try:
                await edge_tts.Communicate(clip["text"], spec["voice"], rate=spec["rate"]).save(str(raw))
                break
            except Exception as e:  # noqa: BLE001
                if attempt == 3:
                    raise
                await asyncio.sleep(2 * (attempt + 1))
        subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", str(raw), "-af",
                        "silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.05,"
                        "areverse,silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.12,areverse",
                        str(path)], check=True)
        raw.unlink()


async def main():
    clips = [c for s in spec["scenes"] for c in s["clips"]]
    h = lambda c: hashlib.sha1((spec["voice"] + spec["rate"] + c["text"]).encode()).hexdigest()[:12]
    todo = [c for c in clips if "--measure-only" not in sys.argv and (manifest.get(c["id"]) != h(c) or not (out_dir / f"{c['id']}.mp3").exists())]
    print(len(todo), "of", len(clips), "clips to generate")
    sem = asyncio.Semaphore(4)
    await asyncio.gather(*(synth(c, sem) for c in todo))
    for c in todo:
        manifest[c["id"]] = h(c)
    manifest_path.write_text(json.dumps(manifest, indent=1) + "\n")
    durations = {c["id"]: duration(out_dir / f"{c['id']}.mp3") for c in clips}
    (root / "src/suhuf-tambora/long/durations.json").write_text(json.dumps(durations, indent=1) + "\n")
    total = sum(durations.values())
    print(f"total speech {total:.1f}s = {total / 60:.1f} min")
    for s in spec["scenes"]:
        print(s["id"], round(sum(durations[c["id"]] for c in s["clips"]), 1), "s")


asyncio.run(main())
