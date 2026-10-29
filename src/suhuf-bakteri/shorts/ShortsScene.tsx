import { Interactive, useCurrentFrame, useVideoConfig } from "remotion";
import { SfxList } from "../elements/Sound";
import { ToonBackdrop } from "../elements/ToonKit";
import { Voice } from "../elements/Voice";
import { SHORTS_SFX, SHORTS_VISUALS } from "./visuals";
import { HideToyChars } from "./characters";
import { FULL_3D, OVERLAY_3D } from "./visuals3d";

// Satu adegan Shorts V3 (S-01..S-11): latar kartun, visual, narasi + subtitle, SFX.
// `variant` memilih draf 1 (2D) atau draf 2 (tokoh 3D). Narasi, subtitle, SFX, dan timing sama.
const ShortsSceneInner = ({ sceneId, variant = "2d" }: { readonly sceneId: string; readonly variant?: "2d" | "3d" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const Full = variant === "3d" ? FULL_3D[sceneId] : undefined;
  const Over = variant === "3d" ? OVERLAY_3D[sceneId] : undefined;
  const Visual = SHORTS_VISUALS[sceneId];
  return (
    <>
      <ToonBackdrop seed={sceneId} />
      {Full ? <Full t={t} /> : null}
      {!Full && Visual ? (
        <HideToyChars.Provider value={Boolean(Over)}>
          <Visual t={t} />
        </HideToyChars.Provider>
      ) : null}
      {Over ? <Over t={t} /> : null}
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
