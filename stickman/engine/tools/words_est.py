"""Word timings without Whisper → data/words.json (same format as words.py). Used when Whisper can't be downloaded
(the cloud sandbox blocks huggingface.co). voice.py already knows each line's exact start/end. Inside a line, the
pauses after full stops are found as silences in data/narration.wav, and each sentence's words then share its time in
proportion to their letters.
shortcut: ~0.05–0.1 s per word vs Whisper, fine for cuts 3 frames early; use words.py when it is available.
  python tools/words_est.py <project>"""
import json, re, sys
from pathlib import Path
import numpy as np
import soundfile as sf

LEAD = 0.06                      # Kokoro's silence before each line's first word


def silences(env, hop, a, b, min_len=0.12):
    """(start, end) of quiet stretches between times a and b, longest first"""
    i0, i1 = int(a / hop), int(b / hop)
    q = env[i0:i1] < 0.06 * (env[i0:i1].max() + 1e-9)
    out, s = [], None
    for k, v in enumerate(np.append(q, False)):
        if v and s is None: s = k
        if not v and s is not None:
            if (k - s) * hop >= min_len and s > 0: out.append(((i0 + s) * hop, (i0 + k) * hop))
            s = None
    return sorted(out, key=lambda g: g[0] - g[1])


def estimate(lines, env=None, hop=0.01):
    out = []
    for L in lines:
        if L['who'] == 'beat' or not L['text'].strip():
            continue
        ws = L['text'].split()
        stops = [k for k, w in enumerate(ws[:-1]) if re.search(r'[.!?]$', w)]      # sentence ends inside the line
        a, b = L['start'], L['end']
        if env is not None:                                                          # trim Kokoro's silence at both ends
            seg = env[int(a / hop):int(b / hop)]; loud = np.nonzero(seg > 0.06 * (seg.max() + 1e-9))[0]
            if len(loud): a, b = a + loud[0] * hop, a + (loud[-1] + 1) * hop
        else: a += LEAD
        gaps = sorted(silences(env, hop, a, b)[:len(stops)]) if env is not None else []
        if len(gaps) != len(stops): gaps, stops = [], []                             # no clean pauses: one block
        bounds = [a] + [x for g in gaps for x in g] + [b]
        parts = np.split(np.arange(len(ws)), [k + 1 for k in stops])
        for p, (t0, t1) in zip(parts, zip(bounds[::2], bounds[1::2])):
            wt = [len(re.sub(r'\W', '', ws[k])) + 1 for k in p]
            t, sc = t0, (t1 - t0) / sum(wt)
            for k, x in zip(p, wt):
                out.append({'i': len(out), 'w': ws[k], 'line': L['i'], 's': round(t, 3), 'e': round(t + sc * (x - 0.6), 3)})
                t += sc * x
    return out


def envelope(wav, hop=0.01):
    x, sr = sf.read(wav, always_2d=True); x = np.abs(x).mean(1); n = int(sr * hop)
    return np.sqrt(np.convolve(x[: len(x) // n * n].reshape(-1, n).mean(1) ** 2, np.ones(3) / 3, 'same'))


if __name__ == '__main__':
    P = Path(sys.argv[1])
    words = estimate(json.loads((P / 'data/lines.json').read_text())['lines'], envelope(P / 'data/narration.wav'))
    assert words and all(a['s'] <= b['s'] for a, b in zip(words, words[1:])), 'word times must increase'
    (P / 'data/words.json').write_text(json.dumps(words, indent=0))
    (P / 'data/words.txt').write_text('\n'.join(f"{w['s']:7.2f} {w['e']:7.2f}  {w['w']}" for w in words) + '\n')
    print(f'data/words.json  {len(words)} words (estimated, no Whisper)')
