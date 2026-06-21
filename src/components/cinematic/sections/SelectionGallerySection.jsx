/**
 * Marrakech investment territories — 3D horizontal card gallery.
 *
 * Between Architecture and Concept. Uses Lightswind `3d-hover-gallery`
 * with zone-specific copy and swappable image keys from `content/territories.js`.
 */

import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import ThreeDHoverGallery from '@/components/lightswind/3d-hover-gallery';
import { brandColors } from '@/config/brand';
import { buildTerritoryGalleryItems } from '@/content/territories';

export default function SelectionGallerySection() {
  const { t } = useTranslation();
  const items = useMemo(() => buildTerritoryGalleryItems(t), [t]);

  return (
    <section
      id="territories"
      className="relative bg-dark-red"
      aria-label={t('cinematic.territories.ariaLabel')}
    >
      <div className="border-b border-white/[0.06] px-6 pb-4 pt-10 md:px-10 md:pt-14">
        <p className="font-label text-[10px] uppercase tracking-[0.28em] text-champagne/90">
          {t('cinematic.territories.eyebrow')}
        </p>
        <h2 className="mt-3 max-w-xl font-editorial text-2xl font-light text-stone-brand md:text-3xl">
          {t('cinematic.territories.title')}
        </h2>
      </div>

      <ThreeDHoverGallery
        items={items}
        backgroundColor={brandColors.darkRed}
        className="bg-dark-red py-8 md:py-12"
        itemWidth={7}
        itemHeight={15}
        gap={0.85}
        perspective={42}
        hoverScale={11}
        transitionDuration={1.2}
        grayscaleStrength={0.92}
        brightnessLevel={0.5}
        activeWidth={36}
        enableKeyboardNavigation
      />
    </section>
  );
}
