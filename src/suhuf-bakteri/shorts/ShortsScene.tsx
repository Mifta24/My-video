import { Interactive, useCurrentFrame, useVideoConfig } from "remotion";
import { SfxList } from "../elements/Sound";
import { ToonBackdrop } from "../elements/ToonKit";
import { Voice } from "../elements/Voice";
import { SHORTS_SFX, SHORTS_VISUALS } from "./visuals";

// Satu adegan Shorts V3 (S-01..S-11): latar kartun, visual, narasi + subtitle, SFX.
const ShortsSceneInner = ({ sceneId }: { readonly sceneId: string }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const Visual = SHORTS_VISUALS[sceneId];
  return (
    <>
      <ToonBackdrop seed={sceneId} />
      {Visual ? <Visual t={frame / fps} /> : null}
      <Voice sceneId={sceneId} toonStyle />
      <SfxList cues={SHORTS_SFX[sceneId] ?? []} />
    </>
  );
};

export const ShortsScene = Interactive.create({
  Component: ShortsSceneInner,
  layout: "absolute-fill",
  schema: {
    sceneId: { type: "string", default: "s01", description: "ID adegan (s01..s11)" },
  },
});
