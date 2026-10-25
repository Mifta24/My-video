import durations from "./durations.json";
import spec from "./spec.json";

export const FPS = 30;
export const GAP = 0.22;
export const END_PAD = 2.4;
export const scenes = spec.scenes;
const dur = durations as Record<string, number>;
export const clipDuration = (id: string) => dur[id];
export const clipStartInScene = (clips: { id: string }[], i: number) => {
  let sec = 0;
  for (let j = 0; j < i; j++) sec += dur[clips[j].id] + GAP;
  return Math.round(sec * FPS);
};
export const sceneDurationFrames = (s: (typeof scenes)[number]) => {
  const clips = s.clips;
  const seconds =
    clips.reduce((n, c) => n + dur[c.id], 0) +
    Math.max(0, clips.length - 1) * GAP +
    END_PAD;
  return Math.ceil(seconds * FPS);
};
export const sceneStarts = (() => {
  let frame = 0;
  return scenes.map((s) => {
    const start = frame;
    frame += sceneDurationFrames(s);
    return start;
  });
})();
export const longDurationFrames =
  sceneStarts[sceneStarts.length - 1] +
  sceneDurationFrames(scenes[scenes.length - 1]);
