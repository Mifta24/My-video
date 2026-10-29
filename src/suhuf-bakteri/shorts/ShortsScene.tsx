import type React from "react";
import { Interactive, useCurrentFrame, useVideoConfig } from "remotion";
import { SfxList } from "../elements/Sound";
import { ToonBackdrop } from "../elements/ToonKit";
import { Voice } from "../elements/Voice";
import { SHORTS_SFX, SHORTS_VISUALS } from "./visuals";
import { SHORTS_VISUALS_3D } from "./visuals3d";

// Satu adegan Shorts V3 (S-01..S-11): latar kartun, visual, narasi + subtitle, SFX.
// `variant` memilih draf 1 (2D) atau draf 2 (tokoh 3D). Narasi, subtitle, SFX, dan timing sama.
const ShortsSceneInner = ({ sceneId, variant = "2d" }: { readonly sceneId: string; readonly variant?: "2d" | "3d" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const map: Record<string, React.FC<{ readonly t: number }>> = variant === "3d" ? { ...SHORTS_VISUALS, ...SHORTS_VISUALS_3D } : SHORTS_VISUALS;
  const Visual = map[sceneId];
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
    variant: { type: "string", default: "2d", description: "2d (draf 1) atau 3d (draf 2)" },
  },
});
