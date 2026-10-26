import { Audio } from "@remotion/media";
import type React from "react";
import { Sequence, staticFile } from "remotion";
import { FPS } from "../timing";

// SFX prosedural (scripts/gen-sfx-suhuf.py). `at` = detik relatif awal scene.
// Volume relatif terhadap narasi: SFX_MASTER diturunkan kalau terlalu ramai.
export const SFX_MASTER = 1;

export type SfxName =
  | "boom"
  | "rumble"
  | "riser"
  | "whoosh"
  | "pop"
  | "tick"
  | "thud"
  | "ding"
  | "shimmer"
  | "wind"
  | "sweep-up"
  | "sonar"
  | "dim-down";

export const Sfx: React.FC<{
  readonly name: SfxName;
  readonly at: number;
  readonly volume?: number;
}> = ({ name, at, volume = 0.5 }) => (
  <Sequence
    from={Math.max(0, Math.round(at * FPS))}
    layout="none"
    name={`SFX ${name}`}
  >
    <Audio
      src={staticFile(`suhuf-tambora/sfx/${name}.mp3`)}
      volume={volume * SFX_MASTER}
    />
  </Sequence>
);
