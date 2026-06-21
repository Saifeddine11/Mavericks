/**
 * Navigation registry — labels live in i18n; anchors map to homepage sections.
 * Do not change routes here without updating CinematicChrome.jsx MENU_ITEMS.
 */

export const navigationAnchors = {
  home: '#hero',
  private: '#architecture',
  offPlan: '#concept',
  villasRiads: '#architecture',
  invest: '#concept',
  mavericks: '#concept',
  contact: '#contact',
};

/** i18n key prefix for menu labels */
export const navigationMenuKeyPrefix = 'cinematic.menu';

/**
 * Menu item ids (must match CinematicChrome MENU_ITEMS + fr.json cinematic.menu.*)
 */
export const navigationMenuIds = [
  'home',
  'private',
  'offPlan',
  'villasRiads',
  'invest',
  'mavericks',
  'contact',
];
