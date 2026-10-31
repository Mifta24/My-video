#!/usr/bin/env python3
"""Mix VO Long #03, SFX, music bed via ffmpeg; timing matches long/timing.ts.

Usage: python3 src/suhuf-pulau-run/long/mix-audio.py
No secrets. Input files are public/suhuf-pulau-run; output is out/suhuf-pulau-run/audio-long.m4a.
"""
from __future__ import annotations
import json
import os
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
SPEC = json.loads((ROOT / 'src/suhuf-pulau-run/vo/spec-long.json').read_text())['scenes']
DUR = json.loads((ROOT / 'src/suhuf-pulau-run/vo/durations-long.json').read_text())
FPS = 30
TAIL = {'l01': 1.1, 'l02': .7, 'l17': 2.6, 'l29': .8, 'l31': .8, 'l33': 1.8}
# SFX cues from code; master=0.32; volume is the third element.
SFX = {
'l01':[(.3,'scale',.4),(5.0,'hmm',.35)], 'l02':[(.1,'page',.5),(3.75,'pop',.4)],
'l03':[(.15,'waves',.35),(3.3,'pencil',.3),(6.4,'pop',.4)],
'l04':[(.1,'waves',.3),(3.1,'ding',.4)],
'l05':[(.2,'shimmer',.35),(4.1,'plop',.5),(4.4,'plop',.4),(4.7,'plop',.35)],
'l06':[(.7,'pop',.45),(1.4,'pencil',.45),(2.65,'stamp',.65)],
'l07':[(.2,'flip',.35),(4.8,'waves',.3)], 'l08':[(.2,'page',.4),(3.1,'stamp',.5)],
'l09':[(.2,'waves',.3),(3.1,'pop',.5),(8.5,'ding',.45)],
'l10':[(.2,'pop',.4),(3.3,'ding',.45)], 'l11':[(.2,'waves',.3)],
'l12':[(1.6,'pencil',.4),(4.0,'stamp',.5)],
'l13':[(.2,'pop',.4),(3.5,'ding',.4)], 'l14':[(.2,'flip',.4)],
'l15':[(.2,'pop',.4),(4.5,'hmm',.35)], 'l16':[(1.5,'pencil',.4),(3.1,'stamp',.5)],
'l17':[(1.3,'hmm',.4)], 'l18':[(.1,'flip',.4),(4.8,'stamp',.7)],
'l19':[(.1,'page',.3),(3.25,'whoosh',.4)], 'l20':[(.1,'pop',.4),(7.6,'strike',.55)],
'l21':[(.2,'page',.3),(4.9,'strike',.5)], 'l22':[(1.4,'pencil',.4),(3.3,'stamp',.6)],
'l23':[(.2,'pop',.4),(5.1,'whoosh',.35)], 'l24':[(.1,'hmm',.35)],
'l25':[(.1,'waves',.35),(5.7,'hmm',.3)], 'l26':[(1.3,'ding',.45),(2.0,'pop',.4)],
'l27':[(1.5,'pencil',.3),(3.4,'stamp',.6)],
'l28':[(.2,'pop',.4),(5.55,'pop',.4)], 'l29':[(.2,'scale',.4),(3.5,'hmm',.4)],
'l30':[(.2,'whoosh',.4),(3.4,'whoosh',.4)], 'l31':[(.2,'scale',.3)],
'l32':[(.2,'page',.4)], 'l33':[(.2,'ding',.5)],
}

clips: list[tuple[Path,int,float]]=[]
sfx: list[tuple[Path,int,float]]=[]
scene_frame=0
for scene in SPEC:
    local=.45
    for c in scene['clips']:
        clips.append((ROOT / f"public/suhuf-pulau-run/vo-long/{c['id']}.mp3",scene_frame+round(local*FPS),1.0))
        local+=DUR[c['id']]+.42
    for at,name,vol in SFX.get(scene['id'],[]):
        sfx.append((ROOT / f'public/suhuf-pulau-run/sfx/{name}.mp3',scene_frame+round(at*FPS),vol*.32))
    sec=.45+sum(DUR[c['id']] for c in scene['clips'])+.42*(len(scene['clips'])-1)+TAIL.get(scene['id'],.6)
    scene_frame+=round(sec*FPS)
assert scene_frame==7704,scene_frame
out=ROOT/'out/suhuf-pulau-run/audio-long.m4a'
out.parent.mkdir(parents=True,exist_ok=True)
ffmpeg=os.environ.get('FFMPEG') or str(Path.home()/'.hermes/tools/ffmpeg-9.0.1-linux-x64/bin/ffmpeg')
args=[ffmpeg,'-hide_banner','-loglevel','warning','-y']
for path,_,_ in clips+sfx:
    assert path.is_file(),path
    args+=['-i',str(path)]
args+=['-stream_loop','-1','-i',str(ROOT/'public/suhuf-pulau-run/sfx/toonbed.mp3')]
filters=[]
for i,(_,frame,vol) in enumerate(clips+sfx):
    # FFmpeg adelay uses milliseconds, so <=.5ms rounding vs 30fps frame boundaries.
    ms=round(frame*1000/FPS)
    filters.append(f'[{i}:a]aresample=48000,volume={vol:.5f},adelay={ms}|{ms}[a{i}]')
# MusicBed: 0.063 fade in 1 sec, fade out 4 sec, volume constant between.
mb=len(clips+sfx)
filters.append(f'[{mb}:a]aresample=48000,volume=0.063,afade=t=in:st=0:d=1,afade=t=out:st={(scene_frame/FPS)-4:.3f}:d=4,atrim=duration={scene_frame/FPS:.3f}[bed]')
ins=''.join(f'[a{i}]' for i in range(mb))+'[bed]'
filters.append(f'{ins}amix=inputs={mb+1}:duration=longest:normalize=0,alimiter=limit=0.95,apad=whole_dur={scene_frame/FPS:.3f},atrim=duration={scene_frame/FPS:.3f}[out]')
args+=['-filter_complex',';'.join(filters),'-map','[out]','-c:a','aac','-b:a','192k','-ar','48000','-t',f'{scene_frame/FPS:.3f}',str(out)]
print(f'Mixing {len(clips)} VO + {len(sfx)} SFX + bed, {scene_frame} frames ({scene_frame/FPS:.3f}s)',flush=True)
subprocess.run(args,check=True)
print(out, out.stat().st_size,flush=True)
