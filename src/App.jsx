/**
 * App
 *
 * Layout shell with URL-based language routing.
 *
 *   /         → redirected to /fr  (default language)
 *   /:lang    → cinematic homepage in `:lang`
 *   /:lang/*  → reserved for future pages
 *   anything else → redirected to /fr
 *
 * Chrome strategy:
 *   - On the homepage (`/`, `/:lang`), we render CinematicChrome — floating
 *     header, glass menu, section indicator, and content popups.
 *   - On any future interior page (`/:lang/something`), we render the
 *     classic <Header>. Header is built and kept for that purpose.
 *
 * The Lenis smooth scroll and i18n-sync hooks mount once at the top of
 * the tree and are independent of which chrome is shown.
 */

import { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

import Header from '@/components/layout/Header';
import CinematicChrome from '@/components/cinematic/CinematicChrome';
import { CinematicProvider } from '@/components/cinematic/context/CinematicContext';
import Footer from '@/components/layout/Footer';
import PageTransition from '@/components/layout/PageTransition';

import Home from '@/routes/Home';

import useLenis from '@/hooks/useLenis';
import useSyncLanguageWithUrl from '@/hooks/useSyncLanguageWithUrl';
import { getLangFromPath, defaultLangPath } from '@/i18n/routing';
import { SUPPORTED_LANGUAGES } from '@/i18n';

/**
 * Determine whether the current path is the homepage (one of `/`, `/fr`,
 * `/en`, `/it`, `/nl`). Trailing slash tolerated. Used to decide which
 * chrome to render.
 */
function isHomePath(pathname) {
  const parts = pathname.split('/').filter(Boolean);
  if (parts.length === 0) return true;
  if (parts.length === 1 && SUPPORTED_LANGUAGES.includes(parts[0])) return true;
  return false;
}

/**
 * Guard that ensures the URL's first segment is a supported language.
 */
function LangGuard({ children }) {
  const location = useLocation();
  const lang = getLangFromPath(location.pathname);
  if (!lang) {
    const rest = location.pathname.replace(/^\/+/, '');
    const target = rest ? `${defaultLangPath()}/${rest}` : defaultLangPath();
    return <Navigate to={`${target}${location.search}${location.hash}`} replace />;
  }
  return children;
}

export default function App() {
  useLenis();
  useSyncLanguageWithUrl();

  const location = useLocation();
  const onHome = isHomePath(location.pathname);

  useEffect(() => {
    document.body.classList.toggle('app-light', !onHome);
    return () => document.body.classList.remove('app-light');
  }, [onHome]);

  const content = (
    <>
      {onHome ? <CinematicChrome /> : <Header />}

      <main className={clsx('flex-1', onHome ? 'bg-dark-red' : 'bg-stone-brand')}>
        <AnimatePresence mode="wait" initial={false}>
          <PageTransition key={location.pathname}>
            <Routes location={location}>
              <Route path="/" element={<Navigate to={defaultLangPath()} replace />} />
              <Route
                path="/:lang/*"
                element={
                  <LangGuard>
                    <Routes>
                      <Route index element={<Home />} />
                      <Route path="*" element={<Home />} />
                    </Routes>
                  </LangGuard>
                }
              />
              <Route path="*" element={<Navigate to={defaultLangPath()} replace />} />
            </Routes>
          </PageTransition>
        </AnimatePresence>
      </main>

      <Footer />
    </>
  );

  return (
    <div
      className={clsx(
        'flex min-h-[100svh] flex-col overflow-x-clip',
        onHome ? 'bg-dark-red text-stone-brand' : 'bg-stone-brand text-dark-red',
      )}
    >
      {onHome ? <CinematicProvider>{content}</CinematicProvider> : content}
    </div>
  );
}
