/**
 * Shot 03 — VisualReveal
 *
 * The set-piece. A single villa/courtyard image enters the viewport at a
 * framed size, then expands to fill the viewport as the user scrolls
 * through a pinned scene. Once expansion is near complete, an
 * EditorialOverlay plate lands at the bottom-left of the frame.
 *
 * Composition driven entirely by ScrollExpandImage + EditorialOverlay —
 * no markup here besides the wiring.
 */

import { useTranslation } from 'react-i18next';
import ScrollExpandImage from '@/components/motion/ScrollExpandImage';
import EditorialOverlay from '@/components/motion/EditorialOverlay';
import { getMediaImageProps } from '@/lib/media';

export default function VisualReveal() {
  const { t } = useTranslation();
  const reveal = getMediaImageProps('reveal', t);

  return (
    <ScrollExpandImage
      src={reveal.src}
      alt={reveal.alt}
      sizes={reveal.sizes}
      loading={reveal.loading}
      pinDuration="+=120%"
    >
      <EditorialOverlay
        eyebrow={t('visualReveal.eyebrow')}
        quote={t('visualReveal.caption')}
        byline={t('visualReveal.byline')}
        anchor="bottom-left"
      />
    </ScrollExpandImage>
  );
}
