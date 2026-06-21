/**
 * useSyncLanguageWithUrl
 *
 * The URL is the source of truth for language. This hook:
 *
 *   1. Reads the language segment from the current pathname.
 *   2. Calls i18n.changeLanguage(...) whenever it differs from i18n's state.
 *   3. Returns the resolved language code so callers can branch on it.
 *
 * Mounted once at the top of <App>. Routes themselves don't need to think
 * about i18n — they just render based on the active language.
 *
 * Bad / missing language segments are NOT handled here; the router's redirect
 * rules (App.jsx) take care of that before this hook ever sees them.
 */

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getLangFromPath } from '@/i18n/routing';
import { DEFAULT_LANGUAGE } from '@/i18n';

export default function useSyncLanguageWithUrl() {
  const { i18n } = useTranslation();
  const location = useLocation();

  const urlLang = getLangFromPath(location.pathname) ?? DEFAULT_LANGUAGE;

  useEffect(() => {
    const current = (i18n.language || '').split('-')[0];
    if (current !== urlLang) {
      i18n.changeLanguage(urlLang);
    }
  }, [urlLang, i18n]);

  return urlLang;
}
