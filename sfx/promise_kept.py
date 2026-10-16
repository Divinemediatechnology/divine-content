# SFX timeline for posts/PromiseKept.tsx (frame numbers at 60fps must match the component).
import sys, os
sys.path.insert(0, os.path.dirname(__file__))
from sfxlib import *

FPS = 60
s = lambda fr: fr / FPS
ENTER, ARRIVE, OFFER, REACT, LEAVE, FRIENDS, OUTRO, UNDERLINE = 70, 160, 170, 225, 290, 300, 500, 540

tr = Track(690 / FPS)
tr.room()
tr.add(scribble(0.6, 0.22), s(6), 0.45)            # title written
tr.add(scribble(0.55, 0.10), s(22), 0.3)           # ground lines
tr.add(scribble(0.55, 0.10), s(26), 0.7)
for fr in range(ENTER + 6, ARRIVE, 19):            # footsteps in
    tr.add(tick(0.06), s(fr), 0.5)
tr.add(whoosh(0.3, 0.1), s(OFFER - 6), 0.5)        # plate held out
tr.add(pop(420, 0.2), s(OFFER + 8), 0.3)           # crumb appears (top)
tr.add(pop(620, 0.25), s(OFFER + 8), 0.7)          # cake appears (bottom)
tr.add(sad_slide(1.2, 0.2), s(REACT + 4), 0.3)     # shrug (top)
tr.add(sparkle(0.16), s(REACT + 2), 0.7)           # delight (bottom)
for fr in range(LEAVE + 8, LEAVE + 100, 20):       # top customer walks away
    tr.add(tick(0.05), s(fr), 0.3)
for fr in range(FRIENDS + 6, FRIENDS + 90, 18):    # friends arrive
    tr.add(tick(0.06), s(fr), 0.7)
for i, fr in enumerate([REACT + 22, FRIENDS + 110, FRIENDS + 128]):  # coins into the jar
    tr.add(plip(1100 + 150 * i, 0.2), s(fr + 26), 0.7)
tr.add(sparkle(0.14), s(FRIENDS + 100), 0.7)
tr.add(whoosh(0.5, 0.28), s(OUTRO - 4), 0.5)
tr.add(scribble(0.5, 0.18), s(OUTRO + 10), 0.5)
tr.add(scribble(0.55, 0.22), s(UNDERLINE), 0.5)
tr.add(bell(587, 2.2, 0.22), s(UNDERLINE + 30), 0.5)
tr.add(bell(880, 2.0, 0.12), s(UNDERLINE + 30), 0.5)
tr.save(sys.argv[1])
print("ok")
