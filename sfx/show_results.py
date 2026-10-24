# SFX timeline for posts/ShowResults.tsx (frame numbers at 60fps must match the component).
import sys, os
sys.path.insert(0, os.path.dirname(__file__))
from sfxlib import *

FPS = 60
s = lambda fr: fr / FPS
BOARD, LINE0, LINE_GAP, PIC, YAWN, LEAVE, WANT, COIN0, OUTRO, UNDERLINE = 46, 80, 28, 110, 190, 310, 170, 250, 470, 510

tr = Track(660 / FPS)
tr.room()
tr.add(scribble(0.6, 0.22), s(6), 0.45)            # title written
tr.add(scribble(0.55, 0.10), s(22), 0.3)           # ground lines
tr.add(scribble(0.55, 0.10), s(26), 0.7)
tr.add(pop(330, 0.22), s(BOARD), 0.5)              # easels pop in
tr.add(pop(380, 0.22), s(BOARD + 3), 0.4)
for i in range(3):                                  # spec lines written
    tr.add(scribble(0.25, 0.14), s(LINE0 + i * LINE_GAP), 0.4)
tr.add(pop(620, 0.25), s(PIC), 0.6)                # picture appears
tr.add(sparkle(0.16), s(PIC + 8), 0.5)
tr.add(pop(480, 0.2), s(WANT), 0.5)                # "I want that!"
tr.add(pop(300, 0.18), s(YAWN + 4), 0.3)           # "Zzz..."
tr.add(sad_slide(1.0, 0.16), s(YAWN + 20), 0.3)    # bored
for k in range(1, 7):                              # footsteps away
    tr.add(tick(0.08), s(LEAVE + k * 14), 0.4)
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
