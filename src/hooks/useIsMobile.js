/**
 * useIsMobile
 *
 * Reactive hook that returns `true` when the viewport matches mobile breakpoint
 * (< 768px). Used to gate the 3D scene, Lenis, and other heavy effects.
 *
 * Mirrors the `mobile` query in `src/styles/tokens.js` so matchMedia logic in
 * GSAP stays in sync with React state.
 */

import { useEffect, useState } from 'react';
import { breakpoints } from '@/styles/tokens';

export default function useIsMobile() {
  const getInitial = () => {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    return window.matchMedia(breakpoints.mobile).matches;
  };

  const [isMobile, setIsMobile] = useState(getInitial);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;

    const mq = window.matchMedia(breakpoints.mobile);
    const handler = (event) => setIsMobile(event.matches);

    if (mq.addEventListener) {
      mq.addEventListener('change', handler);
      return () => mq.removeEventListener('change', handler);
    }
    mq.addListener(handler);
    return () => mq.removeListener(handler);
  }, []);

  return isMobile;
}
