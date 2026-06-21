/**
 * Shot 05 — PrivateAccessQuiet
 *
 * The quiet shot. Almost empty. Two floating fragments offset asymmetrically,
 * a single editorial sentence centered, one magnetic CTA.
 *
 * This section is meant to be a *breath* between the dense Collection
 * (Shot 04) and the choreographed Signature Locations (Shot 06).
 */

import { useTranslation } from 'react-i18next';
import { motion, useReducedMotion } from 'framer-motion';
import MistLayer from '@/components/motion/MistLayer';
import ParallaxImage from '@/components/motion/ParallaxImage';
import LuxuryButton from '@/components/ui/LuxuryButton';
import { easings, durations } from '@/styles/tokens';
import { getMediaImageProps } from '@/lib/media';

export default function PrivateAccessQuiet() {
  const { t } = useTranslation();
  const reduce = useReducedMotion();

  const quietText = t('privateAccess.quiet');
  const quietLines = quietText.split('\n');
  const fragmentC = getMediaImageProps('fragment03', t);
  const fragmentD = getMediaImageProps('fragment04', t);

  return (
    <section
      data-shot
      className="relative overflow-hidden bg-ivory py-section-lg"
    >
      <MistLayer tone="warm" intensity={0.6} />

      {/* Two off-balance floating fragments — smaller than Dream Statement.
          These are details rather than landscapes. */}
      <div className="absolute left-[8%] top-[14%] z-10 w-[18vw] max-w-[200px] md:w-[14vw]">
        <ParallaxImage
          src={fragmentC.src}
          alt={fragmentC.alt}
          sizes={fragmentC.sizes}
          loading={fragmentC.loading}
          aspect="aspect-[3/4]"
          speed={0.12}
        />
      </div>
      <div className="absolute right-[10%] bottom-[16%] z-10 w-[22vw] max-w-[260px] md:w-[18vw]">
        <ParallaxImage
          src={fragmentD.src}
          alt={fragmentD.alt}
          sizes={fragmentD.sizes}
          loading={fragmentD.loading}
          aspect="aspect-[4/5]"
          speed={0.16}
        />
      </div>

      <div className="container-editorial relative z-20 flex flex-col items-center text-center">
        <motion.p
          initial={reduce ? { opacity: 1 } : { opacity: 0 }}
          whileInView={{
            opacity: 1,
            transition: { duration: durations.reveal, ease: easings.editorial },
          }}
          viewport={{ once: true, amount: 0.5 }}
          className="text-[11px] uppercase tracking-[0.32em] text-stone"
        >
          {t('privateAccess.eyebrow')}
        </motion.p>

        <h2 className="mt-10 max-w-3xl">
          {quietLines.map((line, i) => (
            <span
              key={i}
              className="block overflow-hidden"
              style={{ paddingBottom: '0.05em' }}
            >
              <motion.span
                className="block font-serif text-navy"
                style={{
                  fontSize: 'clamp(1.6rem, 3.4vw, 2.8rem)',
                  lineHeight: 1.15,
                  fontVariationSettings: "'opsz' 144, 'SOFT' 50",
                  willChange: 'transform',
                }}
                initial={reduce ? { y: 0 } : { y: '105%' }}
                whileInView={{
                  y: '0%',
                  transition: {
                    duration: reduce ? 0 : durations.reveal,
                    delay: reduce ? 0 : 0.2 + i * 0.2,
                    ease: easings.editorial,
                  },
                }}
                viewport={{ once: true, amount: 0.4 }}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </h2>

        <motion.div
          initial={reduce ? { opacity: 1 } : { opacity: 0, y: 8 }}
          whileInView={{
            opacity: 1,
            y: 0,
            transition: {
              duration: durations.reveal,
              delay: reduce ? 0 : 0.6 + quietLines.length * 0.2,
              ease: easings.editorial,
            },
          }}
          viewport={{ once: true, amount: 0.4 }}
          className="mt-14"
        >
          <LuxuryButton variant="ghost" size="md" accent>
            {t('privateAccess.cta')}
          </LuxuryButton>
        </motion.div>
      </div>
    </section>
  );
}
