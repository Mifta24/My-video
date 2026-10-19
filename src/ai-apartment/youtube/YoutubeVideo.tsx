import { Track, useVideoConfig } from "remotion";
import { colors } from "../theme";
import { YtBrochureScene } from "./YtBrochureScene";
import { YtChatScene } from "./YtChatScene";
import { YtCtaScene } from "./YtCtaScene";
import { YtCustomScene } from "./YtCustomScene";
import { YtFormScene } from "./YtFormScene";
import { YtLiftTourScene } from "./YtLiftTourScene";
import { YtProblemScene } from "./YtProblemScene";
import { YtRevealScene } from "./YtRevealScene";

// Script YouTube (16:9), bagian 4 di FTS-Apartment-AI-video-scripts.md.
// Panjang scene mengikuti VO Gadis (public/ai-apartment/vo-yt/), total 1:55.
export const YoutubeVideo = () => {
  const { fps } = useVideoConfig();

  return (
    <Track name="Scenes">
      <YtProblemScene
        name="1 · Jam 02:00"
        durationInFrames={12.6 * fps}
        style={{ backgroundColor: colors.gray }}
      />
      <YtBrochureScene
        name="2 · Brosur online"
        from={12.6 * fps}
        durationInFrames={16.3 * fps}
        style={{ backgroundColor: colors.gray }}
      />
      <YtRevealScene
        name="3 · Produk muncul"
        from={28.9 * fps}
        durationInFrames={15.1 * fps}
        style={{ backgroundColor: colors.ink }}
      />
      <YtLiftTourScene
        name="4 · Naik lift"
        from={44 * fps}
        durationInFrames={14.4 * fps}
        style={{ backgroundColor: colors.ink }}
      />
      <YtChatScene
        name="5 · Tanya AI"
        from={58.4 * fps}
        durationInFrames={16.2 * fps}
        style={{ backgroundColor: colors.ink }}
      />
      <YtFormScene
        name="6 · Permintaan sewa"
        from={74.6 * fps}
        durationInFrames={21.4 * fps}
        style={{ backgroundColor: colors.ink }}
      />
      <YtCustomScene
        name="7 · Gedung Anda"
        from={96 * fps}
        durationInFrames={9.7 * fps}
        style={{ backgroundColor: colors.ink }}
      />
      <YtCtaScene
        name="8 · CTA"
        from={105.7 * fps}
        durationInFrames={9.2 * fps}
        style={{ backgroundColor: colors.ink }}
      />
    </Track>
  );
};
