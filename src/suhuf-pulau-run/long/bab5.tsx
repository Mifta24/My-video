import type React from "react";
import { appear, bob, pop, slide } from "../../suhuf-bakteri/elements/ToonKit";
import { toon } from "../../suhuf-bakteri/theme";
import type { Cue } from "../elements/Sound";
import { CalendarYear, GraspedIsland, GRASP_CX, GRASP_FLAG_TOP, GRASP_X0, GRASP_Y0, Island, TreatySheet, ToyKid, TableTop } from "../shorts/kit2d";
import { Big, BIG_Y, ChipAt, In, Label, LChip, Shot, Sub } from "./kitLong";
import { BigGlass, BoardDetective, PhotoCard, QBadge, RecapBoard, StruckWord, TimerRing } from "./props";
import { speechEnd } from "./timing";
import type { V } from "./bab1-2";

const L17:React.FC<V>=({t})=>{
  const pause=speechEnd("l17")+0.08;
  return <>
    <Label text="SKEMA" t={t}/>
    <Big text="TERTULIS TUKAR?" t={t} y={BIG_Y} size={117} color={toon.orange}/>
    <In x={205} y={390+bob(t,5,2)} t={t}><Island kind="manhattan-en" w={620} t={t}/></In>
    <In x={1100} y={390+bob(t,5,2,1)} t={t}><Island kind="run" w={620} t={t}/></In>
    <ChipAt cx={530} y={765} t={t}><LChip text="MANHATTAN" color={toon.orangeDark} size={40} flag="en"/></ChipAt>
    <ChipAt cx={1410} y={765} t={t}><LChip text="RUN" color={toon.blueDark} size={40}/></ChipAt>
    <In x={845} y={480+bob(t,6,2)} t={t} at={1.3}><QBadge size={230}/></In>
    {t>=pause?<TimerRing cx={960} cy={560} r={82} p={Math.min(1,(t-pause)/2)} op={appear(t,pause,0.15)}/>:null}
  </>;
};

const L18:React.FC<V>=({t})=><>
  <Shot t={t} to={3.8}>{lt=><>
    <Big text="1667" t={lt} y={BIG_Y} size={150} color={toon.orange}/>
    <In x={745} y={320+bob(t,6,2)} t={lt}><CalendarYear w={430} t={lt} flipAt={0.2} step={0.3} reveal={pop(lt,1.1,0.5)} year="1667"/></In>
  </>}</Shot>
  <Shot t={t} from={3.7}>{lt=><>
    <Big text="PERJANJIAN BREDA" t={lt} y={BIG_Y} size={110} color={toon.blue}/>
    <In x={730} y={320+bob(t,6,2)} t={lt}><TreatySheet w={460} stampP={slide(lt,1.1,0.25)}/></In>
    <Sub text="perjanjian damai" t={lt} at={0.8} y={785} size={46}/>
  </>}</Shot>
</>;

const HoldPair:React.FC<{readonly t:number;readonly at?:number}>=({t,at=0})=>{
  const sq=0.65+0.3*Math.sin(t*2.4);
  const k=1.20;
  const left=(cx:number)=>cx-(GRASP_CX-GRASP_X0)*k;
  const top=(flagTop:number)=>flagTop-(GRASP_FLAG_TOP-GRASP_Y0)*k;
  return <>
    <In x={left(550)} y={top(490)+bob(t,5,2)} t={t} at={at}><GraspedIsland kind="manhattan-en" color={toon.orange} dark={toon.orangeDark} k={k} t={t} squeeze={sq} flag="en"/></In>
    <In x={left(1390)} y={top(490)+bob(t,5,2,1)} t={t} at={at+0.15}><GraspedIsland kind="run" color={toon.blue} dark={toon.blueDark} k={k} t={t} squeeze={sq} flag="nl" mirror/></In>
    <ChipAt cx={570} y={756} t={t} at={at}><LChip text="INGGRIS" color={toon.orangeDark} size={41} flag="en"/></ChipAt>
    <ChipAt cx={1370} y={756} t={t} at={at}><LChip text="BELANDA" color={toon.blueDark} size={41} flag="nl"/></ChipAt>
  </>;
};

const L19:React.FC<V>=({t})=><>
  <Shot t={t} to={3.35}>{lt=><>
    <Big text="BAHASA LATIN" t={lt} y={BIG_Y} size={120} color={toon.blue}/>
    <In x={745} y={325+bob(t,5,2)} t={lt}><TreatySheet w={430}/></In>
    <Sub text="teks asli" t={lt} at={0.5} y={780} size={48}/>
  </>}</Shot>
  <Shot t={t} from={3.25}>{lt=><>
    <Big text="TETAP DIPEGANG" t={lt} y={BIG_Y} size={110} color={toon.orange}/>
    <HoldPair t={lt}/>
  </>}</Shot>
</>;

