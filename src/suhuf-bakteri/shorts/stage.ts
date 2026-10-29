// Ukuran kanvas 3D saat ini. Default = Shorts (1080x1920) supaya Shorts tidak berubah.
// Stage3D mengisinya dari useVideoConfig() sebelum anak-anaknya dirender, jadi video panjang (1920x1080)
// memakai kalibrasi kamera yang sama: bidang z = 0 memetakan 1 unit dunia = 1 piksel kanvas.
export const stageSize = { w: 1080, h: 1920 };
export const setStageSize = (w: number, h: number) => {
  stageSize.w = w;
  stageSize.h = h;
};
