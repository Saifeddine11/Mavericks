/**
 * CinematicRealEstateHero
 *
 * Scroll-driven sticky hero: sky parallax → villa zoom → logo outline →
 * image-filled logo mask → fog wipe → editorial "Why" section.
 *
 * Assets (SVG placeholders — swap for WebP/AVIF when production renders exist):
 *   /public/images/real-estate/sky.svg
 *   /public/images/real-estate/villa-building.svg
 *   /public/images/real-estate/fog-front.svg
 *   /public/images/real-estate/fog-back.svg
 *   /public/logos/mavericks-outline.svg
 *   /public/logos/mavericks-mask.svg
 */

import { useLayoutEffect, useRef } from 'react';
import clsx from 'clsx';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import useReducedMotion from '@/hooks/useReducedMotion';

const ASSETS = {
  sky: '/images/real-estate/sky.svg',
  villa: '/images/real-estate/villa-building.svg',
  fogBack: '/images/real-estate/fog-back.svg',
  fogFront: '/images/real-estate/fog-front.svg',
  logoOutline: '/logos/mavericks-outline.svg',
  logoMask: '/logos/mavericks-mask.svg',
};

/** Shared timeline choreography — values differ per breakpoint via `cfg`. */
function buildTimeline(tl, refs, cfg) {
  const { title, sky, building, logoOutline, logoMask, fogBack, fogFront } = refs;
  const {
    titleYEnd,
    buildingScaleEnd,
    buildingYEnd,
    skyYEnd,
    fogFrontYEnd,
    fogBackYEnd,
  } = cfg;

  // Initial state (progress 0)
  gsap.set(title, { opacity: 1, y: 0 });
  gsap.set(building, { scale: 1, y: 0, opacity: 1, transformOrigin: 'center center' });
  gsap.set(sky, { y: 0, transformOrigin: 'center center' });
  gsap.set(logoOutline, { opacity: 0 });
  gsap.set(logoMask, { opacity: 0 });
  gsap.set(fogBack, { y: cfg.fogBackStartY, opacity: cfg.fogBackStartOpacity });
  gsap.set(fogFront, { y: cfg.fogFrontStartY, opacity: cfg.fogFrontStartOpacity });

  // 0.00 → 0.20 — headline block exits
  tl.to(
    title,
    { opacity: 0, y: titleYEnd, ease: 'none', duration: 0.2 },
    0,
  );

  // 0.00 → 0.55 — building zoom + rise; sky drifts slower (parallax)
  tl.to(
    building,
    { scale: buildingScaleEnd, y: buildingYEnd, ease: 'none', duration: 0.55 },
    0,
  );
  tl.to(sky, { y: skyYEnd, ease: 'none', duration: 0.55 }, 0);

  // 0.25 → 0.45 — outline logo
  tl.to(logoOutline, { opacity: 1, ease: 'none', duration: 0.2 }, 0.25);
  tl.to(logoOutline, { opacity: 0, ease: 'none', duration: 0.15 }, 0.45);

  // 0.45 → 0.60 — filled mask logo
  tl.to(logoMask, { opacity: 1, ease: 'none', duration: 0.15 }, 0.45);

  // 0.55 → 0.85 — fog rises; building recedes
  tl.to(
    fogFront,
    {
      y: fogFrontYEnd,
      opacity: cfg.fogFrontEndOpacity,
      ease: 'none',
      duration: 0.3,
    },
    0.55,
  );
  tl.to(
    fogBack,
    { y: fogBackYEnd, opacity: cfg.fogBackEndOpacity, ease: 'none', duration: 0.3 },
    0.55,
  );
  tl.to(building, { opacity: 0.15, ease: 'none', duration: 0.3 }, 0.55);

  // 0.80 → 1.00 — mask dissolves into fog
  tl.to(logoMask, { opacity: 0, ease: 'none', duration: 0.2 }, 0.8);
  tl.to(
    fogFront,
    { opacity: 1, ease: 'none', duration: 0.2 },
    0.82,
  );

}

