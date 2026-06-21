/**
 * Shot 04 — Collection
 *
 * The Collection as a film sequence. Five categories, each occupying one
 * viewport of scroll. Vertical labels on the left, single image
 * cross-fading on the right.
 *
 * On mobile, the layout collapses to a vertical sequence — see
 * CollectionStack for the breakpoint behaviour.
 */

import { useTranslation } from 'react-i18next';
import CollectionStack from '@/components/motion/CollectionStack';
import { COLLECTION_MEDIA_KEYS, getMediaImageProps } from '@/lib/media';

const COLLECTION_ORDER = ['villas', 'riads', 'estates', 'penthouses', 'offmarket'];

export default function Collection() {
  const { t } = useTranslation();

  // Build the items list from translation keys. Order matters — this is
  // the scroll sequence.
  const items = COLLECTION_ORDER.map((key) => {
    const categoryKey = key === 'offmarket' ? 'offMarket' : key;
    const media = getMediaImageProps(COLLECTION_MEDIA_KEYS[key], t);
    return {
      key,
      title: t(`collection.categories.${categoryKey}.title`),
      caption: t(`collection.categories.${categoryKey}.caption`),
      src: media.src,
      alt: media.alt,
      sizes: media.sizes,
      loading: media.loading,
    };
  });

  return <CollectionStack items={items} />;
}
