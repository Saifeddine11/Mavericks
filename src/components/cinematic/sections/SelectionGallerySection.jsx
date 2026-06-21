/**
 * Marrakech investment territories — 3D horizontal card gallery (desktop)
 * + vertical tap gallery (mobile).
 */

import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import ThreeDHoverGallery from '@/components/lightswind/3d-hover-gallery';
import TerritoriesMobileGallery from '@/components/cinematic/sections/TerritoriesMobileGallery';
import { brandColors } from '@/config/brand';
import { buildTerritoryGalleryItems } from '@/content/territories';

export default function SelectionGallerySection() {
  const { t } = useTranslation();
  const items = useMemo(() => buildTerritoryGalleryItems(t), [t]);

  return (
    <section
      id="territories"
      className="relative overflow-x-hidden bg-dark-red"
      aria-label={t('cinematic.territories.ariaLabel')}
    >
      <div className="border-b border-white/[0.06] px-6 pb-6 pt-10 md:px-10 md:pb-8 md:pt-14">
        <p className="font-label text-[10px] uppercase tracking-[0.28em] text-champagne/90">
          {t('cinematic.territories.eyebrow')}
        </p>
        <h2 className="mt-3 max-w-xl font-editorial text-2xl font-light text-stone-brand md:text-3xl">
          {t('cinematic.territories.title')}
        </h2>
      </div>

      <div className="gallery-safe-area w-full overflow-x-hidden px-5 py-8 md:flex md:min-h-[clamp(680px,70vh,800px)] md:items-center md:justify-center md:px-[clamp(4rem,8vw,9rem)] md:py-0 md:pt-[clamp(4rem,8vh,7rem)] md:pb-[clamp(3rem,4vh,5rem)]">
        <div className="hidden h-full w-full md:block">
          <ThreeDHoverGallery
            items={items}
            backgroundColor={brandColors.darkRed}
            className="h-full w-full bg-dark-red"
            itemWidth={12}
            itemHeight={20}
            gap={1.2}
            perspective={50}
            hoverScale={15}
            transitionDuration={1.25}
            grayscaleStrength={1}
            brightnessLevel={0.5}
            activeWidth={45}
            zDepth={10}
            enableKeyboardNavigation
          />
        </div>

        <div className="md:hidden">
          <TerritoriesMobileGallery
            items={items}
            backgroundColor={brandColors.darkRed}
          />
        </div>
      </div>
    </section>
  );
}
