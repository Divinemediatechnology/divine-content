import React from "react";
import { AbsoluteFill, Audio, Easing, interpolate, staticFile, useCurrentFrame } from "remotion";
import { BrandFooter, C, Ground, InkDefs, Paper, SERIF, Stick, handPos } from "../kit/kit";

// 60fps timeline (frames)
export const TALKTOONE_FRAMES = 600;
const TALK = 80; // megaphone starts shouting
const SHRUG = 262; // megaphone dropped, shrug
const BUBBLE = 100; // bottom bubble appears
const NOD = 150;
const GRIP = 215; // handshake starts
const LET_GO = 285;
const COIN_LAND = 315;
const OUTRO = 430;
const UNDERLINE = 470;

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const W = 1080;
const TOP_G = 640;
const BOT_G = 1110;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const lerpArm = (a: [number, number], b: [number, number], t: number): [number, number] => [lerp(a[0], b[0], t), lerp(a[1], b[1], t)];

const Megaphone: React.FC = () => (
  <g stroke={C.ink} strokeWidth={3.5} strokeLinejoin="round" fill={C.waterLight}>
    <path d="M0,-8 L46,-26 L46,26 L0,8 Z" />
    <path d="M-12,-8 L0,-8 L0,8 L-12,8 Z" fill={C.paper} />
  </g>
);

const Phone: React.FC = () => (
  <rect x={-7} y={-15} width={14} height={26} rx={3} fill={C.waterLight} stroke={C.ink} strokeWidth={2.5} />
);

const Bubble: React.FC<{ x: number; y: number; w: number; h: number; tailX: number; text: string; opacity: number }> = ({ x, y, w, h, tailX, text, opacity }) => (
  <g opacity={opacity}>
    <g filter="url(#rough)" stroke={C.ink} strokeWidth={3.5} fill={C.paper} strokeLinejoin="round">
      <rect x={x} y={y} width={w} height={h} rx={24} />
      <path d={`M${tailX - 14},${y + h - 1} L${tailX + 4},${y + h + 34} L${tailX + 22},${y + h - 1}`} stroke="none" />
      <path d={`M${tailX - 14},${y + h} L${tailX + 4},${y + h + 34} L${tailX + 22},${y + h}`} fill="none" />
    </g>
    <text x={x + w / 2} y={y + h / 2 + 10} textAnchor="middle" fontFamily={SERIF} fontStyle="italic" fontSize={32} fill={C.ink}>
      {text}
    </text>
  </g>
);

