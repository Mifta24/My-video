import type React from "react";
import { Sfx } from "../elements/Sfx";
import type { SfxName } from "../elements/Sfx";
import { clipStart } from "./parts";
import { GAP, clipDuration, scenes } from "./timing";

// SFX video panjang: tiap isyarat = [klip, offset detik dari awal klip, nama SFX, volume].
// Diposisikan mengikuti pergantian shot / kemunculan teks di Scenes.tsx; volume rendah supaya narasi tetap dominan.
type Cue = readonly [string, number, SfxName, number];

const CUES: Record<string, readonly Cue[]> = {
  b1: [
    ["b01_01", 0, "rumble", 0.5],
    ["b01_02", 0.4, "boom", 0.5],
    ["b01_03", 0, "whoosh", 0.35],
    ["b01_03", 0.3, "wind", 0.3],
    ["b01_03", 0.8, "shimmer", 0.3],
    ["b01_04", 0, "whoosh", 0.3],
    ["b01_04", 0.2, "sonar", 0.3],
    ["b01_04", 0.5, "sweep-up", 0.3],
    ["b01_04", 2.4, "ding", 0.3],
    ["b01_05", 0.2, "pop", 0.3],
    ["b01_06", 0.2, "pop", 0.3],
    ["b01_06", 1.4, "shimmer", 0.25],
    ["b01_07", 0, "whoosh", 0.3],
    ["b01_07", 0.2, "wind", 0.3],
    ["b01_07", 0.9, "shimmer", 0.3],
  ],
  b2: [
    ["b02_01", 0, "whoosh", 0.3],
    ["b02_01", 0.6, "ding", 0.3],
    ["b02_02", 0.2, "pop", 0.3],
    ["b02_03", 0, "riser", 0.3],
  ],
  b3: [
    ["b03_01", 0, "whoosh", 0.3],
    ["b03_02", 0.2, "pop", 0.3],
    ["b03_03", 0.5, "sonar", 0.3],
    ["b03_04", 0, "whoosh", 0.3],
    ["b03_04", 0.3, "thud", 0.3],
    ["b03_06", 0.1, "dim-down", 0.3],
    ["b03_07", 0, "whoosh", 0.3],
    ["b03_09", 0.1, "pop", 0.2],
    ["b03_10", 0.1, "pop", 0.2],
    ["b03_11", 0.1, "pop", 0.2],
    ["b03_12", 0.2, "dim-down", 0.3],
    ["b03_13", 0.5, "shimmer", 0.25],
  ],
  b4: [
    ["b04_01", 0, "rumble", 0.5],
    ["b04_01", 0.2, "boom", 0.7],
    ["b04_02", 0, "thud", 0.4],
    ["b04_04", 0, "whoosh", 0.3],
    ["b04_04", 0.3, "riser", 0.4],
    ["b04_05", 0.2, "boom", 0.55],
    ["b04_05", 0.3, "rumble", 0.4],
    ["b04_06", 0, "whoosh", 0.3],
    ["b04_06", 0.3, "riser", 0.35],
    ["b04_07", 0, "rumble", 0.5],
    ["b04_07", 0.5, "wind", 0.3],
    ["b04_08", 0.3, "thud", 0.5],
    ["b04_09", 0, "whoosh", 0.4],
    ["b04_09", 0.3, "rumble", 0.4],
    ["b04_10", 0.2, "pop", 0.3],
    ["b04_11", 0, "wind", 0.3],
    ["b04_12", 0, "dim-down", 0.45],
    ["b04_13", 0, "whoosh", 0.3],
    ["b04_15", 0, "whoosh", 0.3],
    ["b04_15", 0.5, "thud", 0.4],
    ["b04_17", 0, "whoosh", 0.3],
    ["b04_17", 0.5, "ding", 0.3],
    ["b04_18", 0.1, "pop", 0.3],
    ["b04_18", 0.3, "ding", 0.3],
    ["b04_19", 0.3, "thud", 0.4],
  ],
  b5: [
    ["b05_01", 0, "whoosh", 0.3],
    ["b05_02", 0, "thud", 0.5],
    ["b05_03", 0.2, "pop", 0.25],
    ["b05_04", 0, "whoosh", 0.35],
    ["b05_05", 0.3, "riser", 0.4],
    ["b05_06", 0.3, "shimmer", 0.3],
    ["b05_07", 0, "pop", 0.3],
    ["b05_08", 0.3, "sweep-up", 0.3],
    ["b05_09", 0, "sweep-up", 0.35],
    ["b05_09", 0.9, "ding", 0.3],
    ["b05_10", 0.3, "dim-down", 0.4],
    ["b05_11", 0, "whoosh", 0.3],
    ["b05_11", 0.3, "pop", 0.3],
    ["b05_12", 0, "shimmer", 0.3],
    ["b05_13", 1, "tick", 0.3],
    ["b05_14", 0.5, "ding", 0.3],
    ["b05_16", 0, "whoosh", 0.3],
    ["b05_18", 0.2, "thud", 0.45],
  ],
  b6: [
    ["b06_01", 0, "whoosh", 0.3],
    ["b06_01", 0.2, "wind", 0.3],
    ["b06_03", 0, "dim-down", 0.3],
    ["b06_04", 0, "whoosh", 0.3],
    ["b06_04", 0.6, "pop", 0.3],
    ["b06_06", 0.3, "pop", 0.3],
    ["b06_08", 0, "whoosh", 0.3],
    ["b06_10", 0, "dim-down", 0.3],
    ["b06_12", 0, "whoosh", 0.3],
    ["b06_12", 0.5, "thud", 0.35],
    ["b06_15", 0, "riser", 0.35],
    ["b06_17", 0.2, "thud", 0.4],
    ["b06_18", 0, "wind", 0.3],
    ["b06_19", 0, "dim-down", 0.3],
  ],
  b7: [
    ["b07_01", 0, "whoosh", 0.3],
    ["b07_01", 0.3, "wind", 0.35],
    ["b07_01", 1, "shimmer", 0.3],
    ["b07_02", 0.2, "pop", 0.3],
    ["b07_03", 0, "whoosh", 0.3],
    ["b07_03", 1, "tick", 0.3],
    ["b07_04", 0, "shimmer", 0.3],
    ["b07_05", 0, "whoosh", 0.3],
    ["b07_05", 0.5, "thud", 0.35],
    ["b07_06", 0, "whoosh", 0.3],
    ["b07_07", 0, "whoosh", 0.3],
    ["b07_07", 0.2, "sonar", 0.3],
    ["b07_07", 0.8, "sweep-up", 0.3],
    ["b07_07", 1.6, "ding", 0.3],
    ["b07_07", 2.6, "ding", 0.3],
  ],
  b8: [
    ["b08_01", 0, "whoosh", 0.3],
    ["b08_01", 0.3, "wind", 0.3],
    ["b08_02", 0.3, "pop", 0.3],
    ["b08_03", 0, "whoosh", 0.3],
    ["b08_03", 0.4, "pop", 0.3],
    ["b08_03", 1.2, "pop", 0.3],
    ["b08_03", 2.0, "pop", 0.3],
    ["b08_05", 0, "shimmer", 0.3],
    ["b08_05", 0.4, "ding", 0.3],
    ["b08_06", 0.1, "dim-down", 0.35],
    ["b08_07", 0, "whoosh", 0.3],
    ["b08_07", 0.4, "pop", 0.3],
    ["b08_08", 0.1, "thud", 0.4],
    ["b08_09", 0, "wind", 0.25],
    ["b08_10", 0, "shimmer", 0.3],
  ],
  b9: [
    ["b09_01", 0, "whoosh", 0.3],
    ["b09_01", 0.2, "rumble", 0.4],
    ["b09_02", 0.3, "thud", 0.4],
    ["b09_04", 0, "whoosh", 0.3],
    ["b09_04", 0.3, "dim-down", 0.3],
    ["b09_05", 0, "wind", 0.25],
    ["b09_07", 0, "whoosh", 0.3],
    ["b09_07", 0.4, "thud", 0.45],
    ["b09_08", 0.1, "pop", 0.25],
    ["b09_09", 0.1, "tick", 0.3],
    ["b09_10", 0, "whoosh", 0.3],
    ["b09_10", 0.5, "ding", 0.3],
    ["b09_11", 0.3, "shimmer", 0.3],
    ["b09_13", 0, "dim-down", 0.3],
    ["b09_14", 0, "whoosh", 0.3],
    ["b09_14", 0.5, "sonar", 0.3],
  ],
  b10: [
    ["b10_01", 0, "whoosh", 0.3],
    ["b10_10", 0, "whoosh", 0.3],
    ["b10_10", 0.3, "pop", 0.4],
    ["b10_10", 0.9, "ding", 0.35],
    ["b10_10", 1.6, "pop", 0.3],
    ["b10_11", 0.3, "pop", 0.3],
    ["b10_12", 0.2, "shimmer", 0.3],
  ],
};

