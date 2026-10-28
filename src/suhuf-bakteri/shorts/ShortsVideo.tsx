import { AbsoluteFill, interpolate, Track } from "remotion";
import { clamp } from "../elements/common";
import { MusicBed } from "../elements/Sound";
import { Watermark } from "../elements/Watermark";
import { colors } from "../theme";
import { sceneFrames, sceneFrom, shortsTotalFrames } from "../timing";
import { ShortsScene } from "./ShortsScene";

// Musik: ambient pelan; hening sejenak sebelum S-06 (penjelasan), naik tipis di S-10, turun di CTA.
const musicLevel = (f: number) => {
  const s06 = sceneFrom("s06");
  const s10 = sceneFrom("s10");
  const s11 = sceneFrom("s11");
  const fadeIn = interpolate(f, [0, 20], [0, 1], clamp);
  const dip = 1 - 0.85 * interpolate(f, [s06 - 20, s06, s06 + 25, s06 + 55], [0, 1, 1, 0], clamp);
  const lift = 1 + 0.35 * interpolate(f, [s10, s10 + 40, s11, s11 + 10], [0, 1, 1, 0], clamp);
  const out = interpolate(f, [s11, shortsTotalFrames - 6], [1, 0.25], clamp);
  return 0.11 * fadeIn * dip * lift * out;
};

// Suhuf Pengetahuan #02 · Shorts/Reels/TikTok 9:16 · Mitos 10:1 (Bagian 4 script).
export const ShortsVideo = () => (
  <AbsoluteFill style={{ backgroundColor: colors.bg }}>
    <Track name="Adegan Shorts">
      <ShortsScene name="S-01 Hook 10:1 keliru" sceneId="s01" from={sceneFrom("s01")} durationInFrames={sceneFrames("s01")} />
      <ShortsScene name="S-02 Satu lembar" sceneId="s02" from={sceneFrom("s02")} durationInFrames={sceneFrames("s02")} />
      <ShortsScene name="S-03 Perkiraan kasar" sceneId="s03" from={sceneFrom("s03")} durationInFrames={sceneFrames("s03")} />
      <ShortsScene name="S-04 Pria acuan" sceneId="s04" from={sceneFrom("s04")} durationInFrames={sceneFrames("s04")} />
      <ShortsScene name="S-05 38 vs 30 triliun" sceneId="s05" from={sceneFrom("s05")} durationInFrames={sceneFrames("s05")} />
      <ShortsScene name="S-06 Usus besar" sceneId="s06" from={sceneFrom("s06")} durationInFrames={sceneFrames("s06")} />
      <ShortsScene name="S-07 Sel berinti" sceneId="s07" from={sceneFrom("s07")} durationInFrames={sceneFrames("s07")} />
      <ShortsScene name="S-08 0,2 kg" sceneId="s08" from={sceneFrom("s08")} durationInFrames={sceneFrames("s08")} />
      <ShortsScene name="S-09 Ketidakpastian" sceneId="s09" from={sceneFrom("s09")} durationInFrames={sceneFrames("s09")} />
      <ShortsScene name="S-10 Diperbarui" sceneId="s10" from={sceneFrom("s10")} durationInFrames={sceneFrames("s10")} />
      <ShortsScene name="S-11 CTA" sceneId="s11" from={sceneFrom("s11")} durationInFrames={sceneFrames("s11")} />
    </Track>
    <Watermark hideAfter={sceneFrom("s11")} />
    <MusicBed level={musicLevel} />
  </AbsoluteFill>
);
