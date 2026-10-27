import type React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { clamp, easeOut } from "../elements/common";
import { Frost } from "../elements/Frost";
import { Particles } from "../elements/Particles";
import { colors, fonts } from "../theme";
import {
  Column43,
  IceCore,
  Profile,
  Thermometer,
  VeiScale,
  VolumeBalls,
} from "./diagrams";
import {
  Backdrop,
  Card,
  END,
  Keyline,
  Label,
  Shot,
  TextBlock,
  clipStart,
} from "./parts";
import { AtmosphereLayer } from "../three/Atmosphere";
import { Draisine, Proxies, RedSunset, SeasonTimeline } from "./detail";
import { GlobeView } from "../three/Globe";
import { REGION } from "./geo";
import { SceneMap } from "./SceneMap";
import { AtmosphereLabels, Takeaways, Timeline } from "./Visual";

type SceneProps = { readonly t: number; readonly progress: number };

const ash = (lt: number, count = 70, opacity = 0.8) => (
  <Particles
    kind="ash"
    t={lt}
    count={count}
    opacity={opacity}
    width={1920}
    height={1080}
  />
);
const snow = (lt: number, count = 90) => (
  <Particles
    kind="snow"
    t={lt}
    count={count}
    opacity={0.9}
    width={1920}
    height={1080}
  />
);
const rain = (lt: number, count = 110) => (
  <Particles
    kind="rain"
    t={lt}
    count={count}
    opacity={0.8}
    width={1920}
    height={1080}
  />
);
const frost = (lt: number, max = 0.85, dur = 4) => (
  <Frost
    intensity={interpolate(lt, [0.3, dur], [0, max], {
      ...clamp,
      easing: easeOut,
    })}
    width={1920}
    height={1080}
  />
);
const shake = (lt: number, amp = 8, decay = 5) => {
  const k = interpolate(lt, [0, decay], [1, 0], clamp);
  return `${Math.sin(lt * 47) * amp * k}px ${Math.cos(lt * 39) * amp * 0.7 * k}px`;
};

// ───────────────────────── B1 · HOOK ─────────────────────────
const B1: React.FC<SceneProps> = ({ t }) => {
  const s = (id: string) => clipStart("b1", id);
  return (
    <>
      <Shot t={t} from={0} to={s("b01_03")}>
        {(lt) => (
          <>
            {ash(lt, 100)}
            <AbsoluteFill style={{ translate: shake(lt) }}>
              <TextBlock
                lt={lt}
                title="APRIL 1815"
                color={colors.warm}
                titleSize={200}
                x={0}
                w={1920}
                y={300}
                align="center"
              />
              <TextBlock
                lt={lt}
                delay={s("b01_02")}
                title="Satu gunung di Sumbawa meledak"
                titleSize={62}
                x={0}
                w={1920}
                y={590}
                align="center"
              />
            </AbsoluteFill>
          </>
        )}
      </Shot>
      <Shot t={t} from={s("b01_03")} to={s("b01_04")}>
        {(lt) => (
          <>
            {snow(lt)}
            {frost(lt)}
            <TextBlock
              lt={lt}
              title="1816"
              color={colors.cold}
              titleSize={230}
              x={0}
              w={1920}
              y={270}
              align="center"
            />
            <TextBlock
              lt={lt}
              delay={0.6}
              title="Banyak wilayah Eropa gagal panen"
              titleSize={62}
              x={0}
              w={1920}
              y={600}
              align="center"
            />
          </>
        )}
      </Shot>
      <Shot t={t} from={s("b01_04")} to={s("b01_07")}>
        {(lt) => (
          <>
            <GlobeView
              t={lt}
              focus={{ lon: 79, lat: 26 }}
              shiftX={-1.35}
              markers={[
                {
                  at: REGION.tambora,
                  color: colors.warm,
                  appearAt: 0.2,
                  pulse: true,
                },
                { at: REGION.europe, color: "#D6F0FF", appearAt: 2.4 },
              ]}
              arcs={[
                {
                  from: REGION.tambora,
                  to: REGION.europe,
                  color: colors.cold,
                  startAt: 0.5,
                  duration: 2.2,
                  lift: 0.16,
                },
              ]}
            />
            <TextBlock
              lt={lt}
              kicker="PERKIRAAN JARAK GARIS LURUS"
              title="± 12.000 km"
              color={colors.sun}
              titleSize={130}
              x={1010}
              w={820}
              y={230}
            />
          </>
        )}
      </Shot>
      <Shot t={t} from={s("b01_05")} to={s("b01_06")}>
        {(lt) => (
          <TextBlock
            lt={lt}
            title="Tanpa pasukan. Tanpa kapal perang."
            titleSize={60}
            x={1010}
            w={820}
            y={560}
          />
        )}
      </Shot>
      <Shot t={t} from={s("b01_06")} to={s("b01_07")}>
        {(lt) => (
          <TextBlock
            lt={lt}
            title="Yang menyeberang: partikel di langit"
            titleSize={60}
            color={colors.cold}
            x={1010}
            w={820}
            y={560}
          />
        )}
      </Shot>
      <Shot t={t} from={s("b01_07")}>
        {(lt) => (
          <>
            {snow(lt)}
            {frost(lt)}
            <TextBlock
              lt={lt}
              kicker="1816 · DI DUA BENUA"
              title="Embun beku"
              color={colors.cold}
              titleSize={170}
              x={0}
              w={1920}
              y={270}
              align="center"
            />
            <TextBlock
              lt={lt}
              delay={0.6}
              title="di bulan Juni"
              titleSize={90}
              x={0}
              w={1920}
              y={510}
              align="center"
            />
            <TextBlock
              lt={lt}
              delay={s("b01_08") - s("b01_07")}
              title="Satu lembar, satu cerita."
              color={colors.sun}
              titleSize={84}
              x={0}
              w={1920}
              y={720}
              align="center"
            />
          </>
        )}
      </Shot>
    </>
  );
};

