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

## Files too big for git (audiobooks etc.)

Files larger than ~50 MB don't belong here — GitHub rejects pushes
above 100 MB. Use a **GitHub Release asset** instead:

1. Create a release tag (e.g. `rewards-audio-es-v1`).
2. Upload the file as an asset.
3. Set the env var on Railway:
   - `REWARD_AUDIO_URL=https://github.com/<owner>/<repo>/releases/download/<tag>/<filename>`
   - or `REWARD_EBOOK_URL=...` for the ebook.
4. Done. The endpoint detects the env var and 302-redirects every
   authorised reader to the asset URL — Railway egress stays at zero
   for the file body.

Current Release assets and their URLs:

| Reward kind  | Tag                       | Filename                                      | Size   | Notes                                |
|--------------|---------------------------|-----------------------------------------------|--------|--------------------------------------|
| `/resena` ebook | `rewards-ebook-es-v1`  | `no-eres-tu-es-tu-subconsciente.pdf`          | 4.7 MB | First book by Lara (PDF)             |
| `/resena` audio | (pending)              | —                                             | —      | RSB audio, not yet uploaded          |
| Arkwright audiobook | `rewards-audio-es-v1` | `the-arkwright-method-audiolibro-es.mp3` | 142 MB | 5h 10m · MP3 64 kbps mono            |
| Arkwright ebook | (pending)              | —                                             | —      | The Arkwright Method (PRODUCT_EBOOK_URL) |

Re-encode at higher bitrate / replace the file by uploading a new
asset to the same tag with `--clobber`. The URL stays stable as long
as the tag does.
