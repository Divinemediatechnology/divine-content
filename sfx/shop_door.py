# SFX timeline for posts/ShopDoor.tsx (frame numbers at 60fps must match the component).
import sys, os
sys.path.insert(0, os.path.dirname(__file__))
from sfxlib import *

FPS = 60
s = lambda fr: fr / FPS
OPEN_AT, SPEED, OUTRO, UNDERLINE = 50, 6, 430, 470
KNOCKS, SHRUG, LEAVE = [118, 138, 158], 190, 232
GATE = 735
ENTRANTS = [(40, 90), (90, -60), (140, -60)]

tr = Track(600 / FPS)
tr.room()
tr.add(scribble(0.6, 0.22), s(6), 0.45)            # title written
tr.add(scribble(0.55, 0.10), s(22), 0.3)           # ground lines
tr.add(scribble(0.55, 0.10), s(26), 0.7)
for k in KNOCKS:
    tr.add(pop(190, 0.12), s(k + 3), 0.7)          # knock on the stuck door
tr.add(sad_slide(1.0, 0.2), s(SHRUG + 6), 0.3)     # shrug
tr.add(whoosh(0.4, 0.14), s(OPEN_AT), 0.6)         # door swings open
tr.add(sparkle(0.14), s(OPEN_AT + 12), 0.6)
for fr in range(36, 120, 14):                      # footsteps, top walker
    tr.add(tick(0.03), s(fr), 0.3)
for f0, x0 in ENTRANTS:
    arrive = f0 + (GATE - x0) / SPEED
    for fr in range(int(f0), int(arrive), 15):
        tr.add(tick(0.03), s(fr), 0.7)
    tr.add(pop(900, 0.18), s(arrive), 0.7)          # coin
    tr.add(bell(1318, 0.9, 0.1), s(arrive), 0.7)
tr.add(whoosh(0.5, 0.28), s(OUTRO - 4), 0.5)
tr.add(scribble(0.5, 0.18), s(OUTRO + 10), 0.5)
tr.add(scribble(0.55, 0.22), s(UNDERLINE), 0.5)
tr.add(bell(587, 2.2, 0.22), s(UNDERLINE + 30), 0.5)
tr.add(bell(880, 2.0, 0.12), s(UNDERLINE + 30), 0.5)
tr.save(sys.argv[1])
print("ok")
