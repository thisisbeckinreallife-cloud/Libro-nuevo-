# Print-ready QR codes for the review-for-reward funnel

These PNGs encode the URL:
```
https://libro-nuevo-production.up.railway.app/resena?k=wUbzyElrm3jmOz3XxdNWtxZv
```

Anyone who scans any of these lands on the gated /resena page. They are
intentionally NOT served from `public/` — they belong on the printed
page, not on the internet.

## Files

| File                         | Size      | Use case                                                  |
|------------------------------|-----------|-----------------------------------------------------------|
| `resena-qr.png`              | 2280×2280 | Pure black on white — highest scannability, default pick. |
| `resena-qr-editorial.png`    | 2280×2280 | Ink on paper-warm — matches site palette, still scannable.|
| `resena-qr-card.png`         | 1200×1500 | Full composition with serif caption "Escanea y llévate tus regalos". Ready to drop in InDesign at full page size. |

## Print guidelines

- Minimum printed size: **25 × 25 mm** (1 inch square). Below that, older
  phones struggle.
- Error correction level in these files: **H (30%)** — survives minor
  ink bleed and small tears.
- Always keep a 4-module quiet zone around the QR (already baked into
  these images).
- Print in pure black for the ink-on-paper variant; don't rasterise as
  50% grey. The contrast ratio matters.

## Rotating the secret

If the URL ever leaks publicly you can invalidate these QRs in one shot:

1. Update `REVIEW_QR_SECRET` in Railway Variables (web dashboard).
2. Regenerate these PNGs by running `python3 /tmp/gen_qr.py` after
   updating the `URL` constant at the top of the script.
3. Reprint.

All previously issued cookies invalidate automatically — they're hashed
against the env var, so the hash mismatches after rotation.
