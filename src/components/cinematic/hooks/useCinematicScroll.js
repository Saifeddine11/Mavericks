import { useEffect } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { breakpoints } from '@/styles/tokens';

/**
 * Registers GSAP matchMedia contexts for cinematic sections.
 * Handles reduced-motion static fallbacks and mobile/tablet/desktop splits.
 *
 * @param {(ctx: {
 *   isReduce: boolean,
 *   isMobile: boolean,
 *   isTablet: boolean,
 *   isDesktop: boolean,
 *   isCompact: boolean,
 *   context: gsap.Context,
 * }) => (() => void) | void} setup
 * @returns {() => void} cleanup (call from useGSAP return)
 */
export function cinematicMatchMedia(setup) {
  const mm = gsap.matchMedia();

  mm.add(
    {
      isReduce: breakpoints.reduceMotion,
      isMobile: breakpoints.mobile,
      isTablet: breakpoints.tablet,
      isDesktop: breakpoints.desktop,
    },
    (context) => {
      const { isReduce, isMobile, isTablet, isDesktop } = context.conditions;
      const isCompact = isMobile || isTablet;
      return setup({ isReduce, isMobile, isTablet, isDesktop, isCompact, context });
    },
  );

  return () => mm.revert();
}

/** Directional snap — settles timelines after scroll stops */
export const SCROLL_SNAP = {
  snapTo: 'labelsDirectional',
  duration: { min: 0.28, max: 0.65 },
  delay: 0.08,
  ease: 'power2.out',
};

export const SCROLL_SNAP_COMPACT = {
  snapTo: 'labelsDirectional',
  duration: { min: 0.2, max: 0.45 },
  delay: 0.08,
  ease: 'power2.out',
};

/** Sets elements to their resting visible state (no scroll animation). */
export function setStaticVisible(targets, vars = {}) {
  const list = gsap.utils.toArray(targets).filter(Boolean);
  if (!list.length) return;
  gsap.set(list, {
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
    clipPath: 'inset(0% 0% 0% 0%)',
    filter: 'none',
    ...vars,
  });
}

/** Re-measure ScrollTrigger after images inside `root` finish loading. */
export function refreshScrollTriggersWhenReady(root) {
  if (typeof window === 'undefined' || !root) return;

  const images = gsap.utils.toArray(root.querySelectorAll('img')).filter(Boolean);
  if (!images.length) {
    ScrollTrigger.refresh();
    return;
  }

  let pending = 0;
  const done = () => {
    pending -= 1;
    if (pending <= 0) ScrollTrigger.refresh();
  };

  images.forEach((img) => {
    if (img.complete) return;
    pending += 1;
    img.addEventListener('load', done, { once: true });
    img.addEventListener('error', done, { once: true });
  });

  if (pending === 0) ScrollTrigger.refresh();
}

/**
 * Mount once per animated section scope — refreshes ScrollTrigger after
 * images load and on orientation / resize settle.
 */
export function useScrollTriggerRefresh(scopeRef) {
  useEffect(() => {
    const root = scopeRef?.current;
    if (!root) return undefined;

    refreshScrollTriggersWhenReady(root);

    let resizeTimer;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => ScrollTrigger.refresh(), 150);
    };

    window.addEventListener('orientationchange', onResize);
    window.addEventListener('resize', onResize);

    return () => {
      window.clearTimeout(resizeTimer);
      window.removeEventListener('orientationchange', onResize);
      window.removeEventListener('resize', onResize);
    };
  }, [scopeRef]);
}
