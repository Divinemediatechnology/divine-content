// Shared hand-drawn "paper & ink" kit for Divine Media explainer posts.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { loadFont as loadNewsreader } from "@remotion/google-fonts/Newsreader";

const { fontFamily: newsreader } = loadNewsreader("normal", { weights: ["400", "500"], subsets: ["latin"] });
loadNewsreader("italic", { weights: ["400"], subsets: ["latin"] });

export const SERIF = newsreader;
export const C = {
  paper: "#F2ECDF",
  ink: "#2A2622",
  inkSoft: "#6B645B",
  water: "#5F7590",
  waterLight: "#8DA2BB",
  red: "#C0533A",
  leaf: "#4E6B3A",
  dead: "#8C7350",
};

/** Boiling-line SVG filter: re-seeds every few frames so strokes look hand-drawn. */
export const InkDefs: React.FC = () => {
  const frame = useCurrentFrame();
  const seed = Math.floor(frame / 9) % 6;
  return (
    <defs>
      <filter id="rough" x="-10%" y="-10%" width="120%" height="120%">
        <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves={2} seed={seed} />
        <feDisplacementMap in="SourceGraphic" scale={3.2} />
      </filter>
    </defs>
  );
};

export const Paper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill style={{ backgroundColor: C.paper }}>
    <svg width="100%" height="100%" style={{ position: "absolute", inset: 0, opacity: 0.22, mixBlendMode: "multiply" }}>
      <filter id="grain">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={3} seed={3} />
        <feColorMatrix values="0 0 0 0 0.45  0 0 0 0 0.4  0 0 0 0 0.33  0 0 0 0.55 0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#grain)" />
    </svg>
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 55%, rgba(80,60,30,.10) 100%)" }} />
    {children}
  </AbsoluteFill>
);

type Pt = [number, number];
const polar = (o: Pt, len: number, deg: number): Pt => {
  const r = (deg * Math.PI) / 180;
  return [o[0] + Math.sin(r) * len, o[1] + Math.cos(r) * len];
};

/**
 * Stick figure standing at (x, y) = feet on ground. Angles in degrees, 0 = straight down,
 * positive = toward +x. Each arm/leg has an upper and lower segment.
 */
export const Stick: React.FC<{
  x: number; y: number; s?: number; flip?: boolean;
  armL?: [number, number]; armR?: [number, number];
  legL?: [number, number]; legR?: [number, number];
  lean?: number; bob?: number; children?: React.ReactNode;
}> = ({ x, y, s = 1, flip = false, armL = [-20, -10], armR = [20, 10], legL = [-12, -8], legR = [12, 8], lean = 0, bob = 0, children }) => {
  const hip: Pt = [0, -78];
  const shoulder: Pt = [0, -138];
  const limb = (o: Pt, a: [number, number], l1: number, l2: number) => {
    const m = polar(o, l1, a[0]);
    const e = polar(m, l2, a[1]);
    return `M${o[0]},${o[1]} L${m[0]},${m[1]} L${e[0]},${e[1]}`;
  };
  return (
    <g transform={`translate(${x},${y + bob}) scale(${flip ? -s : s},${s})`}>
      <g transform={`rotate(${lean},0,-78)`} stroke={C.ink} strokeWidth={4.2} fill="none" strokeLinecap="round" strokeLinejoin="round" filter="url(#rough)">
        <circle cx={0} cy={-166} r={24} fill={C.paper} />
        <path d={`M${shoulder[0]},${shoulder[1] - 4} L${hip[0]},${hip[1]}`} />
        <path d={limb(shoulder, armL, 36, 34)} />
        <path d={limb(shoulder, armR, 36, 34)} />
        <path d={limb(hip, legL, 40, 40)} />
        <path d={limb(hip, legR, 40, 40)} />
        {children}
      </g>
    </g>
  );
};

/** Where a stick-figure hand ends up (same math as Stick), in figure-local coordinates. */
export const handPos = (a: [number, number]): Pt => polar(polar([0, -138], 36, a[0]), 34, a[1]);

export const Ground: React.FC<{ y: number; x1?: number; x2?: number; progress?: number }> = ({ y, x1 = 70, x2 = 1010, progress = 1 }) => {
  const len = x2 - x1;
  return (
    <path
      d={`M${x1},${y} C${x1 + len * 0.3},${y - 3} ${x1 + len * 0.6},${y + 3} ${x2},${y}`}
      stroke={C.ink} strokeWidth={3.5} fill="none" strokeLinecap="round" filter="url(#rough)"
      strokeDasharray={len + 20} strokeDashoffset={(1 - progress) * (len + 20)}
    />
  );
};

/** Small brand footer: IG / FB / LinkedIn icons + agency name. Kept tiny so it never reads as a watermark. */
export const BrandFooter: React.FC<{ opacity?: number }> = ({ opacity = 1 }) => {
  const s = { width: 22, height: 22, fill: "none", stroke: C.inkSoft, strokeWidth: 1.8 } as const;
  return (
    <div style={{ position: "absolute", bottom: 34, width: "100%", display: "flex", justifyContent: "center", alignItems: "center", gap: 10, opacity: opacity * 0.85 }}>
      <svg viewBox="0 0 24 24" {...s}><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4.2" /><circle cx="17.3" cy="6.7" r="0.6" fill={C.inkSoft} /></svg>
      <svg viewBox="0 0 24 24" {...s}><circle cx="12" cy="12" r="9.5" /><path d="M13.2 19.5v-6.6h2.3l.4-2.6h-2.7V8.7c0-.8.3-1.3 1.4-1.3h1.4V5.1c-.3 0-1.1-.1-2-.1-2 0-3.3 1.2-3.3 3.4v1.9H8.4v2.6h2.3v6.6" /></svg>
      <svg viewBox="0 0 24 24" {...s}><rect x="3" y="3" width="18" height="18" rx="3" /><path d="M7.5 10.5v6M7.5 7.6v.1M11 16.5v-6M11 13c0-1.6 1-2.6 2.4-2.6s2.3.9 2.3 2.6v3.5" /></svg>
      <span style={{ fontFamily: SERIF, fontSize: 22, color: C.inkSoft, marginLeft: 6, letterSpacing: 0.5 }}>Divine Media Technology</span>
    </div>
  );
};
