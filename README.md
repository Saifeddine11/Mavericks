# Mavericks

Private Luxury Real Estate in Marrakech.

A bright, cinematic, editorial website. Not a real-estate marketplace.

---

## Stack

| Layer        | Tool                                                     |
|--------------|----------------------------------------------------------|
| Build        | Vite                                                     |
| UI           | React 18 + JavaScript                                    |
| Styling      | Tailwind CSS (with project tokens)                       |
| Routing      | React Router DOM                                         |
| i18n         | react-i18next (FR default · EN · IT · NL)                |
| UI motion    | Framer Motion                                            |
| Scroll motion| GSAP + ScrollTrigger + @gsap/react                       |
| Smooth scroll| Lenis (desktop only, off under prefers-reduced-motion)   |
| 3D           | Three.js + React Three Fiber + @react-three/drei         |
| SEO          | react-helmet-async                                       |
| Fonts        | Fraunces (variable) + Inter (variable), self-hosted via Fontsource |

---

## Scripts

```bash
npm install
npm run dev        # http://localhost:5173
npm run build
npm run preview
npm run lint
npm run format
```

---

## Project structure

```
src/
├─ main.jsx              entry: GSAP/i18n bootstrap, Router, Helmet
├─ App.jsx               layout shell + routes + Lenis
├─ index.css             Tailwind + base + font imports
├─ routes/               page-level views
├─ sections/             homepage sections (Phase 3)
├─ components/
│  ├─ layout/            Header, Footer, PageTransition
│  ├─ ui/                LanguageSwitcher + future buttons, cards, form
│  ├─ motion/            TextReveal, ImageReveal, ScrollFadeIn, ... (Phase 2)
│  └─ three/             3D scene (Phase 4)
├─ hooks/                useLenis, useReducedMotion, useIsMobile
├─ lib/                  gsap.js (plugin registry) · motion.js (shared variants)
├─ i18n/                 i18next config + locales/{fr,en,it,nl}.json
├─ styles/tokens.js      design tokens — single source of truth
└─ seo/Seo.jsx           helmet wrapper with hreflang + JSON-LD
```

---

## Design tokens

All colors, eases, durations and breakpoints live in **`src/styles/tokens.js`**.
Tailwind config mirrors these. Animation code imports from here. If a value
appears in both, it lives in `tokens.js`.

### Palette

| Token        | Hex     | Role                             |
|--------------|---------|----------------------------------|
| ivory        | #F5F1E8 | page background (dominant)       |
| limestone    | #E8E1D4 | section dividers, footer surface |
| sand         | #D8C7AE | warm depth                       |
| champagne    | #C8B38A | accent surface                   |
| white        | #FFFFFF | clean break                      |
| navy         | #081826 | primary text                     |
| graphite     | #2E3430 | secondary text                   |
| stone        | #747A72 | tertiary / muted                 |
| gold         | #B8A47A | muted accent — sparingly         |

### Motion language

- Editorial cubic: `[0.22, 1, 0.36, 1]` (Framer) / `power3.out` (GSAP)
- Durations: 0.4s · 0.6s · 1.2s · 2.4s
- Default stagger: 0.08s
- Reduced motion: respected at three levels (Framer's `useReducedMotion`, our
  hook, and a CSS safety-net at the bottom of `index.css`)

---

## Languages

French is default. Switch via the header pill `FR / EN / IT / NL`. Language is
persisted to `localStorage`. All copy is in `src/i18n/locales/`.

> Never hard-code user-facing text in components. Use `t('...')`.

---

## Build phases

| Phase | Scope                                                                  | Status        |
|-------|------------------------------------------------------------------------|---------------|
| 1     | Foundation: tokens, i18n, layout shell, header/footer, SEO, Lenis      | ✅ This phase |
| 2     | Motion primitives: TextReveal, ImageReveal, ScrollFadeIn, ParallaxImage, MagneticButton, HorizontalGallery | ⏳ Next |
| 3     | Homepage sections: Hero, BrandStatement, Collection, Lifestyle, PrivateAccess, SignatureLocations, Enquiry | ⏳ |
| 4     | 3D architecture scene (HeroArchitectureScene + sub-components)         | ⏳ |
| 5     | SEO depth, Lighthouse pass, performance polish                         | ⏳ |

---

## Image assets

See `public/images/README.md` for the asset manifest. Phase 1 ships zero
imagery — text-only placeholder confirms typography and layout.
# Mavericks
