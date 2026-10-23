# SFX timeline for posts/RentOrPlant.tsx (frame numbers at 60fps must match the component).
import sys, os
sys.path.insert(0, os.path.dirname(__file__))
from sfxlib import *

FPS = 60
s = lambda fr: fr / FPS
M0, M_GAP, THROW0, THROW_GAP, THROWS, SEED, GROW0, GROW1, OUTRO, UNDERLINE = 90, 30, 96, 22, 7, 84, 110, 430, 470, 510
OFF = 96 + 6 * 22 + 40

tr = Track(660 / FPS)
tr.room()
tr.add(scribble(0.6, 0.22), s(6), 0.45)            # title written
tr.add(scribble(0.55, 0.10), s(22), 0.3)           # ground lines
tr.add(scribble(0.55, 0.10), s(26), 0.7)
tr.add(pop(300, 0.25), s(SEED + 2), 0.7)           # seed planted
for k in range(THROWS):
    t0 = THROW0 + k * THROW_GAP
    tr.add(whoosh(0.18, 0.08), s(t0), 0.4)         # coin thrown
    tr.add(plip(1000 + 60 * (k % 3), 0.2), s(t0 + 26), 0.7)  # coin into meter
tr.add(sparkle(0.16), s(THROW0 + 22), 0.7)         # lamp lights
for i in range(12):                                # month ticks
    tr.add(tick(0.06), s(M0 + i * M_GAP), 0.5)
tr.add(sad_slide(1.0, 0.2), s(OFF), 0.7)           # lamp dies
tr.add(pop(420, 0.2), s(OFF + 34), 0.7)            # "no coins..."
tr.add(pop(600, 0.2), s(GROW0 + 10), 0.3)          # sprout
for i in range(5):
    tr.add(pop(480 + i * 50, 0.14), s(GROW0 + 50 + i * 55), 0.3)  # tree grows
for i, t in enumerate((GROW1 - 20, GROW1 - 2, GROW1 + 16)):
    tr.add(pop(900 + 100 * i, 0.16), s(t), 0.3)    # fruit appears
for i, t in enumerate((GROW1 + 24, GROW1 + 42, GROW1 + 60)):
    tr.add(plip(1100 + 60 * i, 0.22), s(t + 66), 0.7)  # coin lands in jar
tr.add(sparkle(0.14), s(GROW1 + 22), 0.4)
tr.add(whoosh(0.5, 0.28), s(OUTRO - 4), 0.5)
tr.add(scribble(0.5, 0.18), s(OUTRO + 10), 0.5)
tr.add(scribble(0.55, 0.22), s(UNDERLINE), 0.5)
tr.add(bell(587, 2.2, 0.22), s(UNDERLINE + 30), 0.5)
tr.add(bell(880, 2.0, 0.12), s(UNDERLINE + 30), 0.5)
tr.save(sys.argv[1])
print("ok")
