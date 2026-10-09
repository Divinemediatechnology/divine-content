# SFX timeline for posts/Consistency.tsx (frame numbers at 60fps must match the component).
import sys, os
sys.path.insert(0, os.path.dirname(__file__))
from sfxlib import *

FPS = 60
s = lambda fr: fr / FPS
DAY0, GAP, DAYS, POUR, WILT, OUTRO, UNDERLINE = 90, 12, 30, 105, 190, 462, 505

tr = Track(660 / FPS)
tr.room()
tr.add(scribble(0.6, 0.22), s(6), 0.45)            # title written
tr.add(scribble(0.55, 0.10), s(22), 0.3)           # ground lines
tr.add(scribble(0.55, 0.10), s(26), 0.7)
tr.add(whoosh(0.35, 0.12), s(POUR - 10), 0.6)      # bucket lift
tr.add(pour(0.75, 0.35), s(POUR + 6), 0.4)
tr.add(splash(1.0, 0.6), s(POUR + 18), 0.3)        # big splash on the plant
tr.add(pop(700, 0.25), s(POUR + 25), 0.3)          # one leaf
tr.add(sad_slide(1.3, 0.2), s(WILT + 10), 0.3)     # wilts
tr.add(pop(260, 0.3), s(172), 0.65)                # bucket dropped
for k in range(DAYS):
    t0 = DAY0 + k * GAP
    tr.add(tick(0.07), s(t0), 0.85)
    for d in range(2):
        tr.add(plip(850 + 180 * ((k + d) % 4), 0.16), s(t0 + 13 + d * 3), 0.35)
for i in range(9):
    tr.add(pop(480 + i * 45, 0.22), s(DAY0 + (i * 3 + 2) * GAP + 6), 0.35)
tr.add(sparkle(0.2), s(DAY0 + DAYS * GAP + 4), 0.4)  # flower blooms
tr.add(whoosh(0.5, 0.28), s(OUTRO - 4), 0.5)
tr.add(scribble(0.5, 0.18), s(OUTRO + 10), 0.5)
tr.add(scribble(0.55, 0.22), s(UNDERLINE), 0.5)
tr.add(bell(587, 2.2, 0.22), s(UNDERLINE + 30), 0.5)
tr.add(bell(880, 2.0, 0.12), s(UNDERLINE + 30), 0.5)
tr.save(sys.argv[1])
print("ok")
