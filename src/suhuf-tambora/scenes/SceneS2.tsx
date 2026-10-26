import { Audio } from "@remotion/media";
import { Sfx } from "../elements/Sfx";
import { AbsoluteFill, interpolate, staticFile } from "remotion";
import { Subtitle } from "../elements/Subtitle";
import { PhotoBackdrop } from "../elements/PhotoBackdrop";
import { Particles } from "../elements/Particles";
import { Tag, clamp, easeOut, useSceneTime } from "../elements/common";
import { LEAD, clipText, cue, sceneFrames, voSeconds } from "../timing";
import { colors, fonts } from "../theme";

// S2 · Foto asli kaldera Tambora (NASA) lalu perbandingan volume letusan (skema, data USGS).
// Fase 1 (0 - SWITCH): foto + penjelasan VEI 7 (terverifikasi di script).
// Fase 2 (SWITCH - akhir): bola volume. Luas bola mengikuti volume (jari-jari ∝ akar pangkat tiga).
const SWITCH = cue("s2", "Salah satu yang", -0.2);
const VEI_AT = cue("s2", "Letusannya", -0.2);
const BASE_Y = 1190;
const D_MAX = 320;
const ERUPTIONS = [
  { name: "Tambora", year: "1815", km3: 50, label: "50 km³", main: true },
  { name: "Krakatau", year: "1883", km3: 10, label: "10 km³", main: false },
  { name: "Pinatubo", year: "1991", km3: 4.8, label: "4,8 km³", main: false },
  { name: "St. Helens", year: "1980", km3: 0.4, label: "0,4 km³", main: false },
];
const GAP = 56;

const Note: React.FC<{
  readonly top: number;
  readonly t: number;
  readonly at: number;
  readonly out: number;
  readonly head: string;
  readonly body: string;
}> = ({ top, t, at, out, head, body }) => {
  const i = interpolate(t, [at, at + 0.7], [0, 1], {
    ...clamp,
    easing: easeOut,
  });
  const o = Math.min(i, interpolate(t, [out - 0.4, out], [1, 0], clamp));
  return (
    <div
      style={{
        position: "absolute",
        left: 60,
        right: 60,
        top,
        padding: "22px 28px",
        borderRadius: 18,
        backgroundColor: "rgba(7,11,20,0.62)",
        opacity: o,
        translate: `0px ${(1 - i) * 24}px`,
        fontFamily: fonts.heading,
        textShadow: `0 2px 14px ${colors.bg}`,
      }}
    >
      <div
        style={{
          fontWeight: 700,
          fontSize: 62,
          lineHeight: 1.05,
          color: colors.warm,
        }}
      >
        {head}
      </div>
      <div
        style={{
          fontWeight: 500,
          fontSize: 38,
          lineHeight: 1.25,
          color: colors.text,
          marginTop: 10,
        }}
      >
        {body}
      </div>
    </div>
  );
};

