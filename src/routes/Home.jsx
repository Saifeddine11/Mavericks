/**
 * Home — cinematic film homepage
 *
 * Scroll-video hero → Architecture → Concept.
 * Chrome (header, menu, indicator, popups) lives in CinematicChrome via App.
 */

import Seo from '@/seo/Seo';

import ScrollVideoHeroSection from '@/components/cinematic/sections/ScrollVideoHeroSection';
import ArchitectureSection from '@/components/cinematic/sections/ArchitectureSection';
import SelectionGallerySection from '@/components/cinematic/sections/SelectionGallerySection';
import ConceptSection from '@/components/cinematic/sections/ConceptSection';

export default function Home() {
  return (
    <>
      <Seo />
      <ScrollVideoHeroSection />
      <ArchitectureSection />
      <SelectionGallerySection />
      <ConceptSection />
    </>
  );
}
