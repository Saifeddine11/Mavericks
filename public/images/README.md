# Mavericks — Image Asset Manifest

Living checklist of every image the cinematic homepage uses. Replace any file
by dropping a new image with the **same path and filename** — no code changes.

Registry: `src/data/media.js` · Alt text: `media.*` keys in `src/i18n/locales/`.

All images must respect the brand mood:

- bright, warm, sunlit
- private villa / courtyard / water / stone / hospitality feeling
- no people-heavy stock
- no flashy real-estate imagery
- avoid heavy shadows or moody dark interiors
- Marrakech / Morocco architecture — not generic Dubai, beach, or city skylines

Target format for production: `.jpg` at 1600–2400px wide (2×), with `.webp`
alongside once you have a build-time image pipeline.

---

## Source mode

| Mode | How |
|------|-----|
| **Local (default)** | Files in this folder. Served from `/images/…` |
| **Remote** | Set `VITE_IMAGE_SOURCE=remote` in `.env` — uses CDN URLs in `src/data/media.js` |

---

## Shot 01 — Hero

| File | Used in | Subject |
|------|---------|---------|
| `hero/marrakech-luxury-villa.jpg` | `HeroVideo` poster (and reduced-motion still) | Sunlit riad / villa pool, Marrakech |

## Shot 02 — Dream Statement (floating fragments)

| File | Aspect | Used in | Subject |
|------|--------|---------|---------|
| `floating/fragment-01.jpg` | 1 / 1 | `DreamStatement` (upper right) | Stone arches, ivory courtyard |
| `floating/fragment-02.jpg` | 4 / 5 | `DreamStatement` (lower left) | Pool / water mirror, warm light |

## Shot 03 — Visual Reveal (set-piece)

| File | Aspect | Used in | Subject |
|------|--------|---------|---------|
| `reveal/villa-courtyard-expand.jpg` | 16 / 9 full bleed | `VisualReveal` | Wide courtyard, arches, reflecting pool |

## Shot 04 — Collection

| File | Category | Used in |
|------|----------|---------|
| `collection/villas.jpg` | Villas | `Collection` |
| `collection/riads.jpg` | Riads | `Collection` |
| `collection/estates.jpg` | Estates | `Collection` |
| `collection/penthouses.jpg` | Penthouses | `Collection` |
| `collection/off-market.jpg` | Off-market | `Collection` |

## Shot 05 — Private Access (floating fragments)

| File | Aspect | Used in | Subject |
|------|--------|---------|---------|
| `floating/fragment-03.jpg` | 3 / 4 | `PrivateAccessQuiet` (left) | Doorway / threshold |
| `floating/fragment-04.jpg` | 4 / 5 | `PrivateAccessQuiet` (right) | Sunlit patio / interior |

## Shot 06 — Signature Locations

| File | Neighbourhood | Used in |
|------|---------------|---------|
| `locations/palmeraie.jpg` | Palmeraie | `SignatureLocations` |
| `locations/hivernage.jpg` | Hivernage | `SignatureLocations` |
| `locations/amelkis.jpg` | Amelkis | `SignatureLocations` |
| `locations/ourika.jpg` | Route de l'Ourika | `SignatureLocations` |
| `locations/medina.jpg` | Médina | `SignatureLocations` |
| `locations/agdal.jpg` | Agdal | `SignatureLocations` |

---

## Currently shipped

Temporary placeholders (Unsplash / Pexels, Marrakech-oriented) live in the paths above.
See `credit` fields in `src/data/media.js` for attribution.

SVG gradient fallbacks remain in `src/lib/placeholders.js` for development only; the
homepage now uses real photography via `getMediaSrc()` / `getMediaImageProps()`.

---

## Replace with Mavericks assets

1. Export your photograph at **≥ 1600px** on the long edge, **sRGB**, bright grade.
2. Save as `.jpg` using the **exact filename** in the table above.
3. Drop into `public/images/…` (overwrite the placeholder).
4. Hard-refresh the browser (Vite serves `public/` as static files).
5. Update `media.*.alt` strings in locale JSON if the subject changed materially.

Optional: remove remote URLs from `src/data/media.js` once all locals are final.

No component edits required when filenames stay the same.
