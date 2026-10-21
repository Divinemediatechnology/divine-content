import React from "react";
import { AbsoluteFill, Audio, interpolate, staticFile, useCurrentFrame, Easing } from "remotion";
import { BrandFooter, C, Ground, InkDefs, Paper, SERIF, Stick } from "../kit/kit";

// 60fps timeline (frames)
export const SHORTFORM_FRAMES = 660;
const STEPS0 = 50; // top: stairs start rising
const STEP_GAP = 9; // frames between each stair appearing
const ONE = 70; // bottom: the single step pops in
const CLIMB = 130; // both figures start walking
const SEG = 22; // frames per climbed step
const TIRED = CLIMB + 4 * SEG + 20; // top: figure stops, "Still more?"
const LEAVE = 340; // top: figure gives up and heads down
const DOWN = 14; // frames per step going down
const COIN0 = 245; // bottom: coin flies to the jar
const OUTRO = 470; // title swap
const UNDERLINE = 510;

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const W = 1080;
const TOP_G = 640;
const BOT_G = 1110;
const START_X = 360;
const SX = 470; // stairs left edge
const SW = 64;
const SH = 34;
const NSTEPS = 7;
const JAR_X = 985;
const COIN = "#E8B64C";
const FIELDS = ["Name", "Email", "Phone", "Firm", "Budget", "Role", "City"];

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

// feet position when standing on stair i (i = -1 means the ground)
const footPt = (i: number, ground: number): [number, number] =>
  i < 0 ? [START_X, ground] : [SX + SW * i + SW / 2, ground - SH * (i + 1)];