// ───────────────────── B2 · PEMBUKA & PETA JALAN ─────────────────────
const B2: React.FC<SceneProps> = ({ t, progress }) => (
  <>
    <Backdrop src="tambora-nasa-iss.jpg" lt={t} brightness={0.32} />
    {ash(t, 40, 0.5)}
    <TextBlock
      lt={t}
      kicker="SELAMAT DATANG DI"
      title="Suhuf Pengetahuan"
      color={colors.cold}
      titleSize={118}
      x={0}
      w={1920}
      y={150}
      align="center"
    />
    <TextBlock
      lt={t}
      delay={clipStart("b2", "b02_02")}
      title="Satu rantai sebab-akibat"
      titleSize={64}
      x={0}
      w={1920}
      y={350}
      align="center"
    />
    <Timeline progress={progress} />
  </>
);

// ───────────────────── B3 · SUMBAWA & TAMBORA ─────────────────────
const B3: React.FC<SceneProps> = ({ t }) => {
  const s = (id: string) => clipStart("b3", id);
  return (
    <>
      <Shot t={t} from={0} to={s("b03_04")}>
        {(lt) => (
          <>
            <SceneMap kind="tambora" progress={Math.min(1, lt / 12)} />
            <TextBlock
              lt={lt}
              kicker="NUSA TENGGARA BARAT"
              title="Pulau Sumbawa"
              x={120}
              y={150}
              w={900}
              titleSize={90}
              body="Di antara Lombok dan Flores"
            />
            <TextBlock
              lt={lt}
              delay={s("b03_03")}
              title="Gunung Tambora"
              color={colors.warm}
              x={120}
              y={540}
              w={900}
              titleSize={70}
              body="8,25° LS · 118° BT"
            />
          </>
        )}
      </Shot>
      <Shot t={t} from={s("b03_04")} to={s("b03_07")}>
        {(lt) => (
          <>
            <Profile lt={lt} showNow={false} />
            <TextBlock
              lt={lt}
              kicker="SEBELUM 1815"
              title="Lebih tinggi dari Rinjani"
              x={0}
              w={1920}
              y={150}
              align="center"
              titleSize={72}
            />
            <TextBlock
              lt={lt}
              delay={s("b03_06") - s("b03_04")}
              title="Berabad-abad tidak meletus besar"
              x={1230}
              y={300}
              w={600}
              titleSize={52}
              color={colors.warm}
            />
          </>
        )}
      </Shot>
      <Shot t={t} from={s("b03_07")}>
        {(lt) => (
          <>
            <Card
              src="peta-sumbawa-1855.jpg"
              lt={lt}
              x={160}
              y={150}
              w={1600}
              h={584}
              caption="Peta Pulau Sumbawa dan Tambora, 1855"
              zoomTo={1.18}
              position="48% 22%"
            />
            <Keyline
              sceneId="b3"
              t={t}
              top={790}
              lines={{
                b03_07: "Beberapa kerajaan kecil di lereng gunung",
                b03_09: "Bertani · beternak · berdagang",
                b03_10: "Kuda · madu · kayu sepang",
                b03_11: "Bahasa Tambora dan Pekat punya identitas sendiri",
                b03_13: "Tempat berpenghuni, punya budaya",
              }}
            />
          </>
        )}
      </Shot>
    </>
  );
};

