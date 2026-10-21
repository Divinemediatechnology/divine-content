# SFX timeline for posts/ShortForm.tsx (frame numbers at 60fps must match the component).
import sys, os
sys.path.insert(0, os.path.dirname(__file__))
from sfxlib import *

FPS = 60
s = lambda fr: fr / FPS
STEPS0, STEP_GAP, ONE, CLIMB, SEG, TIRED, LEAVE, DOWN, COIN0, OUTRO, UNDERLINE = 50, 9, 70, 130, 22, 238, 340, 14, 245, 470, 510

tr = Track(660 / FPS)
tr.room()
tr.add(scribble(0.6, 0.22), s(6), 0.45)            # title written
tr.add(scribble(0.55, 0.10), s(22), 0.3)           # ground lines
tr.add(scribble(0.55, 0.10), s(26), 0.7)
for i in range(7):                                  # stairs rise one by one
    tr.add(pop(300 + i * 40, 0.18), s(STEPS0 + i * STEP_GAP), 0.4)
tr.add(pop(700, 0.2), s(STEPS0 + 7 * STEP_GAP), 0.4)  # flag
tr.add(pop(520, 0.25), s(ONE), 0.7)                # the one step pops in
for k in range(1, 5):                              # top: footsteps up
    tr.add(tick(0.1), s(CLIMB + k * SEG), 0.6)
tr.add(tick(0.1), s(CLIMB + SEG), 0.6)             # bottom: one step up
tr.add(pop(420, 0.2), s(TIRED + 14), 0.3)          # "Still more?" bubble
tr.add(sad_slide(0.9, 0.14), s(LEAVE), 0.3)        # top: gives up
for k in range(1, 5):                              # footsteps back down
    tr.add(tick(0.08), s(LEAVE + k * DOWN), 0.4)
tr.add(tick(0.2), s(COIN0 - 4), 0.7)               # send
tr.add(sparkle(0.16), s(COIN0), 0.7)
tr.add(plip(1100, 0.22), s(COIN0 + 28), 0.7)       # coin lands
tr.add(sparkle(0.12), s(COIN0 + 32), 0.4)
tr.add(whoosh(0.5, 0.28), s(OUTRO - 4), 0.5)
tr.add(scribble(0.5, 0.18), s(OUTRO + 10), 0.5)
tr.add(scribble(0.55, 0.22), s(UNDERLINE), 0.5)
tr.add(bell(587, 2.2, 0.22), s(UNDERLINE + 30), 0.5)
tr.add(bell(880, 2.0, 0.12), s(UNDERLINE + 30), 0.5)
tr.save(sys.argv[1])
print("ok")
