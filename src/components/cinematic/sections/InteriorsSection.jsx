import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { gsap, useGSAP } from '@/lib/gsap';
import useSectionTrigger from '../hooks/useSectionTrigger';
import { cinematicMatchMedia, setStaticVisible } from '../hooks/useCinematicScroll';
import {
  bodyCopy,
  eyebrowLight,
  glassCardLight,
  headingEditorial,
} from '../shared/cinematicClasses';
import { CINEMATIC_IMAGES, CINEMATIC_IMAGE_SIZES, CINEMATIC_OBJECT_POSITION } from './images';

const OPTIONS = [
  {
    id: 'riad',
    main: CINEMATIC_IMAGES.interiorMainA,
    sides: [CINEMATIC_IMAGES.interiorSideA1, CINEMATIC_IMAGES.interiorSideA2],
  },
  {
    id: 'villa',
    main: CINEMATIC_IMAGES.interiorMainB,
    sides: [CINEMATIC_IMAGES.interiorSideB1, CINEMATIC_IMAGES.interiorSideB2],
  },
];

export default function InteriorsSection() {
  const { t } = useTranslation();
  const sectionRef = useSectionTrigger({ sectionIndex: 3, headerTheme: 'dark' });
  const innerRef = useRef(null);
  const mainRef = useRef(null);
  const sideRefs = useRef([]);
  const cardRef = useRef(null);
  const [active, setActive] = useState('riad');
  const imageSetRef = useRef(null);

  const activeOption = OPTIONS.find((o) => o.id === active) ?? OPTIONS[0];
  const activeIndex = OPTIONS.findIndex((o) => o.id === active);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      return cinematicMatchMedia(({ isReduce, isMobile }) => {
        setStaticVisible([mainRef.current, ...sideRefs.current, cardRef.current], {
          scale: 1,
        });

        if (isReduce || isMobile) return undefined;

        gsap.set(mainRef.current, { scale: 1.12, opacity: 0 });
        gsap.set(sideRefs.current, { opacity: 0, y: 16 });
        gsap.set(cardRef.current, { opacity: 0, y: 20 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top 65%',
            end: 'bottom 35%',
            scrub: 0.45,
          },
        });

        tl.to(mainRef.current, { scale: 1, opacity: 1, ease: 'none' }, 0);
        tl.to(sideRefs.current, { opacity: 1, y: 0, stagger: 0.04, ease: 'none' }, 0.22);
        tl.to(cardRef.current, { opacity: 1, y: 0, ease: 'none' }, 0.35);

        return () => tl.scrollTrigger?.kill();
      });
    },
    { scope: sectionRef },
  );

  useGSAP(
    () => {
      if (!imageSetRef.current) return;
      gsap.fromTo(imageSetRef.current, { opacity: 0.85 }, { opacity: 1, duration: 0.45, ease: 'power2.out' });
    },
    { dependencies: [active], scope: imageSetRef },
  );

  return (
    <section
      id="interiors"
      ref={sectionRef}
      data-shot
      data-section-indicator-trigger
      className="relative bg-grey-orange py-20 text-dark-red md:py-28"
      aria-label={t('cinematic.interiors.aria')}
    >
      <div ref={innerRef} className="container-editorial">
        <div className="mb-10 flex flex-col gap-5 md:mb-12 md:flex-row md:items-end md:justify-between">
          <div>
            <p className={`mb-2 ${eyebrowLight}`}>{t('cinematic.interiors.eyebrow')}</p>
            <h2 className={`max-w-lg text-[clamp(1.75rem,3.5vw,2.75rem)] ${headingEditorial}`}>
              {t('cinematic.interiors.title')}
            </h2>
          </div>

          <div className="relative inline-flex rounded-full border border-dark-red/10 bg-stone-brand/70 p-1">
            <span
              className="absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-full bg-dark-red transition-transform duration-500 ease-editorial"
              style={{ transform: `translateX(${activeIndex * 100}%)` }}
              aria-hidden="true"
            />
            {OPTIONS.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setActive(option.id)}
                className={clsx(
                  'relative z-10 rounded-full px-5 py-2.5 font-label text-[11px] uppercase tracking-[0.16em] transition-colors',
                  active === option.id ? 'text-stone-brand' : 'text-dark-red/65 hover:text-dark-red',
                )}
              >
                {t(`cinematic.interiors.options.${option.id}`)}
              </button>
            ))}
          </div>
        </div>

        <div className="relative grid gap-8 lg:grid-cols-12 lg:items-center lg:gap-6">
          <div
            ref={(el) => {
              sideRefs.current[0] = el;
            }}
            className="hidden overflow-hidden rounded-2xl lg:col-span-2 lg:block"
          >
            <img
              src={activeOption.sides[0]}
              alt=""
              className={`aspect-square w-full ${CINEMATIC_OBJECT_POSITION.collageMain}`}
              sizes={CINEMATIC_IMAGE_SIZES.collageSide}
              loading="lazy"
              decoding="async"
            />
          </div>

          <div className="relative lg:col-span-8">
            <div ref={imageSetRef} className="overflow-hidden rounded-2xl shadow-editorial">
              <img
                ref={mainRef}
                src={activeOption.main}
                alt={t(`cinematic.interiors.imageAlt.${active}`)}
                className={`aspect-[4/5] w-full will-change-transform md:aspect-[3/4] ${CINEMATIC_OBJECT_POSITION.collageMain}`}
                sizes={CINEMATIC_IMAGE_SIZES.collageMain}
                loading="lazy"
                decoding="async"
              />
            </div>

            <article
              ref={cardRef}
              className={`mt-6 md:absolute md:-bottom-6 md:right-6 md:mt-0 md:max-w-sm ${glassCardLight}`}
            >
              <p className={eyebrowLight}>{t(`cinematic.interiors.cards.${active}.eyebrow`)}</p>
              <h3 className={`mt-2 text-xl md:text-2xl ${headingEditorial}`}>
                {t(`cinematic.interiors.cards.${active}.title`)}
              </h3>
              <p className={`mt-2 text-sm text-graphite ${bodyCopy}`}>
                {t(`cinematic.interiors.cards.${active}.body`)}
              </p>
            </article>
          </div>

          <div
            ref={(el) => {
              sideRefs.current[1] = el;
            }}
            className="hidden overflow-hidden rounded-2xl lg:col-span-2 lg:block"
          >
            <img
              src={activeOption.sides[1]}
              alt=""
              className={`aspect-square w-full ${CINEMATIC_OBJECT_POSITION.collageMain}`}
              sizes={CINEMATIC_IMAGE_SIZES.collageSide}
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
