# Tiny procedural SFX library (no samples, royalty-free) for the paper/ink explainer posts.
import wave
import numpy as np

SR = 48000
_rng = np.random.default_rng(11)


def t_(d):
    return np.arange(int(SR * d)) / SR


def lowpass(x, a):
    # one-pole lowpass, a in (0,1): higher = brighter
    y = np.empty_like(x); acc = 0.0
    for i, v in enumerate(x):
        acc += a * (v - acc); y[i] = acc
    return y


def scribble(d=0.5, amp=0.25):
    n = _rng.uniform(-1, 1, int(SR * d))
    hp = n - lowpass(n, 0.08)  # papery hiss
    strokes = 0.5 + 0.5 * np.sin(2 * np.pi * (9 + 3 * _rng.random()) * t_(d) + _rng.random() * 6) ** 2
    jitter = lowpass(_rng.uniform(0, 1, len(n)), 0.002) * 2
    env = np.minimum(1, t_(d) / 0.04) * np.minimum(1, (d - t_(d)) / 0.08)
    return hp * strokes * jitter * env * amp


def plip(f=900, amp=0.35):
    t = t_(0.12)
    freq = f * (1 + 0.6 * t / 0.12)
    return np.sin(2 * np.pi * np.cumsum(freq) / SR) * np.exp(-t * 45) * amp


def pop(f=520, amp=0.35):
    t = t_(0.1)
    freq = f * np.exp(-t * 8) + 200
    s = np.sin(2 * np.pi * np.cumsum(freq) / SR) * np.exp(-t * 40)
    click = _rng.uniform(-1, 1, len(t)) * np.exp(-t * 400) * 0.4
    return (s + click) * amp


def splash(d=0.9, amp=0.55):
    t = t_(d)
    n = _rng.uniform(-1, 1, len(t))
    body = lowpass(n, 0.25) * np.exp(-t * 4.5)
    bubbles = sum(np.sin(2 * np.pi * (300 + 500 * _rng.random()) * t) * np.exp(-((t - _rng.random() * d * 0.7) ** 2) / 0.0008) for _ in range(14)) * 0.12
    return (body * 1.4 + bubbles) * amp


def pour(d=0.8, amp=0.3):
    t = t_(d)
    n = lowpass(_rng.uniform(-1, 1, len(t)), 0.18)
    gl = 0.6 + 0.4 * np.sin(2 * np.pi * 7 * t)
    env = np.minimum(1, t / 0.08) * np.minimum(1, (d - t) / 0.2)
    return n * gl * env * amp * 1.6


def sad_slide(d=1.2, amp=0.22):
    t = t_(d)
    freq = 520 * np.exp(-t * 0.9) * (1 + 0.015 * np.sin(2 * np.pi * 5.5 * t))
    s = np.sin(2 * np.pi * np.cumsum(freq) / SR) + 0.25 * np.sin(4 * np.pi * np.cumsum(freq) / SR)
    env = np.minimum(1, t / 0.05) * np.exp(-t * 1.2)
    return s * env * amp


def tick(amp=0.12):
    t = t_(0.05)
    return (np.sin(2 * np.pi * 2400 * t) * 0.5 + _rng.uniform(-1, 1, len(t)) * 0.5) * np.exp(-t * 180) * amp


def whoosh(d=0.55, amp=0.3):
    t = t_(d)
    n = _rng.uniform(-1, 1, len(t))
    out = np.empty_like(n); acc = 0.0
    for i, v in enumerate(n):
        a = 0.02 + 0.25 * np.sin(np.pi * i / len(n)) ** 2
        acc += a * (v - acc); out[i] = acc
    return out * np.sin(np.pi * t / d) ** 2 * amp * 2.2


def bell(f=880, d=1.8, amp=0.22):
    t = t_(d)
    s = sum(w * np.sin(2 * np.pi * f * r * t) * np.exp(-t * dec) for r, w, dec in [(1, 1, 2.2), (2.01, 0.45, 3.5), (3.0, 0.2, 5), (4.2, 0.1, 7)])
    return s * np.minimum(1, t / 0.004) * amp


def sparkle(amp=0.16):
    notes = [1175, 1397, 1760, 2349]
    out = np.zeros(int(SR * 1.4))
    for i, f in enumerate(notes):
        b = bell(f, 1.0, amp)
        s = int(i * 0.07 * SR); out[s:s + len(b)] += b[: len(out) - s]
    return out


class Track:
    def __init__(self, dur):
        self.L = np.zeros(int(SR * dur)); self.R = np.zeros(int(SR * dur))

    def add(self, sig, at, pan=0.5):
        i = int(at * SR); j = min(len(self.L), i + len(sig))
        if i >= len(self.L) or j <= i: return
        self.L[i:j] += sig[: j - i] * (1 - pan) * 1.4
        self.R[i:j] += sig[: j - i] * pan * 1.4

    def room(self, amp=0.006):
        n = lowpass(_rng.uniform(-1, 1, len(self.L)), 0.02) * 6 * amp
        self.L += n; self.R += n[::-1]

    def save(self, path, fade=0.6):
        mix = np.stack([self.L, self.R], 1)
        fo = int(fade * SR); mix[-fo:] *= np.linspace(1, 0, fo)[:, None]
        peak = np.abs(mix).max()
        if peak > 0.95: mix *= 0.95 / peak
        with wave.open(path, "wb") as w:
            w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
            w.writeframes((mix * 32767).astype(np.int16).tobytes())
