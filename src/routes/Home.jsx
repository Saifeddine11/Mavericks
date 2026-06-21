/**
 * Home — cinematic film homepage
 *
 * Scroll-video hero → Architecture → Territories → Brand signature → Concept.
 * Chrome (header, menu, indicator, popups) lives in CinematicChrome via App.
 */

import Seo from '@/seo/Seo';

import ScrollVideoHeroSection from '@/components/cinematic/sections/ScrollVideoHeroSection';
import ArchitectureSection from '@/components/cinematic/sections/ArchitectureSection';
import SelectionGallerySection from '@/components/cinematic/sections/SelectionGallerySection';
import BrandSignatureSection from '@/components/cinematic/sections/BrandSignatureSection';
import ConceptSection from '@/components/cinematic/sections/ConceptSection';

export default function Home() {
  return (
    <div className="overflow-x-clip bg-dark-red">
      <Seo />
      <ScrollVideoHeroSection />
      <ArchitectureSection />
      <SelectionGallerySection />
      <BrandSignatureSection />
      <ConceptSection />
    </div>
  );
}
