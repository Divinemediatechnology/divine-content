// Divine Media stickman kit: shared characters, rims, sets and cards. Daily posts import from here and only write shots.
import { W, H, PIC, PORTRAIT, PAL, clamp, lerp, eo, eio, eback, rr, rgrad, vgrad, poly, hash } from '../core/lib.js';
import { figure } from '../core/fig.js';
import { FLOOR, living, door } from './rooms.js';
import { makeView } from '../core/view.js';
import { U, pop, pill, goldText, navyBg } from '../core/gfx.js';

export const HH = 400;                                                    // hero height in the rooms (wide)
export const LAMP = { col: '#f2b266', w: 5, dx: 1, dy: -0.4 };            // warm rim from the floor lamp (right)
export const MOON = { col: '#8fb0e8', w: 4.5, dx: 1, dy: -0.5 };          // cold rim from the window (right)
export const SUN = { col: '#ffe0a8', w: 5, dx: -1, dy: -0.5 };            // daylight rim on the street (left)
export const fit = (c, text, size, maxW) => { c.font = `700 ${size}px Fredoka`; const w = c.measureText(text).width * 1.06; return w > maxW ? size * maxW / w : size; };

export function hero(c, o) { return figure(c, { kind: 'hero', h: HH, y: FLOOR, ...o }); }
/** sitting on the couch, 3/4 side view facing dir; u 0 = seated … 1 = standing (stand-up in between) */
export function sitting(x, h = HH, o = {}) {
  const d = o.dir ?? -1, u = o.u || 0;
  const hipY = lerp(FLOOR - 136, FLOOR - h * 0.45, u), hipX = x + d * lerp(0, h * 0.2, u);
  const feet = [[x + d * lerp(h * 0.2, h * 0.17, u), FLOOR], [x + d * lerp(h * 0.27, h * 0.24, u), FLOOR]];
  const kx = x + d * h * 0.2 * (1 - u);
  return { x: hipX, dir: d, hipY, feet, hands: o.hands || [[kx + d * 4, hipY - 6 + u * 120], [kx + d * 14, hipY - 2 + u * 120]], h, lean: (o.lean || 0) + 0.05 };
}
/** close-up head: a huge figure whose head sits at (hx, hy) */
export function bigHead(c, hx, hy, h, o = {}) { const Y = hy + 0.86 * h; return figure(c, { kind: 'hero', h, x: hx, y: Y, view: 'front', feet: [[hx - 40, Y], [hx + 40, Y]], ...o }); }
/** on the couch, phone in both hands; glow = screen on */
export function phoneOnCouch(V, t, o) {
  const g = o.glow ? 1 : 0;
  V.chars(1, 0, g ? { col: '#9fc3ff', w: 6, dx: 0.4, dy: -1 } : o.rim, (k) => {
    hero(k, { ...sitting(1000, HH, { hands: [[905, 560], [925, 552]], lean: o.lean || 0 }), hand: 'mitten', face: { expr: o.expr || 'calm', t, seed: o.seed || 1, look: -0.3, eyeY: 0.25, turn: 0.3 } });
    k.fillStyle = g ? '#cfe0ff' : '#0b0c10'; rr(k, 885, 510, 46, 76, 8); k.fill();
  });
  if (g) V.layer(1, 0, (k) => { k.fillStyle = rgrad(k, 910, 470, 10, 380, [[0, 'rgba(140,180,255,0.32)'], [1, 'rgba(140,180,255,0)']]); k.fillRect(500, 0, 1000, 1000); });
}


