# SFX timeline for posts/MotionStops.tsx (frame numbers at 60fps must match the component).
import sys, os, math
sys.path.insert(0, os.path.dirname(__file__))
from sfxlib import *

FPS = 60
s = lambda fr: fr / FPS
WALK0, SPEED, OUTRO, UNDERLINE, TOSS0, TOSS1, PERIOD = 70, 3.4, 470, 510, 340, 372, 28
STRIDE = 0.34
STOPS = [WALK0 + (st - x0) / SPEED for x0, st in [(90, 640), (-60, 560), (-210, 480)]]

tr = Track(640 / FPS)
tr.room()
tr.add(scribble(0.6, 0.22), s(6), 0.45)            # title written
tr.add(scribble(0.55, 0.10), s(22), 0.3)           # ground lines
tr.add(scribble(0.55, 0.10), s(26), 0.7)

def steps(a, b, amp, pan):
    last = -1
    for fr in range(int(a), int(b)):
        n = int(fr * STRIDE / math.pi)
        if n != last:
            tr.add(pop(190 + (n % 2) * 25, 0.07), s(fr), pan)
            last = n

for i, st in enumerate(STOPS):
    steps(WALK0 + i * 20, st, 0.2, 0.3)             # bottom walkers
steps(WALK0, WALK0 + 300, 0.2, 0.7)                 # top walkers
for k in range(40, TOSS0, PERIOD):
    tr.add(tick(0.06), s(k), 0.55)                  # ball bounce on the moving sign
tr.add(pop(420, 0.2), s(285), 0.4)                  # "Meh."
for st in STOPS:
    tr.add(pop(640, 0.22), s(st), 0.5)              # skid to a stop and look
tr.add(pop(600, 0.2), s(STOPS[0] + 8), 0.4)         # "Wait, what?"
tr.add(whoosh(0.2, 0.08), s(TOSS0), 0.6)            # coin toss
tr.add(plip(1250, 0.24), s(TOSS1), 0.8)             # coin into jar
tr.add(sparkle(0.16), s(TOSS1 + 6), 0.5)
tr.add(whoosh(0.5, 0.28), s(OUTRO - 4), 0.5)
tr.add(scribble(0.5, 0.18), s(OUTRO + 10), 0.5)
tr.add(scribble(0.55, 0.22), s(UNDERLINE), 0.5)
tr.add(bell(587, 2.2, 0.22), s(UNDERLINE + 30), 0.5)
tr.add(bell(880, 2.0, 0.12), s(UNDERLINE + 30), 0.5)
tr.save(sys.argv[1])
print("ok")