export const TalkToOne: React.FC = () => {
  const f = useCurrentFrame();

  // ---------- titles ----------
  const t1Reveal = interpolate(f, [6, 40], [0, 100], { ...clamp, easing: Easing.out(Easing.cubic) });
  const t1Out = interpolate(f, [OUTRO, OUTRO + 14], [1, 0], clamp);
  const t2Reveal = interpolate(f, [OUTRO + 10, OUTRO + 40], [0, 100], { ...clamp, easing: Easing.out(Easing.cubic) });
  const underline = interpolate(f, [UNDERLINE, UNDERLINE + 32], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const labelsIn = interpolate(f, [30, 55], [0, 1], clamp);
  const groundIn = interpolate(f, [20, 60], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });

  // ---------- top: shouting at everyone ----------
  const shouting = f >= TALK && f < SHRUG;
  const sh = interpolate(f, [SHRUG, SHRUG + 18], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const shrugWiggle = f > SHRUG + 18 ? Math.sin((f - SHRUG) / 5) * 4 * sh : 0;
  const holdArm: [number, number] = [100, 95];
  const topArmR: [number, number] = shouting || f < TALK ? (f < TALK ? [20, 10] : holdArm) : lerpArm([20, 10], [60, 120 + shrugWiggle], sh);
  const topArmL: [number, number] = f >= SHRUG ? lerpArm([-20, -10], [-60, -120 - shrugWiggle], sh) : [-20, -10];
  const megaHand = handPos(holdArm);
  const shake = shouting ? Math.sin(f / 2.2) * 2 : 0;
  const bubbleIn = interpolate(f, [TALK, TALK + 12, SHRUG - 12, SHRUG], [0, 1, 1, 0], clamp);
  const zeroIn = interpolate(f, [SHRUG + 20, SHRUG + 40], [0, 1], clamp);
  const waves = [0, 1, 2, 3, 4, 5, 6].map((k) => {
    const age = f - (TALK + 6 + k * 26);
    if (age < 0 || age > 56 || f >= SHRUG) return null;
    const r = 16 + age * 3.8;
    const a = 0.6;
    const cx = 150 + megaHand[0] + 46;
    const cy = TOP_G + megaHand[1];
    const x1 = cx + r * Math.cos(a), y1 = cy - r * Math.sin(a);
    const y2 = cy + r * Math.sin(a);
    return <path key={k} d={`M${x1},${y1} A${r},${r} 0 0 1 ${x1},${y2}`} stroke={C.inkSoft} strokeWidth={4} fill="none" strokeLinecap="round" opacity={interpolate(age, [0, 12, 56], [0, 0.9, 0], clamp)} />;
  });
  const crowd = [500, 610, 720, 830, 940];

  // ---------- bottom: one real conversation ----------
  const bubbleB = interpolate(f, [BUBBLE, BUBBLE + 12, GRIP - 6, GRIP + 4], [0, 1, 1, 0], clamp);
  const nodAmt = f >= NOD && f < GRIP ? Math.abs(Math.sin((f - NOD) / 9)) * 9 : 0;
  const reach = interpolate(f, [GRIP, GRIP + 18, LET_GO, LET_GO + 15], [0, 1, 1, 0], clamp);
  const pump = f > GRIP + 18 && f < LET_GO ? Math.sin((f - GRIP) / 3.2) * 6 : 0;
  const talkBob = f >= BUBBLE && f < GRIP ? Math.sin(f / 4) * 2 : 0;
  const cheer = f > COIN_LAND + 8 ? Math.min(1, (f - COIN_LAND - 8) / 10) : 0;
  const coinT = interpolate(f, [LET_GO - 5, COIN_LAND], [0, 1], clamp);
  const coinX = lerp(400, 640, coinT);
  const coinY = lerp(BOT_G - 190, BOT_G - 108, coinT) - Math.sin(coinT * Math.PI) * 90;
  const coinDrop = interpolate(f, [COIN_LAND, COIN_LAND + 12], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
  const coinVisible = f >= LET_GO - 5;
  const saleIn = interpolate(f, [COIN_LAND + 10, COIN_LAND + 30], [0, 1], clamp);

  return (
    <Paper>
      <Audio src={staticFile("sfx/talk-to-one.wav")} />
      {/* titles */}
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 92 }}>
        <div style={{ position: "absolute", top: 96, fontFamily: SERIF, fontSize: 78, color: C.ink, letterSpacing: -1.5, opacity: t1Out, clipPath: `inset(0 ${100 - t1Reveal}% 0 0)` }}>
          Who are you talking to?
        </div>
        <div style={{ position: "absolute", top: 58, textAlign: "center", fontFamily: SERIF, color: C.ink, clipPath: `inset(0 ${100 - t2Reveal}% 0 0)` }}>
          <div style={{ fontSize: 60, letterSpacing: -1 }}>Talk to one person,</div>
          <div style={{ fontSize: 84, fontStyle: "italic", letterSpacing: -1.5, lineHeight: 1 }}>not everyone.</div>
        </div>
      </AbsoluteFill>

      <svg width={W} height={1350} style={{ position: "absolute", inset: 0 }}>
        <InkDefs />
        {/* red underline for the punchline */}
        <path d="M310,226 C430,236 620,220 770,230" stroke={C.red} strokeWidth={6} fill="none" strokeLinecap="round" filter="url(#rough)" strokeDasharray={480} strokeDashoffset={(1 - underline) * 480} />

        {/* ---- TOP PANEL ---- */}
        {waves}
        {crowd.map((cx, i) => (
          <Stick key={cx} x={cx} y={TOP_G} s={0.85} flip armR={[30, 150]} armL={[20, 10]} lean={11} bob={Math.sin(f / 6 + i * 1.7) * 2}>
            <g transform={`translate(${handPos([30, 150])[0] + 3},${handPos([30, 150])[1] - 8}) rotate(-12)`}>
              <Phone />
            </g>
          </Stick>
        ))}
        <Stick x={150} y={TOP_G} armR={topArmR} armL={topArmL} lean={shake}>
          {shouting ? (
            <g transform={`translate(${megaHand[0] + 4},${megaHand[1]})`}>
              <Megaphone />
            </g>
          ) : null}
        </Stick>
        {f >= SHRUG ? (
          <g transform={`translate(${250},${TOP_G - 16}) rotate(${interpolate(f, [SHRUG, SHRUG + 12], [-30, 12], clamp)})`}>
            <Megaphone />
          </g>
        ) : null}
        <Ground y={TOP_G} progress={groundIn} />

        {/* ---- BOTTOM PANEL ---- */}
        <Stick
          x={330} y={BOT_G}
          armR={lerpArm([20, 10], [88 + pump, 92], reach)}
          armL={[-20, -10]}
          bob={talkBob}
        />
        <Stick
          x={470} y={BOT_G} flip
          armR={lerpArm([20, 10], [88 - pump, 92], reach)}
          armL={cheer > 0 ? [-150 * cheer - 18, -165 * cheer - 8] : [-20, -10]}
          lean={nodAmt}
          bob={cheer > 0 ? -Math.abs(Math.sin((f - COIN_LAND) / 5)) * 10 * cheer : 0}
        />
        <Bubble x={150} y={790} w={370} h={72} tailX={316} text="Here's how I can help you." opacity={bubbleB} />
        {/* jar + coin */}
        {coinVisible ? (
          <g filter="url(#rough)">
            <circle cx={coinX} cy={f >= COIN_LAND ? lerp(BOT_G - 108, BOT_G - 20, coinDrop) : coinY} r={13} fill="#E8B64C" stroke={C.ink} strokeWidth={3} />
          </g>
        ) : null}
        <g stroke={C.ink} strokeWidth={4} strokeLinejoin="round" strokeLinecap="round" fill="none" filter="url(#rough)">
          <path d={`M606,${BOT_G - 100} L606,${BOT_G - 4} Q640,${BOT_G + 4} 674,${BOT_G - 4} L674,${BOT_G - 100}`} />
          <path d={`M598,${BOT_G - 100} L682,${BOT_G - 100}`} />
        </g>
        <Ground y={BOT_G} progress={groundIn} />
      </svg>

      {/* speech + counters */}
      <div style={{ position: "absolute", left: 90, top: 372, fontFamily: SERIF, fontStyle: "italic", fontSize: 44, color: C.ink, opacity: bubbleIn, transform: `rotate(-3deg)` }}>
        Hey everyone!!
      </div>
      <div style={{ position: "absolute", left: 560, top: 372, fontFamily: SERIF, fontStyle: "italic", fontSize: 44, color: C.inkSoft, opacity: zeroIn }}>
        0 replies
      </div>
      <div style={{ position: "absolute", left: 590, top: BOT_G - 190, fontFamily: SERIF, fontStyle: "italic", fontSize: 44, color: C.ink, opacity: saleIn }}>
        1 sale
      </div>

      {/* panel labels */}
      <div style={{ position: "absolute", top: TOP_G + 18, left: 78, fontFamily: SERIF, fontSize: 38, color: C.ink, opacity: labelsIn }}>
        Talking to <i>everyone</i>
      </div>
      <div style={{ position: "absolute", top: BOT_G + 18, left: 78, fontFamily: SERIF, fontSize: 38, color: C.ink, opacity: labelsIn }}>
        Talking to <i>one person</i>
      </div>
      <BrandFooter opacity={labelsIn} />
    </Paper>
  );
};
