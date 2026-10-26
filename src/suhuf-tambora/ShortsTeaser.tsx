import { Audio } from "@remotion/media";
import { Sequence, staticFile } from "remotion";
import { SceneS1 } from "./scenes/SceneS1";
import { SceneS2 } from "./scenes/SceneS2";
import { SceneS2B } from "./scenes/SceneS2B";
import { SceneS3 } from "./scenes/SceneS3";
import { SceneS4 } from "./scenes/SceneS4";
import { SceneS5 } from "./scenes/SceneS5";
import { Watermark } from "./elements/Watermark";
import { clipIds, sceneFrames, sceneStartFrame } from "./timing";
import { colors } from "./theme";

const SCENES = [SceneS1, SceneS2, SceneS2B, SceneS3, SceneS4, SceneS5];

// Suhuf Pengetahuan #1 · Shorts A2 (teaser, 9:16). Urutan dan teks mengikuti script bagian "VERSI A2".
// Musik bed: taruh file berlisensi di public/suhuf-tambora/music/bed.mp3 lalu set MUSIC_FILE ke nama itu.
const MUSIC_FILE: string | null = null;

export const ShortsTeaser: React.FC = () => (
  <div style={{ position: "absolute", inset: 0, backgroundColor: colors.bg }}>
    {SCENES.map((Scene, i) => (
      <Sequence
        key={clipIds[i]}
        name={`${clipIds[i].toUpperCase()}`}
        from={sceneStartFrame(i)}
        durationInFrames={sceneFrames(clipIds[i])}
        layout="none"
      >
        <Scene />
      </Sequence>
    ))}
    <Watermark />
    {MUSIC_FILE ? (
      <Audio
        name="Musik"
        src={staticFile(`suhuf-tambora/music/${MUSIC_FILE}`)}
        volume={0.12}
      />
    ) : null}
  </div>
);
