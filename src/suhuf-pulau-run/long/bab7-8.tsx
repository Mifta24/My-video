import type React from "react";
import { bob } from "../../suhuf-bakteri/elements/ToonKit";
import { toon } from "../../suhuf-bakteri/theme";
import type { Cue } from "../elements/Sound";
import { FlagPole, GraspedIsland, GRASP_CX, GRASP_FLAG_TOP, GRASP_X0, GRASP_Y0, Island, Ship, TreatySheet } from "../shorts/kit2d";
import { LogoSheet } from "../shorts/visuals";
import { Big, BIG_Y, ChipAt, In, Label, LChip, ScaleLong3D, Shot, Sub, Tetap } from "./kitLong";
import { BigGlass } from "./props";
import { cue } from "./timing";
import type { V } from "./bab1-2";

const L28:React.FC<V>=({t})=><>
  <Label text="SKEMA" t={t}/>
  <Shot t={t} to={5.65}>{lt=><>
    <Big text="MANHATTAN TETAP" t={lt} y={BIG_Y} size={108} color={toon.orange}/>
    <In x={600} y={345+bob(t,5,2)} t={lt}><Island kind="manhattan-en" w={720} t={t}/></In>
    <FlagPole kind="en" x={900} y={636} h={170} w={120} t={t}/>
    <ChipAt cx={960} y={744} t={lt}><LChip text="INGGRIS" color={toon.orangeDark} size={47} flag="en"/></ChipAt>
    <In x={1360} y={510} t={lt} at={0.5}><Tetap color={toon.orange} w={240}/></In>
  </>}</Shot>
  <Shot t={t} from={5.55}>{lt=><>
    <Big text="RUN TETAP" t={lt} y={BIG_Y} size={124} color={toon.blue}/>
    <In x={600} y={345+bob(t,5,2)} t={lt}><Island kind="run" w={720} t={t}/></In>
    <FlagPole kind="nl" x={900} y={636} h={170} w={120} t={t}/>
    <ChipAt cx={960} y={744} t={lt}><LChip text="BELANDA" color={toon.blueDark} size={47} flag="nl"/></ChipAt>
    <In x={1360} y={510} t={lt} at={0.2}><Tetap color={toon.blue} w={240}/></In>
  </>}</Shot>
</>;
const L29:React.FC<V>=({t})=>{
  const morph=cue("l29","tidak sepenuhnya")+0.3;
  return <>
    <Label text="SKEMA" t={t}/>
    <ScaleLong3D t={t} angle={5*Math.sin(t*2.2)} morphAt={morph}/>
    <Shot t={t} to={morph+0.2}>{lt=><Big text="DITUKAR?" t={lt} y={BIG_Y} size={134} color={toon.orange}/>}</Shot>
    <Shot t={t} from={morph+0.1}>{lt=><>
      <Big text="TIDAK SEPENUHNYA SALAH" t={lt} y={BIG_Y} size={94} color={toon.blue}/>
      <Sub text="hasil mirip tukar, pasal tak menyebut tukar" t={lt} at={0.9} y={790} size={39}/>
    </>}</Shot>
  </>;
};
const L30:React.FC<V>=({t})=>{
  const k=0.76;
  const left=(cx:number)=>cx-(GRASP_CX-GRASP_X0)*k;
  const top=(y:number)=>y-(GRASP_FLAG_TOP-GRASP_Y0)*k;
  return <>
    <Label text="SKEMA" t={t}/>
    <Shot t={t} to={3.5}>{lt=><>
      <Big text="YANG TERTULIS" t={lt} y={BIG_Y} size={114} color={toon.blue}/>
      <In x={left(590)} y={top(490)} t={lt}><GraspedIsland kind="manhattan-en" color={toon.orange} dark={toon.orangeDark} k={k} t={t} squeeze={0.6} flag="en"/></In>
      <In x={left(1370)} y={top(490)} t={lt}><GraspedIsland kind="run" color={toon.blue} dark={toon.blueDark} k={k} t={t} squeeze={0.6} flag="nl" mirror/></In>
      <Sub text="yang dipegang, tetap dipegang" t={lt} y={760} size={47}/>
    </>}</Shot>
    <Shot t={t} from={3.4}>{lt=><>
      <Big text="YANG TERJADI" t={lt} y={BIG_Y} size={114} color={toon.orange}/>
      <In x={230} y={380+bob(t,4,2)} t={lt}><Island kind="manhattan-en" w={650} t={t}/></In>
      <In x={1070} y={380+bob(t,4,2,1)} t={lt}><Island kind="run" w={650} t={t}/></In>
      <ChipAt cx={550} y={760} t={lt}><LChip text="INGGRIS" color={toon.orangeDark} size={41} flag="en"/></ChipAt>
      <ChipAt cx={1390} y={760} t={lt}><LChip text="BELANDA" color={toon.blueDark} size={41} flag="nl"/></ChipAt>
    </>}</Shot>
  </>;
};
const L31:React.FC<V>=({t})=><>
  <Label text="SKEMA" t={t}/>
  <Big text="BUKAN TUKAR TERTULIS" t={t} y={BIG_Y} size={99} color={toon.blue}/>
  <ScaleLong3D t={t} angle={2*Math.sin(t*1.9)} morphAt={99}/>
  <Sub text="ceritanya tidak sepenuhnya salah" t={t} at={1.0} y={762} size={47}/>
</>;
const L32:React.FC<V>=({t})=><>
  <Big text="CEK YANG TERTULIS" t={t} y={BIG_Y} size={108} color={toon.blue}/>
  <In x={735} y={325+bob(t,5,2)} t={t}><TreatySheet w={450} stampP={1}/></In>
  <BigGlass x={930+60*Math.sin(t*1.5)} y={530+12*Math.cos(t*2)} r={133}/>
  <Sub text="jangan hanya mengulang cerita" t={t} at={1.5} y={800} size={45}/>
</>;
const L33:React.FC<V>=({t})=><>
  <Big text="SUHUF PENGETAHUAN" t={t} y={BIG_Y} size={103} color={toon.blue}/>
  <In x={820} y={320+bob(t,5,2)} t={t}><LogoSheet w={270}/></In>
  <ChipAt cx={960} y={730} t={t} at={0.5}><LChip text="@suhufpengetahuan" color={toon.orangeDark} size={50}/></ChipAt>
  <In x={270} y={420+bob(t,5,2)} t={t} at={0.2}><Ship kind="en" w={290} t={t} wave={30} sails={["#F0A443","#86AEE6"]}/></In>
  <In x={1360} y={420+bob(t,5,2,1)} t={t} at={0.2}><Ship kind="nl" w={290} t={t} flip wave={30} sails={["#F0A443","#86AEE6"]}/></In>
</>;
export const BAB7_8:Record<string,React.FC<V>>={l28:L28,l29:L29,l30:L30,l31:L31,l32:L32,l33:L33};
export const SFX7_8:Record<string,readonly Cue[]>={l28:[[0.2,"pop",0.4],[5.55,"pop",0.4]],l29:[[0.2,"scale",0.4],[3.5,"hmm",0.4]],l30:[[0.2,"whoosh",0.4],[3.4,"whoosh",0.4]],l31:[[0.2,"scale",0.3]],l32:[[0.2,"page",0.4]],l33:[[0.2,"ding",0.5]]};
