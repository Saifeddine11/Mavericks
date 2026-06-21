/**
 * Header
 *
 * Minimal site header.
 *
 *  ┌───────────────────────────────────────────────────────────────────────┐
 *  │  MAVERICKS                          FR / EN / IT / NL    [Menu]       │
 *  └───────────────────────────────────────────────────────────────────────┘
 *
 *  - Fixed to the top of the viewport.
 *  - Transparent over the hero, but gets a subtle ivory wash + hairline once
 *    the user has scrolled past a threshold (set up in Phase 2 with a hook).
 *  - The mobile menu button is a placeholder for Phase 2/3 — it currently
 *    only renders, no overlay yet.
 *
 *  In Phase 1 there are no nav links yet (only the homepage exists). When
 *  additional pages are added in later phases, links go into the centre.
 */

import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';
import { getLangFromPath } from '@/i18n/routing';
import { DEFAULT_LANGUAGE } from '@/i18n';

export default function Header() {
  const { t } = useTranslation();
  const location = useLocation();
  const lang = getLangFromPath(location.pathname) ?? DEFAULT_LANGUAGE;

  return (
    <header
      className="fixed inset-x-0 top-0 z-40"
      // Subtle wash so the wordmark stays readable over bright hero imagery.
      // No solid background — the page must feel airy.
      style={{
        background:
          'linear-gradient(to bottom, rgba(245, 241, 232, 0.6) 0%, rgba(245, 241, 232, 0) 100%)',
      }}
    >
      <div className="container-editorial flex items-center justify-between py-6 md:py-8">
        {/* Wordmark — Fraunces, tracked out for editorial poise. */}
        <Link
          to={`/${lang}`}
          aria-label="Mavericks"
          className="font-serif text-lg tracking-[0.28em] uppercase text-navy hover:opacity-80 transition-opacity duration-400 ease-editorial"
          style={{ fontVariationSettings: "'opsz' 144" }}
        >
          Mavericks
        </Link>

        {/* Right cluster: language + menu (menu wired in Phase 2). */}
        <div className="flex items-center gap-8">
          <LanguageSwitcher />

          <button
            type="button"
            aria-label={t('nav.menu')}
            className="hidden md:flex items-center gap-3 text-xs uppercase tracking-widest text-navy hover:text-graphite transition-colors duration-400 ease-editorial"
          >
            {/* Two-line icon — refined, never a burger. */}
            <span aria-hidden="true" className="flex flex-col gap-[5px]">
              <span className="block h-px w-5 bg-current" />
              <span className="block h-px w-5 bg-current" />
            </span>
            <span>{t('nav.menu')}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
