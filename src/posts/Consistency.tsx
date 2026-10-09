import React from "react";
import { AbsoluteFill, Audio, interpolate, random, spring, staticFile, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import { BrandFooter, C, Ground, InkDefs, Paper, SERIF, Stick } from "../kit/kit";

// 60fps timeline (frames)
export const CONSISTENCY_FRAMES = 660;
const DAY0 = 90; // first watering tick
const DAY_GAP = 12; // frames per "day"
const DAYS = 30;
const POUR = 105; // big-bucket pour starts
const WILT = 190;
const OUTRO = 462; // title swap
const UNDERLINE = 505;

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const W = 1080;
const TOP_G = 640;
const BOT_G = 1110;
const PLANT_X = 320;
const FIG_X = 560;

const Plant: React.FC<{ x: number; y: number; h: number; wilt?: number; leaves: number[]; flower?: number }> = ({ x, y, h, wilt = 0, leaves, flower = 0 }) => {
  const p1: [number, number] = [wilt * h * 0.15, -0.7 * h * (1 - 0.3 * wilt)];
  const p2: [number, number] = [wilt * 0.8 * h, -h * (1 - 0.7 * wilt)];
  const at = (t: number): [number, number] => [2 * (1 - t) * t * p1[0] + t * t * p2[0], 2 * (1 - t) * t * p1[1] + t * t * p2[1]];
  const stem = interpolateColor(C.leaf, C.dead, wilt);
  return (
    <g transform={`translate(${x},${y})`} filter="url(#rough)">
      <path d={`M-38,2 Q0,-16 38,2`} fill="#CDBFA6" stroke={C.ink} strokeWidth={3} />
      {h > 1 ? <path d={`M0,0 Q${p1[0]},${p1[1]} ${p2[0]},${p2[1]}`} stroke={stem} strokeWidth={4.5} fill="none" strokeLinecap="round" /> : null}
      {leaves.map((s, i) => {
        if (s <= 0.01) return null;
        const t = (i + 1) / (leaves.length + 1.2);
        const [lx, ly] = at(t);
        const side = i % 2 === 0 ? 1 : -1;
        const rot = side === 1 ? -25 + wilt * 70 : 205 - wilt * 70;
        return (
          <path key={i} transform={`translate(${lx},${ly}) rotate(${rot}) scale(${s})`} d="M0,0 Q16,-15 36,-3 Q18,8 0,0 Z" fill={stem} stroke={C.ink} strokeWidth={2.5} />
        );
      })}
      {flower > 0.01 ? (
        <g transform={`translate(${p2[0]},${p2[1] - 6}) scale(${flower})`}>
          {[0, 72, 144, 216, 288].map((a) => (
            <ellipse key={a} cx={0} cy={-13} rx={9} ry={14} transform={`rotate(${a})`} fill={C.red} stroke={C.ink} strokeWidth={2.5} />
          ))}
          <circle r={7} fill="#E8B64C" stroke={C.ink} strokeWidth={2.5} />
        </g>
      ) : null}
    </g>
  );
};

function interpolateColor(a: string, b: string, t: number) {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  return `rgb(${pa.map((v, i) => Math.round(v + (pb[i] - v) * t)).join(",")})`;
}

const Bucket: React.FC<{ fill: number }> = ({ fill }) => (
  <g stroke={C.ink} strokeWidth={4} strokeLinejoin="round" filter="url(#rough)">
    <path d="M-55,28 Q0,-24 55,28" fill="none" />
    {fill > 0 ? <path d={`M${-55 + 10 * (1 - fill)},${28 + 100 * (1 - fill)} L${55 - 10 * (1 - fill)},${28 + 100 * (1 - fill)} L45,128 L-45,128 Z`} fill={C.water} stroke="none" /> : null}
    <path d="M-55,28 L55,28 L45,128 L-45,128 Z" fill="none" />
    <path d="M-50,48 L50,48" strokeWidth={2.5} fill="none" />
  </g>
);

const Can: React.FC = () => (
  <g stroke={C.ink} strokeWidth={4} strokeLinejoin="round" strokeLinecap="round" filter="url(#rough)">
    <path d="M-22,18 Q0,-12 22,18" fill="none" />
    <path d="M-30,18 L30,18 L28,62 L-28,62 Z" fill={C.waterLight} />
    <path d="M-28,32 L-72,6" fill="none" />
    <path d="M-80,0 L-68,14" fill="none" strokeWidth={6} />
  </g>
);

export const Consistency: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ---------- titles ----------
  const t1Reveal = interpolate(f, [6, 40], [0, 100], { ...clamp, easing: Easing.out(Easing.cubic) });
  const t1Out = interpolate(f, [OUTRO, OUTRO + 14], [1, 0], clamp);
  const t2Reveal = interpolate(f, [OUTRO + 10, OUTRO + 40], [0, 100], { ...clamp, easing: Easing.out(Easing.cubic) });
  const underline = interpolate(f, [UNDERLINE, UNDERLINE + 32], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const labelsIn = interpolate(f, [30, 55], [0, 1], clamp);
  const groundIn = interpolate(f, [20, 60], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });

  const day = Math.max(1, Math.min(DAYS, 1 + Math.floor((f - DAY0) / DAY_GAP)));
  const dayOpacity = interpolate(f, [DAY0 - 10, DAY0, OUTRO, OUTRO + 12], [0, 1, 1, 0], clamp);
  const lastTick = f >= DAY0 ? Math.min(DAYS - 1, Math.floor((f - DAY0) / DAY_GAP)) : -1;
  const dayPop = lastTick >= 0 ? interpolate(f - (DAY0 + lastTick * DAY_GAP), [0, 4, 10], [1.18, 1.05, 1], clamp) : 1;

  // ---------- top: one huge pour ----------
  const bucketRot = interpolate(f, [POUR - 10, POUR + 8, 158, 172], [0, -112, -112, -30], { ...clamp, easing: Easing.inOut(Easing.quad) });
  const bucketFill = interpolate(f, [POUR + 2, 155], [1, 0], clamp);
  const bucketDropped = f >= 172;
  const pourParticles = Array.from({ length: 46 }, (_, i) => {
    const born = POUR + 4 + i * 1.05;
    const age = f - born;
    if (age < 0) return null;
    const vx = -(9 + random(`vx${i}`) * 5);
    const vy = -1 + random(`vy${i}`) * 2;
    const x = 470 + random(`ox${i}`) * 14 + vx * age;
    const y = 482 + random(`oy${i}`) * 10 + vy * age + 0.5 * 0.95 * age * age;
    if (y > TOP_G - 4) return null;
    return <circle key={i} cx={x} cy={y} r={5 + random(`r${i}`) * 4} fill={C.water} />;
  });
  const puddle = interpolate(f, [POUR + 14, 150, 240, 330], [0, 1, 0.8, 0], clamp);
  const topH = interpolate(f, [POUR + 15, 150], [8, 100], { ...clamp, easing: Easing.out(Easing.back(2)) });
  const topWilt = interpolate(f, [WILT, WILT + 90], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const topLeaf = spring({ frame: f - (POUR + 25), fps, config: { damping: 12 } });
  const scratch = f > 300 && f < OUTRO ? Math.sin((f - 300) / 3.2) * 12 : 0;
  const topArmsUp = !bucketDropped;

  // ---------- bottom: a little every day ----------
  const ticksDone = f >= DAY0 ? Math.min(DAYS, 1 + Math.floor((f - DAY0) / DAY_GAP)) : 0;
  let canTilt = 0;
  for (let k = 0; k < DAYS; k++) {
    const a = f - (DAY0 + k * DAY_GAP);
    if (a >= -3 && a <= DAY_GAP) canTilt = Math.max(canTilt, interpolate(a, [-3, 1, 7, 11], [0, 1, 1, 0], clamp));
  }
  const drops: React.ReactNode[] = [];
  for (let k = 0; k < DAYS; k++) {
    for (let d = 0; d < 2; d++) {
      const age = f - (DAY0 + k * DAY_GAP + 1 + d * 3);
      if (age < 0 || age > 20) continue;
      const x = 422 - (7.2 + random(`b${k}${d}`)) * age;
      const y = 1036 + 0.9 * age * age * 0.5 + age * 0.5;
      if (y > BOT_G - 4) continue;
      drops.push(<ellipse key={`${k}-${d}`} cx={x} cy={y} rx={4} ry={6} fill={C.water} />);
    }
  }
  const growth = interpolate(f, [DAY0 + 8, DAY0 + DAYS * DAY_GAP], [0, 1], clamp);
  const botH = 14 + 250 * Easing.inOut(Easing.quad)(growth);
  const botLeaves = Array.from({ length: 9 }, (_, i) => spring({ frame: f - (DAY0 + (i * 3 + 2) * DAY_GAP + 6), fps, config: { damping: 11 } }));
  const flower = spring({ frame: f - (DAY0 + DAYS * DAY_GAP + 4), fps, config: { damping: 9 } });
  const cheer = f > DAY0 + DAYS * DAY_GAP + 6 ? Math.min(1, (f - (DAY0 + DAYS * DAY_GAP + 6)) / 10) : 0;

  return (
    <Paper>
      <Audio src={staticFile("sfx/consistency.wav")} />
      {/* titles */}
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 92 }}>
        <div style={{ position: "absolute", top: 96, fontFamily: SERIF, fontSize: 78, color: C.ink, letterSpacing: -1.5, opacity: t1Out, clipPath: `inset(0 ${100 - t1Reveal}% 0 0)` }}>
          Two ways to grow a brand.
        </div>
        <div style={{ position: "absolute", top: 58, textAlign: "center", fontFamily: SERIF, color: C.ink, clipPath: `inset(0 ${100 - t2Reveal}% 0 0)` }}>
          <div style={{ fontSize: 60, letterSpacing: -1 }}>Consistency</div>
          <div style={{ fontSize: 84, fontStyle: "italic", letterSpacing: -1.5, lineHeight: 1 }}>beats intensity.</div>
        </div>
      </AbsoluteFill>
      <div style={{ position: "absolute", top: 268, right: 76, fontFamily: SERIF, fontStyle: "italic", fontSize: 44, color: C.red, opacity: dayOpacity, transform: `scale(${dayPop})`, transformOrigin: "right center" }}>
        Day {day}
      </div>

      <svg width={W} height={1350} style={{ position: "absolute", inset: 0 }}>
        <InkDefs />
        {/* red underline for the punchline */}
        <path d="M330,226 C450,236 620,220 760,230" stroke={C.red} strokeWidth={6} fill="none" strokeLinecap="round" filter="url(#rough)" strokeDasharray={460} strokeDashoffset={(1 - underline) * 460} />

        {/* ---- TOP PANEL ---- */}
        <ellipse cx={PLANT_X + 10} cy={TOP_G + 2} rx={150 * puddle} ry={11 * puddle} fill={C.waterLight} opacity={0.85} />
        <Plant x={PLANT_X} y={TOP_G} h={topH} wilt={topWilt} leaves={[topLeaf * (f > POUR + 25 ? 1 : 0), topLeaf * (f > POUR + 32 ? 1 : 0)]} />
        {pourParticles}
        <Stick
          x={FIG_X} y={TOP_G} flip
          armR={topArmsUp ? [112, 96] : scratch !== 0 ? [165, 215 + scratch] : [18, 8]}
          armL={topArmsUp ? [100, 88] : [-18, -8]}
          lean={topArmsUp ? -4 : 0}
        />
        {!bucketDropped ? (
          <g transform={`translate(${FIG_X - 70},${TOP_G - 152}) rotate(${bucketRot})`}>
            <Bucket fill={bucketFill} />
          </g>
        ) : (
          <g transform={`translate(${FIG_X + 100},${TOP_G - 46}) rotate(-80)`}>
            <Bucket fill={0} />
          </g>
        )}
        <Ground y={TOP_G} progress={groundIn} />

        {/* ---- BOTTOM PANEL ---- */}
        <Plant x={PLANT_X} y={BOT_G} h={botH} leaves={botLeaves.map((s, i) => (ticksDone >= i * 3 + 3 ? s : 0))} flower={flower} />
        {drops}
        <Stick x={FIG_X} y={BOT_G} flip armR={[70, 80]} armL={cheer > 0 ? [-150 * cheer - 18, -165 * cheer - 8] : [-18, -8]} bob={cheer > 0 ? -Math.abs(Math.sin((f - 452) / 5)) * 10 * cheer : 0} />
        <g transform={`translate(${FIG_X - 67},${BOT_G - 120}) rotate(${-38 * canTilt})`}>
          <Can />
        </g>
        <Ground y={BOT_G} progress={groundIn} />
      </svg>

      {/* panel labels */}
      <div style={{ position: "absolute", top: TOP_G + 18, left: 78, fontFamily: SERIF, fontSize: 38, color: C.ink, opacity: labelsIn }}>
        Posting when you <i>feel like it</i>
      </div>
      <div style={{ position: "absolute", top: BOT_G + 18, left: 78, fontFamily: SERIF, fontSize: 38, color: C.ink, opacity: labelsIn }}>
        Posting a little, <i>every day</i>
      </div>
      <BrandFooter opacity={labelsIn} />
    </Paper>
  );
};
