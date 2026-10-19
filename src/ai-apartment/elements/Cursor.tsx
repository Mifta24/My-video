import type React from "react";
import { Interactive } from "remotion";

type CursorProps = {
  readonly style?: React.CSSProperties;
};

// Kursor mouse. Gerakkan dengan `translate` yang di-keyframe di pemanggil.
const CursorInner: React.FC<CursorProps> = ({ style }) => {
  return (
    <svg
      width={44}
      height={56}
      viewBox="0 0 22 28"
      style={{ filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.5))", ...style }}
    >
      <path
        d="M1 1 L1 22 L6.5 17 L10.5 26 L14 24.5 L10 15.8 L17.5 15.8 Z"
        fill="#ffffff"
        stroke="#111111"
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const Cursor = Interactive.create({
  Component: CursorInner,
  layout: "none",
});
