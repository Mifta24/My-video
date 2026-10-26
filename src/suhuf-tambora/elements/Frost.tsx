import type React from "react";

// Embun beku yang merambat dari keempat sudut layar: kristal bercabang + kabut biru di tepi.
const CORNERS = [
  { x: 0, y: 0, sx: 1, sy: 1 },
  { x: 1080, y: 0, sx: -1, sy: 1 },
  { x: 0, y: 1920, sx: 1, sy: -1 },
  { x: 1080, y: 1920, sx: -1, sy: -1 },
];
const ANGLES = [8, 24, 40, 56, 72, 86];

export const Frost: React.FC<{ readonly intensity: number }> = ({
  intensity,
}) => (
  <>
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        background: `radial-gradient(ellipse at center, rgba(180,225,255,0) 42%, rgba(170,220,255,${0.22 * intensity}) 78%, rgba(225,242,255,${0.5 * intensity}) 100%)`,
      }}
    />
    <svg
      width={1080}
      height={1920}
      viewBox="0 0 1080 1920"
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
    >
      {CORNERS.map((c, ci) =>
        ANGLES.map((deg, ai) => {
          const len = (200 + ((ci * 7 + ai * 13) % 5) * 55) * intensity;
          const a = (deg * Math.PI) / 180;
          const dx = Math.cos(a) * c.sx;
          const dy = Math.sin(a) * c.sy;
          const ex = c.x + dx * len;
          const ey = c.y + dy * len;
          const branches = [0.35, 0.6, 0.82].map((f, bi) => {
            const bx = c.x + dx * len * f;
            const by = c.y + dy * len * f;
            const bl = len * 0.28 * (1 - f * 0.4);
            const off = bi % 2 === 0 ? 0.7 : -0.7;
            const ba = a + off;
            return (
              <line
                key={bi}
                x1={bx}
                y1={by}
                x2={bx + Math.cos(ba) * c.sx * bl}
                y2={by + Math.sin(ba) * c.sy * bl}
                stroke="#DDF0FF"
                strokeWidth={2}
                strokeLinecap="round"
                opacity={0.55}
              />
            );
          });
          return (
            <g key={`${ci}-${ai}`} opacity={Math.min(1, intensity * 1.4)}>
              <line
                x1={c.x}
                y1={c.y}
                x2={ex}
                y2={ey}
                stroke="#DDF0FF"
                strokeWidth={3}
                strokeLinecap="round"
                opacity={0.6}
              />
              {branches}
            </g>
          );
        }),
      )}
    </svg>
  </>
);
