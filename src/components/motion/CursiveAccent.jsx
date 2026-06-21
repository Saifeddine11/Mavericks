/**
 * CursiveAccent
 *
 * Renders a single word in Fraunces italic display weight, in muted gold.
 * The signature typographic move of the cinematic homepage — inspired by
 * Amali's gold cursive but executed with Fraunces' optical-size axis so
 * it reads as architectural-italic rather than generic-script.
 *
 * On reveal, the word draws in left-to-right via a clip-path mask, then
 * the italic settles. The eye reads it as if someone wrote it slowly.
 *
 * Props
 *   children     — the word(s) to render. Keep short (1–2 words).
 *   className    — extra classes.
 *   delay        — seconds before the reveal starts. Default 0.
 *   sizeClass    — Tailwind size class. Default 'text-display-md' but
 *                  consumers usually override per context.
 */

import { motion, useReducedMotion } from 'framer-motion';
import clsx from 'clsx';
import { easings, durations } from '@/styles/tokens';

export default function CursiveAccent({
  children,
  className,
  delay = 0,
  sizeClass = 'text-display-md',
}) {
  const reduce = useReducedMotion();

  if (reduce) {
    return (
      <span
        className={clsx(
          'font-serif italic text-gold',
          sizeClass,
          className,
        )}
        style={{
          // Fraunces italic, low optical-size for compactness, high SOFT
          // axis for a softer ductus. fontVariationSettings give us the
          // hand-drawn quality without using a script font.
          fontVariationSettings: "'opsz' 144, 'SOFT' 100, 'wght' 400",
        }}
      >
        {children}
      </span>
    );
  }

  return (
    <motion.span
      className={clsx(
        'inline-block font-serif italic text-gold',
        sizeClass,
        className,
      )}
      style={{
        fontVariationSettings: "'opsz' 144, 'SOFT' 100, 'wght' 400",
        // The clip-path animates from a left-narrow box to fully open,
        // drawing the word in left-to-right.
        willChange: 'clip-path',
      }}
      initial={{ clipPath: 'inset(0 100% 0 0)', opacity: 0 }}
      whileInView={{
        clipPath: 'inset(0 0% 0 0)',
        opacity: 1,
        transition: {
          // Slow on purpose. The word is a moment, not a label.
          clipPath: { duration: durations.cinematic, ease: easings.editorial, delay },
          opacity: { duration: durations.reveal, ease: easings.editorial, delay },
        },
      }}
      viewport={{ once: true, amount: 0.5 }}
    >
      {children}
    </motion.span>
  );
}
