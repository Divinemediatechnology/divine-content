# Posts log

| Post date | Slug | Topic | Metaphor | Buffer IDs (LinkedIn / IG) |
|---|---|---|---|---|
| 2026-10-09 | consistency | Consistency beats intensity | One big bucket pour (plant wilts) vs a little water daily for 30 days (plant flowers) | 6ac891435f5f324895ad0b7f / 6ac891435f5f324895ad0b7e |
| 2026-10-10 | followers | Followers aren't customers | Huge crowd glued to phones + empty coin jar vs 5 people who each drop a coin in the jar | 6ac8bc4f0949e66c891a4825 / 6ac8bc500949e66c891a488a |
| 2026-10-11 | boosting | Boosting a post isn't a strategy | Blindfolded archer scattering arrows (coins spent each shot) vs one clear target and a bullseye | 6aca794eed92ed8fa5d8aebd / 6aca794fb07d37ac977f5b31 |
| 2026-10-12 | shop-door | Your website is your shop door | Stuck, slow-loading door (visitor knocks, shrugs, leaves) vs open lit door (visitors walk in, coins appear) | 6acbc9c1fa026cfb810d37c3 / 6acbc9c18e8dd50ffc4e7172 |
| 2026-10-13 | talk-to-one | Talk to one person, not everyone | Megaphone shouter ignored by a crowd glued to phones (0 replies) vs two figures in one conversation, handshake, coin in jar (1 sale) | 6acd1b92eacec460f4eba95a / 6acd1b93eacec460f4eba996 |
| 2026-10-14 | reply-fast | Reply fast, keep the lead | Slow reply: customer's message unanswered while clock spins, customer gives up (lead lost) vs instant reply, customer cheers, coin in jar (1 sale) | 6ace6cbebc13a192515ab479 / 6ace6cbf7f833fd8d30d959f |
| 2026-10-15 | hooks | Hooks matter: win the first 3 seconds | Two fishing lines in one lake: bare hook gets 0 bites, baited hook gets a bite within a second (timer) | 6acfcf73199c0449d73a4d88 / 6acfcf7a310d18fe579410b8 |
| 2026-10-16 | two-platforms | Don't chase every platform | Juggler with 8 balls drops them all vs juggler with 2 balls keeps them smoothly in the air | 6ad10fab735e2ae5e7e17fd7 / 6ad10fab735e2ae5e7e1800a |

## Failures

- 2026-10-09 (first attempt for the 2026-10-10 post): render failed because Chrome could not verify the sandbox proxy TLS cert while loading Google Fonts. Fixed by bundling Newsreader in `public/fonts` and loading it locally in `src/kit/kit.tsx`. Renders now need no network (use `--browser-executable` pointing at the pre-installed headless shell if Remotion's Chrome download is blocked). Note: cdn.jsdelivr.net is blocked from the sandbox, so the jsDelivr URL could not be curl-checked; Buffer fetched it fine.
- 2026-10-14 (run for the 2026-10-15 post, topic "Hooks matter", `media/2026-10-15-hooks.mp4`, commit d44f089): video rendered and pushed, but Buffer `create_post` rejected the jsDelivr URL (`.../divine-content@d44f089c2697cce467961ba62baa43726430b2b7/media/2026-10-15-hooks.mp4`) three times with "Video could not be read from its URL" (HTTP 400). The sandbox cannot check the URL itself (jsDelivr returns 403 from the proxy). Nothing was scheduled on LinkedIn, Instagram or the 19:00 text post (`content/text-posts/2026-10-15.md` is written but unscheduled). Fix: confirm the jsDelivr URL serves video/mp4, then schedule the saved captions for 2026-10-15 09:00 IST and the text post for 19:00 IST.
  - Resolved 2026-10-14: the same jsDelivr URL was accepted by Buffer on a retry a few minutes later (the CDN was slow to serve the new commit). Both posts and the text post are now scheduled.