// ───────────────────── B4 · LETUSAN APRIL 1815 ─────────────────────
const B4: React.FC<SceneProps> = ({ t }) => {
  const s = (id: string) => clipStart("b4", id);
  return (
    <>
      <Shot t={t} from={0} to={s("b04_01")}>
        {(lt) => (
          <>
            <Backdrop src="tambora-nasa-iss.jpg" lt={lt} brightness={0.34} />
            {ash(lt, 30, 0.45)}
            <TextBlock
              lt={lt}
              kicker="TANDA-TANDA SEBELUMNYA"
              title="1812"
              color={colors.warm}
              titleSize={200}
              x={0}
              w={1920}
              y={200}
              align="center"
            />
            <TextBlock
              lt={lt}
              delay={s("b04_x2")}
              title="Gunung mulai bergemuruh"
              titleSize={66}
              x={0}
              w={1920}
              y={520}
              align="center"
            />
          </>
        )}
      </Shot>
      <Shot t={t} from={s("b04_01")} to={s("b04_04")}>
        {(lt) => (
          <>
            <Backdrop src="tambora-nasa-iss.jpg" lt={lt} brightness={0.38} />
            {ash(lt, 80)}
            <AbsoluteFill style={{ translate: shake(lt, 6, 3) }}>
              <TextBlock
                lt={lt}
                kicker="LETUSAN PERTAMA"
                title="5 April 1815"
                color={colors.warm}
                titleSize={140}
                x={0}
                w={1920}
                y={250}
                align="center"
              />
            </AbsoluteFill>
            <Keyline
              sceneId="b4"
              t={t}
              top={640}
              to={s("b04_04")}
              lines={{
                b04_02: "Dentumannya terdengar sampai Jawa dan Sumatra",
                b04_03: "Dikira tembakan meriam",
                b04_x3:
                  "Lima hari berikutnya: terus menggelegar, menyemburkan abu",
              }}
            />
          </>
        )}
      </Shot>
      <Shot t={t} from={s("b04_04")} to={s("b04_06")}>
        {(lt) => (
          <>
            <Backdrop src="tambora-nasa-iss.jpg" lt={lt} brightness={0.3} />
            {ash(lt, 120, 0.9)}
            <AbsoluteFill style={{ translate: shake(lt, 9, 4) }}>
              <TextBlock
                lt={lt}
                kicker="PUNCAKNYA"
                title="10 April 1815"
                color={colors.warm}
                titleSize={150}
                x={0}
                w={1920}
                y={250}
                align="center"
              />
              <TextBlock
                lt={lt}
                delay={s("b04_05") - s("b04_04")}
                title="Letusan malam itu jauh lebih besar"
                titleSize={58}
                x={0}
                w={1920}
                y={520}
                align="center"
              />
            </AbsoluteFill>
            <Keyline
              sceneId="b4"
              t={t}
              top={700}
              lines={{
                b04_x4:
                  "Saksi di Sanggar: tiga lajur api menyatu jadi satu pilar",
              }}
            />
          </>
        )}
      </Shot>
      <Shot t={t} from={s("b04_06")} to={s("b04_07")}>
        {(lt) => <Column43 lt={lt} />}
      </Shot>
      <Shot t={t} from={s("b04_07")} to={s("b04_11")}>
        {(lt) => (
          <>
            <Backdrop src="tephra-layers.jpg" lt={lt} brightness={0.42} />
            {ash(lt, 70, 0.7)}
            <TextBlock
              lt={lt}
              kicker="AWAN PANAS"
              title="Gas, abu, dan batu yang sangat panas"
              x={120}
              y={160}
              w={1100}
              titleSize={78}
            />
            <Keyline
              sceneId="b4"
              t={t}
              top={640}
              lines={{
                b04_07: "Meluncur menuruni lereng sampai ke laut",
                b04_08: "Kampung-kampung di kaki gunung tertimbun",
                b04_09: "Laut terdorong · tsunami menghantam pantai",
                b04_10: "Di Sanggar, sekitar 4 meter (dilaporkan)",
                b04_x5: "Batu apung mengapung di laut, menyulitkan pelayaran",
              }}
            />
          </>
        )}
      </Shot>
      <Shot t={t} from={s("b04_11")} to={s("b04_13")}>
        {(lt) => (
          <>
            <Card
              src="ashfall-1815.png"
              lt={lt}
              x={120}
              y={130}
              w={1000}
              h={735}
              caption="Sebaran abu letusan Tambora 1815"
              grade={false}
              fit="contain"
            />
            <TextBlock
              lt={lt}
              kicker="ABU"
              title="Jatuh sampai ratusan kilometer"
              x={1190}
              y={250}
              w={640}
              titleSize={64}
            />
            <TextBlock
              lt={lt}
              delay={s("b04_12") - s("b04_11")}
              title="Siang gelap berhari-hari"
              color={colors.warm}
              x={1190}
              y={560}
              w={640}
              titleSize={56}
            />
          </>
        )}
      </Shot>
      <Shot t={t} from={s("b04_13")} to={s("b04_15")}>
        {(lt) => (
          <>
            <Card
              src="raffles.jpg"
              lt={lt}
              x={200}
              y={110}
              w={600}
              h={776}
              caption="Thomas Stamford Raffles"
              position="50% 20%"
            />
            <TextBlock
              lt={lt}
              kicker="SAKSI MATA"
              title="Letnan Owen Phillips"
              x={900}
              y={230}
              w={900}
              titleSize={74}
              body="dikirim Raffles, penguasa Inggris di Jawa, ke Sumbawa"
            />
            <TextBlock
              lt={lt}
              delay={s("b04_14") - s("b04_13")}
              title="Mencatat desa rusak dan penduduk kelaparan"
              x={900}
              y={640}
              w={900}
              titleSize={50}
              color={colors.warm}
            />
          </>
        )}
      </Shot>
      <Shot t={t} from={s("b04_15")} to={s("b04_17")}>
        {(lt) => (
          <>
            <Profile lt={lt} showNow />
            <TextBlock
              lt={lt}
              title="Puncak gunung itu tidak ada lagi"
              x={0}
              w={1920}
              y={130}
              titleSize={70}
              align="center"
            />
            <Keyline
              sceneId="b4"
              t={t}
              top={225}
              lines={{
                b04_x6: "Ruang magma terkuras, puncak runtuh ke dalam",
              }}
            />
          </>
        )}
      </Shot>
      <Shot t={t} from={s("b04_17")} to={s("b04_18")}>
        {(lt) => (
          <>
            <Card
              src="caldera-panorama.jpg"
              lt={lt}
              x={160}
              y={110}
              w={1600}
              h={352}
              caption="Kaldera Tambora hari ini"
              zoomTo={1.06}
            />
            <TextBlock
              lt={lt}
              delay={0.5}
              kicker="KALDERA"
              title="Lebar ± 6–7 km"
              x={0}
              w={1920}
              y={580}
              titleSize={96}
              align="center"
              color={colors.warm}
              body="dalam lebih dari 600 meter"
            />
          </>
        )}
      </Shot>
      <Shot t={t} from={s("b04_18")} to={s("b04_19")}>
        {(lt) => <VeiScale lt={lt} />}
      </Shot>
      <Shot t={t} from={s("b04_19")}>
        {(lt) => (
          <>
            <VolumeBalls lt={lt} />
            <Label x={960} y={92} align="center" size={44} color={colors.warm}>
              Letusan terbesar dalam sejarah tercatat
            </Label>
            <Keyline
              sceneId="b4"
              t={t}
              x={1000}
              w={800}
              size={40}
              top={350}
              lines={{
                b04_x7: "Krakatau 1883 dan Pinatubo 1991: sama-sama VEI 6",
                b04_x8: "Tambora ≈ 5× Krakatau · ≈ 10× Pinatubo (volume)",
              }}
            />
          </>
        )}
      </Shot>
    </>
  );
};

