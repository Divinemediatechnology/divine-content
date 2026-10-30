#!/bin/bash
# Build one stickman post: engine + posts/<dir>/{script.txt,shots.js} → a narrated 9:16 MP4 under 15 MB.
#   bash stickman/build.sh stickman/posts/<date>-<slug> media/<date>-<slug>.mp4
# Work files go to stickman/work/<dir>/ (git-ignored). Contact sheet to LOOK at: stickman/work/<dir>/review/v.jpg
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
[ -f "$HERE/env.sh" ] || bash "$HERE/setup.sh"
. "$HERE/env.sh"
POST="$(cd "$1" && pwd)"; OUT="$(cd "$(dirname "$2")" && pwd)/$(basename "$2")"
W="$HERE/work/$(basename "$POST")"; rm -rf "$W"; mkdir -p "$W"
cp -r "$HERE/engine/." "$W/"; cp "$POST/script.txt" "$W/"; cp "$POST/shots.js" "$W/src/shots.js"; mkdir -p "$W/data" "$W/review" "$W/renders"
cd "$W"
echo "== voice";  "$PY" tools/voice.py . | tail -1
echo "== words";  "$PY" tools/words.py . --model "${WHISPER:-base.en}" 2>/dev/null | tail -1 || "$PY" tools/words_est.py .   # cloud blocks huggingface.co
echo "== check";  node tools/capture.mjs check | tee review/check.txt | tail -3
if grep -q "SCENE ERRORS" review/check.txt; then echo "BUILD FAILED: scene errors (see $W/review/check.txt)"; exit 1; fi
AR=9x16 node tools/capture.mjs scenes review/v.jpg all 2 0.2 | tail -1
echo "== mix";    node tools/capture.mjs cues data/cues.json >/dev/null
"$PY" tools/mix.py . "$(node tools/capture.mjs eval 'OP.duration()' | head -1)"
echo "== render"; AR=9x16 QS='&nograin=1' node tools/capture.mjs video renders/master.mp4 0 -1 5 --audio | tail -1
# social copy: 1080x1920 24 fps, smallest CRF that stays under 15 MB
for crf in 18 20 22 24 26; do
  ffmpeg -v error -y -i renders/master.mp4 -c:v libx264 -crf $crf -preset slow -pix_fmt yuv420p -r 24 -c:a aac -b:a 160k -movflags +faststart "$OUT"
  [ "$(wc -c < "$OUT")" -lt 15000000 ] && break
done
[ "$(wc -c < "$OUT")" -lt 15000000 ] || { echo "BUILD FAILED: $OUT is still over 15 MB at crf $crf (shorten the video)"; exit 1; }
echo "BUILD OK: $OUT ($(( $(wc -c < "$OUT") / 1000000 )) MB, crf $crf) · contact sheet: $W/review/v.jpg"
