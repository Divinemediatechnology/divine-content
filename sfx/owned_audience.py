# SFX timeline for posts/OwnedAudience.tsx (frame numbers at 60fps must match the component).
import sys, os
sys.path.insert(0, os.path.dirname(__file__))
from sfxlib import *

FPS = 60
s = lambda fr: fr / FPS
FALL, ENV0, ENV_GAP, ENVS, OUTRO, UNDERLINE = 250, 100, 44, 3, 470, 510

tr = Track(660 / FPS)
tr.room()
tr.add(scribble(0.6, 0.22), s(6), 0.45)            # title written
tr.add(scribble(0.55, 0.10), s(22), 0.3)           # ground lines
tr.add(scribble(0.55, 0.10), s(26), 0.7)
for i in range(3):
    tr.add(pop(500 + 80 * i, 0.16), s(44 + 4 * i), 0.7)   # crowd appears
tr.add(scribble(0.5, 0.12), s(60), 0.7)            # house drawn
for k in range(ENVS):
    t0 = ENV0 + k * ENV_GAP
    tr.add(whoosh(0.18, 0.08), s(t0), 0.4)         # email sent
    tr.add(pop(700 + 90 * k, 0.16), s(t0 + 32), 0.7)   # lands in the house
    tr.add(plip(1100 + 60 * k, 0.22), s(t0 + 68), 0.7)  # coin into jar
tr.add(splash(0.5, 0.3), s(FALL + 18), 0.3)        # stage collapses
tr.add(sad_slide(1.0, 0.2), s(FALL + 20), 0.3)
tr.add(pop(420, 0.2), s(FALL + 74), 0.3)           # "stage gone..."
tr.add(sparkle(0.14), s(ENV0 + 2 * ENV_GAP + 72), 0.7)  # cheer
tr.add(whoosh(0.5, 0.28), s(OUTRO - 4), 0.5)
tr.add(scribble(0.5, 0.18), s(OUTRO + 10), 0.5)
tr.add(scribble(0.55, 0.22), s(UNDERLINE), 0.5)
tr.add(bell(587, 2.2, 0.22), s(UNDERLINE + 30), 0.5)
tr.add(bell(880, 2.0, 0.12), s(UNDERLINE + 30), 0.5)
tr.save(sys.argv[1])
print("ok")