// ───────────────────── B5 · YANG DILEMPARKAN KE ATMOSFER ─────────────────────
const B5: React.FC<SceneProps> = ({ t }) => {
  const s = (id: string) => clipStart("b5", id);
  return (
    <>
      <Shot t={t} from={0} to={s("b05_04")}>
        {(lt) => (
          <>
            {ash(lt, 90)}
            <TextBlock
              lt={lt}
              kicker="YANG PENTING BUKAN..."
              title="Bukan abunya"
              color={colors.warm}
              titleSize={150}
              x={0}
              w={1920}
              y={250}
              align="center"
            />
            <Keyline
              sceneId="b5"
              t={t}
              top={640}
              to={s("b05_04")}
              lines={{
                b05_03:
                  "Abu itu berat: jatuh dalam hitungan hari sampai minggu",
              }}
            />
          </>
        )}
      </Shot>
      <Shot t={t} from={s("b05_04")} to={s("b05_x2")}>
        {() => (
          <>
            <AtmosphereLayer
              wide
              t={t - s("b05_04")}
              col={interpolate(t, [s("b05_05"), s("b05_05") + 5], [0, 1], {
                ...clamp,
                easing: easeOut,
              })}
              spread={interpolate(t, [s("b05_06"), s("b05_08") + 4], [0, 1], {
                ...clamp,
                easing: easeOut,
              })}
              rays={interpolate(
                t,
                [s("b05_09"), s("b05_09") + 1.2],
                [0, 1],
                clamp,
              )}
              sunDim={
                1 -
                0.55 *
                  interpolate(t, [s("b05_09"), s("b05_10") + 2], [0, 1], clamp)
              }
              dim={interpolate(
                t,
                [s("b05_10"), s("b05_10") + 2],
                [0, 1],
                clamp,
              )}
            />
            <AtmosphereLabels />
            <TextBlock
              lt={t - s("b05_04")}
              kicker="YANG PENTING"
              title="Gas belerang (SO₂)"
              color={colors.sun}
              x={120}
              y={100}
              w={1100}
              titleSize={64}
            />
            <Keyline
              sceneId="b5"
              t={t}
              top={790}
              lines={{
                b05_x1: "Perkiraan: sekitar 60 juta ton belerang",
                b05_05: "Menembus troposfer, naik ke stratosfer",
                b05_06: "Jadi butiran asam sulfat: aerosol",
                b05_07: "Di stratosfer tidak ada hujan yang membersihkannya",
                b05_08: "Bertahan berbulan-bulan sampai beberapa tahun",
                b05_09: "Memantulkan sinar Matahari ke luar angkasa",
                b05_10: "Permukaan bumi menerima lebih sedikit panas",
              }}
            />
          </>
        )}
      </Shot>
      <Shot t={t} from={s("b05_x2")} to={s("b05_11")}>
        {(lt) => (
          <>
            <RedSunset lt={lt} />
            <Keyline
              sceneId="b5"
              t={t}
              top={790}
              lines={{
                b05_x3: "Di Eropa: senja merah menyala sesudah letusan",
                b05_x4:
                  "Lukisan senja Turner kerap disebut jejaknya (diperdebatkan)",
              }}
            />
          </>
        )}
      </Shot>
      <Shot t={t} from={s("b05_11")} to={s("b05_x5")}>
        {(lt) => (
          <>
            <IceCore lt={lt} />
            <Keyline
              sceneId="b5"
              t={t}
              top={790}
              lines={{
                b05_11: "Bagaimana kita tahu?",
                b05_12: "Jejaknya tersimpan di es",
                b05_13: "Lapisan es dengan kadar sulfat yang melonjak",
                b05_14: "Ada satu lonjakan lagi sekitar 1809",
                b05_15: "Dekade 1810-an dingin karena dua letusan",
              }}
            />
          </>
        )}
      </Shot>
      <Shot t={t} from={s("b05_x5")} to={s("b05_16")}>
        {(lt) => (
          <>
            <Proxies
              lt={lt}
              cues={{
                tree: s("b05_x6") - s("b05_x5"),
                weather: s("b05_x7") - s("b05_x5"),
                all: s("b05_x8") - s("b05_x5"),
              }}
            />
            <TextBlock
              lt={lt}
              kicker="PETUNJUK LAIN"
              title="Bukan hanya es"
              x={0}
              w={1920}
              y={70}
              titleSize={84}
              align="center"
            />
            <Keyline
              sceneId="b5"
              t={t}
              top={815}
              lines={{
                b05_x6: "Cincin pohon: pertumbuhan tertekan di 1816",
                b05_x7: "Catatan cuaca: musim panas dingin dan basah",
                b05_x8: "Digabung: 1816 termasuk yang terdingin",
              }}
            />
          </>
        )}
      </Shot>
      <Shot t={t} from={s("b05_16")}>
        {(lt) => (
          <>
            {snow(lt, 40)}
            <TextBlock
              lt={lt}
              kicker="PENYEBAB LAIN YANG MUNGKIN"
              title="Dalton Minimum"
              color={colors.sun}
              titleSize={120}
              x={0}
              w={1920}
              y={230}
              align="center"
              body="Matahari sedang dalam aktivitas rendah"
            />
            <TextBlock
              lt={lt}
              delay={s("b05_18") - s("b05_16")}
              title="Tapi pemicu utamanya: letusan"
              titleSize={64}
              color={colors.warm}
              x={0}
              w={1920}
              y={660}
              align="center"
            />
          </>
        )}
      </Shot>
    </>
  );
};

