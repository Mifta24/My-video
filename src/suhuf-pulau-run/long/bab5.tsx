import type React from "react";
import { appear, bob, pop, slide } from "../../suhuf-bakteri/elements/ToonKit";
import { toon } from "../../suhuf-bakteri/theme";
import type { Cue } from "../elements/Sound";
import { CalendarYear, GRASP_CX, GRASP_FLAG_TOP, GRASP_X0, GRASP_Y0, Island, TreatySheet, ToyKid, TableTop } from "../shorts/kit2d";
import { GraspIslandL, GRASP_BOTTOM } from "./grasp";
import { Big, BIG_Y, ChipAt, In, INK, Label, LChip, Shot, Sub } from "./kitLong";
import { BigGlass, BoardDetective, PhotoCard, QBadge, RecapBoard, RECAP_TITLE_Y, StruckWord, TimerRing } from "./props";
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
    <In x={780} y={305+bob(t,6,2)} t={lt}><TreatySheet w={360} stampP={slide(lt,1.1,0.25)}/></In>
    <Sub text="perjanjian damai" t={lt} at={0.8} y={790} size={44}/>
  </>}</Shot>
</>;

// Genggam (draf 2): rumah/pohon/bendera diangkat ke belakang rumput (GRASP_LIFT) supaya ujung jari tidak menutupi rumah;
// lengan diperpanjang (reach) sehingga selalu masuk dari luar tepi layar; dasar kepalan berjarak >= 30 px dari caption
// bawah (tepi atas caption ~ y 900); chip INGGRIS/BELANDA di atas bendera, bukan di atas kepalan.
export const GRASP_LIFT=66;
// draf 3: tangan Long (GraspIslandL) - genggaman samping: ibu jari di atas pulau, empat jari beda panjang di depan tepi, dasar pasir tetap terlihat
const FIST_BOTTOM=GRASP_BOTTOM; // unit: tepi bawah telapak (termasuk garis tinta)
export const graspBox=(cx:number,fistBottomY:number,k:number)=>({
  x:cx-(GRASP_CX-GRASP_X0)*k,
  y:fistBottomY-(FIST_BOTTOM-GRASP_Y0)*k,
  flagTop:fistBottomY-(FIST_BOTTOM-(GRASP_FLAG_TOP-GRASP_LIFT))*k,
});
const HoldPair:React.FC<{readonly t:number;readonly at?:number}>=({t,at=0})=>{
  const sq=0.65+0.3*Math.sin(t*2.4);
  const k=1.22;
  const L=graspBox(600,800,k);
  const R=graspBox(1320,800,k);
  // chip pemilik di sisi LUAR bendera (tidak di atas kepalan, tidak di bawah judul)
  return <>
    <In x={L.x} y={L.y+bob(t,5,2)} t={t} at={at}><GraspIslandL kind="manhattan-en" color={toon.orange} dark={toon.orangeDark} k={k} t={t} squeeze={sq} flag="en" lift={GRASP_LIFT} reach={260}/></In>
    <In x={R.x} y={R.y+bob(t,5,2,1)} t={t} at={at+0.15}><GraspIslandL kind="run" color={toon.blue} dark={toon.blueDark} k={k} t={t} squeeze={sq} flag="nl" mirror lift={GRASP_LIFT} reach={260}/></In>
    <ChipAt cx={232} y={L.flagTop+28} t={t} at={at+0.3}><LChip text="INGGRIS" color={toon.orangeDark} size={36} flag="en"/></ChipAt>
    <ChipAt cx={1712} y={R.flagTop+28} t={t} at={at+0.45}><LChip text="BELANDA" color={toon.blueDark} size={36} flag="nl"/></ChipAt>
  </>;
};

const L19:React.FC<V>=({t})=><>
  <Shot t={t} to={3.35}>{lt=><>
    <Big text="BAHASA LATIN" t={lt} y={BIG_Y} size={120} color={toon.blue}/>
    <In x={780} y={305+bob(t,5,2)} t={lt}><TreatySheet w={360}/></In>
    <Sub text="teks asli" t={lt} at={0.5} y={790} size={44}/>
  </>}</Shot>
  <Shot t={t} from={3.25}>{lt=><>
    {/* draf 3: judul lengkap sesuai naskah L-19 (draf 2 hanya "TETAP DIPEGANG") */}
    <Big text="YANG DIPEGANG, TETAP DIPEGANG" t={lt} y={BIG_Y+8} size={86} color={toon.orange}/>
    <HoldPair t={lt}/>
  </>}</Shot>
</>;

