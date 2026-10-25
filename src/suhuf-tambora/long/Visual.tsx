import type React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { colors, fonts } from "../theme";
import { SceneMap, type MapKind } from "./SceneMap";

const TITLES: Record<string, string> = {
  b1: "APRIL 1815 → 1816",
  b2: "SATU RANTAI SEBAB-AKIBAT",
  b3: "SUMBAWA · TAMBORA",
  b4: "10 APRIL 1815",
  b5: "APA YANG NAIK KE LANGIT?",
  b6: "1816 · EROPA",
  b7: "AMERIKA UTARA",
  b8: "JUNI 1816 · DANAU JENEWA",
  b9: "KEMBALI KE SUMBAWA",
  b10: "APA YANG KITA PELAJARI?",
};

const MAP_KIND: Record<string, MapKind> = {
  b1: "world",
  b3: "tambora",
  b6: "europe",
  b7: "north-america",
  b9: "tambora",
};

const ROUTE = [
  "TAMBORA · 1815",
  "STRATOSFER",
  "EROPA & AMERIKA · 1816",
  "SUMBAWA",
];
const TAKEAWAYS = [
  "Dunia saling terhubung",
  "Pangan itu rapuh",
  "Mulai dari Sumbawa",
];

const Atmosphere: React.FC<{ progress: number }> = ({ progress }) => (
  <svg
    width={1920}
    height={1080}
    viewBox="0 0 1920 1080"
    style={{ position: "absolute", inset: 0 }}
  >
    <rect x={0} y={190} width={1920} height={390} fill="#0A1426" />
    <rect x={0} y={580} width={1920} height={300} fill="#101D37" />
    <line
      x1={0}
      x2={1920}
      y1={580}
      y2={580}
      stroke={colors.landLine}
      strokeDasharray="12 14"
      strokeWidth={3}
    />
    <text
      x={140}
      y={270}
      fill={colors.cold}
      fontSize={38}
      fontFamily={fonts.mono}
    >
      STRATOSFER
    </text>
    <text
      x={140}
      y={650}
      fill={colors.text}
      fontSize={36}
      fontFamily={fonts.mono}
    >
      TROPOSFER · LAPISAN CUACA
    </text>
    <path d="M 850 885 L 950 760 L 1050 885 Z" fill="#4A362B" />
    <ellipse cx={950} cy={760} rx={48} ry={18} fill={colors.warm} />
    <rect
      x={930}
      y={410}
      width={40}
      height={350}
      rx={20}
      fill={colors.warm}
      opacity={0.8}
    />
    <ellipse
      cx={950}
      cy={410}
      rx={130 + progress * 170}
      ry={44}
      fill={colors.warm}
      opacity={0.55}
    />
    {Array.from({ length: 55 }, (_, i) => {
      const angle = i * 2.399;
      const radius = 70 + ((i * 89) % 600) * progress;
      const x = 950 + Math.cos(angle) * radius;
      const y = 410 + Math.sin(angle) * radius * 0.34;
      if (y > 565 || y < 230) return null;
      return (
        <circle
          key={i}
          cx={x}
          cy={y}
          r={4 + (i % 3)}
          fill={colors.sun}
          opacity={0.6}
        />
      );
    })}
    <text
      x={950}
      y={955}
      textAnchor="middle"
      fill={colors.muted}
      fontSize={24}
      fontFamily={fonts.mono}
    >
      SKEMA · BUKAN DATA PRESISI
    </text>
  </svg>
);

const Timeline: React.FC<{ progress: number }> = ({ progress }) => (
  <div
    style={{
      position: "absolute",
      left: 140,
      right: 140,
      top: 500,
      display: "flex",
      alignItems: "center",
    }}
  >
    {ROUTE.map((item, i) => {
      const active = progress >= i / (ROUTE.length - 1);
      return (
        <div
          key={item}
          style={{ flex: 1, position: "relative", textAlign: "center" }}
        >
          {i > 0 && (
            <div
              style={{
                position: "absolute",
                right: "50%",
                top: 20,
                width: "100%",
                height: 4,
                background: active ? colors.cold : colors.landLine,
              }}
            />
          )}
          <div
            style={{
              position: "relative",
              margin: "0 auto",
              width: 36,
              height: 36,
              borderRadius: 18,
              background: active
                ? i === 0
                  ? colors.warm
                  : colors.cold
                : colors.landLine,
              boxShadow: active
                ? `0 0 28px ${i === 0 ? colors.warm : colors.cold}`
                : "none",
            }}
          />
          <div
            style={{
              marginTop: 28,
              color: active ? colors.text : colors.muted,
              fontFamily: fonts.mono,
              fontSize: 27,
              letterSpacing: 1,
            }}
          >
            {item}
          </div>
        </div>
      );
    })}
  </div>
);

