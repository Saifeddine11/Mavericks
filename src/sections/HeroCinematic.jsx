/**
 * Shot 01 — HeroCinematic
 *
 * Full viewport. Video background with Ken-Burns scale. Three-line headline
 * cascade, line-by-line (not word-by-word — at this scale words read
 * choppy). Subtitle in Fraunces italic. Two CTAs.
 *
 * Hold: the hero is designed to hold without scroll for ~3 seconds. The
 * floating chrome and scroll cue fade in at the 800ms / 1.6s mark so the
 * UI doesn't compete with the headline reveal.
 */

import { motion, useReducedMotion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import HeroVideo from '@/components/motion/HeroVideo';
import LuxuryButton from '@/components/ui/LuxuryButton';
import { easings, durations } from '@/styles/tokens';

export default function HeroCinematic() {
  const { t } = useTranslation();
  const reduce = useReducedMotion();
  const lines = t('hero.titleLines', { returnObjects: true });
  const titleLines = Array.isArray(lines) ? lines : [t('hero.title')];

  // Per-line reveal timing. Each line lands 600ms after the previous.
  const baseDelay = 0.3;
  const stride = 0.6;

  return (
    <section
      data-shot
      className="relative h-screen min-h-[640px] w-full overflow-hidden bg-ivory text-navy"
    >
      {/* Background film */}
      <HeroVideo posterAlt={t('media.hero.alt')} />

      {/* Centered headline + subtitle + CTAs */}
      <div className="container-editorial relative z-10 flex h-full flex-col items-center justify-center text-center">
        <h1
          className="font-sans font-thin uppercase text-navy"
          style={{
            // Thin weight, broad tracking, large size — the Amali-style move
            // but pushed warmer/sharper for Mavericks.
            fontWeight: 200,
            letterSpacing: '0.04em',
            lineHeight: 0.95,
            fontSize: 'clamp(2.4rem, 6.4vw, 6rem)',
          }}
        >
          {titleLines.map((line, i) => (
            // Each line gets its own clip mask + per-line easing.
            <span key={i} className="block overflow-hidden" style={{ paddingBottom: '0.05em' }}>
              <motion.span
                className="inline-block"
                initial={reduce ? { y: 0, opacity: 1 } : { y: '105%', opacity: 0 }}
                animate={{
                  y: '0%',
                  opacity: 1,
                  transition: {
                    duration: reduce ? 0 : durations.cinematic,
                    delay: reduce ? 0 : baseDelay + i * stride,
                    ease: easings.editorial,
                  },
                }}
                style={{ willChange: 'transform' }}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </h1>

        {/* Italic subtitle — only mixed-case text in the hero */}
        <motion.p
          initial={reduce ? { opacity: 1 } : { opacity: 0, y: 12 }}
          animate={{
            opacity: 1,
            y: 0,
            transition: {
              duration: reduce ? 0 : durations.reveal,
              delay: reduce ? 0 : baseDelay + titleLines.length * stride + 0.1,
              ease: easings.editorial,
            },
          }}
          className="mt-10 max-w-xl font-serif italic text-base md:text-lg leading-relaxed text-graphite"
          style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 80" }}
        >
          {t('hero.subtitleEditorial')}
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={reduce ? { opacity: 1 } : { opacity: 0, y: 8 }}
          animate={{
            opacity: 1,
            y: 0,
            transition: {
              duration: reduce ? 0 : durations.reveal,
              delay: reduce ? 0 : baseDelay + titleLines.length * stride + 0.4,
              ease: easings.editorial,
            },
          }}
          className="mt-12 flex flex-wrap items-center justify-center gap-5"
        >
          <LuxuryButton variant="ghost" size="md" accent>
            {t('hero.ctaExplore')}
          </LuxuryButton>
          <LuxuryButton variant="underline" size="md" accent>
            {t('hero.ctaEnquire')}
          </LuxuryButton>
        </motion.div>
      </div>

      {/* Scroll cue — bottom-center, thin gold rule + small caps */}
      <motion.div
        initial={reduce ? { opacity: 1 } : { opacity: 0 }}
        animate={{
          opacity: 1,
          transition: {
            duration: reduce ? 0 : durations.cinematic,
            delay: reduce ? 0 : 2.4,
            ease: easings.editorial,
          },
        }}
        className="absolute bottom-12 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3"
        aria-hidden="true"
      >
        <span className="text-[10px] uppercase tracking-[0.32em] text-ink-soft">
          {t('chrome.scrollHint')}
        </span>
        <motion.span
          // A thin gold rule that breathes vertically — the subtlest cue.
          className="block w-px bg-gold"
          initial={{ height: 8 }}
          animate={reduce ? { height: 36 } : { height: [8, 36, 8] }}
          transition={{
            duration: reduce ? 0 : 3.2,
            ease: 'easeInOut',
            repeat: reduce ? 0 : Infinity,
          }}
        />
      </motion.div>
    </section>
  );
}
