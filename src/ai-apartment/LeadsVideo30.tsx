import { Track, useVideoConfig } from "remotion";
import { AnswersScene } from "./scenes/AnswersScene";
import { CtaScene } from "./scenes/CtaScene";
import { LiftRequestScene } from "./scenes/LiftRequestScene";
import { ProblemScene } from "./scenes/ProblemScene";
import { RevealScene } from "./scenes/RevealScene";
import { UnansweredScene } from "./scenes/UnansweredScene";
import { colors } from "./theme";

// Script "30 detik" (leads), 9:16. Urutan scene mengikuti FTS-Apartment-AI-video-scripts.md
// bagian 3. Dengan VO tempo normal (public/ai-apartment/vo/) totalnya jadi 39 detik.
export const LeadsVideo30 = () => {
  const { fps } = useVideoConfig();

  return (
    <Track name="Scenes">
      <ProblemScene
        name="1 · Masalah"
        durationInFrames={5.6 * fps}
        style={{ backgroundColor: colors.gray }}
      />
      <UnansweredScene
        name="2 · Tidak dibalas"
        from={5.6 * fps}
        durationInFrames={5.7 * fps}
        style={{ backgroundColor: colors.gray }}
      />
      <RevealScene
        name="3 · Produk muncul"
        from={11.3 * fps}
        durationInFrames={8.4 * fps}
        style={{ backgroundColor: colors.ink }}
      />
      <AnswersScene
        name="4 · AI menjawab"
        from={19.7 * fps}
        durationInFrames={7.9 * fps}
        style={{ backgroundColor: colors.ink }}
      />
      <LiftRequestScene
        name="5 · Lift & permintaan"
        from={27.6 * fps}
        durationInFrames={6.9 * fps}
        style={{ backgroundColor: colors.ink }}
      />
      <CtaScene
        name="6 · CTA"
        from={34.5 * fps}
        durationInFrames={4.5 * fps}
        style={{ backgroundColor: colors.ink }}
      />
    </Track>
  );
};
