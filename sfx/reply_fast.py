# SFX timeline for posts/ReplyFast.tsx (frame numbers at 60fps must match the component).
import sys, os
sys.path.insert(0, os.path.dirname(__file__))
from sfxlib import *

FPS = 60
s = lambda fr: fr / FPS
SEND, REPLY, CLOCK_TOP, SHRUG, LEAVE, CHEER, THROW, COIN_LAND, OUTRO, UNDERLINE = 60, 100, 70, 195, 235, 150, 165, 205, 430, 470

tr = Track(600 / FPS)
tr.room()
tr.add(scribble(0.6, 0.22), s(6), 0.45)            # title written
tr.add(scribble(0.55, 0.10), s(22), 0.3)           # ground lines
tr.add(scribble(0.55, 0.10), s(26), 0.7)
tr.add(pop(700, 0.1), s(SEND + 2), 0.3)            # message sent (top)
tr.add(pop(700, 0.1), s(SEND + 2), 0.7)            # message sent (bottom)
for fr in range(CLOCK_TOP, SHRUG, 12):             # slow clock ticking
    tr.add(tick(0.06), s(fr), 0.3)
tr.add(pop(540, 0.12), s(REPLY + 2), 0.7)          # instant reply
tr.add(sparkle(0.12), s(REPLY + 8), 0.7)
tr.add(sad_slide(1.0, 0.2), s(SHRUG + 4), 0.3)     # gives up
tr.add(whoosh(0.4, 0.14), s(LEAVE), 0.25)          # walks away
tr.add(pop(650, 0.12), s(CHEER + 2), 0.65)         # cheer
tr.add(whoosh(0.3, 0.1), s(THROW), 0.6)            # coin thrown
tr.add(plip(1000, 0.2), s(COIN_LAND + 2), 0.8)     # coin in jar
tr.add(bell(1318, 0.9, 0.1), s(COIN_LAND + 6), 0.8)
tr.add(whoosh(0.5, 0.28), s(OUTRO - 4), 0.5)
tr.add(scribble(0.5, 0.18), s(OUTRO + 10), 0.5)
tr.add(scribble(0.55, 0.22), s(UNDERLINE), 0.5)
tr.add(bell(587, 2.2, 0.22), s(UNDERLINE + 30), 0.5)
tr.add(bell(880, 2.0, 0.12), s(UNDERLINE + 30), 0.5)
tr.save(sys.argv[1])
print("ok")
