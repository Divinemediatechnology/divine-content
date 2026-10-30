// WHAT IF YOU REPLIED IN FIVE MINUTES? (2026-10-31). Phone + shop + couch shots from the kit.
import { W, H, PIC, PORTRAIT, PAL, clamp, lerp, eo, eio, eback, rr, rgrad } from './core/lib.js';
import { wd, ln, cut, T } from './core/timing.js';
import { makeView } from './core/view.js';
import { figure, walk } from './core/fig.js';
import { FLOOR, living } from './sets/rooms.js';
import { facade, phone } from './sets/more.js';
import { U, pop, pill, stamp } from './core/gfx.js';
import { HH, LAMP, MOON, SUN, hero, sitting, bigHead, phoneOnCouch, shop, titleCard, endCard } from './sets/kit.js';

export function buildShots() {
  const S = [];
  const add = (o) => { S.push(o); return o; };
  const L = (i) => ln(i);

  add({ id: 'S01', at: 0, note: 'wide: a customer on her couch with her phone', cam: { x: 960, y: 470, w: 1920, push: 0.03, pushDur: 1.8, px: 1000, pw: 720 },
    draw(c, V, lt, t) { living(V, {}); phoneOnCouch(V, t, { rim: LAMP, expr: 'determined' }); },
    over(c, lt) { stamp(c, 'A CUSTOMER · 6:00 P.M.', pop(lt, 0.3, 4)); },
    cues: [[0.2, 'swell', { dur: 2.4 }]] });
  add({ id: 'S02', at: cut(1, 0), note: 'she messages two shops', cam: { x: 960, y: 470, w: 1700, pw: 1000 },
    draw(c, V, lt, t) { phone(V, { glow: 1, notif: 1, day: 'Friday', time: '6:00', badge: '2', from: 'Shop 1 · Shop 2', msg: 'Sending to two shops…' }); },
    over(c, lt, t) { pill(c, 'TWO SHOPS', W / 2, PIC.y + PIC.h * (PORTRAIT ? 0.18 : 0.12), pop(t, wd(1, 2).s)); },
    cues: [[wd(1, 2).s, 'blip']] });
  const MSG = 'Hi, are you open today?', msgW = T.words.filter((w) => w.line === 2);
  add({ id: 'S03', at: cut(2, 0), note: 'the message', cam: { x: 960, y: 470, w: 900, pw: 640, py: 480 },
    draw(c, V, lt, t) {
      let n = 0; const parts = MSG.split(' '); let acc = 0;
      msgW.forEach((w, i) => { acc += (parts[i] || '').length + 1; if (t >= w.s) n = Math.min(MSG.length, Math.round(acc - 1 - (1 - clamp((t - w.s) / Math.max(0.05, w.e - w.s))) * (parts[i] || '').length)); });
      phone(V, { glow: 1, notif: 1, typed: n, msg: MSG, from: 'Customer', badge: 'C', day: 'Friday', time: '6:01' });
    }, cues: msgW.map((w) => [w.s, 'type']) });
  add(titleCard(L(3).start - 0.05, 'WHAT IF YOU REPLIED', 'IN FIVE MINUTES?', [[wd(4, 5).e, 'land']]));

  add({ id: 'S06', at: cut(5, 0), note: 'shop one answers right away', cam: { x: 960, y: 470, w: 1700, pw: 1000 },
    draw(c, V, lt, t) { phone(V, { glow: 1, notif: 1, day: 'Friday', time: '6:05', badge: '1', from: 'Shop One', msg: 'Yes, come in!' }); },
    over(c, lt, t) { pill(c, 'REPLIED · 5 MIN', W / 2, PIC.y + PIC.h * (PORTRAIT ? 0.18 : 0.12), pop(t, wd(5, 3).s), { ring: '#7fd17a' }); },
    cues: [[cut(5, 0) + 0.1, 'buzz'], [wd(5, 3).s, 'blip']] });
  add({ id: 'S07', at: cut(6, 0), note: 'shop two answers next morning: nothing yet', hud: 0, cam: { x: 960, y: 470, w: 1700, pw: 1000 },
    draw(c, V, lt, t) { phone(V, { glow: 1, notif: 0, day: 'Saturday', time: '9:00', sub: t > wd(6, 4).s - 0.1 ? 'Shop Two: typing…' : 'No reply' }); },
    look: () => ({ tint: '#203050', tintA: 0.2 }), cues: [[wd(6, 4).s - 0.1, 'blip', { gain: 0.5 }]] });
  const walkA = cut(7, 0), walkB = L(7).end + 0.2;
  add({ id: 'S08', at: walkA, note: 'she has already paid: walks into shop one', cam: { x: 960, y: 470, w: 1920, px: 960, pw: 1150 },
    draw(c, V, lt, t) {
      shop(V, { dark: 0 });
      const wk = walk(t - walkA, 80, 380, 1, 380, FLOOR + 40, 6 / 24);
      V.chars(1, 0, SUN, (k) => figure(k, { kind: 'plain', h: 380, x: wk.x, y: FLOOR + 40, feet: wk.feet, bob: wk.bob, dir: 1, face: { expr: 'relieved', t, seed: 9, look: 1 } }));
    },
    over(c, lt, t) { pill(c, 'ALREADY PAID', W / 2, PIC.y + PIC.h * (PORTRAIT ? 0.2 : 0.14), pop(t, wd(7, 4).s), { bg: PAL.red }); },
    steps: { from: walkA, to: walkB, every: 6 / 24 }, cues: [[wd(7, 4).s, 'blip']] });
  const beatT = L(8).start;
  add({ id: 'S09', at: beatT - 0.05, note: 'beat: your face', cam: { x: 960, y: 480, w: 1920, pw: 1080 },
    draw(c, V, lt, t) {
      const B = makeView(c, { x: 1100, y: 470, w: 760, pw: 520 }, lt); living(B, { dark: 1, dof: 9 });
      V.chars(1, 0, { col: '#9fc3ff', w: 3, dx: 0.4, dy: -1 }, (k) => bigHead(k, 980, 500, 1900, { face: { expr: lt > 0.2 ? 'shocked' : 'worried', t, seed: 6, look: 0, noBlink: true } }));
    }, look: () => ({ tint: '#203050', tintA: 0.5 }), cues: [[beatT + 0.15, 'heart', { n: 1 }]] });
  add({ id: 'S10', at: cut(9, 0), note: "people don't pick the best shop", cam: { x: 960, y: 470, w: 1920, px: 1000, pw: 720 },
    draw(c, V, lt, t) { living(V, {}); phoneOnCouch(V, t, { rim: LAMP, expr: 'calm' }); } });
  const q = wd(10, 5).s;
  add({ id: 'S11', at: cut(10, 0), note: 'they pick the one that answers: shop window lights', cam: { x: 960, y: 420, w: 1920, push: 0.03, pushDur: 1.9, pw: 1000, px: 1000, py: 520 },
    draw(c, V, lt, t) { facade(V, { lit: eio((t - q) / 0.5) }); },
    over(c, lt, t) { pill(c, 'THE ONE THAT ANSWERS', W / 2, PIC.y + PIC.h * (PORTRAIT ? 0.2 : 0.12), pop(t, q + 0.2), { ring: '#7fd17a' }); },
    cues: [[q, 'blip']] });
  add({ id: 'S12', at: cut(11, 0), note: 'fast replies feel like care: you reply', cam: { x: 960, y: 480, w: 1920, push: 0.03, pushDur: 1.6, px: 1000, pw: 720 },
    draw(c, V, lt, t) { living(V, {}); phoneOnCouch(V, t, { rim: LAMP, glow: true, expr: 'relieved', seed: 3 }); },
    over(c, lt, t) { pill(c, 'FAST REPLY', W * (PORTRAIT ? 0.5 : 0.32), PIC.y + PIC.h * (PORTRAIT ? 0.2 : 0.16), pop(t, wd(11, 0).s), { ring: '#7fd17a' }); },
    cues: [[wd(11, 0).s, 'blip']] });
  add(endCard(L(11).end + 0.35, 'FAST REPLIES', 'FEEL LIKE CARE.'));
  return S;
}
