import { useRef } from 'react';
import { ScrollTrigger, useGSAP } from '@/lib/gsap';
import { useCinematic } from '../context/CinematicContext';

/**
 * Registers a ScrollTrigger band that updates the section indicator and
 * header theme when the section is in view.
 */
export default function useSectionTrigger({
  sectionIndex,
  headerTheme = 'light',
  start = 'top center',
  end = 'bottom center',
} = {}) {
  const ref = useRef(null);
  const { setActiveSection, setHeaderTheme } = useCinematic();

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || sectionIndex == null) return;

      const trigger = ScrollTrigger.create({
        trigger: el,
        start,
        end,
        onEnter: () => {
          setActiveSection(sectionIndex);
          setHeaderTheme(headerTheme);
        },
        onEnterBack: () => {
          setActiveSection(sectionIndex);
          setHeaderTheme(headerTheme);
        },
      });

      return () => trigger.kill();
    },
    { scope: ref, dependencies: [sectionIndex, headerTheme, start, end] },
  );

  return ref;
}
