import React from "react";
import { AbsoluteFill, Audio, interpolate, staticFile, useCurrentFrame, Easing } from "remotion";
import { BrandFooter, C, Ground, InkDefs, Paper, SERIF, Stick } from "../kit/kit";

// 60fps timeline (frames)
export const REVIEWS_FRAMES = 660;
const ENTER = 50; // first customer walks in
const ARRIVE = 120;
const BUY = 125; // first customer cheers, coin in the jar
const B_ENTER = 150; // top: the friend walks in
const WHISPER = 255; // top: the whisper bubble
const STAR0 = 180; // bottom: first star pops
const STAR_GAP = 15;
const QUEUE0 = 250; // bottom: queue starts forming
const OUTRO = 470; // title swap
const UNDERLINE = 510;

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const W = 1080;
const TOP_G = 640;
const BOT_G = 1110;
const SHOP_X = 250;
const A_X = 430;
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

const starPath = (r: number) => {
  const pts = Array.from({ length: 10 }, (_, i) => {
    const a = (Math.PI / 5) * i - Math.PI / 2;
    const rr = i % 2 === 0 ? r : r * 0.45;
    return `${Math.cos(a) * rr},${Math.sin(a) * rr}`;
  });
  return `M${pts.join(" L")} Z`;
};

const Star: React.FC<{ x: number; y: number; s: number }> = ({ x, y, s }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <path d={starPath(26)} fill={COIN} stroke={C.ink} strokeWidth={3} strokeLinejoin="round" filter="url(#rough)" />
  </g>
);

