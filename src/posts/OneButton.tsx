import React from "react";
import { AbsoluteFill, Audio, interpolate, staticFile, useCurrentFrame, Easing } from "remotion";
import { BrandFooter, C, Ground, InkDefs, Paper, SERIF, Stick } from "../kit/kit";

// 60fps timeline (frames)
export const ONEBUTTON_FRAMES = 660;
const BOARD0 = 50; // top: buttons start appearing
const BOARD1 = 120; // top: all 40 buttons are up
const SINGLE = 70; // bottom: the one button pops in
const REACH = 150; // both figures reach out
const PRESS = 235; // bottom: figure presses the button
const COIN0 = 245; // bottom: coin flies to the jar
const OUTRO = 470; // title swap
const UNDERLINE = 510;

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const W = 1080;
const TOP_G = 640;
const BOT_G = 1110;
const FIG_X = 440;
const JAR_X = 975;
const COIN = "#E8B64C";
const COLS = 8;
const ROWS = 5;
const BX = 520; // board left
const BY = 335; // board top
const CW = 46;
const CH = 44;

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

export const OneButton: React.FC = () => {
  const f = useCurrentFrame();

  // ---------- titles ----------
  const t1Reveal = interpolate(f, [6, 40], [0, 100], { ...clamp, easing: Easing.out(Easing.cubic) });
  const t1Out = interpolate(f, [OUTRO, OUTRO + 14], [1, 0], clamp);
  const t2Reveal = interpolate(f, [OUTRO + 10, OUTRO + 40], [0, 100], { ...clamp, easing: Easing.out(Easing.cubic) });
  const underline = interpolate(f, [UNDERLINE, UNDERLINE + 32], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const labelsIn = interpolate(f, [30, 55], [0, 1], clamp);
  const groundIn = interpolate(f, [20, 60], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });

  // ---------- top: forty buttons, frozen visitor ----------
  const reachTop = interpolate(f, [REACH, REACH + 20], [0, 1], clamp);
  const waver = f > REACH + 20 ? Math.sin((f - REACH) / 7) * 9 : 0;
  const armTop: [number, number] = [20 + 78 * reachTop + waver * 0.5, 10 + 80 * reachTop + waver];
  const qIn = interpolate(f, [REACH + 30, REACH + 44, OUTRO - 14, OUTRO], [0, 1, 1, 0], clamp);
  const qPulse = 1 + Math.sin(f / 8) * 0.04;
  const sweat = f > REACH + 70 && f < OUTRO ? interpolate((f - REACH - 70) % 50, [0, 50], [0, 26]) : 0;

  // ---------- bottom: one clear button ----------
  const btnPop = interpolate(f, [SINGLE, SINGLE + 14], [0, 1], { ...clamp, easing: Easing.out(Easing.back(2)) });
  const reachBot = interpolate(f, [REACH, REACH + 20], [0, 1], clamp);
  const press = interpolate(f, [PRESS - 6, PRESS, PRESS + 10], [0, 1, 0], clamp);
  const cheer = interpolate(f, [COIN0 + 20, COIN0 + 32], [0, 1], clamp);
  const hop = f > COIN0 + 20 ? -Math.abs(Math.sin((f - COIN0 - 20) / 6)) * 9 * cheer : 0;
  const armBotR: [number, number] = [20 + 78 * reachBot + 6 * press, 10 + 80 * reachBot + 6 * press];
  const coinDur = 28;
  const ca = (f - COIN0) / coinDur;
  const coin = ca >= 0 && ca <= 1
    ? <circle cx={650 + (JAR_X - 650) * ca} cy={BOT_G - 190 - 120 * 4 * ca * (1 - ca) + 130 * ca} r={9} fill={COIN} stroke={C.ink} strokeWidth={2.5} filter="url(#rough)" />
    : null;
  const botCoins = f >= COIN0 + coinDur ? 1 : 0;

  const buttons = Array.from({ length: COLS * ROWS }, (_, i) => {
    const appear = interpolate(f, [BOARD0 + (i / (COLS * ROWS)) * (BOARD1 - BOARD0), BOARD0 + (i / (COLS * ROWS)) * (BOARD1 - BOARD0) + 8], [0, 1], clamp);
    const c = i % COLS;
    const r = Math.floor(i / COLS);
    const tint = (i * 7) % 5 === 0;
    return (
      <rect
        key={i}
        x={BX + 10 + c * CW + 4} y={BY + 10 + r * CH + 4} width={CW - 8} height={CH - 8} rx={6}
        fill={tint ? C.waterLight : C.paper} fillOpacity={tint ? 0.55 : 1}
        stroke={C.ink} strokeWidth={2.4} opacity={appear}
        transform={`translate(${BX + 10 + c * CW + CW / 2},${BY + 10 + r * CH + CH / 2}) scale(${0.6 + 0.4 * appear}) translate(${-(BX + 10 + c * CW + CW / 2)},${-(BY + 10 + r * CH + CH / 2)})`}
      />
    );
  });

  return (
    <Paper>
      <Audio src={staticFile("sfx/one_button.wav")} />
      {/* titles */}
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 92 }}>
        <div style={{ position: "absolute", top: 96, fontFamily: SERIF, fontSize: 78, color: C.ink, letterSpacing: -1.5, opacity: t1Out, clipPath: `inset(0 ${100 - t1Reveal}% 0 0)` }}>
          Why do they not click?
        </div>
        <div style={{ position: "absolute", top: 58, textAlign: "center", fontFamily: SERIF, color: C.ink, clipPath: `inset(0 ${100 - t2Reveal}% 0 0)` }}>
          <div style={{ fontSize: 60, letterSpacing: -1 }}>One clear button</div>
          <div style={{ fontSize: 84, fontStyle: "italic", letterSpacing: -1.5, lineHeight: 1 }}>beats forty.</div>
        </div>
      </AbsoluteFill>

      <svg width={W} height={1350} style={{ position: "absolute", inset: 0 }}>
        <InkDefs />
        {/* red underline for the punchline */}
        <path d="M330,226 C440,238 620,220 750,230" stroke={C.red} strokeWidth={6} fill="none" strokeLinecap="round" filter="url(#rough)" strokeDasharray={520} strokeDashoffset={(1 - underline) * 520} />

        {/* ---- TOP PANEL ---- */}
        <g filter="url(#rough)" stroke={C.ink} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" fill="none" opacity={interpolate(f, [BOARD0 - 10, BOARD0], [0, 1], clamp)}>
          <path d={`M${BX + 40},${BY + ROWS * CH + 20} L${BX + 40},${TOP_G}`} />
          <path d={`M${BX + COLS * CW - 30},${BY + ROWS * CH + 20} L${BX + COLS * CW - 30},${TOP_G}`} />
          <rect x={BX} y={BY} width={COLS * CW + 20} height={ROWS * CH + 20} rx={10} fill={C.paper} />
        </g>
        <g filter="url(#rough)">{buttons}</g>
        <Stick x={FIG_X} y={TOP_G} lean={reachTop * 4} armL={[-18, -8]} armR={armTop} />
        {sweat > 0 ? <path d={`M${FIG_X + 30},${TOP_G - 190 + sweat} q-6,10 0,14 q6,-4 0,-14`} fill={C.waterLight} stroke={C.ink} strokeWidth={2.2} filter="url(#rough)" /> : null}
        {qIn > 0 ? <Bubble x={FIG_X - 10} y={TOP_G - 250} k={qIn * qPulse} w={120} text="? ? ?" /> : null}
        <Jar x={JAR_X} y={TOP_G} coins={0} />
        <Ground y={TOP_G} progress={groundIn} />

        {/* ---- BOTTOM PANEL ---- */}
        <g transform={`translate(650,${BOT_G - 140}) scale(${btnPop})`}>
          <g filter="url(#rough)" stroke={C.ink} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round">
            <path d={`M0,${45} L0,${140}`} fill="none" />
            <rect x={-130} y={-45 + 8 * press} width={260} height={90} rx={16} fill={C.water} />
            <text x={0} y={12 + 8 * press} textAnchor="middle" fontFamily={SERIF} fontSize={42} fill={C.paper} stroke="none" letterSpacing={1}>Book now</text>
          </g>
        </g>
        <Stick
          x={FIG_X} y={BOT_G + hop} lean={reachBot * 4 * (1 - cheer)}
          armL={cheer > 0 ? [-18 - 150 * cheer, -8 - 165 * cheer] : [-18, -8]}
          armR={cheer > 0 ? [18 + 150 * cheer, 8 + 165 * cheer] : armBotR}
        />
        {coin}
        <Jar x={JAR_X} y={BOT_G} coins={botCoins} />
        <Ground y={BOT_G} progress={groundIn} />
      </svg>

      {/* panel labels */}
      <div style={{ position: "absolute", top: TOP_G + 18, left: 78, fontFamily: SERIF, fontSize: 38, color: C.ink, opacity: labelsIn }}>
        Forty choices, <i>no click</i>
      </div>
      <div style={{ position: "absolute", top: BOT_G + 18, left: 78, fontFamily: SERIF, fontSize: 38, color: C.ink, opacity: labelsIn }}>
        One next step, <i>one click</i>
      </div>
      <BrandFooter opacity={labelsIn} />
    </Paper>
  );
};
