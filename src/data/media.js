/**
 * Mavericks homepage — image manifest (single source of truth).
 *
 * Drop production assets into `public/images/` using the `local` paths below.
 * No component changes required when swapping files.
 *
 * Source mode (`VITE_IMAGE_SOURCE` in `.env`):
 *   - omitted or `local`  → `/images/...` (default; files in public/images/)
 *   - `remote`            → temporary Unsplash / Pexels URLs (offline CDN fallback)
 *
 * Remote URLs are Marrakech / Morocco architecture only — bright, warm, private.
 * Replace with Mavericks photography when ready.
 */

const BASE = '/images';

/** @type {'local' | 'remote'} */
export const IMAGE_SOURCE =
  import.meta.env.VITE_IMAGE_SOURCE === 'remote' ? 'remote' : 'local';

/**
 * @typedef {Object} MediaEntry
 * @property {string} local
 * @property {string} remote
 * @property {string} altKey — i18n key under `media.*`
 * @property {string} [sizes] — responsive `sizes` attribute
 * @property {'lazy' | 'eager'} [loading]
 * @property {string} [credit] — attribution note for README / manifest only
 */

/** @type {Record<string, MediaEntry>} */
export const MEDIA = {
  hero: {
    local: `${BASE}/hero/marrakech-luxury-villa.jpg`,
    remote:
      'https://images.unsplash.com/photo-1477120128765-a0528148fed2?auto=format&fit=crop&w=2400&q=85',
    altKey: 'media.hero.alt',
    sizes: '100vw',
    loading: 'eager',
    credit: 'El Fenn riad pool, Marrakech — Jason Briscoe / Unsplash',
  },

  fragment01: {
    local: `${BASE}/floating/fragment-01.jpg`,
    remote:
      'https://images.unsplash.com/photo-1758621664490-d144666a1488?auto=format&fit=crop&w=1200&q=85',
    altKey: 'media.fragments.stoneArch.alt',
    sizes: '(max-width: 768px) 22vw, 280px',
    loading: 'lazy',
    credit: 'Marrakech courtyard arches — Riccardo Monteleone / Unsplash',
  },
  fragment02: {
    local: `${BASE}/floating/fragment-02.jpg`,
    remote:
      'https://images.unsplash.com/photo-1570135460243-84a775827316?auto=format&fit=crop&w=1200&q=85',
    altKey: 'media.fragments.waterMirror.alt',
    sizes: '(max-width: 768px) 32vw, 420px',
    loading: 'lazy',
    credit: 'Riad pool, Marrakech — Alex Azabache / Unsplash',
  },
  fragment03: {
    local: `${BASE}/floating/fragment-03.jpg`,
    remote:
      'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1000',
    altKey: 'media.fragments.threshold.alt',
    sizes: '(max-width: 768px) 18vw, 200px',
    loading: 'lazy',
    credit: 'Moroccan doorway detail — Pexels',
  },
  fragment04: {
    local: `${BASE}/floating/fragment-04.jpg`,
    remote:
      'https://images.pexels.com/photos/271743/pexels-photo-271743.jpeg?auto=compress&cs=tinysrgb&w=1200',
    altKey: 'media.fragments.sunlitPatio.alt',
    sizes: '(max-width: 768px) 22vw, 260px',
    loading: 'lazy',
    credit: 'Sunlit interior patio — Pexels',
  },

  reveal: {
    local: `${BASE}/reveal/villa-courtyard-expand.jpg`,
    remote:
      'https://images.unsplash.com/photo-1758621664490-d144666a1488?auto=format&fit=crop&w=2400&q=85',
    altKey: 'media.reveal.alt',
    sizes: '100vw',
    loading: 'lazy',
    credit: 'Marrakech courtyard — Riccardo Monteleone / Unsplash',
  },

  collectionVillas: {
    local: `${BASE}/collection/villas.jpg`,
    remote:
      'https://images.pexels.com/photos/3155666/pexels-photo-3155666.jpeg?auto=compress&cs=tinysrgb&w=1600',
    altKey: 'media.collection.villas.alt',
    sizes: '(max-width: 1024px) 100vw, 50vw',
    loading: 'lazy',
    credit: 'Moroccan residence exterior — Pexels',
  },
  collectionRiads: {
    local: `${BASE}/collection/riads.jpg`,
    remote:
      'https://images.unsplash.com/photo-1570135460243-84a775827316?auto=format&fit=crop&w=1600&q=85',
    altKey: 'media.collection.riads.alt',
    sizes: '(max-width: 1024px) 100vw, 50vw',
    loading: 'lazy',
    credit: 'Riad pool, Marrakech — Alex Azabache / Unsplash',
  },
  collectionEstates: {
    local: `${BASE}/collection/estates.jpg`,
    remote:
      'https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg?auto=compress&cs=tinysrgb&w=1600',
    altKey: 'media.collection.estates.alt',
    sizes: '(max-width: 1024px) 100vw, 50vw',
    loading: 'lazy',
    credit: 'Palm garden estate — Pexels',
  },
  collectionPenthouses: {
    local: `${BASE}/collection/penthouses.jpg`,
    remote:
      'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=1600',
    altKey: 'media.collection.penthouses.alt',
    sizes: '(max-width: 1024px) 100vw, 50vw',
    loading: 'lazy',
    credit: 'Terrace and horizon — Pexels',
  },
  collectionOffMarket: {
    local: `${BASE}/collection/off-market.jpg`,
    remote:
      'https://images.pexels.com/photos/1245437/pexels-photo-1245437.jpeg?auto=compress&cs=tinysrgb&w=1600',
    altKey: 'media.collection.offMarket.alt',
    sizes: '(max-width: 1024px) 100vw, 50vw',
    loading: 'lazy',
    credit: 'Private architectural detail — Pexels',
  },

  locationPalmeraie: {
    local: `${BASE}/locations/palmeraie.jpg`,
    remote:
      'https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg?auto=compress&cs=tinysrgb&w=1600',
    altKey: 'media.locations.palmeraie.alt',
    sizes: '(max-width: 768px) 82vw, 44vw',
    loading: 'lazy',
    credit: 'Palm grove garden — Pexels',
  },
  locationHivernage: {
    local: `${BASE}/locations/hivernage.jpg`,
    remote:
      'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1600',
    altKey: 'media.locations.hivernage.alt',
    sizes: '(max-width: 768px) 82vw, 44vw',
    loading: 'lazy',
    credit: 'Moroccan architecture — Pexels',
  },
  locationAmelkis: {
    local: `${BASE}/locations/amelkis.jpg`,
    remote:
      'https://images.pexels.com/photos/2044000/pexels-photo-2044000.jpeg?auto=compress&cs=tinysrgb&w=1600',
    altKey: 'media.locations.amelkis.alt',
    sizes: '(max-width: 768px) 82vw, 44vw',
    loading: 'lazy',
    credit: 'Resort garden — Pexels',
  },
  locationOurika: {
    local: `${BASE}/locations/ourika.jpg`,
    remote:
      'https://images.pexels.com/photos/208745/pexels-photo-208745.jpeg?auto=compress&cs=tinysrgb&w=1600',
    altKey: 'media.locations.ourika.alt',
    sizes: '(max-width: 768px) 82vw, 44vw',
    loading: 'lazy',
    credit: 'Atlas foothills light — Pexels',
  },
  locationMedina: {
    local: `${BASE}/locations/medina.jpg`,
    remote:
      'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1600',
    altKey: 'media.locations.medina.alt',
    sizes: '(max-width: 768px) 82vw, 44vw',
    loading: 'lazy',
    credit: 'Medina street architecture — Pexels',
  },
  locationAgdal: {
    local: `${BASE}/locations/agdal.jpg`,
    remote:
      'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1600',
    altKey: 'media.locations.agdal.alt',
    sizes: '(max-width: 768px) 82vw, 44vw',
    loading: 'lazy',
    credit: 'Modern residential garden — Pexels',
  },
  locationGueliz: {
    local: `${BASE}/locations/gueliz.jpg`,
    remote:
      'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=1600',
    altKey: 'media.locations.gueliz.alt',
    sizes: '(max-width: 768px) 82vw, 44vw',
    loading: 'lazy',
    credit: 'Urban terrace apartment — Pexels (placeholder until Guéliz photography)',
  },
};

