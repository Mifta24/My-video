import { Audio } from "@remotion/media";
import type React from "react";
import { Sequence, staticFile } from "remotion";
import { FPS } from "../timing";

// SFX prosedural (scripts/gen-sfx-bakteri.py, puncak -6 dBFS). `at` = detik relatif awal adegan.
// SFX_MASTER sengaja rendah: masukan video #1, SFX yang keras bikin penonton pusing.
export const SFX_MASTER = 0.32;

export type SfxName =
  | "tick"
  | "pop"
  | "whoosh"
  | "bass"
  | "strike"
  | "pencil"
  | "page"
  | "ding"
  | "reveal"
  | "count"
  | "scale"
  | "door"
  | "hmm"
  | "shimmer"
  | "shrink"
  | "plop"
  | "tingtong"
  | "crowd";

export type Cue = readonly [at: number, name: SfxName, volume?: number];

export const Sfx: React.FC<{
  readonly name: SfxName;
  readonly at: number;
  readonly volume?: number;
}> = ({ name, at, volume = 0.6 }) => (
  <Sequence from={Math.max(0, Math.round(at * FPS))} layout="none" name={`SFX ${name}`}>
    <Audio src={staticFile(`suhuf-bakteri/sfx/${name}.mp3`)} volume={volume * SFX_MASTER} />
  </Sequence>
);

export const SfxList: React.FC<{ readonly cues: readonly Cue[] }> = ({ cues }) => (
  <>
    {cues.map(([at, name, volume], i) => (
      <Sfx key={`${name}-${i}`} name={name} at={at} volume={volume} />
    ))}
  </>
);

// Musik latar ambient (loop 32 dtk). `level(frame)` mengatur naik-turun; nilai dasar kecil
// supaya narasi selalu dominan.
export const MusicBed: React.FC<{
  readonly level: (frame: number) => number;
  readonly file?: string;
}> = ({ level, file = "bed" }) => (
  <Audio
    name="Musik latar"
    src={staticFile(`suhuf-bakteri/sfx/${file}.mp3`)}
    loop
    loopVolumeCurveBehavior="extend"
    volume={(f) => level(f)}
  />
);
