import { Audio } from "@remotion/media";
import type React from "react";
import { Sequence, staticFile } from "remotion";
import { FPS } from "../timing";

// SFX prosedural (Suhuf #02 + tambahan #03: stamp, flip, shuffle, waves, giggle).
// SFX_MASTER rendah: SFX keras bikin penonton pusing; narasi harus dominan.
export const SFX_MASTER = 0.32;

export type SfxName =
  | "tick" | "pop" | "whoosh" | "bass" | "strike" | "pencil" | "page" | "ding" | "reveal" | "count"
  | "scale" | "door" | "hmm" | "shimmer" | "shrink" | "plop" | "tingtong" | "crowd"
  | "stamp" | "flip" | "shuffle" | "waves" | "giggle";

export type Cue = readonly [at: number, name: SfxName, volume?: number];

export const Sfx: React.FC<{ readonly name: SfxName; readonly at: number; readonly volume?: number }> = ({ name, at, volume = 0.6 }) => (
  <Sequence from={Math.max(0, Math.round(at * FPS))} layout="none" name={`SFX ${name}`}>
    <Audio src={staticFile(`suhuf-pulau-run/sfx/${name}.mp3`)} volume={volume * SFX_MASTER} />
  </Sequence>
);

export const SfxList: React.FC<{ readonly cues: readonly Cue[] }> = ({ cues }) => (
  <>
    {cues.map(([at, name, volume], i) => (
      <Sfx key={`${name}-${i}`} name={name} at={at} volume={volume} />
    ))}
  </>
);

export const MusicBed: React.FC<{ readonly level: (frame: number) => number; readonly file?: string }> = ({ level, file = "toonbed" }) => (
  <Audio
    name="Musik latar"
    src={staticFile(`suhuf-pulau-run/sfx/${file}.mp3`)}
    loop
    loopVolumeCurveBehavior="extend"
    volume={(f) => level(f)}
  />
);
