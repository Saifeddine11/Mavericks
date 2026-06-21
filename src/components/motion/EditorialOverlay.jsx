/**
 * EditorialOverlay
 *
 * The dark-translucent text plate that lands on the expanded image in
 * Shot 03 (VisualReveal). Inspired by Amali's caption plates, but tuned
 * for Mavericks:
 *   - navy background at 78% opacity (not solid black) — preserves the
 *     warmth of the image bleeding through.
 *   - hairline gold rule above the eyebrow line.
 *   - eyebrow → quote → byline three-row layout.
 *
 * Enters on viewport with a slow slide-up + opacity. The plate is meant
 * to be positioned by the parent (bottom-left, bottom-right, etc.) —
 * by default we anchor bottom-left with editorial padding.
 *
 * Reduced motion: enters without slide, just appears at final state.
 *
 * Props
 *   eyebrow   — small uppercase label above the quote (e.g. "MAVERICKS · MARRAKECH").
 *   quote     — the editorial line. Pass as string or React node.
 *   byline    — small attribution under the quote.
 *   anchor    — 'bottom-left' (default) | 'bottom-right' | 'center'.
 *   className — extra classes on the plate itself.
 */

import { motion, useReducedMotion } from 'framer-motion';
import clsx from 'clsx';
import { easings, durations } from '@/styles/tokens';

const ANCHORS = {
  'bottom-left': 'left-6 bottom-6 md:left-16 md:bottom-16',
  'bottom-right': 'right-6 bottom-6 md:right-16 md:bottom-16',
  center: 'left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2',
};

export default function EditorialOverlay({
  eyebrow,
  quote,
  byline,
  anchor = 'bottom-left',
  className,
}) {
  const reduce = useReducedMotion();

  return (
    <motion.figure
      // pointer-events back so child links/buttons remain clickable.
      className={clsx(
        'pointer-events-auto absolute',
        'max-w-md md:max-w-lg',
        ANCHORS[anchor],
        className,
      )}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 32 }}
      whileInView={{
        opacity: 1,
        y: 0,
        transition: {
          duration: reduce ? durations.base : durations.reveal,
          ease: easings.editorial,
          // Delay so the plate lands after the image has begun expanding.
          delay: 0.4,
        },
      }}
      viewport={{ once: true, amount: 0.4 }}
    >
      <div
        className={clsx(
          'relative px-6 py-7 md:px-9 md:py-10',
          'bg-navy/[0.78] text-ivory',
          'backdrop-blur-sm',
        )}
      >
        {/* Top gold hairline */}
        <span aria-hidden="true" className="absolute left-6 right-6 top-0 md:left-9 md:right-9 h-px bg-gold/70" />

        {eyebrow && (
          <p className="text-[11px] uppercase tracking-widest text-gold/90">
            {eyebrow}
          </p>
        )}

        {quote && (
          <blockquote
            className="mt-5 font-serif text-xl md:text-2xl leading-snug text-ivory"
            style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 50" }}
          >
            {quote}
          </blockquote>
        )}

        {byline && (
          <figcaption className="mt-5 text-[11px] uppercase tracking-widest text-ivory/60">
            — {byline}
          </figcaption>
        )}
      </div>
    </motion.figure>
  );
}
