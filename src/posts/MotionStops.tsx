import React from "react";
import { AbsoluteFill, Audio, interpolate, staticFile, useCurrentFrame, Easing } from "remotion";
import { BrandFooter, C, Ground, InkDefs, Paper, SERIF, Stick } from "../kit/kit";

// 60fps timeline (frames)
export const MOTIONSTOPS_FRAMES = 640;
const WALK0 = 70; // walkers start entering
const SPEED = 3.4; // px per frame
const OUTRO = 470; // title swap
const UNDERLINE = 510;
const TOSS0 = 340;
const TOSS1 = 372; // coin lands in jar
const BALL_PERIOD = 28; // frames per bounce of the moving sign

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const W = 1080;
const TOP_G = 640;
const BOT_G = 1110;
const SIGN_X = 820;
const JAR_X = 990;
const COIN = "#E8B64C";
const STRIDE = 0.34;
// each walker: x at WALK0, and where they stop in front of the moving sign
const WALKERS = [
  { x0: 90, stop: 640 },
  { x0: -60, stop: 560 },
  { x0: -210, stop: 480 },
];
const walkerX = (i: number, f: number) => WALKERS[i].x0 + SPEED * Math.max(0, f - WALK0);
const stopFrame = (i: number) => WALK0 + (WALKERS[i].stop - WALKERS[i].x0) / SPEED;

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

/** Roadside sign on a post. Static = painted word; moving = a little bouncing-ball screen. */
const Sign: React.FC<{ y: number; f: number; moving: boolean }> = ({ y, f, moving }) => {
  const phase = (f % BALL_PERIOD) / BALL_PERIOD;
  const h = 4 * phase * (1 - phase); // 0 on the floor, 1 at the top of the bounce
  const bx = Math.sin(f / 22) * 56;
  const squash = 1 + (1 - h) * (1 - h) * (1 - h) * 0.25;
  return (
    <g transform={`translate(${SIGN_X},${y})`} filter="url(#rough)" stroke={C.ink} strokeWidth={3.5} strokeLinejoin="round" strokeLinecap="round">
      <path d="M-4,0 L-4,-190 M8,0 L8,-190" fill="none" />
      <rect x={-96} y={-300} width={192} height={112} rx={8} fill={C.paper} />
      {moving ? (
        <g>
          <path d="M-80,-206 L80,-206" fill="none" strokeWidth={2.5} />
          <ellipse cx={bx} cy={-206 - 13 - h * 48} rx={13 / Math.sqrt(squash)} ry={13 * squash} fill={C.water} strokeWidth={2.5} />
          <path d={`M${bx - 30},${-206 - 40 - h * 48} l-10,-8 M${bx + 30},${-206 - 40 - h * 48} l10,-8`} fill="none" strokeWidth={2.5} opacity={0.5} />
        </g>
      ) : (
        <text x={0} y={-228} textAnchor="middle" fontFamily={SERIF} fontSize={54} fill={C.ink} stroke="none">SALE</text>
      )}
    </g>
  );
};

