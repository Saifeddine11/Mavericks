/**
 * Shot 06 — SignatureLocations
 *
 * Full horizontal experience. Six neighborhoods, each rendered as a
 * destination plate (image background, eyebrow counter, label, italic
 * caption) ~66vw wide on desktop, falling back to a native horizontal
 * scroller on mobile via HorizontalGallery's built-in behaviour.
 *
 * The labels are large thin sans uppercase — same family as the hero
 * and Dream Statement so the typographic language stays consistent.
 */

import { useTranslation } from 'react-i18next';
import HorizontalGallery from '@/components/motion/HorizontalGallery';
import ImageReveal from '@/components/motion/ImageReveal';
import { LOCATION_MEDIA_KEYS, getMediaImageProps } from '@/lib/media';

const LOCATION_KEYS = ['palmeraie', 'hivernage', 'amelkis', 'ourika', 'medina', 'agdal'];

export default function SignatureLocations() {
  const { t } = useTranslation();
  const total = LOCATION_KEYS.length;

  return (
    <section data-shot className="relative bg-ivory">
      {/* Section title — anchored above the gallery */}
      <div className="container-editorial pt-section">
        <p className="text-[11px] uppercase tracking-[0.32em] text-stone">
          {t('locations.eyebrow')}
        </p>
        <h2
          className="mt-6 max-w-3xl font-sans font-thin uppercase text-navy"
          style={{
            fontWeight: 200,
            letterSpacing: '0.02em',
            fontSize: 'clamp(2rem, 4.4vw, 4rem)',
            lineHeight: 1.05,
          }}
        >
          {t('locations.title')}
        </h2>
      </div>

      <HorizontalGallery
        pinPaddingClass="py-section"
        gap="gap-6 md:gap-10 lg:gap-14"
        leadIn="pl-6 md:pl-16"
        leadOut="pr-6 md:pr-16"
      >
        {LOCATION_KEYS.map((key, i) => {
          const media = getMediaImageProps(LOCATION_MEDIA_KEYS[key], t);
          return (
          <article
            key={key}
            className="
              relative shrink-0 snap-center
              w-[82vw] md:w-[58vw] lg:w-[44vw]
              aspect-[4/5]
              overflow-hidden
            "
          >
            <ImageReveal
              src={media.src}
              alt={media.alt}
              sizes={media.sizes}
              loading={media.loading}
              aspect="absolute inset-0"
              from="bottom"
            />
            {/* Top-right numeric counter */}
            <div className="absolute right-5 top-5 z-10 text-ivory">
              <span className="inline-flex items-center gap-2 font-sans uppercase tracking-widest text-[11px] tabular-nums">
                <span>{String(i + 1).padStart(2, '0')}</span>
                <span aria-hidden="true" className="block h-px w-3 bg-gold opacity-80" />
                <span className="opacity-70">{String(total).padStart(2, '0')}</span>
              </span>
            </div>

            {/* Bottom label — soft scrim only at the bottom for legibility */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2"
              style={{
                background:
                  'linear-gradient(180deg, rgba(8,24,38,0) 0%, rgba(8,24,38,0.55) 100%)',
              }}
            />
            <div className="absolute left-6 right-6 bottom-6 z-10 text-ivory md:left-8 md:bottom-8">
              <h3
                className="font-sans font-thin uppercase"
                style={{
                  fontWeight: 200,
                  letterSpacing: '0.04em',
                  fontSize: 'clamp(1.4rem, 2.6vw, 2.2rem)',
                  lineHeight: 1,
                }}
              >
                {t(`locations.items.${key}.name`)}
              </h3>
              <p
                className="mt-3 max-w-xs font-serif italic text-sm text-ivory/80"
                style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 80" }}
              >
                {t(`locations.items.${key}.description`)}
              </p>
            </div>
          </article>
          );
        })}
      </HorizontalGallery>
    </section>
  );
}
