import { interpolate, Interactive, useCurrentFrame, useVideoConfig } from "remotion";
import { Backdrop } from "../elements/Backdrop";
import { clamp, rise } from "../elements/common";
import { SfxList } from "../elements/Sound";
import { Voice } from "../elements/Voice";
import { colors, fonts } from "../theme";
import { getScene, scenesLong } from "../timing";
import { BAB1_3, SFX1_3 } from "./bab1-3";
import { BAB4_5, SFX4_5 } from "./bab4-5";
import { BAB6_7, SFX6_7 } from "./bab6-7";
import { BAB8_11, SFX8_11 } from "./bab8-11";

const VISUALS = { ...BAB1_3, ...BAB4_5, ...BAB6_7, ...BAB8_11 };
const SFX = { ...SFX1_3, ...SFX4_5, ...SFX6_7, ...SFX8_11 };

// Lencana bab kecil di kiri bawah watermark, hanya di adegan pertama tiap bab.
const ChapterBadge = ({ sceneId, t }: { readonly sceneId: string; readonly t: number }) => {
  const s = getScene(sceneId);
  const first = scenesLong.find((x) => x.bab === s.bab)?.id === sceneId;
  if (!first || s.bab === 1) {
    return null;
  }
  const o = rise(t, 0.2, 0.6) * interpolate(t, [4, 4.8], [1, 0], clamp);
  return (
    <div
      style={{
        position: "absolute",
        left: 64,
        top: 76,
        opacity: o,
        fontFamily: fonts.mono,
        fontSize: 20,
        letterSpacing: 3,
        color: colors.muted,
      }}
    >
      BAB {s.bab} · {s.babTitle}
    </div>
  );
};

// Satu adegan video panjang (L-01..L-43): latar, visual, narasi + subtitle, SFX.
const LongSceneInner = ({ sceneId }: { readonly sceneId: string }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const Visual = VISUALS[sceneId];
  return (
    <>
      <Backdrop seed={sceneId} />
      {Visual ? <Visual t={t} /> : null}
      <ChapterBadge sceneId={sceneId} t={t} />
      <Voice sceneId={sceneId} />
      <SfxList cues={SFX[sceneId] ?? []} />
    </>
  );
};

export const LongScene = Interactive.create({
  Component: LongSceneInner,
  layout: "absolute-fill",
  schema: {
    sceneId: { type: "string", default: "l01", description: "ID adegan (l01..l43)" },
  },
});
