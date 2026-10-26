import React from "react";
import { AbsoluteFill, Audio, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import { BrandFooter, C, Ground, InkDefs, Paper, SERIF, Stick } from "../kit/kit";

// 60fps timeline (frames)
export const OWNEDAUDIENCE_FRAMES = 660;
const FALL = 250; // rented stage gives way
const ENV0 = 100; // first email sent
const ENV_GAP = 44;
const ENVS = 3;
const OUTRO = 470; // title swap
const UNDERLINE = 510;

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const W = 1080;
const TOP_G = 640;
const BOT_G = 1110;
const FIG_X = 300;
const HOUSE_X = 640;
const JAR_X = 950;
const COIN = "#E8B64C";
const WOOD = "#8A6E4B";

const Jar: React.FC<{ x: number; y: number; coins: number }> = ({ x, y, coins }) => (
  <g transform={`translate(${x},${y})`} filter="url(#rough)" stroke={C.ink} strokeWidth={3.5} strokeLinejoin="round">
    {Array.from({ length: Math.min(coins, 12) }, (_, i) => (
      <circle key={i} cx={-20 + (i % 3) * 20} cy={-14 - Math.floor(i / 3) * 16} r={9} fill={COIN} strokeWidth={2.5} />
    ))}
    <path d="M-38,-98 L-34,0 L34,0 L38,-98" fill={C.waterLight} fillOpacity={0.25} />
    <path d="M-42,-98 L42,-98" fill="none" />
  </g>
);

const Envelope: React.FC<{ x: number; y: number; r?: number; o?: number }> = ({ x, y, r = 0, o = 1 }) => (
  <g transform={`translate(${x},${y}) rotate(${r})`} opacity={o} filter="url(#rough)" stroke={C.ink} strokeWidth={3} strokeLinejoin="round" strokeLinecap="round">
    <rect x={-20} y={-14} width={40} height={28} rx={3} fill={C.paper} />
    <path d="M-20,-14 L0,3 L20,-14" fill="none" />
  </g>
);

export const OwnedAudience: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ---------- titles ----------
  const t1Reveal = interpolate(f, [6, 40], [0, 100], { ...clamp, easing: Easing.out(Easing.cubic) });
  const t1Out = interpolate(f, [OUTRO, OUTRO + 14], [1, 0], clamp);
  const t2Reveal = interpolate(f, [OUTRO + 10, OUTRO + 40], [0, 100], { ...clamp, easing: Easing.out(Easing.cubic) });
  const underline = interpolate(f, [UNDERLINE, UNDERLINE + 32], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const labelsIn = interpolate(f, [30, 55], [0, 1], clamp);
  const groundIn = interpolate(f, [20, 60], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });

  // ---------- top: rented stage ----------
  const crowdIn = spring({ frame: f - 40, fps, config: { damping: 12 } });
  const drop = Easing.in(Easing.quad)(interpolate(f, [FALL, FALL + 26], [0, 1], clamp));
  const stageTilt = drop * 18;
  const stageY = drop * 14;
  const stageFade = interpolate(f, [FALL + 22, FALL + 56], [1, 0], clamp);
  const figFall = interpolate(f, [FALL + 4, FALL + 22], [0, 1], clamp);
  const figY = TOP_G - 34 + 34 * figFall;
  const oops = interpolate(f, [FALL + 8, FALL + 24], [0, 1], clamp);
  const sit = f > FALL + 40 ? Math.sin((f - FALL) / 8) * 4 : 0;
  const goneIn = interpolate(f, [FALL + 70, FALL + 88, OUTRO - 14, OUTRO], [0, 1, 1, 0], clamp);
  const fans = [660, 760, 860].map((x0, i) => {
    const leave = interpolate(f, [FALL + 14 + i * 8, FALL + 100 + i * 8], [0, 1], { ...clamp, easing: Easing.inOut(Easing.quad) });
    const walk = leave > 0 && leave < 1 ? Math.sin((f - FALL) / 4 + i) * 14 : 0;
    return { x: x0 + leave * 420, walk, leave, i };
  });

  // ---------- bottom: the house with lights on ----------
  const houseIn = interpolate(f, [50, 90], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const envNodes: React.ReactNode[] = [];
  let sendArm = 0;
  let landed = 0;
  const coinNodes: React.ReactNode[] = [];
  let paid = 0;
  for (let k = 0; k < ENVS; k++) {
    const t0 = ENV0 + k * ENV_GAP;
    const a = f - t0;
    if (a >= -4 && a <= 12) sendArm = Math.max(sendArm, interpolate(a, [-4, 2, 8, 12], [0, 1, 1, 0], clamp));
    const ea = (f - (t0 + 2)) / 30;
    if (ea >= 1) landed++;
    if (ea >= 0 && ea < 1) {
      envNodes.push(<Envelope key={k} x={FIG_X + 74 + (HOUSE_X - 30 - FIG_X - 74) * ea} y={BOT_G - 150 - 70 * 4 * ea * (1 - ea) + 20 * ea} r={-14 + 28 * ea} />);
    }
    const ca = (f - (t0 + 34)) / 34;
    if (ca >= 1) paid++;
    if (ca >= 0 && ca < 1) {
      const sx = HOUSE_X + 130;
      const sy = BOT_G - 110;
      coinNodes.push(<circle key={k} cx={sx + (JAR_X - 10 - sx) * ca} cy={sy - 70 * 4 * ca * (1 - ca) + (BOT_G - 70 - sy) * ca * ca} r={9} fill={COIN} stroke={C.ink} strokeWidth={2.5} filter="url(#rough)" />);
    }
  }
  const windowGlow = 0.85 + 0.15 * Math.sin(f / 16);
  const cheer = interpolate(f, [ENV0 + 2 * ENV_GAP + 70, ENV0 + 2 * ENV_GAP + 82], [0, 1], clamp);
  const pulse = landed > 0 ? interpolate(f - (ENV0 + (landed - 1) * ENV_GAP + 32), [0, 5, 14], [1.06, 1.02, 1], clamp) : 1;

  return (
    <Paper>
      <Audio src={staticFile("sfx/owned_audience.wav")} />
      {/* titles */}
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 92 }}>
        <div style={{ position: "absolute", top: 96, fontFamily: SERIF, fontSize: 78, color: C.ink, letterSpacing: -1.5, opacity: t1Out, clipPath: `inset(0 ${100 - t1Reveal}% 0 0)` }}>
          Whose stage are you on?
        </div>
        <div style={{ position: "absolute", top: 58, textAlign: "center", fontFamily: SERIF, color: C.ink, clipPath: `inset(0 ${100 - t2Reveal}% 0 0)` }}>
          <div style={{ fontSize: 60, letterSpacing: -1 }}>Social reach is rented.</div>
          <div style={{ fontSize: 84, fontStyle: "italic", letterSpacing: -1.5, lineHeight: 1 }}>Your list is yours.</div>
        </div>
      </AbsoluteFill>

      <svg width={W} height={1350} style={{ position: "absolute", inset: 0 }}>
        <InkDefs />
        {/* red underline for the punchline */}
        <path d="M330,226 C450,236 620,220 760,230" stroke={C.red} strokeWidth={6} fill="none" strokeLinecap="round" filter="url(#rough)" strokeDasharray={460} strokeDashoffset={(1 - underline) * 460} />

        {/* ---- TOP PANEL: rented stage ---- */}
        <g transform={`translate(${FIG_X},${TOP_G + stageY}) rotate(${stageTilt},-130,0)`} filter="url(#rough)" stroke={C.ink} strokeWidth={4} strokeLinejoin="round" strokeLinecap="round" opacity={groundIn * stageFade}>
          <rect x={-150} y={-34} width={300} height={24} fill={WOOD} fillOpacity={0.55} />
          <path d="M-120,-10 L-120,0 M120,-10 L120,0" fill="none" />
        </g>
        <Stick
          x={FIG_X} y={figY}
          armR={oops > 0 ? [-125 * oops, -150 * oops] : [20 + 20 * Math.sin(f / 14), 10]}
          armL={oops > 0 ? [125 * oops, 150 * oops] : [-20, -10]}
          bob={sit}
        />
        {fans.map((fa) => (
          <g key={fa.i} opacity={crowdIn}>
            <Stick x={fa.x} y={TOP_G - 6 * (1 - crowdIn) + (fa.walk ? -Math.abs(fa.walk) * 0.3 : 0)} s={0.7} flip={fa.leave === 0} armL={[-20, -10]} armR={fa.leave === 0 ? [30 + 10 * Math.sin(f / 9 + fa.i), 30] : [20, 10]} legL={fa.leave > 0 && fa.leave < 1 ? [-12 + fa.walk, -8] : [-12, -8]} legR={fa.leave > 0 && fa.leave < 1 ? [12 - fa.walk, 8] : [12, 8]} />
          </g>
        ))}
        {goneIn > 0 ? (
          <text x={FIG_X + 10} y={TOP_G - 232} textAnchor="middle" fontFamily={SERIF} fontStyle="italic" fontSize={46} fill={C.ink} opacity={goneIn}>stage gone…</text>
        ) : null}
        <Ground y={TOP_G} progress={groundIn} />

        {/* ---- BOTTOM PANEL: the house ---- */}
        <g opacity={houseIn} transform={`translate(${HOUSE_X},${BOT_G}) scale(${pulse})`} filter="url(#rough)" stroke={C.ink} strokeWidth={4} strokeLinejoin="round" strokeLinecap="round">
          <rect x={-130} y={-190} width={260} height={190} fill={C.paper} />
          <path d="M-160,-190 L0,-300 L160,-190 Z" fill={C.waterLight} fillOpacity={0.35} />
          <rect x={-100} y={-150} width={74} height={74} fill={COIN} fillOpacity={windowGlow * 0.7} />
          <path d="M-63,-150 L-63,-76 M-100,-113 L-26,-113" fill="none" strokeWidth={3} />
          <rect x={30} y={-120} width={64} height={120} rx={4} fill={C.paper} />
          <circle cx={80} cy={-60} r={4} fill={C.ink} />
        </g>
        {envNodes}
        {coinNodes}
        <Stick
          x={FIG_X} y={BOT_G}
          armR={sendArm > 0 ? [20 + 80 * sendArm, 10 + 80 * sendArm] : cheer > 0 ? [18 + 105 * cheer, 8 + 140 * cheer] : [20, 10]}
          armL={cheer > 0 ? [-18 - 105 * cheer, -8 - 140 * cheer] : [-20, -10]}
          lean={sendArm * 4}
          bob={cheer > 0 ? -Math.abs(Math.sin((f - ENV0 - 2 * ENV_GAP - 70) / 5)) * 10 * cheer : 0}
        />
        <Jar x={JAR_X} y={BOT_G} coins={paid} />
        <Ground y={BOT_G} progress={groundIn} />
      </svg>

      {/* panel labels */}
      <div style={{ position: "absolute", top: TOP_G + 18, left: 78, fontFamily: SERIF, fontSize: 38, color: C.ink, opacity: labelsIn }}>
        Social: a stage <i>someone else owns</i>
      </div>
      <div style={{ position: "absolute", top: BOT_G + 18, left: 78, fontFamily: SERIF, fontSize: 38, color: C.ink, opacity: labelsIn }}>
        Email list: a house <i>you own</i>
      </div>
      <BrandFooter opacity={labelsIn} />
    </Paper>
  );
};
