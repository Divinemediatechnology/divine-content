# SFX timeline for posts/Testimonials.tsx (frame numbers at 60fps must match the component).
import sys, os
sys.path.insert(0, os.path.dirname(__file__))
from sfxlib import *

FPS = 60
s = lambda fr: fr / FPS
BRAG0, BRAG1, SMIRK, LEAVE, FRIEND0, FRIEND_GAP, WANT, COIN0, OUTRO, UNDERLINE = 80, 170, 215, 310, 100, 40, 280, 350, 470, 510

tr = Track(660 / FPS)
tr.room()
tr.add(scribble(0.6, 0.22), s(6), 0.45)            # title written
tr.add(scribble(0.55, 0.10), s(22), 0.3)           # ground lines
tr.add(scribble(0.55, 0.10), s(26), 0.7)
tr.add(pop(500, 0.22), s(BRAG0), 0.55)             # "I'm great!"
tr.add(pop(560, 0.22), s(BRAG1 + 4), 0.55)         # "Best in town!"
tr.add(pop(300, 0.18), s(SMIRK), 0.4)              # "Sure you are..."
tr.add(sad_slide(1.0, 0.16), s(SMIRK + 18), 0.3)
for k in range(1, 7):                              # footsteps away
    tr.add(tick(0.08), s(LEAVE + k * 14), 0.4)
for i in range(3):                                  # friends appear and vouch
    tr.add(pop(380 + i * 70, 0.2), s(FRIEND0 - 30 + i * 8), 0.4)
    tr.add(pop(620 + i * 60, 0.22), s(FRIEND0 + i * FRIEND_GAP), 0.55)
tr.add(sparkle(0.12), s(FRIEND0 + 2 * FRIEND_GAP + 6), 0.4)
tr.add(pop(480, 0.2), s(WANT), 0.5)                # "I'll book them!"
tr.add(sparkle(0.16), s(COIN0), 0.7)
tr.add(plip(1100, 0.22), s(COIN0 + 40), 0.7)       # coin lands
tr.add(sparkle(0.12), s(COIN0 + 44), 0.4)
tr.add(whoosh(0.5, 0.28), s(OUTRO - 4), 0.5)
tr.add(scribble(0.5, 0.18), s(OUTRO + 10), 0.5)
tr.add(scribble(0.55, 0.22), s(UNDERLINE), 0.5)
tr.add(bell(587, 2.2, 0.22), s(UNDERLINE + 30), 0.5)
tr.add(bell(880, 2.0, 0.12), s(UNDERLINE + 30), 0.5)
tr.save(sys.argv[1])
print("ok")
