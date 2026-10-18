# SFX timeline for posts/Retargeting.tsx (frame numbers at 60fps must match the component).
import sys, os
sys.path.insert(0, os.path.dirname(__file__))
from sfxlib import *

FPS = 60
s = lambda fr: fr / FPS
ENTER, LOOK, LEAVE, WAVE, TURN, BACK, COIN0, OUTRO, UNDERLINE = 50, 125, 150, 215, 245, 330, 340, 470, 510

tr = Track(660 / FPS)
tr.room()
tr.add(scribble(0.6, 0.22), s(6), 0.45)            # title written
tr.add(scribble(0.55, 0.10), s(22), 0.3)           # ground lines
tr.add(scribble(0.55, 0.10), s(26), 0.7)
for fr in range(ENTER + 6, LOOK, 19):              # visitor walks in
    tr.add(tick(0.06), s(fr), 0.5)
for fr in range(LEAVE + 6, 300, 19):               # top visitor walks away
    tr.add(tick(0.05), s(fr), 0.3)
for fr in range(LEAVE + 6, WAVE, 19):              # bottom visitor walks away
    tr.add(tick(0.05), s(fr), 0.7)
tr.add(pop(560, 0.22), s(WAVE + 4), 0.7)           # "Forgot something?" bubble
tr.add(pop(740, 0.18), s(WAVE + 4), 0.7)
for fr in range(TURN + 6, BACK, 19):               # visitor walks back
    tr.add(tick(0.06), s(fr), 0.7)
tr.add(sad_slide(0.9, 0.14), s(322), 0.3)          # top: "..." silence
tr.add(sparkle(0.16), s(COIN0 - 4), 0.7)           # visitor delighted
tr.add(plip(1100, 0.22), s(COIN0 + 26), 0.7)       # coin lands
tr.add(sparkle(0.12), s(COIN0 + 30), 0.4)
tr.add(whoosh(0.5, 0.28), s(OUTRO - 4), 0.5)
tr.add(scribble(0.5, 0.18), s(OUTRO + 10), 0.5)
tr.add(scribble(0.55, 0.22), s(UNDERLINE), 0.5)
tr.add(bell(587, 2.2, 0.22), s(UNDERLINE + 30), 0.5)
tr.add(bell(880, 2.0, 0.12), s(UNDERLINE + 30), 0.5)
tr.save(sys.argv[1])
print("ok")
