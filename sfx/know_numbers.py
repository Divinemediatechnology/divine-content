# SFX timeline for posts/KnowNumbers.tsx (frame numbers at 60fps must match the component).
import sys, os, math
sys.path.insert(0, os.path.dirname(__file__))
from sfxlib import *

FPS = 60
s = lambda fr: fr / FPS
WALK0, TOP_FALL, TOP_FALL_END, BOT_STOP, JUMP0, JUMP1, BOT_ARRIVE = 70, 230, 266, 215, 262, 322, 440
TOSS0, TOSS1, OUTRO, UNDERLINE = 440, 470, 530, 570
STRIDE = 0.28

tr = Track(740 / FPS)
tr.room()
tr.add(scribble(0.6, 0.22), s(6), 0.45)            # title written
tr.add(scribble(0.55, 0.10), s(22), 0.3)           # ground lines
tr.add(scribble(0.55, 0.10), s(26), 0.7)

def steps(a, b, amp):
    last = -1
    for fr in range(a, b):
        n = int(fr * STRIDE / math.pi)
        if n != last:
            tr.add(pop(190 + (n % 2) * 25, 0.1), s(fr), amp)
            last = n

steps(WALK0, TOP_FALL, 0.3)                        # blindfolded figure walks
steps(WALK0, BOT_STOP, 0.3)                        # dashboard figure walks
tr.add(whoosh(0.3, 0.14), s(TOP_FALL + 4), 0.5)    # tumble
tr.add(pop(110, 0.4), s(TOP_FALL_END), 0.7)        # thud in the hole
tr.add(sad_slide(1.2, 0.2), s(TOP_FALL_END + 6), 0.3)
tr.add(pop(420, 0.2), s(TOP_FALL_END + 8), 0.4)    # "Didn't see that..."
tr.add(pop(980, 0.3), s(BOT_STOP - 8), 0.5)        # needle hits red
tr.add(tick(0.1), s(BOT_STOP - 2), 0.6)
tr.add(pop(600, 0.2), s(BOT_STOP + 4), 0.4)        # "Pothole ahead!"
tr.add(whoosh(0.3, 0.14), s(JUMP0), 0.5)           # hop
tr.add(pop(210, 0.3), s(JUMP1), 0.6)               # landing
steps(JUMP1 + 6, BOT_ARRIVE, 0.3)
tr.add(whoosh(0.2, 0.08), s(TOSS0), 0.6)           # coin toss
tr.add(plip(1250, 0.24), s(TOSS1), 0.8)            # coin into jar
tr.add(sparkle(0.16), s(TOSS1 + 6), 0.5)
tr.add(whoosh(0.5, 0.28), s(OUTRO - 4), 0.5)
tr.add(scribble(0.5, 0.18), s(OUTRO + 10), 0.5)
tr.add(scribble(0.55, 0.22), s(UNDERLINE), 0.5)
tr.add(bell(587, 2.2, 0.22), s(UNDERLINE + 30), 0.5)
tr.add(bell(880, 2.0, 0.12), s(UNDERLINE + 30), 0.5)
tr.save(sys.argv[1])
print("ok")
