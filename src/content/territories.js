/**
 * Marrakech investment territories — horizontal gallery data (4-card selection).
 * Photography: Villa Péninsula only (`public/images/villa-peninsula/investment/`).
 */

const INVESTMENT_BASE = '/images/villa-peninsula/investment';

/** @type {Record<string, string>} */
export const TERRITORY_INVESTMENT_IMAGES = {
  triangleOrHivernage: `${INVESTMENT_BASE}/triangle-or-hivernage.png`,
  guelizHyperCentre: `${INVESTMENT_BASE}/gueliz-hypercentre.webp`,
  palmeraie: `${INVESTMENT_BASE}/palmeraie.webp`,
  ourika: `${INVESTMENT_BASE}/route-ourika.webp`,
};

/**
 * @typedef {Object} TerritoryZone
 * @property {string} id — i18n key suffix under `cinematic.territories.zones.*`
 * @property {string} imageKey — key in TERRITORY_INVESTMENT_IMAGES
 */

/** @type {TerritoryZone[]} */
export const TERRITORY_ZONES = [
  { id: 'triangleOrHivernage', imageKey: 'triangleOrHivernage' },
  { id: 'guelizHyperCentre', imageKey: 'guelizHyperCentre' },
  { id: 'palmeraie', imageKey: 'palmeraie' },
  { id: 'ourika', imageKey: 'ourika' },
];

/**
 * @param {TerritoryZone} zone
 */
export function getTerritoryImage(zone) {
  return TERRITORY_INVESTMENT_IMAGES[zone.imageKey] ?? '';
}

/**
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
