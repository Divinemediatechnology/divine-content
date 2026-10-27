# SFX timeline for posts/LeadQuality.tsx (frame numbers at 60fps must match the component).
import sys, os
sys.path.insert(0, os.path.dirname(__file__))
from sfxlib import *

FPS = 60
s = lambda fr: fr / FPS
ROCK0, ROCK_GAP, ROCKS, ASK, SHRUG = 70, 9, 16, 245, 320
COIN_IN0, COIN_GAP, COINS, CONV0, CONV_GAP, CONV_DUR, OUTRO, UNDERLINE = 100, 28, 5, 300, 22, 40, 470, 510

tr = Track(660 / FPS)
tr.room()
tr.add(scribble(0.6, 0.22), s(6), 0.45)            # title written
tr.add(scribble(0.55, 0.10), s(22), 0.3)           # ground lines
tr.add(scribble(0.55, 0.10), s(26), 0.7)
for i in range(ROCKS):                             # rocks thud into the bucket
    tr.add(pop(170 + (i % 3) * 25, 0.2), s(ROCK0 + i * ROCK_GAP + 14), 0.3)
tr.add(pop(420, 0.2), s(ASK), 0.4)                 # "Any buyers?"
tr.add(sad_slide(1.2, 0.18), s(SHRUG + 4), 0.3)
for i in range(COINS):
    tr.add(plip(1200 + 90 * i, 0.22), s(COIN_IN0 + i * COIN_GAP + 16), 0.7)   # coin lands in bowl
    tr.add(sparkle(0.08), s(COIN_IN0 + i * COIN_GAP + 16), 0.7)
    tr.add(whoosh(0.2, 0.08), s(CONV0 + i * CONV_GAP), 0.6)
    tr.add(plip(1000 + 110 * i, 0.24), s(CONV0 + i * CONV_GAP + CONV_DUR), 0.8)  # coin into jar
tr.add(sparkle(0.16), s(CONV0 + 4 * CONV_GAP + CONV_DUR + 6), 0.5)
tr.add(whoosh(0.5, 0.28), s(OUTRO - 4), 0.5)
tr.add(scribble(0.5, 0.18), s(OUTRO + 10), 0.5)
tr.add(scribble(0.55, 0.22), s(UNDERLINE), 0.5)
tr.add(bell(587, 2.2, 0.22), s(UNDERLINE + 30), 0.5)
tr.add(bell(880, 2.0, 0.12), s(UNDERLINE + 30), 0.5)
tr.save(sys.argv[1])
print("ok")
