# SFX timeline for posts/TalkToOne.tsx (frame numbers at 60fps must match the component).
import sys, os
sys.path.insert(0, os.path.dirname(__file__))
from sfxlib import *

FPS = 60
s = lambda fr: fr / FPS
TALK, SHRUG, BUBBLE, NOD, GRIP, LET_GO, COIN_LAND, OUTRO, UNDERLINE = 80, 262, 100, 150, 215, 285, 315, 430, 470

tr = Track(600 / FPS)
tr.room()
tr.add(scribble(0.6, 0.22), s(6), 0.45)            # title written
tr.add(scribble(0.55, 0.10), s(22), 0.3)           # ground lines
tr.add(scribble(0.55, 0.10), s(26), 0.7)
for k in range(7):                                 # megaphone blasts
    tr.add(whoosh(0.3, 0.14), s(TALK + 6 + k * 26), 0.3)
for fr in range(70, 250, 23):                      # phone taps in the crowd
    tr.add(tick(0.03), s(fr), 0.75)
tr.add(pop(260, 0.3), s(SHRUG + 6), 0.3)           # megaphone dropped
tr.add(sad_slide(1.0, 0.2), s(SHRUG + 12), 0.3)    # shrug
tr.add(pop(620, 0.12), s(BUBBLE + 2), 0.35)        # bubble appears
for fr in (NOD + 6, NOD + 34, NOD + 62):           # nods
    tr.add(pop(420, 0.1), s(fr), 0.65)
tr.add(pop(500, 0.2), s(GRIP + 18), 0.5)           # hands meet
for fr in range(GRIP + 24, LET_GO - 6, 10):
    tr.add(tick(0.05), s(fr), 0.5)
tr.add(sparkle(0.14), s(LET_GO - 4), 0.55)         # coin appears
tr.add(whoosh(0.3, 0.1), s(LET_GO), 0.55)
tr.add(plip(1000, 0.2), s(COIN_LAND + 2), 0.65)    # coin in jar
tr.add(bell(1318, 0.9, 0.1), s(COIN_LAND + 6), 0.65)
tr.add(whoosh(0.5, 0.28), s(OUTRO - 4), 0.5)
tr.add(scribble(0.5, 0.18), s(OUTRO + 10), 0.5)
tr.add(scribble(0.55, 0.22), s(UNDERLINE), 0.5)
tr.add(bell(587, 2.2, 0.22), s(UNDERLINE + 30), 0.5)
tr.add(bell(880, 2.0, 0.12), s(UNDERLINE + 30), 0.5)
tr.save(sys.argv[1])
print("ok")
