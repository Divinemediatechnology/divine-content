import React from "react";
import { AbsoluteFill, Audio, interpolate, staticFile, useCurrentFrame, Easing } from "remotion";
import { BrandFooter, C, Ground, InkDefs, Paper, SERIF, Stick } from "../kit/kit";

// 60fps timeline (frames)
export const LEADQUALITY_FRAMES = 660;
const ROCK0 = 70; // top: first rock drops in
const ROCK_GAP = 9;
const ROCKS = 16;
const ASK = 245; // top: "Any buyers?"
const SHRUG = 320; // top: "Just rocks..."
const COIN_IN0 = 100; // bottom: first gold coin lands in the bowl
const COIN_GAP = 28;
const COINS = 5;
const CONV0 = 300; // bottom: coins hop to the jar
const CONV_GAP = 22;
const CONV_DUR = 40;
const OUTRO = 470; // title swap
const UNDERLINE = 510;

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const W = 1080;
const TOP_G = 640;
const BOT_G = 1110;
const BOX_X = 300;
const FIG_X = 640;
const JAR_X = 990;
const COIN = "#E8B64C";

const rockSpot = (i: number): [number, number] => {
  const rows = [3, 3, 3, 3, 2, 2];
  let r = 0;
  let k = i;
  while (k >= rows[r]) {
    k -= rows[r];
    r++;
  }
  const n = rows[r];
  return [BOX_X + (k - (n - 1) / 2) * 32 + ((i * 7) % 5) - 2, TOP_G - 16 - r * 22];
};
const coinSpot = (i: number): [number, number] => [BOX_X + [-30, 0, 30, -15, 15][i], BOT_G - [68, 68, 68, 90, 90][i]];

const Rock: React.FC<{ x: number; y: number; seed: number }> = ({ x, y, seed }) => (
  <path
    transform={`translate(${x},${y}) rotate(${seed * 37})`}
    d="M-15,4 L-9,-11 L6,-13 L15,-2 L9,11 L-8,12 Z"
    fill="#B9B0A0" stroke={C.ink} strokeWidth={3} strokeLinejoin="round" filter="url(#rough)"
  />
);

const Jar: React.FC<{ x: number; y: number; coins: number }> = ({ x, y, coins }) => (
  <g transform={`translate(${x},${y})`} filter="url(#rough)" stroke={C.ink} strokeWidth={3.5} strokeLinejoin="round">
    {Array.from({ length: Math.min(coins, 12) }, (_, i) => (
      <circle key={i} cx={-20 + (i % 3) * 20} cy={-14 - Math.floor(i / 3) * 16} r={9} fill={COIN} strokeWidth={2.5} />
    ))}
    <path d="M-38,-98 L-34,0 L34,0 L38,-98" fill={C.waterLight} fillOpacity={0.25} />
    <path d="M-42,-98 L42,-98" fill="none" />
  </g>
);

const Bubble: React.FC<{ x: number; y: number; k: number; w: number; text: string }> = ({ x, y, k, w, text }) => (
  <g transform={`translate(${x},${y}) scale(${k})`} filter="url(#rough)">
    <path
      d={`M${-w / 2},-26 Q${-w / 2},-42 ${-w / 2 + 16},-42 L${w / 2 - 16},-42 Q${w / 2},-42 ${w / 2},-26 L${w / 2},0 Q${w / 2},16 ${w / 2 - 16},16 L${-w / 2 + 60},16 L${-w / 2 + 30},38 L${-w / 2 + 34},16 L${-w / 2 + 16},16 Q${-w / 2},16 ${-w / 2},0 Z`}
      fill={C.paper} stroke={C.ink} strokeWidth={3.5} strokeLinejoin="round"
    />
    <text x={0} y={-7} textAnchor="middle" fontFamily={SERIF} fontStyle="italic" fontSize={32} fill={C.ink}>{text}</text>
  </g>
);