export const MotionStops: React.FC = () => {
  const f = useCurrentFrame();

  // ---------- titles ----------
  const t1Reveal = interpolate(f, [6, 40], [0, 100], { ...clamp, easing: Easing.out(Easing.cubic) });
  const t1Out = interpolate(f, [OUTRO, OUTRO + 14], [1, 0], clamp);
  const t2Reveal = interpolate(f, [OUTRO + 10, OUTRO + 40], [0, 100], { ...clamp, easing: Easing.out(Easing.cubic) });
  const underline = interpolate(f, [UNDERLINE, UNDERLINE + 32], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const labelsIn = interpolate(f, [30, 55], [0, 1], clamp);
  const groundIn = interpolate(f, [20, 60], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });

  const legs = (moving: boolean) => {
    const sw = moving ? Math.sin(f * STRIDE) * 28 : 0;
    return { legL: [sw, sw * 0.5] as [number, number], legR: [-sw, -sw * 0.5] as [number, number], bob: moving ? -Math.abs(Math.sin(f * STRIDE)) * 3 : 0, arm: moving ? Math.sin(f * STRIDE) * 14 : 0 };
  };

  // ---------- top: everyone walks past the static sign ----------
  const mehK = interpolate(f, [268, 280, 322, 334], [0, 1, 1, 0], clamp);
  const mehX = walkerX(0, f) + 96;

  // ---------- bottom: the moving sign stops three walkers ----------
  const toss = interpolate(f, [TOSS0, TOSS1], [0, 1], clamp);
  const cheerStart = TOSS1 + 6;
  const cheer = interpolate(f, [cheerStart, cheerStart + 12], [0, 1], clamp);
  const cheerHop = (k: number) => (cheer > 0 ? -Math.abs(Math.sin((f - cheerStart + k * 5) / 6)) * 9 * cheer : 0);
  const oohK = interpolate(f, [stopFrame(0) + 6, stopFrame(0) + 18, TOSS0 - 8, TOSS0], [0, 1, 1, 0], clamp);
  const okK = interpolate(f, [cheerStart + 6, cheerStart + 18, OUTRO - 14, OUTRO], [0, 1, 1, 0], clamp);

  let coinNode: React.ReactNode = null;
  if (f >= TOSS0 && f < TOSS1) {
    const sx = WALKERS[0].stop + 50;
    const sy = BOT_G - 140;
    const x = sx + (JAR_X - sx) * toss;
    const y = sy + (BOT_G - 40 - sy) * toss - 280 * 4 * toss * (1 - toss);
    coinNode = <circle cx={x} cy={y} r={11} fill={COIN} stroke={C.ink} strokeWidth={2.5} filter="url(#rough)" />;
  }

  return (
    <Paper>
      <Audio src={staticFile("sfx/motion-stops.wav")} />
      {/* titles */}
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 92 }}>
        <div style={{ position: "absolute", top: 96, fontFamily: SERIF, fontSize: 74, color: C.ink, letterSpacing: -1.5, opacity: t1Out, clipPath: `inset(0 ${100 - t1Reveal}% 0 0)` }}>
          What makes people stop?
        </div>
        <div style={{ position: "absolute", top: 58, textAlign: "center", fontFamily: SERIF, color: C.ink, clipPath: `inset(0 ${100 - t2Reveal}% 0 0)` }}>
          <div style={{ fontSize: 60, letterSpacing: -1 }}>Motion</div>
          <div style={{ fontSize: 84, fontStyle: "italic", letterSpacing: -1.5, lineHeight: 1 }}>stops the scroll.</div>
        </div>
      </AbsoluteFill>

      <svg width={W} height={1350} style={{ position: "absolute", inset: 0 }}>
        <InkDefs />
        {/* red underline for the punchline */}
        <path d="M320,226 C440,236 620,220 780,230" stroke={C.red} strokeWidth={6} fill="none" strokeLinecap="round" filter="url(#rough)" strokeDasharray={480} strokeDashoffset={(1 - underline) * 480} />

        {/* ---- TOP PANEL: static sign, nobody stops ---- */}
        <Sign y={TOP_G} f={f} moving={false} />
        <Jar x={JAR_X} y={TOP_G} coins={0} />
        {WALKERS.map((_, i) => {
          const x = walkerX(i, f);
          if (x < -60 || x > 1160) return null;
          const l = legs(true);
          return <Stick key={i} x={x} y={TOP_G + l.bob} legL={l.legL} legR={l.legR} armL={[-20 - l.arm, -10]} armR={[20 + l.arm, 10]} lean={4} />;
        })}
        {mehK > 0 ? <Bubble x={mehX} y={TOP_G - 210} k={mehK} w={150} text="Meh." /> : null}
        <Ground y={TOP_G} progress={groundIn} />

        {/* ---- BOTTOM PANEL: moving sign, they stop and look ---- */}
        <Sign y={BOT_G} f={f} moving />
        <Jar x={JAR_X} y={BOT_G} coins={f >= TOSS1 ? 1 : 0} />
        {WALKERS.map((w, i) => {
          const sf = stopFrame(i);
          const walking = f >= WALK0 && f < sf;
          const x = Math.min(walkerX(i, f), w.stop);
          if (x < -60) return null;
          const l = legs(walking);
          const stopped = f >= sf;
          let armR: [number, number] = [20 + l.arm, 10];
          let armL: [number, number] = [-20 - l.arm, -10];
          if (stopped && i === 0 && f >= TOSS0 && f < cheerStart) armR = [62 + 40 * toss, 108 - 40 * toss];
          if (cheer > 0 && i < 2) {
            armR = [18 + 112 * cheer, 8 + 132 * cheer];
            armL = [-18 - 112 * cheer, -8 - 132 * cheer];
          }
          return <Stick key={i} x={x} y={BOT_G + l.bob + cheerHop(i)} legL={l.legL} legR={l.legR} armL={armL} armR={armR} lean={stopped ? 7 : 4} />;
        })}
        {oohK > 0 ? <Bubble x={WALKERS[0].stop - 50} y={BOT_G - 235} k={oohK} w={260} text="Wait, what?" /> : null}
        {okK > 0 ? <Bubble x={WALKERS[0].stop - 50} y={BOT_G - 235} k={okK} w={260} text="I'm in!" /> : null}
        {coinNode}
        <Ground y={BOT_G} progress={groundIn} />
      </svg>

      {/* panel labels */}
      <div style={{ position: "absolute", top: TOP_G + 18, left: 78, fontFamily: SERIF, fontSize: 38, color: C.ink, opacity: labelsIn }}>
        A still <i>text</i> post
      </div>
      <div style={{ position: "absolute", top: BOT_G + 18, left: 78, fontFamily: SERIF, fontSize: 38, color: C.ink, opacity: labelsIn }}>
        A post that <i>moves</i>
      </div>
      <BrandFooter opacity={labelsIn} />
    </Paper>
  );
};
