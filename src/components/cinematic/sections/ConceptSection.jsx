import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { gsap, useGSAP } from '@/lib/gsap';
import { useCinematic } from '../context/CinematicContext';
import useSectionTrigger from '../hooks/useSectionTrigger';
import {
  cinematicMatchMedia,
  refreshScrollTriggersWhenReady,
  SCROLL_SNAP,
  setStaticVisible,
  useScrollTriggerRefresh,
} from '../hooks/useCinematicScroll';
import GlassPopupButton from '../shared/GlassPopupButton';
import {
  bodyCopy,
  eyebrowDark,
  headingEditorial,
  overlayBottom,
} from '../shared/cinematicClasses';
import { CINEMATIC_IMAGES, CINEMATIC_IMAGE_SIZES, CINEMATIC_OBJECT_POSITION } from './images';

const POPUP_KEYS = ['offPlan', 'invest', 'method'];

export default function ConceptSection() {
  const { t } = useTranslation();
  const { openPopup } = useCinematic();
  const sectionRef = useSectionTrigger({ sectionIndex: 1, headerTheme: 'light' });
  const innerRef = useRef(null);
  const imageWrapRef = useRef(null);
  const copyRef = useRef(null);

  useScrollTriggerRefresh(sectionRef);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const inner = innerRef.current;
      if (!section || !inner) return;

      return cinematicMatchMedia(({ isReduce, isCompact, isMobile }) => {
        if (isReduce) {
          setStaticVisible([copyRef.current, imageWrapRef.current]);
          return undefined;
        }

        gsap.set(imageWrapRef.current, { scale: 1 });
        gsap.set(copyRef.current, { opacity: 0, y: 24 });

        const end = isMobile ? '+=100%' : isCompact ? '+=115%' : '+=220%';
        const scrub = isMobile ? 0.38 : isCompact ? 0.45 : 0.55;
        const snap = isCompact ? false : SCROLL_SNAP;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end,
            pin: inner,
            scrub,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            snap,
          },
        });

        tl.addLabel('intro', 0);
        tl.to(imageWrapRef.current, { scale: 1.04, ease: 'none', duration: 0.28 }, 'intro');

        tl.addLabel('reveal', isCompact ? 0.38 : 0.42);
        tl.to(copyRef.current, { opacity: 1, y: 0, ease: 'none', duration: 0.24 }, 'reveal');

        tl.addLabel('final', 1);
        tl.to(copyRef.current, { opacity: 1, y: 0, ease: 'none', duration: 0.01 }, 'final');
        tl.to(imageWrapRef.current, { scale: isCompact ? 1.05 : 1.06, ease: 'none', duration: 0.01 }, 'final');

        refreshScrollTriggersWhenReady(section);
        return () => tl.scrollTrigger?.kill();
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      id="concept"
      ref={sectionRef}
      data-shot
      className="relative bg-dark-red text-stone-brand"
      aria-label={t('cinematic.concept.aria')}
    >
      <div ref={innerRef} className="relative h-[100svh] w-full overflow-hidden lg:h-screen">
        <div
          ref={imageWrapRef}
          className="absolute inset-0 origin-center will-change-transform"
        >
          <img
            src={CINEMATIC_IMAGES.concept}
            alt={t('cinematic.concept.imageAlt')}
            className={`cinematic-img h-full w-full object-cover ${CINEMATIC_OBJECT_POSITION.concept}`}
            sizes={CINEMATIC_IMAGE_SIZES.fullBleed}
            loading="lazy"
            decoding="async"
          />
        </div>
        <div className={overlayBottom} aria-hidden="true" />

        <div
          ref={copyRef}
          className="relative z-10 flex h-full flex-col items-center justify-center px-6 py-20 text-center md:px-12 md:py-24"
        >
          <p className={`mb-3 text-champagne/90 ${eyebrowDark}`}>{t('cinematic.concept.eyebrow')}</p>
          <h2
            className={`mb-5 max-w-[min(820px,92vw)] text-[clamp(2.3rem,10vw,4rem)] font-normal leading-[1] text-stone-brand md:text-[clamp(3.2rem,5.5vw,6.8rem)] md:leading-[0.96] ${headingEditorial}`}
            style={{ textShadow: '0 2px 18px rgba(39,7,7,0.45)' }}
          >
            {t('cinematic.concept.title')}
          </h2>
          <p className={`mb-10 max-w-[min(560px,88vw)] text-stone-brand/92 ${bodyCopy}`}>
            {t('cinematic.concept.body')}
          </p>

          <div className="flex flex-col items-center gap-3 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-4">
            {POPUP_KEYS.map((key, i) => (
              <GlassPopupButton
                key={key}
                label={t(`cinematic.concept.buttons.${key}`)}
                onClick={() => openPopup(key)}
                reverse={i % 2 === 1}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