// Dua adegan punya gerak yang dihitung dari progress (bukan dari klip): peta jalan B2 (empat titik rute)
// dan poin pelajaran B10 (tiga poin muncul berurutan). Waktu "tick" dihitung dengan rumus yang sama.
const speechSeconds = (sceneId: string): number => {
  const scene = scenes.find((s) => s.id === sceneId);
  return (scene?.clips ?? []).reduce((n, c) => n + clipDuration(c.id) + GAP, 0);
};

export const SceneSfx: React.FC<{ readonly sceneId: string }> = ({
  sceneId,
}) => {
  const speech = speechSeconds(sceneId);
  const cues = (CUES[sceneId] ?? []).map(
    ([clip, off, name, volume]) =>
      ({ at: clipStart(sceneId, clip) + off, name, volume }) as const,
  );
  const extra: { at: number; name: SfxName; volume: number }[] = [];
  if (sceneId === "b2") {
    for (let i = 0; i < 4; i++) {
      extra.push({ at: (i / 3) * speech, name: "tick", volume: 0.3 });
    }
  }
  if (sceneId === "b10") {
    for (let i = 0; i < 3; i++) {
      extra.push({ at: ((i * 0.3) / 1.6) * speech, name: "pop", volume: 0.35 });
    }
  }
  return (
    <>
      {[...cues, ...extra].map((c, i) => (
        <Sfx key={`${c.name}-${i}`} name={c.name} at={c.at} volume={c.volume} />
      ))}
    </>
  );
};
