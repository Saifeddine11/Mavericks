/**
 * Design Tokens
 *
 * Shared between JS animation code and CSS. Brand values live in config/brand.js.
 */

import { brandAliases, brandColors, brandFonts } from '@/config/brand';

export const colors = {
  ...brandColors,
  ...brandAliases,
  limestone: brandColors.greyOrange,
  champagne: brandColors.champagne,
};

export const fonts = brandFonts;

export const easings = {
  editorial: [0.22, 1, 0.36, 1],
  editorialCss: 'cubic-bezier(0.22, 1, 0.36, 1)',
  gsapEditorial: 'power3.out',
  gsapCinematic: 'power4.out',
  none: 'none',
};

export const durations = {
  micro: 0.4,
  base: 0.6,
  reveal: 1.2,
  cinematic: 2.4,
};

export const staggers = {
  tight: 0.04,
  base: 0.08,
  loose: 0.12,
};

export const breakpoints = {
  mobile: '(max-width: 767px)',
  tablet: '(min-width: 768px) and (max-width: 1023px)',
  desktop: '(min-width: 1024px)',
  reduceMotion: '(prefers-reduced-motion: reduce)',
};