// ───────────────────── B6 · 1816 DI EROPA ─────────────────────
const B6: React.FC<SceneProps> = ({ t }) => {
  const s = (id: string) => clipStart("b6", id);
  return (
    <>
      {rain(t)}
      <Shot t={t} from={0} to={s("b06_04")}>
        {(lt) => (
          <>
            {frost(lt, 0.5)}
            <TextBlock
              lt={lt}
              kicker="EROPA · 1816"
              title="Musim panas yang tidak pernah datang"
              x={160}
              w={1600}
              y={130}
              titleSize={100}
              align="center"
              color={colors.cold}
            />
            <SeasonTimeline
              lt={lt}
              y={600}
              items={[
                {
                  label: "MEI",
                  note: "lebih dingin dari biasanya",
                  at: s("b06_x1"),
                },
                {
                  label: "JUNI–JULI",
                  note: "hujan nyaris tanpa henti",
                  at: s("b06_x2"),
                },
                {
                  label: "BANJIR",
                  note: "Rhine dan sungai lain meluap",
                  at: s("b06_x3"),
                  color: colors.warm,
                },
              ]}
            />
          </>
        )}
      </Shot>
      <Shot t={t} from={s("b06_04")} to={s("b06_08")}>
        {(lt) => (
          <>
            <Card
              src="anomali-1816.png"
              lt={lt}
              x={1000}
              y={90}
              w={820}
              h={652}
              caption="Suhu musim panas 1816 vs rata-rata 1971–2000 (°C)"
              grade={false}
            />
            <TextBlock
              lt={lt}
              kicker="BELAHAN BUMI UTARA"
              title="≈ −0,5 °C"
              color={colors.cold}
              x={110}
              y={210}
              w={850}
              titleSize={150}
            />
            <TextBlock
              lt={lt}
              delay={s("b06_05") - s("b06_04")}
              title="Kedengarannya kecil"
              titleSize={56}
              x={110}
              y={470}
              w={850}
            />
            <TextBlock
              lt={lt}
              delay={s("b06_06") - s("b06_04")}
              title="Tapi pertanian tidak butuh perubahan besar untuk gagal"
              titleSize={44}
              x={110}
              y={570}
              w={850}
              color={colors.warm}
            />
          </>
        )}
      </Shot>
      <Shot t={t} from={s("b06_08")} to={s("b06_12")}>
        {(lt) => (
          <>
            {frost(lt, 0.4)}
            <TextBlock
              lt={lt}
              kicker="YANG PALING TERASA"
              title="Hujan dan mendung berminggu-minggu"
              x={120}
              y={170}
              w={900}
              titleSize={86}
              color={colors.cold}
            />
            <Card
              src="hunger-1817.jpg"
              lt={lt}
              delay={s("b06_10") - s("b06_08")}
              x={1060}
              y={150}
              w={760}
              h={467}
              caption="Masa kelaparan 1817, gambar sezaman"
            />
            <Keyline
              sceneId="b6"
              t={t}
              top={690}
              lines={{
                b06_09: "Di musim yang seharusnya hangat dan kering",
                b06_10: "Gandum, jelai, dan kentang membusuk di ladang",
                b06_x4: "Panen anggur terlambat, hasilnya buruk",
                b06_11:
                  "Panen jatuh: Swiss, Jerman, Prancis, Inggris, Irlandia",
                b06_x5:
                  "Swiss timur: orang memakan rumput dan lumut (tercatat)",
              }}
            />
          </>
        )}
      </Shot>
      <Shot t={t} from={s("b06_12")} to={s("b06_15")}>
        {(lt) => (
          <>
            <Card
              src="waterloo.jpg"
              lt={lt}
              x={110}
              y={110}
              w={1000}
              h={682}
              caption="Pertempuran Waterloo, Juni 1815 (lukisan)"
            />
            <TextBlock
              lt={lt}
              kicker="WAKTUNYA SANGAT BURUK"
              title="Eropa baru lepas dari perang Napoleon"
              x={1170}
              y={210}
              w={650}
              titleSize={62}
            />
            <TextBlock
              lt={lt}
              delay={s("b06_14") - s("b06_12")}
              title="Persediaan pangan tipis · kas negara kosong"
              x={1170}
              y={600}
              w={650}
              titleSize={44}
              color={colors.warm}
            />
          </>
        )}
      </Shot>
      <Shot t={t} from={s("b06_15")} to={s("b06_x6")}>
        {(lt) => (
          <>
            {frost(lt, 0.4)}
            <TextBlock
              lt={lt}
              kicker="AKIBATNYA"
              title="Harga pangan melonjak"
              x={120}
              y={180}
              w={900}
              titleSize={96}
              color={colors.warm}
            />
            <Card
              src="hunger-1817.jpg"
              lt={lt}
              delay={0.6}
              x={1060}
              y={150}
              w={760}
              h={467}
              caption="Kelaparan 1817, gambar sezaman"
            />
            <Keyline
              sceneId="b6"
              t={t}
              top={690}
              lines={{
                b06_16: "Di beberapa tempat harga gandum naik berlipat",
                b06_17: "Kerusuhan pangan pecah di sejumlah kota",
                b06_18: "Keluarga meninggalkan kampung, mencari makan",
              }}
            />
          </>
        )}
      </Shot>
      <Shot t={t} from={s("b06_x6")} to={s("b06_x7")}>
        {(lt) => (
          <>
            {frost(lt, 0.4)}
            <TextBlock
              lt={lt}
              kicker="IRLANDIA · 1816–1819"
              title="Gagal panen, lalu wabah tifus"
              x={0}
              w={1920}
              y={250}
              titleSize={104}
              align="center"
              color={colors.warm}
              body="diperkirakan menewaskan puluhan ribu orang"
            />
          </>
        )}
      </Shot>
      <Shot t={t} from={s("b06_x7")} to={s("b06_19")}>
        {(lt) => (
          <>
            <Draisine lt={lt} />
            <TextBlock
              lt={lt}
              kicker="DARI KRISIS PAKAN?"
              title="Sepeda tanpa pedal, 1817"
              x={1000}
              y={190}
              w={830}
              titleSize={70}
              color={colors.cold}
              body="Karl Drais · Jerman"
            />
            <Keyline
              sceneId="b6"
              t={t}
              x={1000}
              w={830}
              size={38}
              top={560}
              lines={{
                b06_x8: "Harga pakan melonjak, banyak kuda mati atau dijual",
                b06_x9: "Drais membuat Laufmaschine tanpa pedal",
                b06_x10: "Masuk akal, tapi masih dugaan",
              }}
            />
          </>
        )}
      </Shot>
      <Shot t={t} from={s("b06_19")}>
        {(lt) => (
          <>
            {frost(lt, 0.4)}
            <TextBlock
              lt={lt}
              kicker="SEJARAWAN JOHN POST"
              title="Krisis pangan besar terakhir di dunia Barat"
              x={160}
              w={1600}
              y={280}
              titleSize={92}
              align="center"
              color={colors.warm}
              body="1816–1817"
            />
          </>
        )}
      </Shot>
    </>
  );
};

