// WHAT IF YOU STOPPED POSTING FOR 30 DAYS? — reference post for the Divine Media stickman kit (2026-10-30).
// One picture per clause; cuts land 3 frames before their word (cut(line, word)); faces change on the word that matters.
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

  // ── COLD OPEN ───────────────────────────────────────────────────────────────────────────────
  add({ id: 'S01', at: 0, note: 'wide: you on the couch, late', cam: { x: 960, y: 470, w: 1920, push: 0.03, pushDur: 1.8, px: 1000, pw: 720 },
    draw(c, V, lt, t) {
      living(V, {});
      V.chars(1, 0, LAMP, (k) => hero(k, { ...sitting(1000), face: { expr: 'calm', t, seed: 1, look: -0.2 } }));
    },
    over(c, lt) { stamp(c, 'HOME · 11:40 P.M.', pop(lt, 0.3, 4)); },
    cues: [[0.2, 'swell', { dur: 2.4 }]] });
  add({ id: 'S02', at: cut(0, 5), note: 'close: and you are busy', cam: { x: 960, y: 480, w: 1920, pw: 1080 },
    draw(c, V, lt, t) {
      const B = makeView(c, { x: 1100, y: 430, w: 760, pw: 520 }, lt); living(B, { dof: 9 });
      V.chars(1, 0, { ...LAMP, w: 3 }, (k) => bigHead(k, 960, 500, 1900, { face: { expr: t > wd(0, 7).s ? 'worried' : 'neutral', t, seed: 1, look: 0.3 } }));
    },
    over(c, lt, t) { pill(c, 'TOO BUSY', W / 2, PIC.y + PIC.h * (PORTRAIT ? 0.2 : 0.16), pop(t, wd(0, 7).s)); },
    cues: [[wd(0, 7).s, 'blip']] });
  const offT = wd(1, 2).s;
  add({ id: 'S03', at: cut(1, 0), note: 'phone: you stop posting, the screen goes dark', cam: { x: 960, y: 470, w: 1700, pw: 1000 },
    draw(c, V, lt, t) { phone(V, { glow: 1 - eio((t - offT) / 0.35), notif: 1, day: 'Monday', time: '11:41', badge: '+', from: 'New post', msg: 'Draft saved. Post later?' }); },
    over(c, lt, t) { pill(c, 'POSTING · OFF', W / 2, PIC.y + PIC.h * (PORTRAIT ? 0.16 : 0.12), pop(t, wd(1, 3).s), { bg: PAL.red }); },
    cues: [[offT, 'click'], [wd(1, 3).s, 'powerdown', { gain: 0.5 }]] });
  add({ id: 'S04', at: cut(1, 4), note: 'just for a while: you lean back', cam: { x: 920, y: 470, w: 1300, px: 960, pw: 760 },
    draw(c, V, lt, t) {
      living(V, { dof: 2 });
      const k = eio(lt / 0.5);
      V.chars(1, 0, LAMP, (q) => hero(q, { ...sitting(1000, HH, { lean: -0.12 * k }), face: { expr: lt > 0.4 ? 'relieved' : 'calm', t, seed: 1, look: 0.2 } }));
    }, cues: [[cut(1, 4) + 0.1, 'cloth', { dur: 0.4, gain: 0.6 }]] });
  add(titleCard(L(2).start - 0.05, 'WHAT IF YOU STOPPED POSTING', 'FOR 30 DAYS?', [[wd(3, 6).e, 'land']]));

  // ── THE 30 DAYS ─────────────────────────────────────────────────────────────────────────────
  add({ id: 'S06', at: cut(4, 0), note: 'day 1: nothing happens', hud: 1, hudLabel: 'DAY', cam: { x: 960, y: 470, w: 1920, px: 1000, pw: 720 },
    draw(c, V, lt, t) { living(V, {}); phoneOnCouch(V, t, { rim: LAMP, expr: 'calm' }); },
    over(c, lt, t) { pill(c, 'NOTHING HAPPENS', W * (PORTRAIT ? 0.5 : 0.3), PIC.y + PIC.h * (PORTRAIT ? 0.2 : 0.16), pop(t, wd(4, 2).s)); },
    cues: [[wd(4, 2).s, 'blip']] });
  add({ id: 'S07', at: cut(5, 0), note: 'day 10: your phone gets quiet', hud: 10, hudLabel: 'DAY', cam: { x: 960, y: 470, w: 1700, pw: 1000 },
    draw(c, V, lt, t) { phone(V, { glow: 1, notif: 0, day: 'Day 10', time: '9:00', sub: t > wd(5, 5).s - 0.1 ? 'No new messages' : null }); },
    look: () => ({ tint: '#203050', tintA: 0.2 }), cues: [[wd(5, 5).s - 0.1, 'blip', { gain: 0.5 }]] });
  const walkA = cut(6, 0), walkB = L(6).end + 0.2;
  add({ id: 'S08', at: walkA, note: 'day 20: a customer walks right past your shop', hud: 20, hudLabel: 'DAY', cam: { x: 960, y: 470, w: 1920, px: 960, pw: 1150 },
    draw(c, V, lt, t) {
      shop(V, { dark: 0 });
      const v = 520, wk = walk(t - walkA, 80, v, 1, 380, FLOOR + 40, 6 / 24);
      const glance = t > wd(6, 5).s && t < wd(6, 6).e;
      V.chars(1, 0, SUN, (k) => figure(k, { kind: 'plain', h: 380, x: wk.x, y: FLOOR + 40, feet: wk.feet, bob: wk.bob, dir: 1, face: { expr: 'calm', t, seed: 9, look: glance ? -0.8 : 1, turn: glance ? -0.3 : 0 } }));
    },
    over(c, lt, t) { pill(c, 'WALKED RIGHT PAST', W / 2, PIC.y + PIC.h * (PORTRAIT ? 0.2 : 0.14), pop(t, wd(6, 6).s)); },
    steps: { from: walkA, to: walkB, every: 6 / 24 }, cues: [[wd(6, 6).s, 'blip']] });
  const buzzT = wd(7, 4).s;
  add({ id: 'S09', at: cut(7, 0), note: 'day 30: your phone lights up', hud: 30, hudLabel: 'DAY', cam: { x: 980, y: 520, w: 1050, pw: 640 },
    draw(c, V, lt, t) { living(V, { dark: 1, dof: 5 }); phoneOnCouch(V, t, { rim: MOON, glow: t > buzzT, expr: t > buzzT ? 'neutral' : 'calm', seed: 5 }); },
    look: () => ({ tint: '#203050' }), cues: [[buzzT, 'buzz']] });
  const msgW = T.words.filter((w) => w.line === 8), MSG = 'Are you still open?';
  add({ id: 'S10', at: cut(8, 0), note: 'the message: are you still open?', hud: 30, hudLabel: 'DAY', cam: { x: 960, y: 470, w: 900, pw: 640, py: 480 },
    draw(c, V, lt, t) {
      let n = 0; const parts = MSG.split(' '); let acc = 0;
      msgW.forEach((w, i) => { acc += (parts[i] || '').length + 1; if (t >= w.s) n = Math.min(MSG.length, Math.round(acc - 1 - (1 - clamp((t - w.s) / Math.max(0.05, w.e - w.s))) * (parts[i] || '').length)); });
      phone(V, { glow: 1, notif: 1, typed: n, msg: MSG, from: 'Customer', badge: 'C', day: 'Day 30', time: '7:12' });
    }, cues: msgW.map((w) => [w.s, 'type']) });
  const beatT = L(9).start;
  add({ id: 'S11', at: beatT - 0.05, note: 'beat: your face', cam: { x: 960, y: 480, w: 1920, pw: 1080 },
    draw(c, V, lt, t) {
      const B = makeView(c, { x: 1100, y: 470, w: 760, pw: 520 }, lt); living(B, { dark: 1, dof: 9 });
      V.chars(1, 0, { col: '#9fc3ff', w: 3, dx: 0.4, dy: -1 }, (k) => bigHead(k, 980, 500, 1900, { face: { expr: lt > 0.2 ? 'shocked' : 'worried', t, seed: 6, look: 0, noBlink: true } }));
    }, look: () => ({ tint: '#203050', tintA: 0.5 }), cues: [[beatT + 0.15, 'heart', { n: 1 }]] });

  // ── THE POINT ───────────────────────────────────────────────────────────────────────────────
  add({ id: 'S12', at: cut(10, 0), note: "people don't forget you because you're bad", cam: { x: 960, y: 470, w: 1920, px: 1000, pw: 720 },
    draw(c, V, lt, t) {
      living(V, { dark: 1 });
      V.chars(1, 0, MOON, (k) => hero(k, { ...sitting(1000, HH, { lean: 0.3 }), face: { expr: 'worried', t, seed: 7, look: 0, eyeY: 0.3 } }));
    }, look: () => ({ tint: '#203050' }) });
  const quietT = wd(11, 6).s;
  add({ id: 'S13', at: cut(11, 0), note: 'they forget you because you went quiet: your window goes dark', cam: { x: 960, y: 420, w: 1920, push: 0.03, pushDur: 1.9, pw: 1000, px: 1000, py: 520 },
    draw(c, V, lt, t) { facade(V, { lit: 1 - eio((t - quietT) / 0.5) }); },
    over(c, lt, t) { pill(c, 'GONE QUIET', W / 2, PIC.y + PIC.h * (PORTRAIT ? 0.2 : 0.12), pop(t, quietT + 0.2), { bg: PAL.red }); },
    cues: [[quietT, 'powerdown', { gain: 0.6 }], [L(11).start, 'night', { dur: 2.6 }]] });
  const upAt = wd(12, 0).s;
  add({ id: 'S14', at: cut(12, 0), note: 'show up a little, every day: you stand up', cam: { x: 960, y: 480, w: 1920, push: 0.03, pushDur: 1.6, px: 1000, pw: 720 },
    draw(c, V, lt, t) {
      living(V, {});
      const u = eio((t - upAt) / 0.45), g = t > wd(12, 4).s;
      V.chars(1, 0, LAMP, (k) => {
        const p = hero(k, { ...sitting(1000, HH, { u, lean: Math.sin(u * Math.PI) * 0.35, hands: u > 0.9 ? [[840, 560], [870, 520]] : undefined }), hand: 'mitten', face: { expr: u > 0.5 ? 'determined' : 'calm', t, seed: 1, look: -0.4 } });
        if (u > 0.9) { k.fillStyle = g ? '#cfe0ff' : '#0b0c10'; rr(k, 850, 470, 40, 66, 7); k.fill(); }
      });
    },
    over(c, lt, t) { pill(c, 'POST · DAY 31', W * (PORTRAIT ? 0.5 : 0.32), PIC.y + PIC.h * (PORTRAIT ? 0.2 : 0.16), pop(t, wd(12, 4).s), { ring: '#7fd17a' }); },
    cues: [[upAt, 'cloth', { dur: 0.45, gain: 0.6 }], [upAt + 0.45, 'step', { gain: 0.7 }], [wd(12, 4).s, 'blip']] });
  add(endCard(L(12).end + 0.35, 'SHOW UP.', 'A LITTLE, EVERY DAY.'));
  return S;
}