export const LeadQuality: React.FC = () => {
  const f = useCurrentFrame();

  // ---------- titles ----------
  const t1Reveal = interpolate(f, [6, 40], [0, 100], { ...clamp, easing: Easing.out(Easing.cubic) });
  const t1Out = interpolate(f, [OUTRO, OUTRO + 14], [1, 0], clamp);
  const t2Reveal = interpolate(f, [OUTRO + 10, OUTRO + 40], [0, 100], { ...clamp, easing: Easing.out(Easing.cubic) });
  const underline = interpolate(f, [UNDERLINE, UNDERLINE + 32], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const labelsIn = interpolate(f, [30, 55], [0, 1], clamp);
  const groundIn = interpolate(f, [20, 60], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const countersOut = interpolate(f, [OUTRO, OUTRO + 12], [1, 0], clamp);

  // ---------- top: a bucket of rocks ----------
  const leadsTop = Math.round(200 * interpolate(f, [ROCK0, ROCK0 + (ROCKS - 1) * ROCK_GAP + 14], [0, 1], clamp));
  const leadsTopIn = interpolate(f, [ROCK0 - 10, ROCK0], [0, 1], clamp);
  const askK = interpolate(f, [ASK, ASK + 12, SHRUG - 8, SHRUG], [0, 1, 1, 0], clamp);
  const shrugK = interpolate(f, [SHRUG, SHRUG + 12], [0, 1], clamp) * interpolate(f, [OUTRO - 14, OUTRO], [1, 0], clamp);
  const salesTopIn = interpolate(f, [ASK + 30, ASK + 44], [0, 1], clamp);
  const scratch = f > SHRUG && f < OUTRO ? Math.sin((f - SHRUG) / 3.2) * 12 : 0;
  const rockPop = f < ROCK0 + ROCKS * ROCK_GAP;

  // ---------- bottom: a bowl of gold ----------
  const landed = Array.from({ length: COINS }, (_, i) => f >= COIN_IN0 + i * COIN_GAP + 16);
  const leadsBot = landed.filter(Boolean).length;
  const leadsBotIn = interpolate(f, [COIN_IN0 - 10, COIN_IN0], [0, 1], clamp);
  const jarCoins = Array.from({ length: COINS }, (_, i) => f >= CONV0 + i * CONV_GAP + CONV_DUR).filter(Boolean).length;
  const salesBotIn = interpolate(f, [CONV0, CONV0 + 10], [0, 1], clamp);
  const cheer = interpolate(f, [CONV0 + 4 * CONV_GAP + CONV_DUR, CONV0 + 4 * CONV_GAP + CONV_DUR + 12], [0, 1], clamp);
  const hop = cheer > 0 ? -Math.abs(Math.sin((f - CONV0 - 4 * CONV_GAP - CONV_DUR) / 6)) * 9 * cheer : 0;
  const goodK = interpolate(f, [CONV0 + 4 * CONV_GAP + CONV_DUR + 6, CONV0 + 4 * CONV_GAP + CONV_DUR + 18], [0, 1], clamp) * interpolate(f, [OUTRO - 14, OUTRO], [1, 0], clamp);

  const coinNodes = Array.from({ length: COINS }, (_, i) => {
    const [cx, cy] = coinSpot(i);
    const t0 = COIN_IN0 + i * COIN_GAP;
    const t1 = CONV0 + i * CONV_GAP;
    if (f < t0) return null;
    if (f < t0 + 16) {
      const y = interpolate(f - t0, [0, 16], [BOT_G - 340, cy], { ...clamp, easing: Easing.in(Easing.quad) });
      return <circle key={i} cx={cx} cy={y} r={11} fill={COIN} stroke={C.ink} strokeWidth={2.5} filter="url(#rough)" />;
    }
    if (f < t1) return <circle key={i} cx={cx} cy={cy} r={11} fill={COIN} stroke={C.ink} strokeWidth={2.5} filter="url(#rough)" />;
    const a = (f - t1) / CONV_DUR;
    if (a > 1) return null;
    const x = cx + (JAR_X - cx) * a;
    const y = cy + (BOT_G - 30 - cy) * a - 230 * 4 * a * (1 - a);
    return <circle key={i} cx={x} cy={y} r={11} fill={COIN} stroke={C.ink} strokeWidth={2.5} filter="url(#rough)" />;
  });

  const counter = (top: number, label: string, value: number, color: string, op: number) => (
    <div style={{ position: "absolute", top, right: 76, fontFamily: SERIF, fontStyle: "italic", fontSize: 42, color, opacity: op * countersOut, textAlign: "right" }}>
      {label} {value}
    </div>
  );

  return (
    <Paper>
      <Audio src={staticFile("sfx/lead-quality.wav")} />
      {/* titles */}
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 92 }}>
        <div style={{ position: "absolute", top: 96, fontFamily: SERIF, fontSize: 74, color: C.ink, letterSpacing: -1.5, opacity: t1Out, clipPath: `inset(0 ${100 - t1Reveal}% 0 0)` }}>
          Which lead list wins?
        </div>
        <div style={{ position: "absolute", top: 58, textAlign: "center", fontFamily: SERIF, color: C.ink, clipPath: `inset(0 ${100 - t2Reveal}% 0 0)` }}>
          <div style={{ fontSize: 60, letterSpacing: -1 }}>Quality leads</div>
          <div style={{ fontSize: 84, fontStyle: "italic", letterSpacing: -1.5, lineHeight: 1 }}>beat quantity.</div>
        </div>
      </AbsoluteFill>
      {counter(TOP_G - 330, "Leads:", leadsTop, C.ink, leadsTopIn)}
      {counter(TOP_G - 280, "Sales:", 0, C.red, salesTopIn)}
      {counter(BOT_G - 330, "Leads:", leadsBot, C.ink, leadsBotIn)}
      {counter(BOT_G - 280, "Sales:", jarCoins, C.red, salesBotIn)}

      <svg width={W} height={1350} style={{ position: "absolute", inset: 0 }}>
        <InkDefs />
        {/* red underline for the punchline */}
        <path d="M290,226 C440,238 640,220 800,230" stroke={C.red} strokeWidth={6} fill="none" strokeLinecap="round" filter="url(#rough)" strokeDasharray={560} strokeDashoffset={(1 - underline) * 560} />

        {/* ---- TOP PANEL: bucket of rocks ---- */}
        {Array.from({ length: ROCKS }, (_, i) => {
          const t = ROCK0 + i * ROCK_GAP;
          if (f < t) return null;
          const [rx, ry] = rockSpot(i);
          const y = interpolate(f - t, [0, 14], [TOP_G - 330, ry], { ...clamp, easing: Easing.in(Easing.quad) });
          return <Rock key={i} x={rx} y={y} seed={i} />;
        })}
        <g stroke={C.ink} strokeWidth={4} strokeLinejoin="round" filter="url(#rough)" transform={`translate(${BOX_X},${TOP_G})`}>
          <path d="M-62,-84 L-52,0 L52,0 L62,-84" fill="none" />
          <path d="M-66,-84 L66,-84" fill="none" />
        </g>
        <Stick
          x={FIG_X} y={TOP_G} flip
          armR={rockPop ? [112, 96] : scratch !== 0 ? [165, 215 + scratch] : [18, 8]}
          armL={rockPop ? [100, 88] : [-18, -8]}
        />
        {askK > 0 ? <Bubble x={FIG_X - 20} y={TOP_G - 235} k={askK} w={250} text="Any buyers?" /> : null}
        {shrugK > 0 ? <Bubble x={FIG_X - 20} y={TOP_G - 235} k={shrugK} w={270} text="Just rocks..." /> : null}
        <Jar x={JAR_X} y={TOP_G} coins={0} />
        <Ground y={TOP_G} progress={groundIn} />

        {/* ---- BOTTOM PANEL: bowl of gold ---- */}
        <g stroke={C.ink} strokeWidth={4} strokeLinejoin="round" filter="url(#rough)" transform={`translate(${BOX_X},${BOT_G})`}>
          <path d="M-62,-56 Q-58,0 0,0 Q58,0 62,-56 Z" fill="#CDBFA6" fillOpacity={0.55} />
        </g>
        {coinNodes}
        <Stick
          x={FIG_X} y={BOT_G + hop} flip
          armR={cheer > 0 ? [18 + 150 * cheer, 8 + 165 * cheer] : [18, 8]}
          armL={cheer > 0 ? [-18 - 150 * cheer, -8 - 165 * cheer] : [-18, -8]}
        />
        {goodK > 0 ? <Bubble x={FIG_X - 20} y={BOT_G - 235} k={goodK} w={290} text="Every one buys!" /> : null}
        <Jar x={JAR_X} y={BOT_G} coins={jarCoins} />
        <Ground y={BOT_G} progress={groundIn} />
      </svg>

      {/* panel labels */}
      <div style={{ position: "absolute", top: TOP_G + 18, left: 78, fontFamily: SERIF, fontSize: 38, color: C.ink, opacity: labelsIn }}>
        Chasing <i>more leads</i>
      </div>
      <div style={{ position: "absolute", top: BOT_G + 18, left: 78, fontFamily: SERIF, fontSize: 38, color: C.ink, opacity: labelsIn }}>
        Finding the <i>right leads</i>
      </div>
      <BrandFooter opacity={labelsIn} />
    </Paper>
  );
};
