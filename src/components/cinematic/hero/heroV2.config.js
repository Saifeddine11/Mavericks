/**
 * Hero V2 — single source of truth for scroll-scrub hero (OffMarket reference).
 */

export const heroV2Config = {
  video: {
    src: '/videos/offmarket-hero-video2.mp4',
    poster: '/videos/hero-poster.jpg',
  },
  /** Pinned section height (× 100vh). */
  pinScrollDistance: 3.5,
  /** Mobile pin height (× 100svh) — stable on iOS address bar. */
  pinScrollDistanceMobile: 3.2,
  /** Min delta (seconds) before writing video.currentTime (~60fps). */
  seekFrameThreshold: 1 / 60,
  /** CTA visible from this scroll progress (0..1). */
  ctaRevealAt: 0.68,
  ctaFadeSpan: 0.08,
  primaryCta: {
    label: 'Parler de mon projet',
    href: '#contact',
  },
  secondaryCta: {
    label: 'Découvrir la sélection',
    href: '#architecture',
  },
  chapters: [
    {
      headline: 'Immobilier privé à Marrakech.',
      subline:
        'Biens sur plan, villas, riads et opportunités off-market — sélectionnés avec précision.',
      isH1: true,
      theme: 'lightText',
      veil: 'darkVeil',
    },
    {
      headline: 'BIENS SÉLECTIONNÉS',
      subline:
        'Villas, appartements et riads bien placés — choisis selon votre projet, votre budget et votre calendrier.',
      isH1: false,
      theme: 'darkText',
      veil: 'softLightVeil',
    },
    {
      headline: 'OPPORTUNITÉS OFF-MARKET',
      subline:
        'Certaines adresses circulent discrètement, parfois non diffusées publiquement. Certaines peuvent être accessibles via Mavericks.',
      isH1: false,
      theme: 'darkText',
      veil: 'softLightVeil',
    },
    {
      headline: 'PARLER DE VOTRE PROJET',
      subline:
        'Mavericks accompagne des acheteurs exigeants dans l’accès à des biens bien situés, parfois non diffusés publiquement, à Marrakech.',
      isH1: false,
      theme: 'lightText',
      veil: 'darkVeil',
    },
  ],
};
