# SFX timeline for posts/Followers.tsx (frame numbers at 60fps must match the component).
import sys, os
sys.path.insert(0, os.path.dirname(__file__))
from sfxlib import *

FPS = 60
s = lambda fr: fr / FPS
CROWD0, GAP, SHOUT, SHRUG, WALK0, COIN0, COIN_GAP, FLY, OUTRO, UNDERLINE = 50, 5, 170, 300, 60, 190, 28, 24, 462, 505

tr = Track(660 / FPS)
tr.room()
tr.add(scribble(0.6, 0.22), s(6), 0.45)            # title written
tr.add(scribble(0.55, 0.10), s(22), 0.3)           # ground lines
tr.add(scribble(0.55, 0.10), s(26), 0.7)
for i in range(8):                                  # crowd pops in
    tr.add(pop(420 + i * 40, 0.16), s(CROWD0 + i * GAP * 2), 0.3)
for k in range(10):                                 # follower counter ticking
    tr.add(tick(0.06), s(CROWD0 + k * 10), 0.5)
for i in range(5):                                  # friends walk in
    tr.add(whoosh(0.25, 0.08), s(WALK0 + i * 8), 0.3)
tr.add(whoosh(0.4, 0.14), s(SHOUT), 0.4)            # seller shouts
tr.add(whoosh(0.4, 0.14), s(SHOUT + 50), 0.4)
tr.add(sad_slide(1.3, 0.2), s(SHRUG + 10), 0.35)    # nobody buys
for i in range(5):                                  # coins land
    t0 = COIN0 + i * COIN_GAP
    tr.add(whoosh(0.15, 0.08), s(t0), 0.3)
    tr.add(plip(1100 + 150 * i, 0.22), s(t0 + FLY), 0.55)
tr.add(sparkle(0.2), s(COIN0 + 4 * COIN_GAP + FLY + 8), 0.4)
tr.add(whoosh(0.5, 0.28), s(OUTRO - 4), 0.5)
tr.add(scribble(0.5, 0.18), s(OUTRO + 10), 0.5)
tr.add(scribble(0.55, 0.22), s(UNDERLINE), 0.5)
tr.add(bell(587, 2.2, 0.22), s(UNDERLINE + 30), 0.5)
tr.add(bell(880, 2.0, 0.12), s(UNDERLINE + 30), 0.5)
tr.save(sys.argv[1])
print("ok")
