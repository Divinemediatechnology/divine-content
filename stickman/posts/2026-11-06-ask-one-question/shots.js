// WHAT IF YOU ASKED EVERY CUSTOMER ONE QUESTION? — Divine Media stickman kit (2026-11-06).
// One picture per clause; cuts land 3 frames before their word (cut(line, word)); faces change on the word that matters.
import { W, H, PIC, PORTRAIT, PAL, clamp, eio } from './core/lib.js';
import { wd, ln, cut } from './core/timing.js';
import { makeView } from './core/view.js';
import { living } from './sets/rooms.js';
import { phone } from './sets/more.js';
import { pop, pill, stamp } from './core/gfx.js';
import { HH, LAMP, MOON, SUN, hero, sitting, bigHead, shop, titleCard, endCard } from './sets/kit.js';

export function buildShots() {
  const S = [];
  const add = (o) => { S.push(o); return o; };
  const L = (i) => ln(i);

  // ── COLD OPEN ───────────────────────────────────────────────────────────────────────────────
  add({ id: 'S01', at: 0, note: 'wide: your shop, customers come and go', cam: { x: 960, y: 470, w: 1920, push: 0.03, pushDur: 1.8, px: 960, pw: 1150 },
    draw(c, V) { shop(V, { dark: 0 }); },
    over(c, lt) { stamp(c, 'YOUR SHOP · OPEN', pop(lt, 0.3, 4)); },
    cues: [[0.2, 'swell', { dur: 2.4 }]] });
  add({ id: 'S02', at: cut(1, 0), note: 'close: but you never ask them one thing', cam: { x: 960, y: 480, w: 1920, pw: 1080 },
    draw(c, V, lt, t) {
      const B = makeView(c, { x: 1100, y: 430, w: 760, pw: 520 }, lt); living(B, { dof: 9 });
      V.chars(1, 0, { ...LAMP, w: 3 }, (k) => bigHead(k, 960, 500, 1900, { face: { expr: t > wd(1, 4).s ? 'worried' : 'neutral', t, seed: 1, look: 0.2 } }));
    },
    over(c, lt, t) { pill(c, 'NEVER ASK', W / 2, PIC.y + PIC.h * (PORTRAIT ? 0.2 : 0.16), pop(t, wd(1, 4).s), { bg: PAL.red }); },
    cues: [[wd(1, 4).s, 'blip']] });
  add(titleCard(L(3).start - 0.05, 'HOW DID YOU', 'FIND US?', [[wd(3, 10).e, 'land']]));

  // ── THE FOUR ANSWERS ────────────────────────────────────────────────────────────────────────
  const day = (id, idx, dayLabel, time, msg, win) => add({
    id, at: cut(idx, 0), note: `${dayLabel}: ${msg}`, cam: { x: 960, y: 470, w: 1700, pw: 1000 },
    draw(c, V) { phone(V, { glow: 1, notif: 1, day: dayLabel, time, from: 'Customer', badge: 'C', msg }); },
    over(c, lt, t) { if (win) pill(c, 'REEL', W / 2, PIC.y + PIC.h * (PORTRAIT ? 0.16 : 0.12), pop(t, wd(idx, 2).s), { ring: '#7fd17a' }); },
    look: () => ({ tint: '#203050', tintA: 0.14 }),
    cues: [[cut(idx, 0) + 0.1, 'type'], [wd(idx, 2).s, 'blip', { gain: 0.5 }]],
  });
  day('S04', 4, 'Monday', '10:15', 'A friend told me.', false);
  day('S05', 5, 'Tuesday', '11:40', 'I saw your reel.', true);
  day('S06', 6, 'Wednesday', '9:05', 'Your reel again.', true);
  day('S07', 7, 'Thursday', '4:20', 'The reel.', true);

  // ── THE TURN ────────────────────────────────────────────────────────────────────────────────
  add({ id: 'S08', at: L(9).start - 0.05, note: "you didn't guess, you asked", cam: { x: 960, y: 480, w: 1920, pw: 1080 },
    draw(c, V, lt, t) {
      const B = makeView(c, { x: 1100, y: 470, w: 760, pw: 520 }, lt); living(B, { dof: 9 });
      V.chars(1, 0, { col: '#9fc3ff', w: 3, dx: 0.4, dy: -1 }, (k) => bigHead(k, 980, 500, 1900, { face: { expr: lt > 0.3 ? 'determined' : 'neutral', t, seed: 6, look: 0 } }));
    },
    over(c, lt, t) { pill(c, 'YOU ASKED', W / 2, PIC.y + PIC.h * (PORTRAIT ? 0.2 : 0.16), pop(t, wd(9, 3).s)); },
    cues: [[wd(9, 3).s, 'blip']] });
  add({ id: 'S09', at: cut(10, 0), note: 'the answers all pointed one way', cam: { x: 960, y: 470, w: 1700, pw: 1000 },
    draw(c, V) { phone(V, { glow: 1, notif: 1, day: 'Totals', time: '', from: 'How they found you', badge: '#', msg: 'Reels won.' }); },
    over(c, lt, t) { pill(c, 'ONE CLEAR WINNER', W / 2, PIC.y + PIC.h * (PORTRAIT ? 0.2 : 0.12), pop(t, wd(10, 3).s), { ring: '#7fd17a' }); },
    look: () => ({ tint: '#1c3a28', tintA: 0.12 }),
    cues: [[wd(10, 3).s, 'land']] });

  // ── THE POINT ───────────────────────────────────────────────────────────────────────────────
  const upAt = wd(11, 0).s;
  add({ id: 'S10', at: cut(11, 0), note: 'so you put your time where they already are', cam: { x: 960, y: 480, w: 1920, push: 0.03, pushDur: 1.6, px: 1000, pw: 720 },
    draw(c, V, lt, t) {
      living(V, {});
      const u = eio((t - upAt) / 0.45);
      V.chars(1, 0, LAMP, (k) => hero(k, { ...sitting(1000, HH, { u, lean: Math.sin(u * Math.PI) * 0.3 }), hand: 'mitten', face: { expr: u > 0.5 ? 'determined' : 'calm', t, seed: 1, look: -0.3 } }));
    },
    over(c, lt, t) { pill(c, 'DOUBLE DOWN', W * (PORTRAIT ? 0.5 : 0.32), PIC.y + PIC.h * (PORTRAIT ? 0.2 : 0.16), pop(t, wd(11, 6).s), { ring: '#7fd17a' }); },
    cues: [[upAt, 'cloth', { dur: 0.45, gain: 0.6 }], [wd(11, 6).s, 'blip']] });
  add(endCard(L(12).end + 0.35, 'ASK ONE QUESTION.', 'THEN DOUBLE DOWN.'));
  return S;
}
