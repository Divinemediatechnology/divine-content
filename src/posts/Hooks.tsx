import React from "react";
import { AbsoluteFill, Audio, Easing, interpolate, staticFile, useCurrentFrame } from "remotion";
import { BrandFooter, C, Ground, InkDefs, Paper, SERIF, Stick } from "../kit/kit";

// 60fps timeline (frames)
export const HOOKS_FRAMES = 600;
const CAST = 66; // both lines drop toward the water
const SPLASH = 98; // hooks hit the water, timer starts
const BITE = 158; // bottom: fish takes the bait
const REEL = 170; // bottom: fish is pulled out
const LANDED = 220; // bottom: fish hangs in the air, figure cheers
const SHRUG = 290; // top: still nothing after ~3 seconds
const OUTRO = 430;
const UNDERLINE = 470;

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const W = 1080;
const TOP_G = 640;
const BOT_G = 1110;
const FIG_X = 190;
const HOOK_X = 565;
const WATER_X = 440;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const Fish: React.FC<{ x: number; y: number; faceRight?: boolean; wiggle?: number }> = ({ x, y, faceRight = false, wiggle = 0 }) => (
  <g transform={`translate(${x},${y}) rotate(${wiggle}) scale(${faceRight ? -1 : 1},1)`} stroke={C.ink} strokeWidth={3.2} strokeLinejoin="round" filter="url(#rough)">
    <path d="M-34,0 Q-8,-21 26,0 Q-8,21 -34,0 Z" fill={C.waterLight} />
    <path d="M26,0 L48,-15 L48,15 Z" fill={C.water} />
    <circle cx={-20} cy={-4} r={3} fill={C.ink} stroke="none" />
  </g>
);

const Hook: React.FC<{ x: number; y: number; bait?: boolean; wob?: number }> = ({ x, y, bait = false, wob = 0 }) => (
  <g transform={`translate(${x},${y})`} filter="url(#rough)">
    <path d="M0,0 L0,24 Q0,42 -15,40 Q-22,37 -19,29" stroke={C.ink} strokeWidth={4} fill="none" strokeLinecap="round" />
    {bait ? (
      <path d={`M-4,34 q-8,${4 + wob},-14,0 q-5,${-5 - wob},3,-8`} stroke={C.dead} strokeWidth={7} fill="none" strokeLinecap="round" />
    ) : null}
  </g>
);

const Water: React.FC<{ g: number; f: number }> = ({ g, f }) => {
  const top = g - 110;
  let d = `M${WATER_X},${top}`;
  for (let x = WATER_X; x <= 1010; x += 10) d += ` L${x},${top + Math.sin(x / 26 + f / 14) * 3}`;
  d += ` L1010,${g} L${WATER_X},${g} Z`;
  return (
    <g>
      <path d={d} fill={C.waterLight} opacity={0.35} />
      <path d={d.split(" L1010")[0]} stroke={C.water} strokeWidth={3.5} fill="none" strokeLinecap="round" filter="url(#rough)" />
    </g>
  );
};

const Ripple: React.FC<{ g: number; f: number }> = ({ g, f }) => {
  const t = (f - SPLASH) / 26;
  if (t < 0 || t > 1) return null;
  return <ellipse cx={HOOK_X} cy={g - 108} rx={10 + t * 54} ry={2 + t * 9} stroke={C.water} strokeWidth={3} fill="none" opacity={1 - t} />;
};