const L20:React.FC<V>=({t})=><>
  <Label text="PERUMPAMAAN - bukan data" kind="analogi" t={t}/>
  <Shot t={t} to={3.0}>{lt=><>
    <Big text="KUE DI PIRING" t={lt} y={BIG_Y} size={115} color={toon.orange}/>
    <In x={350} y={380+bob(t,5,2)} t={lt}><ToyKid size={265} t={t} shirt={toon.orange} hair="#5A3B27" handTo={[150,158]}/></In>
    <In x={1300} y={380+bob(t,5,2,1)} t={lt}><ToyKid size={265} t={t} shirt={toon.blue} hair="#2B2B2B" handTo={[150,158]}/></In>
    <In x={480} y={690} t={lt}><TableTop w={960} h={100}/></In>
    <In x={640} y={566} t={lt}><div style={{width:200,height:92,background:"#fff",border:`7px solid #27384A`,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:70}}>🍰</div></In>
    <In x={1100} y={566} t={lt}><div style={{width:200,height:92,background:"#fff",border:`7px solid #27384A`,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:70}}>🍰</div></In>
  </>}</Shot>
  <Shot t={t} from={2.9} to={7.3}>{lt=><>
    <Big text="PIRINGMU, MILIKMU" t={lt} y={BIG_Y} size={105} color={toon.blue}/>
    <In x={420} y={380} t={lt}><ToyKid size={250} t={t} shirt={toon.orange} hair="#5A3B27" handTo={[150,158]}/></In>
    <In x={1240} y={380} t={lt}><ToyKid size={250} t={t} shirt={toon.blue} hair="#2B2B2B" handTo={[150,158]}/></In>
    <In x={480} y={690} t={lt}><TableTop w={960} h={100}/></In>
    <ChipAt cx={760} y={550} t={lt}><LChip text="KUE" color={toon.orangeDark} size={45}/></ChipAt>
    <ChipAt cx={1160} y={550} t={lt}><LChip text="KUE" color={toon.blueDark} size={45}/></ChipAt>
  </>}</Shot>
  <Shot t={t} from={7.2}>{lt=><>
    <Big text="BUKAN TUKAR" t={lt} y={BIG_Y} size={123} color={toon.orange}/>
    <In x={775} y={455} t={lt}><StruckWord text="TUKAR" w={370} strike={slide(lt,0.35,0.4)} size={99}/></In>
    <Sub text="yang ada di piringmu tetap" t={lt} y={665} size={47}/>
  </>}</Shot>
</>;

const L21:React.FC<V>=({t})=><>
  <Shot t={t} to={4.75}>{lt=><>
    <Big text="TIDAK DISEBUT" t={lt} y={BIG_Y} size={118} color={toon.blue}/>
    <In x={720} y={335+bob(t,4,2)} t={lt}><TreatySheet w={435} stampP={1}/></In>
    <BigGlass x={930+80*Math.sin(lt*1.4)} y={570+20*Math.sin(lt*2)} r={112}/>
    <ChipAt cx={480} y={635} t={lt} at={0.8}><LChip text="RUN" color={toon.blueDark} size={44}/></ChipAt>
    <ChipAt cx={1460} y={635} t={lt} at={1.2}><LChip text="MANHATTAN" color={toon.orangeDark} size={42}/></ChipAt>
    <Sub text="nama tidak ada di pasal" t={lt} at={1.4} y={790} size={43}/>
  </>}</Shot>
  <Shot t={t} from={4.65}>{lt=><>
    <Big text="TAK ADA KATA TUKAR" t={lt} y={BIG_Y} size={103} color={toon.orange}/>
    <In x={735} y={345} t={lt}><TreatySheet w={450} stampP={1}/></In>
    <In x={785} y={565} t={lt}><StruckWord text="TUKAR" w={350} strike={slide(lt,0.1,0.4)} size={85}/></In>
  </>}</Shot>
</>;

const L22:React.FC<V>=({t})=><>
  <Big text="CATATAN" t={t} y={BIG_Y} size={115} color={toon.blue}/>
  <RecapBoard t={t} items={[
    {x:390,y:95,at:0,node:<PhotoCard w={400} h={220} label="PERJANJIAN"><TreatySheet w={155} stampP={1}/></PhotoCard>,rot:-3},
    {x:895,y:95,at:0.8,node:<PhotoCard w={400} h={220} label="ATURAN"><div style={{fontSize:85,color:toon.orangeDark,fontWeight:700}}>✓</div></PhotoCard>,rot:3},
  ]} strings={[[0,1,1.4]]} stamp={{text:"YANG DIPEGANG, TETAP DIPEGANG",at:3.3,color:toon.blueDark,size:44}}/>
  <BoardDetective t={t} x={130} y={470} size={240}/>
</>;

export const BAB5:Record<string,React.FC<V>>={l17:L17,l18:L18,l19:L19,l20:L20,l21:L21,l22:L22};
export const SFX5:Record<string,readonly Cue[]>={
  l17:[[1.3,"hmm",0.4]], l18:[[0.1,"flip",0.4],[4.8,"stamp",0.7]],
  l19:[[0.1,"page",0.3],[3.25,"whoosh",0.4]],l20:[[0.1,"pop",0.4],[7.6,"strike",0.55]],
  l21:[[0.2,"page",0.3],[4.9,"strike",0.5]],l22:[[1.4,"pencil",0.4],[3.3,"stamp",0.6]],
};
