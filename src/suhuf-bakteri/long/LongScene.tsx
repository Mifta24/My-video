import { Interactive, useCurrentFrame, useVideoConfig } from "remotion";
import { SfxList } from "../elements/Sound";
import { ToonBackdrop } from "../elements/ToonKit";
import { Voice } from "../elements/Voice";
import { BAB1_3, SFX1_3 } from "./bab1-3";
import { BAB4_5, SFX4_5 } from "./bab4-5";

const VISUALS = { ...BAB1_3, ...BAB4_5 };
const SFX = { ...SFX1_3, ...SFX4_5 };

// Satu adegan video panjang V3 (L-01..L-45): latar kartun, visual, narasi + subtitle, SFX.
const LongSceneInner = ({ sceneId }: { readonly sceneId: string }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const Visual = (VISUALS as Record<string, React.FC<{ readonly t: number }>>)[sceneId];
  const cues = (SFX as Record<string, readonly import("../elements/Sound").Cue[]>)[sceneId] ?? [];
  return (
    <>
      <ToonBackdrop seed={sceneId} />
      {Visual ? <Visual t={t} /> : null}
      <Voice sceneId={sceneId} toonStyle />
      <SfxList cues={cues} />
    </>
  );
};

export const LongScene = Interactive.create({
  Component: LongSceneInner,
  layout: "absolute-fill",
  schema: {
    sceneId: { type: "string", default: "l01", description: "ID adegan (l01..l45)" },
  },
});
