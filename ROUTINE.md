# Nightly routine: tomorrow's posts (video on alternate days, text post every day)

## 0 · Is tomorrow a video day?
```bash
D=$(TZ=Asia/Kolkata date -d tomorrow +%F); echo $D; echo $(( $(date -ud "$D" +%s) / 86400 % 2 ))
```
`1` = **video day** (31 Oct, 2 Nov, 4 Nov …) → do steps 1–9. `0` = no video tomorrow → skip to the text post section.
If any video step fails, **do not schedule the video**. Append the failure to `content/posts-log.md`
under "Failures" (date + reason), commit and push, still do the text post, and **start your final
summary with the line `VIDEO FAILED: <reason>`** (the owner gets told to switch the PC on so the
PC backup task can make it).

## Video (Stickman style, since 2026-10-31)
The old Remotion cream-paper format is retired. Videos are now narrated "What if…?" stick-figure
stories made with the engine in `stickman/` (24 fps, 1080x1920, AI voice, music, sound).
Reference post: `stickman/posts/2026-10-30-stop-posting/` (script.txt + shots.js). Read it first.

1. **Setup:** `bash stickman/setup.sh` until it prints `STICKMAN READY` (pip deps, Kokoro voice,
   ffmpeg, Chrome; a few minutes).
2. **Pick a topic:** the first unused one in `content/stickman-topic-bank.md` (check
   `content/posts-log.md`), or invent one in the same spirit. Never repeat a logged topic.
3. **Write `stickman/posts/<DATE>-<slug>/script.txt`:** second person, short sentences, 70–90 words
   (~30 s), one line = one picture. Premise in the first 5 s, a title question, a few beats, a turn,
   one closing line. `[beat 0.8]` = silence. A character line is `[Customer] text` (voices:
   Customer, Client, Friend, Boss). Numbers spelled as words. Plain English. **No invented
   statistics, clients or results.**
4. **Write `stickman/posts/<DATE>-<slug>/shots.js`** modelled on the reference post. Use the kit:
   `stickman/engine/src/sets/kit.js` (hero, sitting, bigHead, phoneOnCouch, shop, titleCard,
   endCard, stepCard), `rooms.js` (living, hallway, bathroom, kitchen), `more.js` (facade, skyline,
   phone, desk, section, stove), `gfx.js` (pill, stamp, counter, goldText, navyBg, rubber).
   One shot per clause, keyed to words with `cut(line, word)` / `wd(line, word)`; every 9:16 `cam`
   gets `px/pw`; labels in the top 30 %, nothing important in the bottom 20 %. Always end with
   `endCard(...)`. Keep new drawing code small and in the same flat style.
5. **Build:** `bash stickman/build.sh stickman/posts/<DATE>-<slug> media/<DATE>-<slug>.mp4`.
   It must print `BUILD OK` (file < 15 MB). **Then look at** `stickman/work/<DATE>-<slug>/review/v.jpg`
   (contact sheet, 2 frames per shot): every frame must match what is said, nothing cut off,
   every word spelled right. Fix shots.js and rebuild until it is right (max 3 builds).
6. **Captions:** `content/<DATE>-<slug>-captions.md` with a LinkedIn caption (follow
   `.claude/skills/linkedin-founder-voice/SKILL.md`, up to 6 hashtags incl. #DivineMediaTechnology)
   and an Instagram caption (short, a few emoji, save/share call to action, max 5 hashtags), and a
   **YouTube** title (max 70 characters, the "What if…?" question) + description (2–3 lines, a
   subscribe line, then `#Shorts` and up to 3 more hashtags).
7. **Commit and push** to `main` (post folder, media file, captions). Do not commit `stickman/work/`.
   Media URL: `https://cdn.jsdelivr.net/gh/Divinemediatechnology/divine-content@<SHA>/media/<file>.mp4`
   (`git rev-parse HEAD`). The sandbox cannot curl jsDelivr; if Buffer says "Video could not be
   read from its URL", wait 2 minutes and retry (up to 3 times).
8. **Schedule in Buffer**, organization `6ac87f239dfe8b20030d74c2`, `customScheduled`,
   `schedulingType: automatic`, `dueAt` = `<DATE>T09:00:00+05:30`:
   - LinkedIn **profile** Shahbaaz Khan, channel `6ac885146a5c39ccb65d971c`, LinkedIn caption.
   - Instagram `divine_media__`, channel `6ac882e66a5c39ccb65d5eb7`, `metadata.instagram`
     `{type: 'reel', shouldShareToFeed: true}`, Instagram caption.
   - YouTube **Shorts** `Divine Media Technology`, channel `6ae477d82f1f5ed6481e7084`, text = YouTube
     description, `metadata.youtube` `{title, categoryId: '27', privacy: 'public', madeForKids: false,
     notifySubscribers: true}` (27 = Education). The 9:16 video under 60 s becomes a Short.
   - **Never** the LinkedIn page `6ac885146a5c39ccb65d971d`. Never share-now.
   - First `list_posts` for that date on all three channels; if a post already exists on a channel,
     don't duplicate it there. Afterwards confirm all three are `scheduled` with no error.
9. **Log it:** add a row to `content/posts-log.md` (date, slug, topic, story, Buffer IDs for LinkedIn /
   Instagram / YouTube).
   Commit and push.

## Second daily post: LinkedIn text post at 19:00 IST (added 2026-10-12)

Every night, after the video steps above, also schedule one **text-only** post for tomorrow:

- Channel: LinkedIn **profile** Shahbaaz Khan `6ac885146a5c39ccb65d971c` only (never the page
  `...971d`). No assets. `customScheduled`, `schedulingType: automatic`, `dueAt` tomorrow
  `19:00:00+05:30` (evening, a busy LinkedIn window for Indian business audiences).
- Pick a topic from `content/text-posts/topic-bank.md` not in `content/text-posts/log.md`. Use
  `content/text-posts/real-stories.md` for any specific story; otherwise only general observations.
  **Never invent clients, numbers or results.**
- Write it with the `linkedin-founder-voice` skill (hook, tension, insight, one action, one closing
  question, up to 6 hashtags incl. #DivineMediaTechnology). Save as `content/text-posts/<date>.md`.
- Before scheduling, `list_posts` for that date/time on the profile; skip if one exists. After, confirm
  `scheduled` with no error, add a row to `content/text-posts/log.md`, commit and push.
- A failure here must not block the video post; log it under Failures.

**Language rule (set by the owner, 2026-10-12):** every caption and text post is written in plain
English. No Hindi or Hinglish.
