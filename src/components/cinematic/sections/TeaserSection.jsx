import { useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { gsap, useGSAP } from '@/lib/gsap';
import { getLangFromPath } from '@/i18n/routing';
import { DEFAULT_LANGUAGE } from '@/i18n';
import { cinematicMatchMedia } from '../hooks/useCinematicScroll';
import {
  bodyCopy,
  eyebrowDark,
  headingEditorial,
} from '../shared/cinematicClasses';
import { CINEMATIC_IMAGES, CINEMATIC_IMAGE_SIZES, CINEMATIC_OBJECT_POSITION } from './images';

const TEASER_KEYS = ['collection', 'contact'];

function TeaserCard({ teaserKey, lang, t }) {
  const isContact = teaserKey === 'contact';

  const inner = (
    <>
      <div className="relative aspect-[4/5] overflow-hidden">
        <img
          src={teaserKey === 'collection' ? CINEMATIC_IMAGES.teaserOne : CINEMATIC_IMAGES.teaserTwo}
          alt={t(`cinematic.teasers.cards.${teaserKey}.imageAlt`)}
          className={`h-full w-full transition-transform duration-[1s] ease-editorial group-hover:scale-[1.03] ${CINEMATIC_OBJECT_POSITION.teaser}`}
          sizes={CINEMATIC_IMAGE_SIZES.teaserCard}
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-red/90 via-dark-red/25 to-transparent" />
      </div>

      <div className="absolute inset-x-0 bottom-0 p-7 md:p-9">
        <p className={`mb-2 ${eyebrowDark}`}>{t(`cinematic.teasers.cards.${teaserKey}.eyebrow`)}</p>
        <h3 className={`text-[clamp(1.5rem,2.5vw,2rem)] ${headingEditorial}`}>
          {t(`cinematic.teasers.cards.${teaserKey}.title`)}
        </h3>
        <p className={`mt-2 max-w-sm text-sm text-stone-brand/80 ${bodyCopy}`}>
          {t(`cinematic.teasers.cards.${teaserKey}.body`)}
        </p>
        <span className="mt-5 inline-flex items-center gap-2 font-label text-[11px] uppercase tracking-[0.18em] text-stone-brand/85 transition-transform duration-500 group-hover:translate-x-1">
          {t(`cinematic.teasers.cards.${teaserKey}.cta`)}
          <span aria-hidden="true">→</span>
        </span>
      </div>
    </>
  );

  const className = 'group relative block overflow-hidden rounded-2xl';

  if (isContact) {
    return (
      <Link to={`/${lang}/contact`} className={className}>
        {inner}
      </Link>
    );
  }

  return (
    <a href="#interiors" className={className}>
      {inner}
    </a>
  );
}

export default function TeaserSection() {
  const { t } = useTranslation();
  const location = useLocation();
  const lang = getLangFromPath(location.pathname) ?? DEFAULT_LANGUAGE;
  const sectionRef = useRef(null);
  const brandRef = useRef(null);

  useGSAP(
    () => {
      return cinematicMatchMedia(({ isReduce }) => {
        if (isReduce) return undefined;

        gsap.fromTo(
          brandRef.current,
          { x: '-4%' },
          {
            x: '4%',
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.8,
            },
          },
        );
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      id="teasers"
      ref={sectionRef}
      data-shot
      className="relative overflow-hidden bg-dark-red pb-6 pt-20 md:pt-24"
      aria-label={t('cinematic.teasers.aria')}
    >
      <p
        ref={brandRef}
        className="pointer-events-none absolute left-1/2 top-[42%] z-0 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap font-label text-[clamp(3rem,14vw,10rem)] uppercase tracking-[0.18em] text-stone-brand/[0.035]"
        aria-hidden="true"
      >
        {t('cinematic.teasers.brandWord')}
      </p>

      <div className="container-editorial relative z-10">
        <div className="mb-10 max-w-lg">
          <p className={`mb-2 ${eyebrowDark}`}>{t('cinematic.teasers.eyebrow')}</p>
          <h2 className={`text-[clamp(1.75rem,3.5vw,2.75rem)] ${headingEditorial}`}>
            {t('cinematic.teasers.title')}
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-2 md:gap-7">
          {TEASER_KEYS.map((key) => (
            <TeaserCard key={key} teaserKey={key} lang={lang} t={t} />
          ))}
        </div>
      </div>

      <div id="contact" className="h-px" aria-hidden="true" />
    </section>
  );
}
