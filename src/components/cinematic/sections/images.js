/**
 * Villa Peninsula photography — centralized paths for the cinematic homepage.
 *
 * Source originals: `src/villa penensuilla/`
 * Served from:      `public/images/villa-peninsula/` (copies, originals preserved)
 */

const BASE = '/images/villa-peninsula';

/** Canonical filenames from the Villa Peninsula folder. */
export const VILLA_PENINSULA_FILES = {
  aerial: '4dc8545c-1863-4640-9f12-234885161012.png',
  livingKitchen: 'image00002-scaled.webp',
  bedroomView: 'image00003-scaled.webp',
  bedroomSuite: 'image00004-scaled.webp',
  livingTerrace: 'image00006-scaled.webp',
  terracePool: 'image00013-scaled.webp',
  salonWide: 'Villa-J-Salon_Cam04.webp',
  salonGarden: 'Villa-J-Salon_Cam06.webp',
};

const path = (file) => `${BASE}/${file}`;

export const VILLA_PENINSULA_FOLDER = 'public/images/villa-peninsula';
export const VILLA_PENINSULA_SOURCE = 'src/villa penensuilla';

/**
 * Responsive `sizes` hints — keeps decoding appropriate without new dependencies.
 */
export const CINEMATIC_IMAGE_SIZES = {
  heroPortrait: '(max-width: 768px) 100vw, 640px',
  fullBleed: '100vw',
  collageMain: '(max-width: 1024px) 100vw, 66vw',
  collageSide: '(max-width: 1024px) 0px, 16vw',
  teaserCard: '(max-width: 768px) 100vw, 50vw',
};

export const CINEMATIC_IMAGES = {
  /** Hero — aerial exterior, strongest first impression */
  hero: path(VILLA_PENINSULA_FILES.aerial),

  /** Architecture — property-type editorial sequence */
  propertyVilla: path(VILLA_PENINSULA_FILES.terracePool),
  propertyAppartement: path(VILLA_PENINSULA_FILES.livingKitchen),
  propertyRiad: path(VILLA_PENINSULA_FILES.salonGarden),

  /** Architecture — glass volumes then terrace crossfade (legacy) */
  architecturePrimary: path(VILLA_PENINSULA_FILES.livingTerrace),
  architectureSecondary: path(VILLA_PENINSULA_FILES.terracePool),

  /** Concept — salon wide for stable crops on mobile + desktop */
  concept: path(VILLA_PENINSULA_FILES.salonWide),

  /** Lifestyle — garden view from salon, outdoor living */
  lifestyle: path(VILLA_PENINSULA_FILES.salonGarden),

  /** Island — aerial resort-scale landscape for horizontal scroll */
  islandPanorama: path(VILLA_PENINSULA_FILES.aerial),

  /** Interiors — riad set (salon + details) */
  interiorMainA: path(VILLA_PENINSULA_FILES.salonWide),
  interiorSideA1: path(VILLA_PENINSULA_FILES.livingKitchen),
  interiorSideA2: path(VILLA_PENINSULA_FILES.bedroomSuite),

  /** Interiors — villa set (bedroom + garden salon) */
  interiorMainB: path(VILLA_PENINSULA_FILES.bedroomView),
  interiorSideB1: path(VILLA_PENINSULA_FILES.salonGarden),
  interiorSideB2: path(VILLA_PENINSULA_FILES.bedroomSuite),

  /** Growing image — high-res living room with terrace reveal */
  growing: path(VILLA_PENINSULA_FILES.livingTerrace),

  /** Teasers — exterior collection + private bedroom mood */
  teaserOne: path(VILLA_PENINSULA_FILES.aerial),
  teaserTwo: path(VILLA_PENINSULA_FILES.bedroomView),
};

/** Per-slot object-position — separate mobile crops where needed */
export const CINEMATIC_OBJECT_POSITION = {
  hero: 'object-[center_28%] md:object-[center_35%]',
  architecturePrimary: 'object-[center_36%] md:object-[center_42%]',
  architectureSecondary: 'object-[center_48%] md:object-[center_55%]',
  propertyVilla: 'object-[center_40%] md:object-[center_45%]',
  propertyAppartement: 'object-[center_38%] md:object-[center_42%]',
  propertyRiad: 'object-[center_42%] md:object-[center_48%]',
  concept: 'object-[center_42%] md:object-[center_38%]',
  lifestyle: 'object-[center_40%] md:object-[center_45%]',
  islandPanorama: 'object-[center_38%] md:object-[40%_center]',
  growing: 'object-[center_34%] md:object-[center_38%]',
  collageMain: 'object-[center_32%] md:object-[center_35%]',
  teaser: 'object-[center_38%] md:object-[center_40%]',
};
