import React from "react";
import { AbsoluteFill, Audio, interpolate, staticFile, useCurrentFrame, Easing } from "remotion";
import { BrandFooter, C, Ground, InkDefs, Paper, SERIF, Stick } from "../kit/kit";

// 60fps timeline (frames)
export const SHOWRESULTS_FRAMES = 660;
const BOARD = 46; // both easels pop in
const LINE0 = 80; // top: spec lines start
const LINE_GAP = 28; // frames between spec lines
const PIC = 110; // bottom: picture pops in
const YAWN = 190; // top: customer starts to doze
const LEAVE = 310; // top: customer walks off
const WANT = 170; // bottom: "I want that!"
const COIN0 = 250; // bottom: coin flies to the jar
const OUTRO = 470; // title swap
const UNDERLINE = 510;

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const W = 1080;
const TOP_G = 640;
const BOT_G = 1110;
const CUST_X = 250;
const PRES_X = 780;
const EAS_X = 430; // easel left edge
const EAS_W = 210;
const EAS_H = 190;
const EAS_LIFT = 70; // easel board bottom above ground
const JAR_X = 985;
const COIN = "#E8B64C";
const SPECS = ["800 W motor", "2 speeds", "13 mm chuck"];

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

const Easel: React.FC<{ ground: number; pop: number; children: React.ReactNode }> = ({ ground, pop, children }) => {
  const top = ground - EAS_LIFT - EAS_H;
  return (
    <g transform={`translate(${EAS_X + EAS_W / 2},${ground}) scale(1,${pop}) translate(${-(EAS_X + EAS_W / 2)},${-ground})`} opacity={Math.min(1, pop * 2)}>
      <g filter="url(#rough)" stroke={C.ink} strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round">
        <path d={`M${EAS_X + 40},${ground - EAS_LIFT} L${EAS_X + 14},${ground} M${EAS_X + EAS_W - 40},${ground - EAS_LIFT} L${EAS_X + EAS_W - 14},${ground}`} fill="none" />
        <rect x={EAS_X} y={top} width={EAS_W} height={EAS_H} fill={C.paper} />
      </g>
      {children}
    </g>
  );
};

