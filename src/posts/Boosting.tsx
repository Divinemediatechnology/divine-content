import React from "react";
import { AbsoluteFill, Audio, interpolate, staticFile, useCurrentFrame, Easing } from "remotion";
import { BrandFooter, C, Ground, InkDefs, Paper, SERIF, Stick } from "../kit/kit";

// 60fps timeline (frames)
export const BOOSTING_FRAMES = 600;
const OUTRO = 430; // title swap
const UNDERLINE = 470;

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const W = 1080;
const TOP_G = 640;
const BOT_G = 1110;
const FIG_X = 330;
const TGT_X = 880;
const SPEED = 8.5;
const GRAV = 0.35;
const FLETCH = 66;

// top panel: blindfolded shots [frame, direction, aim degrees]
const SHOTS: [number, number, number][] = [
  [100, 1, 20],
  [145, -1, 12],
  [190, 1, 75],
  [235, 1, 5],
  [280, -1, 40],
  [325, 1, 30],
];
// bottom panel
const AIM_LINE = 120;
const PULL = 190;
const RELEASE = 250;
const BOT_SPEED = 26;
const HIT = RELEASE + Math.ceil((TGT_X - (FIG_X + 78)) / BOT_SPEED);

const deg = (r: number) => (r * 180) / Math.PI;

/** Ballistic arrow tip position at a given age (frames since release); sticks in the ground. */
function flight(g: number, shoulderY: number, dir: number, aim: number, age: number) {
  const a = (aim * Math.PI) / 180;
  const x0 = FIG_X + dir * 78 * Math.cos(a);
  const y0 = shoulderY - 78 * Math.sin(a);
  const vx = dir * SPEED * Math.cos(a);
  const vy = -SPEED * Math.sin(a);
  let last = { x: x0, y: y0, ang: deg(Math.atan2(vy, vx)), stuck: false };
  for (let t = 0; t <= Math.min(age, 220); t += 0.5) {
    const x = x0 + vx * t;
    const y = y0 + vy * t + 0.5 * GRAV * t * t;
    last = { x, y, ang: deg(Math.atan2(vy + GRAV * t, vx)), stuck: false };
    if (y >= g) {
      return { x, y: g, ang: last.ang, stuck: true };
    }
    if (x < -120 || x > W + 120) return { ...last, gone: true } as typeof last & { gone: boolean };
  }
  return last;
}

const Arrow: React.FC<{ x: number; y: number; ang: number }> = ({ x, y, ang }) => (
  <g transform={`translate(${x},${y}) rotate(${ang})`} stroke={C.ink} strokeWidth={3.6} strokeLinecap="round" strokeLinejoin="round" fill="none" filter="url(#rough)">
    <path d={`M0,0 L${-FLETCH},0`} />
    <path d="M0,0 L-13,-7 M0,0 L-13,7" />
    <path d={`M${-FLETCH},0 L${-FLETCH - 11},-7 M${-FLETCH},0 L${-FLETCH - 11},7 M${-FLETCH + 9},0 L${-FLETCH - 2},-7 M${-FLETCH + 9},0 L${-FLETCH - 2},7`} />
  </g>
);

const Target: React.FC<{ x: number; y: number; wobble?: number }> = ({ x, y, wobble = 0 }) => (
  <g filter="url(#rough)" stroke={C.ink} strokeWidth={4} strokeLinecap="round">
    <path d={`M${x},${y + 70} L${x},${y + 138}`} fill="none" />
    <g transform={`rotate(${wobble},${x},${y + 70})`}>
      <circle cx={x} cy={y} r={72} fill={C.paper} />
      <circle cx={x} cy={y} r={50} fill="none" />
      <circle cx={x} cy={y} r={28} fill="none" />
      <circle cx={x} cy={y} r={11} fill={C.red} />
    </g>
  </g>
);

const Bow: React.FC<{ pull: number }> = ({ pull }) => {
  const nockX = 70 - 30 * pull;
  return (
    <g stroke={C.ink} strokeWidth={4.2} strokeLinecap="round" fill="none" filter="url(#rough)">
      <path d="M70,-62 Q122,0 70,62" />
      <path d={`M70,-62 L${nockX},0 L70,62`} strokeWidth={2.4} />
    </g>
  );
};