// ───────────────────── B7 · AMERIKA UTARA & LAINNYA ─────────────────────
const B7: React.FC<SceneProps> = ({ t }) => {
  const s = (id: string) => clipStart("b7", id);
  return (
    <>
      {snow(t, 80)}
      <Shot t={t} from={0} to={s("b07_03")}>
        {(lt) => (
          <>
            {frost(lt, 0.8)}
            <TextBlock
              lt={lt}
              kicker="JULUKAN DI SEBERANG ATLANTIK"
              title="Eighteen Hundred and Froze to Death"
              x={160}
              w={1600}
              y={260}
              titleSize={104}
              align="center"
              color={colors.cold}
            />
            <TextBlock
              lt={lt}
              delay={s("b07_02")}
              title="Tahun 1800 yang membeku sampai mati"
              x={160}
              w={1600}
              y={640}
              titleSize={54}
              align="center"
            />
          </>
        )}
      </Shot>
      <Shot t={t} from={s("b07_03")} to={s("b07_x1")}>
        {(lt) => (
          <>
            <Thermometer lt={lt} />
            <TextBlock
              lt={lt}
              kicker="NEW ENGLAND · KANADA TIMUR"
              title="Berulang kali, di musim hangat"
              x={1010}
              y={120}
              w={830}
              titleSize={48}
            />
            <Keyline
              sceneId="b7"
              t={t}
              top={800}
              lines={{ b07_04: "Salju turun di awal Juni (dilaporkan)" }}
            />
          </>
        )}
      </Shot>
      <Shot t={t} from={s("b07_x1")} to={s("b07_05")}>
        {(lt) => (
          <>
            {frost(lt, 0.7)}
            <TextBlock
              lt={lt}
              kicker="6–11 JUNI 1816"
              title="Salju di bulan Juni"
              x={0}
              w={1920}
              y={230}
              titleSize={130}
              align="center"
              color={colors.cold}
              body="Kanada · New England · New York bagian utara"
            />
          </>
        )}
      </Shot>
      <Shot t={t} from={s("b07_05")} to={s("b07_07")}>
        {(lt) => (
          <>
            {frost(lt, 0.6)}
            <TextBlock
              lt={lt}
              kicker="DAMPAKNYA"
              title="Jagung hangus. Harga naik."
              x={160}
              w={1600}
              y={240}
              titleSize={100}
              align="center"
              color={colors.warm}
            />
            <TextBlock
              lt={lt}
              delay={s("b07_06") - s("b07_05")}
              title="Banyak keluarga petani pindah ke barat"
              x={160}
              w={1600}
              y={520}
              titleSize={64}
              align="center"
            />
            <Keyline
              sceneId="b7"
              t={t}
              top={760}
              lines={{
                b07_x2:
                  "Jagung ditanam ulang berkali-kali, tetap gagal (dilaporkan)",
              }}
            />
          </>
        )}
      </Shot>
      <Shot t={t} from={s("b07_07")}>
        {(lt) => (
          <>
            <GlobeView
              t={lt}
              focus={{ lon: 100, lat: 12 }}
              shiftX={1.35}
              markers={[
                {
                  at: REGION.tambora,
                  color: colors.warm,
                  appearAt: 0.2,
                  pulse: true,
                },
                { at: REGION.india, color: colors.cold, appearAt: 1.6 },
                {
                  at: { lon: 102, lat: 26 },
                  color: colors.cold,
                  appearAt: 2.6,
                },
              ]}
              arcs={[
                {
                  from: REGION.tambora,
                  to: REGION.india,
                  color: colors.cold,
                  startAt: 0.8,
                  duration: 2,
                  lift: 0.08,
                },
                {
                  from: REGION.tambora,
                  to: { lon: 102, lat: 26 },
                  color: colors.cold,
                  startAt: 1.8,
                  duration: 2,
                  lift: 0.08,
                },
              ]}
            />
            <TextBlock
              lt={lt}
              kicker="BAGIAN DUNIA LAIN"
              title="Musim hujan di India terganggu"
              x={110}
              y={110}
              w={1000}
              titleSize={64}
            />
            <TextBlock
              lt={lt}
              delay={1.0}
              title="Kelaparan di barat daya Tiongkok"
              x={110}
              y={310}
              w={1000}
              titleSize={54}
              color={colors.warm}
            />
            <Label x={110} y={560} mono size={28} color={colors.muted}>
              sebagian peneliti mengaitkannya dengan Tambora
            </Label>
            <Keyline
              sceneId="b7"
              t={t}
              x={110}
              w={950}
              size={40}
              top={660}
              lines={{
                b07_x3:
                  "India 1816: hujan terlambat, panen padi Bengal terganggu",
                b07_x4:
                  "Kolera 1817 dari Bengal: kaitannya masih diperdebatkan",
                b07_x5: "Yunnan: dingin dan basah, gagal panen, kelaparan",
                b07_x6: "Peran Tambora di semua itu: masih diperdebatkan",
                b07_x7: "Cuaca selalu punya banyak penyebab",
              }}
            />
          </>
        )}
      </Shot>
    </>
  );
};

