/**
 * CollectionStack
 *
 * Shot 04: the Collection. Not a grid, not cards — a film sequence.
 *
 * Layout:
 *   - Sticky two-column layout on desktop. Left column holds large
 *     uppercase category labels stacked vertically. Right column holds a
 *     single image at a time.
 *   - Each category claims a vertical scroll range of ~100vh. As the user
 *     scrolls through that range:
 *       - the category's label is rendered in full ink
 *       - the others fade to 18% stone
 *       - the right-column image cross-fades to the active category's image
 *   - On mobile, the layout collapses to a stacked vertical sequence —
 *     each label + image pair becomes its own block. No sticky, no
 *     cross-fade. Same content, native reading.
 *
 * Implementation:
 *   - We track scroll position via Framer's `useScroll` on the section.
 *   - The active index is computed from progress and applied to:
 *       (a) per-label opacity (CSS variable, animated via `motion.span`)
 *       (b) image swap inside `AnimatePresence` keyed on the active key
 *
 * Props
 *   items   — array of { key, title, caption, src, alt }. Order is the
 *             scroll sequence.
 */

import { useRef, useState } from 'react';
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useReducedMotion,
} from 'framer-motion';
import clsx from 'clsx';
import { easings, durations } from '@/styles/tokens';

export default function CollectionStack({ items = [] }) {
  const sectionRef = useRef(null);
  const reduce = useReducedMotion();

  // Scroll progress through the entire section, 0..1.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  const [active, setActive] = useState(0);

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    if (items.length === 0) return;
    // Clamp & quantise progress into one of N slots.
    const idx = Math.min(
      items.length - 1,
      Math.max(0, Math.floor(latest * items.length)),
    );
    if (idx !== active) setActive(idx);
  });

  if (items.length === 0) return null;

  return (
    <section
      id="collection"
      ref={sectionRef}
      // Total height = items × 100vh. Each item gets one viewport of scroll.
      // The inner sticky panel pins on desktop for the duration.
      style={{ height: `${items.length * 100}vh` }}
      className="relative bg-ivory"
      data-shot
    >
      {/* Mobile fallback — simple vertical stack. Hidden on lg. */}
      <div className="lg:hidden">
        {items.map((item, i) => (
          <div
            key={item.key}
            className="container-editorial pb-section pt-24 first:pt-section"
          >
            <p className="eyebrow tabular-nums text-stone">
              {String(i + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
            </p>
            <h3
              className="mt-4 font-serif text-display-md uppercase tracking-tight text-navy"
              style={{ fontVariationSettings: "'opsz' 144" }}
            >
              {item.title}
            </h3>
            {item.caption && (
              <p
                className="mt-3 font-serif italic text-base text-gold"
                style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 100" }}
              >
                {item.caption}
              </p>
            )}
            <img
              src={item.src}
              alt={item.alt ?? ''}
              sizes={item.sizes}
              loading={item.loading ?? 'lazy'}
              decoding="async"
              className="mt-10 aspect-[4/5] w-full object-cover"
            />
          </div>
        ))}
      </div>

      {/* Desktop layout — sticky pin, cross-fade. */}
      <div className="hidden lg:block h-full">
        <div className="sticky top-0 h-screen w-full">
          <div className="container-editorial flex h-full items-center">
            <div className="grid w-full grid-cols-12 gap-12">
              {/* Left column — vertical labels */}
              <div className="col-span-5 flex flex-col gap-8 self-center">
                {items.map((item, i) => {
                  const isActive = i === active;
                  return (
                    <div key={item.key} className="relative">
                      <motion.div
                        animate={{
                          opacity: isActive ? 1 : 0.18,
                          x: isActive ? 0 : -8,
                        }}
                        transition={{
                          duration: reduce ? 0 : durations.reveal,
                          ease: easings.editorial,
                        }}
                      >
                        <p className="eyebrow tabular-nums text-stone">
                          {String(i + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
                        </p>
                        <h3
                          className="mt-2 font-sans font-thin uppercase leading-[0.95] tracking-[0.02em] text-navy"
                          style={{
                            fontSize: 'clamp(2rem, 4vw, 3.5rem)',
                          }}
                        >
                          {item.title}
                        </h3>
                        {item.caption && isActive && (
                          <motion.p
                            initial={reduce ? false : { opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: durations.reveal, ease: easings.editorial, delay: 0.15 }}
                            className="mt-2 font-serif italic text-base text-gold"
                            style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 100" }}
                          >
                            {item.caption}
                          </motion.p>
                        )}
                      </motion.div>
                      {/* Active rule indicator */}
                      <motion.span
                        aria-hidden="true"
                        className="absolute -left-8 top-3 block h-px bg-gold"
                        animate={{
                          width: isActive ? '1.5rem' : 0,
                          opacity: isActive ? 1 : 0,
                        }}
                        transition={{
                          duration: reduce ? 0 : durations.reveal,
                          ease: easings.editorial,
                        }}
                      />
                    </div>
                  );
                })}
              </div>

              {/* Right column — cross-fading image */}
              <div className="col-span-7">
                <div className="relative aspect-[4/5] w-full overflow-hidden">
                  <AnimatePresence initial={false} mode="sync">
                    <motion.img
                      key={items[active].key}
                      src={items[active].src}
                      alt={items[active].alt ?? ''}
                      sizes={items[active].sizes}
                      decoding="async"
                      loading={items[active].loading ?? 'lazy'}
                      className="absolute inset-0 h-full w-full object-cover"
                      initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 1.04 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{
                        duration: reduce ? durations.base : durations.cinematic,
                        ease: easings.editorial,
                      }}
                    />
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