/** Map collection category keys → media keys */
export const COLLECTION_MEDIA_KEYS = {
  villas: 'collectionVillas',
  riads: 'collectionRiads',
  estates: 'collectionEstates',
  penthouses: 'collectionPenthouses',
  offmarket: 'collectionOffMarket',
};

/** Map location slug → media keys */
export const LOCATION_MEDIA_KEYS = {
  palmeraie: 'locationPalmeraie',
  hivernage: 'locationHivernage',
  amelkis: 'locationAmelkis',
  ourika: 'locationOurika',
  medina: 'locationMedina',
  agdal: 'locationAgdal',
  gueliz: 'locationGueliz',
};

/**
 * Resolved image URL for a manifest key.
 * @param {keyof typeof MEDIA | string} key
 */
export function getMediaSrc(key) {
  const entry = MEDIA[key];
  if (!entry) {
    throw new Error(`[media] Unknown key: ${key}`);
  }
  return IMAGE_SOURCE === 'remote' ? entry.remote : entry.local;
}

/**
 * Props for <img> / motion image components.
 * @param {string} key
 * @param {(key: string) => string} t — i18next `t`
 */
export function getMediaImageProps(key, t) {
  const entry = MEDIA[key];
  if (!entry) {
    throw new Error(`[media] Unknown key: ${key}`);
  }
  return {
    src: getMediaSrc(key),
    alt: t(entry.altKey),
    sizes: entry.sizes ?? '100vw',
    loading: entry.loading ?? 'lazy',
  };
}
