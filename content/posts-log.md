# Posts log

| Post date | Slug | Topic | Metaphor | Buffer IDs (LinkedIn / IG) |
|---|---|---|---|---|
| 2026-10-09 | consistency | Consistency beats intensity | One big bucket pour (plant wilts) vs a little water daily for 30 days (plant flowers) | 6ac891435f5f324895ad0b7f / 6ac891435f5f324895ad0b7e |
| 2026-10-10 | followers | Followers aren't customers | Huge crowd glued to phones + empty coin jar vs 5 people who each drop a coin in the jar | 6ac8bc4f0949e66c891a4825 / 6ac8bc500949e66c891a488a |

## Failures

- 2026-10-09 (first attempt for the 2026-10-10 post): render failed because Chrome could not verify the sandbox proxy TLS cert while loading Google Fonts. Fixed by bundling Newsreader in `public/fonts` and loading it locally in `src/kit/kit.tsx`. Renders now need no network (use `--browser-executable` pointing at the pre-installed headless shell if Remotion's Chrome download is blocked). Note: cdn.jsdelivr.net is blocked from the sandbox, so the jsDelivr URL could not be curl-checked; Buffer fetched it fine.
