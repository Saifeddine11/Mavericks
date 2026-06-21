/**
 * ScrollFadeIn
 *
 * The lightest primitive in the kit. Fades + lifts a block into view as it
 * enters the viewport, using Framer's `whileInView`. Plays once.
 *
 * Used as the default entrance for any non-headline content: body copy,
 * editorial blocks, cards, sub-sections.
 *
 * Reduced motion: renders children with no animation, no initial offset.
 *
 * Props
 *   as         — string. HTML tag. Default: 'div'.
 *   delay      — seconds. Useful when manually staggering siblings without
 *                a parent stagger container.
 *   y          — initial vertical offset in px. Default: 32.
 *   duration   — seconds. Default: token `durations.reveal` (1.2s).
 *   once       — viewport once. Default: true.
 *   amount     — viewport amount. Default: 0.25.
 *   className  — applied to the root.
 *   children   — content.
 */

import { motion, useReducedMotion } from 'framer-motion';
import { easings, durations } from '@/styles/tokens';
import { viewport as defaultViewport } from '@/lib/motion';

export default function ScrollFadeIn({
  as = 'div',
  delay = 0,
  y = 32,
  duration = durations.reveal,
  once = true,
  amount = defaultViewport.amount,
  className,
  children,
  ...rest
}) {
  const reduce = useReducedMotion();
  const MotionTag = motion[as] ?? motion.div;

  if (reduce) {
    // The non-motion equivalent — no animation, but identical box.
    // We pass `rest` through so consumers can still attach handlers.
    const Tag = as;
    return (
      <Tag className={className} {...rest}>
        {children}
      </Tag>
    );
  }

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{
        opacity: 1,
        y: 0,
        transition: { duration, delay, ease: easings.editorial },
      }}
      viewport={{ once, amount }}
      {...rest}
    >
      {children}
    </MotionTag>
  );
}
