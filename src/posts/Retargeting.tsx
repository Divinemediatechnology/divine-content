import React from "react";
import { AbsoluteFill, Audio, interpolate, staticFile, useCurrentFrame, Easing } from "remotion";
import { BrandFooter, C, Ground, InkDefs, Paper, SERIF, Stick } from "../kit/kit";

// 60fps timeline (frames)
export const RETARGETING_FRAMES = 660;
const ENTER = 50; // visitor walks in
const LOOK = 125; // visitor reaches the shop and looks
const LEAVE = 150; // visitor turns away
const WAVE = 215; // bottom: owner waves
const TURN = 245; // bottom: visitor turns back
const BACK = 330; // bottom: visitor is back at the shop
const COIN0 = 340; // bottom: coin flies to the jar
const OUTRO = 470; // title swap
const UNDERLINE = 510;

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const W = 1080;
const TOP_G = 640;
const BOT_G = 1110;
const SHOP_X = 250;
const STOP_X = 470;
const JAR_X = 960;
const COIN = "#E8B64C";

const Sign: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g transform={`translate(${x},${y})`} stroke={C.ink} strokeWidth={4} strokeLinejoin="round" strokeLinecap="round" filter="url(#rough)">
    <path d="M0,0 L0,150" fill="none" />
    <path d="M-62,-36 L62,-36 L62,14 L-62,14 Z" fill={C.paper} />
    <text x={0} y={0} textAnchor="middle" fontFamily={SERIF} fontSize={36} fill={C.ink} stroke="none" letterSpacing={2}>SHOP</text>
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

const Bubble: React.FC<{ x: number; y: number; k: number; w: number; text: string }> = ({ x, y, k, w, text }) => (
  <g transform={`translate(${x},${y}) scale(${k})`} filter="url(#rough)">
    <path
      d={`M${-w / 2},-26 Q${-w / 2},-42 ${-w / 2 + 16},-42 L${w / 2 - 16},-42 Q${w / 2},-42 ${w / 2},-26 L${w / 2},0 Q${w / 2},16 ${w / 2 - 16},16 L${-w / 2 + 60},16 L${-w / 2 + 30},38 L${-w / 2 + 34},16 L${-w / 2 + 16},16 Q${-w / 2},16 ${-w / 2},0 Z`}
      fill={C.paper} stroke={C.ink} strokeWidth={3.5} strokeLinejoin="round"
    />
    <text x={0} y={-7} textAnchor="middle" fontFamily={SERIF} fontStyle="italic" fontSize={32} fill={C.ink}>{text}</text>
  </g>
);

