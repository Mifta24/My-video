import durations from "./vo/durations.json";
import spec from "./vo/spec.json";

export const FPS = 30;

export type ClipId = "s1" | "s2" | "s3" | "s4" | "s5";
export const clipIds: ClipId[] = ["s1", "s2", "s3", "s4", "s5"];

// Jeda sebelum VO mulai di tiap scene, dan jeda sesudah VO selesai.
export const LEAD = 0.3;
const TAIL: Record<ClipId, number> = {
  s1: 1.0,
  s2: 1.0,
  s3: 1.1,
  s4: 1.1,
  s5: 1.8,
};

const dur = durations as Record<string, number>;

export const voSeconds = (id: ClipId) => dur[id];

export const clipText = (id: ClipId): string => {
  const clip = spec.clips.find((c) => c.id === id);
  if (!clip) {
    throw new Error(`Clip ${id} tidak ada di vo/spec.json`);
  }
  return clip.text;
};

// Panjang scene mengikuti durasi VO (bukan jendela di script), supaya VO tidak terpotong.
export const sceneSeconds = (id: ClipId) => LEAD + voSeconds(id) + TAIL[id];

export const sceneFrames = (id: ClipId) => Math.round(sceneSeconds(id) * FPS);

export const sceneStartFrame = (index: number) => {
  let total = 0;
  for (let i = 0; i < index; i++) {
    total += sceneFrames(clipIds[i]);
  }
  return total;
};

export const shortsTotalFrames = () => sceneStartFrame(clipIds.length);
