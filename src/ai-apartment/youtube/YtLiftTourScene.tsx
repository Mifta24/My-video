import { Audio } from "@remotion/media";
import {
  Easing,
  Img,
  Interactive,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { BasicCaptions } from "../basic-captions";
import { EnVo } from "../elements/EnVo";
import { useL, useLang } from "../i18n";
import { FloorDirectory } from "../elements/FloorDirectory";
import { colors, fonts, sfx } from "../theme";

// Data dari website demo (lantai 02 dan 03).
const units = [
  { name: "Studio Urban", size: "28 m²", price: "IDR 650.000" },
  { name: "1 Bedroom Executive", size: "48 m²", price: "IDR 1.050.000" },
  { name: "2 Bedroom Family", size: "82 m²", price: "IDR 1.750.000" },
  { name: "3 Bedroom Penthouse", size: "145 m²", price: "IDR 3.400.000" },
];
const unitTimes = [4.1, 4.5, 4.9, 7.2];

const facilities = [
  {
    code: "03.01",
    name: "Kolam renang infinity rooftop",
    nameEn: "Rooftop infinity pool",
    info: "Lantai 32 · 06:00–21:00",
    infoEn: "Floor 32 · 06:00–21:00",
  },
  {
    code: "03.02",
    name: "Gym 24 jam",
    nameEn: "24-hour gym",
    info: "Lantai 5 · kartu akses penghuni",
    infoEn: "Floor 5 · resident access card",
  },
  {
    code: "03.03",
    name: "Co-working lounge",
    nameEn: "Co-working lounge",
    info: "Wi-Fi 1 Gbps · 07:00–23:00",
    infoEn: "Wi-Fi 1 Gbps · 07:00–23:00",
  },
];
const facilityTimes = [10.6, 12.05, 12.7];

const panelHeader = {
  fontFamily: fonts.mono,
  fontSize: 28,
  letterSpacing: "0.14em",
  color: colors.signal,
} as const;

// YouTube Scene 4: naik lift Lobi → Unit → Fasilitas.
const YtLiftTourSceneInner = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const L = useL();
  const en = useLang() === "en";
  const t = frame / fps;
  const appear = (at: number) => ({
    opacity: interpolate(t, [at, at + 0.3], [0, 1], {
      extrapolateLeft: "clamp" as const,
      extrapolateRight: "clamp" as const,
    }),
    translate: interpolate(t, [at, at + 0.45], ["0px 40px", "0px 0px"], {
      extrapolateLeft: "clamp" as const,
      extrapolateRight: "clamp" as const,
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    }),
  });

  return (
    <>
      <FloorDirectory
        name="Direktori gedung"
        floorTimes={[3.8, 8.7]}
        style={{ position: "absolute", top: 90, left: 96, width: 600 }}
      />
      <Interactive.Div
        name="Label contoh data"
        style={{
          position: "absolute",
          top: 60,
          right: 96,
          fontFamily: fonts.mono,
          fontSize: 24,
          letterSpacing: "0.12em",
          color: colors.muted,
        }}
      >
        {L("CONTOH DATA DEMO", "DEMO DATA SAMPLE")}
      </Interactive.Div>
      <Interactive.Div
        name="Panel lobi"
        durationInFrames={3.8 * fps}
        style={{
          position: "absolute",
          top: 120,
          left: 780,
          width: 1044,
          height: 780,
          borderRadius: 32,
          overflow: "hidden",
          backgroundColor: colors.ink2,
          scale: interpolate(frame, [0, 3.8 * fps], [1, 1.03], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        <Img
          src={staticFile("ai-apartment/lobby.jpg")}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: 0.45,
          }}
        />
        <Img
          src={staticFile("ai-apartment/concierge-welcoming.png")}
          style={{ position: "absolute", bottom: -60, left: 40, height: 820 }}
        />
        <div
          style={{
            position: "absolute",
            top: 200,
            right: 50,
            width: 470,
            padding: "30px 36px",
            borderRadius: "32px 32px 32px 8px",
            backgroundColor: colors.ink,
            border: `2px solid ${colors.inkLine}`,
            color: colors.white,
            fontFamily: fonts.heading,
            fontSize: 36,
            lineHeight: 1.3,
            opacity: interpolate(frame, [0.8 * fps, 1.1 * fps], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          {L(
            "Selamat datang! Naik lift ke lantai mana pun, saya ikut menemani.",
            "Welcome! Take the lift to any floor. I'll come along.",
          )}
        </div>
      </Interactive.Div>
      <Interactive.Div
        name="Panel unit"
        from={3.8 * fps}
        durationInFrames={4.9 * fps}
        style={{
          position: "absolute",
          top: 120,
          left: 780,
          width: 1044,
          display: "flex",
          flexDirection: "column",
          gap: 28,
        }}
      >
        <div style={panelHeader}>
          {L("02 · UNIT HUNIAN · 7 TIPE UNIT", "02 · RESIDENCES · 7 UNIT TYPES")}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 24 }}>
          {units.map((unit, i) => (
            <div
              key={unit.name}
              style={{
                width: 510,
                padding: 34,
                borderRadius: 28,
                backgroundColor: colors.ink2,
                border: `2px solid ${i === 3 && t >= unitTimes[3] ? colors.signal : colors.inkLine}`,
                display: "flex",
                flexDirection: "column",
                gap: 14,
                ...appear(unitTimes[i]),
              }}
            >
              <div style={{ fontFamily: fonts.mono, fontSize: 24, color: colors.muted }}>
                {unit.size}
              </div>
              <div
                style={{
                  fontFamily: fonts.heading,
                  fontWeight: 700,
                  fontSize: 42,
                  color: colors.white,
                }}
              >
                {unit.name}
              </div>
              <div style={{ fontFamily: fonts.heading, fontSize: 30, color: colors.white }}>
                {L("mulai", "from")} {L(unit.price, unit.price.replace(/\./g, ","))}{" "}
                <span style={{ color: colors.muted }}>{L("/ malam", "/ night")}</span>
              </div>
            </div>
          ))}
        </div>
      </Interactive.Div>
      <Interactive.Div
        name="Panel fasilitas"
        from={8.7 * fps}
        style={{
          position: "absolute",
          top: 120,
          left: 780,
          width: 1044,
          display: "flex",
          flexDirection: "column",
          gap: 24,
        }}
      >
        <div style={panelHeader}>
          {L("03 · FASILITAS BERSAMA · 8 LAYANAN", "03 · SHARED AMENITIES · 8 SERVICES")}
        </div>
        {facilities.map((item, i) => (
          <div
            key={item.code}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 34,
              padding: "34px 40px",
              borderRadius: 28,
              backgroundColor: colors.ink2,
              border: `2px solid ${colors.inkLine}`,
              ...appear(facilityTimes[i]),
            }}
          >
            <div
              style={{
                fontFamily: fonts.mono,
                fontWeight: 500,
                fontSize: 30,
                color: colors.signal,
              }}
            >
              {item.code}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div
                style={{
                  fontFamily: fonts.heading,
                  fontWeight: 700,
                  fontSize: 44,
                  color: colors.white,
                }}
              >
                {L(item.name, item.nameEn)}
              </div>
              <div style={{ fontFamily: fonts.heading, fontSize: 30, color: colors.muted }}>
                {L(item.info, item.infoEn)}
              </div>
            </div>
          </div>
        ))}
      </Interactive.Div>
      <Audio name="Ding lantai 02" from={3.8 * fps} src={sfx.ding} volume={0.4} />
      <Audio name="Ding lantai 03" from={8.7 * fps} src={sfx.ding} volume={0.4} />
      {en ? (
        <EnVo scene="y4" layout="horizontal" />
      ) : (
        <>
      <Audio
        name="VO s4a"
        from={0.2 * fps}
        src={staticFile("ai-apartment/vo-yt/s4a.mp3")}
      />
      <Audio
        name="VO s4b"
        from={3.7 * fps}
        src={staticFile("ai-apartment/vo-yt/s4b.mp3")}
      />
      <Audio
        name="VO s4c"
        from={8.6 * fps}
        src={staticFile("ai-apartment/vo-yt/s4c.mp3")}
      />
      <BasicCaptions
        name="Subtitle s4"
        width={1600}
        combineTokensWithinMilliseconds={0}
        style={{ position: "absolute", bottom: 60, translate: "160px 0px" }}
        captions={[
          {
            text: " Di lobi, mereka langsung disambut concierge.",
            startMs: 300,
            endMs: 3800,
            timestampMs: null,
            confidence: null,
            pageBreakAfter: true,
          },
          {
            text: " Naik ke lantai unit, mereka lihat tipe unit",
            startMs: 3800,
            endMs: 6490,
            timestampMs: null,
            confidence: null,
            pageBreakAfter: true,
          },
          {
            text: " dari studio sampai penthouse.",
            startMs: 6490,
            endMs: 8700,
            timestampMs: null,
            confidence: null,
            pageBreakAfter: true,
          },
          {
            text: " Di lantai fasilitas, ada kolam renang rooftop,",
            startMs: 8700,
            endMs: 12048,
            timestampMs: null,
            confidence: null,
            pageBreakAfter: true,
          },
          {
            text: " gym, dan co-working.",
            startMs: 12048,
            endMs: 14380,
            timestampMs: null,
            confidence: null,
            pageBreakAfter: true,
          },
        ]}
      />
        </>
      )}
    </>
  );
};

export const YtLiftTourScene = Interactive.create({
  Component: YtLiftTourSceneInner,
  layout: "absolute-fill",
  schema: {
    ...Interactive.backgroundSchema,
  },
});
