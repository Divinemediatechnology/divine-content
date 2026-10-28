import React from "react";
import { AbsoluteFill, Audio, interpolate, staticFile, useCurrentFrame, Easing } from "remotion";
import { BrandFooter, C, Ground, InkDefs, Paper, SERIF, Stick, handPos } from "../kit/kit";

// 60fps timeline (frames)
export const KNOWNUMBERS_FRAMES = 740;
const WALK0 = 70; // both figures start walking
const TOP_FALL = 230; // blindfolded figure reaches the hole
const TOP_FALL_END = 266;
const BOT_STOP = 215; // dashboard figure stops at the hole
const JUMP0 = 262;
const JUMP1 = 322;
const BOT_ARRIVE = 440;
const TOSS0 = 440;
const TOSS1 = 470; // coin lands in jar
const OUTRO = 530; // title swap
const UNDERLINE = 570;

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const W = 1080;
const TOP_G = 640;
const BOT_G = 1110;
const HOLE_X = 640;
const START_X = 140;
const JAR_X = 990;
const COIN = "#E8B64C";
const STRIDE = 0.28;

const Hole: React.FC<{ y: number }> = ({ y }) => (
  <g filter="url(#rough)" stroke={C.ink} strokeWidth={3.5}>
    <ellipse cx={HOLE_X} cy={y + 4} rx={50} ry={13} fill={C.ink} fillOpacity={0.85} />
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

const Bubble: React.FC<{ x: number; y: number; k: number; w: number; text: string; mirror?: boolean }> = ({ x, y, k, w, text, mirror }) => (
  <g transform={`translate(${x},${y}) scale(${k})`} filter="url(#rough)">
    <g transform={`scale(${mirror ? -1 : 1},1)`}>
      <path
        d={`M${-w / 2},-26 Q${-w / 2},-42 ${-w / 2 + 16},-42 L${w / 2 - 16},-42 Q${w / 2},-42 ${w / 2},-26 L${w / 2},0 Q${w / 2},16 ${w / 2 - 16},16 L${-w / 2 + 60},16 L${-w / 2 + 30},38 L${-w / 2 + 34},16 L${-w / 2 + 16},16 Q${-w / 2},16 ${-w / 2},0 Z`}
        fill={C.paper} stroke={C.ink} strokeWidth={3.5} strokeLinejoin="round"
      />
    </g>
    <text x={0} y={-7} textAnchor="middle" fontFamily={SERIF} fontStyle="italic" fontSize={32} fill={C.ink}>{text}</text>
  </g>
);

/** Little dashboard card with a gauge; needle swings into the red zone when `alert` is 1. */
const Dashboard: React.FC<{ alert: number }> = ({ alert }) => {
  const ang = -55 + alert * 115;
  const r = (ang * Math.PI) / 180;
  return (
    <g stroke={C.ink} strokeWidth={3} strokeLinejoin="round" strokeLinecap="round">
      <rect x={-46} y={-38} width={92} height={76} rx={8} fill={C.paper} />
      <path d="M-28,14 A28,28 0 0 1 28,14" fill="none" />
      <path d="M12,-6 A28,28 0 0 1 28,14" fill="none" stroke={C.red} strokeWidth={5} />
      <path d={`M0,14 L${Math.sin(r) * 24},${14 - Math.cos(r) * 24}`} fill="none" strokeWidth={3.5} stroke={alert > 0.5 ? C.red : C.ink} />
      <circle cx={0} cy={14} r={3.5} fill={C.ink} />
      <path d="M-30,28 L-14,22 L0,26 L16,20 L30,24" fill="none" strokeWidth={2.2} />
    </g>
  );
};

export const KnowNumbers: React.FC = () => {
  const f = useCurrentFrame();

  // ---------- titles ----------
  const t1Reveal = interpolate(f, [6, 40], [0, 100], { ...clamp, easing: Easing.out(Easing.cubic) });
  const t1Out = interpolate(f, [OUTRO, OUTRO + 14], [1, 0], clamp);
  const t2Reveal = interpolate(f, [OUTRO + 10, OUTRO + 40], [0, 100], { ...clamp, easing: Easing.out(Easing.cubic) });
  const underline = interpolate(f, [UNDERLINE, UNDERLINE + 32], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const labelsIn = interpolate(f, [30, 55], [0, 1], clamp);
  const groundIn = interpolate(f, [20, 60], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });

  const walkLegs = (moving: boolean) => {
    const sw = moving ? Math.sin(f * STRIDE) * 28 : 0;
    return { legL: [sw, sw * 0.5] as [number, number], legR: [-sw, -sw * 0.5] as [number, number], bob: moving ? -Math.abs(Math.sin(f * STRIDE)) * 3 : 0 };
  };

  // ---------- top: blindfolded, straight into the hole ----------
  const topWalking = f >= WALK0 && f < TOP_FALL;
  const topX = f < TOP_FALL ? interpolate(f, [WALK0, TOP_FALL], [START_X, HOLE_X - 40], clamp) : interpolate(f, [TOP_FALL, TOP_FALL_END], [HOLE_X - 40, HOLE_X - 6], { ...clamp, easing: Easing.out(Easing.quad) });
  const fall = interpolate(f, [TOP_FALL, TOP_FALL_END], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
  const topLegs = walkLegs(topWalking);
  const flail = f > TOP_FALL && f < TOP_FALL_END + 90 ? Math.sin((f - TOP_FALL) / 3) * 14 : 0;
  const topArmR: [number, number] = fall > 0 ? [150 + flail, 175 + flail] : [90, 92];
  const topArmL: [number, number] = fall > 0 ? [135 - flail, 160 - flail] : [80, 84];
  const ouchK = interpolate(f, [TOP_FALL_END + 8, TOP_FALL_END + 20], [0, 1], clamp) * interpolate(f, [OUTRO - 14, OUTRO], [1, 0], clamp);

  // ---------- bottom: reads the dashboard, hops the hole ----------
  const botWalking = (f >= WALK0 && f < BOT_STOP) || (f >= JUMP1 && f < BOT_ARRIVE);
  let botX = START_X;
  if (f >= WALK0) botX = interpolate(f, [WALK0, BOT_STOP], [START_X, HOLE_X - 80], clamp);
  if (f >= JUMP0) botX = interpolate(f, [JUMP0, JUMP1], [HOLE_X - 80, HOLE_X + 80], { ...clamp, easing: Easing.inOut(Easing.quad) });
  if (f >= JUMP1) botX = interpolate(f, [JUMP1, BOT_ARRIVE], [HOLE_X + 80, 905], clamp);
  const jumpA = interpolate(f, [JUMP0, JUMP1], [0, 1], clamp);
  const jumping = f >= JUMP0 && f < JUMP1;
  const botHop = jumping ? -4 * 100 * jumpA * (1 - jumpA) : 0;
  const alert = interpolate(f, [BOT_STOP - 12, BOT_STOP - 2], [0, 1], clamp);
  const warnK = interpolate(f, [BOT_STOP + 4, BOT_STOP + 16, JUMP0 - 8, JUMP0], [0, 1, 1, 0], clamp);
  const toss = interpolate(f, [TOSS0, TOSS1], [0, 1], clamp);
  const cheerStart = TOSS1 + 6;
  const cheer = interpolate(f, [cheerStart, cheerStart + 12], [0, 1], clamp);
  const cheerHop = cheer > 0 ? -Math.abs(Math.sin((f - cheerStart) / 6)) * 9 * cheer : 0;
  const okK = interpolate(f, [cheerStart + 6, cheerStart + 18, OUTRO - 14, OUTRO], [0, 1, 1, 0], clamp);
  const botLegs = walkLegs(botWalking);
  const tuck = jumping || (f > JUMP0 - 4 && f < JUMP0 + 6);
  let botArmR: [number, number] = [62, 108];
  let botArmL: [number, number] = [50, 100];
  if (f >= TOSS0 && f < cheerStart) botArmR = [62 + 40 * toss, 108 - 40 * toss];
  if (cheer > 0) {
    botArmR = [18 + 150 * cheer, 8 + 165 * cheer];
    botArmL = [-18 - 150 * cheer, -8 - 165 * cheer];
  }
  const hasBoard = cheer === 0;
  const hand = handPos([62, 108]);

  // coin tossed from the figure to the jar
  let coinNode: React.ReactNode = null;
  if (f >= TOSS0 && f < TOSS1) {
    const sx = botX + 50;
    const sy = BOT_G - 140;
    const x = sx + (JAR_X - sx) * toss;
    const y = sy + (BOT_G - 40 - sy) * toss - 90 * 4 * toss * (1 - toss);
    coinNode = <circle cx={x} cy={y} r={11} fill={COIN} stroke={C.ink} strokeWidth={2.5} filter="url(#rough)" />;
  }
  const jarCoins = f >= TOSS1 ? 1 : 0;

  return (
    <Paper>
      <Audio src={staticFile("sfx/know-numbers.wav")} />
      {/* titles */}
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 92 }}>
        <div style={{ position: "absolute", top: 96, fontFamily: SERIF, fontSize: 74, color: C.ink, letterSpacing: -1.5, opacity: t1Out, clipPath: `inset(0 ${100 - t1Reveal}% 0 0)` }}>
          Can you see your road?
        </div>
        <div style={{ position: "absolute", top: 58, textAlign: "center", fontFamily: SERIF, color: C.ink, clipPath: `inset(0 ${100 - t2Reveal}% 0 0)` }}>
          <div style={{ fontSize: 60, letterSpacing: -1 }}>Know your</div>
          <div style={{ fontSize: 84, fontStyle: "italic", letterSpacing: -1.5, lineHeight: 1 }}>numbers.</div>
        </div>
      </AbsoluteFill>

      <svg width={W} height={1350} style={{ position: "absolute", inset: 0 }}>
        <InkDefs />
        {/* red underline for the punchline */}
        <path d="M380,226 C460,236 600,220 700,230" stroke={C.red} strokeWidth={6} fill="none" strokeLinecap="round" filter="url(#rough)" strokeDasharray={360} strokeDashoffset={(1 - underline) * 360} />

        {/* ---- TOP PANEL: blindfolded ---- */}
        <Hole y={TOP_G} />
        <Stick
          x={topX} y={TOP_G + 36 * fall + topLegs.bob}
          armR={topArmR} armL={topArmL}
          legL={fall > 0 ? [-14, -8] : topLegs.legL} legR={fall > 0 ? [8, 4] : topLegs.legR}
          lean={78 * fall}
        >
          <rect x={-27} y={-175} width={54} height={15} fill={C.ink} />
        </Stick>
        {ouchK > 0 ? <Bubble x={HOLE_X + 120} y={TOP_G - 210} k={ouchK} w={300} text="Didn't see that..." /> : null}
        <Jar x={JAR_X} y={TOP_G} coins={0} />
        <Ground y={TOP_G} progress={groundIn} />

        {/* ---- BOTTOM PANEL: dashboard in hand ---- */}
        <Hole y={BOT_G} />
        <Stick
          x={botX} y={BOT_G + botHop + cheerHop + botLegs.bob}
          armR={botArmR} armL={botArmL}
          legL={tuck ? [35, -25] : botLegs.legL} legR={tuck ? [-5, -30] : botLegs.legR}
        >
          {hasBoard ? (
            <g transform={`translate(${hand[0] + 34},${hand[1] - 8})`}>
              <Dashboard alert={alert} />
            </g>
          ) : null}
        </Stick>
        {warnK > 0 ? <Bubble x={HOLE_X - 80 + 135} y={BOT_G - 235} k={warnK} w={330} text="Pothole ahead!" /> : null}
        {okK > 0 ? <Bubble x={905 - 115} y={BOT_G - 235} k={okK} w={290} text="Smooth ride!" mirror /> : null}
        {coinNode}
        <Jar x={JAR_X} y={BOT_G} coins={jarCoins} />
        <Ground y={BOT_G} progress={groundIn} />
      </svg>

      {/* panel labels */}
      <div style={{ position: "absolute", top: TOP_G + 18, left: 78, fontFamily: SERIF, fontSize: 38, color: C.ink, opacity: labelsIn }}>
        Running it <i>blind</i>
      </div>
      <div style={{ position: "absolute", top: BOT_G + 18, left: 78, fontFamily: SERIF, fontSize: 38, color: C.ink, opacity: labelsIn }}>
        Reading the <i>dashboard</i>
      </div>
      <BrandFooter opacity={labelsIn} />
    </Paper>
  );
};
