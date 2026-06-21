import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { gsap } from '@/lib/gsap';

import LanguageSwitcher from '@/components/ui/LanguageSwitcher';
import { useCinematic } from './context/CinematicContext';
import ContentPopup from './shared/ContentPopup';
import SectionIndicator from './shared/SectionIndicator';
import { getLangFromPath } from '@/i18n/routing';
import { DEFAULT_LANGUAGE } from '@/i18n';

/** Expandable groups map to homepage anchors — no new routes */
const MENU_GROUPS = [
  {
    id: 'private',
    href: '#architecture',
    expandable: true,
    children: [
      { id: 'private_offMarket', href: '#architecture' },
      { id: 'private_selection', href: '#architecture' },
      { id: 'private_confidential', href: '#contact' },
    ],
  },
  {
    id: 'offPlan',
    href: '#concept',
    expandable: true,
    children: [
      { id: 'offPlan_apartments', href: '#concept' },
      { id: 'offPlan_villas', href: '#concept' },
      { id: 'offPlan_programs', href: '#concept' },
    ],
  },
  {
    id: 'villasRiads',
    href: '#architecture',
    expandable: true,
    children: [
      { id: 'villasRiads_villas', href: '#architecture' },
      { id: 'villasRiads_riads', href: '#architecture' },
      { id: 'villasRiads_apartments', href: '#architecture' },
    ],
  },
  { id: 'invest', href: '#concept', expandable: false },
  { id: 'mavericks', href: '#concept', expandable: false },
  { id: 'contact', href: '#contact', expandable: false },
];

function MenuLinesIcon({ className }) {
  return (
    <span className={clsx('flex flex-col gap-[5px]', className)} aria-hidden="true">
      <span className="block h-px w-4 bg-current" />
      <span className="block h-px w-4 bg-current" />
    </span>
  );
}

