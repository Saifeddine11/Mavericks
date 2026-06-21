# Mavericks — Brand System

## Positioning

Mavericks is a **private real estate house in Marrakech** — not a public catalogue agency.

We present:

- Off-market and private opportunities
- Selected on-plan apartments and villas
- Existing villas, apartments, and riads
- Investment-oriented opportunities matched to client search, budget, purpose, and timing

**Safe language:** private selection, off-market opportunities, confidential access, properties not always publicly listed, some opportunities available through Mavericks.

**Avoid claiming:** every property is exclusive, guaranteed returns, best price, 100% safe, catalogue language.

---

## Typography hierarchy

| Role | Current (production) | Planned (licensed) |
|------|--------------------|--------------------|
| Display / editorial | Cormorant Garamond (`font-editorial`) | OT Jubilee / Voyage |
| Labels / navigation | Tenor Sans (`font-label`) | Switzer Medium |
| Body | Questrial (`font-body`) | Switzer Regular |

**Source of truth:** `src/config/brand.js` → `brandFonts`  
**Tailwind:** `tailwind.config.js` → `fontFamily`  
**CSS:** `src/index.css` (Google Fonts import)

Scale: `display-xl`, `display-lg`, `display-md`, `eyebrow` in Tailwind.

---

## Color system

| Token | Hex | Usage |
|-------|-----|-------|
| Stone | `#F1EBEB` | Primary text on dark, page light bg |
| Dark Red | `#270707` | Primary dark surfaces, text on light |
| Deep Red | `#660810` | Accents |
| Champagne | `#B88A5A` | CTAs, highlights |
| Grey Orange | `#D6C0B1` | Muted text, inactive states |
| Graphite | `#2E3430` | Body on light sections |

**Source of truth:** `src/config/brand.js`  
**CSS variables:** `src/styles/colors.css`  
**Tailwind:** `tailwind.config.js`

---

## Tone of voice

**Use:** sélection privée, opportunités off-market, biens confidentiels, biens bien placés, sur plan, villas, riads, emplacement, rareté, qualification, accompagnement discret, lecture du marché, Marrakech.

**Avoid:** pas cher, meilleur prix garanti, tous les biens, catalogue, agence classique, opportunité incroyable, 100% rentable, luxe bling, maison de rêve.

**Character:** calm, private, precise, premium, confident — not loud or commercial.

---

## CTA style

Qualification-oriented:

- Parler de mon projet
- Découvrir la sélection
- Accéder aux opportunités privées
- Recevoir une sélection ciblée
- Décrire ma recherche

Avoid: Acheter maintenant, Voir toutes les annonces, Réserver vite.

Visual: champagne border/fill on dark (`hero-v2-cta-primary`), understated secondary links.

---

## Image direction

- Full-bleed cinematic photography
- Warm light, stone, water, vegetation, architecture
- No flashy real-estate staging
- Property types: villa terrace, interior living, riad/patio atmosphere

---

## Content source

French copy: `src/i18n/locales/fr.json`  
Editorial direction: `docs/CONTENT_DIRECTION.md`