// ───────────────────── B8 · FRANKENSTEIN (OPSIONAL) ─────────────────────
const B8: React.FC<SceneProps> = ({ t }) => {
  const s = (id: string) => clipStart("b8", id);
  return (
    <>
      <Shot t={t} from={0} to={s("b08_03")}>
        {(lt) => (
          <>
            <Backdrop src="villa-diodati.jpg" lt={lt} brightness={0.5} />
            {rain(lt, 90)}
            <TextBlock
              lt={lt}
              kicker="JUNI 1816 · DANAU JENEWA, SWISS"
              title="Villa Diodati"
              x={120}
              y={200}
              w={1000}
              titleSize={120}
            />
            <TextBlock
              lt={lt}
              delay={s("b08_02")}
              title="Lord Byron menyewa sebuah vila"
              x={120}
              y={420}
              w={1000}
              titleSize={54}
            />
          </>
        )}
      </Shot>
      <Shot t={t} from={s("b08_03")} to={s("b08_05")}>
        {(lt) => (
          <>
            {rain(lt, 90)}
            <Card
              src="byron.jpg"
              lt={lt}
              x={240}
              y={100}
              w={440}
              h={570}
              caption="Lord Byron"
              position="50% 20%"
            />
            <Card
              src="percy-shelley.jpg"
              lt={lt}
              delay={0.8}
              x={740}
              y={100}
              w={440}
              h={570}
              caption="Percy Shelley"
              position="50% 20%"
            />
            <Card
              src="mary-shelley.jpg"
              lt={lt}
              delay={1.6}
              x={1240}
              y={100}
              w={440}
              h={570}
              caption="Mary Godwin"
              position="50% 20%"
            />
            <Keyline
              sceneId="b8"
              t={t}
              top={800}
              lines={{
                b08_03:
                  "Bersama penyair Shelley, Mary Godwin, dan dokter Byron",
                b08_04: "Hujan dan badai: mereka berlomba menulis cerita hantu",
              }}
            />
          </>
        )}
      </Shot>
      <Shot t={t} from={s("b08_05")} to={s("b08_07")}>
        {(lt) => (
          <>
            <Card
              src="frankenstein-1831.jpg"
              lt={lt}
              x={1060}
              y={90}
              w={600}
              h={774}
              caption="Frontispis Frankenstein, edisi 1831"
              grade={false}
            />
            <TextBlock
              lt={lt}
              kicker="LAHIR DARI MALAM ITU"
              title="Frankenstein"
              x={120}
              y={230}
              w={900}
              titleSize={110}
              color={colors.cold}
              body="terbit tahun 1818"
            />
            <TextBlock
              lt={lt}
              delay={s("b08_06") - s("b08_05")}
              title="Byron menulis puisi Darkness"
              x={120}
              y={620}
              w={900}
              titleSize={48}
              color={colors.warm}
              body="tentang matahari yang padam"
            />
          </>
        )}
      </Shot>
      <Shot t={t} from={s("b08_07")}>
        {(lt) => (
          <>
            {rain(lt, 60)}
            <TextBlock
              lt={lt}
              title="Apakah Tambora menyebabkan Frankenstein?"
              x={160}
              w={1600}
              y={200}
              titleSize={96}
              align="center"
            />
            <TextBlock
              lt={lt}
              delay={s("b08_08") - s("b08_07")}
              title="Tidak sesederhana itu"
              x={160}
              w={1600}
              y={540}
              titleSize={80}
              align="center"
              color={colors.warm}
            />
            <Keyline
              sceneId="b8"
              t={t}
              top={780}
              lines={{
                b08_09: "Mary Shelley: musim panas itu basah dan tidak ramah",
                b08_10:
                  "Cuaca buruk 1816 ikut membentuk suasana tempat ide itu lahir",
              }}
            />
          </>
        )}
      </Shot>
    </>
  );
};

// ───────────────────── B9 · NUSANTARA ─────────────────────
const B9: React.FC<SceneProps> = ({ t }) => {
  const s = (id: string) => clipStart("b9", id);
  return (
    <>
      <Shot t={t} from={0} to={s("b09_04")}>
        {(lt) => (
          <>
            <Backdrop src="tambora-nasa-iss.jpg" lt={lt} brightness={0.36} />
            {ash(lt, 80)}
            <TextBlock
              lt={lt}
              kicker="KEMBALI KE SUMBAWA"
              title="Di sinilah dampak paling berat"
              x={120}
              y={230}
              w={1200}
              titleSize={104}
            />
            <Keyline
              sceneId="b9"
              t={t}
              top={640}
              to={s("b09_04")}
              lines={{
                b09_02: "Desa Tambora musnah oleh awan panas",
                b09_03: "Tsunami ± 4 m menghantam pesisir Sanggar",
              }}
            />
          </>
        )}
      </Shot>
      <Shot t={t} from={s("b09_04")} to={s("b09_07")}>
        {(lt) => (
          <>
            <Backdrop src="tephra-layers.jpg" lt={lt} brightness={0.42} />
            {ash(lt, 60, 0.6)}
            <TextBlock
              lt={lt}
              kicker="YANG SELAMAT"
              title="Menghadapi hal yang lebih lama"
              x={120}
              y={180}
              w={1200}
              titleSize={88}
            />
            <Keyline
              sceneId="b9"
              t={t}
              top={560}
              lines={{
                b09_04: "Sawah tertutup abu · ternak mati",
                b09_05: "Kelaparan dan penyakit: Sumbawa dan Lombok",
                b09_06: "Banyak yang mengungsi atau meninggal di perjalanan",
              }}
            />
          </>
        )}
      </Shot>
      <Shot t={t} from={s("b09_07")} to={s("b09_10")}>
        {(lt) => (
          <>
            {ash(lt, 50, 0.5)}
            <TextBlock
              lt={lt}
              kicker="PERKIRAAN · BUKAN HITUNGAN PASTI"
              title="± 70.000 jiwa"
              color={colors.warm}
              titleSize={170}
              x={0}
              w={1920}
              y={200}
              align="center"
            />
            <Keyline
              sceneId="b9"
              t={t}
              top={560}
              lines={{
                b09_07: "Sekitar 10–12 ribu tewas langsung",
                b09_08: "Catatan lama menyebut sekitar 90.000",
                b09_09: "Tidak ada sensus: semuanya perkiraan",
              }}
            />
          </>
        )}
      </Shot>
      <Shot t={t} from={s("b09_10")} to={s("b09_14")}>
        {(lt) => (
          <>
            <Backdrop src="tephra-layers.jpg" lt={lt} brightness={0.4} />
            {ash(lt, 60, 0.6)}
            <TextBlock
              lt={lt}
              kicker="2004 · TIM HARALDUR SIGURDSSON"
              title="“Pompeii dari Timur”"
              color={colors.sun}
              titleSize={116}
              x={0}
              w={1920}
              y={230}
              align="center"
            />
            <Keyline
              sceneId="b9"
              t={t}
              top={600}
              lines={{
                b09_10: "Menggali di lereng Tambora",
                b09_12: "Kerajaan Tambora bukan sekadar nama di catatan Eropa",
                b09_13: "Manusia, rumah, dan budaya hilang dalam satu malam",
              }}
            />
          </>
        )}
      </Shot>
      <Shot t={t} from={s("b09_14")}>
        {(lt) => (
          <>
            <Card
              src="caldera-panorama.jpg"
              lt={lt}
              x={160}
              y={170}
              w={1600}
              h={352}
              caption="Kaldera Tambora hari ini"
              zoomTo={1.06}
            />
            <TextBlock
              lt={lt}
              delay={0.6}
              title="Masih gunung api aktif"
              x={0}
              w={1920}
              y={620}
              titleSize={80}
              align="center"
              color={colors.warm}
              body="dipantau oleh Badan Geologi"
            />
          </>
        )}
      </Shot>
    </>
  );
};