const Takeaways: React.FC<{ progress: number }> = ({ progress }) => (
  <div
    style={{
      position: "absolute",
      left: 110,
      right: 110,
      top: 280,
      display: "flex",
      flexDirection: "column",
      gap: 30,
    }}
  >
    {TAKEAWAYS.map((item, i) => {
      const opacity = interpolate(
        progress,
        [i * 0.3, i * 0.3 + 0.22],
        [0.18, 1],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
      );
      return (
        <div
          key={item}
          style={{
            opacity,
            fontFamily: fonts.heading,
            fontSize: 72,
            fontWeight: 700,
            color: i === 2 ? colors.warm : colors.text,
            borderLeft: `8px solid ${i === 2 ? colors.warm : colors.cold}`,
            paddingLeft: 36,
          }}
        >
          {item}
        </div>
      );
    })}
  </div>
);

export const Visual: React.FC<{ sceneId: string; progress: number }> = ({
  sceneId,
  progress,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pulse = 0.75 + 0.25 * Math.sin((frame / fps) * 2.6);
  const mapKind = MAP_KIND[sceneId];
  const title = TITLES[sceneId] ?? sceneId.toUpperCase();

  return (
    <>
      {mapKind ? <SceneMap kind={mapKind} progress={progress} /> : null}
      {sceneId === "b5" ? <Atmosphere progress={progress} /> : null}
      {sceneId === "b2" ? <Timeline progress={progress} /> : null}
      {sceneId === "b10" ? <Takeaways progress={progress} /> : null}
      {sceneId === "b4" ? (
        <div
          style={{
            position: "absolute",
            top: 400,
            left: 160,
            right: 160,
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontFamily: fonts.heading,
              fontSize: 92,
              color: colors.warm,
              fontWeight: 700,
              textShadow: `0 0 ${24 * pulse}px ${colors.warm}`,
            }}
          >
            VEI 7
          </div>
          <div
            style={{
              marginTop: 28,
              fontFamily: fonts.mono,
              fontSize: 30,
              color: colors.muted,
            }}
          >
            SKALA EKSPLOSIVITAS · SKEMA
          </div>
          <div
            style={{
              margin: "70px auto 0",
              width: 720,
              height: 12,
              background: colors.landLine,
              borderRadius: 8,
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                left: "87.5%",
                top: -12,
                width: 34,
                height: 34,
                borderRadius: 17,
                background: colors.warm,
                boxShadow: `0 0 24px ${colors.warm}`,
              }}
            />
          </div>
          <div
            style={{
              marginTop: 22,
              display: "flex",
              justifyContent: "space-between",
              fontFamily: fonts.mono,
              color: colors.muted,
              fontSize: 25,
            }}
          >
            <span>0</span>
            <span>8</span>
          </div>
        </div>
      ) : null}
      {sceneId === "b8" ? (
        <div
          style={{
            position: "absolute",
            top: 340,
            left: 180,
            right: 180,
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontFamily: fonts.heading,
              fontWeight: 700,
              fontSize: 88,
              color: colors.cold,
            }}
          >
            FRANKENSTEIN
          </div>
          <div
            style={{
              marginTop: 28,
              fontFamily: fonts.mono,
              fontSize: 30,
              color: colors.text,
            }}
          >
            MARY GODWIN · 1816 → TERBIT 1818
          </div>
          <div
            style={{
              margin: "76px auto 0",
              width: 120,
              height: 4,
              background: colors.cold,
            }}
          />
          <div
            style={{
              marginTop: 56,
              fontFamily: fonts.heading,
              fontSize: 48,
              lineHeight: 1.35,
              color: colors.muted,
              fontStyle: "italic",
            }}
          >
            Hujan berhari-hari.
            <br />
            Cerita hantu di dalam vila.
          </div>
          <div
            style={{
              marginTop: 40,
              fontFamily: fonts.mono,
              fontSize: 24,
              color: colors.muted,
            }}
          >
            KARYA TIPOGRAFI · BUKAN ILUSTRASI SEJARAH
          </div>
        </div>
      ) : null}
      {sceneId === "b3" || sceneId === "b9" ? (
        <div
          style={{
            position: "absolute",
            top: 305,
            right: 130,
            width: 500,
            padding: 30,
            background: "rgba(7,11,20,0.76)",
            border: `1px solid ${colors.landLine}`,
            borderRadius: 20,
          }}
        >
          <div
            style={{
              fontFamily: fonts.mono,
              fontSize: 28,
              color: colors.cold,
              letterSpacing: 2,
            }}
          >
            {sceneId === "b3"
              ? "NUSA TENGGARA BARAT"
              : "PERKIRAAN · BUKAN HITUNGAN PASTI"}
          </div>
          {sceneId === "b3" ? (
            <>
              <div
                style={{
                  marginTop: 28,
                  fontFamily: fonts.heading,
                  fontSize: 52,
                  color: colors.text,
                  fontWeight: 700,
                }}
              >
                Tambora
              </div>
              <div
                style={{
                  marginTop: 12,
                  fontFamily: fonts.mono,
                  fontSize: 30,
                  color: colors.muted,
                }}
              >
                8.25°S · 118°E
              </div>
              <div
                style={{
                  marginTop: 36,
                  fontFamily: fonts.heading,
                  fontSize: 36,
                  color: colors.warm,
                }}
              >
                ±4.300 m → 2.850 m*
              </div>
              <div
                style={{
                  marginTop: 16,
                  fontFamily: fonts.mono,
                  fontSize: 22,
                  color: colors.muted,
                }}
              >
                *tinggi pra-letusan: estimasi
              </div>
            </>
          ) : (
            <>
              <div
                style={{
                  marginTop: 32,
                  fontFamily: fonts.heading,
                  fontSize: 78,
                  color: colors.warm,
                  fontWeight: 700,
                }}
              >
                ~70.000
              </div>
              <div
                style={{
                  marginTop: 10,
                  fontFamily: fonts.heading,
                  fontSize: 34,
                  color: colors.text,
                }}
              >
                perkiraan korban
              </div>
              <div
                style={{
                  marginTop: 24,
                  fontFamily: fonts.mono,
                  fontSize: 25,
                  color: colors.muted,
                }}
              >
                Rentang estimasi berbeda antar sumber.
              </div>
            </>
          )}
        </div>
      ) : null}
      {sceneId === "b6" || sceneId === "b7" ? (
        <div
          style={{
            position: "absolute",
            left: 130,
            right: 130,
            top: 270,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <div
            style={{
              fontFamily: fonts.heading,
              fontWeight: 700,
              fontSize: 68,
              color: colors.cold,
              textShadow: `0 0 ${22 * pulse}px ${colors.cold}`,
            }}
          >
            {sceneId === "b6" ? "HUJAN · DINGIN" : "EMBUN BEKU · JUNI"}
          </div>
          <div
            style={{
              marginTop: 105,
              fontFamily: fonts.mono,
              fontSize: 30,
              color: colors.text,
            }}
          >
            {sceneId === "b6"
              ? "PANEN TERGANGGU"
              : "NEW ENGLAND · KANADA TIMUR"}
          </div>
        </div>
      ) : null}
      <div
        style={{
          position: "absolute",
          top: 105,
          left: 120,
          right: 120,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            fontFamily: fonts.mono,
            fontSize: 25,
            letterSpacing: 4,
            color: colors.muted,
          }}
        >
          SUHUF PENGETAHUAN
        </div>
        <div
          style={{
            width: 70,
            height: 4,
            background: colors.warm,
            opacity: pulse,
          }}
        />
      </div>
      <div
        style={{
          position: "absolute",
          left: 120,
          right: 120,
          bottom: 140,
          fontFamily: fonts.heading,
          fontSize: 44,
          color: colors.text,
          fontWeight: 700,
          textAlign: "center",
          textShadow: "0 2px 12px #000",
        }}
      >
        {title}
      </div>
    </>
  );
};
