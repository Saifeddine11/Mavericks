/**
 * FloatingChrome
 *
 * The persistent floating UI layer for the cinematic homepage. Replaces the
 * conventional <Header> on the home route. Three anchor points:
 *
 *   - top-left:     a single pill containing MENU and ENQUIRE actions.
 *                   Backdrop-blurred, hairline border, refined.
 *   - top-right:    a tight inline language switcher (FR · EN · IT · NL).
 *   - bottom-right: a scroll counter (01 / 06) tied to [data-shot] sections.
 *
 * No site-wide header bar. The wordmark never appears at the top of the
 * film — it lives in the footer (end credits).
 *
 * Visibility: chrome appears with a slow fade once the page has mounted and
 * the user has paused at the hero. We don't hide it on scroll — that would
 * be UI gymnastics and would clash with the calm pace.
 */

import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

import LanguageSwitcher from '@/components/ui/LanguageSwitcher';
import ScrollCounter from '@/components/motion/ScrollCounter';
import { easings, durations } from '@/styles/tokens';
import { getLangFromPath } from '@/i18n/routing';
import { DEFAULT_LANGUAGE } from '@/i18n';

export default function FloatingChrome() {
  const { t } = useTranslation();
  const reduce = useReducedMotion();
  const location = useLocation();
  const lang = getLangFromPath(location.pathname) ?? DEFAULT_LANGUAGE;

  // Soft mount-in: the chrome fades up after the hero has landed so it
  // doesn't compete with the headline reveal.
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = window.setTimeout(() => setMounted(true), 800);
    return () => window.clearTimeout(t);
  }, []);

  const fadeIn = {
    initial: reduce ? { opacity: 1 } : { opacity: 0, y: -8 },
    animate: {
      opacity: mounted ? 1 : reduce ? 1 : 0,
      y: mounted ? 0 : reduce ? 0 : -8,
      transition: { duration: durations.reveal, ease: easings.editorial },
    },
  };

  return (
    <>
      {/* ──────────────────────────────────────────────────────────────
         Top-left: MENU · ENQUIRE pill
         ────────────────────────────────────────────────────────────── */}
      <motion.div
        {...fadeIn}
        className="fixed left-6 top-6 z-50 md:left-10 md:top-10"
      >
        <div
          className="
            flex items-center gap-0 overflow-hidden
            rounded-full border border-navy/15
            bg-ivory/60 backdrop-blur-md
            shadow-soft
          "
        >
          <button
            type="button"
            aria-label={t('chrome.menu')}
            className="
              group flex items-center gap-2.5 pl-5 pr-4 py-3
              text-[11px] uppercase tracking-widest text-navy
              transition-colors duration-400 ease-editorial
              hover:text-graphite
            "
          >
            {/* Two-bar mark — subtle, never burger-style */}
            <span aria-hidden="true" className="flex flex-col gap-[4px]">
              <span className="block h-px w-4 bg-current transition-all duration-400 ease-editorial group-hover:w-5" />
              <span className="block h-px w-3 bg-current transition-all duration-400 ease-editorial group-hover:w-5" />
            </span>
            <span>{t('chrome.menu')}</span>
          </button>

          <span aria-hidden="true" className="block h-4 w-px bg-navy/15" />

          <Link
            to={`/${lang}#enquire`}
            className="
              flex items-center gap-2.5 pl-4 pr-5 py-3
              text-[11px] uppercase tracking-widest text-navy
              transition-colors duration-400 ease-editorial
              hover:text-graphite
            "
          >
            <span>{t('chrome.enquire')}</span>
            <span
              aria-hidden="true"
              className="block h-px w-3 bg-gold transition-all duration-400 ease-editorial hover:w-5"
            />
          </Link>
        </div>
      </motion.div>

      {/* ──────────────────────────────────────────────────────────────
         Top-right: language switcher capsule
         ────────────────────────────────────────────────────────────── */}
      <motion.div
        {...fadeIn}
        className="fixed right-6 top-6 z-50 md:right-10 md:top-10"
      >
        <div
          className="
            rounded-full border border-navy/15
            bg-ivory/60 backdrop-blur-md
            px-5 py-3 shadow-soft
          "
        >
          <LanguageSwitcher variant="compact" />
        </div>
      </motion.div>

      {/* ──────────────────────────────────────────────────────────────
         Bottom-right: scroll counter (01 / 06)
         ────────────────────────────────────────────────────────────── */}
      <motion.div
        {...fadeIn}
        className="fixed bottom-6 right-6 z-50 md:bottom-10 md:right-10"
      >
        <div
          className="
            flex items-center gap-3
            rounded-full border border-navy/15
            bg-ivory/60 backdrop-blur-md
            px-4 py-2 text-navy shadow-soft
          "
        >
          <ScrollCounter />
        </div>
      </motion.div>
    </>
  );
}
