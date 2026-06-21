# Mavericks — Project Structure

**Stack:** Vite + React 18 + React Router 6 (not Next.js App Router).  
**Entry:** `src/main.jsx` → `src/App.jsx` → `src/routes/Home.jsx`

---

## Audit summary (current)

### Routing

```
/           → redirect /fr
/:lang      → Home (cinematic homepage)
/:lang/*    → Home (catch-all)
```

Chrome: `CinematicProvider` on home paths only (`App.jsx`).

### Components

| Path | Purpose |
|------|---------|
| `src/components/cinematic/` | **Active** homepage — hero, sections, chrome, GSAP |
| `src/components/layout/` | Footer, Header, PageTransition |
| `src/components/ui/` | LanguageSwitcher |
| `src/components/motion/` | Legacy motion primitives |
| `src/components/sections/` | Legacy scroll-video experiments |
| `src/sections/` | Legacy homepage sections (unused on current Home) |

### Animations (do not refactor casually)

| Layer | Location |
|-------|----------|
| GSAP + ScrollTrigger | `src/lib/gsap.js`, `src/components/cinematic/**` |
| Hero scroll-scrub | `ScrollVideoHeroSection.jsx`, `heroV2.config.js` |
| Architecture rail | `ArchitectureSection.jsx` |
| Lenis smooth scroll | `src/hooks/useLenis.js` |
| Framer Motion | `PageTransition.jsx`, legacy sections |
| Motion tokens (JS) | `src/styles/tokens.js` |
| Motion CSS | `src/index.css` |

### Styles

| File | Role |
|------|------|
| `src/index.css` | Global styles, Google Fonts, hero-v2, menu glass |
| `tailwind.config.js` | Colors, fonts, spacing, shadows |
| `src/config/brand.js` | **SSOT** for brand hex + font roles |
| `src/styles/tokens.js` | Easings, durations, breakpoints for JS |
| `src/styles/colors.css` | CSS variable mirror (reference) |
| `src/styles/typography.css` | Future @font-face (commented) |
| `src/styles/tokens.css` | Spacing/shadow CSS vars |
| `src/styles/motion.css` | Documentation stub |

### Assets (active)

| Path | Content |
|------|---------|
| `public/logos/` | SVG wordmarks (imported in chrome) |
| `public/images/villa-peninsula/` | Cinematic section photography |
| `public/images/hero/`, `collection/`, etc. | Legacy media manifest |
| `public/videos/` | Hero scroll MP4 + poster |
| `public/assets/` | **New** organized structure (migration target) |

### Content & i18n

| Path | Role |
|------|------|
| `src/i18n/locales/fr.json` | Primary copy + SEO meta |
| `src/i18n/locales/en.json`, `it.json`, `nl.json` | Partial translations |
| `src/content/*/README.md` | Content index (where to edit what) |
| `src/config/navigation.js` | Menu anchor registry |

### SEO

`src/seo/Seo.jsx` + `meta.*` in locale JSON + `public/sitemap.xml`

### Config

```
src/config/
├── brand.js        ← colors, fonts (SSOT)
├── site.js         ← site constants
├── navigation.js   ← menu anchors
└── seo.js          ← SEO key registry
```

---

## What is messy today

1. **Dual component trees** — `cinematic/` (active) vs `sections/` + `sections/` legacy  
2. **Dual image registries** — `cinematic/sections/images.js` vs `data/media.js`  
3. **Dual public paths** — `public/images/` vs new `public/assets/`  
4. **Logos** at `public/logos/` not yet under `assets/brand/`  
5. **Hero copy** split between `heroV2.config.js` (FR inline) and i18n  
6. **Font packages** in package.json (`@fontsource-variable/*`) unused vs Google Fonts  
7. **Source originals** in `src/villa penensuilla/` (typo in folder name)

---

## Rules for new work

| Adding… | Put it in… |
|---------|------------|
| Homepage section | `src/components/cinematic/sections/` |
| Layout chrome | `src/components/cinematic/` or `layout/` |
| Copy / labels | `src/i18n/locales/fr.json` + `src/content/` README |
| Brand color | `src/config/brand.js` → tailwind extend |
| Static image | `public/assets/images/…` + registry in `images.js` |
| Video | `public/assets/videos/…` + config |
| Font file | `public/assets/fonts/` then `typography.css` |
| Docs | `docs/` |

**Do not** add business logic to config files — registry and constants only.

---

## Safe migration plan (future)

1. Copy logos to `public/assets/brand/logo/` → update `CinematicChrome` paths  
2. Move new photography only under `public/assets/images/properties/`  
3. Centralize hero chapters in i18n  
4. Remove unused legacy sections when confirmed dead  
5. Integrate licensed fonts after files are provided

---

## Scripts

```bash
npm run dev      # local dev
npm run build    # production build
npm run lint     # ESLint
```

No deploy or database commands in this repo frontend scope.
