import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { gsap, useGSAP } from '@/lib/gsap';
import useSectionTrigger from '../hooks/useSectionTrigger';
import { cinematicMatchMedia } from '../hooks/useCinematicScroll';
import {
  bodyCopy,
  eyebrowDark,
  glassCard,
  headingEditorial,
} from '../shared/cinematicClasses';
import { CINEMATIC_IMAGES, CINEMATIC_IMAGE_SIZES, CINEMATIC_OBJECT_POSITION } from './images';

const LOCATION_KEYS = ['palmeraie', 'hivernage', 'amelkis'];
const TEXT_KEYS = ['horizon', 'distance', 'arrival'];

export default function IslandSection() {
  const { t } = useTranslation();
  const sectionRef = useSectionTrigger({ sectionIndex: 2, headerTheme: 'light' });
  const trackRef = useRef(null);
  const overlayRef = useRef(null);
  const cardsRef = useRef(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const track = trackRef.current;
      if (!section || !track) return;

      return cinematicMatchMedia(({ isReduce, isDesktop }) => {
        if (!isDesktop || isReduce) return undefined;

        const panels = track.querySelector('[data-panels]');
        const texts = track.querySelectorAll('[data-text]');
        if (!panels) return undefined;

        gsap.set(texts, { opacity: 0, x: 32 });
        gsap.set(overlayRef.current, { opacity: 0, y: 24 });
        gsap.set(cardsRef.current?.children, { opacity: 0, y: 20 });

        const scrollWidth = () => panels.scrollWidth - window.innerWidth;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: () => `+=${scrollWidth() + window.innerHeight * 0.65}`,
            pin: true,
            scrub: 0.55,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        tl.to(panels, { x: () => -scrollWidth(), ease: 'none' }, 0);

        texts.forEach((text, i) => {
          const pos = (i / Math.max(texts.length, 1)) * 0.62;
          tl.to(text, { opacity: 1, x: 0, ease: 'none', duration: 0.07 }, pos);
          if (i > 0) tl.to(texts[i - 1], { opacity: 0.35, ease: 'none', duration: 0.05 }, pos);
        });

        tl.to(overlayRef.current, { opacity: 1, y: 0, ease: 'none', duration: 0.1 }, 0.74);
        tl.to(
          cardsRef.current?.children,
          { opacity: 1, y: 0, stagger: 0.03, ease: 'none', duration: 0.08 },
          0.8,
        );

        return () => tl.scrollTrigger?.kill();
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      id="island"
      ref={sectionRef}
      data-shot
      data-section-indicator-trigger
      className="relative bg-dark-red text-stone-brand"
      aria-label={t('cinematic.island.aria')}
    >
      <div ref={trackRef} className="hidden h-screen w-full overflow-hidden lg:block">
        <div data-panels className="flex h-full w-max will-change-transform">
          <div className="relative h-full w-screen shrink-0">
            <img
              src={CINEMATIC_IMAGES.islandPanorama}
              alt={t('cinematic.island.imageAlt')}
              className={`h-full w-[130vw] max-w-none ${CINEMATIC_OBJECT_POSITION.islandPanorama}`}
              sizes={CINEMATIC_IMAGE_SIZES.fullBleed}
              loading="lazy"
              decoding="async"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-dark-red/75 via-dark-red/15 to-dark-red/35" aria-hidden="true" />
          </div>

          {TEXT_KEYS.map((key) => (
            <div
              key={key}
              data-text
              className="flex h-full w-[42vw] shrink-0 flex-col justify-center px-10 xl:px-14"
            >
              <p className={`mb-2 ${eyebrowDark}`}>{t(`cinematic.island.texts.${key}.eyebrow`)}</p>
              <h2 className={`max-w-md text-[clamp(1.5rem,2.6vw,2.5rem)] ${headingEditorial}`}>
                {t(`cinematic.island.texts.${key}.title`)}
              </h2>
              <p className={`mt-3 max-w-sm text-stone-brand/80 ${bodyCopy}`}>
                {t(`cinematic.island.texts.${key}.body`)}
              </p>
            </div>
          ))}

          <div className="flex h-full w-screen shrink-0 flex-col justify-center px-10 xl:px-14">
            <div ref={overlayRef} className="max-w-lg">
              <p className={`mb-3 ${eyebrowDark}`}>{t('cinematic.island.overlay.eyebrow')}</p>
              <h2 className={`text-[clamp(1.75rem,3vw,2.75rem)] ${headingEditorial}`}>
                {t('cinematic.island.overlay.title')}
              </h2>
              <p className={`mt-3 text-stone-brand/80 ${bodyCopy}`}>
                {t('cinematic.island.overlay.body')}
              </p>
            </div>

            <div ref={cardsRef} className="mt-8 grid gap-3 md:grid-cols-3">
              {LOCATION_KEYS.map((key) => (
                <article key={key} className={glassCard}>
                  <h3 className="font-label text-xs uppercase tracking-[0.16em] text-stone-brand">
                    {t(`cinematic.island.locations.${key}.name`)}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-stone-brand/70">
                    {t(`cinematic.island.locations.${key}.description`)}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:hidden">
        <div className="relative aspect-[5/4] w-full overflow-hidden">
          <img
            src={CINEMATIC_IMAGES.islandPanorama}
            alt={t('cinematic.island.imageAlt')}
            className={`h-full w-full ${CINEMATIC_OBJECT_POSITION.islandPanorama}`}
            sizes={CINEMATIC_IMAGE_SIZES.fullBleed}
            loading="lazy"
            decoding="async"
          />
          <div className="absolute inset-0 bg-dark-red/35" aria-hidden="true" />
        </div>

        <div className="space-y-10 px-6 py-14">
          {TEXT_KEYS.map((key) => (
            <article key={key}>
              <p className={`mb-2 ${eyebrowDark}`}>{t(`cinematic.island.texts.${key}.eyebrow`)}</p>
              <h2 className={`text-2xl ${headingEditorial}`}>
                {t(`cinematic.island.texts.${key}.title`)}
              </h2>
              <p className={`mt-2 text-stone-brand/80 ${bodyCopy}`}>
                {t(`cinematic.island.texts.${key}.body`)}
              </p>
            </article>
          ))}

          <article>
            <p className={`mb-2 ${eyebrowDark}`}>{t('cinematic.island.overlay.eyebrow')}</p>
            <h2 className={`text-2xl ${headingEditorial}`}>{t('cinematic.island.overlay.title')}</h2>
            <p className={`mt-2 text-stone-brand/80 ${bodyCopy}`}>
              {t('cinematic.island.overlay.body')}
            </p>
          </article>

          <div className="grid gap-3">
            {LOCATION_KEYS.map((key) => (
              <article key={key} className={glassCard}>
                <h3 className="font-label text-xs uppercase tracking-[0.16em]">
                  {t(`cinematic.island.locations.${key}.name`)}
                </h3>
                <p className="mt-2 text-xs text-stone-brand/70">
                  {t(`cinematic.island.locations.${key}.description`)}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
