import type React from "react";
import { bob, slide } from "../../suhuf-bakteri/elements/ToonKit";
import { toon } from "../../suhuf-bakteri/theme";
import type { Cue } from "../elements/Sound";
import { Island, TableTop, TreatySheet } from "../shorts/kit2d";
import { Big, BIG_Y, ChipAt, Handshake, In, Label, LChip, Shot, Sub, ToyFigure } from "./kitLong";
import { BoardDetective, DashArrow, PhotoCard, RecapBoard, ShipAt, WaterL } from "./props";
import type { V } from "./bab1-2";

const L23:React.FC<V>=({t})=><>
  <Shot t={t} to={5.1}>{lt=><>
    <Big text="USUL PENENGAH" t={lt} y={BIG_Y} size={112} color={toon.blue}/>
    <In x={670} y={345+bob(t,5,2)} t={lt}><ToyFigure size={330} t={t} hat="feather" coat="#7B5AA6" mood="happy" lHand={[26,142]} rHand={[134,145]}/></In>
    <In x={425} y={760} t={lt}><TableTop w={1070} h={80}/></In>
    <ChipAt cx={960} y={713} t={lt} at={1}><LChip text="PENENGAH PRANCIS" color="#7B5AA6" size={42}/></ChipAt>
  </>}</Shot>
  <Shot t={t} from={5.0}>{lt=><>
    <Label text="SKEMA" t={t}/>
    <Big text="SEBUAH USUL" t={lt} y={BIG_Y} size={119} color={toon.orange}/>
    <In x={315} y={335+bob(t,5,2)} t={lt}><Island kind="manhattan-en" w={480} t={t}/></In>
    <In x={1110} y={335+bob(t,5,2,1)} t={lt}><Island kind="run" w={480} t={t}/></In>
    <DashArrow x1={910} y1={630} x2={610} y2={630} p={slide(lt,0.4,1.1)} color={toon.orangeDark} bend={-70}/>
    <DashArrow x1={1010} y1={630} x2={1310} y2={630} p={slide(lt,0.7,1.1)} color={toon.blueDark} bend={-70}/>
    <ChipAt cx={560} y={764} t={lt}><LChip text="INGGRIS" color={toon.orangeDark} size={42} flag="en"/></ChipAt>
    <ChipAt cx={1360} y={764} t={lt}><LChip text="BELANDA" color={toon.blueDark} size={42} flag="nl"/></ChipAt>
  </>}</Shot>
</>;
const L24:React.FC<V>=({t})=><>
  <Shot t={t} to={3.45}>{lt=><>
    <Big text="BELUM SETUJU" t={lt} y={BIG_Y} size={123} color={toon.orange}/>
    <In x={510} y={290+bob(t,5,2)} t={lt}><ToyFigure size={310} t={t} hat="crown" coat={toon.orange} mood="worry" shake={8*Math.sin(t*5)} /></In>
    <In x={1110} y={340+bob(t,5,2,1)} t={lt}><TreatySheet w={320}/></In>
    <Sub text="raja Inggris menolak" t={lt} at={0.5} y={772} size={45}/>
  </>}</Shot>
  <Shot t={t} from={3.35}>{lt=><>
    <Big text="DIBAHAS LAGI" t={lt} y={BIG_Y} size={119} color={toon.blue}/>
    <In x={760} y={330+bob(t,5,2)} t={lt}><TreatySheet w={420}/></In>
    <Sub text="pembicaraan berlanjut" t={lt} y={790} size={45}/>
  </>}</Shot>
</>;
const L25:React.FC<V>=({t})=><>
  <Label text="SKEMA" t={t}/>
  <Shot t={t} to={5.8}>{lt=><>
    <Big text="DI SUNGAI" t={lt} y={BIG_Y} size={127} color={toon.blue}/>
    {/* peta sungai abstrak, tanpa peta perang, meriam, atau api */}
    <div style={{position:"absolute",left:250,top:325,width:1420,height:500,background:"#D9EBC7",border:`8px solid #27384A`,borderRadius:55,overflow:"hidden"}}>
      <svg width="100%" height="100%" viewBox="0 0 1420 500"><path d="M-40,380 Q220,210 430,330 T860,240 T1460,150" fill="none" stroke="#2D859A" strokeWidth={190}/><path d="M-40,380 Q220,210 430,330 T860,240 T1460,150" fill="none" stroke="#BFEAF3" strokeWidth={125}/><path d="M-40,380 Q220,210 430,330 T860,240 T1460,150" fill="none" stroke="#fff" strokeWidth={8} strokeDasharray="30 42" opacity={0.65}/></svg>
    </div>
    <ShipAt kind="nl" cx={680+150*slide(lt,0.2,2.8)} wl={650} w={300} t={t}/>
    <ChipAt cx={960} y={760} t={lt}><LChip text="SUNGAI" color={toon.blueDark} size={43}/></ChipAt>
  </>}</Shot>
  <Shot t={t} from={5.7}>{lt=><>
    <Big text="INGGRIS MENGALAH" t={lt} y={BIG_Y} size={110} color={toon.orange}/>
    <ShipAt kind="en" cx={590} wl={705} w={390} t={t} mood="oh"/>
    <ShipAt kind="nl" cx={1360} wl={705} w={390} t={t} flip phase={1}/>
    <WaterL x0={90} x1={1830} y0={702} y1={842} t={t} seed="pr-l25"/>
    <Sub text="soal Run" t={lt} at={0.3} y={765} size={48}/>
  </>}</Shot>
</>;
const L26:React.FC<V>=({t})=><>
  <Big text="SEPAKAT" t={t} y={BIG_Y} size={128} color={toon.orange}/>
  <In x={420} y={720} t={t}><TableTop w={1080} h={75}/></In>
  <Handshake cx={960} cy={520} t={t} shake={slide(t,1.3,0.5)}/>
  <ChipAt cx={960} y={745} t={t} at={1.7}><LChip text="RUN TETAP DI BELANDA" color={toon.blueDark} size={49} flag="nl"/></ChipAt>
</>;
const L27:React.FC<V>=({t})=><>
  <Big text="CATATAN" t={t} y={BIG_Y} size={115} color={toon.blue}/>
  <RecapBoard t={t} items={[
    {x:285,y:100,at:0,node:<PhotoCard w={315} h={210} label="MANHATTAN"><Island kind="manhattan-en" w={245} t={t}/></PhotoCard>,rot:-3},
    {x:630,y:120,at:0.6,node:<PhotoCard w={315} h={210} label="PERUNDINGAN"><TreatySheet w={150} stampP={1}/></PhotoCard>},
    {x:970,y:100,at:1.1,node:<PhotoCard w={315} h={210} label="RUN"><Island kind="run" w={245} t={t}/></PhotoCard>,rot:3},
  ]} strings={[[0,1,1.5],[2,1,1.8]]} stamp={{text:"DIBAHAS BERSAMAAN",at:3.4,color:toon.orangeDark,size:60}}/>
  <BoardDetective t={t} x={130} y={470} size={240}/>
</>;
export const BAB6:Record<string,React.FC<V>>={l23:L23,l24:L24,l25:L25,l26:L26,l27:L27};
export const SFX6:Record<string,readonly Cue[]>={l23:[[0.2,"pop",0.4],[5.1,"whoosh",0.35]],l24:[[0.1,"hmm",0.35]],l25:[[0.1,"waves",0.35],[5.7,"hmm",0.3]],l26:[[1.3,"ding",0.45],[2.0,"pop",0.4]],l27:[[1.5,"pencil",0.3],[3.4,"stamp",0.6]]};
