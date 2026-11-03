// WHAT IF YOU ONLY POSTED WHEN YOU FELT LIKE IT? (2026-11-04). Couch + shop + night facade shots from the kit.
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
  const PY2 = PIC.y + PIC.h * (PORTRAIT ? 0.2 : 0.14);
  const couch = (id, at, note, expr, label, lw, extra = {}) => add({ id, at, note, cam: { x: 960, y: 480, w: 1920, px: 1000, pw: 720, ...(extra.cam || {}) },
    draw(c, V, lt, t) { living(V, {}); phoneOnCouch(V, t, { rim: LAMP, glow: extra.glow, expr, seed: extra.seed || 2 }); },
    over(c, lt, t) { pill(c, label, W / 2, PY, pop(t, lw()), extra.pill || {}); },
    cues: [[lw(), 'blip']] });

  couch('S01', 0, 'you post five times', 'determined', 'FIVE POSTS THIS WEEK', () => wd(0, 2).s, { cam: { push: 0.03, pushDur: 1.8 }, glow: true });
  couch('S02', cut(1, 0), 'likes roll in, it feels great', 'relieved', 'LIKES ROLL IN', () => wd(1, 0).s, { glow: true, seed: 3, pill: { ring: '#7fd17a' } });
  add(titleCard(L(3).start - 0.05, 'WHAT IF YOU ONLY POSTED', 'WHEN YOU FELT LIKE IT?', [[wd(3, 9).e, 'land']]));
  add({ id: 'S04', at: cut(4, 0), note: 'week one: five posts, shop is lit', cam: { x: 960, y: 420, w: 1920, pw: 1000, px: 1000, py: 520 },
    draw(c, V, lt, t) { facade(V, { lit: 1 }); },
    over(c, lt, t) { pill(c, 'WEEK ONE: 5 POSTS', W / 2, PY2, pop(t, wd(4, 0).s), { ring: '#7fd17a' }); },
    cues: [[wd(4, 0).s, 'blip']] });
  add({ id: 'S05', at: cut(5, 0), note: 'week two: nothing, lights fade', cam: { x: 960, y: 420, w: 1920, pw: 1000, px: 1000, py: 520 },
    draw(c, V, lt, t) { facade(V, { lit: 1 - eio((t - wd(5, 2).s) / 0.6) }); },
    over(c, lt, t) { pill(c, 'WEEK TWO: NOTHING', W / 2, PY2, pop(t, wd(5, 0).s)); },
    cues: [[wd(5, 0).s, 'blip']] });
  add({ id: 'S06', at: cut(6, 0), note: 'week three: still nothing, dark', cam: { x: 960, y: 420, w: 1920, pw: 1000, px: 1000, py: 520 },
    draw(c, V, lt, t) { facade(V, { lit: 0 }); },
    over(c, lt, t) { pill(c, 'WEEK THREE: NOTHING', W / 2, PY2, pop(t, wd(6, 0).s), { bg: PAL.red }); },
    cues: [[wd(6, 0).s, 'blip']] });
  const walkA = cut(7, 0), walkB = L(7).end + 0.2;
  add({ id: 'S07', at: walkA, note: 'customer looks for you, page silent', cam: { x: 960, y: 470, w: 1700, pw: 1000 },
    draw(c, V, lt, t) { phone(V, { glow: 1, notif: 1, day: 'Friday', time: '6:00', badge: '?', from: 'Your page', msg: 'Last post: a month ago' }); },
    over(c, lt, t) { pill(c, 'YOUR PAGE IS SILENT', W / 2, PY, pop(t, wd(7, 5).s), { bg: PAL.red }); },
    cues: [[wd(7, 5).s, 'blip']] });
  add({ id: 'S08', at: cut(8, 0), note: 'she figures you have closed', cam: { x: 960, y: 470, w: 1920, px: 960, pw: 1150 },
    draw(c, V, lt, t) {
      shop(V, { dark: 0 });
      const wk = walk(t - cut(8, 0), 80, 380, 1, 380, FLOOR + 40, 6 / 24);
      V.chars(1, 0, SUN, (k) => figure(k, { kind: 'plain', h: 380, x: wk.x, y: FLOOR + 40, feet: wk.feet, bob: wk.bob, dir: 1, face: { expr: 'worried', t, seed: 9, look: 1 } }));
    },
    over(c, lt, t) { pill(c, 'MUST BE CLOSED', W / 2, PY2, pop(t, wd(8, 4).s), { bg: PAL.red }); },
    steps: { from: cut(8, 0), to: L(8).end + 0.2, every: 6 / 24 }, cues: [[wd(8, 4).s, 'blip']] });
  const beatT = L(9).start;
  add({ id: 'S09', at: beatT - 0.05, note: 'beat: your face', cam: { x: 960, y: 480, w: 1920, pw: 1080 },
    draw(c, V, lt, t) {
      const B = makeView(c, { x: 1100, y: 470, w: 760, pw: 520 }, lt); living(B, { dark: 1, dof: 9 });
      V.chars(1, 0, { col: '#9fc3ff', w: 3, dx: 0.4, dy: -1 }, (k) => bigHead(k, 980, 500, 1900, { face: { expr: lt > 0.2 ? 'shocked' : 'worried', t, seed: 6, look: 0, noBlink: true } }));
    }, look: () => ({ tint: '#203050', tintA: 0.5 }), cues: [[beatT + 0.15, 'heart', { n: 1 }]] });
  add({ id: 'S10', at: cut(10, 0), note: 'people do not follow bursts', cam: { x: 960, y: 470, w: 1920, px: 960, pw: 1150 },
    draw(c, V, lt, t) { shop(V, { dark: 0 }); },
    over(c, lt, t) { pill(c, 'NOT BURSTS', W / 2, PY2, pop(t, wd(10, 3).s), { bg: PAL.red }); },
    cues: [[wd(10, 3).s, 'blip']] });
  add({ id: 'S11', at: cut(11, 0), note: 'they follow a rhythm: shop window lights', cam: { x: 960, y: 420, w: 1920, push: 0.03, pushDur: 1.9, pw: 1000, px: 1000, py: 520 },
    draw(c, V, lt, t) { facade(V, { lit: eio((t - wd(11, 3).s) / 0.5) }); },
    over(c, lt, t) { pill(c, 'A RHYTHM', W / 2, PY2, pop(t, wd(11, 3).s), { ring: '#7fd17a' }); },
    cues: [[wd(11, 3).s, 'blip']] });
  couch('S12', cut(12, 0), 'a little, again and again', 'calm', 'A LITTLE, AGAIN AND AGAIN', () => wd(12, 0).s, { glow: true, seed: 4, cam: { push: 0.03, pushDur: 1.6 } });
  add({ id: 'S13', at: cut(13, 0), note: 'rhythm beats bursts', cam: { x: 960, y: 480, w: 1920, push: 0.03, pushDur: 1.6, px: 1000, pw: 720 },
    draw(c, V, lt, t) { living(V, {}); phoneOnCouch(V, t, { rim: LAMP, glow: true, expr: 'relieved', seed: 3 }); },
    over(c, lt, t) { pill(c, 'RHYTHM BEATS BURSTS', W / 2, PY, pop(t, wd(13, 0).s), { ring: '#7fd17a' }); },
    cues: [[wd(13, 0).s, 'blip']] });
  add(endCard(L(13).end + 0.35, 'KEEP A RHYTHM.', 'SMALL AND STEADY.'));
  return S;
}
