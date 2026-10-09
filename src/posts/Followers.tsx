import React from "react";
import { AbsoluteFill, Audio, interpolate, staticFile, useCurrentFrame, Easing } from "remotion";
import { BrandFooter, C, Ground, InkDefs, Paper, SERIF, Stick } from "../kit/kit";

// 60fps timeline (frames)
export const FOLLOWERS_FRAMES = 660;
const CROWD0 = 50; // crowd starts popping in
const CROWD_GAP = 5;
const SHOUT = 170; // seller waves/shouts
const SHRUG = 300; // seller gives up
const WALK0 = 60; // bottom friends walk in
const COIN0 = 190; // first coin leaves a hand
const COIN_GAP = 28;
const COIN_FLY = 24;
const OUTRO = 462; // title swap
const UNDERLINE = 505;

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const W = 1080;
const TOP_G = 640;
const BOT_G = 1110;
const SELLER_X = 190;
const JAR_X = 345;
const FRIEND_X = [520, 620, 720, 820, 920];
const FRONT = Array.from({ length: 8 }, (_, i) => 470 + i * 70);
const BACK = Array.from({ length: 7 }, (_, i) => 505 + i * 70);

const Phone: React.FC = () => (
  <g stroke={C.ink} strokeWidth={3} filter="url(#rough)">
    <rect x={-27} y={-170} width={12} height={20} rx={2} fill={C.waterLight} />
  </g>
);

const Jar: React.FC<{ coins: number }> = ({ coins }) => (
  <g transform={`translate(${JAR_X},${0})`} stroke={C.ink} strokeWidth={4} strokeLinejoin="round" filter="url(#rough)">
    {Array.from({ length: Math.min(coins, 5) }, (_, i) => (
      <ellipse key={i} cx={-14 + (i % 2) * 28 - (i === 4 ? 14 : 0)} cy={-10 - Math.floor(i / 2) * 14} rx={14} ry={8} fill="#E8B64C" strokeWidth={2.5} />
    ))}
    <path d="M-36,-96 L-36,0 L36,0 L36,-96" fill="rgba(141,162,187,0.18)" />
    <path d="M-42,-96 L42,-96" />
  </g>
);

