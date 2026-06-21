/**
 * Internationalization — Mavericks
 *
 * French is the default and fallback language.
 * Supported: FR, EN, IT, NL.
 *
 * Language is resolved in this priority order:
 *   1. URL path prefix (/fr, /en, /it, /nl) — kept in sync by
 *      `useSyncLanguageWithUrl` in App.jsx. URL is authoritative at runtime.
 *   2. localStorage key `i18nextLng` — used by the detector below for the
 *      very first render only, before the URL sync hook commits.
 *   3. <html lang> attribute
 *   4. browser preference
 *   5. fallback (fr)
 *
 * Locale JSON files are bundled at build time (not loaded async) — they are
 * tiny and we want them available on first paint.
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import fr from './locales/fr.json';
import en from './locales/en.json';
import it from './locales/it.json';
import nl from './locales/nl.json';

export const SUPPORTED_LANGUAGES = /** @type {const} */ (['fr', 'en', 'it', 'nl']);
export const DEFAULT_LANGUAGE = 'fr';

export const LANGUAGE_LABELS = {
  fr: 'FR',
  en: 'EN',
  it: 'IT',
  nl: 'NL',
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      fr: { translation: fr },
      en: { translation: en },
      it: { translation: it },
      nl: { translation: nl },
    },
    fallbackLng: DEFAULT_LANGUAGE,
    supportedLngs: SUPPORTED_LANGUAGES,
    nonExplicitSupportedLngs: true, // 'fr-FR' → 'fr'
    interpolation: {
      escapeValue: false, // React already escapes
    },
    detection: {
      order: ['path', 'localStorage', 'htmlTag', 'navigator'],
      lookupFromPathIndex: 0,
      caches: ['localStorage'],
    },
    react: {
      useSuspense: false, // resources are bundled; no suspension needed
    },
  });

export default i18n;