export const ShortForm: React.FC = () => {
  const f = useCurrentFrame();

  // ---------- titles ----------
  const t1Reveal = interpolate(f, [6, 40], [0, 100], { ...clamp, easing: Easing.out(Easing.cubic) });
  const t1Out = interpolate(f, [OUTRO, OUTRO + 14], [1, 0], clamp);
  const t2Reveal = interpolate(f, [OUTRO + 10, OUTRO + 40], [0, 100], { ...clamp, easing: Easing.out(Easing.cubic) });
  const underline = interpolate(f, [UNDERLINE, UNDERLINE + 32], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const labelsIn = interpolate(f, [30, 55], [0, 1], clamp);
  const groundIn = interpolate(f, [20, 60], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });

  // ---------- top: seven-field staircase, figure quits halfway ----------
  let tx = START_X;
  let ty = TOP_G;
  let walking = false;
  let topFlip = false;
  if (f < LEAVE) {
    const p = interpolate(f, [CLIMB, CLIMB + 4 * SEG], [0, 4], clamp);
    const k = Math.min(3, Math.floor(p));
    const u = p - k;
    const a = footPt(k - 1, TOP_G);
    const b = footPt(k, TOP_G);
    tx = a[0] + (b[0] - a[0]) * u;
    ty = a[1] + (b[1] - a[1]) * u - Math.sin(Math.PI * u) * 14;
    walking = p > 0 && p < 4;
  } else {
    topFlip = true;
    const q = interpolate(f, [LEAVE, LEAVE + 4 * DOWN], [0, 4], clamp);
    const k = Math.min(3, Math.floor(q));
    const u = q - k;
    const a = footPt(3 - k, TOP_G);
    const b = footPt(2 - k, TOP_G);
    if (q < 4) {
      tx = a[0] + (b[0] - a[0]) * u;
      ty = a[1] + (b[1] - a[1]) * u - Math.sin(Math.PI * u) * 8;
      walking = true;
    } else {
      const w = interpolate(f, [LEAVE + 4 * DOWN, LEAVE + 4 * DOWN + 70], [0, 1], clamp);
      tx = START_X - 210 * w;
      ty = TOP_G;
      walking = w > 0 && w < 1;
    }
  }
  const stride = Math.sin(f / 2.4) * 26;
  const topLegs = walking ? { legL: [-12 - stride, -8] as [number, number], legR: [12 + stride, 8] as [number, number] } : {};
  const tired = f >= TIRED && f < LEAVE;
  const topArmR: [number, number] = tired ? [8, 4] : [20 + (walking ? stride * 0.6 : 0), 10];
  const topArmL: [number, number] = tired ? [-8, -4] : [-20 - (walking ? stride * 0.6 : 0), -10];
  const qIn = interpolate(f, [TIRED + 4, TIRED + 18, LEAVE - 10, LEAVE], [0, 1, 1, 0], clamp);
  const qPulse = 1 + Math.sin(f / 8) * 0.04;
  const sweat = tired ? interpolate((f - TIRED) % 40, [0, 40], [0, 26]) : 0;
  const flagPop = interpolate(f, [STEPS0 + NSTEPS * STEP_GAP, STEPS0 + NSTEPS * STEP_GAP + 12], [0, 1], { ...clamp, easing: Easing.out(Easing.back(2)) });

  const stairs = Array.from({ length: NSTEPS }, (_, i) => {
    const appear = interpolate(f, [STEPS0 + i * STEP_GAP, STEPS0 + i * STEP_GAP + 10], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.6)) });
    const h = SH * (i + 1);
    const x = SX + SW * i;
    return (
      <g key={i} transform={`translate(${x + SW / 2},${TOP_G}) scale(1,${appear}) translate(${-(x + SW / 2)},${-TOP_G})`} opacity={Math.min(1, appear * 2)}>
        <rect x={x} y={TOP_G - h} width={SW} height={h} fill={C.paper} stroke={C.ink} strokeWidth={3.5} strokeLinejoin="round" />
        <text x={x + SW / 2} y={TOP_G - h + 25} textAnchor="middle" fontFamily={SERIF} fontStyle="italic" fontSize={20} fill={C.ink} stroke="none">{FIELDS[i]}</text>
      </g>
    );
  });

  // ---------- bottom: one field, one step ----------
  const stepPop = interpolate(f, [ONE, ONE + 14], [0, 1], { ...clamp, easing: Easing.out(Easing.back(2)) });
  const bp = interpolate(f, [CLIMB, CLIMB + SEG], [0, 1], clamp);
  const bStart = footPt(-1, BOT_G);
  const bEnd = footPt(0, BOT_G);
  const bx = bStart[0] + (bEnd[0] - bStart[0]) * bp;
  const by = bStart[1] + (bEnd[1] - bStart[1]) * bp - Math.sin(Math.PI * bp) * 14;
  const bWalking = bp > 0 && bp < 1;
  const cheer = interpolate(f, [COIN0 + 20, COIN0 + 32], [0, 1], clamp);
  const hop = f > COIN0 + 20 ? -Math.abs(Math.sin((f - COIN0 - 20) / 6)) * 9 * cheer : 0;
  const send = interpolate(f, [COIN0 - 14, COIN0], [0, 1], clamp);
  const bArmR: [number, number] = [20 + 90 * send, 10 + 60 * send];
  const sentIn = interpolate(f, [COIN0 + 28, COIN0 + 40, OUTRO - 14, OUTRO], [0, 1, 1, 0], clamp);
  const coinDur = 28;
  const ca = (f - COIN0) / coinDur;
  const coin = ca >= 0 && ca <= 1
    ? <circle cx={bx + 80 + (JAR_X - bx - 80) * ca} cy={by - 110 - 120 * 4 * ca * (1 - ca) + (BOT_G - by + 60) * ca} r={9} fill={COIN} stroke={C.ink} strokeWidth={2.5} filter="url(#rough)" />
    : null;
  const botCoins = f >= COIN0 + coinDur ? 1 : 0;

  return (
    <Paper>
      <Audio src={staticFile("sfx/short_form.wav")} />
      {/* titles */}
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 92 }}>
        <div style={{ position: "absolute", top: 96, fontFamily: SERIF, fontSize: 78, color: C.ink, letterSpacing: -1.5, opacity: t1Out, clipPath: `inset(0 ${100 - t1Reveal}% 0 0)` }}>
          Why do they quit halfway?
        </div>
        <div style={{ position: "absolute", top: 58, textAlign: "center", fontFamily: SERIF, color: C.ink, clipPath: `inset(0 ${100 - t2Reveal}% 0 0)` }}>
          <div style={{ fontSize: 60, letterSpacing: -1 }}>Fewer fields,</div>
          <div style={{ fontSize: 84, fontStyle: "italic", letterSpacing: -1.5, lineHeight: 1 }}>more leads.</div>
        </div>
      </AbsoluteFill>

      <svg width={W} height={1350} style={{ position: "absolute", inset: 0 }}>
        <InkDefs />
        {/* red underline for the punchline */}
        <path d="M330,226 C440,238 620,220 750,230" stroke={C.red} strokeWidth={6} fill="none" strokeLinecap="round" filter="url(#rough)" strokeDasharray={520} strokeDashoffset={(1 - underline) * 520} />

        {/* ---- TOP PANEL ---- */}
        <g filter="url(#rough)">{stairs}</g>
        <g transform={`translate(${SX + SW * (NSTEPS - 1) + SW / 2},${TOP_G - SH * NSTEPS}) scale(${flagPop})`} filter="url(#rough)" stroke={C.ink} strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round">
          <path d="M0,0 L0,-80" fill="none" />
          <path d="M0,-80 L52,-64 L0,-48 Z" fill={C.water} />
        </g>
        <Stick x={tx} y={ty} flip={topFlip} lean={tired ? 4 : 0} armL={topArmL} armR={topArmR} {...topLegs} />
        {sweat > 0 ? <path d={`M${tx + 30},${ty - 190 + sweat} q-6,10 0,14 q6,-4 0,-14`} fill={C.waterLight} stroke={C.ink} strokeWidth={2.2} filter="url(#rough)" /> : null}
        {qIn > 0 ? <Bubble x={tx - 20} y={ty - 235} k={qIn * qPulse} w={190} text="Still more?" /> : null}
        <Jar x={JAR_X} y={TOP_G} coins={0} />
        <Ground y={TOP_G} progress={groundIn} />

        {/* ---- BOTTOM PANEL ---- */}
        <g transform={`translate(${SX + SW / 2},${BOT_G}) scale(1,${stepPop}) translate(${-(SX + SW / 2)},${-BOT_G})`} opacity={Math.min(1, stepPop * 2)} filter="url(#rough)">
          <rect x={SX} y={BOT_G - SH} width={SW} height={SH} fill={C.paper} stroke={C.ink} strokeWidth={3.5} strokeLinejoin="round" />
          <text x={SX + SW / 2} y={BOT_G - SH + 25} textAnchor="middle" fontFamily={SERIF} fontStyle="italic" fontSize={20} fill={C.ink} stroke="none">Email</text>
        </g>
        <Stick
          x={bx} y={by + hop}
          armL={cheer > 0 ? [-18 - 150 * cheer, -8 - 165 * cheer] : [-20 - (bWalking ? 14 : 0), -10]}
          armR={cheer > 0 ? [18 + 150 * cheer, 8 + 165 * cheer] : bArmR}
          legL={bWalking ? [-12 - Math.sin(f / 2.4) * 26, -8] : [-12, -8]}
          legR={bWalking ? [12 + Math.sin(f / 2.4) * 26, 8] : [12, 8]}
        />
        {coin}
        {sentIn > 0 ? <Bubble x={bx - 10} y={by - 295} k={sentIn} w={140} text="Sent!" /> : null}
        <Jar x={JAR_X} y={BOT_G} coins={botCoins} />
        <Ground y={BOT_G} progress={groundIn} />
      </svg>

      {/* panel labels */}
      <div style={{ position: "absolute", top: TOP_G + 18, left: 78, fontFamily: SERIF, fontSize: 38, color: C.ink, opacity: labelsIn }}>
        Seven fields, <i>they quit</i>
      </div>
      <div style={{ position: "absolute", top: BOT_G + 18, left: 78, fontFamily: SERIF, fontSize: 38, color: C.ink, opacity: labelsIn }}>
        One field, <i>they finish</i>
      </div>
      <BrandFooter opacity={labelsIn} />
    </Paper>
  );
};
