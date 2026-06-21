/**
 * LanguageSwitcher
 *
 * Minimal inline language picker. URL-first navigation via swapLangInPath.
 *
 * Props:
 *   variant — 'inline' | 'compact' (size/spacing)
 *   tone    — 'onLight' (dark text on light bg) | 'onDark' (light text on dark bg)
 */

import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { SUPPORTED_LANGUAGES, LANGUAGE_LABELS, DEFAULT_LANGUAGE } from '@/i18n';
import { getLangFromPath, swapLangInPath } from '@/i18n/routing';

const TONE_STYLES = {
  onLight: {
    active: 'text-dark-red',
    inactive: 'text-graphite/70 hover:text-dark-red',
    divider: 'text-graphite/35',
    underline: 'bg-champagne',
  },
  onDark: {
    active: 'text-champagne',
    inactive: 'text-stone-brand/55 hover:text-champagne-light',
    divider: 'text-stone-brand/35',
    underline: 'bg-champagne-light',
  },
};

export default function LanguageSwitcher({ variant = 'inline', tone = 'onLight', className }) {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const current = getLangFromPath(location.pathname) ?? DEFAULT_LANGUAGE;
  const styles = TONE_STYLES[tone] ?? TONE_STYLES.onLight;

  const handleChange = (lng) => {
    if (lng === current) return;
    const nextPath = swapLangInPath(location.pathname, lng);
    navigate(`${nextPath}${location.search}${location.hash}`);
  };

  return (
    <nav
      aria-label={t('language.label')}
      className={clsx(
        'flex items-center font-label',
        variant === 'compact' ? 'gap-2 text-[11px]' : 'gap-3 text-xs',
        className,
      )}
    >
      {SUPPORTED_LANGUAGES.map((lng, idx) => {
        const isActive = current === lng;
        return (
          <span key={lng} className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => handleChange(lng)}
              aria-current={isActive ? 'true' : undefined}
              aria-label={t('language.switchTo', { language: LANGUAGE_LABELS[lng] })}
              className={clsx(
                'relative uppercase tracking-[0.2em] transition-colors duration-400 ease-editorial',
                isActive ? styles.active : styles.inactive,
              )}
            >
              <span>{LANGUAGE_LABELS[lng]}</span>
              <span
                aria-hidden="true"
                className={clsx(
                  'absolute -bottom-1 left-0 right-0 h-px transition-opacity duration-400 ease-editorial',
                  styles.underline,
                  isActive ? 'opacity-80' : 'opacity-0',
                )}
              />
            </button>
            {idx < SUPPORTED_LANGUAGES.length - 1 && (
              <span aria-hidden="true" className={styles.divider}>
                /
              </span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
