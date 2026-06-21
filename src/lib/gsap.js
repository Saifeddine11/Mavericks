/**
 * GSAP — single registration point.
 *
 * Per the GSAP React skill, registerPlugin should be called once, before any
 * GSAP code runs. Import this file from `main.jsx` so plugins are registered
 * before any component uses them.
 *
 * Also exports common configuration helpers used across the site.
 */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { easings, durations } from '@/styles/tokens';

// Register plugins once, on the client.
// SSR guard not strictly needed (Vite ships as SPA), but kept for safety.
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, useGSAP);

  // Project-wide defaults — every tween that doesn't override these inherits
  // the editorial feel.
  gsap.defaults({
    duration: durations.base,
    ease: easings.gsapEditorial,
  });

  // Performance: ScrollTrigger should ignore mobile address-bar jitter.
  ScrollTrigger.config({ ignoreMobileResize: true });

  window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
}

export { gsap, ScrollTrigger, useGSAP };
