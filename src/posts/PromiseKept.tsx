import React from "react";
import { AbsoluteFill, Audio, interpolate, staticFile, useCurrentFrame, Easing } from "remotion";
import { BrandFooter, C, Ground, InkDefs, Paper, SERIF, Stick, handPos } from "../kit/kit";

// 60fps timeline (frames)
export const PROMISEKEPT_FRAMES = 690;
const ENTER = 70; // customer starts walking in
const ARRIVE = 160;
const OFFER = 170; // shopkeeper holds out the plate
const REACT = 225; // customer reacts
const LEAVE = 290; // top customer walks away
const FRIENDS = 300; // bottom: friends arrive
const OUTRO = 500; // title swap
const UNDERLINE = 540;

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const W = 1080;
const TOP_G = 640;
const BOT_G = 1110;
const SHOP_X = 250;
const JAR_X = 850;
const COIN = "#E8B64C";

const Sign: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g transform={`translate(${x},${y})`} stroke={C.ink} strokeWidth={4} strokeLinejoin="round" strokeLinecap="round" filter="url(#rough)">
    <path d="M0,0 L0,150" fill="none" />
    <path d="M-62,-36 L62,-36 L62,14 L-62,14 Z" fill={C.paper} />
    <text x={0} y={0} textAnchor="middle" fontFamily={SERIF} fontSize={36} fill={C.ink} stroke="none" letterSpacing={2}>CAKE</text>
  </g>
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

const Cake: React.FC<{ s: number }> = ({ s }) => (
  <g transform={`scale(${s})`} stroke={C.ink} strokeWidth={3.5} strokeLinejoin="round" strokeLinecap="round" filter="url(#rough)">
    <path d="M-30,0 L30,0 L30,-30 L-30,-30 Z" fill={C.waterLight} />
    <path d="M-30,-30 Q-15,-44 0,-30 Q15,-44 30,-30" fill="none" />
    <path d="M-22,-30 L22,-30 L22,-52 L-22,-52 Z" fill={C.paper} />
    <path d="M0,-52 L0,-64" fill="none" />
    <circle cx={0} cy={-70} r={6} fill={C.red} strokeWidth={2.5} />
  </g>
);

const Crumb: React.FC = () => (
  <g fill={C.dead} stroke={C.ink} strokeWidth={2}>
    <circle cx={-6} cy={-3} r={3} />
    <circle cx={3} cy={-4} r={2.4} />
    <circle cx={8} cy={-2} r={1.8} />
  </g>
);

const Plate: React.FC<{ x: number; y: number; children?: React.ReactNode }> = ({ x, y, children }) => (
  <g transform={`translate(${x},${y})`}>
    {children}
    <path d="M-34,0 Q0,12 34,0" stroke={C.ink} strokeWidth={4} fill={C.paper} strokeLinecap="round" filter="url(#rough)" />
  </g>
);

const Question: React.FC<{ x: number; y: number; o: number }> = ({ x, y, o }) => (
  <text x={x} y={y} textAnchor="middle" fontFamily={SERIF} fontStyle="italic" fontSize={64} fill={C.ink} opacity={o}>?</text>
);

