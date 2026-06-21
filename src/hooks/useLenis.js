/**
 * useLenis
 *
 * Integrates Lenis smooth scroll, but ONLY when:
 *   - the viewport is not mobile (< 768px), AND
 *   - the user has not requested reduced motion.
 *
 * When either condition becomes true, Lenis is destroyed and native scroll
 * takes over. The hook also keeps GSAP's ScrollTrigger in sync with Lenis so
 * pinned sections and scrub-tied tweens behave correctly.
 *
 * Mount this once at the top of the app (App.jsx) — there must be only one
 * Lenis instance per document.
 */

import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import useReducedMotion from './useReducedMotion';
import useIsMobile from './useIsMobile';

export default function useLenis() {
  const reducedMotion = useReducedMotion();
  const isMobile = useIsMobile();

  useEffect(() => {
    // Native scroll on mobile or when the user prefers reduced motion.
    if (isMobile || reducedMotion) return undefined;

    const lenis = new Lenis({
      // Slow, cinematic feel — matches the editorial duration in tokens.
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // expo-out
      smoothWheel: true,
      // Touch scrolling stays native even on desktop hybrid devices.
      smoothTouch: false,
    });

    // Drive Lenis from GSAP's ticker so the two run on the same RAF.
    const onTick = (time) => {
      // GSAP ticks in seconds, Lenis expects milliseconds.
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(onTick);
    // Disable GSAP's lag smoothing while Lenis owns the scroll loop.
    gsap.ticker.lagSmoothing(0);

    // Re-measure ScrollTrigger whenever Lenis scrolls. This keeps pinned
    // sections and scrub animations 1:1 with the page position.
    lenis.on('scroll', ScrollTrigger.update);

    return () => {
      gsap.ticker.remove(onTick);
      gsap.ticker.lagSmoothing(500, 33);
      lenis.destroy();
    };
  }, [isMobile, reducedMotion]);
}
