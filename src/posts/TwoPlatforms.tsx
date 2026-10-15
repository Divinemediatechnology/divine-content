import React from "react";
import { AbsoluteFill, Audio, interpolate, random, staticFile, useCurrentFrame, Easing } from "remotion";
import { BrandFooter, C, Ground, InkDefs, Paper, SERIF, Stick } from "../kit/kit";

// 60fps timeline (frames)
export const TWOPLATFORMS_FRAMES = 600;
const DROP = 210; // first ball falls (top)
const STEP = 5; // frames between each ball dropping
const SHRUG = 300;
const OUTRO = 430; // title swap
const UNDERLINE = 470;
const BALLS = 8;

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const W = 1080;
const TOP_G = 640;
const BOT_G = 1110;
const FIG_X = 540;
const R = 20;
const HAND_DX = 57;
const HAND_DY = 170;

type Cfg = { l: number; r: number; h: number; t: number; ph: number; w: number };

const cfgTop = (i: number): Cfg => ({
  l: -(60 + random(`tl${i}`) * 55),
  r: 60 + random(`tr${i}`) * 55,
  h: 105 + random(`th${i}`) * 75,
  t: 24 + random(`tt${i}`) * 12,
  ph: random(`tp${i}`) * 2,
  w: random(`tw${i}`) * 6,
});
const cfgBot = (i: number): Cfg => ({ l: -HAND_DX, r: HAND_DX, h: 125, t: 40, ph: i, w: 0 });

/** Ball position while juggling (absolute svg coords). */
function juggle(c: Cfg, f: number, g: number, wobble: number): [number, number] {
  const u = (((f / c.t + c.ph) % 2) + 2) % 2;
  const seg = u < 1 ? u : u - 1;
  const x = u < 1 ? c.l + (c.r - c.l) * seg : c.r - (c.r - c.l) * seg;
  const y = -HAND_DY - c.h * 4 * seg * (1 - seg);
  return [FIG_X + x + Math.sin(f / 5 + c.w) * wobble, g + y];
}

/** A dropped ball: gravity, a couple of bounces, then it rolls to a stop. */
function fall(x0: number, y0: number, vx0: number, vy0: number, age: number, g: number): [number, number] {
  let x = x0, y = y0, vx = vx0, vy = vy0;
  const gy = g - R;
  for (let k = 0; k < age; k++) {
    vy += 0.8;
    y += vy;
    x += vx;
    if (y >= gy) {
      y = gy;
      if (Math.abs(vy) > 3) vy = -vy * 0.45;
      else vy = 0;
      vx *= 0.93;
    }
  }
  return [x, y];
}

const Ball: React.FC<{ x: number; y: number; fill: string; spin?: number }> = ({ x, y, fill, spin = 0 }) => (
  <g transform={`translate(${x},${y}) rotate(${spin})`} filter="url(#rough)" stroke={C.ink} strokeWidth={3.5}>
    <circle r={R} fill={fill} />
    <path d="M-14,-9 Q0,-2 14,-9" fill="none" strokeWidth={2.2} />
  </g>
);

const fills = [C.paper, C.waterLight, C.paper, C.water, C.paper, C.waterLight, C.paper, C.water];