export const ShowResults: React.FC = () => {
  const f = useCurrentFrame();

  // ---------- titles ----------
  const t1Reveal = interpolate(f, [6, 40], [0, 100], { ...clamp, easing: Easing.out(Easing.cubic) });
  const t1Out = interpolate(f, [OUTRO, OUTRO + 14], [1, 0], clamp);
  const t2Reveal = interpolate(f, [OUTRO + 10, OUTRO + 40], [0, 100], { ...clamp, easing: Easing.out(Easing.cubic) });
  const underline = interpolate(f, [UNDERLINE, UNDERLINE + 32], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const labelsIn = interpolate(f, [30, 55], [0, 1], clamp);
  const groundIn = interpolate(f, [20, 60], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const easelPop = interpolate(f, [BOARD, BOARD + 14], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.8)) });
  const picPop = interpolate(f, [PIC, PIC + 14], [0, 1], { ...clamp, easing: Easing.out(Easing.back(2)) });

  // ---------- top: spec list, customer dozes off ----------
  const talk = f > LINE0 && f < LEAVE ? Math.sin(f / 4.5) * 10 : 0;
  const presArmTop: [number, number] = [70 + talk, 80];
  const dozing = f >= YAWN && f < LEAVE;
  const zIn = interpolate(f, [YAWN, YAWN + 14, LEAVE - 12, LEAVE], [0, 1, 1, 0], clamp);
  const zPulse = 1 + Math.sin(f / 9) * 0.04;
  const leaveP = interpolate(f, [LEAVE, LEAVE + 100], [0, 1], { ...clamp, easing: Easing.inOut(Easing.quad) });
  const tcx = CUST_X - 150 * leaveP;
  const leaving = leaveP > 0 && leaveP < 1;
  const stride = Math.sin(f / 2.4) * 26;
  const custLegs = leaving ? { legL: [-12 - stride, -8] as [number, number], legR: [12 + stride, 8] as [number, number] } : {};
  const nod = dozing ? Math.sin(f / 12) * 4 : 0;

  // ---------- bottom: picture on the easel, customer wants it ----------
  const wantIn = interpolate(f, [WANT, WANT + 12, COIN0 - 8, COIN0 + 4], [0, 1, 1, 0], clamp);
  const wantPulse = 1 + Math.sin(f / 7) * 0.04;
  const presArmBot: [number, number] = f > PIC + 10 ? [70 + Math.sin(f / 9) * 5, 80] : [20, 10];
  const give = interpolate(f, [COIN0 - 14, COIN0], [0, 1], clamp);
  const cheer = interpolate(f, [COIN0 + 20, COIN0 + 32], [0, 1], clamp);
  const hop = f > COIN0 + 20 ? -Math.abs(Math.sin((f - COIN0 - 20) / 6)) * 9 * cheer : 0;
  const coinDur = 40;
  const ca = (f - COIN0) / coinDur;
  const coin = ca >= 0 && ca <= 1
    ? <circle cx={CUST_X + 70 + (JAR_X - CUST_X - 70) * ca} cy={BOT_G - 150 - 200 * 4 * ca * (1 - ca) + 120 * ca} r={9} fill={COIN} stroke={C.ink} strokeWidth={2.5} filter="url(#rough)" />
    : null;
  const botCoins = f >= COIN0 + coinDur ? 1 : 0;
  const sparkle = interpolate(f, [PIC + 8, PIC + 18, PIC + 40], [0, 1, 0], clamp);

  return (
    <Paper>
      <Audio src={staticFile("sfx/show_results.wav")} />
      {/* titles */}
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 92 }}>
        <div style={{ position: "absolute", top: 96, fontFamily: SERIF, fontSize: 78, color: C.ink, letterSpacing: -1.5, opacity: t1Out, clipPath: `inset(0 ${100 - t1Reveal}% 0 0)` }}>
          What do customers buy?
        </div>
        <div style={{ position: "absolute", top: 58, textAlign: "center", fontFamily: SERIF, color: C.ink, clipPath: `inset(0 ${100 - t2Reveal}% 0 0)` }}>
          <div style={{ fontSize: 60, letterSpacing: -1 }}>Sell the result,</div>
          <div style={{ fontSize: 84, fontStyle: "italic", letterSpacing: -1.5, lineHeight: 1 }}>not the drill.</div>
        </div>
      </AbsoluteFill>

      <svg width={W} height={1350} style={{ position: "absolute", inset: 0 }}>
        <InkDefs />
        {/* red underline for the punchline */}
        <path d="M300,226 C440,238 640,220 790,230" stroke={C.red} strokeWidth={6} fill="none" strokeLinecap="round" filter="url(#rough)" strokeDasharray={540} strokeDashoffset={(1 - underline) * 540} />

        {/* ---- TOP PANEL: features ---- */}
        <Easel ground={TOP_G} pop={easelPop}>
          <g filter="url(#rough)">
            {SPECS.map((t, i) => {
              const a = interpolate(f, [LINE0 + i * LINE_GAP, LINE0 + i * LINE_GAP + 12], [0, 1], clamp);
              return (
                <text key={t} x={EAS_X + 16} y={TOP_G - EAS_LIFT - EAS_H + 52 + i * 52} fontFamily={SERIF} fontStyle="italic" fontSize={28} fill={C.ink} opacity={a}>
                  • {t}
                </text>
              );
            })}
          </g>
        </Easel>
        <Stick x={PRES_X} y={TOP_G} flip armR={presArmTop} armL={[-18, -8]} />
        <Stick
          x={tcx} y={TOP_G} flip={leaveP > 0} lean={dozing ? 5 + nod : 0}
          armL={dozing ? [-8, -4] : [-20, -10]} armR={dozing ? [8, 4] : [20, 10]} {...custLegs}
        />
        {zIn > 0 ? <Bubble x={CUST_X + 20} y={TOP_G - 235} k={zIn * zPulse} w={150} text="Zzz..." /> : null}
        <Jar x={JAR_X} y={TOP_G} coins={0} />
        <Ground y={TOP_G} progress={groundIn} />

        {/* ---- BOTTOM PANEL: result ---- */}
        <Easel ground={BOT_G} pop={easelPop}>
          <g transform={`translate(${EAS_X + EAS_W / 2},${BOT_G - EAS_LIFT - EAS_H / 2}) scale(${picPop})`} filter="url(#rough)" stroke={C.ink} strokeWidth={3} strokeLinejoin="round" strokeLinecap="round">
            <rect x={-82} y={-66} width={164} height={132} fill={C.waterLight} fillOpacity={0.35} />
            <circle cx={36} cy={-26} r={15} fill={COIN} />
            <path d="M-82,66 L-82,22 Q-42,-10 0,24 Q40,2 82,30 L82,66 Z" fill={C.leaf} />
            <rect x={-82} y={-66} width={164} height={132} fill="none" strokeWidth={5} />
          </g>
          {sparkle > 0 ? (
            <g transform={`translate(${EAS_X + EAS_W - 6},${BOT_G - EAS_LIFT - EAS_H + 4}) scale(${sparkle})`} stroke={C.ink} strokeWidth={3} strokeLinecap="round" filter="url(#rough)">
              <path d="M0,-16 L0,16 M-16,0 L16,0 M-10,-10 L10,10 M-10,10 L10,-10" />
            </g>
          ) : null}
        </Easel>
        <Stick x={PRES_X} y={BOT_G} flip armR={presArmBot} armL={[-18, -8]} />
        <Stick
          x={CUST_X} y={BOT_G + hop}
          armL={cheer > 0 ? [-18 - 150 * cheer, -8 - 165 * cheer] : [-20, -10]}
          armR={cheer > 0 ? [18 + 150 * cheer, 8 + 165 * cheer] : [20 + 90 * give, 10 + 60 * give]}
        />
        {coin}
        {wantIn > 0 ? <Bubble x={CUST_X + 90} y={BOT_G - 235} k={wantIn * wantPulse} w={290} text="I want that!" /> : null}
        <Jar x={JAR_X} y={BOT_G} coins={botCoins} />
        <Ground y={BOT_G} progress={groundIn} />
      </svg>

      {/* panel labels */}
      <div style={{ position: "absolute", top: TOP_G + 18, left: 78, fontFamily: SERIF, fontSize: 38, color: C.ink, opacity: labelsIn }}>
        Listing the <i>features</i>
      </div>
      <div style={{ position: "absolute", top: BOT_G + 18, left: 78, fontFamily: SERIF, fontSize: 38, color: C.ink, opacity: labelsIn }}>
        Showing the <i>result</i>
      </div>
      <BrandFooter opacity={labelsIn} />
    </Paper>
  );
};
