import React from "react";
import { AbsoluteFill, Audio, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import { BrandFooter, C, Ground, InkDefs, Paper, SERIF, Stick } from "../kit/kit";

// 60fps timeline (frames)
export const RENTORPLANT_FRAMES = 660;
const M0 = 90; // month counter starts
const M_GAP = 30; // frames per "month"
const THROW0 = 96; // first coin thrown at the meter
const THROW_GAP = 22;
const THROWS = 7; // coins paid in
const OFF = 96 + 6 * 22 + 40; // lamp goes dark after the last coin runs out
const SEED = 84; // bottom: seed planted
const GROW0 = 110;
const GROW1 = 430;
const OUTRO = 470; // title swap
const UNDERLINE = 510;

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const W = 1080;
const TOP_G = 640;
const BOT_G = 1110;
const FIG_X = 300;
const LAMP_X = 620;
const TREE_X = 640;
const JAR_X = 950;
const COIN = "#E8B64C";
const TRUNK = "#8A6E4B";

const Jar: React.FC<{ x: number; y: number; coins: number }> = ({ x, y, coins }) => (
  <g transform={`translate(${x},${y})`} filter="url(#rough)" stroke={C.ink} strokeWidth={3.5} strokeLinejoin="round">
    {Array.from({ length: Math.min(coins, 12) }, (_, i) => (
      <circle key={i} cx={-20 + (i % 3) * 20} cy={-14 - Math.floor(i / 3) * 16} r={9} fill={COIN} strokeWidth={2.5} />
    ))}
    <path d="M-38,-98 L-34,0 L34,0 L38,-98" fill={C.waterLight} fillOpacity={0.25} />
    <path d="M-42,-98 L42,-98" fill="none" />
  </g>
);

export const RentOrPlant: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ---------- titles ----------
  const t1Reveal = interpolate(f, [6, 40], [0, 100], { ...clamp, easing: Easing.out(Easing.cubic) });
  const t1Out = interpolate(f, [OUTRO, OUTRO + 14], [1, 0], clamp);
  const t2Reveal = interpolate(f, [OUTRO + 10, OUTRO + 40], [0, 100], { ...clamp, easing: Easing.out(Easing.cubic) });
  const underline = interpolate(f, [UNDERLINE, UNDERLINE + 32], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const labelsIn = interpolate(f, [30, 55], [0, 1], clamp);
  const groundIn = interpolate(f, [20, 60], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });

  const month = Math.max(1, Math.min(12, 1 + Math.floor((f - M0) / M_GAP)));
  const monthOpacity = interpolate(f, [M0 - 10, M0, OUTRO, OUTRO + 12], [0, 1, 1, 0], clamp);
  const lastTick = f >= M0 ? Math.min(11, Math.floor((f - M0) / M_GAP)) : -1;
  const monthPop = lastTick >= 0 ? interpolate(f - (M0 + lastTick * M_GAP), [0, 4, 10], [1.18, 1.05, 1], clamp) : 1;

  // ---------- top: rented lamp ----------
  let throwArm = 0;
  for (let k = 0; k < THROWS; k++) {
    const a = f - (THROW0 + k * THROW_GAP);
    if (a >= -4 && a <= 12) throwArm = Math.max(throwArm, interpolate(a, [-4, 2, 8, 12], [0, 1, 1, 0], clamp));
  }
  const coinsFlying: React.ReactNode[] = [];
  let paid = 0;
  for (let k = 0; k < THROWS; k++) {
    const ca = (f - (THROW0 + k * THROW_GAP + 2)) / 24;
    if (ca >= 1) paid++;
    if (ca < 0 || ca > 1) continue;
    coinsFlying.push(
      <circle key={k} cx={FIG_X + 74 + (LAMP_X - 14 - FIG_X - 74) * ca} cy={TOP_G - 146 - 90 * 4 * ca * (1 - ca) + 86 * ca} r={9} fill={COIN} stroke={C.ink} strokeWidth={2.5} filter="url(#rough)" />,
    );
  }
  const lampOn = interpolate(f, [THROW0 + 20, THROW0 + 28, OFF, OFF + 14], [0, 1, 1, 0], clamp);
  const flicker = f > OFF - 40 && f < OFF ? 0.7 + 0.3 * Math.abs(Math.sin(f / 2.2)) : 1;
  const glow = lampOn * flicker;
  const broke = interpolate(f, [OFF + 4, OFF + 22], [0, 1], clamp);
  const shrug = f > OFF + 22 ? Math.sin((f - OFF) / 9) * 6 : 0;
  const meter = Math.max(0, 1 - paid / THROWS) * (f > THROW0 ? 1 : 0);
  const qIn = interpolate(f, [OFF + 30, OFF + 44, OUTRO - 14, OUTRO], [0, 1, 1, 0], clamp);

  // ---------- bottom: planted tree ----------
  const seedPop = spring({ frame: f - SEED, fps, config: { damping: 10 } });
  const plant = interpolate(f, [SEED - 8, SEED - 2, SEED + 14, SEED + 24], [0, 1, 1, 0], clamp);
  const grow = Easing.inOut(Easing.quad)(interpolate(f, [GROW0, GROW1], [0, 1], clamp));
  const trunkH = 16 + 190 * grow;
  const canopy = interpolate(f, [GROW0 + 40, GROW1], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const sway = Math.sin(f / 22) * 3 * canopy;
  const topY = BOT_G - trunkH;
  const fruitAt = [GROW1 + 24, GROW1 + 42, GROW1 + 60];
  const fruits = [
    { dx: -46, dy: -28 },
    { dx: 40, dy: -6 },
    { dx: -4, dy: -76 },
  ];
  const coinsDone = fruitAt.map((t) => {
    const a = (f - (t + 36)) / 30;
    return a;
  });
  const botCoins = coinsDone.filter((a) => a >= 1).length;
  const cheer = interpolate(f, [GROW1 + 20, GROW1 + 32], [0, 1], clamp);

  const fruitNodes = fruits.map((fr, i) => {
    const born = spring({ frame: f - (GROW1 - 20 + i * 18), fps, config: { damping: 9 } });
    const a = coinsDone[i];
    if (born <= 0.02 || a >= 1) return null;
    const sx = TREE_X + sway + fr.dx;
    const sy = topY - 40 * canopy + fr.dy;
    const fall = a > 0 ? a : 0;
    const x = sx + (JAR_X - 10 - sx) * fall;
    const y = sy + (BOT_G - 70 - sy) * fall * fall - 60 * 4 * fall * (1 - fall) * 0.3;
    return <circle key={i} cx={x} cy={y} r={9 * born} fill={COIN} stroke={C.ink} strokeWidth={2.5} filter="url(#rough)" />;
  });

  return (
    <Paper>
      <Audio src={staticFile("sfx/rent_or_plant.wav")} />
      {/* titles */}
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 92 }}>
        <div style={{ position: "absolute", top: 96, fontFamily: SERIF, fontSize: 78, color: C.ink, letterSpacing: -1.5, opacity: t1Out, clipPath: `inset(0 ${100 - t1Reveal}% 0 0)` }}>
          Rent it, or plant it?
        </div>
        <div style={{ position: "absolute", top: 58, textAlign: "center", fontFamily: SERIF, color: C.ink, clipPath: `inset(0 ${100 - t2Reveal}% 0 0)` }}>
          <div style={{ fontSize: 60, letterSpacing: -1 }}>Ads rent attention.</div>
          <div style={{ fontSize: 84, fontStyle: "italic", letterSpacing: -1.5, lineHeight: 1 }}>SEO plants it.</div>
        </div>
      </AbsoluteFill>
      <div style={{ position: "absolute", top: 268, right: 76, fontFamily: SERIF, fontStyle: "italic", fontSize: 44, color: C.red, opacity: monthOpacity, transform: `scale(${monthPop})`, transformOrigin: "right center" }}>
        Month {month}
      </div>

      <svg width={W} height={1350} style={{ position: "absolute", inset: 0 }}>
        <InkDefs />
        {/* red underline for the punchline */}
        <path d="M330,226 C450,236 620,220 760,230" stroke={C.red} strokeWidth={6} fill="none" strokeLinecap="round" filter="url(#rough)" strokeDasharray={460} strokeDashoffset={(1 - underline) * 460} />

        {/* ---- TOP PANEL: rented lamp ---- */}
        {glow > 0.01 ? (
          <g opacity={glow}>
            <circle cx={LAMP_X} cy={TOP_G - 330} r={150} fill={COIN} opacity={0.22} />
            <circle cx={LAMP_X} cy={TOP_G - 330} r={95} fill={COIN} opacity={0.3} />
            {[-70, -35, 0, 35, 70].map((a) => (
              <path key={a} d={`M${LAMP_X + Math.sin((a * Math.PI) / 180) * 70},${TOP_G - 330 + Math.cos((a * Math.PI) / 180) * 70} L${LAMP_X + Math.sin((a * Math.PI) / 180) * 120},${TOP_G - 330 + Math.cos((a * Math.PI) / 180) * 120}`} stroke={COIN} strokeWidth={5} strokeLinecap="round" filter="url(#rough)" />
            ))}
          </g>
        ) : null}
        <g filter="url(#rough)" stroke={C.ink} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round">
          {/* pole */}
          <path d={`M${LAMP_X},${TOP_G - 76} L${LAMP_X},${TOP_G - 300}`} fill="none" />
          {/* lamp head */}
          <path d={`M${LAMP_X - 44},${TOP_G - 300} Q${LAMP_X - 44},${TOP_G - 372} ${LAMP_X},${TOP_G - 372} Q${LAMP_X + 44},${TOP_G - 372} ${LAMP_X + 44},${TOP_G - 300} Z`} fill={glow > 0.05 ? COIN : C.paper} fillOpacity={glow > 0.05 ? 0.5 + 0.5 * glow : 1} />
          {/* coin meter box */}
          <rect x={LAMP_X - 38} y={TOP_G - 76} width={76} height={76} rx={6} fill={C.paper} />
          <path d={`M${LAMP_X - 14},${TOP_G - 60} L${LAMP_X + 14},${TOP_G - 60}`} strokeWidth={6} fill="none" />
          <rect x={LAMP_X - 24} y={TOP_G - 40} width={48} height={14} rx={3} fill={C.paper} strokeWidth={3} />
          <rect x={LAMP_X - 22} y={TOP_G - 38} width={44 * meter} height={10} rx={2} fill={C.water} stroke="none" />
        </g>
        <Stick
          x={FIG_X} y={TOP_G}
          armR={broke > 0 ? [-50 - shrug, 40 + shrug] : throwArm > 0 ? [20 + 80 * throwArm, 10 + 80 * throwArm] : [20, 10]}
          armL={broke > 0 ? [50 + 30 * broke + shrug, -50 - 10 * broke] : [-20, -10]}
          lean={throwArm * 4}
        />
        {qIn > 0 ? (
          <text x={FIG_X + 6} y={TOP_G - 232} textAnchor="middle" fontFamily={SERIF} fontStyle="italic" fontSize={46} fill={C.ink} opacity={qIn}>no coins…</text>
        ) : null}
        {coinsFlying}
        <Ground y={TOP_G} progress={groundIn} />

        {/* ---- BOTTOM PANEL: planted tree ---- */}
        {/* seed + sprout */}
        {f >= SEED && grow < 0.02 ? <ellipse cx={TREE_X} cy={BOT_G - 4} rx={9 * seedPop} ry={6 * seedPop} fill={TRUNK} stroke={C.ink} strokeWidth={2.5} filter="url(#rough)" /> : null}
        <g filter="url(#rough)" stroke={C.ink} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round">
          {f >= GROW0 - 6 ? (
            <path d={`M${TREE_X - 10},${BOT_G} Q${TREE_X - 6},${BOT_G - trunkH * 0.5} ${TREE_X + sway * 0.4 - 4},${topY} L${TREE_X + sway * 0.4 + 4},${topY} Q${TREE_X + 6},${BOT_G - trunkH * 0.5} ${TREE_X + 10},${BOT_G} Z`} fill={TRUNK} />
          ) : null}
          {canopy > 0.02 ? (
            <g transform={`translate(${TREE_X + sway},${topY - 30 * canopy}) scale(${canopy})`}>
              <circle cx={-52} cy={6} r={64} fill={C.leaf} />
              <circle cx={56} cy={10} r={58} fill={C.leaf} />
              <circle cx={0} cy={-46} r={72} fill={C.leaf} />
              <path d="M-34,-4 Q-10,-24 14,-4" fill="none" stroke={C.paper} strokeWidth={3} opacity={0.5} />
            </g>
          ) : null}
        </g>
        {f > SEED - 10 && f < GROW0 + 30 ? (
          /* tiny sprout leaves */
          <path d={`M${TREE_X},${BOT_G - 16 - trunkH * 0.5} q-14,-12 -26,-4 q12,10 26,4 z M${TREE_X},${BOT_G - 16 - trunkH * 0.5} q14,-12 26,-4 q-12,10 -26,4 z`} fill={C.leaf} stroke={C.ink} strokeWidth={2.2} filter="url(#rough)" opacity={interpolate(f, [GROW0 - 6, GROW0 + 8], [0, 1], clamp)} />
        ) : null}
        {fruitNodes}
        <Stick
          x={FIG_X} y={BOT_G}
          armR={plant > 0 ? [20 + 60 * plant, 10 + 70 * plant] : cheer > 0 ? [18 + 150 * cheer, 8 + 165 * cheer] : [20, 10]}
          armL={cheer > 0 ? [-18 - 150 * cheer, -8 - 165 * cheer] : [-20, -10]}
          lean={plant * 6}
          bob={cheer > 0 ? -Math.abs(Math.sin((f - GROW1 - 20) / 5)) * 10 * cheer : 0}
        />
        <Jar x={JAR_X} y={BOT_G} coins={botCoins} />
        <Ground y={BOT_G} progress={groundIn} />
      </svg>

      {/* panel labels */}
      <div style={{ position: "absolute", top: TOP_G + 18, left: 78, fontFamily: SERIF, fontSize: 38, color: C.ink, opacity: labelsIn }}>
        Ads: lit while you <i>keep paying</i>
      </div>
      <div style={{ position: "absolute", top: BOT_G + 18, left: 78, fontFamily: SERIF, fontSize: 38, color: C.ink, opacity: labelsIn }}>
        SEO: a tree that <i>keeps growing</i>
      </div>
      <BrandFooter opacity={labelsIn} />
    </Paper>
  );
};
