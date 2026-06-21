/**
 * Marrakech investment territories — horizontal gallery data.
 *
 * Swap `mediaKey` or `imageFallback` when zone-specific photography is ready.
 * Images resolve via `getMediaSrc` (local paths or remote CDN fallback).
 */

import { getMediaSrc } from '@/lib/media';
import { CINEMATIC_IMAGES } from '@/components/cinematic/sections/images';

/**
 * @typedef {Object} TerritoryZone
 * @property {string} id — i18n key suffix under `cinematic.territories.zones.*`
 * @property {string} [mediaKey] — key in `MEDIA` manifest
 * @property {() => string} [imageFallback] — used when no dedicated location asset yet
 */

/** @type {TerritoryZone[]} */
export const TERRITORY_ZONES = [
  {
    id: 'palmeraie',
    mediaKey: 'locationPalmeraie',
    imageFallback: () => CINEMATIC_IMAGES.teaserOne,
  },
  {
    id: 'hivernage',
    mediaKey: 'locationHivernage',
    imageFallback: () => CINEMATIC_IMAGES.propertyVilla,
  },
  {
    id: 'gueliz',
    mediaKey: 'locationGueliz',
    imageFallback: () => CINEMATIC_IMAGES.propertyAppartement,
  },
  {
    id: 'agdal',
    mediaKey: 'locationAgdal',
    imageFallback: () => CINEMATIC_IMAGES.growing,
  },
  {
    id: 'amelkis',
    mediaKey: 'locationAmelkis',
    imageFallback: () => CINEMATIC_IMAGES.propertyVilla,
  },
  {
    id: 'medina',
    mediaKey: 'locationMedina',
    imageFallback: () => CINEMATIC_IMAGES.propertyRiad,
  },
  {
    id: 'ourika',
    mediaKey: 'locationOurika',
    imageFallback: () => CINEMATIC_IMAGES.teaserOne,
  },
];

/**
 * Resolve image URL for a territory zone.
 * @param {TerritoryZone} zone
 */
export function getTerritoryImage(zone) {
  if (zone.mediaKey) {
    try {
      return getMediaSrc(zone.mediaKey);
    } catch {
      // Local file missing — fall through
    }
  }
  return zone.imageFallback?.() ?? '';
}

/**
 * Build gallery items with copy from i18n.
 * @param {(key: string, opts?: object) => string} t
 */
export function buildTerritoryGalleryItems(t) {
  return TERRITORY_ZONES.map((zone) => {
    const base = `cinematic.territories.zones.${zone.id}`;
    const label = t(`${base}.label`);
    const subtitle = t(`${base}.angle`);
    const tag = t(`${base}.tag`);
    return {
      image: getTerritoryImage(zone),
      label,
      subtitle,
      tag,
      ariaLabel: `${label} — ${subtitle} — ${tag}`,
    };
  });
}
