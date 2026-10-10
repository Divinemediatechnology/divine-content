# SFX timeline for posts/Boosting.tsx (frame numbers at 60fps must match the component).
import sys, os, math
sys.path.insert(0, os.path.dirname(__file__))
from sfxlib import *

FPS = 60
s = lambda fr: fr / FPS
OUTRO, UNDERLINE = 430, 470
SHOTS = [(100, 1, 20), (145, -1, 12), (190, 1, 75), (235, 1, 5), (280, -1, 40), (325, 1, 30)]
FIG_X, TGT_X, SPEED, GRAV, TOP_G = 330, 880, 10, 0.35, 640
RELEASE, BOT_SPEED = 250, 26
HIT = RELEASE + math.ceil((TGT_X - (FIG_X + 78)) / BOT_SPEED)

def landing(d, aim):
    a = math.radians(aim)
    x0 = FIG_X + d * 78 * math.cos(a); y0 = TOP_G - 138 - 78 * math.sin(a)
    vx = d * SPEED * math.cos(a); vy = -SPEED * math.sin(a)
    t = 0.0
    while t < 220:
        x = x0 + vx * t; y = y0 + vy * t + 0.5 * GRAV * t * t
        if y >= TOP_G: return t
        if x < -120 or x > 1200: return None
        t += 0.5
    return None

tr = Track(600 / FPS)
tr.room()
tr.add(scribble(0.6, 0.22), s(6), 0.45)            # title written
tr.add(scribble(0.55, 0.10), s(22), 0.3)           # ground lines
tr.add(scribble(0.55, 0.10), s(26), 0.7)
tr.add(pop(600, 0.2), s(52), 0.3)                  # targets pop in
for sf, d, a in SHOTS:
    tr.add(pop(210, 0.3), s(sf), 0.6)              # bow twang
    tr.add(whoosh(0.3, 0.14), s(sf + 1), 0.45)
    tr.add(plip(1100, 0.18), s(sf + 4), 0.35)      # coin spent
    t = landing(d, a)
    if t is not None:
        tr.add(pop(150, 0.25), s(sf + t), 0.5)     # thunk in the ground
for k in range(6):
    tr.add(tick(0.07), s(120 + k * 7), 0.4)        # sight line drawing
tr.add(tick(0.1), s(190), 0.7)                     # pull back
tr.add(pop(230, 0.3), s(RELEASE), 0.65)
tr.add(whoosh(0.2, 0.2), s(RELEASE + 1), 0.6)
tr.add(pop(170, 0.4), s(HIT), 0.85)                # bullseye thud
tr.add(sparkle(0.2), s(HIT + 4), 0.4)
tr.add(whoosh(0.5, 0.28), s(OUTRO - 4), 0.5)
tr.add(scribble(0.5, 0.18), s(OUTRO + 10), 0.5)
tr.add(scribble(0.55, 0.22), s(UNDERLINE), 0.5)
tr.add(bell(587, 2.2, 0.22), s(UNDERLINE + 30), 0.5)
tr.add(bell(880, 2.0, 0.12), s(UNDERLINE + 30), 0.5)
tr.save(sys.argv[1])
print("ok")
