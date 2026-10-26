import { Audio } from "@remotion/media";
import { Sfx } from "../elements/Sfx";
import { AbsoluteFill, interpolate, staticFile } from "remotion";
import { Subtitle } from "../elements/Subtitle";
import { PhotoBackdrop } from "../elements/PhotoBackdrop";
import { Particles } from "../elements/Particles";
import { Tag, clamp, easeOut, useSceneTime } from "../elements/common";
import { LEAD, clipText, cue, sceneFrames, voSeconds } from "../timing";
import { colors, fonts } from "../theme";

// S2B · Dua angka terverifikasi di script: kolom abu 43 km dan suara terdengar sampai Sumatra (> 2.600 km).
// Bagian A: kolom naik (skema, tanpa skala lapisan atmosfer). Bagian B: gelombang suara ke arah Sumatra.
const SWITCH = cue("s2b", "Dentumannya", -0.2);
const GROUND = 1180;
const TOP = 420;

export const SceneS2B: React.FC = () => {
  const total = sceneFrames("s2b");
  const { t, opacity } = useSceneTime(total);
  const b = interpolate(t, [SWITCH, SWITCH + 0.8], [0, 1], clamp);
  const a = 1 - b;
  const rise = interpolate(t, [0.5, SWITCH - 0.6], [0, 1], {
    ...clamp,
    easing: easeOut,
  });
  const km = Math.round(43 * rise);
  const colTop = GROUND - (GROUND - TOP) * rise;

  const dist = interpolate(t, [SWITCH + 0.4, SWITCH + 3.0], [0, 1], {
    ...clamp,
    easing: easeOut,
  });
  const dKm = Math.round(2600 * dist);
  const X0 = 880; // Tambora
  const X1 = 200; // Trumon (Sumatra)
  const Y = 820;
  const front = X0 - (X0 - X1) * dist;

  return (
    <AbsoluteFill style={{ opacity, backgroundColor: colors.bg }}>
      <PhotoBackdrop
        src="suhuf-tambora/photos/tephra-layers.jpg"
        t={t}
        brightness={0.4}
        zoomFrom={1.0}
        zoomTo={1.1}
        duration={total / 30}
      />
      <Particles kind="ash" t={t} count={30} opacity={0.5} />

      {/* Bagian A: kolom abu 43 km */}
      <svg
        width={1080}
        height={1920}
        viewBox="0 0 1080 1920"
        style={{ position: "absolute", inset: 0, opacity: a }}
      >
        <rect x={0} y={GROUND} width={1080} height={16} fill="#1F2A44" />
        <path
          d={`M 220 ${GROUND} L 450 ${GROUND - 170} L 630 ${GROUND - 170} L 860 ${GROUND} Z`}
          fill="#4A362B"
        />
        <rect
          x={512}
          y={colTop}
          width={56}
          height={GROUND - 170 - colTop}
          rx={26}
          fill={colors.warm}
        />
        <ellipse
          cx={540}
          cy={colTop}
          rx={60 + 150 * rise}
          ry={36}
          fill={colors.warm}
          opacity={0.6}
        />
        {/* penggaris tinggi */}
        <line
          x1={850}
          x2={850}
          y1={colTop}
          y2={GROUND}
          stroke={colors.text}
          strokeWidth={4}
          strokeDasharray="10 10"
        />
        <line
          x1={825}
          x2={875}
          y1={colTop}
          y2={colTop}
          stroke={colors.text}
          strokeWidth={5}
        />
        <line
          x1={825}
          x2={875}
          y1={GROUND}
          y2={GROUND}
          stroke={colors.text}
          strokeWidth={5}
        />
        <text
          x={820}
          y={(colTop + GROUND) / 2}
          textAnchor="end"
          fill={colors.sun}
          fontFamily={fonts.heading}
          fontWeight={700}
          fontSize={110}
          stroke={colors.bg}
          strokeWidth={12}
          paintOrder="stroke"
        >
          {km} km
        </text>
        <text
          x={220}
          y={GROUND + 60}
          fill={colors.text}
          fontFamily={fonts.heading}
          fontWeight={700}
          fontSize={44}
          stroke={colors.bg}
          strokeWidth={10}
          paintOrder="stroke"
        >
          Tambora
        </text>
      </svg>
      <div
        style={{
          position: "absolute",
          left: 80,
          right: 80,
          top: 250,
          opacity: a,
          fontFamily: fonts.heading,
          fontWeight: 700,
          fontSize: 70,
          lineHeight: 1.05,
          color: colors.text,
          textShadow: `0 3px 18px ${colors.bg}`,
        }}
      >
        Seberapa tinggi?
      </div>

      {/* Bagian B: suara terdengar sampai Sumatra */}
      <svg
        width={1080}
        height={1920}
        viewBox="0 0 1080 1920"
        style={{ position: "absolute", inset: 0, opacity: b }}
      >
        <line
          x1={X1}
          x2={X0}
          y1={Y}
          y2={Y}
          stroke={colors.landLine}
          strokeWidth={4}
          strokeDasharray="14 12"
        />
        {[0, 1, 2].map((i) => {
          const p = ((((t - SWITCH - i * 0.55) % 1.6) + 1.6) % 1.6) / 1.6;
          return (
            <circle
              key={i}
              cx={X0}
              cy={Y}
              r={30 + p * 190}
              fill="none"
              stroke={colors.warm}
              strokeWidth={4}
              opacity={(1 - p) * 0.7 * (t > SWITCH + i * 0.55 ? 1 : 0)}
            />
          );
        })}
        <circle cx={X0} cy={Y} r={18} fill={colors.warm} />
        <circle cx={X1} cy={Y} r={14} fill={colors.cold} />
        <circle
          cx={front}
          cy={Y}
          r={12}
          fill={colors.sun}
          opacity={dist > 0 && dist < 1 ? 1 : 0}
        />
        <text
          x={X0}
          y={Y - 60}
          textAnchor="middle"
          fill={colors.text}
          fontFamily={fonts.heading}
          fontWeight={700}
          fontSize={44}
          stroke={colors.bg}
          strokeWidth={10}
          paintOrder="stroke"
        >
          Tambora
        </text>
        <text
          x={X1}
          y={Y - 60}
          textAnchor="middle"
          fill={colors.text}
          fontFamily={fonts.heading}
          fontWeight={700}
          fontSize={44}
          stroke={colors.bg}
          strokeWidth={10}
          paintOrder="stroke"
        >
          Sumatra
        </text>
        <text
          x={540}
          y={Y + 190}
          textAnchor="middle"
          fill={colors.sun}
          fontFamily={fonts.heading}
          fontWeight={700}
          fontSize={130}
          stroke={colors.bg}
          strokeWidth={14}
          paintOrder="stroke"
        >
          {dKm >= 2600 ? "2.600+" : dKm.toLocaleString("id-ID")} km
        </text>
      </svg>
      <div
        style={{
          position: "absolute",
          left: 80,
          right: 80,
          top: 250,
          opacity: b,
          fontFamily: fonts.heading,
          fontWeight: 700,
          fontSize: 70,
          lineHeight: 1.05,
          color: colors.text,
          textShadow: `0 3px 18px ${colors.bg}`,
        }}
      >
        Seberapa jauh?
      </div>

      <Tag text="Skema" />

      <Sfx name="riser" at={0.2} volume={0.4} />
      <Sfx name="sweep-up" at={0.5} volume={0.35} />
      <Sfx name="boom" at={SWITCH - 0.5} volume={0.55} />
      <Sfx name="sonar" at={SWITCH + 0.3} volume={0.5} />
      <Audio
        name="VO s2b"
        from={Math.round(LEAD * 30)}
        src={staticFile("suhuf-tambora/vo/s2b.mp3")}
      />
      <Subtitle
        text={clipText("s2b")}
        startSec={LEAD}
        durationSec={voSeconds("s2b")}
      />
    </AbsoluteFill>
  );
};
