"""Generate English VO clips from src/ai-apartment/vo-en/spec.json with edge-tts.

Writes public/ai-apartment/vo-en/<id>.mp3 and src/ai-apartment/vo-en/durations.json.
Reports clips that overlap the next clip in the same scene.
Run: /path/to/venv/bin/python scripts/gen-vo-en.py
"""
import asyncio
import json
import subprocess
from pathlib import Path

import edge_tts

root = Path(__file__).resolve().parent.parent
spec = json.loads((root / "src/ai-apartment/vo-en/spec.json").read_text())
out_dir = root / "public/ai-apartment/vo-en"
out_dir.mkdir(parents=True, exist_ok=True)


def duration(path: Path) -> float:
    r = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(path)],
        capture_output=True, text=True, check=True,
    )
    return round(float(r.stdout.strip()), 3)


async def main():
    durations = {}
    for scene, clips in spec["scenes"].items():
        for clip in clips:
            path = out_dir / f"{clip['id']}.mp3"
            comm = edge_tts.Communicate(clip.get("say", clip["text"]), spec["voice"], rate=spec["rate"])
            raw = out_dir / f"{clip['id']}.raw.mp3"
            await comm.save(str(raw))
            # Trim leading/trailing silence so `at` times in the spec match the spoken audio.
            subprocess.run(
                ["ffmpeg", "-y", "-v", "error", "-i", str(raw), "-af",
                 "silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.05,"
                 "areverse,silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.12,areverse",
                 str(path)],
                check=True,
            )
            raw.unlink()
            durations[clip["id"]] = duration(path)
    (root / "src/ai-apartment/vo-en/durations.json").write_text(json.dumps(durations, indent=2) + "\n")
    for scene, clips in spec["scenes"].items():
        for i, clip in enumerate(clips):
            end = clip["at"] + durations[clip["id"]]
            nxt = clips[i + 1]["at"] if i + 1 < len(clips) else None
            flag = "  OVERLAP" if nxt is not None and end > nxt else ""
            print(f"{scene} {clip['id']} {clip['at']:.1f}-{end:.1f}"
                  + (f" (next {nxt:.1f})" if nxt is not None else "") + flag)


asyncio.run(main())
