import { AbsoluteFill, interpolate, Track } from "remotion";
import { clamp } from "../../suhuf-bakteri/elements/common";
import { Watermark } from "../../suhuf-bakteri/elements/Watermark";
import { toon } from "../../suhuf-bakteri/theme";
import { MusicBed } from "../elements/Sound";
import { sceneFrames, sceneFrom, shortsTotalFrames } from "../timing";
import { PulauRunScene } from "./scenes";

// Musik pelan: naik tipis di S-08, tenang di S-09, turun di penutup. Narasi selalu dominan.
const musicLevel = (f: number) => {
  const s08 = sceneFrom("s08");
  const s09 = sceneFrom("s09");
  const s10 = sceneFrom("s10");
  const s11 = sceneFrom("s11");
  const fadeIn = interpolate(f, [0, 20], [0, 1], clamp);
  const lift = 1 + 0.25 * interpolate(f, [s08, s08 + 20, s09 - 10, s09], [0, 1, 1, 0], clamp);
  const calm = 1 - 0.25 * interpolate(f, [s09, s09 + 20, s10 - 10, s10], [0, 1, 1, 0], clamp);
  const out = interpolate(f, [s11, shortsTotalFrames - 6], [1, 0.2], clamp);
  return 0.075 * fadeIn * lift * calm * out;
};

const NAMES: Record<string, string> = {
  s01: "S-01 Ditukar?",
  s02: "S-02 Satu lembar",
  s03: "S-03 Pulau Run",
  s04: "S-04 Berebut",
  s05: "S-05 New York",
  s06: "S-06 Perjanjian 1667",
  s07: "S-07 Hasilnya",
  s08: "S-08 Bersamaan",
  s09: "S-09 Perumpamaan",
  s10: "S-10 Cek dulu",
  s11: "S-11 Penutup",
};

export const ShortsVideo = () => (
  <AbsoluteFill style={{ backgroundColor: toon.bg }}>
    <Track name="Adegan Shorts">
      {Object.keys(NAMES).map((id) => (
        <PulauRunScene key={id} name={NAMES[id]} sceneId={id} from={sceneFrom(id)} durationInFrames={sceneFrames(id)} />
      ))}
    </Track>
    <Watermark hideAfter={sceneFrom("s11")} ink={toon.ink} halo="#FFF4DE" />
    <MusicBed level={musicLevel} file="toonbed" />
  </AbsoluteFill>
);