export const PromiseKept: React.FC = () => {
  const f = useCurrentFrame();

  // ---------- titles ----------
  const t1Reveal = interpolate(f, [6, 40], [0, 100], { ...clamp, easing: Easing.out(Easing.cubic) });
  const t1Out = interpolate(f, [OUTRO, OUTRO + 14], [1, 0], clamp);
  const t2Reveal = interpolate(f, [OUTRO + 10, OUTRO + 40], [0, 100], { ...clamp, easing: Easing.out(Easing.cubic) });
  const underline = interpolate(f, [UNDERLINE, UNDERLINE + 32], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const labelsIn = interpolate(f, [30, 55], [0, 1], clamp);
  const groundIn = interpolate(f, [20, 60], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });

  // ---------- shared shopkeeper offer ----------
  const reach = interpolate(f, [OFFER - 8, OFFER + 14], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const offerArm: [number, number] = [20 + 50 * reach, 10 + 70 * reach];
  const hand = handPos(offerArm);
  const plateX = SHOP_X + hand[0];
  const itemIn = interpolate(f, [OFFER + 6, OFFER + 22], [0, 1], { ...clamp, easing: Easing.out(Easing.back(2.2)) });
  const walkLeg = (xNow: number, xPrev: number) => {
    const moving = Math.abs(xNow - xPrev) > 0.3;
    const sw = moving ? Math.sin(f / 3.2) * 26 : 0;
    return { legL: [-12 + sw, 0] as [number, number], legR: [12 - sw, 0] as [number, number] };
  };

  // ---------- top: crumb ----------
  const topX = (t: number) =>
    t < LEAVE
      ? interpolate(t, [ENTER, ARRIVE], [1180, 430], { ...clamp, easing: Easing.out(Easing.quad) })
      : interpolate(t, [LEAVE, LEAVE + 120], [430, 1220], { ...clamp, easing: Easing.in(Easing.quad) });
  const tx = topX(f);
  const shrug = interpolate(f, [REACT, REACT + 14], [0, 1], clamp) * (f < LEAVE ? 1 : interpolate(f, [LEAVE, LEAVE + 14], [1, 0], clamp));
  const topFlip = f < LEAVE;
  const qOpacity = interpolate(f, [REACT + 6, REACT + 18, LEAVE - 10, LEAVE], [0, 1, 1, 0], clamp);
  const sad = interpolate(f, [REACT + 30, REACT + 55], [0, 1], clamp);

  // ---------- bottom: the cake ----------
  const cheer = interpolate(f, [REACT, REACT + 12], [0, 1], clamp);
  const bx0 = interpolate(f, [ENTER, ARRIVE], [1180, 430], { ...clamp, easing: Easing.out(Easing.quad) });
  const bx1 = interpolate(f, [FRIENDS, FRIENDS + 80], [1220, 545], { ...clamp, easing: Easing.out(Easing.quad) });
  const bx2 = interpolate(f, [FRIENDS + 18, FRIENDS + 100], [1250, 660], { ...clamp, easing: Easing.out(Easing.quad) });
  const coinStarts = [REACT + 22, FRIENDS + 110, FRIENDS + 128];
  const coinFrom = [430, 545, 660];
  const coinDur = 26;
  const jarCoins = coinStarts.filter((s) => f >= s + coinDur).length;
  const flying = coinStarts.map((s, i) => {
    const a = (f - s) / coinDur;
    if (a < 0 || a > 1) return null;
    const x = coinFrom[i] + (JAR_X - coinFrom[i]) * a;
    const y = BOT_G - 190 - 90 * 4 * a * (1 - a) + 110 * a;
    return <circle key={i} cx={x} cy={y} r={9} fill={COIN} stroke={C.ink} strokeWidth={2.5} filter="url(#rough)" />;
  });
  const spark = (a: number, r1: number, r2: number) => {
    const rad = (a * Math.PI) / 180;
    return <path key={a} d={`M${Math.cos(rad) * r1},${Math.sin(rad) * r1} L${Math.cos(rad) * r2},${Math.sin(rad) * r2}`} />;
  };
  const sparkS = 0.8 + 0.2 * Math.sin(f / 5);
  const hop = (k: number, t0: number) => (f > t0 ? -Math.abs(Math.sin((f - t0) / 6)) * 9 * k : 0);
  const friendCheer = interpolate(f, [FRIENDS + 90, FRIENDS + 104], [0, 1], clamp);
  const shopHappy = interpolate(f, [FRIENDS + 100, FRIENDS + 114], [0, 1], clamp);

  return (
    <Paper>
      <Audio src={staticFile("sfx/promise-kept.wav")} />
      {/* titles */}
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 92 }}>
        <div style={{ position: "absolute", top: 96, fontFamily: SERIF, fontSize: 78, color: C.ink, letterSpacing: -1.5, opacity: t1Out, clipPath: `inset(0 ${100 - t1Reveal}% 0 0)` }}>
          A brand is a promise.
        </div>
        <div style={{ position: "absolute", top: 58, textAlign: "center", fontFamily: SERIF, color: C.ink, clipPath: `inset(0 ${100 - t2Reveal}% 0 0)` }}>
          <div style={{ fontSize: 60, letterSpacing: -1 }}>Keep the promise,</div>
          <div style={{ fontSize: 84, fontStyle: "italic", letterSpacing: -1.5, lineHeight: 1 }}>they bring friends.</div>
        </div>
      </AbsoluteFill>

      <svg width={W} height={1350} style={{ position: "absolute", inset: 0 }}>
        <InkDefs />
        {/* red underline for the punchline */}
        <path d="M250,226 C420,238 660,220 850,230" stroke={C.red} strokeWidth={6} fill="none" strokeLinecap="round" filter="url(#rough)" strokeDasharray={700} strokeDashoffset={(1 - underline) * 700} />

        {/* ---- TOP PANEL ---- */}
        <Sign x={110} y={TOP_G - 190} />
        <Stick
          x={SHOP_X} y={TOP_G}
          armR={offerArm}
          armL={[-20 - 60 * sad, -10 - 70 * sad]}
          lean={6 * sad}
        />
        <Plate x={plateX} y={TOP_G + hand[1]}>
          <g transform={`scale(${itemIn})`}><Crumb /></g>
        </Plate>
        <Stick
          x={tx} y={TOP_G} flip={topFlip}
          armL={[-30 - 70 * shrug, -10 - 80 * shrug]}
          armR={[30 + 70 * shrug, 10 + 80 * shrug]}
          {...walkLeg(tx, topX(f - 1))}
        />
        <Question x={tx} y={TOP_G - 232} o={qOpacity} />
        <Jar x={JAR_X} y={TOP_G} coins={0} />
        <Ground y={TOP_G} progress={groundIn} />

        {/* ---- BOTTOM PANEL ---- */}
        <Sign x={110} y={BOT_G - 190} />
        <Stick
          x={SHOP_X} y={BOT_G + hop(shopHappy, FRIENDS + 100)}
          armR={shopHappy > 0 ? [offerArm[0] - 30 * shopHappy, offerArm[1] - 30 * shopHappy] : offerArm}
          armL={shopHappy > 0 ? [-150 * shopHappy - 18, -165 * shopHappy - 8] : [-20, -10]}
        />
        <Plate x={plateX} y={BOT_G + hand[1]}>
          <g transform={`scale(${itemIn})`}><Cake s={1} /></g>
        </Plate>
        <Stick
          x={bx2} y={BOT_G + hop(friendCheer, FRIENDS + 90)} flip
          armL={[-18 - 140 * friendCheer, -8 - 150 * friendCheer]} armR={[18, 8]}
          {...walkLeg(bx2, interpolate(f - 1, [FRIENDS + 18, FRIENDS + 100], [1250, 660], { ...clamp, easing: Easing.out(Easing.quad) }))}
        />
        <Stick
          x={bx1} y={BOT_G + hop(friendCheer, FRIENDS + 92)} flip
          armL={[-18 - 140 * friendCheer, -8 - 150 * friendCheer]} armR={[18, 8]}
          {...walkLeg(bx1, interpolate(f - 1, [FRIENDS, FRIENDS + 80], [1220, 545], { ...clamp, easing: Easing.out(Easing.quad) }))}
        />
        <Stick
          x={bx0} y={BOT_G + hop(cheer, REACT)} flip
          armL={[-18 - 150 * cheer, -8 - 165 * cheer]} armR={[18 + 150 * cheer, 8 + 165 * cheer]}
          {...walkLeg(bx0, interpolate(f - 1, [ENTER, ARRIVE], [1180, 430], { ...clamp, easing: Easing.out(Easing.quad) }))}
        />
        {cheer > 0 ? (
          <g transform={`translate(${bx0 + 70},${BOT_G - 250}) scale(${sparkS})`} stroke={C.ink} strokeWidth={3.5} strokeLinecap="round" fill="none" filter="url(#rough)" opacity={cheer}>
            {[-70, -20, 30].map((a) => spark(a, 14, 32))}
          </g>
        ) : null}
        {flying}
        <Jar x={JAR_X} y={BOT_G} coins={jarCoins} />
        <Ground y={BOT_G} progress={groundIn} />
      </svg>

      {/* panel labels */}
      <div style={{ position: "absolute", top: TOP_G + 18, left: 78, fontFamily: SERIF, fontSize: 38, color: C.ink, opacity: labelsIn }}>
        Promise cake, <i>serve a crumb</i>
      </div>
      <div style={{ position: "absolute", top: BOT_G + 18, left: 78, fontFamily: SERIF, fontSize: 38, color: C.ink, opacity: labelsIn }}>
        Promise cake, <i>serve the cake</i>
      </div>
      <BrandFooter opacity={labelsIn} />
    </Paper>
  );
};