// ───────────────────── B10 · PENUTUP ─────────────────────
const B10: React.FC<SceneProps> = ({ t, progress }) => {
  const s = (id: string) => clipStart("b10", id);
  const endAt = s("b10_10");
  const sub = interpolate(t, [endAt, endAt + 0.8], [0, 1], {
    ...clamp,
    easing: easeOut,
  });
  const follow = interpolate(t, [endAt + 0.8, endAt + 1.5], [0, 1], {
    ...clamp,
    easing: easeOut,
  });
  const ask = interpolate(t, [s("b10_11"), s("b10_11") + 0.8], [0, 1], clamp);
  return (
    <>
      <Backdrop src="tambora-nasa-iss.jpg" lt={t} brightness={0.3} />
      {ash(t, 40, 0.45)}
      <Shot t={t} from={0} to={endAt}>
        {() => <Takeaways progress={Math.min(1, progress * 1.6)} />}
      </Shot>
      <Shot t={t} from={endAt}>
        {() => (
          <>
            <TextBlock
              lt={t - endAt}
              title="Suhuf Pengetahuan"
              color={colors.cold}
              titleSize={104}
              x={0}
              w={1920}
              y={70}
              align="center"
              body="Ceritanya dimulai dari Sumbawa"
            />
            {/* Bagian bawah (y 560-900) sengaja kosong: tempat elemen end screen YouTube (video berikutnya + subscribe). */}
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: 330,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 48,
              }}
            >
              <div
                style={{
                  opacity: sub,
                  translate: `0px ${(1 - sub) * 24}px`,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 28,
                  padding: "18px 48px 18px 36px",
                  borderRadius: 48,
                  background: colors.text,
                  color: colors.bg,
                }}
              >
                <svg width={110} height={78} viewBox="0 0 110 78">
                  <rect width={110} height={78} rx={22} fill="#FF0000" />
                  <path d="M44 22 L78 39 L44 56 Z" fill="#FFFFFF" />
                </svg>
                <div style={{ fontFamily: fonts.heading }}>
                  <div
                    style={{ fontWeight: 700, fontSize: 62, lineHeight: 1.05 }}
                  >
                    SUBSCRIBE
                  </div>
                  <div
                    style={{ fontWeight: 700, fontSize: 34, lineHeight: 1.2 }}
                  >
                    YouTube Suhuf Pengetahuan
                  </div>
                </div>
              </div>
              <div
                style={{
                  opacity: follow,
                  translate: `0px ${(1 - follow) * 20}px`,
                  padding: "14px 40px",
                  borderRadius: 999,
                  background: colors.warm,
                  color: colors.bg,
                  fontFamily: fonts.heading,
                  fontWeight: 700,
                  fontSize: 40,
                }}
              >
                Follow @suhufpengetahuan
              </div>
            </div>
            <Label x={960} y={515} align="center" size={36} opacity={ask}>
              Tulis di komentar: gunung atau peristiwa apa lagi yang ingin kamu
              lihat?
            </Label>
          </>
        )}
      </Shot>
    </>
  );
};

export const SceneVisual: React.FC<{
  readonly sceneId: string;
  readonly t: number;
  readonly progress: number;
}> = ({ sceneId, t, progress }) => {
  const p = { t, progress };
  switch (sceneId) {
    case "b1":
      return <B1 {...p} />;
    case "b2":
      return <B2 {...p} />;
    case "b3":
      return <B3 {...p} />;
    case "b4":
      return <B4 {...p} />;
    case "b5":
      return <B5 {...p} />;
    case "b6":
      return <B6 {...p} />;
    case "b7":
      return <B7 {...p} />;
    case "b8":
      return <B8 {...p} />;
    case "b9":
      return <B9 {...p} />;
    case "b10":
      return <B10 {...p} />;
    default:
      return null;
  }
};
export { END };