export const Boosting: React.FC = () => {
  const f = useCurrentFrame();

  // ---------- titles ----------
  const t1Reveal = interpolate(f, [6, 40], [0, 100], { ...clamp, easing: Easing.out(Easing.cubic) });
  const t1Out = interpolate(f, [OUTRO, OUTRO + 14], [1, 0], clamp);
  const t2Reveal = interpolate(f, [OUTRO + 10, OUTRO + 40], [0, 100], { ...clamp, easing: Easing.out(Easing.cubic) });
  const underline = interpolate(f, [UNDERLINE, UNDERLINE + 32], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const labelsIn = interpolate(f, [30, 55], [0, 1], clamp);
  const groundIn = interpolate(f, [20, 60], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const targetIn = interpolate(f, [40, 70], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.6)) });

  // ---------- top: blindfolded boosting ----------
  const TS = TOP_G - 138;
  let idx = SHOTS.findIndex((s) => f < s[0] + 12);
  if (idx < 0) idx = SHOTS.length - 1;
  const [sFrame, sDir, sAim] = SHOTS[idx];
  const prev = idx > 0 ? SHOTS[idx - 1] : ([0, 1, 0] as [number, number, number]);
  const aimNow = interpolate(f, [sFrame - 32, sFrame - 14], [prev[2], sAim], { ...clamp, easing: Easing.inOut(Easing.quad) });
  const dirNow = f >= sFrame - 32 ? sDir : prev[1];
  const pullTop = f < sFrame ? interpolate(f, [sFrame - 20, sFrame - 2], [0, 1], clamp) : interpolate(f, [sFrame, sFrame + 6], [1, 0], clamp);
  const lastShot = SHOTS[SHOTS.length - 1][0];
  const shooting = f < lastShot + 24;
  const notLoaded = f >= sFrame; // arrow has left the bow
  const idle = f - (lastShot + 60);
  const armA = 90 - aimNow;
  const topArrows = SHOTS.map(([sf, d, a], i) => {
    if (f < sf) return null;
    const r = flight(TOP_G, TS, d, a, f - sf) as { x: number; y: number; ang: number; stuck: boolean; gone?: boolean };
    if (r.gone) return null;
    return <Arrow key={i} x={r.x} y={r.y} ang={r.ang} />;
  });
  const coins = SHOTS.map(([sf], i) => {
    const age = f - sf;
    if (age < 0 || age > 50) return null;
    const op = interpolate(age, [0, 8, 36, 50], [0, 1, 1, 0], clamp);
    return (
      <g key={i} transform={`translate(${FIG_X + 10 + (i % 2 ? 30 : -30)},${TOP_G - 230 - age * 1.1})`} opacity={op}>
        <circle r={16} fill="#E8B64C" stroke={C.ink} strokeWidth={2.5} />
        <text y={6} textAnchor="middle" fontFamily={SERIF} fontSize={19} fill={C.ink}>$</text>
      </g>
    );
  });
  const qIn = interpolate(idle, [0, 14], [0, 1], clamp);

  // ---------- bottom: one clear target ----------
  const BS = BOT_G - 138;
  const sight = interpolate(f, [AIM_LINE, AIM_LINE + 40], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const sightOut = f < RELEASE ? 1 : 0;
  const pullBot = f < RELEASE ? interpolate(f, [PULL, RELEASE - 4], [0, 1], { ...clamp, easing: Easing.inOut(Easing.quad) }) : interpolate(f, [RELEASE, RELEASE + 6], [1, 0], clamp);
  const botReleased = f >= RELEASE;
  const botTipX = Math.min(TGT_X, FIG_X + 78 + BOT_SPEED * (f - RELEASE));
  const wob = f >= HIT ? 5 * Math.sin((f - HIT) / 1.6) * Math.exp(-(f - HIT) / 12) : 0;
  const cheer = f > HIT + 14 ? Math.min(1, (f - HIT - 14) / 10) : 0;
  const hitBurst = f >= HIT && f < HIT + 22 ? (f - HIT) / 22 : -1;

  return (
    <Paper>
      <Audio src={staticFile("sfx/boosting.wav")} />
      {/* titles */}
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 92 }}>
        <div style={{ position: "absolute", top: 96, fontFamily: SERIF, fontSize: 78, color: C.ink, letterSpacing: -1.5, opacity: t1Out, clipPath: `inset(0 ${100 - t1Reveal}% 0 0)` }}>
          Is a boosted post a plan?
        </div>
        <div style={{ position: "absolute", top: 58, textAlign: "center", fontFamily: SERIF, color: C.ink, clipPath: `inset(0 ${100 - t2Reveal}% 0 0)` }}>
          <div style={{ fontSize: 60, letterSpacing: -1 }}>Boosting without aim</div>
          <div style={{ fontSize: 84, fontStyle: "italic", letterSpacing: -1.5, lineHeight: 1 }}>is just guessing.</div>
        </div>
      </AbsoluteFill>

      <svg width={W} height={1350} style={{ position: "absolute", inset: 0 }}>
        <InkDefs />
        {/* red underline for the punchline */}
        <path d="M250,226 C400,236 650,220 830,230" stroke={C.red} strokeWidth={6} fill="none" strokeLinecap="round" filter="url(#rough)" strokeDasharray={640} strokeDashoffset={(1 - underline) * 640} />

        {/* ---- TOP PANEL ---- */}
        <g opacity={targetIn}>
          <Target x={TGT_X} y={TOP_G - 138} />
        </g>
        {topArrows}
        {coins}
        <Stick
          x={FIG_X} y={TOP_G} flip={dirNow < 0}
          armR={shooting ? [armA, armA] : [18, 8]}
          armL={shooting ? [-20 + 60 * pullTop, -10 + 160 * pullTop] : [-18, -8]}
        >
          {/* blindfold */}
          <path d="M-25,-172 L25,-172" stroke={C.ink} strokeWidth={10} />
          <path d="M-25,-172 L-36,-160" strokeWidth={3} />
        </Stick>
        {shooting ? (
          <g transform={`translate(${FIG_X},${TS}) scale(${dirNow},1) rotate(${-aimNow})`}>
            <Bow pull={pullTop} />
            {!notLoaded ? <Arrow x={78 - 30 * pullTop * 0} y={0} ang={0} /> : null}
          </g>
        ) : null}
        <g opacity={qIn}>
          <text x={FIG_X + 40} y={TOP_G - 232 - qIn * 8} fontFamily={SERIF} fontStyle="italic" fontSize={64} fill={C.ink}>?</text>
          <text x={FIG_X - 70} y={TOP_G - 214 - qIn * 8} fontFamily={SERIF} fontStyle="italic" fontSize={44} fill={C.ink}>?</text>
        </g>
        <Ground y={TOP_G} progress={groundIn} />

        {/* ---- BOTTOM PANEL ---- */}
        <g opacity={targetIn}>
          <Target x={TGT_X} y={BS} wobble={wob} />
        </g>
        {sightOut ? (
          <path d={`M${FIG_X + 150},${BS} L${FIG_X + 150 + sight * (TGT_X - 80 - FIG_X - 150)},${BS}`} stroke={C.inkSoft} strokeWidth={2.5} strokeDasharray="10 12" fill="none" strokeLinecap="round" />
        ) : null}
        {botReleased ? <Arrow x={botTipX} y={BS} ang={0} /> : null}
        <Stick
          x={FIG_X} y={BOT_G}
          armR={[90, 90]}
          armL={cheer > 0 ? [-150 * cheer - 18, -165 * cheer - 8] : [-20 + 60 * pullBot, -10 + 160 * pullBot]}
          bob={cheer > 0 ? -Math.abs(Math.sin((f - HIT - 14) / 5)) * 10 * cheer : 0}
        >
          <circle cx={9} cy={-170} r={2.4} fill={C.ink} stroke="none" />
        </Stick>
        <g transform={`translate(${FIG_X},${BS})`}>
          <Bow pull={pullBot} />
          {!botReleased ? <Arrow x={78} y={0} ang={0} /> : null}
        </g>
        {hitBurst >= 0 ? (
          <g stroke={C.ink} strokeWidth={3} strokeLinecap="round" opacity={1 - hitBurst}>
            {[-60, -30, 0, 30, 60].map((a) => (
              <path key={a} transform={`translate(${TGT_X},${BS}) rotate(${a - 90})`} d={`M${60 + hitBurst * 30},0 L${78 + hitBurst * 40},0`} />
            ))}
          </g>
        ) : null}
        <Ground y={BOT_G} progress={groundIn} />
      </svg>

      {/* panel labels */}
      <div style={{ position: "absolute", top: TOP_G + 18, left: 78, fontFamily: SERIF, fontSize: 38, color: C.ink, opacity: labelsIn }}>
        Boosting and <i>hoping</i>
      </div>
      <div style={{ position: "absolute", top: BOT_G + 18, left: 78, fontFamily: SERIF, fontSize: 38, color: C.ink, opacity: labelsIn }}>
        One goal, one <i>clear audience</i>
      </div>
      <BrandFooter opacity={labelsIn} />
    </Paper>
  );
};
