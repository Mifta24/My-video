import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, staticFile } from "remotion";
import { Subtitle } from "../elements/Subtitle";
import { Tag, clamp, easeOut, useSceneTime } from "../elements/common";
import { LEAD, clipText, sceneFrames, voSeconds } from "../timing";
import { colors, fonts } from "../theme";

// S3 · Penampang atmosfer SKEMATIS: kolom naik, stratosfer, aerosol menyebar, sinar memantul.
const STRATO_Y = 760;
const GROUND_Y = 1330;

export const SceneS3: React.FC = () => {
  const total = sceneFrames("s3");
  const { t, opacity } = useSceneTime(total);
  const col = interpolate(t, [0.6, 2.4], [0, 1], { ...clamp, easing: easeOut });
  const spread = interpolate(t, [2.4, 5.6], [0, 1], {
    ...clamp,
    easing: easeOut,
  });
  const rays = interpolate(t, [4.4, 5.4], [0, 1], clamp);
  const colTop = GROUND_Y - (GROUND_Y - 500) * col;

  // Partikel deterministik (tanpa Math.random supaya render konsisten).
  const particles = Array.from({ length: 46 }, (_, i) => {
    const a = (i * 137.5) % 360;
    const rad = (a * Math.PI) / 180;
    const dist = 60 + ((i * 53) % 400);
    // Partikel dijaga di area x 400-1030, y 480-720 supaya tidak menimpa label stratosfer.
    return {
      x: Math.min(
        1030,
        Math.max(400, 715 + Math.cos(rad) * dist * spread * 1.3),
      ),
      y: Math.min(
        720,
        Math.max(480, 600 + Math.sin(rad) * dist * 0.3 * spread),
      ),
      r: 4 + (i % 4),
    };
  });

  return (
    <AbsoluteFill style={{ opacity, backgroundColor: colors.bg }}>
      <svg
        width={1080}
        height={1920}
        viewBox="0 0 1080 1920"
        style={{ position: "absolute", inset: 0 }}
      >
        <rect
          x={0}
          y={STRATO_Y}
          width={1080}
          height={GROUND_Y - STRATO_Y}
          fill="#0E1A33"
        />
        <rect
          x={0}
          y={420}
          width={1080}
          height={STRATO_Y - 420}
          fill="#0A1426"
        />
        <line
          x1={0}
          x2={1080}
          y1={STRATO_Y}
          y2={STRATO_Y}
          stroke={colors.landLine}
          strokeDasharray="10 10"
          strokeWidth={3}
        />
        <text
          x={70}
          y={STRATO_Y + 60}
          fill={colors.text}
          fontFamily={fonts.mono}
          fontSize={38}
        >
          TROPOSFER (cuaca)
        </text>
        <text
          x={70}
          y={STRATO_Y - 24}
          fill={colors.cold}
          fontFamily={fonts.mono}
          fontSize={36}
        >
          STRATOSFER
        </text>

        <rect x={0} y={GROUND_Y} width={1080} height={14} fill="#1F2A44" />
        <text
          x={540}
          y={GROUND_Y + 70}
          textAnchor="middle"
          fill={colors.text}
          fontFamily={fonts.heading}
          fontWeight={700}
          fontSize={44}
        >
          Tambora
        </text>

        <ellipse
          cx={540}
          cy={colTop}
          rx={70 + 170 * spread}
          ry={40}
          fill={colors.warm}
          opacity={0.7 - 0.35 * spread}
        />
        <rect
          x={512}
          y={colTop}
          width={56}
          height={GROUND_Y - 170 - colTop}
          rx={26}
          fill={colors.warm}
        />
        <path
          d={`M 250 ${GROUND_Y} L 470 ${GROUND_Y - 190} L 610 ${GROUND_Y - 190} L 830 ${GROUND_Y} Z`}
          fill="#4A362B"
        />
        <path
          d={`M 470 ${GROUND_Y - 190} L 610 ${GROUND_Y - 190} L 590 ${GROUND_Y - 165} L 490 ${GROUND_Y - 165} Z`}
          fill={colors.warm}
          opacity={col}
        />

        {particles.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={p.r}
            fill={colors.sun}
            opacity={0.75 * spread}
          />
        ))}

        {[0, 1, 2].map((i) => {
          const sx = 140 + i * 300;
          const progress = interpolate(rays, [0, 1], [0, 1]);
          return (
            <g key={i} opacity={rays}>
              <line
                x1={sx}
                y1={350}
                x2={sx + 70}
                y2={590 - 40}
                stroke={colors.sun}
                strokeWidth={6}
                strokeLinecap="round"
              />
              <line
                x1={sx + 70}
                y1={550}
                x2={sx + 70 + 160 * progress}
                y2={550 - 230 * progress}
                stroke={colors.sun}
                strokeWidth={6}
                strokeLinecap="round"
                strokeDasharray="4 14"
              />
            </g>
          );
        })}
        <text
          x={540}
          y={310}
          textAnchor="middle"
          fill={colors.sun}
          fontFamily={fonts.mono}
          fontSize={34}
          opacity={rays}
        >
          sinar Matahari dipantulkan kembali
        </text>
      </svg>
      <Tag text="Skema" />
      <Audio
        name="VO s3"
        from={Math.round(LEAD * 30)}
        src={staticFile("suhuf-tambora/vo/s3.mp3")}
      />
      <Subtitle
        text={clipText("s3")}
        startSec={LEAD}
        durationSec={voSeconds("s3")}
      />
    </AbsoluteFill>
  );
};
