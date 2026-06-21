/**
 * useReducedMotion
 *
 * Reactive hook for the `prefers-reduced-motion` media query.
 * Returns `true` if the user has requested reduced motion.
 *
 * Note: Framer Motion ships its own `useReducedMotion`. This hook exists for
 * non-Framer code (GSAP setup, Lenis, R3F scene gating) so we have one shape
 * for the value across the codebase. Components inside motion primitives may
 * still use Framer's version — they will agree.
 */

import { useEffect, useState } from 'react';
import { breakpoints } from '@/styles/tokens';

export default function useReducedMotion() {
  const getInitial = () => {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    return window.matchMedia(breakpoints.reduceMotion).matches;
  };

  const [reduced, setReduced] = useState(getInitial);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;

    const mq = window.matchMedia(breakpoints.reduceMotion);
    const handler = (event) => setReduced(event.matches);

    // Modern + legacy listener APIs.
    if (mq.addEventListener) {
      mq.addEventListener('change', handler);
      return () => mq.removeEventListener('change', handler);
    }
    mq.addListener(handler);
    return () => mq.removeListener(handler);
  }, []);

  return reduced;
}
