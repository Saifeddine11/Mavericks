# Mavericks — Brand fonts

Place licensed font files here. **Do not commit unlicensed copies.**

## Required files (exact names)

| File | Role |
|------|------|
| `OTJubilee-PlatinumRegular.woff` | Display / editorial (planned) |
| `Switzer-Medium.woff` | UI labels, navigation |
| `Switzer-Regular.woff` | Body copy |
| `Voyage-Regular.woff` | Accent / editorial display (planned) |

## Current production fonts

Until these files are added, the site uses **Google Fonts** (see `src/index.css`):

- Cormorant Garamond → `font-editorial`
- Tenor Sans → `font-label`
- Questrial → `font-body`

**Do not substitute** Voyage, Switzer, or OT Jubilee with other families in production without updating `src/config/brand.js` and `docs/BRAND_SYSTEM.md`.

## Integration (when files are present)

1. Add `@font-face` rules in `src/styles/typography.css` only after files exist.
2. Update `brandFonts` in `src/config/brand.js`.
3. Update `tailwind.config.js` `fontFamily` to match.
4. Remove or narrow Google Fonts import in `src/index.css`.
5. Run `npm run build` and verify Lighthouse font loading.

## Licensing

Mavericks must hold a valid license for each file. The project does **not** download these fonts automatically.
