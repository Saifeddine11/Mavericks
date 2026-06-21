import { useRef } from 'react';
import useReducedMotion from '@/hooks/useReducedMotion';
import useMediaQuery from '@/hooks/useMediaQuery';
import useScrollVideoProgress from '@/hooks/useScrollVideoProgress';
import ScrollVideoBackground from './ScrollVideoBackground';
import ScrollStoryStep from './ScrollStoryStep';
import VideoFallback from './VideoFallback';

const VIDEO_SRC = '/videos/mavericks-scroll.mp4';
const POSTER_SRC = '/videos/mavericks-scroll-poster.jpg';

const scenes = [
  {
    eyebrow: 'Scene 01',
    title: 'MARRAKECH PRIVÉE',
    body: 'Villas, riads et résidences d’exception accessibles avec discrétion.',
  },
  {
    eyebrow: 'Scene 02',
    title: 'SÉLECTION PRIVÉE',
    body: 'Chaque adresse est choisie pour son caractère, son emplacement et son potentiel.',
  },
  {
    eyebrow: 'Scene 03',
    title: 'ACCÈS OFF-MARKET',
    body: 'Certaines propriétés ne sont jamais publiées. Elles se dévoilent uniquement après validation privée.',
  },
  {
    eyebrow: 'Scene 04',
    title: 'RIADS, VILLAS ET DOMAINES',
    body: 'Une collection confidentielle pensée pour une clientèle internationale.',
  },
  {
    eyebrow: 'Scene 05',
    title: 'VOTRE ACCÈS COMMENCE ICI',
    body: 'Parlez à Mavericks et ouvrez la porte aux adresses les plus désirables de Marrakech.',
  },
];

export default function ScrollVideoHero() {
  const sectionRef = useRef(null);
  const reducedMotion = useReducedMotion();
  const isMobile = useMediaQuery('(max-width: 767px)');
  const scrollScrubEnabled = !reducedMotion && !isMobile;
  const progress = useScrollVideoProgress(sectionRef, { enabled: scrollScrubEnabled });

  return (
    <section
      ref={sectionRef}
      data-shot
      aria-label="Mavericks private Marrakech real estate"
      className={
        scrollScrubEnabled
          ? 'relative h-[500vh] w-full max-w-[100vw] overflow-x-hidden bg-[#270707]'
          : 'relative min-h-screen w-full max-w-[100vw] overflow-hidden bg-[#270707]'
      }
    >
      <div
        className={
          scrollScrubEnabled
            ? 'sticky top-0 isolate h-[100dvh] w-full overflow-hidden'
            : 'relative isolate min-h-screen w-full overflow-hidden py-28'
        }
      >
        {scrollScrubEnabled ? (
          <ScrollVideoBackground
            progress={progress}
            videoSrc={VIDEO_SRC}
            posterSrc={POSTER_SRC}
            enabled
          />
        ) : (
          <VideoFallback posterSrc={POSTER_SRC} videoSrc={VIDEO_SRC} />
        )}

        <div className="pointer-events-none absolute inset-0 z-10 bg-[#270707]/45" aria-hidden />
        <div
          className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(180deg,rgba(39,7,7,0.68)_0%,rgba(39,7,7,0.22)_42%,rgba(39,7,7,0.72)_100%)]"
          aria-hidden
        />

        <div
          className={
            scrollScrubEnabled
              ? 'absolute inset-0 z-20'
              : 'relative z-20 flex flex-col gap-4'
          }
        >
          {scenes.map((scene, index) => (
            <ScrollStoryStep
              key={scene.title}
              {...scene}
              index={index}
              start={index / scenes.length}
              end={(index + 1) / scenes.length}
              progress={progress}
              active={scrollScrubEnabled}
              isLast={index === scenes.length - 1}
            />
          ))}
        </div>

        {scrollScrubEnabled ? (
          <div className="pointer-events-none absolute bottom-8 left-1/2 z-30 h-10 w-px -translate-x-1/2 overflow-hidden bg-[#F1EBE5]/30">
            <span
              className="block w-px bg-[#C49A6C]"
              style={{ height: `${Math.max(8, progress * 40)}px` }}
            />
          </div>
        ) : null}
      </div>
    </section>
  );
}
