import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { gsap, useGSAP } from '@/lib/gsap';
import useSectionTrigger from '../hooks/useSectionTrigger';
import {
  cinematicMatchMedia,
  refreshScrollTriggersWhenReady,
  setStaticVisible,
  useScrollTriggerRefresh,
} from '../hooks/useCinematicScroll';
import { headingEditorial } from '../shared/cinematicClasses';
import { CINEMATIC_IMAGES, CINEMATIC_IMAGE_SIZES, CINEMATIC_OBJECT_POSITION } from './images';

const PROPERTY_KEYS = ['villa', 'appartement', 'riad'];

const READING_VEIL =
  'radial-gradient(circle at 16% 52%, rgba(39,7,7,0.74) 0%, rgba(39,7,7,0.42) 32%, rgba(39,7,7,0.14) 58%, transparent 72%)';

const READING_VEIL_MOBILE =
  'radial-gradient(circle at 22% 28%, rgba(39,7,7,0.72) 0%, rgba(39,7,7,0.38) 38%, rgba(39,7,7,0.12) 64%, transparent 82%)';

const BOTTOM_VIGNETTE =
  'linear-gradient(180deg, transparent 42%, rgba(39,7,7,0.22) 68%, rgba(39,7,7,0.52) 100%)';

const BOTTOM_VIGNETTE_MOBILE =
  'linear-gradient(180deg, transparent 48%, rgba(39,7,7,0.18) 72%, rgba(39,7,7,0.48) 100%)';

const TEXT_RAIL_VEIL =
  'linear-gradient(to top, rgba(39,7,7,0.48), rgba(39,7,7,0.16), transparent)';

/** Opening occupies first segment — red cinematic emerge */
const OPENING_END = 0.15;

/** Final Riad hold — extra pinned scroll with no visual change (~1s feel) */
const RIAD_HOLD = 0.06;

const OPENING_IMAGE_OPACITY = 1;
const OPENING_IMAGE_SCALE = 1.04;
const OPENING_IMAGE_SCALE_END = 1.03;
const OPENING_RED_START = 0.36;
const OPENING_VEIL_START = 0.82;

const WORD_ACTIVE = Object.freeze({
  opacity: 0.95,
  color: '#F1EBEB',
  filter: 'blur(0px)',
  textShadow: '0 8px 30px rgba(39, 7, 7, 0.35)',
});

const WORD_INACTIVE = Object.freeze({
  opacity: 0.32,
  color: '#D6C0B1',
  filter: 'blur(2px)',
  textShadow: '0 0 0 transparent',
});

const IMAGE_ACTIVE = Object.freeze({
  opacity: 1,
  scale: 1,
  filter: 'blur(0px)',
});

const IMAGE_INACTIVE = Object.freeze({
  opacity: 0,
  scale: 1.03,
  filter: 'blur(4px)',
});

const wordActive = () => ({ ...WORD_ACTIVE });
const wordInactive = (isMobile = false) =>
  isMobile
    ? {
        opacity: 0.32,
        color: '#D6C0B1',
        filter: 'none',
        textShadow: '0 0 0 transparent',
      }
    : { ...WORD_INACTIVE };
const imageActive = () => ({ ...IMAGE_ACTIVE });
const imageInactive = (isMobile = false) =>
  isMobile
    ? { opacity: 0, scale: 1.02, filter: 'none' }
    : { ...IMAGE_INACTIVE };

/** Snap to villa / appartement / riad resting points (desktop only) */
const ARCH_SNAP = {
  snapTo: 'labelsDirectional',
  duration: { min: 0.18, max: 0.45 },
  delay: 0.04,
  ease: 'power2.out',
};

const PROPERTY_IMAGES = [
  {
    key: 'villa',
    src: CINEMATIC_IMAGES.propertyVilla,
    position: CINEMATIC_OBJECT_POSITION.propertyVilla,
    altKey: 'imageVillaAlt',
  },
  {
    key: 'appartement',
    src: CINEMATIC_IMAGES.propertyAppartement,
    position: CINEMATIC_OBJECT_POSITION.propertyAppartement,
    altKey: 'imageAppartementAlt',
  },
  {
    key: 'riad',
    src: CINEMATIC_IMAGES.propertyRiad,
    position: CINEMATIC_OBJECT_POSITION.propertyRiad,
    altKey: 'imageRiadAlt',
  },
];

