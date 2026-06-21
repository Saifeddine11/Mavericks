/**
 * ScrollCounter
 *
 * Tracks which `data-shot` section is currently in the viewport and renders
 * an EditorialNumber showing its index out of total. Used by FloatingChrome
 * to display "01 / 06" cinematic counter overlaid on the page.
 *
 * Mechanism: a single IntersectionObserver watching every `[data-shot]`
 * element in the document. The shot whose intersection-ratio is highest
 * wins. This is dramatically lighter than per-element scroll listeners and
 * keeps the chrome decoupled from individual sections.
 *
 * Sections opt in by adding `data-shot` to their root element. The order in
 * the DOM is the order shown.
 *
 * Reduced motion: still tracks the index (it's not animation, it's
 * information), but the number transitions are instantaneous instead of
 * cross-fading.
 */

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { easings, durations } from '@/styles/tokens';
import EditorialNumber from '@/components/ui/EditorialNumber';

export default function ScrollCounter({ className }) {
  const [active, setActive] = useState(1);
  const [total, setTotal] = useState(0);
  const ratiosRef = useRef(new Map());
  const reduce = useReducedMotion();

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const shots = Array.from(document.querySelectorAll('[data-shot]'));
    setTotal(shots.length);
    if (shots.length === 0) return undefined;

    // Build a stable index for each element so we can resolve highest-
    // ratio → which shot.
    const indexByEl = new Map(shots.map((el, i) => [el, i + 1]));

    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          ratiosRef.current.set(e.target, e.intersectionRatio);
        }
        // Pick the entry with the highest current ratio.
        let bestEl = shots[0];
        let bestRatio = -1;
        for (const [el, r] of ratiosRef.current) {
          if (r > bestRatio) {
            bestRatio = r;
            bestEl = el;
          }
        }
        const next = indexByEl.get(bestEl) ?? 1;
        setActive((prev) => (prev === next ? prev : next));
      },
      {
        // Multiple thresholds so the observer updates as a section
        // progresses through the viewport, not only when crossing in/out.
        threshold: [0, 0.25, 0.5, 0.75, 1],
      },
    );

    shots.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  if (total === 0) return null;

  return (
    <div className={className} aria-hidden="true">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={active}
          // The whole counter is a small UI moment — slow fade-through.
          initial={reduce ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, y: -6 }}
          transition={{ duration: reduce ? 0 : durations.micro, ease: easings.editorial }}
          className="inline-block"
        >
          <EditorialNumber index={active} total={total} />
        </motion.span>
      </AnimatePresence>
    </div>
  );
}
