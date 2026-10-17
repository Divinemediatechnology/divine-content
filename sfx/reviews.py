# SFX timeline for posts/Reviews.tsx (frame numbers at 60fps must match the component).
import sys, os
sys.path.insert(0, os.path.dirname(__file__))
from sfxlib import *

FPS = 60
s = lambda fr: fr / FPS
ENTER, ARRIVE, BUY, B_ENTER, WHISPER, STAR0, STAR_GAP, QUEUE0, OUTRO, UNDERLINE = 50, 120, 125, 150, 255, 180, 15, 250, 470, 510

tr = Track(660 / FPS)
tr.room()
tr.add(scribble(0.6, 0.22), s(6), 0.45)            # title written
tr.add(scribble(0.55, 0.10), s(22), 0.3)           # ground lines
tr.add(scribble(0.55, 0.10), s(26), 0.7)
for fr in range(ENTER + 6, ARRIVE, 19):            # first customer walks in
    tr.add(tick(0.06), s(fr), 0.5)
tr.add(sparkle(0.16), s(BUY), 0.5)                 # first customer delighted
for fr in range(B_ENTER + 6, 230, 19):             # friend walks in (top)
    tr.add(tick(0.05), s(fr), 0.3)
tr.add(pop(380, 0.18), s(WHISPER), 0.3)            # whisper bubble (top)
for fr in range(345, 420, 19):                     # friend walks to the shop (top)
    tr.add(tick(0.05), s(fr), 0.3)
for i in range(5):                                 # five stars pop (bottom)
    tr.add(pop(520 + i * 70, 0.22), s(STAR0 + i * STAR_GAP), 0.7)
for k in range(4):                                 # queue forms (bottom)
    for fr in range(QUEUE0 + 18 * k + 6, QUEUE0 + 18 * k + 90, 19):
        tr.add(tick(0.05), s(fr), 0.7)
for i, fr in enumerate([BUY + 10, 430]):           # coins (top)
    tr.add(plip(1100 + 150 * i, 0.2), s(fr + 26), 0.3)
for i, fr in enumerate([BUY + 10, 350, 372, 394, 416]):  # coins (bottom)
    tr.add(plip(1000 + 120 * i, 0.2), s(fr + 26), 0.7)
tr.add(sparkle(0.14), s(340), 0.7)
tr.add(whoosh(0.5, 0.28), s(OUTRO - 4), 0.5)
tr.add(scribble(0.5, 0.18), s(OUTRO + 10), 0.5)
tr.add(scribble(0.55, 0.22), s(UNDERLINE), 0.5)
tr.add(bell(587, 2.2, 0.22), s(UNDERLINE + 30), 0.5)
tr.add(bell(880, 2.0, 0.12), s(UNDERLINE + 30), 0.5)
tr.save(sys.argv[1])
print("ok")