// draf 2: kue di piring digambar SVG (draf 1 memakai emoji 🍰 yang tampil sebagai kotak kosong karena
// Chromium render tidak punya font emoji)
const CakePlate:React.FC=()=><svg width={200} height={130} viewBox="0 0 200 130" style={{display:"block",overflow:"visible",marginTop:-38}}>
  <ellipse cx={100} cy={84} rx={96} ry={40} fill="#fff" stroke={INK} strokeWidth={7}/>
  <ellipse cx={100} cy={84} rx={64} ry={24} fill="none" stroke="#27384A" strokeWidth={3} opacity={0.25}/>
  {/* potongan kue: sisi depan (bolu + krim), atas (krim), stroberi */}
  <path d="M46,82 L46,46 L138,30 L154,46 L154,82 Z" fill="#F6D7A7" stroke={INK} strokeWidth={6} strokeLinejoin="round"/>
  <path d="M46,62 L154,62" stroke="#F49AB0" strokeWidth={9}/>
  <path d="M46,46 L138,30 L154,46 Z" fill="#FFF4E6" stroke={INK} strokeWidth={6} strokeLinejoin="round"/>
  <path d="M46,46 L154,46" stroke={INK} strokeWidth={6}/>
  <circle cx={118} cy={30} r={13} fill="#E5484D" stroke={INK} strokeWidth={5}/>
  <path d="M114,18 Q118,10 124,16" fill="none" stroke="#3BA55C" strokeWidth={5} strokeLinecap="round"/>
  <ellipse cx={74} cy={52} rx={10} ry={3} fill="#fff" opacity={0.8}/>
</svg>;

const L20:React.FC<V>=({t})=><>
  <Label text="PERUMPAMAAN - bukan data" kind="analogi" t={t}/>
  <Shot t={t} to={3.0}>{lt=><>
    <Big text="KUE DI PIRING" t={lt} y={BIG_Y+14} size={115} color={toon.orange}/>
    <In x={350} y={380+bob(t,5,2)} t={lt}><ToyKid size={265} t={t} shirt={toon.orange} hair="#5A3B27" handTo={[150,158]}/></In>
    <In x={1300} y={380+bob(t,5,2,1)} t={lt}><ToyKid size={265} t={t} shirt={toon.blue} hair="#2B2B2B" handTo={[150,158]}/></In>
    <In x={480} y={690} t={lt}><TableTop w={960} h={100} legs={100}/></In>
    <In x={640} y={602} t={lt}><CakePlate/></In>
    <In x={1100} y={602} t={lt}><CakePlate/></In>
  </>}</Shot>
  <Shot t={t} from={2.9} to={7.3}>{lt=><>
    <Big text="PIRINGMU, MILIKMU" t={lt} y={BIG_Y+14} size={105} color={toon.blue}/>
    <In x={420} y={380} t={lt}><ToyKid size={250} t={t} shirt={toon.orange} hair="#5A3B27" handTo={[150,158]}/></In>
    <In x={1240} y={380} t={lt}><ToyKid size={250} t={t} shirt={toon.blue} hair="#2B2B2B" handTo={[150,158]}/></In>
    <In x={480} y={690} t={lt}><TableTop w={960} h={100} legs={100}/></In>
    <ChipAt cx={760} y={550} t={lt}><LChip text="KUE" color={toon.orangeDark} size={45}/></ChipAt>
    <ChipAt cx={1160} y={550} t={lt}><LChip text="KUE" color={toon.blueDark} size={45}/></ChipAt>
  </>}</Shot>
  <Shot t={t} from={7.2}>{lt=><>
    <Big text="BUKAN TUKAR" t={lt} y={BIG_Y+14} size={123} color={toon.orange}/>
    <In x={775} y={455} t={lt}><StruckWord text="TUKAR" w={370} strike={slide(lt,0.35,0.4)} size={99}/></In>
    <Sub text="yang ada di piringmu tetap" t={lt} y={665} size={47}/>
  </>}</Shot>
</>;

const L21:React.FC<V>=({t})=><>
  <Shot t={t} to={4.75}>{lt=><>
    <Big text="TIDAK DISEBUT" t={lt} y={BIG_Y} size={118} color={toon.blue}/>
    <In x={780} y={305+bob(t,4,2)} t={lt}><TreatySheet w={360} stampP={1}/></In>
    <BigGlass x={930+80*Math.sin(lt*1.4)} y={535+20*Math.sin(lt*2)} r={112}/>
    <ChipAt cx={480} y={635} t={lt} at={0.8}><LChip text="RUN" color={toon.blueDark} size={44}/></ChipAt>
    <ChipAt cx={1460} y={635} t={lt} at={1.2}><LChip text="MANHATTAN" color={toon.orangeDark} size={42}/></ChipAt>
    <Sub text="nama tidak ada di pasal" t={lt} at={1.4} y={790} size={42}/>
  </>}</Shot>
  <Shot t={t} from={4.65}>{lt=><>
    <Big text="TAK ADA KATA TUKAR" t={lt} y={BIG_Y} size={103} color={toon.orange}/>
    <In x={775} y={310} t={lt}><TreatySheet w={370} stampP={1}/></In>
    <In x={785} y={565} t={lt}><StruckWord text="TUKAR" w={350} strike={slide(lt,0.1,0.4)} size={85}/></In>
  </>}</Shot>
</>;

const L22:React.FC<V>=({t})=><>
  <Big text="CATATAN" t={t} y={RECAP_TITLE_Y} size={96} color={toon.blue}/>
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
