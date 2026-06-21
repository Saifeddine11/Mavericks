/**
 * Footer — end credits
 *
 * Dark Red base with a controlled gradient transition from the section above.
 * No bright limestone band — transition stays within the brand dark palette.
 */

import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';

export default function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer id="contact" className="relative overflow-hidden bg-dark-red text-stone-brand">
      {/* Premium transition — transparent → dark red, no light band */}
      <div
        aria-hidden="true"
        className="pointer-events-none h-[12vh] min-h-[88px] w-full"
        style={{
          background:
            'linear-gradient(180deg, rgba(39, 7, 7, 0) 0%, rgba(39, 7, 7, 0.52) 44%, #270707 100%)',
        }}
      />

      <div>
        <div className="container-editorial pb-20 pt-14 md:pt-16">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-8">
            <div className="md:col-span-4">
              <p className="font-label text-[11px] uppercase tracking-[0.28em] text-champagne/85">
                Maison Mavericks
              </p>
              <p className="mt-4 max-w-sm font-body text-sm leading-relaxed text-stone-brand/90">
                {t('footer.tagline')}
              </p>
            </div>

            <div className="md:col-span-3">
              <p className="font-label text-[11px] uppercase tracking-[0.24em] text-champagne/80">
                Navigation
              </p>
              <ul className="mt-4 space-y-2 font-body text-sm text-stone-brand/90">
                <li>
                  <a href="#hero" className="transition-colors duration-400 ease-editorial hover:text-champagne">
                    {t('footer.nav.home')}
                  </a>
                </li>
                <li>
                  <a href="#architecture" className="transition-colors duration-400 ease-editorial hover:text-champagne">
                    {t('footer.nav.private')}
                  </a>
                </li>
                <li>
                  <a href="#concept" className="transition-colors duration-400 ease-editorial hover:text-champagne">
                    {t('footer.nav.offPlan')}
                  </a>
                </li>
                <li>
                  <a href="#architecture" className="transition-colors duration-400 ease-editorial hover:text-champagne">
                    {t('footer.nav.villasRiads')}
                  </a>
                </li>
                <li>
                  <a href="#concept" className="transition-colors duration-400 ease-editorial hover:text-champagne">
                    {t('footer.nav.invest')}
                  </a>
                </li>
                <li>
                  <a href="#concept" className="transition-colors duration-400 ease-editorial hover:text-champagne">
                    {t('footer.nav.mavericks')}
                  </a>
                </li>
              </ul>
            </div>

            <div className="md:col-span-2">
              <p className="font-label text-[11px] uppercase tracking-[0.24em] text-champagne/80">
                {t('footer.contact')}
              </p>
              <ul className="mt-4 space-y-2 font-body text-sm text-stone-brand/90">
                <li>Marrakech, Maroc</li>
                <li>
                  <a
                    href="mailto:contact@mavericks.ma"
                    className="transition-colors duration-400 ease-editorial hover:text-champagne"
                  >
                    contact@mavericks.ma
                  </a>
                </li>
                <li>
                  <a
                    href="tel:+212000000000"
                    className="transition-colors duration-400 ease-editorial hover:text-champagne"
                  >
                    +212 (0) 000 000 000
                  </a>
                </li>
              </ul>
            </div>

            <div className="md:col-span-2">
              <p className="font-label text-[11px] uppercase tracking-[0.24em] text-champagne/80">
                {t('footer.follow')}
              </p>
              <ul className="mt-4 space-y-2 font-body text-sm text-stone-brand/90">
                <li>
                  <a href="#" className="transition-colors duration-400 ease-editorial hover:text-champagne">
                    Instagram
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-colors duration-400 ease-editorial hover:text-champagne">
                    LinkedIn
                  </a>
                </li>
              </ul>
            </div>

            <div className="md:col-span-2">
              <p className="font-label text-[11px] uppercase tracking-[0.24em] text-champagne/80">
                {t('language.label')}
              </p>
              <div className="mt-4">
                <LanguageSwitcher variant="compact" tone="onDark" />
              </div>
            </div>
          </div>
        </div>

        <div
          aria-hidden="true"
          className="pointer-events-none relative z-0 select-none px-4 pb-6 text-center"
        >
          <span
            className="block font-label uppercase text-champagne"
            style={{
              fontSize: 'clamp(3.5rem, 20vw, 18rem)',
              letterSpacing: '0.12em',
              lineHeight: 0.85,
              opacity: 0.16,
            }}
          >
            MAVERICKS
          </span>
        </div>

        <div className="container-editorial relative z-10 border-t border-champagne/15">
          <div className="flex flex-col items-start justify-between gap-3 py-5 font-label text-[11px] uppercase tracking-[0.18em] text-stone-brand/75 md:flex-row md:items-center">
            <p>{t('footer.rights', { year })}</p>
            <a
              href="#"
              className="transition-colors duration-400 ease-editorial hover:text-champagne"
            >
              {t('footer.legal')}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
