import { useEffect, useState } from 'react';

const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));

export default function useScrollVideoProgress(sectionRef, { enabled = true } = {}) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!enabled) {
      setProgress(0);
      return undefined;
    }

    let frameId = 0;
    let lastProgress = -1;

    const measure = () => {
      frameId = 0;

      const section = sectionRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const scrollable = Math.max(1, rect.height - window.innerHeight);
      const nextProgress = clamp(-rect.top / scrollable);

      if (Math.abs(nextProgress - lastProgress) < 0.001) return;

      lastProgress = nextProgress;
      setProgress(nextProgress);
    };

    const scheduleMeasure = () => {
      if (frameId) return;
      frameId = window.requestAnimationFrame(measure);
    };

    scheduleMeasure();

    window.addEventListener('scroll', scheduleMeasure, { passive: true });
    window.addEventListener('resize', scheduleMeasure);
    window.addEventListener('orientationchange', scheduleMeasure);

    return () => {
      if (frameId) window.cancelAnimationFrame(frameId);
      window.removeEventListener('scroll', scheduleMeasure);
      window.removeEventListener('resize', scheduleMeasure);
      window.removeEventListener('orientationchange', scheduleMeasure);
    };
  }, [enabled, sectionRef]);

  return progress;
}
