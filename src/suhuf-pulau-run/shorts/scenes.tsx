import { Interactive, useCurrentFrame, useVideoConfig } from "remotion";
import { ToonBackdrop } from "../../suhuf-bakteri/elements/ToonKit";
import { SfxList } from "../elements/Sound";
import { Voice } from "../elements/Voice";
import { PART1, SFX1 } from "./visuals";
import { PART2, SFX2 } from "./visuals2";

export const VISUALS = { ...PART1, ...PART2 };
export const SFX = { ...SFX1, ...SFX2 };

const ShortsSceneInner = ({ sceneId }: { readonly sceneId: string }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const Visual = VISUALS[sceneId];
  return (
    <>
      <ToonBackdrop seed={sceneId} />
      {/* kamera mengambang pelan: adegan "diam" tetap hidup (subtitle & watermark tidak ikut bergerak) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `translate(${Math.sin(t * 0.7) * 7}px, ${Math.cos(t * 0.55) * 9}px) scale(${1 + 0.014 * (0.5 + 0.5 * Math.sin(t * 0.8 + 1))})`,
          transformOrigin: "50% 45%",
        }}
      >
        {Visual ? <Visual t={t} /> : null}
      </div>
      <Voice sceneId={sceneId} />
      <SfxList cues={SFX[sceneId] ?? []} />
    </>
  );
};

export const PulauRunScene = Interactive.create({
  Component: ShortsSceneInner,
  layout: "absolute-fill",
  schema: {
    sceneId: { type: "string", default: "s01", description: "ID adegan (s01..s11)" },
  },
});
