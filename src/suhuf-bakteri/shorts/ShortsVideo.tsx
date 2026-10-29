import { AbsoluteFill, interpolate, Track } from "remotion";
import { clamp } from "../elements/common";
import { MusicBed } from "../elements/Sound";
import { Watermark } from "../elements/Watermark";
import { toon } from "../theme";
import { sceneFrames, sceneFrom, shortsTotalFrames } from "../timing";
import { ShortsScene } from "./ShortsScene";

// Musik ceria pelan: naik tipis di S-08 (hampir sama banyak) dan S-10, turun di CTA.
// Level dasar rendah supaya narasi selalu dominan.
const musicLevel = (f: number) => {
  const s08 = sceneFrom("s08");
  const s09 = sceneFrom("s09");
  const s10 = sceneFrom("s10");
  const s11 = sceneFrom("s11");
  const fadeIn = interpolate(f, [0, 20], [0, 1], clamp);
  const lift = 1 + 0.3 * interpolate(f, [s08, s08 + 20, s09 - 10, s09], [0, 1, 1, 0], clamp);
  const calm = 1 - 0.25 * interpolate(f, [s09, s09 + 20, s10 - 10, s10], [0, 1, 1, 0], clamp);
  const out = interpolate(f, [s11, shortsTotalFrames - 6], [1, 0.2], clamp);
  return 0.075 * fadeIn * lift * calm * out;
};

// Suhuf Pengetahuan #02 · Shorts/Reels/TikTok 9:16 · Mitos 10:1 · V3 ramah pemula (Bagian 4 script).
export const ShortsVideo = ({ variant = "2d" }: { readonly variant?: "2d" | "3d" }) => (
  <AbsoluteFill style={{ backgroundColor: toon.bg }}>
    <Track name="Adegan Shorts">
      <ShortsScene variant={variant} name="S-01 Hook 10:1" sceneId="s01" from={sceneFrom("s01")} durationInFrames={sceneFrames("s01")} />
      <ShortsScene variant={variant} name="S-02 Satu lembar" sceneId="s02" from={sceneFrom("s02")} durationInFrames={sceneFrames("s02")} />
      <ShortsScene variant={variant} name="S-03 Tahun 1972" sceneId="s03" from={sceneFrom("s03")} durationInFrames={sceneFrames("s03")} />
      <ShortsScene variant={variant} name="S-04 Stadion" sceneId="s04" from={sceneFrom("s04")} durationInFrames={sceneFrames("s04")} />
      <ShortsScene variant={variant} name="S-05 Usus besar" sceneId="s05" from={sceneFrom("s05")} durationInFrames={sceneFrames("s05")} />
      <ShortsScene variant={variant} name="S-06 Diulang-ulang" sceneId="s06" from={sceneFrom("s06")} durationInFrames={sceneFrames("s06")} />
      <ShortsScene variant={variant} name="S-07 Hitung ulang" sceneId="s07" from={sceneFrom("s07")} durationInFrames={sceneFrames("s07")} />
      <ShortsScene variant={variant} name="S-08 Hampir sama banyak" sceneId="s08" from={sceneFrom("s08")} durationInFrames={sceneFrames("s08")} />
      <ShortsScene variant={variant} name="S-09 Perkiraan" sceneId="s09" from={sceneFrom("s09")} durationInFrames={sceneFrames("s09")} />
      <ShortsScene variant={variant} name="S-10 Cek ulang" sceneId="s10" from={sceneFrom("s10")} durationInFrames={sceneFrames("s10")} />
      <ShortsScene variant={variant} name="S-11 CTA" sceneId="s11" from={sceneFrom("s11")} durationInFrames={sceneFrames("s11")} />
    </Track>
    <Watermark hideAfter={sceneFrom("s11")} ink={toon.ink} halo="#FFF4DE" />
    <MusicBed level={musicLevel} file="toonbed" />
  </AbsoluteFill>
);