export const Reviews: React.FC = () => {
  const f = useCurrentFrame();

  // ---------- titles ----------
  const t1Reveal = interpolate(f, [6, 40], [0, 100], { ...clamp, easing: Easing.out(Easing.cubic) });
  const t1Out = interpolate(f, [OUTRO, OUTRO + 14], [1, 0], clamp);
  const t2Reveal = interpolate(f, [OUTRO + 10, OUTRO + 40], [0, 100], { ...clamp, easing: Easing.out(Easing.cubic) });
  const underline = interpolate(f, [UNDERLINE, UNDERLINE + 32], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const labelsIn = interpolate(f, [30, 55], [0, 1], clamp);
  const groundIn = interpolate(f, [20, 60], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });

  const walkLeg = (xNow: number, xPrev: number) => {
    const moving = Math.abs(xNow - xPrev) > 0.3;
    const sw = moving ? Math.sin(f / 3.2) * 26 : 0;
    return { legL: [-12 + sw, 0] as [number, number], legR: [12 - sw, 0] as [number, number] };
  };
  const hop = (k: number, t0: number) => (f > t0 ? -Math.abs(Math.sin((f - t0) / 6)) * 9 * k : 0);
  const ease = Easing.out(Easing.quad);

  // first customer (A) arrives and buys, in both panels
  const aIn = (t: number) => interpolate(t, [ENTER, ARRIVE], [1180, A_X], { ...clamp, easing: ease });
  const aCheer = interpolate(f, [BUY, BUY + 12], [0, 1], clamp);

  const coinDur = 26;
  const coinAt = (starts: number[], froms: number[], g: number) =>
    starts.map((s, i) => {
      const a = (f - s) / coinDur;
      if (a < 0 || a > 1) return null;
      const x = froms[i] + (JAR_X - froms[i]) * a;
      const y = g - 190 - 90 * 4 * a * (1 - a) + 110 * a;
      return <circle key={i} cx={x} cy={y} r={9} fill={COIN} stroke={C.ink} strokeWidth={2.5} filter="url(#rough)" />;
    });

  // ---------- top: one whisper ----------
  const aTopX = (t: number) =>
    t < 190 ? aIn(t) : interpolate(t, [190, 250], [A_X, 590], { ...clamp, easing: Easing.inOut(Easing.quad) }) +
      interpolate(t, [340, 460], [0, 700], { ...clamp, easing: Easing.in(Easing.quad) });
  const bTopX = (t: number) =>
    t < 340
      ? interpolate(t, [B_ENTER, 230], [1180, 700], { ...clamp, easing: ease })
      : interpolate(t, [340, 420], [700, 340], { ...clamp, easing: Easing.inOut(Easing.quad) });
  const ax = aTopX(f);
  const bx = bTopX(f);
  const aFacing = f < 190 || f > 340; // flip = facing left
  const bubble = interpolate(f, [WHISPER, WHISPER + 12, WHISPER + 70, WHISPER + 82], [0, 1, 1, 0], clamp);
  const topCoinStarts = [BUY + 10, 430];
  const topCoins = topCoinStarts.filter((s) => f >= s + coinDur).length;
  const topShopHappy = interpolate(f, [BUY + 36, BUY + 48], [0, 1], clamp) * (1 - interpolate(f, [BUY + 90, BUY + 100], [0, 1], clamp));
  const topShop2 = interpolate(f, [456, 468], [0, 1], clamp);

  // ---------- bottom: many reviews ----------
  const stars = Array.from({ length: 5 }, (_, i) => interpolate(f, [STAR0 + i * STAR_GAP, STAR0 + i * STAR_GAP + 14], [0, 1], { ...clamp, easing: Easing.out(Easing.back(2.5)) }));
  const qFinal = [540, 640, 740, 840];
  const qX = (k: number, t: number) => interpolate(t, [QUEUE0 + 18 * k, QUEUE0 + 18 * k + 90], [1200 + 30 * k, qFinal[k]], { ...clamp, easing: ease });
  const qCoinStarts = [350, 372, 394, 416];
  const botCoinStarts = [BUY + 10, ...qCoinStarts];
  const botCoinFrom = [A_X, ...qFinal];
  const botCoins = botCoinStarts.filter((s) => f >= s + coinDur).length;
  const botShopHappy = interpolate(f, [340, 352], [0, 1], clamp);

  return (
    <Paper>
      <Audio src={staticFile("sfx/reviews.wav")} />
      {/* titles */}
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 92 }}>
        <div style={{ position: "absolute", top: 96, fontFamily: SERIF, fontSize: 78, color: C.ink, letterSpacing: -1.5, opacity: t1Out, clipPath: `inset(0 ${100 - t1Reveal}% 0 0)` }}>
          Why do reviews matter?
        </div>
        <div style={{ position: "absolute", top: 58, textAlign: "center", fontFamily: SERIF, color: C.ink, clipPath: `inset(0 ${100 - t2Reveal}% 0 0)` }}>
          <div style={{ fontSize: 60, letterSpacing: -1 }}>Reviews are word of mouth,</div>
          <div style={{ fontSize: 84, fontStyle: "italic", letterSpacing: -1.5, lineHeight: 1 }}>at scale.</div>
        </div>
      </AbsoluteFill>

      <svg width={W} height={1350} style={{ position: "absolute", inset: 0 }}>
        <InkDefs />
        {/* red underline for the punchline */}
        <path d="M385,226 C480,238 600,220 700,230" stroke={C.red} strokeWidth={6} fill="none" strokeLinecap="round" filter="url(#rough)" strokeDasharray={460} strokeDashoffset={(1 - underline) * 460} />

        {/* ---- TOP PANEL ---- */}
        <Sign x={110} y={TOP_G - 190} />
        <Stick x={SHOP_X} y={TOP_G + hop(Math.max(topShopHappy, topShop2), f < 300 ? BUY + 36 : 456)} armR={[20, 10]} armL={topShopHappy + topShop2 > 0 ? [-150 * Math.max(topShopHappy, topShop2) - 18, -165 * Math.max(topShopHappy, topShop2) - 8] : [-20, -10]} />
        <Stick
          x={bx} y={TOP_G} flip
          armL={f > WHISPER && f < WHISPER + 82 ? [-40, -60] : [-18, -8]}
          {...walkLeg(bx, bTopX(f - 1))}
        />
        <Stick
          x={ax} y={TOP_G + hop(aCheer * (f < 190 ? 1 : 0), BUY)} flip={aFacing}
          armL={f < 190 ? [-18 - 150 * aCheer, -8 - 165 * aCheer] : [-18, -8]}
          armR={f >= 190 && f < 340 ? [60, 85] : [18, 8]}
          {...walkLeg(ax, aTopX(f - 1))}
        />
        {bubble > 0 ? (
          <g transform={`translate(${(ax + bx) / 2},${TOP_G - 232}) scale(${bubble})`} filter="url(#rough)">
            <path d="M-52,-26 Q-52,-40 -36,-40 L36,-40 Q52,-40 52,-26 L52,0 Q52,14 36,14 L10,14 L-6,34 L-8,14 L-36,14 Q-52,14 -52,0 Z" fill={C.paper} stroke={C.ink} strokeWidth={3.5} strokeLinejoin="round" />
            <text x={0} y={-8} textAnchor="middle" fontFamily={SERIF} fontStyle="italic" fontSize={32} fill={C.ink}>psst…</text>
          </g>
        ) : null}
        {coinAt(topCoinStarts, [A_X, 340], TOP_G)}
        <Jar x={JAR_X} y={TOP_G} coins={topCoins} />
        <Ground y={TOP_G} progress={groundIn} />

        {/* ---- BOTTOM PANEL ---- */}
        <Sign x={110} y={BOT_G - 190} />
        {stars.map((s, i) => (s > 0 ? <Star key={i} x={330 + i * 62} y={BOT_G - 320} s={s} /> : null))}
        <Stick
          x={SHOP_X} y={BOT_G + hop(botShopHappy, 340)}
          armR={[20, 10]}
          armL={botShopHappy > 0 ? [-150 * botShopHappy - 18, -165 * botShopHappy - 8] : [-20, -10]}
        />
        {[3, 2, 1, 0].map((k) => {
          const x = qX(k, f);
          const cheerK = interpolate(f, [qCoinStarts[k], qCoinStarts[k] + 12], [0, 1], clamp);
          return (
            <Stick
              key={k}
              x={x} y={BOT_G + hop(cheerK, qCoinStarts[k])} flip
              armL={[-18 - 140 * cheerK, -8 - 150 * cheerK]} armR={[18, 8]}
              {...walkLeg(x, qX(k, f - 1))}
            />
          );
        })}
        <Stick
          x={aIn(f)} y={BOT_G + hop(aCheer, BUY)} flip
          armL={[-18 - 150 * aCheer, -8 - 165 * aCheer]} armR={[18 + 150 * aCheer, 8 + 165 * aCheer]}
          {...walkLeg(aIn(f), aIn(f - 1))}
        />
        {coinAt(botCoinStarts, botCoinFrom, BOT_G)}
        <Jar x={JAR_X} y={BOT_G} coins={botCoins} />
        <Ground y={BOT_G} progress={groundIn} />
      </svg>

      {/* panel labels */}
      <div style={{ position: "absolute", top: TOP_G + 18, left: 78, fontFamily: SERIF, fontSize: 38, color: C.ink, opacity: labelsIn }}>
        A whisper reaches <i>one person</i>
      </div>
      <div style={{ position: "absolute", top: BOT_G + 18, left: 78, fontFamily: SERIF, fontSize: 38, color: C.ink, opacity: labelsIn }}>
        Five stars reach <i>a whole queue</i>
      </div>
      <BrandFooter opacity={labelsIn} />
    </Paper>
  );
};
