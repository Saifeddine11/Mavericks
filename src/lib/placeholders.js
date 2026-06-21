/**
 * Placeholder image generator
 *
 * Generates inline SVG data URIs used as placeholders throughout the
 * cinematic homepage, until real Marrakech photography is dropped into
 * `public/images/`.
 *
 * Each placeholder is a deliberately composed gradient — never just a flat
 * tile — using the project palette. Different `tone` values produce visually
 * distinct slots, so a six-card section reads as composed even before real
 * assets arrive.
 *
 * Usage:
 *   import { placeholder } from '@/lib/placeholders';
 *   <img src={placeholder('villa-warm')} alt="" />
 */

import { colors } from '@/styles/tokens';

// Hand-tuned palette pairs. Order matters: each entry produces a visually
// different slot, and the keys are referenced from section components.
const TONES = {
  // Hero / atmosphere — warmest, most luminous.
  'hero':       { from: colors.ivory,     to: colors.champagne, accent: '#FFFFFF' },
  // Dream / mist — palest, closest to white.
  'mist':       { from: '#FAF7EF',        to: colors.limestone,  accent: '#FFFFFF' },
  // Set-piece reveal — slightly more contrast for the dark text plate.
  'reveal':     { from: colors.limestone, to: colors.sand,       accent: '#E8D9C0' },
  // Collection categories — five distinct warm tones.
  'villas':     { from: '#EFE5D2',        to: colors.champagne,  accent: colors.gold },
  'riads':      { from: colors.limestone, to: '#BFA678',         accent: colors.gold },
  'estates':    { from: '#EAE0CB',        to: '#C5AC7E',         accent: colors.gold },
  'penthouses': { from: '#F2EBDB',        to: '#D9C49C',         accent: colors.gold },
  'offmarket':  { from: '#E5DCC8',        to: '#A89368',         accent: colors.gold },
  // Floating fragments — small details, lighter / softer.
  'fragment-a': { from: '#F0E9D8',        to: colors.sand,       accent: '#FFFFFF' },
  'fragment-b': { from: '#F5F1E8',        to: '#D9C9AC',         accent: '#FFFFFF' },
  'fragment-c': { from: colors.limestone, to: '#C5B08A',         accent: '#FFFFFF' },
  'fragment-d': { from: '#F2EAD7',        to: '#CDB890',         accent: '#FFFFFF' },
  // Locations — six neighborhoods, distinct warm tones with a vertical bias.
  'palmeraie':  { from: '#F0E6D0',        to: '#B89866',         accent: colors.gold },
  'hivernage':  { from: colors.limestone, to: '#CFB286',         accent: colors.gold },
  'amelkis':    { from: '#EDE2CB',        to: '#C2A574',         accent: colors.gold },
  'ourika':     { from: '#F4EBD9',        to: '#BDA071',         accent: colors.gold },
  'medina':     { from: '#E8DCC1',        to: '#A88B5C',         accent: colors.gold },
  'agdal':      { from: '#F1E8D4',        to: '#C9AE7E',         accent: colors.gold },
};

const DEFAULT_TONE = 'hero';

/**
 * Returns a data: URI SVG placeholder. Cheap to generate, cached by the
 * browser like any image, and never makes a network request.
 *
 * @param {string} tone   — key in TONES above.
 * @param {string} label  — optional small text in the bottom-left corner.
 * @param {number} ratio  — aspect ratio (width / height). Default 4/5.
 */
export function placeholder(tone = DEFAULT_TONE, label = '', ratio = 4 / 5) {
  const palette = TONES[tone] ?? TONES[DEFAULT_TONE];
  const w = 1200;
  const h = Math.round(w / ratio);

  // The grain filter adds subtle texture so the placeholder never reads as
  // a flat tile. fractalNoise is supported by every modern browser.
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid slice">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="0.4" y2="1">
        <stop offset="0%" stop-color="${palette.from}"/>
        <stop offset="100%" stop-color="${palette.to}"/>
      </linearGradient>
      <radialGradient id="sun" cx="0.78" cy="0.28" r="0.55">
        <stop offset="0%" stop-color="${palette.accent}" stop-opacity="0.45"/>
        <stop offset="100%" stop-color="${palette.accent}" stop-opacity="0"/>
      </radialGradient>
      <filter id="grain">
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="${tone.length}"/>
        <feColorMatrix values="0 0 0 0 0.95   0 0 0 0 0.9   0 0 0 0 0.82   0 0 0 0.06 0"/>
      </filter>
    </defs>
    <rect width="${w}" height="${h}" fill="url(#g)"/>
    <rect width="${w}" height="${h}" fill="url(#sun)"/>
    <rect width="${w}" height="${h}" filter="url(#grain)" opacity="0.22"/>
    ${label ? `<text x="60" y="${h - 60}" font-family="Georgia, serif" font-size="32" fill="#081826" opacity="0.32" letter-spacing="3">${label}</text>` : ''}
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