/** Rail x (px) so each word center aligns with mask center */
function measureRailPositions(rail, words, mask) {
  if (!rail || !mask || !words.length) return [0, 0, 0];

  gsap.set(rail, { x: 0 });
  const maskCenter = mask.offsetWidth / 2;

  return words.map((word) => {
    const wordCenter = word.offsetLeft + word.offsetWidth / 2;
    return maskCenter - wordCenter;
  });
}

function applyWordState(tl, words, activeIndex, at, duration, isMobile = false) {
  words.forEach((word, index) => {
    if (!word) return;
    tl.to(
      word,
      { ...(index === activeIndex ? wordActive() : wordInactive(isMobile)), ease: 'none', duration },
      at,
    );
  });
}

function applyImageState(tl, images, activeIndex, at, duration, isMobile = false) {
  images.forEach((image, index) => {
    if (!image) return;
    const target = index === activeIndex ? imageActive() : imageInactive(isMobile);
    if (duration <= 0.02) {
      tl.set(image, target, at);
    } else {
      tl.to(image, { ...target, ease: 'none', duration }, at);
    }
  });
}

function transitionPropertyState(tl, images, words, rail, positions, toIndex, at, duration, isMobile = false) {
  if (rail && positions[toIndex] !== undefined) {
    tl.to(rail, { x: positions[toIndex], ease: 'none', duration }, at);
  }
  applyImageState(tl, images, toIndex, at, duration, isMobile);
  applyWordState(tl, words, toIndex, at, duration, isMobile);
}

/** Red cinematic opening — soft burgundy veil */
function addOpeningReveal(tl, images, redRevealRef, veilRef, isCompact) {
  tl.addLabel('opening', 0);

  tl.fromTo(
    images[0],
    { opacity: OPENING_IMAGE_OPACITY, scale: OPENING_IMAGE_SCALE },
    { opacity: 1, scale: OPENING_IMAGE_SCALE_END, ease: 'none', duration: OPENING_END },
    'opening',
  );

  if (redRevealRef?.current) {
    tl.fromTo(
      redRevealRef.current,
      { opacity: OPENING_RED_START },
      { opacity: 0, ease: 'none', duration: OPENING_END * 0.92 },
      'opening',
    );
  }

  if (veilRef?.current) {
    tl.fromTo(
      veilRef.current,
      { opacity: OPENING_VEIL_START },
      { opacity: isCompact ? 0.22 : 0, ease: 'none', duration: OPENING_END * 0.88 },
      'opening+=0.02',
    );
  }
}

/**
 * Master property timeline — rail, words and images share the same keyframes.
 * Villa @ OPENING_END, Appartement @ mid, Riad @ pre-hold, then stable Riad hold.
 */
function buildSyncedPropertyTimeline(tl, images, words, rail, positions, veilRef, options = {}) {
  const { mobileVeils, isMobile = false } = options;
  const motionSpan = 1 - OPENING_END - RIAD_HOLD;
  const segment = motionSpan / 2;
  const villaAt = OPENING_END;
  const appartementAt = OPENING_END + segment;
  const riadAt = OPENING_END + segment * 2;
  const riadHoldAt = 1;

  tl.addLabel('villa', villaAt);
  tl.set(rail, { x: positions[0] }, villaAt);
  applyImageState(tl, images, 0, villaAt, 0.01);
  words.forEach((word, index) => {
    if (word) tl.set(word, index === 0 ? wordActive() : wordInactive(), villaAt);
  });
  if (veilRef?.current && mobileVeils) {
    tl.to(veilRef.current, { opacity: 0.22, ease: 'none', duration: 0.12 }, villaAt);
  }

  tl.addLabel('appartement', appartementAt);
  transitionPropertyState(tl, images, words, rail, positions, 1, villaAt, segment, isMobile);
  if (veilRef?.current && mobileVeils) {
    tl.to(veilRef.current, { opacity: 0.14, ease: 'none', duration: segment * 0.5 }, appartementAt);
  }

  tl.addLabel('riad', riadAt);
  transitionPropertyState(tl, images, words, rail, positions, 2, appartementAt, segment, isMobile);
  if (veilRef?.current && mobileVeils) {
    tl.to(veilRef.current, { opacity: 0.1, ease: 'none', duration: segment * 0.5 }, riadAt);
  }

  tl.set(images[2], imageActive(), riadAt);
  tl.set(words[2], wordActive(), riadAt);
  tl.set(rail, { x: positions[2] }, riadAt);
  images.forEach((image, index) => {
    if (index !== 2 && image) tl.set(image, imageInactive(isMobile), riadAt);
  });
  words.forEach((word, index) => {
    if (index !== 2 && word) tl.set(word, wordInactive(isMobile), riadAt);
  });

  tl.addLabel('riadHold', riadHoldAt);
  tl.addLabel('final', riadHoldAt);
  tl.to({}, { ease: 'none', duration: RIAD_HOLD }, riadAt);
}