export const Retargeting: React.FC = () => {
  const f = useCurrentFrame();

  // ---------- titles ----------
  const t1Reveal = interpolate(f, [6, 40], [0, 100], { ...clamp, easing: Easing.out(Easing.cubic) });
  const t1Out = interpolate(f, [OUTRO, OUTRO + 14], [1, 0], clamp);
  const t2Reveal = interpolate(f, [OUTRO + 10, OUTRO + 40], [0, 100], { ...clamp, easing: Easing.out(Easing.cubic) });
  const underline = interpolate(f, [UNDERLINE, UNDERLINE + 32], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const labelsIn = interpolate(f, [30, 55], [0, 1], clamp);
  const groundIn = interpolate(f, [20, 60], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });

  const ease = Easing.out(Easing.quad);
  const walkLeg = (xNow: number, xPrev: number) => {
    const moving = Math.abs(xNow - xPrev) > 0.3;
    const sw = moving ? Math.sin(f / 3.2) * 26 : 0;
    return { legL: [-12 + sw, 0] as [number, number], legR: [12 - sw, 0] as [number, number] };
  };
  const hop = (k: number, t0: number) => (f > t0 ? -Math.abs(Math.sin((f - t0) / 6)) * 9 * k : 0);

  // ---------- top: the visitor leaves and is forgotten ----------
  const topX = (t: number) =>
    t < LEAVE
      ? interpolate(t, [ENTER, LOOK], [1180, STOP_X], { ...clamp, easing: ease })
      : interpolate(t, [LEAVE, 310], [STOP_X, 1260], { ...clamp, easing: Easing.in(Easing.quad) });
  const tx = topX(f);
  const lookUp = interpolate(f, [LOOK, LOOK + 10, LEAVE - 6, LEAVE], [0, 1, 1, 0], clamp);
  const scratch = f > 330 && f < OUTRO ? Math.sin((f - 330) / 3.2) * 12 : 0;
  const dots = interpolate(f, [320, 332], [0, 1], clamp) * (1 - interpolate(f, [OUTRO - 14, OUTRO], [0, 1], clamp));

  // ---------- bottom: a friendly wave brings them back ----------
  const botX = (t: number) => {
    if (t < LEAVE) return interpolate(t, [ENTER, LOOK], [1180, STOP_X], { ...clamp, easing: ease });
    if (t < TURN) return interpolate(t, [LEAVE, WAVE], [STOP_X, 700], { ...clamp, easing: Easing.inOut(Easing.quad) });
    return interpolate(t, [TURN, BACK], [700, STOP_X + 30], { ...clamp, easing: Easing.inOut(Easing.quad) });
  };
  const bx = botX(f);
  const botFlip = f < LEAVE || f >= TURN;
  const wave = interpolate(f, [WAVE - 4, WAVE + 6, 300, 312], [0, 1, 1, 0], clamp);
  const waveSwing = Math.sin((f - WAVE) / 4) * 14;
  const bubble = interpolate(f, [WAVE + 4, WAVE + 16, 300, 312], [0, 1, 1, 0], clamp);
  const cheer = interpolate(f, [COIN0 - 4, COIN0 + 8], [0, 1], clamp);
  const ownerCheer = interpolate(f, [COIN0 + 30, COIN0 + 42], [0, 1], clamp);
  const coinDur = 26;
  const ca = (f - COIN0) / coinDur;
  const coin = ca >= 0 && ca <= 1
    ? <circle cx={STOP_X + 30 + (JAR_X - STOP_X - 30) * ca} cy={BOT_G - 190 - 90 * 4 * ca * (1 - ca) + 110 * ca} r={9} fill={COIN} stroke={C.ink} strokeWidth={2.5} filter="url(#rough)" />
    : null;
  const botCoins = f >= COIN0 + coinDur ? 1 : 0;

  return (
    <Paper>
      <Audio src={staticFile("sfx/retargeting.wav")} />
      {/* titles */}
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 92 }}>
        <div style={{ position: "absolute", top: 96, fontFamily: SERIF, fontSize: 78, color: C.ink, letterSpacing: -1.5, opacity: t1Out, clipPath: `inset(0 ${100 - t1Reveal}% 0 0)` }}>
          Visitors leave. Now what?
        </div>
        <div style={{ position: "absolute", top: 58, textAlign: "center", fontFamily: SERIF, color: C.ink, clipPath: `inset(0 ${100 - t2Reveal}% 0 0)` }}>
          <div style={{ fontSize: 60, letterSpacing: -1 }}>Retargeting is just</div>
          <div style={{ fontSize: 84, fontStyle: "italic", letterSpacing: -1.5, lineHeight: 1 }}>a friendly wave.</div>
        </div>
      </AbsoluteFill>

      <svg width={W} height={1350} style={{ position: "absolute", inset: 0 }}>
        <InkDefs />
        {/* red underline for the punchline */}
        <path d="M300,226 C420,238 620,220 780,230" stroke={C.red} strokeWidth={6} fill="none" strokeLinecap="round" filter="url(#rough)" strokeDasharray={520} strokeDashoffset={(1 - underline) * 520} />

        {/* ---- TOP PANEL ---- */}
        <Sign x={110} y={TOP_G - 190} />
        <Stick
          x={SHOP_X} y={TOP_G}
          armL={[-20, -10]}
          armR={scratch !== 0 ? [165, 215 + scratch] : f > LOOK + 6 && f < LEAVE ? [110, 95] : [20, 10]}
        />
        <Stick
          x={tx} y={TOP_G} flip={f < LEAVE}
          armL={lookUp > 0 ? [-18 - 20 * lookUp, -8] : [-18, -8]}
          {...walkLeg(tx, topX(f - 1))}
        />
        {dots > 0 ? <Bubble x={SHOP_X + 60} y={TOP_G - 232} k={dots} w={90} text="…" /> : null}
        <Jar x={JAR_X} y={TOP_G} coins={0} />
        <Ground y={TOP_G} progress={groundIn} />

        {/* ---- BOTTOM PANEL ---- */}
        <Sign x={110} y={BOT_G - 190} />
        <Stick
          x={SHOP_X} y={BOT_G + hop(ownerCheer, COIN0 + 30)}
          armL={ownerCheer > 0 ? [-150 * ownerCheer - 18, -165 * ownerCheer - 8] : [-20, -10]}
          armR={ownerCheer > 0 ? [18 + 150 * ownerCheer, 8 + 165 * ownerCheer] : wave > 0 ? [20 + (135 + waveSwing * 0.3) * wave, 10 + (165 + waveSwing) * wave] : [20, 10]}
        />
        <Stick
          x={bx} y={BOT_G + hop(cheer, COIN0)} flip={botFlip}
          armL={[-18 - 150 * cheer, -8 - 165 * cheer]} armR={[18 + 150 * cheer, 8 + 165 * cheer]}
          {...walkLeg(bx, botX(f - 1))}
        />
        {bubble > 0 ? <Bubble x={SHOP_X + 190} y={BOT_G - 250} k={bubble} w={320} text="Forgot something?" /> : null}
        {coin}
        <Jar x={JAR_X} y={BOT_G} coins={botCoins} />
        <Ground y={BOT_G} progress={groundIn} />
      </svg>

      {/* panel labels */}
      <div style={{ position: "absolute", top: TOP_G + 18, left: 78, fontFamily: SERIF, fontSize: 38, color: C.ink, opacity: labelsIn }}>
        One visit, then <i>forgotten</i>
      </div>
      <div style={{ position: "absolute", top: BOT_G + 18, left: 78, fontFamily: SERIF, fontSize: 38, color: C.ink, opacity: labelsIn }}>
        A gentle wave brings <i>them back</i>
      </div>
      <BrandFooter opacity={labelsIn} />
    </Paper>
  );
};