export const TwoPlatforms: React.FC = () => {
  const f = useCurrentFrame();

  // ---------- titles ----------
  const t1Reveal = interpolate(f, [6, 40], [0, 100], { ...clamp, easing: Easing.out(Easing.cubic) });
  const t1Out = interpolate(f, [OUTRO, OUTRO + 14], [1, 0], clamp);
  const t2Reveal = interpolate(f, [OUTRO + 10, OUTRO + 40], [0, 100], { ...clamp, easing: Easing.out(Easing.cubic) });
  const underline = interpolate(f, [UNDERLINE, UNDERLINE + 32], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const labelsIn = interpolate(f, [30, 55], [0, 1], clamp);
  const groundIn = interpolate(f, [20, 60], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const ballsIn = interpolate(f, [50, 80], [0, 1], clamp);

  // ---------- top: eight balls ----------
  const wobble = interpolate(f, [90, DROP], [0, 14], clamp);
  const topCfg = Array.from({ length: BALLS }, (_, i) => cfgTop(i));
  const topBalls = topCfg.map((c, i) => {
    const di = DROP + i * STEP;
    if (f < di) {
      const [x, y] = juggle(c, f, TOP_G, wobble);
      return <Ball key={i} x={x} y={y - (1 - ballsIn) * 40} fill={fills[i]} spin={f * 3} />;
    }
    const [px, py] = juggle(c, di, TOP_G, wobble);
    const [qx] = juggle(c, di - 1, TOP_G, wobble);
    const sx = (random(`sx${i}`) - 0.5) * 6;
    const [x, y] = fall(px, py, (px - qx) * 0.5 + sx, 0, f - di, TOP_G);
    return <Ball key={i} x={x} y={y} fill={fills[i]} spin={(f - di) * 4} />;
  });
  const dropped = f >= DROP + 2 * STEP;
  const shrug = f > SHRUG ? Math.min(1, (f - SHRUG) / 12) : 0;
  const shake = f > SHRUG + 30 && f < OUTRO ? Math.sin((f - SHRUG - 30) / 4) * 8 : 0;
  const topBob = Math.sin(f / 6) * 3;
  const topArmsBusy = !dropped;

  // ---------- bottom: two balls ----------
  const botBob = Math.sin(f / 8) * 2;
  const botBalls = [0, 1].map((i) => {
    const [x, y] = juggle(cfgBot(i), f, BOT_G, 0);
    return <Ball key={i} x={x} y={y - (1 - ballsIn) * 40} fill={i === 0 ? C.waterLight : C.paper} spin={f * 2} />;
  });
  const happy = f > SHRUG ? Math.min(1, (f - SHRUG) / 10) : 0;
  const spark = (a: number, r1: number, r2: number) => {
    const rad = (a * Math.PI) / 180;
    return <path key={a} d={`M${Math.cos(rad) * r1},${Math.sin(rad) * r1} L${Math.cos(rad) * r2},${Math.sin(rad) * r2}`} />;
  };
  const sparkS = 0.8 + 0.2 * Math.sin(f / 5);

  return (
    <Paper>
      <Audio src={staticFile("sfx/two-platforms.wav")} />
      {/* titles */}
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 92 }}>
        <div style={{ position: "absolute", top: 96, fontFamily: SERIF, fontSize: 78, color: C.ink, letterSpacing: -1.5, opacity: t1Out, clipPath: `inset(0 ${100 - t1Reveal}% 0 0)` }}>
          Be on every platform?
        </div>
        <div style={{ position: "absolute", top: 58, textAlign: "center", fontFamily: SERIF, color: C.ink, clipPath: `inset(0 ${100 - t2Reveal}% 0 0)` }}>
          <div style={{ fontSize: 60, letterSpacing: -1 }}>Two done well</div>
          <div style={{ fontSize: 84, fontStyle: "italic", letterSpacing: -1.5, lineHeight: 1 }}>beats eight done badly.</div>
        </div>
      </AbsoluteFill>

      <svg width={W} height={1350} style={{ position: "absolute", inset: 0 }}>
        <InkDefs />
        {/* red underline for the punchline */}
        <path d="M230,226 C400,238 640,220 860,230" stroke={C.red} strokeWidth={6} fill="none" strokeLinecap="round" filter="url(#rough)" strokeDasharray={700} strokeDashoffset={(1 - underline) * 700} />

        {/* ---- TOP PANEL ---- */}
        <Stick
          x={FIG_X} y={TOP_G + topBob * (topArmsBusy ? 1 : 0)}
          armL={topArmsBusy ? [-100 - Math.sin(f / 5) * 6, -140] : [-30 - 70 * shrug, -10 - 80 * shrug + shake]}
          armR={topArmsBusy ? [100 + Math.sin(f / 5 + 1) * 6, 140] : [30 + 70 * shrug, 10 + 80 * shrug - shake]}
          lean={topArmsBusy ? Math.sin(f / 9) * 3 : 0}
        />
        {topBalls}
        <Ground y={TOP_G} progress={groundIn} />

        {/* ---- BOTTOM PANEL ---- */}
        <Stick x={FIG_X} y={BOT_G} bob={botBob - happy * Math.abs(Math.sin((f - SHRUG) / 7)) * 8} armL={[-100, -140]} armR={[100, 140]} />
        {botBalls}
        {happy > 0 ? (
          <g transform={`translate(${FIG_X + 120},${BOT_G - 250}) scale(${sparkS})`} stroke={C.ink} strokeWidth={3.5} strokeLinecap="round" fill="none" filter="url(#rough)" opacity={happy}>
            {[-70, -20, 30].map((a) => spark(a, 14, 32))}
          </g>
        ) : null}
        {happy > 0 ? (
          <g transform={`translate(${FIG_X - 120},${BOT_G - 250}) scale(${sparkS})`} stroke={C.ink} strokeWidth={3.5} strokeLinecap="round" fill="none" filter="url(#rough)" opacity={happy}>
            {[-160, -110, 210].map((a) => spark(a, 14, 32))}
          </g>
        ) : null}
        <Ground y={BOT_G} progress={groundIn} />
      </svg>

      {/* panel labels */}
      <div style={{ position: "absolute", top: TOP_G + 18, left: 78, fontFamily: SERIF, fontSize: 38, color: C.ink, opacity: labelsIn }}>
        Eight platforms, <i>all at once</i>
      </div>
      <div style={{ position: "absolute", top: BOT_G + 18, left: 78, fontFamily: SERIF, fontSize: 38, color: C.ink, opacity: labelsIn }}>
        Two platforms, <i>done well</i>
      </div>
      <BrandFooter opacity={labelsIn} />
    </Paper>
  );
};