export default function ArchitectureSection() {
  const { t } = useTranslation();
  const sectionRef = useSectionTrigger({ sectionIndex: 0, headerTheme: 'light' });
  const innerRef = useRef(null);
  const imageRefs = useRef([]);
  const wordRefs = useRef([]);
  const redRevealRef = useRef(null);
  const veilRef = useRef(null);
  const mobileReadingVeilRef = useRef(null);
  const mobileBottomVeilRef = useRef(null);
  const textMaskRef = useRef(null);
  const textRailRef = useRef(null);
  const copyRef = useRef(null);

  useScrollTriggerRefresh(sectionRef);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const inner = innerRef.current;
      if (!section || !inner) return;

      return cinematicMatchMedia(({ isReduce, isCompact, isMobile }) => {
        const images = imageRefs.current.filter(Boolean);
        const words = wordRefs.current.filter(Boolean);
        const rail = textRailRef.current;
        const mask = textMaskRef.current;
        const positions = measureRailPositions(rail, words, mask);

        if (isReduce) {
          setStaticVisible([...images, ...words, copyRef.current, rail]);
          gsap.set(images[0], imageActive());
          gsap.set(images.slice(1), imageInactive());
          gsap.set(redRevealRef.current, { opacity: 0 });
          gsap.set(veilRef.current, { opacity: 0 });
          gsap.set(rail, { x: positions[0] ?? 0 });
          gsap.set(words[0], wordActive());
          if (words.length > 1) gsap.set(words.slice(1), wordInactive());
          return undefined;
        }

        gsap.set(images[0], {
          opacity: OPENING_IMAGE_OPACITY,
          scale: OPENING_IMAGE_SCALE,
          filter: 'blur(0px)',
        });
        gsap.set(images.slice(1), imageInactive(isMobile));
        gsap.set(redRevealRef.current, { opacity: OPENING_RED_START });
        gsap.set(veilRef.current, { opacity: OPENING_VEIL_START });
        gsap.set(mobileReadingVeilRef.current, { opacity: 1 });
        gsap.set(mobileBottomVeilRef.current, { opacity: 1 });
        gsap.set(copyRef.current, { opacity: 1, y: 0 });
        gsap.set(rail, { x: positions[0] ?? 0 });
        gsap.set(words, wordInactive(isMobile));

        const end = isMobile ? '+=165%' : isCompact ? '+=190%' : '+=240%';
        const scrub = isMobile ? 0.36 : isCompact ? 0.42 : 0.5;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end,
            pin: inner,
            scrub,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            snap: isCompact ? false : ARCH_SNAP,
          },
        });

        addOpeningReveal(tl, images, redRevealRef, veilRef, isCompact);
        buildSyncedPropertyTimeline(tl, images, words, rail, positions, veilRef, {
          mobileVeils: isCompact,
          isMobile,
        });

        tl.addLabel('end', 1);
        tl.to(copyRef.current, { opacity: 1, y: 0, ease: 'none', duration: 0.01 }, 'end');

        refreshScrollTriggersWhenReady(section);
        return () => tl.scrollTrigger?.kill();
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      id="architecture"
      ref={sectionRef}
      data-shot
      data-section-indicator-trigger
      className="relative overflow-x-clip bg-dark-red text-stone-brand"
      aria-label={t('cinematic.architecture.aria')}
    >
      <div ref={innerRef} className="relative h-[100svh] w-full overflow-hidden lg:h-screen">
        <div className="absolute inset-0">
          {PROPERTY_IMAGES.map((item, index) => (
            <div
              key={item.key}
              ref={(el) => {
                imageRefs.current[index] = el;
              }}
              className={`absolute inset-0 origin-center will-change-[transform,opacity] md:will-change-[transform,opacity,filter] ${index === 0 ? 'z-0' : 'z-[1]'}`}
              style={{ opacity: index === 0 ? OPENING_IMAGE_OPACITY : 0 }}
            >
              <img
                src={item.src}
                alt={t(`cinematic.architecture.${item.altKey}`)}
                className={`cinematic-img h-full w-full object-cover ${item.position}`}
                sizes={CINEMATIC_IMAGE_SIZES.fullBleed}
                loading={index === 0 ? 'eager' : 'lazy'}
                decoding="async"
              />
            </div>
          ))}
          <div
            ref={veilRef}
            className="pointer-events-none absolute inset-0 z-[2] bg-dark-red/20"
            style={{ opacity: OPENING_VEIL_START }}
            aria-hidden="true"
          />
          <div
            ref={redRevealRef}
            className="pointer-events-none absolute inset-0 z-[4] bg-dark-red/55"
            style={{ opacity: OPENING_RED_START }}
            aria-hidden="true"
          />
          <div
            ref={mobileReadingVeilRef}
            className="pointer-events-none absolute inset-0 z-[3] lg:hidden"
            style={{ background: READING_VEIL_MOBILE }}
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute inset-0 z-[3] hidden lg:block"
            style={{ background: READING_VEIL }}
            aria-hidden="true"
          />
          <div
            ref={mobileBottomVeilRef}
            className="pointer-events-none absolute inset-0 z-[3] lg:hidden"
            style={{ background: BOTTOM_VIGNETTE_MOBILE }}
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute inset-0 z-[3] hidden lg:block"
            style={{ background: BOTTOM_VIGNETTE }}
            aria-hidden="true"
          />
        </div>

        <div
          ref={copyRef}
          className="absolute left-6 top-[16%] z-20 max-w-[18rem] md:left-12 md:top-1/2 md:max-w-md md:-translate-y-1/2"
        >
          <p
            className="mb-3 font-label text-[0.6875rem] uppercase tracking-[0.24em] text-champagne"
            style={{ textShadow: '0 1px 14px rgba(39, 7, 7, 0.55)' }}
          >
            {t('cinematic.architecture.eyebrow')}
          </p>
          <h2
            className={`text-[clamp(1.375rem,2.8vw,2.35rem)] font-medium text-stone-brand ${headingEditorial}`}
            style={{
              textShadow: '0 2px 20px rgba(39, 7, 7, 0.58), 0 1px 4px rgba(39, 7, 7, 0.35)',
              lineHeight: 1.12,
            }}
          >
            {t('cinematic.architecture.title')}
          </h2>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[6] overflow-hidden">
          <div
            className="absolute inset-x-0 bottom-0 h-[46%] md:h-[42%]"
            style={{ background: TEXT_RAIL_VEIL }}
            aria-hidden="true"
          />
          <div
            ref={textMaskRef}
            className="relative h-[clamp(5rem,30vw,20rem)] w-full overflow-hidden"
          >
            <div
              ref={textRailRef}
              className="absolute bottom-[-0.4em] left-0 flex w-max items-end gap-[clamp(2rem,8vw,5rem)] whitespace-nowrap will-change-transform md:gap-[clamp(5rem,10vw,12rem)]"
            >
              {PROPERTY_KEYS.map((key, index) => (
                <span
                  key={key}
                  ref={(el) => {
                    wordRefs.current[index] = el;
                  }}
                  className="font-editorial text-[clamp(4rem,24vw,7rem)] font-light italic leading-[0.8] tracking-[-0.06em] will-change-[opacity] md:text-[clamp(7rem,18vw,20rem)] md:will-change-[opacity,filter]"
                  style={wordInactive()}
                >
                  {t(`cinematic.architecture.words.${key}`)}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