export const Hooks: React.FC = () => {
  const f = useCurrentFrame();

  // ---------- titles ----------
  const t1Reveal = interpolate(f, [6, 40], [0, 100], { ...clamp, easing: Easing.out(Easing.cubic) });
  const t1Out = interpolate(f, [OUTRO, OUTRO + 14], [1, 0], clamp);
  const t2Reveal = interpolate(f, [OUTRO + 10, OUTRO + 40], [0, 100], { ...clamp, easing: Easing.out(Easing.cubic) });
  const underline = interpolate(f, [UNDERLINE, UNDERLINE + 32], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const labelsIn = interpolate(f, [30, 55], [0, 1], clamp);
  const groundIn = interpolate(f, [20, 60], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });

  // shared: line drops from the rod tip into the water
  const drop = interpolate(f, [CAST, SPLASH], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
  const timerOpacity = interpolate(f, [SPLASH, SPLASH + 10, OUTRO, OUTRO + 12], [0, 1, 1, 0], clamp);
  const secs = (Math.max(0, Math.min(f, OUTRO) - SPLASH) / 60).toFixed(1);

  const rodPath = (g: number, tipY: number) => `M${FIG_X + 40},${g - 112} L${HOOK_X},${tipY}`;

  // ---------- top: bare hook ----------
  const topTip = TOP_G - 300;
  const topHookY = lerp(topTip + 30, TOP_G - 50, drop);
  const fishPos = (phase: number, speed: number, cx: number, amp: number) => {
    const a = (f - SPLASH) / speed + phase;
    return { x: cx + amp * Math.sin(a), right: Math.cos(a) > 0 };
  };
  const fa = fishPos(0.4, 48, 745, 245);
  const fb = fishPos(2.6, 62, 745, 250);
  const shrugT = interpolate(f, [SHRUG, SHRUG + 12, OUTRO - 10, OUTRO], [0, 1, 1, 0.6], clamp);
  const qIn = interpolate(f, [SHRUG + 4, SHRUG + 16], [0, 1], clamp);
  const zeroIn = interpolate(f, [SHRUG + 10, SHRUG + 30], [0, 1], clamp);

  // ---------- bottom: hook with bait ----------
  const botTip = BOT_G - 300 + (f >= BITE && f < BITE + 12 ? Math.sin(((f - BITE) / 12) * Math.PI) * 14 : 0);
  const reel = interpolate(f, [REEL, LANDED], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const botHookY = lerp(lerp(botTip + 30, BOT_G - 50, drop), BOT_G - 215, reel);
  const approach = interpolate(f, [SPLASH + 10, BITE], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const bottomFishX = lerp(1000, HOOK_X + 34, approach);
  const hookedWiggle = f >= BITE ? Math.sin(f / 2.2) * (f < LANDED ? 12 : 8) : 0;
  const bottomFishY = f >= BITE ? botHookY + 40 : BOT_G - 62;
  const bangIn = interpolate(f, [BITE, BITE + 6, BITE + 34, BITE + 42], [0, 1, 1, 0], clamp);
  const cheer = f >= LANDED ? Math.min(1, (f - LANDED) / 10) : 0;
  const catchIn = interpolate(f, [LANDED + 6, LANDED + 26], [0, 1], clamp);
  const wob = Math.sin(f / 5) * 4;

  return (
    <Paper>
      <Audio src={staticFile("sfx/hooks.wav")} />
      {/* titles */}
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 92 }}>
        <div style={{ position: "absolute", top: 100, fontFamily: SERIF, fontSize: 76, color: C.ink, letterSpacing: -1.5, opacity: t1Out, clipPath: `inset(0 ${100 - t1Reveal}% 0 0)` }}>
          Why aren't they biting?
        </div>
        <div style={{ position: "absolute", top: 58, textAlign: "center", fontFamily: SERIF, color: C.ink, clipPath: `inset(0 ${100 - t2Reveal}% 0 0)` }}>
          <div style={{ fontSize: 60, letterSpacing: -1 }}>Win the first</div>
          <div style={{ fontSize: 84, fontStyle: "italic", letterSpacing: -1.5, lineHeight: 1 }}>3 seconds.</div>
        </div>
      </AbsoluteFill>

      <svg width={W} height={1350} style={{ position: "absolute", inset: 0 }}>
        <InkDefs />
        {/* red underline for the punchline */}
        <path d="M330,226 C450,236 620,220 760,230" stroke={C.red} strokeWidth={6} fill="none" strokeLinecap="round" filter="url(#rough)" strokeDasharray={460} strokeDashoffset={(1 - underline) * 460} />

        {/* ---- TOP PANEL: bare hook ---- */}
        <Water g={TOP_G} f={f} />
        <Fish x={fa.x} y={TOP_G - 58} faceRight={fa.right} wiggle={Math.sin(f / 7) * 3} />
        <Fish x={fb.x} y={TOP_G - 84} faceRight={fb.right} wiggle={Math.sin(f / 8 + 1) * 3} />
        <Ripple g={TOP_G} f={f} />
        <path d={`M${HOOK_X},${topTip} L${HOOK_X},${topHookY}`} stroke={C.ink} strokeWidth={2} fill="none" />
        <Hook x={HOOK_X} y={topHookY} />
        <path d={rodPath(TOP_G, topTip)} stroke={C.ink} strokeWidth={5} fill="none" strokeLinecap="round" filter="url(#rough)" />
        <Stick x={FIG_X} y={TOP_G} armR={[70, 80]} armL={[-20 - 50 * shrugT, -10 - 100 * shrugT]} bob={shrugT * -6} />
        <text x={FIG_X - 20} y={TOP_G - 225} fontFamily={SERIF} fontStyle="italic" fontSize={64} fill={C.ink} opacity={qIn * (1 - shrugT * 0 )}>
          ?
        </text>
        <Ground y={TOP_G} progress={groundIn} />

        {/* ---- BOTTOM PANEL: bait ---- */}
        <Water g={BOT_G} f={f} />
        {f < BITE ? <Fish x={bottomFishX} y={BOT_G - 62} wiggle={Math.sin(f / 6) * 3} /> : null}
        <Ripple g={BOT_G} f={f} />
        <path d={`M${HOOK_X},${botTip} L${HOOK_X},${botHookY}`} stroke={C.ink} strokeWidth={2} fill="none" />
        <Hook x={HOOK_X} y={botHookY} bait={f < BITE} wob={wob} />
        {f >= BITE ? <Fish x={HOOK_X + 34} y={bottomFishY} wiggle={hookedWiggle} /> : null}
        <path d={rodPath(BOT_G, botTip)} stroke={C.ink} strokeWidth={5} fill="none" strokeLinecap="round" filter="url(#rough)" />
        <Stick x={FIG_X} y={BOT_G} armR={[70, 80]} armL={cheer > 0 ? [-150 * cheer - 18, -165 * cheer - 8] : [-20, -10]} bob={cheer > 0 ? -Math.abs(Math.sin((f - LANDED) / 5)) * 10 * cheer : 0} />
        <text x={FIG_X - 12} y={BOT_G - 225} fontFamily={SERIF} fontStyle="italic" fontSize={72} fill={C.ink} opacity={bangIn}>
          !
        </text>
        <Ground y={BOT_G} progress={groundIn} />
      </svg>

      {/* timers */}
      <div style={{ position: "absolute", left: 800, top: TOP_G - 330, fontFamily: SERIF, fontStyle: "italic", fontSize: 46, color: C.inkSoft, opacity: timerOpacity }}>{secs}s</div>
      <div style={{ position: "absolute", left: 800, top: BOT_G - 330, fontFamily: SERIF, fontStyle: "italic", fontSize: 46, color: C.inkSoft, opacity: timerOpacity * (f < BITE ? 1 : 0.0) }}>{secs}s</div>
      <div style={{ position: "absolute", left: 800, top: BOT_G - 330, fontFamily: SERIF, fontStyle: "italic", fontSize: 46, color: C.inkSoft, opacity: timerOpacity * (f < BITE ? 0 : 1) }}>{((BITE - SPLASH) / 60).toFixed(1)}s</div>

      {/* counters */}
      <div style={{ position: "absolute", left: 800, top: TOP_G - 260, fontFamily: SERIF, fontStyle: "italic", fontSize: 44, color: C.inkSoft, opacity: zeroIn }}>0 bites</div>
      <div style={{ position: "absolute", left: 800, top: BOT_G - 260, fontFamily: SERIF, fontStyle: "italic", fontSize: 44, color: C.ink, opacity: catchIn }}>1 bite</div>

      {/* panel labels */}
      <div style={{ position: "absolute", top: TOP_G + 18, left: 78, fontFamily: SERIF, fontSize: 38, color: C.ink, opacity: labelsIn }}>
        A post with <i>no hook</i>
      </div>
      <div style={{ position: "absolute", top: BOT_G + 18, left: 78, fontFamily: SERIF, fontSize: 38, color: C.ink, opacity: labelsIn }}>
        A post with a <i>hook</i>
      </div>
      <BrandFooter opacity={labelsIn} />
    </Paper>
  );
};
