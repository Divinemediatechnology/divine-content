# SFX timeline for posts/OneButton.tsx (frame numbers at 60fps must match the component).
import sys, os
sys.path.insert(0, os.path.dirname(__file__))
from sfxlib import *

FPS = 60
s = lambda fr: fr / FPS
BOARD0, BOARD1, SINGLE, REACH, PRESS, COIN0, OUTRO, UNDERLINE = 50, 120, 70, 150, 235, 245, 470, 510

tr = Track(660 / FPS)
tr.room()
tr.add(scribble(0.6, 0.22), s(6), 0.45)            # title written
tr.add(scribble(0.55, 0.10), s(22), 0.3)           # ground lines
tr.add(scribble(0.55, 0.10), s(26), 0.7)
for i, fr in enumerate(range(BOARD0, BOARD1, 5)):  # forty buttons pile up on the board
    tr.add(tick(0.07), s(fr), 0.3)
tr.add(pop(520, 0.25), s(SINGLE), 0.7)             # the one button pops in
tr.add(pop(420, 0.2), s(REACH + 30), 0.3)          # "? ? ?" bubble
tr.add(sad_slide(0.9, 0.14), s(320), 0.3)          # top: stuck
tr.add(tick(0.2), s(PRESS), 0.7)                   # click
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
