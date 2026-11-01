// WHAT IF YOUR WEBSITE TOOK TEN SECONDS TO LOAD? (2026-11-02). Phone + shop + couch shots from the kit.
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

  const PY = PIC.y + PIC.h * (PORTRAIT ? 0.18 : 0.12);
  add({ id: 'S01', at: 0, note: 'customer on her couch with her phone', cam: { x: 960, y: 470, w: 1920, push: 0.03, pushDur: 1.8, px: 1000, pw: 720 },
    draw(c, V, lt, t) { living(V, {}); phoneOnCouch(V, t, { rim: LAMP, expr: 'determined' }); },
    over(c, lt) { stamp(c, 'A CUSTOMER SEES YOUR AD', pop(lt, 0.3, 4)); },
    cues: [[0.2, 'swell', { dur: 2.4 }]] });
  add({ id: 'S02', at: cut(1, 0), note: 'she taps your link', cam: { x: 960, y: 470, w: 1700, pw: 1000 },
    draw(c, V, lt, t) { phone(V, { glow: 1, notif: 1, day: 'Friday', time: '6:00', badge: 'W', from: 'Your website', msg: 'Opening your link…' }); },
    over(c, lt, t) { pill(c, 'TAPS YOUR LINK', W / 2, PY, pop(t, wd(1, 1).s)); },
    cues: [[wd(1, 1).s, 'blip']] });
  add(titleCard(L(3).start - 0.05, 'WHAT IF YOUR WEBSITE', 'TOOK TEN SECONDS?', [[wd(3, 8).e, 'land']]));
  add({ id: 'S04', at: cut(4, 0), note: 'one second: blank screen', cam: { x: 960, y: 470, w: 1700, pw: 1000 },
    draw(c, V, lt, t) { phone(V, { glow: 0.5, notif: 0, day: 'Friday', time: '6:00', sub: 'Loading…' }); },
    over(c, lt, t) { pill(c, '1 SECOND', W / 2, PY, pop(t, wd(4, 0).s)); },
    cues: [[wd(4, 0).s, 'blip']] });
  add({ id: 'S05', at: cut(5, 0), note: 'five seconds: just a spinner', cam: { x: 960, y: 470, w: 1700, pw: 1000 },
    draw(c, V, lt, t) { phone(V, { glow: 1, notif: 1, day: 'Friday', time: '6:00', badge: '…', from: 'Your website', msg: 'Still loading…', sub: 'Loading…' }); },
    over(c, lt, t) { pill(c, '5 SECONDS', W / 2, PY, pop(t, wd(5, 0).s)); },
    cues: [[wd(5, 0).s, 'blip']] });
  add({ id: 'S06', at: cut(6, 0), note: 'ten seconds: she taps back', cam: { x: 960, y: 470, w: 1700, pw: 1000 },
    draw(c, V, lt, t) { const gone = t > wd(6, 3).s; phone(V, { glow: 1, notif: gone ? 0 : 1, day: 'Friday', time: '6:00', badge: '…', from: 'Your website', msg: 'Still loading…', sub: gone ? 'Page closed' : 'Loading…' }); },
    over(c, lt, t) { pill(c, '10 SECONDS', W / 2, PY, pop(t, wd(6, 0).s), { bg: PAL.red }); },
    cues: [[wd(6, 0).s, 'blip'], [wd(6, 3).s, 'blip', { gain: 0.6 }]] });
  const walkA = cut(7, 0), walkB = L(7).end + 0.2;
  add({ id: 'S07', at: walkA, note: 'she buys from the next shop', cam: { x: 960, y: 470, w: 1920, px: 960, pw: 1150 },
    draw(c, V, lt, t) {
      shop(V, { dark: 0 });
      const wk = walk(t - walkA, 80, 380, 1, 380, FLOOR + 40, 6 / 24);
      V.chars(1, 0, SUN, (k) => figure(k, { kind: 'plain', h: 380, x: wk.x, y: FLOOR + 40, feet: wk.feet, bob: wk.bob, dir: 1, face: { expr: 'relieved', t, seed: 9, look: 1 } }));
    },
    over(c, lt, t) { pill(c, 'BOUGHT ELSEWHERE', W / 2, PIC.y + PIC.h * (PORTRAIT ? 0.2 : 0.14), pop(t, wd(7, 2).s), { bg: PAL.red }); },
    steps: { from: walkA, to: walkB, every: 6 / 24 }, cues: [[wd(7, 2).s, 'blip']] });
  const beatT = L(8).start;
  add({ id: 'S08', at: beatT - 0.05, note: 'beat: your face', cam: { x: 960, y: 480, w: 1920, pw: 1080 },
    draw(c, V, lt, t) {
      const B = makeView(c, { x: 1100, y: 470, w: 760, pw: 520 }, lt); living(B, { dark: 1, dof: 9 });
      V.chars(1, 0, { col: '#9fc3ff', w: 3, dx: 0.4, dy: -1 }, (k) => bigHead(k, 980, 500, 1900, { face: { expr: lt > 0.2 ? 'shocked' : 'worried', t, seed: 6, look: 0, noBlink: true } }));
    }, look: () => ({ tint: '#203050', tintA: 0.5 }), cues: [[beatT + 0.15, 'heart', { n: 1 }]] });
  add({ id: 'S09', at: cut(9, 0), note: "people don't wait for good websites", cam: { x: 960, y: 470, w: 1920, px: 1000, pw: 720 },
    draw(c, V, lt, t) { living(V, {}); phoneOnCouch(V, t, { rim: LAMP, expr: 'calm' }); } });
  const q = wd(10, 6).s;
  add({ id: 'S10', at: cut(10, 0), note: 'they go to the one that opens: shop window lights', cam: { x: 960, y: 420, w: 1920, push: 0.03, pushDur: 1.9, pw: 1000, px: 1000, py: 520 },
    draw(c, V, lt, t) { facade(V, { lit: eio((t - q) / 0.5) }); },
    over(c, lt, t) { pill(c, 'THE ONE THAT OPENS', W / 2, PIC.y + PIC.h * (PORTRAIT ? 0.2 : 0.12), pop(t, q + 0.1), { ring: '#7fd17a' }); },
    cues: [[q, 'blip']] });
  add({ id: 'S11', at: cut(11, 0), note: 'your website is your front door', cam: { x: 960, y: 470, w: 1920, px: 960, pw: 1150 },
    draw(c, V, lt, t) { shop(V, { dark: 0 }); },
    over(c, lt, t) { pill(c, 'YOUR FRONT DOOR', W / 2, PIC.y + PIC.h * (PORTRAIT ? 0.2 : 0.14), pop(t, wd(11, 3).s)); },
    cues: [[wd(11, 3).s, 'blip']] });
  add({ id: 'S12', at: cut(12, 0), note: 'open it fast: you relieved on the couch', cam: { x: 960, y: 480, w: 1920, push: 0.03, pushDur: 1.6, px: 1000, pw: 720 },
    draw(c, V, lt, t) { living(V, {}); phoneOnCouch(V, t, { rim: LAMP, glow: true, expr: 'relieved', seed: 3 }); },
    over(c, lt, t) { pill(c, 'OPEN IT FAST', W * (PORTRAIT ? 0.5 : 0.32), PIC.y + PIC.h * (PORTRAIT ? 0.2 : 0.16), pop(t, wd(12, 0).s), { ring: '#7fd17a' }); },
    cues: [[wd(12, 0).s, 'blip']] });
  add(endCard(L(12).end + 0.35, 'OPEN YOUR DOOR', 'FAST.'));
  return S;
}
