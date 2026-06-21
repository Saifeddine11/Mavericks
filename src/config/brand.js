/**
 * OffMarket Marrakech — brand tokens (single source of truth).
 *
 * Colors and typography roles referenced by Tailwind, CSS, and JS animation code.
 */

export const brandColors = {
  stone: '#F1EBEB',
  deepRed: '#660810',
  darkRed: '#270707',
  greyOrange: '#D6C0B1',
  champagne: '#B88A5A',
  champagneLight: '#C49A6C',
  graphite: '#2E3430',
  white: '#FFFFFF',
};

/** Semantic aliases used across legacy class names during migration. */
export const brandAliases = {
  ivory: brandColors.stone,
  sand: brandColors.greyOrange,
  navy: brandColors.darkRed,
  gold: brandColors.champagne,
  stone: '#8A7E7A',
  ink: brandColors.darkRed,
};

export const brandFonts = {
  label: '"Tenor Sans", system-ui, sans-serif',
  editorial: '"Cormorant Garamond", Georgia, serif',
  body: '"Questrial", system-ui, sans-serif',
};

export const brandTypography = {
  eyebrow: {
    size: '0.6875rem',
    tracking: '0.22em',
    weight: 400,
  },
  display: {
    lineHeight: 1.05,
    letterSpacing: '-0.015em',
  },
};
