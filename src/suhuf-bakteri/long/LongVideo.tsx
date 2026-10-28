import { AbsoluteFill, interpolate, Track } from "remotion";
import { clamp } from "../elements/common";
import { MusicBed } from "../elements/Sound";
import { Watermark } from "../elements/Watermark";
import { colors } from "../theme";
import { longTotalFrames, sceneFrames, sceneFrom } from "../timing";
import { LongScene } from "./LongScene";

// Musik: pad tenang sepanjang video. Naik sedikit di pengungkapan hasil (L-23), mengendur di
// rekap (L-26), lebih hangat di L-38..L-40, resolusi lalu fade out di penutup.
const musicLevel = (f: number) => {
  const bump = (from: string, to: string, k: number) =>
    k * interpolate(f, [sceneFrom(from), sceneFrom(from) + 45, sceneFrom(to) + 46, sceneFrom(to) + 90], [0, 1, 1, 0], clamp);
  const fadeIn = interpolate(f, [0, 30], [0, 1], clamp);
  const fadeOut = interpolate(f, [longTotalFrames - 150, longTotalFrames - 10], [1, 0], clamp);
  const level = 1 + bump("l23", "l25", 0.35) - bump("l26", "l27", 0.3) + bump("l38", "l41", 0.25) + 0.3 * interpolate(f, [sceneFrom("l43"), sceneFrom("l43") + 60], [0, 1], clamp);
  return 0.085 * fadeIn * fadeOut * level;
};

