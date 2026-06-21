/** Scroll-video hero — paths, chapter copy, progress mapping */

export const HERO_VIDEO_SRC = '/videos/offmarket-hero-video2.mp4';
export const HERO_VIDEO_OBJECT_POSITION = 'object-[center_40%] md:object-[center_38%]';
export const HERO_POSTER_SRC = '/videos/hero-poster.svg';

/** Scroll snap — clean chapter resting points (text only; video stays 1:1 with scroll) */
export const HERO_SNAP_POINTS = [0, 0.2, 0.4, 0.8, 1];

export const HERO_CHAPTERS = [
  {
    id: 'intro',
    label: 'intro',
    progress: 0,
    kicker: 'Maison Mavericks',
    title: 'MAVERICKS',
    body: 'Maison privée d’immobilier de prestige à Marrakech.',
  },
  {
    id: 'visible',
    label: 'visibleMarket',
    progress: 0.2,
    kicker: 'Collection',
    title: 'BIENS VISIBLES',
    body: 'Villas, riads, appartements et domaines sélectionnés à Marrakech.',
  },
  {
    id: 'confidential',
    label: 'confidentialMarket',
    progress: 0.4,
    kicker: 'Off-market',
    title: 'OPPORTUNITÉS CONFIDENTIELLES',
    body: 'Des adresses rares, des ventes discrètes et des projets non publiés.',
  },
  {
    id: 'access',
    label: 'privateAccess',
    progress: 0.8,
    kicker: 'Accès privé',
    title: 'VOTRE ACCÈS PRIVÉ COMMENCE ICI',
    body: 'Découvrez ce qui est visible. Accédez à ce qui se transmet.',
    showCta: true,
  },
];

export const HERO_SCROLL_SNAP = {
  snapTo: HERO_SNAP_POINTS,
  duration: { min: 0.35, max: 0.9 },
  delay: 0.08,
  ease: 'power2.out',
  directional: true,
};
