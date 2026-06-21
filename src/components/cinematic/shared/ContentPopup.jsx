import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { gsap } from '@/lib/gsap';
import { useCinematic } from '../context/CinematicContext';
import { bodyCopy, eyebrowLight, headingEditorial } from './cinematicClasses';

export default function ContentPopup() {
  const { t } = useTranslation();
  const { activePopup, closePopup } = useCinematic();
  const panelRef = useRef(null);
  const backdropRef = useRef(null);

  useEffect(() => {
    const panel = panelRef.current;
    const backdrop = backdropRef.current;
    if (!panel || !backdrop) return;

    if (activePopup) {
      document.body.style.overflow = 'hidden';
      gsap.set(panel, { yPercent: 100 });
      gsap.set(backdrop, { opacity: 0 });
      gsap.to(backdrop, { opacity: 1, duration: 0.35, ease: 'power2.out' });
      gsap.to(panel, { yPercent: 0, duration: 0.7, ease: 'power3.inOut' });
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [activePopup]);

  const handleClose = () => {
    const panel = panelRef.current;
    const backdrop = backdropRef.current;
    if (!panel || !backdrop) {
      closePopup();
      return;
    }
    gsap.to(backdrop, { opacity: 0, duration: 0.3, ease: 'power2.in' });
    gsap.to(panel, {
      yPercent: 100,
      duration: 0.55,
      ease: 'power3.inOut',
      onComplete: closePopup,
    });
  };

  if (!activePopup) return null;

  const title = t(`cinematic.popups.${activePopup}.title`, { defaultValue: activePopup });
  const body = t(`cinematic.popups.${activePopup}.body`, { defaultValue: '' });

  return (
    <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-labelledby="popup-title">
      <div
        ref={backdropRef}
        className="absolute inset-0 bg-dark-red/75"
        onClick={handleClose}
        aria-hidden="true"
      />
      <div
        ref={panelRef}
        className="absolute inset-x-0 bottom-0 top-16 overflow-y-auto bg-stone-brand text-dark-red shadow-editorial"
        data-lenis-prevent
      >
        <div className="container-editorial max-w-prose py-14 md:py-20">
          <p className={`mb-3 ${eyebrowLight}`}>{t('cinematic.popups.eyebrow')}</p>
          <h2 id="popup-title" className={`mb-6 text-display-md ${headingEditorial}`}>
            {title}
          </h2>
          <p className={`text-graphite ${bodyCopy}`}>{body}</p>
        </div>
      </div>
    </div>
  );
}
