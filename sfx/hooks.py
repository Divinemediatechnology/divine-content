# SFX timeline for posts/Hooks.tsx (frame numbers at 60fps must match the component).
import sys, os
sys.path.insert(0, os.path.dirname(__file__))
from sfxlib import *

FPS = 60
s = lambda fr: fr / FPS
CAST, SPLASH, BITE, REEL, LANDED, SHRUG, OUTRO, UNDERLINE = 66, 98, 158, 170, 220, 290, 430, 470

tr = Track(600 / FPS)
tr.room()
tr.add(scribble(0.6, 0.22), s(6), 0.45)            # title written
tr.add(scribble(0.55, 0.10), s(22), 0.3)           # ground lines
tr.add(scribble(0.55, 0.10), s(26), 0.7)
tr.add(whoosh(0.3, 0.12), s(CAST), 0.3)            # casts
tr.add(whoosh(0.3, 0.12), s(CAST), 0.7)
tr.add(splash(0.6, 0.3), s(SPLASH), 0.3)           # hooks hit the water
tr.add(splash(0.6, 0.3), s(SPLASH), 0.7)
for fr in range(SPLASH + 60, OUTRO - 20, 60):      # seconds ticking
    tr.add(tick(0.05), s(fr), 0.3)
for fr in (150, 210, 250):                         # idle bubbles (top)
    tr.add(plip(900, 0.08), s(fr), 0.3)
tr.add(pop(760, 0.22), s(BITE), 0.7)               # bite
tr.add(whoosh(0.4, 0.18), s(REEL), 0.7)            # reel in
tr.add(sparkle(0.14), s(LANDED), 0.7)              # fish caught
tr.add(pop(650, 0.12), s(LANDED + 8), 0.7)
tr.add(sad_slide(1.0, 0.2), s(SHRUG + 4), 0.3)     # nothing
tr.add(whoosh(0.5, 0.28), s(OUTRO - 4), 0.5)
tr.add(scribble(0.5, 0.18), s(OUTRO + 10), 0.5)
tr.add(scribble(0.55, 0.22), s(UNDERLINE), 0.5)
tr.add(bell(587, 2.2, 0.22), s(UNDERLINE + 30), 0.5)
tr.add(bell(880, 2.0, 0.12), s(UNDERLINE + 30), 0.5)
tr.save(sys.argv[1])
print("ok")
