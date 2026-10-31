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
      {Visual ? <Visual t={t} /> : null}
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