function ContactIcon({ className }) {
  return (
    <svg
      className={className}
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M5 4h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <path d="m5 7 7 5 7-5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function MenuExpandableItem({ item, t, onNavigate }) {
  const [open, setOpen] = useState(false);
  const subRef = useRef(null);
  const hasChildren = item.expandable && item.children?.length;

  useEffect(() => {
    const el = subRef.current;
    if (!el || !hasChildren) return;
    gsap.to(el, {
      height: open ? 'auto' : 0,
      opacity: open ? 1 : 0,
      duration: 0.45,
      ease: 'power2.inOut',
    });
  }, [open, hasChildren]);

  if (!hasChildren) {
    return (
      <li className="cinematic-menu-item border-b border-white/[0.08] py-5 last:border-b-0">
        <a
          href={item.href}
          onClick={onNavigate}
          className="cinematic-menu-link block font-label uppercase text-stone-brand transition-opacity hover:opacity-100"
        >
          {t(`cinematic.menu.${item.id}`)}
        </a>
      </li>
    );
  }

  return (
    <li className="cinematic-menu-item border-b border-white/[0.08] py-5 last:border-b-0">
      <div className="flex items-start justify-between gap-6">
        <a
          href={item.href}
          onClick={onNavigate}
          className="cinematic-menu-link block flex-1 font-label uppercase text-stone-brand transition-opacity hover:opacity-100"
        >
          {t(`cinematic.menu.${item.id}`)}
        </a>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? 'Réduire' : 'Développer'}
          className="mt-1 flex size-8 shrink-0 items-center justify-center font-label text-lg leading-none text-stone-brand/75 transition-colors hover:text-stone-brand"
        >
          <span className="relative block h-3 w-3">
            <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-current" />
            <span
              className={clsx(
                'absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-current transition-transform duration-300',
                open && 'rotate-90 opacity-0',
              )}
            />
          </span>
        </button>
      </div>
      <div ref={subRef} className="h-0 overflow-hidden opacity-0">
        <ul className="flex flex-col gap-3 pt-5 pl-1">
          {item.children.map((child) => (
            <li key={child.id}>
              <a
                href={child.href}
                onClick={onNavigate}
                className="cinematic-menu-sublink block font-label uppercase text-stone-brand/80 transition-all hover:text-stone-brand hover:underline hover:underline-offset-[6px]"
              >
                {t(`cinematic.menu.${child.id}`)}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
}

function LogoLink({ lang, isLight, mounted, className }) {
  return (
    <Link
      to={defaultLangPath(lang)}
      className={clsx(
        'pointer-events-auto relative transition-opacity duration-300',
        mounted ? 'opacity-100' : 'opacity-0',
        className,
      )}
      aria-label="Mavericks"
    >
      <img
        src="/logos/mavericks-outline.svg"
        alt=""
        className={clsx(
          'h-7 w-auto opacity-90 md:h-9',
          isLight
            ? 'brightness-0 invert drop-shadow-[0_2px_16px_rgba(39,7,7,0.55)]'
            : 'brightness-0 drop-shadow-[0_2px_12px_rgba(241,235,235,0.45)]',
        )}
      />
    </Link>
  );
}

export default function CinematicChrome() {
  const { t } = useTranslation();
  const location = useLocation();
  const lang = getLangFromPath(location.pathname) ?? DEFAULT_LANGUAGE;
  const {
    menuOpen,
    toggleMenu,
    closeMenu,
    activePopup,
    closePopup,
    headerTheme,
    activeSection,
  } = useCinematic();

  const menuRef = useRef(null);
  const backdropRef = useRef(null);
  const itemsRef = useRef(null);
  const [mounted, setMounted] = useState(false);
  const [indicatorVisible, setIndicatorVisible] = useState(false);

  const handleNavigate = () => closeMenu();

  useEffect(() => {
    const tmr = window.setTimeout(() => setMounted(true), 600);
    return () => window.clearTimeout(tmr);
  }, []);

  useEffect(() => {
    setIndicatorVisible(activeSection >= 0 && !menuOpen && !activePopup);
  }, [activeSection, menuOpen, activePopup]);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') closeMenu();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [menuOpen, closeMenu]);

  useEffect(() => {
    document.body.classList.toggle('menu-open', menuOpen);
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.classList.remove('menu-open');
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  useEffect(() => {
    const menu = menuRef.current;
    const backdrop = backdropRef.current;
    const items = itemsRef.current?.querySelectorAll('.cinematic-menu-item');
    if (!menu || !backdrop) return;

    const isMobile = window.matchMedia('(max-width: 767px)').matches;

    if (menuOpen) {
      gsap.set(menu, { visibility: 'visible', pointerEvents: 'auto' });
      backdrop.classList.add('is-open');

      if (isMobile) {
        gsap.fromTo(backdrop, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: 'power3.out' });
        gsap.fromTo(
          menu,
          { opacity: 0, scale: 0.96, y: 18 },
          { opacity: 1, scale: 1, y: 0, duration: 0.55, ease: 'power3.out' },
        );
      } else {
        gsap.fromTo(backdrop, { opacity: 0 }, { opacity: 1, duration: 0.4 });
        gsap.fromTo(menu, { opacity: 0, x: -24 }, { opacity: 1, x: 0, duration: 0.55, ease: 'power3.out' });
      }

      if (items?.length) {
        gsap.fromTo(
          items,
          { opacity: 0, y: isMobile ? 14 : 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.48,
            stagger: 0.05,
            delay: isMobile ? 0.12 : 0.15,
            ease: 'power2.out',
          },
        );
      }
    } else {
      backdrop.classList.remove('is-open');

      if (isMobile) {
        gsap.to(menu, {
          opacity: 0,
          scale: 0.98,
          y: 10,
          duration: 0.38,
          ease: 'power2.in',
          onComplete: () => gsap.set(menu, { visibility: 'hidden', pointerEvents: 'none' }),
        });
        gsap.to(backdrop, { opacity: 0, duration: 0.38 });
      } else {
        gsap.to(menu, {
          opacity: 0,
          x: -16,
          duration: 0.35,
          onComplete: () => gsap.set(menu, { visibility: 'hidden', pointerEvents: 'none' }),
        });
        gsap.to(backdrop, { opacity: 0, duration: 0.35 });
      }
    }
  }, [menuOpen]);

  const isLight = headerTheme === 'light';

  const headerPillClass = clsx(
    'pointer-events-auto flex items-center overflow-hidden rounded-full border backdrop-blur-md transition-all duration-500',
    mounted ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0',
    menuOpen
      ? 'border-stone-brand/20 bg-dark-red/50'
      : isLight
        ? 'border-stone-brand/20 bg-dark-red/48'
        : 'border-dark-red/12 bg-stone-brand/88',
  );

  const controlTone = isLight ? 'text-stone-brand [text-shadow:0_1px_10px_rgba(39,7,7,0.45)]' : 'text-dark-red';

  return (
    <>
      <div
        ref={backdropRef}
        className={clsx(
          'cinematic-menu-backdrop fixed inset-0 z-50',
          menuOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0',
        )}
        onClick={closeMenu}
        aria-hidden="true"
      />

      {/* ── Mobile header (Amali-style floating controls) ── */}
      <nav
        className={clsx(
          'pointer-events-none fixed inset-x-0 top-0 z-[52] md:hidden',
          'px-4 pt-[max(0.75rem,env(safe-area-inset-top,0px))]',
        )}
        aria-label={t('chrome.menu')}
      >
        <div
          aria-hidden="true"
          className={clsx(
            'pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b to-transparent',
            isLight ? 'from-dark-red/50 via-dark-red/20' : 'from-stone-brand/70 via-stone-brand/30',
          )}
        />
        <div
          className={clsx(
            'relative flex items-center justify-between transition-opacity duration-300',
            menuOpen && 'pointer-events-none opacity-0',
          )}
        >
          <LogoLink lang={lang} isLight={isLight} mounted={mounted} />
          <div className={headerPillClass}>
            <a
              href="#contact"
              aria-label={t('chrome.enquire')}
              className="flex size-10 shrink-0 items-center justify-center bg-champagne text-dark-red transition-colors hover:bg-champagne-light"
            >
              <ContactIcon />
            </a>
            <button
              type="button"
              onClick={toggleMenu}
              aria-expanded={menuOpen}
              aria-label={t('chrome.menu')}
              className={clsx('flex size-10 items-center justify-center', controlTone)}
            >
              <MenuLinesIcon />
            </button>
          </div>
        </div>
      </nav>

      {/* ── Desktop header (unchanged layout) ── */}
      <nav
        className="pointer-events-none fixed inset-x-0 top-0 z-[52] hidden px-10 pt-7 md:block"
        aria-label={t('chrome.menu')}
      >
        <div
          aria-hidden="true"
          className={clsx(
            'pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b to-transparent',
            isLight
              ? 'from-dark-red/58 via-dark-red/28'
              : 'from-stone-brand/85 via-stone-brand/40',
          )}
        />
        <div className="relative grid grid-cols-[1fr_auto_1fr] items-center">
          <div className="flex justify-start">
            <div className={headerPillClass}>
              <button
                type="button"
                onClick={menuOpen ? closeMenu : toggleMenu}
                aria-expanded={menuOpen}
                aria-label={menuOpen ? t('nav.close') : t('chrome.menu')}
                className={clsx(
                  'flex items-center justify-center px-5 py-2.5 font-label text-[11px] uppercase tracking-[0.18em] transition-colors',
                  menuOpen ? 'min-w-[3.25rem]' : '',
                  controlTone,
                )}
              >
                {menuOpen ? (
                  <span className="text-lg leading-none" aria-hidden="true">
                    ×
                  </span>
                ) : (
                  t('chrome.menu')
                )}
              </button>
              <a
                href="#contact"
                onClick={menuOpen ? handleNavigate : undefined}
                className={clsx(
                  'group relative overflow-hidden rounded-full px-5 py-2.5 font-label text-[11px] uppercase tracking-[0.18em]',
                  'bg-champagne text-dark-red transition-colors duration-300 hover:bg-champagne-light',
                )}
              >
                <span className="relative z-10">{t('chrome.enquire')}</span>
              </a>
            </div>
          </div>

          <LogoLink lang={lang} isLight={isLight} mounted={mounted} className="justify-self-center" />

          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={activePopup ? closePopup : undefined}
              className={clsx(
                'pointer-events-auto flex items-center gap-2 rounded-full px-4 py-2 font-label text-[11px] uppercase tracking-[0.14em] transition-all duration-300',
                activePopup
                  ? 'translate-y-0 bg-stone-brand text-dark-red opacity-100'
                  : 'pointer-events-none translate-y-2 opacity-0',
              )}
            >
              {t('cinematic.close')}
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M1 12.8L12.8 1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                <path d="M1 1.4L12.8 13.2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
              </svg>
            </button>
            <div
              className={clsx(
                'pointer-events-auto transition-opacity duration-500',
                mounted ? 'opacity-100' : 'opacity-0',
              )}
            >
              <LanguageSwitcher variant="compact" tone={isLight ? 'onDark' : 'onLight'} />
            </div>
          </div>
        </div>
      </nav>

      <div
        ref={menuRef}
        className="cinematic-menu-panel invisible fixed z-[51] flex flex-col opacity-0"
        data-lenis-prevent
        role="dialog"
        aria-modal="true"
        aria-label={t('chrome.menu')}
      >
        {/* Mobile panel top controls — inside glass panel like Amali */}
        <div className="flex shrink-0 items-center justify-end gap-2 px-5 pb-2 pt-[max(1rem,env(safe-area-inset-top,0px))] md:hidden">
          <a
            href="#contact"
            onClick={handleNavigate}
            aria-label={t('chrome.enquire')}
            className="flex size-11 items-center justify-center rounded-full bg-champagne text-dark-red transition-colors hover:bg-champagne-light"
          >
            <ContactIcon />
          </a>
          <button
            type="button"
            onClick={closeMenu}
            aria-label={t('nav.close')}
            className="flex size-11 items-center justify-center rounded-full border border-white/15 text-stone-brand transition-colors hover:border-white/25"
          >
            <MenuLinesIcon />
          </button>
        </div>

        <div
          className="hidden shrink-0 border-b border-white/[0.1] px-8 pb-5 pt-24 md:block"
          aria-hidden="true"
        />

        <nav className="cinematic-menu-scroll min-h-0 flex-1 overflow-y-auto px-6 py-2 md:px-8 md:py-4">
          <ul ref={itemsRef} className="flex flex-col">
            {MENU_GROUPS.map((item) => (
              <MenuExpandableItem key={item.id} item={item} t={t} onNavigate={handleNavigate} />
            ))}
          </ul>
        </nav>

        <div className="shrink-0 border-t border-white/[0.1] px-6 py-6 md:px-8 md:py-8">
          <div className="mb-5 md:hidden">
            <LanguageSwitcher variant="compact" tone="onDark" />
          </div>
          <p className="font-label text-[11px] uppercase tracking-[0.28em] text-stone-brand/90">
            {t('cinematic.menu.brandMark')}
          </p>
          <p className="mt-2 font-body text-sm text-stone-brand/55">{t('cinematic.menu.tagline')}</p>
        </div>
      </div>

      <SectionIndicator visible={indicatorVisible} />
      <ContentPopup />
    </>
  );
}

function defaultLangPath(lang) {
  return `/${lang}`;
}
