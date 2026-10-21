import { Track, useVideoConfig } from "remotion";
import { LangContext, type Lang } from "../i18n";
import { colors } from "../theme";
import { YtBrochureScene } from "./YtBrochureScene";
import { YtChatScene } from "./YtChatScene";
import { YtCtaScene } from "./YtCtaScene";
import { YtCustomScene } from "./YtCustomScene";
import { YtFormScene } from "./YtFormScene";
import { YtLiftTourScene } from "./YtLiftTourScene";
import { YtProblemScene } from "./YtProblemScene";
import { YtRevealScene } from "./YtRevealScene";

// Panjang tiap scene (detik) per bahasa. Versi Inggris mengikuti VO di vo-en/spec.json.
export const youtubeSceneSeconds: Record<Lang, number[]> = {
  id: [12.6, 16.3, 15.1, 14.4, 16.2, 21.4, 9.7, 9.2],
  en: [12.0, 14.2, 14.6, 14.4, 15.4, 21.0, 9.2, 7.4],
};

export const youtubeTotalSeconds = (lang: Lang) =>
  youtubeSceneSeconds[lang].reduce((a, b) => a + b, 0);

// Script YouTube (16:9), bagian 4 di FTS-Apartment-AI-video-scripts.md.
// Panjang scene mengikuti VO Gadis (public/ai-apartment/vo-yt/), total 1:55.
export const YoutubeVideo: React.FC<{ readonly lang?: Lang }> = ({
  lang = "id",
}) => {
  const { fps } = useVideoConfig();
  const d = youtubeSceneSeconds[lang];
  const start = (i: number) =>
    Math.round(d.slice(0, i).reduce((a, b) => a + b, 0) * fps);
  const len = (i: number) => Math.round(d[i] * fps);

  return (
    <LangContext.Provider value={lang}>
      <Track name="Scenes">
        <YtProblemScene
          name="1 · Jam 02:00"
          durationInFrames={len(0)}
          style={{ backgroundColor: colors.gray }}
        />
        <YtBrochureScene
          name="2 · Brosur online"
          from={start(1)}
          durationInFrames={len(1)}
          style={{ backgroundColor: colors.gray }}
        />
        <YtRevealScene
          name="3 · Produk muncul"
          from={start(2)}
          durationInFrames={len(2)}
          style={{ backgroundColor: colors.ink }}
        />
        <YtLiftTourScene
          name="4 · Naik lift"
          from={start(3)}
          durationInFrames={len(3)}
          style={{ backgroundColor: colors.ink }}
        />
        <YtChatScene
          name="5 · Tanya AI"
          from={start(4)}
          durationInFrames={len(4)}
          style={{ backgroundColor: colors.ink }}
        />
        <YtFormScene
          name="6 · Permintaan sewa"
          from={start(5)}
          durationInFrames={len(5)}
          style={{ backgroundColor: colors.ink }}
        />
        <YtCustomScene
          name="7 · Gedung Anda"
          from={start(6)}
          durationInFrames={len(6)}
          style={{ backgroundColor: colors.ink }}
        />
        <YtCtaScene
          name="8 · CTA"
          from={start(7)}
          durationInFrames={len(7)}
          style={{ backgroundColor: colors.ink }}
        />
      </Track>
    </LangContext.Provider>
  );
};
