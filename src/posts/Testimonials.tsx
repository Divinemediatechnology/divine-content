import React from "react";
import { AbsoluteFill, Audio, interpolate, staticFile, useCurrentFrame, Easing } from "remotion";
import { BrandFooter, C, Ground, InkDefs, Paper, SERIF, Stick } from "../kit/kit";

// 60fps timeline (frames)
export const TESTIMONIALS_FRAMES = 660;
const BRAG0 = 80; // top: "I'm great!"
const BRAG1 = 170; // top: "Best in town!"
const SMIRK = 215; // top: customer "Sure you are..."
const LEAVE = 310; // top: customer walks off
const FRIEND0 = 100; // bottom: first friend speaks
const FRIEND_GAP = 40;
const FRIEND_OUT = 262; // friend bubbles fade
const WANT = 280; // bottom: "I'll book them!"
const COIN0 = 350; // bottom: coin flies to the jar
const OUTRO = 470; // title swap
const UNDERLINE = 510;

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const W = 1080;
const TOP_G = 640;
const BOT_G = 1110;
const CUST_X = 170;
const PRES_X = 880;
const JAR_X = 990;
const FRIENDS = [
  { x: 400, text: "Brilliant!", w: 190, up: 0 },
  { x: 560, text: "So good!", w: 170, up: 75 },
  { x: 720, text: "Loved it!", w: 180, up: 0 },
];
const COIN = "#E8B64C";

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