export const Followers: React.FC = () => {
  const f = useCurrentFrame();

  // ---------- titles ----------
  const t1Reveal = interpolate(f, [6, 40], [0, 100], { ...clamp, easing: Easing.out(Easing.cubic) });
  const t1Out = interpolate(f, [OUTRO, OUTRO + 14], [1, 0], clamp);
  const t2Reveal = interpolate(f, [OUTRO + 10, OUTRO + 40], [0, 100], { ...clamp, easing: Easing.out(Easing.cubic) });
  const underline = interpolate(f, [UNDERLINE, UNDERLINE + 32], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const labelsIn = interpolate(f, [30, 55], [0, 1], clamp);
  const groundIn = interpolate(f, [20, 60], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const countOut = interpolate(f, [OUTRO, OUTRO + 12], [1, 0], clamp);

  // ---------- top: giant crowd, zero sales ----------
  const pop = (start: number) => interpolate(f, [start, start + 10], [0, 1], { ...clamp, easing: Easing.out(Easing.back(2)) });
  const followers = Math.round(interpolate(f, [CROWD0, CROWD0 + 100], [0, 12480], { ...clamp, easing: Easing.out(Easing.cubic) }));
  const shouting = f >= SHOUT && f < SHRUG;
  const wave = shouting ? Math.sin((f - SHOUT) / 4) * 14 : 0;
  const scratch = f >= SHRUG ? Math.sin((f - SHRUG) / 3.2) * 12 : 0;
  const sellerArmR: [number, number] = shouting ? [140 + wave, 160] : f >= SHRUG ? [165, 215 + scratch] : [20, 10];
  const sellerArmL: [number, number] = shouting ? [-140 - wave, -160] : [-18, -8];

  // ---------- bottom: five friends, five sales ----------
  const landed = FRIEND_X.map((_, i) => f >= COIN0 + i * COIN_GAP + COIN_FLY);
  const sales = landed.filter(Boolean).length;
  const cheerStart = COIN0 + 4 * COIN_GAP + COIN_FLY + 8;
  const cheer = f > cheerStart ? Math.min(1, (f - cheerStart) / 10) : 0;
  const friendX = (i: number) => FRIEND_X[i] + interpolate(f, [WALK0 + i * 8, WALK0 + i * 8 + 40], [320, 0], { ...clamp, easing: Easing.out(Easing.cubic) });
  const coins = FRIEND_X.map((_, i) => {
    const age = f - (COIN0 + i * COIN_GAP);
    if (age < 0 || age > COIN_FLY) return null;
    const t = age / COIN_FLY;
    const x0 = FRIEND_X[i] - 40;
    const y0 = BOT_G - 100;
    const x = x0 + (JAR_X - x0) * t;
    const y = y0 + (BOT_G - 100 - y0) * t - Math.sin(t * Math.PI) * 120 + 60 * t * t;
    return <ellipse key={i} cx={x} cy={y} rx={13} ry={9} fill="#E8B64C" stroke={C.ink} strokeWidth={2.5} />;
  });
  const topCount = f > 250 ? 1 : 0;
  const sellerBob = cheer > 0 ? -Math.abs(Math.sin((f - cheerStart) / 5)) * 10 * cheer : 0;

  return (
    <Paper>
      <Audio src={staticFile("sfx/followers.wav")} />
      {/* titles */}
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 92 }}>
        <div style={{ position: "absolute", top: 96, fontFamily: SERIF, fontSize: 70, color: C.ink, letterSpacing: -1.5, opacity: t1Out, clipPath: `inset(0 ${100 - t1Reveal}% 0 0)`, whiteSpace: "nowrap" }}>
          A huge crowd. Any sales?
        </div>
        <div style={{ position: "absolute", top: 58, textAlign: "center", fontFamily: SERIF, color: C.ink, clipPath: `inset(0 ${100 - t2Reveal}% 0 0)` }}>
          <div style={{ fontSize: 60, letterSpacing: -1 }}>Followers aren't</div>
          <div style={{ fontSize: 84, fontStyle: "italic", letterSpacing: -1.5, lineHeight: 1 }}>customers.</div>
        </div>
      </AbsoluteFill>

      {/* counters */}
      <div style={{ position: "absolute", top: 292, left: 78, fontFamily: SERIF, fontStyle: "italic", fontSize: 40, color: C.ink, opacity: labelsIn * countOut }}>
        {followers.toLocaleString("en-US")} followers · <span style={{ opacity: topCount }}>0 sales</span>
      </div>
      <div style={{ position: "absolute", top: 762, left: 78, fontFamily: SERIF, fontStyle: "italic", fontSize: 40, color: C.ink, opacity: labelsIn * countOut }}>
        5 followers · {sales} {sales === 1 ? "sale" : "sales"}
      </div>

      <svg width={W} height={1350} style={{ position: "absolute", inset: 0 }}>
        <InkDefs />
        <path d="M330,226 C450,236 620,220 760,230" stroke={C.red} strokeWidth={6} fill="none" strokeLinecap="round" filter="url(#rough)" strokeDasharray={460} strokeDashoffset={(1 - underline) * 460} />

        {/* ---- TOP PANEL ---- */}
        <g transform={`translate(0,${TOP_G})`}><Jar coins={0} /></g>
        {BACK.map((x, i) => {
          const s = pop(CROWD0 + 3 + i * CROWD_GAP * 2);
          return s > 0 ? (
            <Stick key={`b${i}`} x={x} y={TOP_G - 10} s={0.48 * s} flip armR={[40, 170]} armL={[-18, -8]} bob={Math.sin((f + i * 9) / 14) * 2}>
              <Phone />
            </Stick>
          ) : null;
        })}
        {FRONT.map((x, i) => {
          const s = pop(CROWD0 + i * CROWD_GAP * 2);
          return s > 0 ? (
            <Stick key={`f${i}`} x={x} y={TOP_G} s={0.62 * s} flip armR={[40, 170]} armL={[-18, -8]} bob={Math.sin((f + i * 7) / 12) * 2}>
              <Phone />
            </Stick>
          ) : null;
        })}
        <Stick x={SELLER_X} y={TOP_G} armR={sellerArmR} armL={sellerArmL} lean={f >= SHRUG ? 3 : 0} />
        <Ground y={TOP_G} progress={groundIn} />

        {/* ---- BOTTOM PANEL ---- */}
        <g transform={`translate(0,${BOT_G})`}><Jar coins={sales} /></g>
        {FRIEND_X.map((_, i) => (
          <Stick key={i} x={friendX(i)} y={BOT_G} s={0.82} flip armR={f >= COIN0 + i * COIN_GAP - 6 && f < COIN0 + i * COIN_GAP + 10 ? [-100, -60] : [18, 8]} armL={cheer > 0 ? [-150 * cheer, -165 * cheer] : [-18, -8]} bob={landed[i] ? Math.sin((f - COIN0) / 6) * 0 : 0} />
        ))}
        {coins}
        <Stick x={SELLER_X} y={BOT_G} armR={cheer > 0 ? [150 * cheer, 165 * cheer] : [20, 10]} armL={cheer > 0 ? [-150 * cheer, -165 * cheer] : [-18, -8]} bob={sellerBob} />
        <Ground y={BOT_G} progress={groundIn} />
      </svg>

      {/* panel labels */}
      <div style={{ position: "absolute", top: TOP_G + 18, left: 78, fontFamily: SERIF, fontSize: 38, color: C.ink, opacity: labelsIn }}>
        Thousands <i>watching</i>
      </div>
      <div style={{ position: "absolute", top: BOT_G + 18, left: 78, fontFamily: SERIF, fontSize: 38, color: C.ink, opacity: labelsIn }}>
        A few who <i>actually buy</i>
      </div>
      <BrandFooter opacity={labelsIn} />
    </Paper>
  );
};
