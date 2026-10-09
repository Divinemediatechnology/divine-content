# Divine Media Technology — daily explainer posts

Remotion project that makes one short, hand-drawn stick-figure explainer video per day for
**Divine Media Technology** (digital marketing agency), posted via Buffer.

## Hard rules
- Render at **60 fps**, 1080×1350 (4:5). Every composition: `fps={60}`.
- Palette is fixed: cream paper background, black ink stick figures. Accents only `C.red` (punchline
  underline / one highlight) and the muted blues for water/objects. Use `src/kit/kit.tsx` (Paper,
  InkDefs, Stick, Ground, BrandFooter, SERIF, C).
- **No voice-over, no music.** Sound effects only, generated procedurally with `sfx/sfxlib.py`.
- Branding = only the tiny `<BrandFooter />` (IG/FB/LinkedIn icons + "Divine Media Technology").
  Never a big logo or watermark.
- Text and story must be **original**. Do not copy other creators' scenes or lines.
- Length 8–14 s. One idea, one visual metaphor, one punchline (red underline draws in at the end).

## Post structure that works
Title question/statement at top → split-screen "wrong way vs right way" (or one scene with a twist)
→ labels under each panel → title swaps to the punchline → red underline → footer.
Reference: `src/posts/Consistency.tsx` + `sfx/consistency.py`.

## Daily routine (see ROUTINE.md for the exact steps)
Topics come from `content/topic-bank.md`; everything already posted is in `content/posts-log.md`.
Never repeat a topic or metaphor that is in the log.