export default function CinematicRealEstateHero() {
  const reducedMotion = useReducedMotion();
  const sectionRef = useRef(null);
  const skyRef = useRef(null);
  const titleRef = useRef(null);
  const buildingRef = useRef(null);
  const logoOutlineRef = useRef(null);
  const logoMaskRef = useRef(null);
  const fogBackRef = useRef(null);
  const fogFrontRef = useRef(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return undefined;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      const refs = () => ({
        title: titleRef.current,
        sky: skyRef.current,
        building: buildingRef.current,
        logoOutline: logoOutlineRef.current,
        logoMask: logoMaskRef.current,
        fogBack: fogBackRef.current,
        fogFront: fogFrontRef.current,
      });

      mm.add('(min-width: 768px)', () => {
        const r = refs();
        if (!r.title || !r.building) return undefined;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });

        buildTimeline(tl, r, {
          titleYEnd: -48,
          buildingScaleEnd: 1.28,
          buildingYEnd: '-30vh',
          skyYEnd: '-6vh',
          fogBackStartY: '18vh',
          fogBackStartOpacity: 0.35,
          fogFrontStartY: '32vh',
          fogFrontStartOpacity: 0.5,
          fogBackYEnd: '-55vh',
          fogFrontYEnd: '-95vh',
          fogBackEndOpacity: 0.85,
          fogFrontEndOpacity: 0.95,
        });

        return () => tl.scrollTrigger?.kill();
      });

      mm.add('(max-width: 767px)', () => {
        const r = refs();
        if (!r.title || !r.building) return undefined;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });

        buildTimeline(tl, r, {
          titleYEnd: -32,
          buildingScaleEnd: 1.52,
          buildingYEnd: '-28vh',
          skyYEnd: '-4vh',
          fogBackStartY: '22vh',
          fogBackStartOpacity: 0.4,
          fogFrontStartY: '38vh',
          fogFrontStartOpacity: 0.55,
          fogBackYEnd: '-48vh',
          fogFrontYEnd: '-88vh',
          fogBackEndOpacity: 0.9,
          fogFrontEndOpacity: 1,
        });

        return () => tl.scrollTrigger?.kill();
      });

      ScrollTrigger.refresh();

      return () => mm.revert();
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <>
      {/* ── Pinned scroll scene (~480vh) ── */}
      <section
        ref={sectionRef}
        data-shot
        className={clsx(
          'relative bg-white',
          reducedMotion ? 'min-h-screen' : 'h-[480vh]',
        )}
        aria-label="Luxury real estate in Marrakech"
      >
        <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#E8DFD4]">
          {/* z-0 — sky */}
          <img
            ref={skyRef}
            src={ASSETS.sky}
            alt=""
            className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover will-change-transform"
            decoding="async"
            fetchPriority="high"
          />

          {/* z-10 — far fog */}
          <img
            ref={fogBackRef}
            src={ASSETS.fogBack}
            alt=""
            className="pointer-events-none absolute bottom-0 left-0 z-10 w-full object-cover object-bottom will-change-transform"
            style={{ height: '55vh' }}
            decoding="async"
          />

          {/* z-20 — villa */}
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex justify-center overflow-hidden"
            style={{ bottom: '-8vh' }}
          >
            <img
              ref={buildingRef}
              src={ASSETS.villa}
              alt="Luxury villa in Marrakech"
              className={clsx(
                'hero-building h-auto max-w-none object-contain object-bottom will-change-transform',
                'w-[min(90vw,1400px)] md:w-[min(82vw,1200px)]',
              )}
              decoding="async"
              fetchPriority="high"
            />
          </div>

          {/* z-30 — copy (real links for SEO / a11y) */}
          <div
            ref={titleRef}
            className="absolute inset-x-0 top-0 z-30 flex flex-col items-center px-6 pt-[clamp(6rem,14vh,10rem)] text-center md:px-10"
          >
            <h1
              className="max-w-[14ch] font-sans font-semibold leading-[0.95] tracking-[-0.02em] text-navy"
              style={{ fontSize: 'clamp(2.25rem, 8vw, 9rem)' }}
            >
              Luxury Real Estate in Marrakech
            </h1>
            <p className="mt-6 max-w-xl text-base font-sans font-normal leading-relaxed text-graphite md:mt-8 md:text-lg">
              Private estates. Real guidance. A clear path to what&apos;s next.
            </p>
            <a
              href="#collection"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-navy px-8 py-3.5 text-sm font-medium tracking-wide text-ivory transition-opacity duration-400 hover:opacity-90 md:mt-10"
            >
              Find Properties
              <span aria-hidden="true" className="text-ivory/80">
                →
              </span>
            </a>
          </div>

          {/* z-40 — logo outline */}
          <div
            ref={logoOutlineRef}
            className="pointer-events-none absolute inset-0 z-40 flex items-center justify-center opacity-0 will-change-transform"
          >
            <img
              src={ASSETS.logoOutline}
              alt=""
              className="hero-logo-outline w-[min(92vw,65vw)] max-w-[920px] object-contain"
              decoding="async"
            />
          </div>

          {/* z-45 — logo filled via CSS mask (villa texture inside letters) */}
          <div
            ref={logoMaskRef}
            className="pointer-events-none absolute inset-0 z-[45] flex items-center justify-center opacity-0 will-change-[opacity,transform]"
          >
            <div className="hero-logo-mask" role="img" aria-hidden="true" />
          </div>

          {/* z-50 — front fog */}
          <img
            ref={fogFrontRef}
            src={ASSETS.fogFront}
            alt=""
            className="pointer-events-none absolute bottom-0 left-0 z-50 w-full object-cover object-bottom will-change-transform"
            style={{ height: '70vh' }}
            decoding="async"
          />
        </div>
      </section>

      {/* ── Editorial handoff (white) ── */}
      <section
        data-shot
        className="relative bg-white px-6 py-28 md:px-12 md:py-40 lg:px-16"
      >
        <div className="container-editorial grid gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,2.2fr)] md:gap-16 lg:gap-24">
          <p className="eyebrow self-start text-stone">Why Mavericks</p>
          <h2 className="font-sans text-[clamp(1.75rem,4.2vw,3.25rem)] font-medium leading-[1.12] tracking-[-0.02em] text-navy">
            Your search is changing. Don&apos;t just find a property — find the right
            address, with clarity, discretion and the right team by your side.
          </h2>
        </div>
      </section>
    </>
  );
}
