/**
 * TextReveal
 *
 * Word-by-word or line-by-line reveal for editorial headlines.
 *
 * The text is split into spans, each clipped by its parent and animated from
 * 100% downward translation + 0 opacity to 0%/1. The result reads as letters
 * "rising into place" from below — slow, refined, cinematic.
 *
 * Reduced motion: when the user prefers reduced motion, the entire text is
 * rendered statically with no animation. The component still adds the
 * structural spans so layout is identical.
 *
 * Props
 *   text         — string (required). Newlines split into separate lines.
 *   as           — string. HTML tag to render. Default: 'span'.
 *   splitBy      — 'word' | 'line'. Default: 'word'.
 *   delay        — seconds before the first child animates. Default: 0.
 *   stagger      — seconds between children. Default: token `staggers.base`.
 *   className    — applied to the root element.
 *   once         — boolean, viewport `once`. Default: true (never replay).
 *   amount       — viewport amount. Default: token default (0.25).
 *
 * Notes on usage
 *   - For multi-line headlines, pass the text with explicit "\n" so each
 *     line gets its own mask. Use `whiteSpace: 'pre-line'` is unnecessary
 *     because we render each line as a block.
 *   - The component never sets text color — inherit from parent.
 */

import { motion, useReducedMotion } from 'framer-motion';
import clsx from 'clsx';
import { easings, durations, staggers } from '@/styles/tokens';
import { viewport as defaultViewport } from '@/lib/motion';

const lineContainer = (delay, stagger) => ({
  hidden: {},
  visible: {
    transition: {
      delayChildren: delay,
      staggerChildren: stagger,
    },
  },
});

const word = {
  hidden: { y: '110%', opacity: 0 },
  visible: {
    y: '0%',
    opacity: 1,
    transition: { duration: durations.reveal, ease: easings.editorial },
  },
};

export default function TextReveal({
  text,
  as: Tag = 'span',
  splitBy = 'word',
  delay = 0,
  stagger = staggers.base,
  className,
  once = true,
  amount = defaultViewport.amount,
}) {
  const reduce = useReducedMotion();
  const lines = (text ?? '').split('\n');

  // Reduced motion: render the text as-is, preserving the line structure
  // but without animation. The visible end-state matches the animated one.
  if (reduce) {
    return (
      <Tag className={className}>
        {lines.map((line, i) => (
          <span key={i} className="block">
            {line}
          </span>
        ))}
      </Tag>
    );
  }

  return (
    <Tag className={className}>
      {lines.map((line, lineIdx) => {
        // Each line is its own mask. Words inside the line stagger together.
        const tokens = splitBy === 'word' ? line.split(/(\s+)/) : [line];

        return (
          <motion.span
            key={lineIdx}
            // Re-use viewport on each line so longer headlines reveal in
            // sequence even if only the top is initially in view.
            initial="hidden"
            whileInView="visible"
            viewport={{ once, amount }}
            variants={lineContainer(delay + lineIdx * 0.08, stagger)}
            // Block layout so each line is its own row.
            className="block overflow-hidden"
            // pb-[0.05em] prevents descenders from being clipped by overflow.
            style={{ paddingBottom: '0.05em' }}
          >
            {tokens.map((token, i) => {
              // Whitespace stays as-is between word spans.
              if (/^\s+$/.test(token)) return <span key={i}>{token}</span>;
              return (
                <motion.span
                  key={i}
                  variants={word}
                  // inline-block so transforms apply to the word, not the line.
                  className={clsx('inline-block', 'will-change-transform')}
                >
                  {token}
                </motion.span>
              );
            })}
          </motion.span>
        );
      })}
    </Tag>
  );
}
