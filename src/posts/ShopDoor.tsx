import React from "react";
import { AbsoluteFill, Audio, interpolate, staticFile, useCurrentFrame, Easing } from "remotion";
import { BrandFooter, C, Ground, InkDefs, Paper, SERIF, Stick } from "../kit/kit";

// 60fps timeline (frames)
export const SHOPDOOR_FRAMES = 600;
const OPEN_AT = 50; // bottom door swings open
const SPEED = 6; // px per frame for walkers
const OUTRO = 430; // title swap
const UNDERLINE = 470;
const KNOCKS = [118, 138, 158];
const SHRUG = 190;
const LEAVE = 232;
const A_X0 = 90;
const A_X1 = 580;
const GATE = 735; // doorway entrance x
const ENTRANTS = [
  { f0: 40, x0: 90 },
  { f0: 90, x0: -60 },
  { f0: 140, x0: -60 },
];

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const W = 1080;
const TOP_G = 640;
const BOT_G = 1110;
const DX = 830; // door centre x
const DOOR_H = 230;
const DOOR_W = 120;

const Shop: React.FC<{ y: number; open: number; sign: string; spinner?: number; glow?: boolean }> = ({ y, open, sign, spinner, glow }) => {
  const w = DOOR_W * (1 - 0.82 * open);
  return (
    <g transform={`translate(${DX},${y})`} stroke={C.ink} strokeWidth={4} strokeLinejoin="round" strokeLinecap="round" filter="url(#rough)">
      {/* wall */}
      <path d={`M-170,0 L-170,-300 L170,-300 L170,0`} fill="none" />
      {/* awning */}
      <path d={`M-190,-300 L190,-300 L170,-268 L-170,-268 Z`} fill={C.waterLight} />
      {/* doorway */}
      <path d={`M-${DOOR_W / 2},0 L-${DOOR_W / 2},-${DOOR_H} L${DOOR_W / 2},-${DOOR_H} L${DOOR_W / 2},0`} fill={glow && open > 0 ? "#F4DE9A" : C.paper} fillOpacity={glow ? 0.25 + 0.75 * open : 1} />
      {/* door leaf, hinged on the left */}
      <g transform={`translate(${-DOOR_W / 2},0)`}>
        <path d={`M0,0 L0,-${DOOR_H} L${w},-${DOOR_H - 34 * open} L${w},-${34 * open} Z`} fill={C.dead} fillOpacity={0.55} />
        {spinner !== undefined ? (
          <g transform={`translate(${w / 2},-132)`}>
            <circle r={22} fill="none" strokeWidth={3} strokeOpacity={0.25} />
            <path d="M0,-22 A22,22 0 0 1 22,0" fill="none" strokeWidth={5} transform={`rotate(${spinner})`} />
          </g>
        ) : null}
        {open < 0.2 ? <circle cx={w - 16} cy={-112} r={4} fill={C.ink} /> : null}
      </g>
      {/* hanging sign */}
      <g transform="translate(0,-340)">
        <path d="M-60,40 L-52,10 M60,40 L52,10" fill="none" strokeWidth={2.5} />
        <rect x={-96} y={-14} width={192} height={50} rx={6} fill={C.paper} />
        <text x={0} y={22} textAnchor="middle" fontFamily={SERIF} fontStyle="italic" fontSize={30} fill={C.ink} stroke="none">
          {sign}
        </text>
      </g>
    </g>
  );
};

const Coin: React.FC<{ x: number; y: number; o: number }> = ({ x, y, o }) => (
  <g transform={`translate(${x},${y})`} opacity={o} filter="url(#rough)">
    <circle r={15} fill="#E8B64C" stroke={C.ink} strokeWidth={3} />
    <path d="M0,-7 L0,7" stroke={C.ink} strokeWidth={2.5} />
  </g>
);

