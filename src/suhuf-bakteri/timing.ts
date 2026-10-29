import durShorts from "./vo/durations-shorts.json";
import durLong from "./vo/durations-long.json";
import specShorts from "./vo/spec-shorts.json";
import specLong from "./vo/spec-long.json";

export const FPS = 30;

// Bab toilet (L-40, L-41) opsional (script Bagian 5). Matikan dengan `false`: kedua adegan keluar dari
// urutan, sisa video bergeser rapat dan tetap utuh. Tidak ada adegan lain yang bergantung padanya.
export const INCLUDE_TOILET = true;

export type Clip = { id: string; text: string; say?: string };
export type SceneSpec = {
  id: string;
  clips: Clip[];
  bab?: number;
  babTitle?: string;
};

const dur: Record<string, number> = {
  ...(durShorts as Record<string, number>),
  ...(durLong as Record<string, number>),
};

export const clipDuration = (id: string) => {
  const d = dur[id];
  if (d === undefined) {
    throw new Error(`Durasi klip ${id} tidak ada (jalankan scripts/gen-vo-bakteri.py)`);
  }
  return d;
};

// Jeda antarkalimat, jeda sebelum klip pertama, dan ekor sesudah klip terakhir.
// Script minta jeda 0,5-1 dtk di hook, hasil, dan rekap: ekor adegan itu lebih panjang.
const GAP = { shorts: 0.22, long: 0.42 };
const LEAD = { shorts: 0.2, long: 0.45 };
const TAIL: Record<string, number> = {
  s01: 0.5,
  s05: 0.6,
  s10: 0.6,
  s11: 1.4,
  l01: 0.9,
  l02: 0.9,
  l22: 2.4, // jeda 2 detik setelah pertanyaan ke penonton (script L-22) + napas
  l24: 1.0,
  l26: 1.2,
  l41: 0.9,
  l42: 1.0,
  l44: 1.0,
  l45: 2.2,
};
const DEFAULT_TAIL = { shorts: 0.25, long: 0.6 };

const kindOf = (sceneId: string) => (sceneId.startsWith("s") ? "shorts" : "long");

export const scenesShorts = specShorts.scenes as SceneSpec[];
export const scenesLongAll = specLong.scenes as (SceneSpec & { toilet?: boolean })[];
export const scenesLong = scenesLongAll.filter((s) => INCLUDE_TOILET || !s.toilet);
const all = [...scenesShorts, ...scenesLongAll];

export const getScene = (sceneId: string): SceneSpec => {
  const s = all.find((x) => x.id === sceneId);
  if (!s) {
    throw new Error(`Adegan ${sceneId} tidak ada di spec`);
  }
  return s;
};

// Detik (relatif awal adegan) saat klip mulai diucapkan.
export const clipStart = (sceneId: string, clipId: string): number => {
  const s = getScene(sceneId);
  const k = kindOf(sceneId);
  let sec = LEAD[k];
  for (const c of s.clips) {
    if (c.id === clipId) {
      return sec;
    }
    sec += clipDuration(c.id) + GAP[k];
  }
  throw new Error(`Klip ${clipId} tidak ada di adegan ${sceneId}`);
};

export const clipEnd = (sceneId: string, clipId: string) =>
  clipStart(sceneId, clipId) + clipDuration(clipId);

// Detik saat sebuah frasa diucapkan: posisi karakter dibagi rata terhadap durasi klip.
export const cue = (sceneId: string, phrase: string, offset = 0): number => {
  const s = getScene(sceneId);
  for (const c of s.clips) {
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
  const k = kindOf(sceneId);
  return clipEnd(sceneId, last.id) + (TAIL[sceneId] ?? DEFAULT_TAIL[k]);
};

export const sceneFrames = (sceneId: string) => Math.round(sceneSeconds(sceneId) * FPS);

const startsOf = (list: SceneSpec[]) => {
  const map: Record<string, number> = {};
  let f = 0;
  for (const s of list) {
    map[s.id] = f;
    f += sceneFrames(s.id);
  }
  return { map, total: f };
};

const shortsStarts = startsOf(scenesShorts);
const longStarts = startsOf(scenesLong);

// Frame awal adegan di dalam video penuh.
export const sceneFrom = (sceneId: string) =>
  kindOf(sceneId) === "shorts" ? shortsStarts.map[sceneId] : longStarts.map[sceneId];

export const shortsTotalFrames = shortsStarts.total;
export const longTotalFrames = longStarts.total;

// Rentang frame satu bab (gabungan adegan berurutan) untuk Track per bab.
export const babRange = (bab: number) => {
  const list = scenesLong.filter((s) => s.bab === bab);
  const from = sceneFrom(list[0].id);
  const last = list[list.length - 1];
  return { from, durationInFrames: sceneFrom(last.id) + sceneFrames(last.id) - from };
};
