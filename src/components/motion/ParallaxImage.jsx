/**
 * ParallaxImage
 *
 * Subtle vertical parallax driven by GSAP ScrollTrigger with scrub.
 *
 * How it works:
 *   - The wrapper has `overflow: hidden` and the user's chosen aspect ratio.
 *   - The inner <img> is positioned absolute, filling the wrapper at 100%
 *     width, taller than the wrapper by `2 * overflowPx` (overflowing
 *     equally top and bottom).
 *   - GSAP ties the image's `y` (in pixels) to scroll progress so it
 *     translates from `+overflowPx` (top — image pushed down) at scroll
 *     start to `-overflowPx` (bottom — image pulled up) at scroll end.
 *
 * Working in pixels rather than yPercent keeps the math obvious and
 * unambiguous: the image's true overflow size is the only number that
 * matters, and ScrollTrigger receives `invalidateOnRefresh: true` so it
 * recomputes correctly on resize.
 *
 * Why GSAP and not Framer here:
 *   - We want the parallax to feel locked to scroll position, including
 *     Lenis's smooth scroll. Driving it from GSAP's ticker (which Lenis is
 *     already wired into in Phase 1) keeps the motion in lockstep with
 *     scroll rather than racing it.
 *   - `scrub: number` gives us a slight catch-up that Framer's `useScroll`
 *     cannot express as elegantly.
 *
 * Reduced motion:
 *   Handled via `gsap.matchMedia` — when `(prefers-reduced-motion: reduce)`
 *   matches, no ScrollTrigger is created. The image renders flat, centred.
 *   matchMedia auto-reverts everything when the preference changes.
 *
 * Cleanup:
 *   `useGSAP({ scope })` auto-reverts the matchMedia context on unmount.
 *
 * Props
 *   src        — string (required).
 *   alt        — string. Default: ''.
 *   speed      — number, 0..0.4 (clamped). Fraction of the wrapper height
 *                that the image overflows on each side. 0.15 = 15% per side
 *                = 30% total range. Default: 0.15.
 *   className  — outer wrapper.
 *   imgClass   — inner <img>.
 *   aspect     — Tailwind aspect class, e.g. 'aspect-[4/5]'. Optional;
 *                parent must size the box if omitted.
 *   loading    — <img> loading attr. Default 'lazy'.
 *   sizes, srcSet — passed through.
 */

import { useRef } from 'react';
import clsx from 'clsx';
import { gsap, useGSAP } from '@/lib/gsap';

export default function ParallaxImage({
  src,
  alt = '',
  speed = 0.15,
  className,
  imgClass,
  aspect,
  loading = 'lazy',
  sizes,
  srcSet,
}) {
  const wrapperRef = useRef(null);
  const imgRef = useRef(null);

  // Clamp so a typo can't turn a section into a slideshow.
  const overflow = Math.max(0, Math.min(0.4, speed));

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        { noReduce: '(prefers-reduced-motion: no-preference)' },
        (context) => {
          if (!context.conditions.noReduce) return;

          const wrapper = wrapperRef.current;
          const image = imgRef.current;
          if (!wrapper || !image) return;

          // Compute overflow in pixels at the moment of refresh. The
          // ScrollTrigger refresh lifecycle invalidates on resize, so this
          // recalculates correctly when the user resizes or rotates.
          const computeOverflowPx = () =>
            wrapper.getBoundingClientRect().height * overflow;

          gsap.fromTo(
            image,
            { y: () => computeOverflowPx() }, // start: pushed down by overflow
            {
              y: () => -computeOverflowPx(), // end: pulled up by overflow
              ease: 'none', // required for scrub-tied tweens
              scrollTrigger: {
                trigger: wrapper,
                start: 'top bottom', // wrapper top reaches viewport bottom
                end: 'bottom top', // wrapper bottom leaves viewport top
                scrub: 0.6, // gentle catch-up smoothing
                invalidateOnRefresh: true,
              },
            },
          );
        },
      );
    },
    { scope: wrapperRef, dependencies: [overflow] },
  );

  // The image is sized at (100 + 2*overflow*100)% of the wrapper height, and
  // top-offset by -overflow*100% so it sits centred vertically. GSAP then
  // translates it within that overflow band.
  const imgStyle = {
    position: 'absolute',
    left: 0,
    width: '100%',
    height: `${100 + overflow * 200}%`,
    top: `-${overflow * 100}%`,
  };

  return (
    <div
      ref={wrapperRef}
      className={clsx('relative overflow-hidden', aspect, className)}
    >
      <img
        ref={imgRef}
        src={src}
        srcSet={srcSet}
        sizes={sizes}
        alt={alt}
        loading={loading}
        decoding="async"
        style={imgStyle}
        className={clsx('object-cover will-change-transform', imgClass)}
      />
    </div>
  );
}
