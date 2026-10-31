import durLong from "../vo/durations-long.json";
import specLong from "../vo/spec-long.json";

// Timing Long Suhuf #03 (Pulau Run) dari DURASI AUDIO NYATA (vo/durations-long.json, id-ID-ArdiNeural).
// Durasi adegan = lead + klip + jeda antarklip + ekor. Tidak ada isian: ekor panjang hanya di
// L-01 (timbangan berubah jadi tanda tanya), L-17 (JEDA 2 DETIK untuk menebak) dan penutup.
export const FPS = 30;

export type Clip = { id: string; text: string; say?: string };
export type SceneSpec = { id: string; title: string; bab: number; babTitle: string; clips: Clip[] };

const dur = durLong as Record<string, number>;

export const clipDuration = (id: string) => {
  const d = dur[id];
  if (d === undefined) {
    throw new Error(`Durasi klip ${id} tidak ada (jalankan scripts/gen-vo-pulau-run.py long)`);
  }
  return d;
};

const GAP = 0.42;
const LEAD = 0.45;
const TAIL: Record<string, number> = {
  l01: 1.1,
  l02: 0.7,
  l17: 2.6, // jeda 2 detik (hitung mundur) setelah pertanyaan ke penonton
  l29: 0.8,
  l31: 0.8,
  l33: 1.8,
};
const DEFAULT_TAIL = 0.6;

export const scenesLong = specLong.scenes as SceneSpec[];

export const getScene = (sceneId: string): SceneSpec => {
  const s = scenesLong.find((x) => x.id === sceneId);
  if (!s) {
    throw new Error(`Adegan ${sceneId} tidak ada di spec-long`);
  }
  return s;
};

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

export const clipEnd = (sceneId: string, clipId: string) => clipStart(sceneId, clipId) + clipDuration(clipId);

// Detik saat frasa diucapkan (posisi karakter dibagi rata terhadap durasi klip).
export const cue = (sceneId: string, phrase: string, offset = 0): number => {
  for (const c of getScene(sceneId).clips) {
    const i = c.text.indexOf(phrase);
    if (i >= 0) {
      return clipStart(sceneId, c.id) + clipDuration(c.id) * (i / c.text.length) + offset;
    }
  }
  throw new Error(`Frasa "${phrase}" tidak ada di adegan ${sceneId}`);
};

// Akhir narasi adegan (detik).
export const speechEnd = (sceneId: string) => {
  const s = getScene(sceneId);
  return clipEnd(sceneId, s.clips[s.clips.length - 1].id);
};

export const sceneSeconds = (sceneId: string) => speechEnd(sceneId) + (TAIL[sceneId] ?? DEFAULT_TAIL);
export const sceneFrames = (sceneId: string) => Math.round(sceneSeconds(sceneId) * FPS);

const starts: Record<string, number> = {};
let acc = 0;
for (const s of scenesLong) {
  starts[s.id] = acc;
  acc += sceneFrames(s.id);
}
export const sceneFrom = (sceneId: string) => starts[sceneId];
export const longTotalFrames = acc;