export const SceneS2: React.FC = () => {
  const total = sceneFrames("s2");
  const { t, opacity } = useSceneTime(total);
  const phase2 = interpolate(t, [SWITCH, SWITCH + 0.8], [0, 1], clamp);
  const phase1Out = 1 - phase2;
  const titleIn = interpolate(t, [0.2, 0.9], [0, 1], {
    ...clamp,
    easing: easeOut,
  });

  const sizes = ERUPTIONS.map((e) => D_MAX * Math.cbrt(e.km3 / 50));
  const rowW = sizes.reduce((a, b) => a + b, 0) + GAP * (ERUPTIONS.length - 1);
  let cursor = (1080 - rowW) / 2;
  const xs = sizes.map((d) => {
    const cx = cursor + d / 2;
    cursor += d + GAP;
    return cx;
  });

  return (
    <AbsoluteFill style={{ opacity, backgroundColor: colors.bg }}>
      <PhotoBackdrop
        src="suhuf-tambora/photos/tambora-nasa-iss.jpg"
        t={t}
        brightness={0.95 - 0.62 * phase2}
        zoomFrom={1.0}
        zoomTo={1.14}
        duration={SWITCH + 1}
      />
      <Particles kind="ash" t={t} count={36} opacity={0.6} />

      {/* Fase 1: nama + penjelasan */}
      <div
        style={{
          position: "absolute",
          left: 80,
          right: 80,
          top: 215,
          opacity: titleIn * phase1Out,
          fontFamily: fonts.mono,
          fontWeight: 500,
          fontSize: 32,
          color: colors.text,
          textShadow: `0 2px 12px ${colors.bg}`,
        }}
      >
        Pulau Sumbawa, Nusa Tenggara Barat
      </div>
      <div
        style={{
          position: "absolute",
          left: 80,
          right: 80,
          top: 262,
          opacity: titleIn * phase1Out,
          translate: `0px ${(1 - titleIn) * 30}px`,
          fontFamily: fonts.heading,
          fontWeight: 700,
          fontSize: 150,
          lineHeight: 1,
          color: colors.text,
          textShadow: `0 4px 24px ${colors.bg}`,
        }}
      >
        TAMBORA
      </div>
      <Note
        top={1010}
        t={t}
        at={VEI_AT}
        out={SWITCH}
        head="VEI 7"
        body="Skala 0–8. Tiap tingkat ± 10× lebih besar."
      />

      {/* Fase 2: bola volume */}
      <div
        style={{
          position: "absolute",
          left: 80,
          right: 80,
          top: 300,
          opacity: phase2,
          fontFamily: fonts.heading,
          fontWeight: 700,
          fontSize: 76,
          lineHeight: 1.05,
          color: colors.text,
        }}
      >
        Seberapa besar?
        <div
          style={{
            fontFamily: fonts.mono,
            fontWeight: 400,
            fontSize: 32,
            lineHeight: 1.3,
            color: colors.muted,
            marginTop: 14,
          }}
        >
          Volume material yang dilontarkan.
          <br />
          Luas bola mengikuti volume.
        </div>
      </div>

      <svg
        width={1080}
        height={1920}
        viewBox="0 0 1080 1920"
        style={{ position: "absolute", inset: 0 }}
      >
        <defs>
          <radialGradient id="ball-warm" cx="40%" cy="38%" r="70%">
            <stop offset="0%" stopColor={colors.sun} />
            <stop offset="45%" stopColor={colors.warm} />
            <stop offset="100%" stopColor="#B8481A" />
          </radialGradient>
          <radialGradient id="ball-cold" cx="40%" cy="38%" r="70%">
            <stop offset="0%" stopColor="#CBE8FF" />
            <stop offset="55%" stopColor={colors.cold} />
            <stop offset="100%" stopColor={colors.coldDeep} />
          </radialGradient>
        </defs>
        <line
          x1={60}
          x2={1020}
          y1={BASE_Y}
          y2={BASE_Y}
          stroke={colors.landLine}
          strokeWidth={3}
          opacity={phase2}
        />
        {ERUPTIONS.map((e, i) => {
          const at = SWITCH + 0.3 + i * 0.5;
          const g = interpolate(t, [at, at + 0.8], [0, 1], {
            ...clamp,
            easing: easeOut,
          });
          const d = sizes[i];
          const cy = BASE_Y - d / 2;
          const labelOp = interpolate(t, [at + 0.3, at + 0.9], [0, 1], clamp);
          return (
            <g key={e.name}>
              <circle
                cx={xs[i]}
                cy={cy}
                r={(d / 2) * g}
                fill={e.main ? "url(#ball-warm)" : "url(#ball-cold)"}
              />
              <g opacity={labelOp}>
                <text
                  x={xs[i]}
                  y={BASE_Y + 38}
                  textAnchor="middle"
                  fill={e.main ? colors.warm : colors.text}
                  fontFamily={fonts.mono}
                  fontWeight={700}
                  fontSize={e.main ? 34 : 25}
                >
                  {e.name}
                </text>
                <text
                  x={xs[i]}
                  y={BASE_Y + 72}
                  textAnchor="middle"
                  fill={colors.muted}
                  fontFamily={fonts.mono}
                  fontSize={26}
                >
                  {e.year}
                </text>
                <text
                  x={xs[i]}
                  y={BASE_Y + (e.main ? 118 : 110)}
                  textAnchor="middle"
                  fill={colors.text}
                  fontFamily={fonts.heading}
                  fontWeight={700}
                  fontSize={e.main ? 46 : 34}
                >
                  {e.label}
                </text>
              </g>
            </g>
          );
        })}
      </svg>

      <div style={{ opacity: phase2 }}>
        <Tag text="Skema" />
      </div>

      <Sfx name="whoosh" at={0.2} volume={0.3} />
      <Sfx name="pop" at={VEI_AT} volume={0.4} />
      <Sfx name="whoosh" at={SWITCH} volume={0.35} />
      <Sfx name="thud" at={SWITCH + 0.3} volume={0.6} />
      {[1, 2, 3].map((i) => (
        <Sfx key={i} name="pop" at={SWITCH + 0.3 + i * 0.5} volume={0.35} />
      ))}
      <Audio
        name="VO s2"
        from={Math.round(LEAD * 30)}
        src={staticFile("suhuf-tambora/vo/s2.mp3")}
      />
      <Subtitle
        text={clipText("s2")}
        startSec={LEAD}
        durationSec={voSeconds("s2")}
      />
    </AbsoluteFill>
  );
};
