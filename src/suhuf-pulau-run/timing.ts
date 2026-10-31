import durShorts from "./vo/durations-shorts.json";
import specShorts from "./vo/spec-shorts.json";

// Timing Shorts Suhuf #03 (Pulau Run) dari DURASI AUDIO NYATA (vo/durations-shorts.json).
// Durasi adegan = lead + klip + jeda antarklip + ekor. Ekor lebih panjang di hook (S-01: timbangan
// berhenti di tanda tanya), S-05 (papan nama), dan penutup.
export const FPS = 30;

export type Clip = { id: string; text: string; say?: string };
export type SceneSpec = { id: string; clips: Clip[] };

const dur = durShorts as Record<string, number>;

export const clipDuration = (id: string) => {
  const d = dur[id];
  if (d === undefined) {
    throw new Error(`Durasi klip ${id} tidak ada (jalankan scripts/gen-vo-pulau-run.py)`);
  }
  return d;
};

const GAP = 0.22;
const LEAD = 0.2;
const TAIL: Record<string, number> = {
  s01: 1.9,
  s02: 0.4,
  s03: 0.6,
  s04: 0.6,
  s05: 0.6,
  s06: 0.5,
  s07: 0.7,
  s08: 0.9,
  s09: 0.35,
  s10: 0.6,
  s11: 1.1,
};
const DEFAULT_TAIL = 0.4;

export const scenesShorts = specShorts.scenes as SceneSpec[];

export const getScene = (sceneId: string): SceneSpec => {
  const s = scenesShorts.find((x) => x.id === sceneId);
  if (!s) {
    throw new Error(`Adegan ${sceneId} tidak ada di spec`);
  }
  return s;
};

// Detik (relatif awal adegan) saat klip mulai diucapkan.
export const clipStart = (sceneId: string, clipId: string): number => {
  let sec = LEAD;
  for (const c of getScene(sceneId).clips) {
    if (c.id === clipId) {
      return sec;
    }
    sec += clipDuration(c.id) + GAP;
  }
  throw new Error(`Klip ${clipId} tidak ada di adegan ${sceneId}`);
};

export const clipEnd = (sceneId: string, clipId: string) =>
  clipStart(sceneId, clipId) + clipDuration(clipId);

// Detik saat sebuah frasa diucapkan (posisi karakter dibagi rata terhadap durasi klip).
export const cue = (sceneId: string, phrase: string, offset = 0): number => {
  for (const c of getScene(sceneId).clips) {
    const i = c.text.indexOf(phrase);
    if (i >= 0) {
      return clipStart(sceneId, c.id) + clipDuration(c.id) * (i / c.text.length) + offset;
    }
  }
  throw new Error(`Frasa "${phrase}" tidak ada di adegan ${sceneId}`);
};

export const sceneSeconds = (sceneId: string) => {
  const s = getScene(sceneId);
  const last = s.clips[s.clips.length - 1];
  return clipEnd(sceneId, last.id) + (TAIL[sceneId] ?? DEFAULT_TAIL);
};

export const sceneFrames = (sceneId: string) => Math.round(sceneSeconds(sceneId) * FPS);

const starts: Record<string, number> = {};
let acc = 0;
for (const s of scenesShorts) {
  starts[s.id] = acc;
  acc += sceneFrames(s.id);
}

export const sceneFrom = (sceneId: string) => starts[sceneId];
export const shortsTotalFrames = acc;
