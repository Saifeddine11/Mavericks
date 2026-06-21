/**
 * ImageReveal
 *
 * Cinematic image entrance. The image enters from clipped to fully revealed,
 * while gently zooming out from a slight zoom-in. Result: the photograph
 * "settles into place" instead of just fading.
 *
 * The technique:
 *   - Outer wrapper masks via clip-path (animated from one edge → full).
 *   - Inner <img> is scaled slightly above 1 → 1, slow editorial easing.
 *
 * Reduced motion: image renders at its final state with no clip animation
 * and no scale animation. Still uses native lazy-loading and decoding.
 *
 * Props
 *   src        — string (required).
 *   alt        — string (required). Always required for a11y; pass '' only
 *                for purely decorative images.
 *   from       — 'bottom' | 'top' | 'left' | 'right'. Direction the reveal
 *                comes from. Default: 'bottom'.
 *   aspect     — Tailwind aspect class, e.g. 'aspect-[4/5]'. Optional; if
 *                omitted the parent must size the box.
 *   className  — applied to the outer mask wrapper.
 *   imgClass   — applied to the inner <img>.
 *   delay      — seconds. Default: 0.
 *   amount     — viewport amount. Default: 0.2 (fires slightly earlier than
 *                ScrollFadeIn so large images are already revealing when the
 *                eye reaches them).
 *   loading    — 'lazy' (default) | 'eager'. Use 'eager' for above-the-fold
 *                hero images.
 *   sizes      — passed through to <img sizes>.
 *   srcSet     — passed through to <img srcset>.
 *
 * Direction → starting clip mapping (revealed direction is the inverse):
 *   from='bottom' → starts hidden from top, reveals downward
 *   from='top'    → starts hidden from bottom, reveals upward
 *   etc.
 */

import { motion, useReducedMotion } from 'framer-motion';
import clsx from 'clsx';
import { easings, durations } from '@/styles/tokens';
import { viewport as defaultViewport } from '@/lib/motion';

// inset(top right bottom left)
const CLIP_HIDDEN = {
  bottom: 'inset(0 0 100% 0)', // hidden at bottom → reveals downward
  top: 'inset(100% 0 0 0)',
  left: 'inset(0 100% 0 0)',
  right: 'inset(0 0 0 100%)',
};
const CLIP_VISIBLE = 'inset(0 0 0 0)';

export default function ImageReveal({
  src,
  alt = '',
  from = 'bottom',
  aspect,
  className,
  imgClass,
  delay = 0,
  amount = 0.2,
  loading = 'lazy',
  sizes,
  srcSet,
}) {
  const reduce = useReducedMotion();

  // Reduced motion path — straight image, no animation. We still keep the
  // wrapper so consumers can rely on its aspect ratio / sizing.
  if (reduce) {
    return (
      <div className={clsx('relative overflow-hidden', aspect, className)}>
        <img
          src={src}
          srcSet={srcSet}
          sizes={sizes}
          alt={alt}
          loading={loading}
          decoding="async"
          className={clsx('h-full w-full object-cover', imgClass)}
        />
      </div>
    );
  }

  return (
    <motion.div
      // Mask layer — animates clip-path from hidden → fully visible.
      className={clsx('relative overflow-hidden', aspect, className)}
      initial={{ clipPath: CLIP_HIDDEN[from] }}
      whileInView={{
        clipPath: CLIP_VISIBLE,
        transition: {
          duration: durations.cinematic, // 2.4s — slow on purpose
          delay,
          ease: easings.editorial,
        },
      }}
      viewport={{ once: true, amount }}
    >
      <motion.img
        src={src}
        srcSet={srcSet}
        sizes={sizes}
        alt={alt}
        loading={loading}
        decoding="async"
        // The image scales out from 1.08 → 1 as the clip opens. The eye
        // doesn't notice the zoom directly, only the warmth it adds.
        initial={{ scale: 1.08 }}
        whileInView={{
          scale: 1,
          transition: {
            duration: durations.cinematic + 0.6, // outlasts the clip slightly
            delay,
            ease: easings.editorial,
          },
        }}
        viewport={{ once: true, amount }}
        className={clsx('h-full w-full object-cover will-change-transform', imgClass)}
      />
    </motion.div>
  );
}