/** SHOPFRONT by day: your shop on a quiet street. Back buildings 1.5, shop 1.15, pavement under the walker */
export function shop(V, o = {}) {
  V.layer(1.6, 3, (c) => {
    c.fillStyle = vgrad(c, 0, -900, 700, [[0, '#9cc3d9'], [1, '#e9dcc4']]); c.fillRect(-1400, -1200, 4720, 3200);
    for (let i = 0; i < 14; i++) { const bx = -900 + i * 300 + hash(i) * 60, bh = 500 + hash(i + 5) * 500; c.fillStyle = i % 2 ? '#b9a98f' : '#a99a82'; c.fillRect(bx, 700 - bh, 280, bh + 200); c.fillStyle = 'rgba(80,90,110,0.35)'; for (let r = 0; r < bh / 90 - 1; r++) for (let q = 0; q < 3; q++) c.fillRect(bx + 30 + q * 80, 700 - bh + 40 + r * 90, 50, 56); }
  });
  V.layer(1.15, 0, (c) => {
    c.fillStyle = '#d8c7a6'; c.fillRect(-1400, -300, 4720, 1110);                         // wall
    c.fillStyle = '#c9b690'; for (let y = -300; y < 800; y += 46) c.fillRect(-1400, y, 4720, 3);
    // shop: frame, sign, awning, window, door
    c.fillStyle = '#2f4a3f'; c.fillRect(420, 120, 1080, 690);
    c.fillStyle = PAL.ink; rr(c, 520, 150, 880, 110, 14); c.fill();
    c.fillStyle = '#f2b266'; c.font = '700 70px Fredoka'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.letterSpacing = '6px'; c.fillText('YOUR SHOP', 960, 208);
    for (let i = 0; i < 9; i++) { c.fillStyle = i % 2 ? '#efe6d6' : PAL.rust; poly(c, [420 + i * 120, 280, 540 + i * 120, 280, 560 + i * 120, 380, 400 + i * 120 + 20, 380]); c.fill(); }
    c.fillStyle = 'rgba(0,0,0,0.12)'; c.fillRect(420, 380, 1080, 26);
    c.fillStyle = '#9fc0cf'; c.fillRect(470, 420, 640, 330); c.fillStyle = 'rgba(255,255,255,0.35)'; poly(c, [520, 420, 640, 420, 520, 600, 470, 600]); c.fill();
    c.fillStyle = '#7b5a3e'; c.fillRect(470, 690, 640, 60); for (const [bx, col] of [[540, PAL.red], [660, '#e0b04a'], [780, PAL.sage], [900, PAL.moon], [1010, PAL.rust]]) { c.fillStyle = col; rr(c, bx, 600, 80, 90, 10); c.fill(); }
    c.fillStyle = '#efe6d6'; rr(c, 760, 450, 170, 70, 12); c.fill(); c.fillStyle = PAL.red; c.font = '800 40px Nunito'; c.fillText('OPEN', 845, 487);
    door(c, 1170, 430, 250, 380, { col: '#3b5a4c' });
    // pavement
    c.fillStyle = '#9b9488'; c.fillRect(-1400, 810, 4720, 40); c.fillStyle = '#b2aa9b'; c.fillRect(-1400, 850, 4720, 1400);
    c.strokeStyle = '#a29a8b'; c.lineWidth = 4; for (let x = -1400; x < 3320; x += 260) { c.beginPath(); c.moveTo(x, 850); c.lineTo(x - 120, 1300); c.stroke(); }
    c.fillStyle = 'rgba(255,240,210,0.18)'; c.fillRect(-1400, -1200, 4720, 3400);
  });
}

/** title card on the beat before the question: small line + big gold line */
export function titleCard(at, small, big, cues = []) {
  return { id: 'TITLE', at, card: true, note: 'title card', cues: [[at, 'whoosh'], [at + 0.15, 'swell', { dur: 2.2 }], ...cues],
    draw(c, V, lt) {
      navyBg(c, lt); const k = eo(lt / 0.5), y = H / 2; c.save(); c.globalAlpha = k;
      goldText(c, small, W / 2, y - 100 * U, fit(c, small, 60 * U, W * 0.84), { col: '#efd3a6', ls: 0.08 });
      goldText(c, big, W / 2, y + 40 * U, fit(c, big, 150 * U, W * 0.86) * (0.96 + 0.04 * k)); c.restore();
    } };
}
/** end card: big gold line, small cream line, Divine Media pill, the hero waving */
export function endCard(at, big, small) {
  return { id: 'END', at, card: true, note: 'end card', end: at + 3.4, cues: [[at, 'whoosh'], [at + 0.4, 'land'], [at + 0.7, 'blip']],
    draw(c, V, lt) {
      navyBg(c, lt, { cy: 0.62 }); const k = eo(lt / 0.4); c.save(); c.globalAlpha = k;
      goldText(c, big, W / 2, H * (PORTRAIT ? 0.33 : 0.27), fit(c, big, 120 * U, W * 0.86) * (0.9 + 0.1 * eback(clamp(lt / 0.3))));
      goldText(c, small, W / 2, H * (PORTRAIT ? 0.4 : 0.41), fit(c, small, 60 * U, W * 0.84), { col: '#f3ecdf', glow: 'rgba(255,255,255,0.25)', ls: 0.05 });
      c.restore();
      pill(c, 'DIVINE MEDIA TECHNOLOGY', W / 2, H * (PORTRAIT ? 0.47 : 0.53), pop(lt, 0.7), { size: 30 });
      const V2 = makeView(c, { x: 960, y: 150, w: 2600, pw: 1500, py: 66 }, lt);
      V2.chars(1, 0, LAMP, (q) => { q.globalAlpha = k; hero(q, { x: 960, view: 'front', hand: 'mitten', hands: [[900, 560], [1050, 380 + Math.sin(lt * 6) * 14]], face: { expr: 'relieved', t: lt, seed: 7 } }); });
    } };
}
/** step card: big gold number + label pill ("One." "Two." lines sit on it) */
export function stepCard(at, num, label) {
  return { id: 'C' + num, at, card: true, note: `step ${num} card`, cues: [[at, 'whoosh'], [at + 0.12, 'blip']],
    draw(c, V, lt) { navyBg(c, lt); const k = clamp(lt / (3 / 24)); goldText(c, num, W / 2, H / 2 - 30 * U, 300 * U * lerp(0.86, 1, eback(k))); pill(c, label, W / 2, H / 2 + 150 * U, pop(lt, 0.12), { size: 40 }); } };
}
