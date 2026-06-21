/**
 * HorizontalGallery
 *
 * The signature scroll-choreography primitive: as the user scrolls vertically,
 * a pinned section moves its inner row of items horizontally.
 *
 * Built with the GSAP "fake horizontal scroll" pattern (per the ScrollTrigger
 * skill):
 *   1. Pin the wrapper while it's in view.
 *   2. Animate the inner track's `xPercent` from 0 to a computed negative
 *      offset so the rightmost item ends flush with the viewport right.
 *   3. Use `ease: "none"` — non-negotiable for scrub to feel 1:1.
 *
 * Modes
 *   Desktop (≥1024px) and no reduced motion → full pinned horizontal scroll.
 *   Mobile / tablet / reduced motion → renders as a native horizontal
 *     scroller (overflow-x-auto), so the same content remains accessible
 *     without the cinematic choreography.
 *
 * The `gsap.matchMedia` pattern revives/reverts cleanly across breakpoint
 * crossings (e.g. window resize, device rotation).
 *
 * Cleanup is handled by `useGSAP({ scope })`.
 *
 * Props
 *   children       — items to display in a row. Each child is the gallery's
 *                    natural unit (one card, one image, etc.). Children's
 *                    widths should be set by the parent (e.g. with Tailwind
 *                    `w-[80vw] md:w-[50vw] lg:w-[36rem]`).
 *   gap            — Tailwind gap class for spacing between items.
 *                    Default: 'gap-8 md:gap-12 lg:gap-16'.
 *   leadIn         — Tailwind padding class for the left lead-in space.
 *                    Default: 'pl-6 md:pl-16'.
 *   leadOut        — Tailwind padding class for the right lead-out space.
 *                    Default: 'pr-6 md:pr-16'.
 *   pinPaddingClass — Tailwind vertical padding for the pinned section.
 *                    Default: 'py-section'.
 *   className      — applied to the outer wrapper.
 *
 * Composition note for Phase 3
 *   The Signature Locations section will render its six LocationCards as
 *   direct children of this component.
 */

import { useRef } from 'react';
import clsx from 'clsx';
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';

export default function HorizontalGallery({
  children,
  gap = 'gap-8 md:gap-12 lg:gap-16',
  leadIn = 'pl-6 md:pl-16',
  leadOut = 'pr-6 md:pr-16',
  pinPaddingClass = 'py-section',
  className,
}) {
  // Outer ref = the pin target (full-viewport "panel" wrapper).
  // Inner ref = the horizontally-moving track.
  const sectionRef = useRef(null);
  const trackRef = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          // Desktop AND no reduced motion → full choreography.
          isDesktop: '(min-width: 1024px) and (prefers-reduced-motion: no-preference)',
        },
        (context) => {
          if (!context.conditions.isDesktop) return;

          const section = sectionRef.current;
          const track = trackRef.current;
          if (!section || !track) return;

          // Switch the track from native flex/overflow scroll into a
          // pinned-row layout for the desktop choreography. We do this
          // class manipulation here so the mobile fallback is the
          // declarative default and desktop overrides it.
          track.classList.remove('overflow-x-auto');
          track.classList.add('overflow-visible');
          // Force the track to inline-flex so children don't wrap.
          track.style.display = 'flex';

          // Compute how far we need to translate the track to expose the
          // right edge of the last item. We use a function so ScrollTrigger
          // recalculates on refresh.
          const getDistance = () => {
            // Distance = trackScrollWidth - viewportWidth, never negative.
            return Math.max(0, track.scrollWidth - window.innerWidth);
          };

          gsap.to(track, {
            x: () => -getDistance(),
            ease: 'none', // required for scrub
            scrollTrigger: {
              trigger: section,
              start: 'top top',
              // Pin for a distance proportional to how far we need to move.
              // The +window.innerHeight tail gives the last card a moment
              // to "land" before the section unpins.
              end: () => `+=${getDistance() + window.innerHeight * 0.5}`,
              pin: true,
              scrub: 0.8,
              invalidateOnRefresh: true,
              anticipatePin: 1,
            },
          });

          // matchMedia handles cleanup; reverting kills the ScrollTrigger
          // and restores the track's inline styles.
          return () => {
            track.style.display = '';
            track.classList.remove('overflow-visible');
            track.classList.add('overflow-x-auto');
          };
        },
      );

      // Edge case: if the page navigated here while images were still
      // loading, sizes may have been wrong at refresh time. Re-refresh
      // once after a tick so layout settles.
      const id = window.setTimeout(() => ScrollTrigger.refresh(), 250);
      return () => window.clearTimeout(id);
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} className={clsx('relative', pinPaddingClass, className)}>
      <div
        ref={trackRef}
        // Default = native horizontal scroller (mobile / reduced motion / SSR).
        // useGSAP swaps this to a pinned row on desktop.
        className={clsx(
          'flex w-full overflow-x-auto',
          // Hide scrollbar on the native fallback for a cleaner mobile feel.
          // (Webkit) plus standard `scrollbar-width: none`.
          '[scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
          'snap-x snap-mandatory lg:snap-none',
          leadIn,
          leadOut,
          gap,
        )}
      >
        {children}
      </div>
    </section>
  );
}
