import { Interactive, useCurrentFrame, useVideoConfig } from "remotion";
import { Backdrop } from "../elements/Backdrop";
import { SfxList } from "../elements/Sound";
import { Voice } from "../elements/Voice";
import { SHORTS_SFX, SHORTS_VISUALS } from "./visuals";

// Satu adegan Shorts (S-01..S-11): latar, visual, narasi + subtitle, SFX.
const ShortsSceneInner = ({ sceneId }: { readonly sceneId: string }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const Visual = SHORTS_VISUALS[sceneId];
  return (
    <>
      <Backdrop seed={sceneId} />
      {Visual ? <Visual t={frame / fps} /> : null}
      <Voice sceneId={sceneId} />
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
