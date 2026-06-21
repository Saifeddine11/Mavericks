import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { gsap, useGSAP } from '@/lib/gsap';
import { useCinematic } from '../context/CinematicContext';
import { cinematicMatchMedia, setStaticVisible } from '../hooks/useCinematicScroll';
import GlassPopupButton from '../shared/GlassPopupButton';
import {
  eyebrowDark,
  headingEditorial,
  overlayBottom,
} from '../shared/cinematicClasses';
import { CINEMATIC_IMAGES, CINEMATIC_IMAGE_SIZES, CINEMATIC_OBJECT_POSITION } from './images';

const CTA_KEYS = ['collection', 'visit'];

export default function GrowingImageSection() {
  const { t } = useTranslation();
  const { openPopup } = useCinematic();
  const sectionRef = useRef(null);
  const imageRef = useRef(null);
  const copyRef = useRef(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const image = imageRef.current;
      if (!section || !image) return;

      return cinematicMatchMedia(({ isReduce, isMobile }) => {
        setStaticVisible([image, copyRef.current], {
          clipPath: 'inset(0% 0% 0% 0%)',
          scale: 1,
        });

        if (isReduce) return undefined;

        if (isMobile) {
          gsap.set(copyRef.current, { opacity: 0, y: 20 });
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: section,
              start: 'top 80%',
              end: 'bottom 20%',
              scrub: 0.4,
            },
          });
          tl.to(copyRef.current, { opacity: 1, y: 0, ease: 'none' }, 0);
          return () => tl.scrollTrigger?.kill();
        }

        gsap.set(image, { clipPath: 'inset(14% 18% 14% 18%)', scale: 1.04 });
        gsap.set(copyRef.current, { opacity: 0, y: 24 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: '+=100%',
            pin: true,
            scrub: 0.55,
            anticipatePin: 1,
          },
        });

        tl.to(image, { clipPath: 'inset(0% 0% 0% 0%)', scale: 1, ease: 'none' }, 0);
        tl.to(copyRef.current, { opacity: 1, y: 0, ease: 'none' }, 0.35);

        return () => tl.scrollTrigger?.kill();
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      id="reveal"
      ref={sectionRef}
      data-shot
      className="relative min-h-[100dvh] bg-stone-brand text-stone-brand md:h-screen"
      aria-label={t('cinematic.growing.aria')}
    >
      <div className="relative h-full min-h-[100dvh] w-full overflow-hidden md:min-h-0">
        <img
          ref={imageRef}
          src={CINEMATIC_IMAGES.growing}
          alt={t('cinematic.growing.imageAlt')}
          className={`h-full w-full will-change-[transform,clip-path] ${CINEMATIC_OBJECT_POSITION.growing}`}
          sizes={CINEMATIC_IMAGE_SIZES.fullBleed}
          loading="lazy"
          decoding="async"
        />
        <div className={overlayBottom} aria-hidden="true" />

        <div
          ref={copyRef}
          className="absolute inset-x-0 bottom-0 z-10 flex flex-col gap-5 px-6 pb-14 md:flex-row md:items-end md:justify-between md:px-12 md:pb-16"
        >
          <div className="max-w-md">
            <p className={`mb-2 ${eyebrowDark}`}>{t('cinematic.growing.eyebrow')}</p>
            <h2 className={`text-[clamp(1.5rem,3.5vw,2.5rem)] ${headingEditorial}`}>
              {t('cinematic.growing.title')}
            </h2>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            {CTA_KEYS.map((key, i) => (
              <GlassPopupButton
                key={key}
                label={t(`cinematic.growing.buttons.${key}`)}
                onClick={() => openPopup(key)}
                reverse={i === 1}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
