/**
 * Thin re-export so sections import from `@/lib/media` while paths
 * and remote fallbacks live in `@/data/media`.
 */
export {
  MEDIA,
  IMAGE_SOURCE,
  COLLECTION_MEDIA_KEYS,
  LOCATION_MEDIA_KEYS,
  getMediaSrc,
  getMediaImageProps,
} from '@/data/media';