export const ShopDoor: React.FC = () => {
  const f = useCurrentFrame();

  // ---------- titles ----------
  const t1Reveal = interpolate(f, [6, 40], [0, 100], { ...clamp, easing: Easing.out(Easing.cubic) });
  const t1Out = interpolate(f, [OUTRO, OUTRO + 14], [1, 0], clamp);
  const t2Reveal = interpolate(f, [OUTRO + 10, OUTRO + 40], [0, 100], { ...clamp, easing: Easing.out(Easing.cubic) });
  const underline = interpolate(f, [UNDERLINE, UNDERLINE + 32], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const labelsIn = interpolate(f, [30, 55], [0, 1], clamp);
  const groundIn = interpolate(f, [20, 60], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const sw = (ff: number) => Math.sin(ff / 5) * 28;

  // ---------- top: stuck, slow website ----------
  const spin = f * 9;
  const arriveA = (A_X1 - A_X0) / SPEED + 30;
  let ax: number;
  let aWalk = false;
  let aFlip = false;
  if (f < 30) ax = A_X0;
  else if (f < arriveA) {
    ax = A_X0 + (f - 30) * SPEED;
    aWalk = true;
  } else if (f < LEAVE) ax = A_X1;
  else {
    ax = A_X1 - (f - LEAVE) * SPEED;
    aWalk = ax > -90;
    aFlip = true;
  }
  const knock = Math.max(0, ...KNOCKS.map((k) => interpolate(f - k, [0, 3, 8], [0, 1, 0], clamp)));
  const shrug = interpolate(f, [SHRUG, SHRUG + 8, LEAVE - 8, LEAVE], [0, 1, 1, 0], clamp);
  const knocking = f >= arriveA && f < SHRUG;
  const aw = sw(f);
  let aArmL: [number, number] = [-20, -10];
  let aArmR: [number, number] = [20, 10];
  if (aWalk) {
    aArmL = [-aw * 0.8, -aw * 0.8];
    aArmR = [aw * 0.8, aw * 0.8];
  } else if (knocking) {
    aArmR = [74 + 18 * knock, 78 + 18 * knock];
  } else if (shrug > 0) {
    aArmL = [-20 - 50 * shrug, -10 - 100 * shrug];
    aArmR = [20 + 50 * shrug, 10 + 100 * shrug];
  }
  const aLegs: { legL: [number, number]; legR: [number, number] } = aWalk
    ? { legL: [aw, aw * 0.5], legR: [-aw, -aw * 0.5] }
    : { legL: [-12, -8], legR: [12, 8] };
  const qOpacity = interpolate(f, [SHRUG + 2, SHRUG + 12, LEAVE - 6, LEAVE + 4], [0, 1, 1, 0], clamp);

  // ---------- bottom: open, clear website ----------
  const open = interpolate(f, [OPEN_AT, OPEN_AT + 22], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.4)) });
  const entrants = ENTRANTS.map((e) => {
    const x = e.x0 + Math.max(0, f - e.f0) * SPEED;
    const arrive = e.f0 + (GATE - e.x0) / SPEED;
    const xx = Math.min(x, GATE + 90);
    const opacity = f < e.f0 ? 0 : interpolate(xx, [GATE - 10, GATE + 60], [1, 0], clamp);
    const walking = f >= e.f0 && x < GATE + 90;
    return { xx, opacity, walking, arrive };
  });

  return (
    <Paper>
      <Audio src={staticFile("sfx/shop-door.wav")} />
      {/* titles */}
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 92 }}>
        <div style={{ position: "absolute", top: 100, fontFamily: SERIF, fontSize: 68, color: C.ink, letterSpacing: -1.5, opacity: t1Out, clipPath: `inset(0 ${100 - t1Reveal}% 0 0)` }}>
          Would you walk into this shop?
        </div>
        <div style={{ position: "absolute", top: 58, textAlign: "center", fontFamily: SERIF, color: C.ink, clipPath: `inset(0 ${100 - t2Reveal}% 0 0)` }}>
          <div style={{ fontSize: 60, letterSpacing: -1 }}>Your website is</div>
          <div style={{ fontSize: 84, fontStyle: "italic", letterSpacing: -1.5, lineHeight: 1 }}>your shop door.</div>
        </div>
      </AbsoluteFill>

      <svg width={W} height={1350} style={{ position: "absolute", inset: 0 }}>
        <InkDefs />
        {/* red underline for the punchline */}
        <path d="M330,226 C450,236 620,220 760,230" stroke={C.red} strokeWidth={6} fill="none" strokeLinecap="round" filter="url(#rough)" strokeDasharray={460} strokeDashoffset={(1 - underline) * 460} />

        {/* ---- TOP PANEL: shut door ---- */}
        <Shop y={TOP_G} open={0} sign="Loading…" spinner={spin} />
        <Stick x={ax} y={TOP_G} flip={aFlip} armL={aArmL} armR={aArmR} {...aLegs} bob={shrug * -8} />
        <text x={ax + 40} y={TOP_G - 215} fontFamily={SERIF} fontStyle="italic" fontSize={64} fill={C.ink} opacity={qOpacity}>
          ?
        </text>
        <Ground y={TOP_G} progress={groundIn} />

        {/* ---- BOTTOM PANEL: open door ---- */}
        <Shop y={BOT_G} open={open} sign="Open" glow />
        {entrants.map((e, i) => (
          <g key={i} opacity={e.opacity}>
            <Stick
              x={e.xx} y={BOT_G}
              armL={e.walking ? [-sw(f + i * 9) * 0.8, -sw(f + i * 9) * 0.8] : [-20, -10]}
              armR={e.walking ? [sw(f + i * 9) * 0.8, sw(f + i * 9) * 0.8] : [20, 10]}
              legL={e.walking ? [sw(f + i * 9), sw(f + i * 9) * 0.5] : [-12, -8]}
              legR={e.walking ? [-sw(f + i * 9), -sw(f + i * 9) * 0.5] : [12, 8]}
            />
          </g>
        ))}
        {entrants.map((e, i) => {
          const a = f - e.arrive;
          return a >= 0 && a < 45 ? <Coin key={i} x={DX + 20} y={BOT_G - 280 - a * 1.4} o={interpolate(a, [0, 6, 32, 45], [0, 1, 1, 0], clamp)} /> : null;
        })}
        <Ground y={BOT_G} progress={groundIn} />
      </svg>

      {/* panel labels */}
      <div style={{ position: "absolute", top: TOP_G + 18, left: 78, fontFamily: SERIF, fontSize: 38, color: C.ink, opacity: labelsIn }}>
        A slow, <i>confusing</i> website
      </div>
      <div style={{ position: "absolute", top: BOT_G + 18, left: 78, fontFamily: SERIF, fontSize: 38, color: C.ink, opacity: labelsIn }}>
        A fast, <i>clear</i> website
      </div>
      <BrandFooter opacity={labelsIn} />
    </Paper>
  );
};
