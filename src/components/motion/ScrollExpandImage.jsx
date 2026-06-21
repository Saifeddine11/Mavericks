/**
 * ScrollExpandImage
 *
 * The set-piece of Shot 03. A single image enters the viewport at a
 * modest framed size (say 60vw × 70vh) and expands to fill the entire
 * viewport as the user scrolls through a pinned scene. The expansion is
 * scrubbed — driven directly by scroll progress, not time — so it always
 * feels like the user is opening the image themselves.
 *
 * The expansion runs on two synchronous properties:
 *   - `scale`: 0.78 → 1.0
 *   - `clipPath inset()`: 8% / 12% margins → 0
 * Both share the same scroll range and easing. The image opens like a
 * frame, not a balloon.
 *
 * Children can be rendered above the image to overlay editorial content
 * (e.g. EditorialOverlay) — they're absolutely positioned on top of the
 * expanding image.
 *
 * Reduced motion: no pin, no scrub, no scale. The image renders at its
 * final (full-bleed) state. matchMedia handles cleanup.
 *
 * Props
 *   src         — image source (required).
 *   alt         — alt text. Default ''.
 *   pinDuration — '+=N' style GSAP end value. Default '+=120%' which means
 *                 the user scrolls 120% of viewport height for the expansion
 *                 to complete.
 *   className   — applied to the outer pinned wrapper.
 *   children    — content overlaid on the image (caption plate, etc.).
 */

import { useRef } from 'react';
import clsx from 'clsx';
import { gsap, useGSAP } from '@/lib/gsap';

export default function ScrollExpandImage({
  src,
  alt = '',
  sizes,
  loading = 'lazy',
  pinDuration = '+=120%',
  className,
  children,
}) {
  const sectionRef = useRef(null);
  const imageRef = useRef(null);
  const innerRef = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        { noReduce: '(prefers-reduced-motion: no-preference)' },
        (context) => {
          if (!context.conditions.noReduce) return;

          const section = sectionRef.current;
          const image = imageRef.current;
          if (!section || !image) return;

          // Two-property tween, scrubbed. ease:'none' is mandatory for scrub.
          gsap.fromTo(
            image,
            {
              scale: 0.78,
              clipPath: 'inset(8% 12% 8% 12%)',
            },
            {
              scale: 1,
              clipPath: 'inset(0% 0% 0% 0%)',
              ease: 'none',
              scrollTrigger: {
                trigger: section,
                start: 'top top',
                end: pinDuration,
                pin: true,
                scrub: 0.8,
                anticipatePin: 1,
                invalidateOnRefresh: true,
              },
            },
          );
        },
      );
    },
    { scope: sectionRef, dependencies: [pinDuration] },
  );

  return (
    <section
      ref={sectionRef}
      // The section itself is one viewport tall (the pin distance is added
      // by ScrollTrigger via `end: '+=…'`). Background is ivory so the
      // edges of the framed image breathe against a warm field, not white.
      className={clsx('relative h-screen w-full bg-ivory', className)}
      data-shot
    >
      {/* The image, will-changed to transform for jank-free scrubbing. */}
      <div
        ref={innerRef}
        className="absolute inset-0 flex items-center justify-center"
      >
        <img
          ref={imageRef}
          src={src}
          alt={alt}
          sizes={sizes}
          decoding="async"
          loading={loading}
          className="h-full w-full object-cover will-change-transform"
        />
      </div>

      {/* Overlay slot — receives EditorialOverlay or whatever else. Centered
          by default, but children can position themselves. */}
      {children && (
        <div className="pointer-events-none absolute inset-0">
          {/* Children get pointer events back individually if they need them. */}
          {children}
        </div>
      )}
    </section>
  );
}