export const Testimonials: React.FC = () => {
  const f = useCurrentFrame();

  // ---------- titles ----------
  const t1Reveal = interpolate(f, [6, 40], [0, 100], { ...clamp, easing: Easing.out(Easing.cubic) });
  const t1Out = interpolate(f, [OUTRO, OUTRO + 14], [1, 0], clamp);
  const t2Reveal = interpolate(f, [OUTRO + 10, OUTRO + 40], [0, 100], { ...clamp, easing: Easing.out(Easing.cubic) });
  const underline = interpolate(f, [UNDERLINE, UNDERLINE + 32], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const labelsIn = interpolate(f, [30, 55], [0, 1], clamp);
  const groundIn = interpolate(f, [20, 60], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });

  // ---------- top: shouting about yourself ----------
  const shouting = f >= BRAG0 && f < LEAVE + 60;
  const wave = shouting ? Math.sin(f / 5) * 14 : 0;
  const presArmL: [number, number] = shouting ? [-150 - wave, -165] : [-18, -8];
  const presArmR: [number, number] = shouting ? [150 + wave, 165] : [18, 8];
  const brag1K = interpolate(f, [BRAG0, BRAG0 + 12, BRAG1 - 8, BRAG1], [0, 1, 1, 0], clamp);
  const brag2K = interpolate(f, [BRAG1 + 4, BRAG1 + 16], [0, 1], clamp);
  const smirkK = interpolate(f, [SMIRK, SMIRK + 12, LEAVE - 10, LEAVE], [0, 1, 1, 0], clamp);
  const leaveP = interpolate(f, [LEAVE, LEAVE + 100], [0, 1], { ...clamp, easing: Easing.inOut(Easing.quad) });
  const tcx = CUST_X - 70 * leaveP;
  const leaving = leaveP > 0 && leaveP < 1;
  const stride = Math.sin(f / 2.4) * 26;
  const custLegs = leaving ? { legL: [-12 - stride, -8] as [number, number], legR: [12 + stride, 8] as [number, number] } : {};
  const brag2Out = interpolate(f, [LEAVE + 20, LEAVE + 34], [1, 0], clamp);

  // ---------- bottom: friends vouch for you ----------
  const friendK = FRIENDS.map((_, i) => {
    const t = FRIEND0 + i * FRIEND_GAP;
    return interpolate(f, [t, t + 12, FRIEND_OUT, FRIEND_OUT + 14], [0, 1, 1, 0], { ...clamp, easing: Easing.out(Easing.back(1.8)) });
  });
  const friendIn = FRIENDS.map((_, i) => interpolate(f, [FRIEND0 - 30 + i * 8, FRIEND0 - 16 + i * 8], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.8)) }));
  const talkAt = (i: number) => {
    const t = FRIEND0 + i * FRIEND_GAP;
    return f >= t && f < FRIEND_OUT ? 1 : 0;
  };
  const wantK = interpolate(f, [WANT, WANT + 12, COIN0 - 8, COIN0 + 4], [0, 1, 1, 0], clamp);
  const wantPulse = 1 + Math.sin(f / 7) * 0.04;
  const give = interpolate(f, [COIN0 - 14, COIN0], [0, 1], clamp);
  const cheer = interpolate(f, [COIN0 + 20, COIN0 + 32], [0, 1], clamp);
  const hop = f > COIN0 + 20 ? -Math.abs(Math.sin((f - COIN0 - 20) / 6)) * 9 * cheer : 0;
  const presHop = f > COIN0 + 20 ? -Math.abs(Math.sin((f - COIN0 - 14) / 6)) * 6 * cheer : 0;
  const coinDur = 40;
  const ca = (f - COIN0) / coinDur;
  const coin = ca >= 0 && ca <= 1
    ? <circle cx={CUST_X + 70 + (JAR_X - CUST_X - 70) * ca} cy={BOT_G - 150 - 260 * 4 * ca * (1 - ca) + 120 * ca} r={9} fill={COIN} stroke={C.ink} strokeWidth={2.5} filter="url(#rough)" />
    : null;
  const botCoins = f >= COIN0 + coinDur ? 1 : 0;

  return (
    <Paper>
      <Audio src={staticFile("sfx/testimonials.wav")} />
      {/* titles */}
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 92 }}>
        <div style={{ position: "absolute", top: 96, fontFamily: SERIF, fontSize: 74, color: C.ink, letterSpacing: -1.5, opacity: t1Out, clipPath: `inset(0 ${100 - t1Reveal}% 0 0)` }}>
          Who do people believe?
        </div>
        <div style={{ position: "absolute", top: 58, textAlign: "center", fontFamily: SERIF, color: C.ink, clipPath: `inset(0 ${100 - t2Reveal}% 0 0)` }}>
          <div style={{ fontSize: 60, letterSpacing: -1 }}>Let customers</div>
          <div style={{ fontSize: 84, fontStyle: "italic", letterSpacing: -1.5, lineHeight: 1 }}>do the bragging.</div>
        </div>
      </AbsoluteFill>

      <svg width={W} height={1350} style={{ position: "absolute", inset: 0 }}>
        <InkDefs />
        {/* red underline for the punchline */}
        <path d="M260,226 C420,238 640,220 820,230" stroke={C.red} strokeWidth={6} fill="none" strokeLinecap="round" filter="url(#rough)" strokeDasharray={600} strokeDashoffset={(1 - underline) * 600} />

        {/* ---- TOP PANEL: self-praise ---- */}
        <Stick x={PRES_X} y={TOP_G} flip armL={presArmL} armR={presArmR} />
        <Stick x={tcx} y={TOP_G} flip={leaveP > 0} lean={f >= SMIRK && f < LEAVE ? -3 : 0} armL={[-8, -4]} armR={[8, 4]} {...custLegs} />
        {brag1K > 0 ? <Bubble x={PRES_X - 100} y={TOP_G - 260} k={brag1K} w={250} text="I'm great!" /> : null}
        {brag2K > 0 ? <Bubble x={PRES_X - 130} y={TOP_G - 260} k={brag2K * brag2Out} w={310} text="Best in town!" /> : null}
        {smirkK > 0 ? <Bubble x={CUST_X + 150} y={TOP_G - 235} k={smirkK} w={330} text="Sure you are..." /> : null}
        <Jar x={JAR_X} y={TOP_G} coins={0} />
        <Ground y={TOP_G} progress={groundIn} />

        {/* ---- BOTTOM PANEL: others vouch ---- */}
        <Stick x={PRES_X} y={BOT_G + presHop} flip armL={[-18, -8]} armR={[18, 8]} />
        {FRIENDS.map((fr, i) => (
          <Stick
            key={fr.text} x={fr.x} y={BOT_G} s={friendIn[i]}
            armL={[-20, -10]} armR={talkAt(i) ? [70 + Math.sin(f / 8 + i) * 6, 80] : [20, 10]}
          />
        ))}
        <Stick
          x={CUST_X} y={BOT_G + hop}
          armL={cheer > 0 ? [-18 - 150 * cheer, -8 - 165 * cheer] : [-20, -10]}
          armR={cheer > 0 ? [18 + 150 * cheer, 8 + 165 * cheer] : [20 + 90 * give, 10 + 60 * give]}
        />
        {FRIENDS.map((fr, i) =>
          friendK[i] > 0 ? <Bubble key={fr.text} x={fr.x + 20} y={BOT_G - 235 - fr.up} k={friendK[i]} w={fr.w} text={fr.text} /> : null,
        )}
        {coin}
        {wantK > 0 ? <Bubble x={CUST_X + 110} y={BOT_G - 235} k={wantK * wantPulse} w={310} text="I'll book them!" /> : null}
        <Jar x={JAR_X} y={BOT_G} coins={botCoins} />
        <Ground y={BOT_G} progress={groundIn} />
      </svg>

      {/* panel labels */}
      <div style={{ position: "absolute", top: TOP_G + 18, left: 78, fontFamily: SERIF, fontSize: 38, color: C.ink, opacity: labelsIn }}>
        Praising <i>yourself</i>
      </div>
      <div style={{ position: "absolute", top: BOT_G + 18, left: 78, fontFamily: SERIF, fontSize: 38, color: C.ink, opacity: labelsIn }}>
        Others <i>vouching</i> for you
      </div>
      <BrandFooter opacity={labelsIn} />
    </Paper>
  );
};