// Suhuf Pengetahuan #02 · Video panjang YouTube 16:9 · Mitos 10:1 (Bagian 5 script, 43 adegan, 11 bab).
export const LongVideo = () => (
  <AbsoluteFill style={{ backgroundColor: colors.bg }}>
    <Track name="Bab 1 · HOOK">
      <LongScene name="L-01 Hook 10:1" sceneId="l01" from={sceneFrom("l01")} durationInFrames={sceneFrames("l01")} />
      <LongScene name="L-02 Satu lembar" sceneId="l02" from={sceneFrom("l02")} durationInFrames={sceneFrames("l02")} />
    </Track>
    <Track name="Bab 2 · APA KATA BANYAK ORANG">
      <LongScene name="L-03 Klaimnya" sceneId="l03" from={sceneFrom("l03")} durationInFrames={sceneFrames("l03")} />
      <LongScene name="L-04 Tiga hal" sceneId="l04" from={sceneFrom("l04")} durationInFrames={sceneFrames("l04")} />
    </Track>
    <Track name="Bab 3 · DARI MANA 10:1">
      <LongScene name="L-05 1972 amplop" sceneId="l05" from={sceneFrom("l05")} durationInFrames={sceneFrames("l05")} />
      <LongScene name="L-06 x 1 liter" sceneId="l06" from={sceneFrom("l06")} durationInFrames={sceneFrames("l06")} />
      <LongScene name="L-07 Perumpamaan gedung" sceneId="l07" from={sceneFrom("l07")} durationInFrames={sceneFrames("l07")} />
      <LongScene name="L-08 Estafet 1977" sceneId="l08" from={sceneFrom("l08")} durationInFrames={sceneFrames("l08")} />
      <LongScene name="L-09 Elegan" sceneId="l09" from={sceneFrom("l09")} durationInFrames={sceneFrames("l09")} />
      <LongScene name="L-10 Jalur 100:1" sceneId="l10" from={sceneFrom("l10")} durationInFrames={sceneFrames("l10")} />
    </Track>
    <Track name="Bab 4 · HITUNG ULANG BAKTERI">
      <LongScene name="L-11 Letak ruang kepadatan" sceneId="l11" from={sceneFrom("l11")} durationInFrames={sceneFrames("l11")} />
      <LongScene name="L-12 Langkah 1 letak" sceneId="l12" from={sceneFrom("l12")} durationInFrames={sceneFrames("l12")} />
      <LongScene name="L-13 Kolon" sceneId="l13" from={sceneFrom("l13")} durationInFrames={sceneFrames("l13")} />
      <LongScene name="L-14 Langkah 2 ruang" sceneId="l14" from={sceneFrom("l14")} durationInFrames={sceneFrames("l14")} />
      <LongScene name="L-15 Langkah 3 kepadatan" sceneId="l15" from={sceneFrom("l15")} durationInFrames={sceneFrames("l15")} />
      <LongScene name="L-16 Ruangnya meleset" sceneId="l16" from={sceneFrom("l16")} durationInFrames={sceneFrames("l16")} />
      <LongScene name="L-17 Ukuran bakteri" sceneId="l17" from={sceneFrom("l17")} durationInFrames={sceneFrames("l17")} />
      <LongScene name="L-18 Rekap bakteri" sceneId="l18" from={sceneFrom("l18")} durationInFrames={sceneFrames("l18")} />
    </Track>
    <Track name="Bab 5 · HITUNG ULANG SEL MANUSIA">
      <LongScene name="L-19 Mosaik sel" sceneId="l19" from={sceneFrom("l19")} durationInFrames={sceneFrames("l19")} />
      <LongScene name="L-20 37 vs 30 triliun" sceneId="l20" from={sceneFrom("l20")} durationInFrames={sceneFrames("l20")} />
      <LongScene name="L-21 90% tanpa inti" sceneId="l21" from={sceneFrom("l21")} durationInFrames={sceneFrames("l21")} />
      <LongScene name="L-22 Sel darah merah" sceneId="l22" from={sceneFrom("l22")} durationInFrames={sceneFrames("l22")} />
    </Track>
    <Track name="Bab 6 · HASIL 1,3:1 DAN KETIDAKPASTIAN">
      <LongScene name="L-23 Hasilnya" sceneId="l23" from={sceneFrom("l23")} durationInFrames={sceneFrames("l23")} />
      <LongScene name="L-24 1,3:1" sceneId="l24" from={sceneFrom("l24")} durationInFrames={sceneFrames("l24")} />
      <LongScene name="L-25 Seberapa pasti" sceneId="l25" from={sceneFrom("l25")} durationInFrames={sceneFrames("l25")} />
      <LongScene name="L-26 Rekap 2" sceneId="l26" from={sceneFrom("l26")} durationInFrames={sceneFrames("l26")} />
    </Track>
    <Track name="Bab 7 · CATATAN MENARIK">
      <LongScene name="L-27 Sel berinti 10:1" sceneId="l27" from={sceneFrom("l27")} durationInFrames={sceneFrames("l27")} />
      <LongScene name="L-28 Bukan asal mitos" sceneId="l28" from={sceneFrom("l28")} durationInFrames={sceneFrames("l28")} />
      <LongScene name="L-29 0,2 kg" sceneId="l29" from={sceneFrom("l29")} durationInFrames={sceneFrames("l29")} />
      <LongScene name="L-30 Jumlah vs massa" sceneId="l30" from={sceneFrom("l30")} durationInFrames={sceneFrames("l30")} />
    </Track>
    <Track name="Bab 8 · YANG BELUM PASTI">
      <LongScene name="L-31 Yang belum pasti" sceneId="l31" from={sceneFrom("l31")} durationInFrames={sceneFrames("l31")} />
      <LongScene name="L-32 Tinja sbg wakil" sceneId="l32" from={sceneFrom("l32")} durationInFrames={sceneFrames("l32")} />
      <LongScene name="L-33 Perempuan" sceneId="l33" from={sceneFrom("l33")} durationInFrames={sceneFrames("l33")} />
      <LongScene name="L-34 Bayi & anak" sceneId="l34" from={sceneFrom("l34")} durationInFrames={sceneFrames("l34")} />
      <LongScene name="L-35 Tiga pertanyaan" sceneId="l35" from={sceneFrom("l35")} durationInFrames={sceneFrames("l35")} />
      <LongScene name="L-36 Status angka" sceneId="l36" from={sceneFrom("l36")} durationInFrames={sceneFrames("l36")} />
    </Track>
    <Track name="Bab 9 · CATATAN RINGAN">
      <LongScene name="L-37 Catatan ringan" sceneId="l37" from={sceneFrom("l37")} durationInFrames={sceneFrames("l37")} />
      <LongScene name="L-38 Kapan bertanya" sceneId="l38" from={sceneFrom("l38")} durationInFrames={sceneFrames("l38")} />
    </Track>
    <Track name="Bab 10 · PELAJARAN DAN REKAP">
      <LongScene name="L-39 Pelajaran 1" sceneId="l39" from={sceneFrom("l39")} durationInFrames={sceneFrames("l39")} />
      <LongScene name="L-40 Pelajaran 2" sceneId="l40" from={sceneFrom("l40")} durationInFrames={sceneFrames("l40")} />
      <LongScene name="L-41 Pelajaran 3" sceneId="l41" from={sceneFrom("l41")} durationInFrames={sceneFrames("l41")} />
      <LongScene name="L-42 Rekap besar" sceneId="l42" from={sceneFrom("l42")} durationInFrames={sceneFrames("l42")} />
    </Track>
    <Track name="Bab 11 · PENUTUP">
      <LongScene name="L-43 Penutup" sceneId="l43" from={sceneFrom("l43")} durationInFrames={sceneFrames("l43")} />
    </Track>
    <Watermark wide hideAfter={sceneFrom("l43") + 30 * 14} />
    <MusicBed level={musicLevel} />
  </AbsoluteFill>
);
