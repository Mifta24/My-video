import { AbsoluteFill, Interactive, Track, useCurrentFrame, useVideoConfig } from "remotion";
import { ToonBackdrop } from "../../suhuf-bakteri/elements/ToonKit";
import { toon } from "../../suhuf-bakteri/theme";
import { MusicBed, SfxList } from "../elements/Sound";
import type { Cue } from "../elements/Sound";
import { BAB1_2, SFX1_2 } from "./bab1-2";
import { BAB3_4, SFX3_4 } from "./bab3-4";
import { BAB5, SFX5 } from "./bab5";
import { BAB6, SFX6 } from "./bab6";
import { BAB7_8, SFX7_8 } from "./bab7-8";
import { LongVoice, LongWatermark } from "./kitLong";
import { longTotalFrames, sceneFrames, sceneFrom, scenesLong } from "./timing";

const VISUALS = { ...BAB1_2, ...BAB3_4, ...BAB5, ...BAB6, ...BAB7_8 };
const SFX: Record<string, readonly Cue[]> = { ...SFX1_2, ...SFX3_4, ...SFX5, ...SFX6, ...SFX7_8 };

const LongSceneInner = ({ sceneId }: { readonly sceneId: string }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const Visual = (VISUALS as Record<string, React.FC<{ readonly t: number }>>)[sceneId];
  return <>
    <ToonBackdrop seed={`pr-long-${sceneId}`} />
    <div style={{position:"absolute",inset:0,transform:`translate(${Math.sin(t*0.7)*5}px, ${Math.cos(t*0.55)*7}px) scale(${1+0.009*(0.5+0.5*Math.sin(t*0.8+1))})`,transformOrigin:"50% 47%"}}>
      {Visual ? <Visual t={t} /> : null}
    </div>
    <LongVoice sceneId={sceneId} />
    <SfxList cues={SFX[sceneId] ?? []} />
  </>;
};

export const LongScene = Interactive.create({Component:LongSceneInner,layout:"absolute-fill",schema:{sceneId:{type:"string",default:"l01",description:"ID adegan l01..l33"}}});
const level=(f:number)=>{
  const fadeIn=Math.min(1,f/30);
  const fadeOut=Math.min(1,(longTotalFrames-f)/120);
  return 0.063*Math.max(0,fadeIn*fadeOut);
};
export const LongVideo = () => <AbsoluteFill style={{backgroundColor:toon.bg}}>
  <Track name="Adegan Long Pulau Run">
    {scenesLong.map(s=><LongScene key={s.id} name={`${s.id.toUpperCase()} ${s.title}`} sceneId={s.id} from={sceneFrom(s.id)} durationInFrames={sceneFrames(s.id)} />)}
  </Track>
  <LongWatermark hideAfter={sceneFrom("l33")} />
  <MusicBed level={level} file="toonbed" />
</AbsoluteFill>;
