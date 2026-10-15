# SFX timeline for posts/TwoPlatforms.tsx (frame numbers at 60fps must match the component).
import sys, os
sys.path.insert(0, os.path.dirname(__file__))
from sfxlib import *

FPS = 60
s = lambda fr: fr / FPS
DROP, STEP, SHRUG, OUTRO, UNDERLINE = 210, 5, 300, 430, 470

tr = Track(600 / FPS)
tr.room()
tr.add(scribble(0.6, 0.22), s(6), 0.45)            # title written
tr.add(scribble(0.55, 0.10), s(22), 0.3)           # ground lines
tr.add(scribble(0.55, 0.10), s(26), 0.7)
for fr in range(62, DROP, 14):                     # frantic juggling (top)
    tr.add(tick(0.05), s(fr), 0.3)
for fr in range(70, SHRUG + 120, 40):              # calm catches (bottom)
    tr.add(tick(0.09), s(fr), 0.7)
for i in range(8):                                 # balls hit the floor
    tr.add(pop(240 + 20 * (i % 3), 0.2), s(DROP + i * STEP + 20 + (i % 3) * 3), 0.3)
    tr.add(pop(200, 0.08), s(DROP + i * STEP + 38), 0.3)
tr.add(sad_slide(1.0, 0.2), s(SHRUG + 4), 0.3)     # shrug
tr.add(sparkle(0.14), s(SHRUG + 6), 0.7)           # smooth two-ball glow
tr.add(whoosh(0.5, 0.28), s(OUTRO - 4), 0.5)
tr.add(scribble(0.5, 0.18), s(OUTRO + 10), 0.5)
tr.add(scribble(0.55, 0.22), s(UNDERLINE), 0.5)
tr.add(bell(587, 2.2, 0.22), s(UNDERLINE + 30), 0.5)
tr.add(bell(880, 2.0, 0.12), s(UNDERLINE + 30), 0.5)
tr.save(sys.argv[1])
print("ok")
