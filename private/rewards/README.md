# Review rewards (private)

These files are served to readers who leave an Amazon review and upload a
screenshot, through `/api/reward/[file]?t=TOKEN`. They must NOT live under
`public/` — only the signed download route may read them.

## Expected filenames

| Kind  | Accepted names                                 |
|-------|------------------------------------------------|
| ebook | `ebook.epub` · `ebook.pdf` · `ebook.mobi`      |
| audio | `audio.mp3` · `audio.m4a` · `audio.wav`        |

The resolver at `src/lib/reward-files.ts` picks the first match of each
kind. Drop your file with one of those names, commit, push — it goes
live on the next Railway rebuild without any code change.

## What happens if a file is missing

- `/api/reward/<kind>` returns `503 { error: "not_available_yet" }`
- `/resena/recompensa` renders the corresponding card with "Próximamente
  disponible · vuelve en unos días"

So the infrastructure is safe to deploy before the files arrive.
