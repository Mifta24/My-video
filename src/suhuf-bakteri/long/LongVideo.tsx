import { AbsoluteFill, interpolate, Track } from "remotion";
import { clamp } from "../elements/common";
import { MusicBed } from "../elements/Sound";
import { Watermark } from "../elements/Watermark";
import { toon } from "../theme";
import { longTotalFrames, sceneFrames, sceneFrom, scenesLong } from "../timing";
import { LongScene } from "./LongScene";

// Musik ceria pelan (toonbed): naik tipis di hitung ulang (L-26) dan penutup, turun di jeda L-22 dan bagian "belum pasti".
const musicLevel = (f: number) => {
  const bump = (a: string, b: string, k: number) =>
    k * interpolate(f, [sceneFrom(a), sceneFrom(a) + 45, sceneFrom(b) + sceneFrames(b) - 30, sceneFrom(b) + sceneFrames(b) + 20], [0, 1, 1, 0], clamp);
  const fadeIn = interpolate(f, [0, 30], [0, 1], clamp);
  const fadeOut = interpolate(f, [longTotalFrames - 150, longTotalFrames - 10], [1, 0], clamp);
  const level = 1 + bump("l26", "l27", 0.35) - bump("l22", "l22", 0.7) - bump("l35", "l39", 0.25) + bump("l42", "l44", 0.2);
  return 0.09 * fadeIn * fadeOut * level;
};

const babs = Array.from(new Set(scenesLong.map((s) => s.bab ?? 0)));

// Suhuf Pengetahuan #02 · Video panjang YouTube 16:9 · Mitos 10:1 (Bagian 5 script V3, 45 adegan, 10 bab). Gaya Shorts V3.
export const LongVideo = () => (
  <AbsoluteFill style={{ backgroundColor: toon.bg }}>
    {babs.map((b) => {
      const list = scenesLong.filter((s) => s.bab === b);
      return (
        <Track key={b} name={`Bab ${b} · ${list[0].babTitle}`}>
          {list.map((s) => (
            <LongScene key={s.id} name={s.id.toUpperCase()} sceneId={s.id} from={sceneFrom(s.id)} durationInFrames={sceneFrames(s.id)} />
          ))}
        </Track>
      );
    })}
    <Watermark wide hideAfter={sceneFrom("l45")} ink={toon.ink} halo="#FFF4DE" />
    <MusicBed level={musicLevel} file="toonbed" />
  </AbsoluteFill>
);
