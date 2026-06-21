/**
 * i18n routing helpers
 *
 * URL contract:
 *   /:lang(/*)
 *
 *   /        → redirected to /fr (handled in App.jsx)
 *   /fr      → French homepage
 *   /en      → English homepage
 *   /it, /nl → Italian, Dutch
 *
 * Any path that does not start with a supported language is redirected to
 * /fr, preserving the rest of the path so deep links survive.
 */

import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from '@/i18n';

/**
 * Reads the language segment from a pathname.
 * Returns the language code if recognised, otherwise null.
 *
 *   getLangFromPath('/fr')              → 'fr'
 *   getLangFromPath('/en/collection')   → 'en'
 *   getLangFromPath('/')                → null
 *   getLangFromPath('/marrakech')       → null
 */
export function getLangFromPath(pathname) {
  if (!pathname) return null;
  const segment = pathname.split('/').filter(Boolean)[0];
  if (!segment) return null;
  return SUPPORTED_LANGUAGES.includes(segment) ? segment : null;
}

/**
 * Returns a pathname with its language segment swapped to `nextLang`.
 *
 *   swapLangInPath('/fr/collection', 'en') → '/en/collection'
 *   swapLangInPath('/fr',            'it') → '/it'
 *   swapLangInPath('/anything',      'en') → '/en/anything'
 *   swapLangInPath('/',              'nl') → '/nl'
 *
 * Search and hash are preserved by the caller (we only handle pathname here).
 */
export function swapLangInPath(pathname, nextLang) {
  const parts = (pathname || '/').split('/').filter(Boolean);
  if (parts.length === 0) return `/${nextLang}`;
  if (SUPPORTED_LANGUAGES.includes(parts[0])) {
    parts[0] = nextLang;
  } else {
    parts.unshift(nextLang);
  }
  return '/' + parts.join('/');
}

/**
 * Builds the canonical path for the default language.
 * Used by the `/` redirect.
 */
export function defaultLangPath() {
  return `/${DEFAULT_LANGUAGE}`;
}
