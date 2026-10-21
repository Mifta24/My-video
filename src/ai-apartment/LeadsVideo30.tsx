import { Track, useVideoConfig } from "remotion";
import { AnswersScene } from "./scenes/AnswersScene";
import { CtaScene } from "./scenes/CtaScene";
import { LiftRequestScene } from "./scenes/LiftRequestScene";
import { ProblemScene } from "./scenes/ProblemScene";
import { RevealScene } from "./scenes/RevealScene";
import { UnansweredScene } from "./scenes/UnansweredScene";
import { LangContext, type Lang } from "./i18n";
import { colors } from "./theme";

// Panjang tiap scene (detik) per bahasa. Versi Inggris mengikuti VO di vo-en/spec.json.
export const leadsSceneSeconds: Record<Lang, number[]> = {
  id: [5.6, 5.7, 8.4, 7.9, 6.9, 4.5],
  en: [5.4, 6.1, 7.2, 7.4, 6.5, 4.0],
};

export const leadsTotalSeconds = (lang: Lang) =>
  leadsSceneSeconds[lang].reduce((a, b) => a + b, 0);

// Script "30 detik" (leads), 9:16. Urutan scene mengikuti FTS-Apartment-AI-video-scripts.md
// bagian 3. Dengan VO tempo normal (public/ai-apartment/vo/) totalnya jadi 39 detik.
export const LeadsVideo30: React.FC<{ readonly lang?: Lang }> = ({
  lang = "id",
}) => {
  const { fps } = useVideoConfig();
  const d = leadsSceneSeconds[lang];
  const start = (i: number) =>
    Math.round(d.slice(0, i).reduce((a, b) => a + b, 0) * fps);
  const len = (i: number) => Math.round(d[i] * fps);

  return (
    <LangContext.Provider value={lang}>
      <Track name="Scenes">
        <ProblemScene
          name="1 · Masalah"
          durationInFrames={len(0)}
          style={{ backgroundColor: colors.gray }}
        />
        <UnansweredScene
          name="2 · Tidak dibalas"
          from={start(1)}
          durationInFrames={len(1)}
          style={{ backgroundColor: colors.gray }}
        />
        <RevealScene
          name="3 · Produk muncul"
          from={start(2)}
          durationInFrames={len(2)}
          style={{ backgroundColor: colors.ink }}
        />
        <AnswersScene
          name="4 · AI menjawab"
          from={start(3)}
          durationInFrames={len(3)}
          style={{ backgroundColor: colors.ink }}
        />
        <LiftRequestScene
          name="5 · Lift & permintaan"
          from={start(4)}
          durationInFrames={len(4)}
          style={{ backgroundColor: colors.ink }}
        />
        <CtaScene
          name="6 · CTA"
          from={start(5)}
          durationInFrames={len(5)}
          style={{ backgroundColor: colors.ink }}
        />
      </Track>
    </LangContext.Provider>
  );
};
