import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { gsap, useGSAP } from '@/lib/gsap';
import useSectionTrigger from '../hooks/useSectionTrigger';
import { cinematicMatchMedia, setStaticVisible } from '../hooks/useCinematicScroll';
import {
  bodyCopy,
  eyebrowDark,
  glassCard,
  headingEditorial,
  overlayBottom,
} from '../shared/cinematicClasses';
import { CINEMATIC_IMAGES, CINEMATIC_IMAGE_SIZES, CINEMATIC_OBJECT_POSITION } from './images';

const BLOCK_KEYS = ['arrival', 'garden', 'silence'];
const HOTSPOT_KEYS = ['pool', 'spa', 'terrace'];

export default function LifestyleSection() {
  const { t } = useTranslation();
  const sectionRef = useSectionTrigger({ sectionIndex: 1, headerTheme: 'light' });
  const innerRef = useRef(null);
  const blocksRef = useRef(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const inner = innerRef.current;
      const blocks = blocksRef.current?.querySelectorAll('[data-block]');
      if (!section || !inner || !blocks?.length) return;

      return cinematicMatchMedia(({ isReduce, isMobile }) => {
        setStaticVisible(blocks);

        if (isReduce || isMobile) return undefined;

        gsap.set(blocks, { opacity: 0, y: 32 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: '+=180%',
            pin: inner,
            scrub: 0.55,
            anticipatePin: 1,
          },
        });

        blocks.forEach((block, i) => {
          tl.to(block, { opacity: 1, y: 0, ease: 'none', duration: 0.18 }, i * 0.2);
          if (i < blocks.length - 1) {
            tl.to(block, { opacity: 0.4, y: -8, ease: 'none', duration: 0.12 }, i * 0.2 + 0.16);
          }
        });

        return () => tl.scrollTrigger?.kill();
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      id="lifestyle"
      ref={sectionRef}
      data-shot
      data-section-indicator-trigger
      className="relative bg-dark-red text-stone-brand"
      aria-label={t('cinematic.lifestyle.aria')}
    >
      <div ref={innerRef} className="relative w-full overflow-hidden md:h-screen">
        <img
          src={CINEMATIC_IMAGES.lifestyle}
          alt={t('cinematic.lifestyle.imageAlt')}
          className={`absolute inset-0 h-full min-h-[100dvh] w-full md:min-h-0 ${CINEMATIC_OBJECT_POSITION.lifestyle}`}
          sizes={CINEMATIC_IMAGE_SIZES.fullBleed}
          loading="lazy"
          decoding="async"
        />
        <div className={overlayBottom} aria-hidden="true" />

        <div ref={blocksRef} className="relative z-10 px-6 py-16 md:flex md:h-full md:items-center md:px-12 md:py-0">
          <div className="grid w-full gap-6 lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-12">
            <div className="space-y-4 md:space-y-5">
              {BLOCK_KEYS.map((key) => (
                <article key={key} data-block className={glassCard}>
                  <p className={`mb-2 ${eyebrowDark}`}>
                    {t(`cinematic.lifestyle.blocks.${key}.eyebrow`)}
                  </p>
                  <h2 className={`text-[clamp(1.25rem,2.5vw,1.875rem)] ${headingEditorial}`}>
                    {t(`cinematic.lifestyle.blocks.${key}.title`)}
                  </h2>
                  <p className={`mt-2 text-sm text-stone-brand/80 md:text-[0.9375rem] ${bodyCopy}`}>
                    {t(`cinematic.lifestyle.blocks.${key}.body`)}
                  </p>
                </article>
              ))}
            </div>

            <div className="hidden lg:block">
              <div className="relative aspect-[4/3] w-full">
                {HOTSPOT_KEYS.map((key, i) => (
                  <div
                    key={key}
                    className={clsx(
                      'absolute max-w-[11rem] rounded-xl border border-stone-brand/15 bg-dark-red/40 p-4',
                      i === 0 && 'left-[6%] top-[8%]',
                      i === 1 && 'right-[4%] top-[38%]',
                      i === 2 && 'bottom-[6%] left-[22%]',
                    )}
                  >
                    <p className={eyebrowDark}>{t(`cinematic.lifestyle.hotspots.${key}.label`)}</p>
                    <p className={`mt-1 text-lg ${headingEditorial}`}>
                      {t(`cinematic.lifestyle.hotspots.${key}.title`)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Seamless handoff into footer — no light gap */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-28 bg-gradient-to-b from-transparent to-dark-red"
        aria-hidden="true"
      />
    </section>
  );
}
