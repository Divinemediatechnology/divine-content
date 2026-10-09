# Daily routine: make tomorrow's post and schedule it for 09:00 IST

Do these steps in order. If any step fails, **do not schedule anything**. Append the failure to
`content/posts-log.md` under "Failures", then commit and push.

1. **Setup:** run `npm ci`, then `pip install numpy`. ffmpeg is optional.
2. **Pick a topic:** read `content/posts-log.md` and `content/topic-bank.md`. Choose the first unused
   topic in the bank, or invent a new one in the same spirit: marketing, branding, ads, content,
   websites, client growth, aimed at business owners. It must not repeat any logged topic or
   metaphor.
3. **Build the video:**
   - Create `src/posts/<PascalSlug>.tsx`, modelled on `Consistency.tsx` and using only the kit.
   - Register it in `src/Root.tsx` at fps 60, 1080×1350.
   - Write `sfx/<slug>.py` with event times that match the component's frames at 60fps.
   - Run `python sfx/<slug>.py public/sfx/<slug>.wav`.
4. **Check it:** `npx tsc --noEmit` must pass. Render 5–6 stills with
   `npx remotion still <Id> out/x.png --frame=N --scale=0.5`, look at them, and fix anything that
   overlaps, is cut off, or is unreadable.
5. **Render:** `npx remotion render <Id> media/<YYYY-MM-DD>-<slug>.mp4 --codec=h264 --crf=20`, where
   the date is the posting date (tomorrow). The file must stay under 15 MB.
6. **Captions:** write `content/<YYYY-MM-DD>-<slug>-captions.md` with two captions:
   - **LinkedIn**, in Shahbaaz Khan's personal voice. **Read and follow
     `.claude/skills/linkedin-founder-voice/SKILL.md`** (founder tone, strong hook, no invented
     stories or numbers, one closing question, up to 6 hashtags including #DivineMediaTechnology).
   - **Instagram**: short, a few emoji, a save/share call to action, and **at most 5 hashtags**.
7. **Commit and push** to `main`. Then get the commit SHA with `git rev-parse HEAD`. The public
   media URL is the jsDelivr one, because it serves `video/mp4` (raw.githubusercontent serves
   octet-stream):
   `https://cdn.jsdelivr.net/gh/Divinemediatechnology/divine-content@<SHA>/media/<file>.mp4`
   Before you use it, check that `curl -sI` on that URL returns `200` and `Content-Type: video/mp4`.
8. **Schedule in Buffer** with the Buffer connector, organization `6ac87f239dfe8b20030d74c2`:
   - LinkedIn **profile** Shahbaaz Khan, channel `6ac885146a5c39ccb65d971c`, with the LinkedIn caption.
   - Instagram `divine_media__`, channel `6ac882e66a5c39ccb65d5eb7`, as a **Reel**, with the
     Instagram caption.
   - Use the video asset from the jsDelivr URL above. `dueAt` is tomorrow at 09:00 Asia/Kolkata
     (03:30 UTC). Use custom scheduling, never share-now.
   - **Never** post to the LinkedIn page `6ac885146a5c39ccb65d971d`.
   - Afterwards, use `list_posts` to confirm both posts are `scheduled` with no error.
9. **Log it:** add a row to `content/posts-log.md` with the date, slug, topic, metaphor, and both
   Buffer post IDs. Then commit and push.
