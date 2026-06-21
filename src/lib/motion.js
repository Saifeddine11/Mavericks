/**
 * Mavericks Motion Library
 *
 * Shared Framer Motion variants, transitions, and helpers.
 * Components should import from here rather than defining inline transitions —
 * this is what gives the whole site a single, coherent motion language.
 *
 * Pairs with `src/lib/gsap.js` (GSAP side) and `src/styles/tokens.js` (tokens).
 */

import { easings, durations, staggers } from '@/styles/tokens';

/* ────────────────────────────────────────────────────────────────────────── */
/*  Base transitions                                                          */
/* ────────────────────────────────────────────────────────────────────────── */

export const transitions = {
  micro: { duration: durations.micro, ease: easings.editorial },
  base: { duration: durations.base, ease: easings.editorial },
  reveal: { duration: durations.reveal, ease: easings.editorial },
  cinematic: { duration: durations.cinematic, ease: easings.editorial },
};

/* ────────────────────────────────────────────────────────────────────────── */
/*  Reusable variants                                                         */
/* ────────────────────────────────────────────────────────────────────────── */

/**
 * Fade + lift — the canonical entrance for editorial blocks.
 * Used by ScrollFadeIn (Phase 2) and section openings.
 */
export const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitions.reveal,
  },
};

/**
 * Soft fade — for ambient elements that shouldn't draw attention.
 */
export const fade = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: transitions.base },
};

/**
 * Container that orchestrates stagger of its children.
 * Pair with `fadeUp` (or any per-child variant) on the children.
 */
export const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: staggers.base,
      delayChildren: 0.1,
    },
  },
};

/**
 * Word-by-word reveal — used by TextReveal (Phase 2) for headlines.
 * Each word is a span with this variant; the parent uses `staggerContainer`.
 */
export const wordReveal = {
  hidden: { opacity: 0, y: '100%' },
  visible: {
    opacity: 1,
    y: '0%',
    transition: { duration: durations.reveal, ease: easings.editorial },
  },
};

/* ────────────────────────────────────────────────────────────────────────── */
/*  Page transitions (used by PageTransition component)                       */
/* ────────────────────────────────────────────────────────────────────────── */

export const pageTransition = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: durations.base, ease: easings.editorial },
  },
  exit: {
    opacity: 0,
    transition: { duration: durations.micro, ease: easings.editorial },
  },
};

/* ────────────────────────────────────────────────────────────────────────── */
/*  Viewport defaults — for `whileInView`                                     */
/* ────────────────────────────────────────────────────────────────────────── */

/**
 * Default viewport options for scroll-triggered reveals.
 * `once: true` — animations only play once (premium, never twitchy).
 * `amount: 0.25` — fire when 25% of the element is visible.
 */
export const viewport = {
  once: true,
  amount: 0.25,
};
