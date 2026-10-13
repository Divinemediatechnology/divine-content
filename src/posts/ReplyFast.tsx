import React from "react";
import { AbsoluteFill, Audio, Easing, interpolate, staticFile, useCurrentFrame } from "remotion";
import { BrandFooter, C, Ground, InkDefs, Paper, SERIF, Stick } from "../kit/kit";

// 60fps timeline (frames)
export const REPLYFAST_FRAMES = 600;
const SEND = 60; // customer's message appears (both panels)
const REPLY = 100; // bottom: instant reply
const ZZZ = 110; // top: shopkeeper snoozes
const CLOCK_TOP = 70; // top clock starts spinning
const SHRUG = 195; // top: customer gives up
const LEAVE = 235; // top: customer walks away
const CHEER = 150; // bottom: customer cheers
const THROW = 165; // coin leaves
const COIN_LAND = 205;
const OUTRO = 430;
const UNDERLINE = 470;

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const W = 1080;
const TOP_G = 640;
const BOT_G = 1110;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const sw = (ff: number) => Math.sin(ff / 5) * 28;

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

const Clock: React.FC<{ x: number; y: number; minute: number }> = ({ x, y, minute }) => (
  <g transform={`translate(${x},${y})`} stroke={C.ink} strokeWidth={4} strokeLinecap="round" filter="url(#rough)">
    <circle r={44} fill={C.paper} />
    <path d="M0,-34 L0,-28 M34,0 L28,0 M0,34 L0,28 M-34,0 L-28,0" strokeWidth={3} />
    <g transform={`rotate(${minute})`}>
      <path d="M0,0 L0,-32" />
    </g>
    <g transform={`rotate(${minute / 12})`}>
      <path d="M0,0 L0,-20" strokeWidth={6} />
    </g>
  </g>
);

