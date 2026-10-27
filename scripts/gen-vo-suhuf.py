"""Generate Suhuf Pengetahuan VO clips from src/suhuf-tambora/vo/spec.json with edge-tts.

Writes public/suhuf-tambora/vo/<id>.mp3 and src/suhuf-tambora/vo/durations.json.
Use --only s1,s4 to regenerate just those clips.
Use --measure-only to skip TTS and just re-measure existing mp3 files
(e.g. after replacing them with a human recording).
Run: ~/projects/tts-venv/venv/bin/python scripts/gen-vo-suhuf.py
"""
import asyncio
import json
import subprocess
import sys
from pathlib import Path

root = Path(__file__).resolve().parent.parent
spec = json.loads((root / "src/suhuf-tambora/vo/spec.json").read_text())
out_dir = root / "public/suhuf-tambora/vo"
out_dir.mkdir(parents=True, exist_ok=True)


def duration(path: Path) -> float:
    r = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(path)],
        capture_output=True, text=True, check=True,
    )
    return round(float(r.stdout.strip()), 3)


async def synth(clip):
    import edge_tts

    path = out_dir / f"{clip['id']}.mp3"
    raw = out_dir / f"{clip['id']}.raw.mp3"
    await edge_tts.Communicate(clip["text"], spec["voice"], rate=spec["rate"]).save(str(raw))
    subprocess.run(
        ["ffmpeg", "-y", "-v", "error", "-i", str(raw), "-af",
         "silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.05,"
         "areverse,silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.12,areverse",
         str(path)],
        check=True,
    )
    raw.unlink()


async def main():
    if "--measure-only" not in sys.argv:
        only = sys.argv[sys.argv.index("--only") + 1].split(",") if "--only" in sys.argv else None
        for clip in spec["clips"]:
            if only is None or clip["id"] in only:
                await synth(clip)
    durations = {c["id"]: duration(out_dir / f"{c['id']}.mp3") for c in spec["clips"]}
    (root / "src/suhuf-tambora/vo/durations.json").write_text(json.dumps(durations, indent=2) + "\n")
    for c in spec["clips"]:
        print(c["id"], durations[c["id"]], "s")


asyncio.run(main())
