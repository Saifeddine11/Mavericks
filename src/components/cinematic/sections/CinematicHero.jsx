import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { gsap, useGSAP } from '@/lib/gsap';
import { useCinematic } from '../context/CinematicContext';
import {
  cinematicMatchMedia,
  refreshScrollTriggersWhenReady,
  setStaticVisible,
  useScrollTriggerRefresh,
} from '../hooks/useCinematicScroll';
import {
  bodyCopy,
  eyebrowDark,
  headingEditorial,
  overlayTop,
} from '../shared/cinematicClasses';
import { CINEMATIC_IMAGES, CINEMATIC_IMAGE_SIZES, CINEMATIC_OBJECT_POSITION } from './images';

export default function CinematicHero() {
  const { t } = useTranslation();
  const { setActiveSection, setHeaderTheme } = useCinematic();
  const sectionRef = useRef(null);
  const imageRef = useRef(null);
  const veilRef = useRef(null);
  const headlineOneRef = useRef(null);
  const headlineTwoRef = useRef(null);
  const scrollCueRef = useRef(null);

  useScrollTriggerRefresh(sectionRef);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      return cinematicMatchMedia(({ isReduce, isCompact }) => {
        if (isReduce) {
          setStaticVisible(
            [headlineOneRef.current, headlineTwoRef.current, scrollCueRef.current, imageRef.current],
            { opacity: 1, y: 0 },
          );
          gsap.set(veilRef.current, { opacity: 0 });
          return undefined;
        }

        gsap.set(headlineOneRef.current, { opacity: 0, y: 20 });
        gsap.set(headlineTwoRef.current, { opacity: 0, y: 24 });
        gsap.set(scrollCueRef.current, { opacity: 0, y: 10 });
        gsap.set(veilRef.current, { opacity: 1 });

        const intro = gsap.timeline({ delay: 0.35 });
        intro.to(headlineOneRef.current, { opacity: 1, y: 0, duration: 1, ease: 'power3.out' });
        intro.to(scrollCueRef.current, { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }, '-=0.35');

        const parallaxY = isCompact ? '-8%' : '-16%';
        const scrollEnd = isCompact ? '+=85%' : 'bottom top';

        const scrollTl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: scrollEnd,
            scrub: isCompact ? 0.45 : 0.6,
            invalidateOnRefresh: true,
            onEnter: () => {
              setActiveSection(-1);
              setHeaderTheme('light');
            },
            onEnterBack: () => {
              setActiveSection(-1);
              setHeaderTheme('light');
            },
          },
        });

        scrollTl.to(imageRef.current, { y: parallaxY, ease: 'none' }, 0);
        scrollTl.to(veilRef.current, { opacity: 0, ease: 'none' }, 0);
        scrollTl.to(headlineOneRef.current, { opacity: 0, y: -16, ease: 'none' }, 0.12);
        scrollTl.to(headlineTwoRef.current, { opacity: 1, y: 0, ease: 'none' }, 0.28);
        scrollTl.to(scrollCueRef.current, { opacity: 0, ease: 'none' }, 0.08);

        refreshScrollTriggersWhenReady(section);
        return () => {
          intro.kill();
          scrollTl.scrollTrigger?.kill();
        };
      });
    },
    { scope: sectionRef },
  );

  const scrollToNext = () => {
    document.querySelector('#architecture')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="hero"
      ref={sectionRef}
      data-shot
      className="relative h-[145svh] bg-dark-red md:h-[190vh]"
      aria-label={t('cinematic.hero.aria')}
    >
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <img
            ref={imageRef}
            src={CINEMATIC_IMAGES.hero}
            alt={t('cinematic.hero.imageAlt')}
            className={`cinematic-img h-[118%] w-full max-w-[480px] object-cover will-change-transform md:max-w-[600px] ${CINEMATIC_OBJECT_POSITION.hero}`}
            sizes={CINEMATIC_IMAGE_SIZES.heroPortrait}
            decoding="async"
            fetchPriority="high"
          />
        </div>

        <div ref={veilRef} className={overlayTop} aria-hidden="true" />

        <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 pb-16 pt-24 text-center text-stone-brand md:px-10">
          <h1
            ref={headlineOneRef}
            className="max-w-[11ch] font-label text-[clamp(1.75rem,4.8vw,3.75rem)] uppercase leading-[1.05] tracking-[0.14em]"
          >
            {t('cinematic.hero.headlineOne')}
          </h1>
          <p
            ref={headlineTwoRef}
            className={`absolute max-w-[15ch] text-[clamp(1.5rem,3.8vw,2.75rem)] italic text-stone-brand ${headingEditorial}`}
          >
            {t('cinematic.hero.headlineTwo')}
          </p>
        </div>

        <button
          ref={scrollCueRef}
          type="button"
          onClick={scrollToNext}
          className="absolute bottom-8 left-1/2 z-10 flex min-h-[44px] -translate-x-1/2 flex-col items-center justify-center gap-3 text-stone-brand/75 transition-colors hover:text-stone-brand md:bottom-10"
          aria-label={t('chrome.scrollHint')}
        >
          <span className={eyebrowDark}>{t('chrome.scrollHint')}</span>
          <span
            className="block h-9 w-px origin-bottom bg-stone-brand/60 motion-safe:animate-scroll-line"
            aria-hidden="true"
          />
        </button>
      </div>
    </section>
  );
}
