#!/bin/bash
# Stickman setup for a fresh machine or cloud sandbox: Python deps, Kokoro voice model (~340 MB), an ffmpeg with
# libx264, and a Chrome/Chromium. Writes stickman/env.sh (sourced by build.sh). Safe to re-run. Prints STICKMAN READY.
set -eu
HERE="$(cd "$(dirname "$0")" && pwd)"
PY="${PY:-python3}"
"$PY" -m pip install -q numpy scipy soundfile faster-whisper kokoro-onnx imageio-ffmpeg 2>&1 | grep -v -i "warning\|notice" | tail -3 || true
K="${FACELESS_HOME:-$HOME/.faceless-videos}/kokoro"; mkdir -p "$K"
for f in kokoro-v1.0.onnx voices-v1.0.bin; do
  # .part then rename, so a dropped download never leaves a half file that later runs would skip
  [ -s "$K/$f" ] || { curl -fsSL -o "$K/$f.part" "https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/$f" && mv "$K/$f.part" "$K/$f"; }
done
# ffmpeg: the system one if it has libx264, else the static build from imageio-ffmpeg
BIN="$HERE/.bin"; mkdir -p "$BIN"
if ! ffmpeg -hide_banner -encoders 2>/dev/null | grep -q libx264; then
  ln -sf "$("$PY" -c 'import imageio_ffmpeg; print(imageio_ffmpeg.get_ffmpeg_exe())')" "$BIN/ffmpeg"
fi
# Chrome: $CHROME, a system Chrome/Chromium, or Playwright's Chromium (cloud sandbox)
CH="${CHROME:-}"
for p in /usr/bin/google-chrome /usr/bin/google-chrome-stable /usr/bin/chromium /usr/bin/chromium-browser \
         "/c/Program Files/Google/Chrome/Application/chrome.exe" $(ls -d /opt/pw-browsers/chromium-*/chrome-linux*/chrome 2>/dev/null); do
  [ -z "$CH" ] && [ -x "$p" ] && CH="$p"
done
[ -n "$CH" ] || { echo "NO CHROME FOUND (set CHROME=/path/to/chrome)"; exit 1; }
printf 'export PATH="%s:$PATH"\nexport CHROME="%s"\nexport PY="%s"\n' "$BIN" "$CH" "$PY" > "$HERE/env.sh"
. "$HERE/env.sh"
ffmpeg -hide_banner -encoders 2>/dev/null | grep -q libx264 || { echo "NO FFMPEG WITH LIBX264"; exit 1; }
"$PY" -c "import numpy, scipy, soundfile, faster_whisper, kokoro_onnx" || { echo "PYTHON DEPS BROKEN"; exit 1; }
node -e "process.exit(+process.versions.node.split('.')[0] >= 22 ? 0 : 1)" || { echo "NODE 22+ NEEDED"; exit 1; }
echo "chrome: $CH"
echo "STICKMAN READY"