export const ReplyFast: React.FC = () => {
  const f = useCurrentFrame();

  // ---------- titles ----------
  const t1Reveal = interpolate(f, [6, 40], [0, 100], { ...clamp, easing: Easing.out(Easing.cubic) });
  const t1Out = interpolate(f, [OUTRO, OUTRO + 14], [1, 0], clamp);
  const t2Reveal = interpolate(f, [OUTRO + 10, OUTRO + 40], [0, 100], { ...clamp, easing: Easing.out(Easing.cubic) });
  const underline = interpolate(f, [UNDERLINE, UNDERLINE + 32], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const labelsIn = interpolate(f, [30, 55], [0, 1], clamp);
  const groundIn = interpolate(f, [20, 60], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });

  // ---------- top: slow reply ----------
  const msgTop = interpolate(f, [SEND, SEND + 12, SHRUG - 10, SHRUG], [0, 1, 1, 0], clamp);
  const clockTop = f < CLOCK_TOP ? 0 : (f - CLOCK_TOP) * 7;
  const shrugT = interpolate(f, [SHRUG, SHRUG + 10, LEAVE - 8, LEAVE], [0, 1, 1, 0], clamp);
  const leaving = f >= LEAVE;
  const cx = leaving ? 150 - (f - LEAVE) * 6 : 150;
  const waiting = f >= SEND + 14 && f < SHRUG;
  const tap = waiting ? Math.abs(Math.sin(f / 7)) * 14 : 0;
  const topArmL: [number, number] = leaving ? [-sw(f) * 0.8, -sw(f) * 0.8] : [-20 - 50 * shrugT, -10 - 100 * shrugT];
  const topArmR: [number, number] = leaving ? [sw(f) * 0.8, sw(f) * 0.8] : [20 + 50 * shrugT, 10 + 100 * shrugT];
  const topLegs: { legL: [number, number]; legR: [number, number] } = leaving
    ? { legL: [sw(f), sw(f) * 0.5], legR: [-sw(f), -sw(f) * 0.5] }
    : { legL: [-12, -8], legR: [12 + tap, 8 + tap * 0.5] };
  const zzz = interpolate(f, [ZZZ, ZZZ + 15], [0, 1], clamp);
  const zFloat = (k: number) => ((f - ZZZ) * 0.6 + k * 24) % 72;
  const lostIn = interpolate(f, [LEAVE + 25, LEAVE + 45], [0, 1], clamp);
  const qIn = interpolate(f, [SHRUG + 2, SHRUG + 12, LEAVE - 6, LEAVE + 4], [0, 1, 1, 0], clamp);

  // ---------- bottom: fast reply ----------
  const msgBot = interpolate(f, [SEND, SEND + 12, REPLY + 50, REPLY + 60], [0, 1, 1, 0], clamp);
  const replyBot = interpolate(f, [REPLY, REPLY + 12, CHEER + 20, CHEER + 30], [0, 1, 1, 0], clamp);
  const clockBot = interpolate(f, [SEND + 20, REPLY + 10], [0, 40], { ...clamp, easing: Easing.out(Easing.cubic) });
  const wave = f >= REPLY && f < CHEER + 30 ? Math.sin((f - REPLY) / 4) * 10 : 0;
  const cheer = f >= CHEER ? Math.min(1, (f - CHEER) / 10) : 0;
  const throwing = f >= THROW && f < THROW + 10;
  const coinT = interpolate(f, [THROW, COIN_LAND], [0, 1], clamp);
  const coinX = lerp(260, 860, coinT);
  const coinY = lerp(BOT_G - 190, BOT_G - 108, coinT) - Math.sin(coinT * Math.PI) * 150;
  const coinDrop = interpolate(f, [COIN_LAND, COIN_LAND + 12], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
  const saleIn = interpolate(f, [COIN_LAND + 10, COIN_LAND + 30], [0, 1], clamp);
  const botArmL: [number, number] = cheer > 0 ? [-150 * cheer - 18, -165 * cheer - 8] : [-20, -10];
  const botArmR: [number, number] = throwing ? [80, 40] : cheer > 0 && f >= THROW + 10 ? [150 * cheer + 18, 165 * cheer + 8] : [20, 10];

  return (
    <Paper>
      <Audio src={staticFile("sfx/reply-fast.wav")} />
      {/* titles */}
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 92 }}>
        <div style={{ position: "absolute", top: 100, fontFamily: SERIF, fontSize: 76, color: C.ink, letterSpacing: -1.5, opacity: t1Out, clipPath: `inset(0 ${100 - t1Reveal}% 0 0)` }}>
          Is anyone there?
        </div>
        <div style={{ position: "absolute", top: 58, textAlign: "center", fontFamily: SERIF, color: C.ink, clipPath: `inset(0 ${100 - t2Reveal}% 0 0)` }}>
          <div style={{ fontSize: 60, letterSpacing: -1 }}>Reply fast,</div>
          <div style={{ fontSize: 84, fontStyle: "italic", letterSpacing: -1.5, lineHeight: 1 }}>keep the lead.</div>
        </div>
      </AbsoluteFill>

      <svg width={W} height={1350} style={{ position: "absolute", inset: 0 }}>
        <InkDefs />
        {/* red underline for the punchline */}
        <path d="M300,226 C430,236 620,220 780,230" stroke={C.red} strokeWidth={6} fill="none" strokeLinecap="round" filter="url(#rough)" strokeDasharray={500} strokeDashoffset={(1 - underline) * 500} />

        {/* ---- TOP PANEL: slow reply ---- */}
        <Clock x={900} y={TOP_G - 250} minute={clockTop} />
        <Stick x={cx} y={TOP_G} flip={leaving} armL={topArmL} armR={topArmR} {...topLegs} bob={shrugT * -8} />
        <Stick x={560} y={TOP_G} flip armR={[20, 10]} armL={[-20, -10]} lean={9} />
        <Bubble x={70} y={TOP_G - 330} w={250} h={72} tailX={150} text="Hi, price?" opacity={msgTop} />
        <text x={cx + 40} y={TOP_G - 215} fontFamily={SERIF} fontStyle="italic" fontSize={64} fill={C.ink} opacity={qIn}>
          ?
        </text>
        {[0, 1, 2].map((k) => (
          <text key={k} x={585 + k * 22 + zFloat(k) * 0.3} y={TOP_G - 215 - zFloat(k)} fontFamily={SERIF} fontStyle="italic" fontSize={30 + k * 8} fill={C.inkSoft} opacity={zzz * interpolate(zFloat(k), [0, 10, 60, 72], [0, 1, 1, 0], clamp)}>
            z
          </text>
        ))}
        <Ground y={TOP_G} progress={groundIn} />

        {/* ---- BOTTOM PANEL: fast reply ---- */}
        <Clock x={900} y={BOT_G - 250} minute={clockBot} />
        <Stick x={150} y={BOT_G} armL={botArmL} armR={botArmR} bob={cheer > 0 ? -Math.abs(Math.sin((f - CHEER) / 5)) * 10 * cheer : 0} />
        <Stick x={560} y={BOT_G} flip armR={[20 + wave, 10 + wave]} armL={[-20, -10]} />
        <Bubble x={70} y={BOT_G - 330} w={250} h={72} tailX={150} text="Hi, price?" opacity={msgBot} />
        <Bubble x={380} y={BOT_G - 330} w={400} h={72} tailX={560} text="Yes! Here's the price." opacity={replyBot} />
        {f >= THROW ? (
          <g filter="url(#rough)">
            <circle cx={coinX} cy={f >= COIN_LAND ? lerp(BOT_G - 108, BOT_G - 20, coinDrop) : coinY} r={13} fill="#E8B64C" stroke={C.ink} strokeWidth={3} />
          </g>
        ) : null}
        <g stroke={C.ink} strokeWidth={4} strokeLinejoin="round" strokeLinecap="round" fill="none" filter="url(#rough)">
          <path d={`M826,${BOT_G - 100} L826,${BOT_G - 4} Q860,${BOT_G + 4} 894,${BOT_G - 4} L894,${BOT_G - 100}`} />
          <path d={`M818,${BOT_G - 100} L902,${BOT_G - 100}`} />
        </g>
        <Ground y={BOT_G} progress={groundIn} />
      </svg>

      {/* counters */}
      <div style={{ position: "absolute", left: 700, top: TOP_G - 110, fontFamily: SERIF, fontStyle: "italic", fontSize: 44, color: C.inkSoft, opacity: lostIn }}>
        Lead lost
      </div>
      <div style={{ position: "absolute", left: 640, top: BOT_G - 215, fontFamily: SERIF, fontStyle: "italic", fontSize: 44, color: C.ink, opacity: saleIn }}>
        1 sale
      </div>

      {/* panel labels */}
      <div style={{ position: "absolute", top: TOP_G + 18, left: 78, fontFamily: SERIF, fontSize: 38, color: C.ink, opacity: labelsIn }}>
        Replying in <i>3 days</i>
      </div>
      <div style={{ position: "absolute", top: BOT_G + 18, left: 78, fontFamily: SERIF, fontSize: 38, color: C.ink, opacity: labelsIn }}>
        Replying in <i>3 minutes</i>
      </div>
      <BrandFooter opacity={labelsIn} />
    </Paper>
  );
};
