# Mavericks — Asset Guide

Where to place static files and how to name them.

## Folder map

```
public/
├── assets/                    ← NEW canonical structure (gradual migration)
│   ├── fonts/                 ← Licensed .woff files
│   ├── brand/
│   │   ├── logo/              ← Future home for wordmarks
│   │   ├── monogram/
│   │   └── marks/             ← Favicon, seals
│   ├── images/
│   │   ├── hero/
│   │   ├── properties/
│   │   ├── lifestyle/
│   │   ├── editorial/
│   │   └── locations/
│   ├── videos/
│   │   ├── hero/
│   │   └── scroll/
│   └── icons/
│       ├── social/
│       └── placeholders/
├── images/                    ← CURRENT active paths (keep until migrated)
│   ├── hero/
│   ├── villa-peninsula/       ← Cinematic homepage photography
│   ├── collection/
│   └── locations/
├── logos/                     ← CURRENT active logos (do not break)
└── videos/                    ← CURRENT hero scroll videos
```

## Fonts

**Path:** `public/assets/fonts/`

Required (when licensed):

- `OTJubilee-PlatinumRegular.woff`
- `Switzer-Medium.woff`
- `Switzer-Regular.woff`
- `Voyage-Regular.woff`

Do not commit unlicensed files. See `public/assets/fonts/README.md`.

## Logos & brand marks

**Active today:** `public/logos/mavericks-outline.svg`, `mavericks-mask.svg`  
**Future:** `public/assets/brand/logo/`

Update component imports when migrating — never change artwork.

## Images

### Naming convention

```
mavericks-<category>-<subject>-<location>-<index>.webp
```

Examples:

- `mavericks-hero-palmeraie-villa-01.webp`
- `mavericks-offmarket-riad-medina-01.webp`
- `mavericks-sur-plan-residence-hivernage-01.webp`
- `mavericks-property-villa-terrace-01.webp`

Use lowercase, hyphens, no spaces.

### Formats

| Use | Format | Notes |
|-----|--------|-------|
| Photography | `.webp` primary, `.jpg` fallback | sRGB, 1600–2400px long edge |
| UI / masks | `.svg` | Optimized, no embedded raster |
| OG / share | `.jpg` | 1200×630 when needed |

### Cinematic registry

Active paths for homepage: `src/components/cinematic/sections/images.js`  
Legacy registry: `src/data/media.js`

### Optimization rules

- Bright, warm, editorial grade — not dark stock
- No people-heavy lifestyle stock
- Marrakech / Morocco architecture
- Lazy-load below-the-fold (`loading="lazy"`)
- Hero poster + first section: `loading="eager"` where appropriate

## Videos

**Active:** `public/videos/`

| File | Purpose |
|------|---------|
| `offmarket-hero-video2.mp4` | Scroll-scrub hero (production) |
| `hero-poster.jpg` | Hero poster frame |

**Specs:** H.264, muted, `+faststart`, keyframes every ~2s for scrubbing, no audio.

**Future:** `public/assets/videos/hero/`, `scroll/`

## Icons

Social and UI icons → `public/assets/icons/social/`  
Development placeholders → `public/assets/icons/placeholders/`

## Migration policy

1. Add new assets under `public/assets/…` when possible.
2. Update one registry file (`images.js` or `media.js`) per change.
3. Do not delete old paths until all imports are updated.
4. Run `npm run build` after path changes.
