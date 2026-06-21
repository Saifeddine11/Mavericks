/**
 * Shot 02 — DreamStatement
 *
 * The mist void. After the warm hero, the page lifts into a near-white
 * atmospheric space. Two floating image fragments at different scales
 * and asymmetric positions parallax independently as the user scrolls
 * past. The headline is the centerpiece — thin uppercase Inter for the
 * statement, Fraunces italic gold for the last word.
 *
 * This is the section that most directly captures the Amali "STEP INTO A
 * REALITY THAT TRANSCENDS *Luxury*" energy, but reworked for Mavericks:
 * warmer mist, four lines instead of three, accent word in muted gold
 * Fraunces italic with optical-size axis tuned for warmth.
 */

import { useTranslation } from 'react-i18next';
import { motion, useReducedMotion } from 'framer-motion';
import MistLayer from '@/components/motion/MistLayer';
import ParallaxImage from '@/components/motion/ParallaxImage';
import CursiveAccent from '@/components/motion/CursiveAccent';
import { easings, durations } from '@/styles/tokens';
import { getMediaImageProps } from '@/lib/media';

export default function DreamStatement() {
  const { t } = useTranslation();
  const reduce = useReducedMotion();
  const lines = t('dream.lines', { returnObjects: true });
  const dreamLines = Array.isArray(lines) ? lines : [];

  // The last line is the one we accent in cursive gold. The headline reads:
  //   "Between light, / stone and gardens, / Mavericks opens the doors /
  //    to a more *confidential* Marrakech."
  // We don't try to extract a single word programmatically — we simply
  // render the last line wholly in cursive gold. Cleaner, less brittle.
  const statementLines = dreamLines.slice(0, -1);
  const closingLine = dreamLines[dreamLines.length - 1] ?? '';
  const fragmentA = getMediaImageProps('fragment01', t);
  const fragmentB = getMediaImageProps('fragment02', t);

  return (
    <section
      data-shot
      className="relative overflow-hidden bg-ivory py-section-lg"
      // Pale background gradient — the void is bright, never grey.
      style={{
        background: 'linear-gradient(180deg, #F5F1E8 0%, #FBF8F0 40%, #FBF8F0 60%, #F5F1E8 100%)',
      }}
    >
      {/* Atmospheric mist behind everything */}
      <MistLayer tone="mist" intensity={0.85} />

      {/* Floating fragment — upper right, smaller. Parallax up. */}
      <div className="absolute right-[6%] top-[12%] z-10 w-[22vw] max-w-[280px] md:w-[18vw]">
        <ParallaxImage
          src={fragmentA.src}
          alt={fragmentA.alt}
          sizes={fragmentA.sizes}
          loading={fragmentA.loading}
          aspect="aspect-square"
          speed={0.18}
        />
      </div>

      {/* Floating fragment — lower left, larger. Parallax down. */}
      <div className="absolute left-[4%] bottom-[8%] z-10 w-[32vw] max-w-[420px] md:w-[26vw]">
        <ParallaxImage
          src={fragmentB.src}
          alt={fragmentB.alt}
          sizes={fragmentB.sizes}
          loading={fragmentB.loading}
          aspect="aspect-[4/5]"
          speed={0.14}
        />
      </div>

      {/* Central composed type */}
      <div className="container-editorial relative z-20">
        <motion.p
          initial={reduce ? { opacity: 1 } : { opacity: 0 }}
          whileInView={{
            opacity: 1,
            transition: { duration: durations.reveal, ease: easings.editorial },
          }}
          viewport={{ once: true, amount: 0.6 }}
          className="text-center text-[11px] uppercase tracking-[0.32em] text-stone"
        >
          {t('dream.eyebrow')}
        </motion.p>

        <h2 className="mt-12 text-center" aria-label={dreamLines.join(' ')}>
          {/* Statement lines — thin sans uppercase */}
          {statementLines.map((line, i) => (
            <span
              key={`stmt-${i}`}
              className="block overflow-hidden"
              style={{ paddingBottom: '0.05em' }}
            >
              <motion.span
                className="block font-sans font-thin uppercase text-navy"
                style={{
                  fontWeight: 200,
                  letterSpacing: '0.04em',
                  lineHeight: 1.05,
                  fontSize: 'clamp(1.8rem, 4.4vw, 4.2rem)',
                  willChange: 'transform',
                }}
                initial={reduce ? { y: 0 } : { y: '105%' }}
                whileInView={{
                  y: '0%',
                  transition: {
                    duration: reduce ? 0 : durations.cinematic,
                    delay: reduce ? 0 : 0.2 + i * 0.25,
                    ease: easings.editorial,
                  },
                }}
                viewport={{ once: true, amount: 0.4 }}
              >
                {line}
              </motion.span>
            </span>
          ))}

          {/* Closing line — cursive gold Fraunces italic */}
          {closingLine && (
            <span className="mt-4 block">
              <CursiveAccent
                delay={0.2 + statementLines.length * 0.25}
                sizeClass=""
                className="text-[clamp(2rem,5.2vw,5rem)] leading-none"
              >
                {closingLine}
              </CursiveAccent>
            </span>
          )}
        </h2>
      </div>
    </section>
  );
}
