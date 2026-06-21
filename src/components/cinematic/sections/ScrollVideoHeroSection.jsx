import { forwardRef, useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';
import { useCinematic } from '../context/CinematicContext';
import { heroV2Config } from '../hero/heroV2.config';
import {
  buildHeroSnapPoints,
  CHAPTER_KEYFRAMES,
  chapterVisualState,
  chapterVisualStateMobile,
  clampProgress,
  ctaOpacity,
  opacityFromKeyframes,
  SCROLL_TRIGGER_SNAP,
  SCROLL_TRIGGER_SNAP_MOBILE,
  scrollHintOpacity,
} from '../hero/heroV2ScrollMath';
import {
  getDominantChapterIndex,
  HERO_THEME_CLASSES,
  HERO_VEILS,
  resolveChapterTheme,
} from '../hero/heroChapterThemes';
import { getLangFromPath } from '@/i18n/routing';
import { DEFAULT_LANGUAGE } from '@/i18n';
import useReducedMotion from '@/hooks/useReducedMotion';

function seekVideo(video, target, threshold) {
  const dur = video.duration;
  if (!Number.isFinite(dur) || dur <= 0) return;

  const clamped = Math.min(dur - 0.001, Math.max(0, target));
  if (Math.abs(video.currentTime - clamped) <= threshold) return;

  try {
    if (typeof video.fastSeek === 'function') {
      video.fastSeek(clamped);
    } else {
      video.currentTime = clamped;
    }
  } catch {
    /* retry next frame */
  }
}

function paintFrame(progress, refs) {
  const {
    video,
    videoReady,
    seekThreshold,
    targetTime,
    chapterEls,
    ctaEl,
    hintEl,
    barEl,
    readVeilEl,
    textStageEl,
  } = refs;

  if (video && videoReady) {
    seekVideo(video, targetTime, seekThreshold);
  }

  for (let i = 0; i < chapterEls.length; i++) {
    const el = chapterEls[i];
    if (!el) continue;
    const op = opacityFromKeyframes(progress, CHAPTER_KEYFRAMES[i]);
    const visualState = refs.isMobile ? chapterVisualStateMobile(op) : chapterVisualState(op);
    const { translateY, blurPx } = visualState;
    el.style.opacity = String(op);
    el.style.transform = `translate3d(0,${translateY}px,0)`;
    el.style.filter = blurPx > 0.05 ? `blur(${blurPx}px)` : 'none';
    el.style.visibility = op < 0.02 ? 'hidden' : 'visible';

    const chapterTheme = resolveChapterTheme(heroV2Config.chapters[i]);
    const themeClass = HERO_THEME_CLASSES[chapterTheme.theme] ?? HERO_THEME_CLASSES.lightText;
    el.classList.remove(
      HERO_THEME_CLASSES.lightText,
      HERO_THEME_CLASSES.darkText,
    );
    if (op >= 0.02) {
      el.classList.add(themeClass);
    }
  }

  const dominantIndex = getDominantChapterIndex(progress);
  const dominantTheme = resolveChapterTheme(heroV2Config.chapters[dominantIndex]);
  const dominantOpacity = opacityFromKeyframes(
    progress,
    CHAPTER_KEYFRAMES[dominantIndex],
  );

  if (textStageEl) {
    textStageEl.classList.remove(
      HERO_THEME_CLASSES.lightText,
      HERO_THEME_CLASSES.darkText,
    );
    textStageEl.classList.add(
      HERO_THEME_CLASSES[dominantTheme.theme] ?? HERO_THEME_CLASSES.lightText,
    );
  }

  if (readVeilEl) {
    readVeilEl.style.background = HERO_VEILS[dominantTheme.veil] ?? HERO_VEILS.darkVeil;
    readVeilEl.style.opacity = String(
      dominantOpacity > 0.08 ? Math.min(1, 0.55 + dominantOpacity * 0.45) : 0,
    );
  }

  if (ctaEl) {
    const op = ctaOpacity(
      progress,
      heroV2Config.ctaRevealAt,
      heroV2Config.ctaFadeSpan,
    );
    ctaEl.style.opacity = String(op);
    ctaEl.style.pointerEvents = op > 0.4 ? 'auto' : 'none';
    ctaEl.style.visibility = op < 0.02 ? 'hidden' : 'visible';
  }

  if (hintEl) {
    hintEl.style.opacity = String(scrollHintOpacity(progress));
  }

  if (barEl) {
    barEl.style.transform = `scaleX(${progress})`;
  }
}

const HeroCtaLinks = forwardRef(function HeroCtaLinks(
  { langPath, className, style, id },
  ref,
) {
  return (
    <div ref={ref} id={id} className={className} style={style}>
      <a href="#contact" className="hero-v2-cta-primary">
        {heroV2Config.primaryCta.label}
      </a>
      <a href={heroV2Config.secondaryCta.href} className="hero-v2-cta-secondary">
        {heroV2Config.secondaryCta.label}
      </a>
    </div>
  );
});

/**
 * Pinned scroll-scrubbed video hero (OffMarket ScrollScrubHeroV2 port).
 * Native scroll + GSAP ScrollTrigger scrub → strict progress → currentTime.
 */
export default function ScrollVideoHeroSection() {
  const location = useLocation();
  const lang = getLangFromPath(location.pathname) ?? DEFAULT_LANGUAGE;
  const langPath = `/${lang}`;
  const reducedMotion = useReducedMotion();
  const { setActiveSection, setHeaderTheme } = useCinematic();

  const sectionRef = useRef(null);
  const stageRef = useRef(null);
  const videoRef = useRef(null);
  const progressBarRef = useRef(null);
  const chapterRefs = useRef([]);
  const ctaRef = useRef(null);
  const hintRef = useRef(null);
  const readVeilRef = useRef(null);
  const textStageRef = useRef(null);

  const [videoOk, setVideoOk] = useState(true);
  const videoReadyRef = useRef(false);
  const progressRef = useRef(0);
  const targetTimeRef = useRef(0);
  const rafRef = useRef(0);

  useEffect(() => {
    if (reducedMotion) return undefined;
    const v = videoRef.current;
    if (!v) return undefined;

    let ready = false;
    const markReady = () => {
      if (ready) return;
      ready = true;
      v.pause();
      try {
        v.currentTime = 0;
      } catch {
        /* noop */
      }
      videoReadyRef.current = true;
      ScrollTrigger.refresh();
    };

    const onError = () => setVideoOk(false);

    if (v.readyState >= HTMLMediaElement.HAVE_METADATA) {
      markReady();
    } else {
      v.addEventListener('loadedmetadata', markReady, { once: true });
      v.addEventListener('loadeddata', markReady, { once: true });
      try {
        v.load();
      } catch {
        /* Safari may reject load() on some states */
      }
    }
    v.addEventListener('error', onError, { once: true });

    return () => {
      v.removeEventListener('loadedmetadata', markReady);
      v.removeEventListener('loadeddata', markReady);
      v.removeEventListener('error', onError);
    };
  }, [reducedMotion]);

  useGSAP(
    () => {
      if (reducedMotion || !sectionRef.current || !stageRef.current) return undefined;

      const section = sectionRef.current;
      const threshold = heroV2Config.seekFrameThreshold;
      const snapPoints = buildHeroSnapPoints(
        heroV2Config.ctaRevealAt,
        heroV2Config.ctaFadeSpan,
      );

      const paintAtProgress = (progress, isMobile = false) => {
        paintFrame(progress, {
          video: videoRef.current,
          videoReady: videoReadyRef.current,
          seekThreshold: threshold,
          targetTime: targetTimeRef.current,
          chapterEls: chapterRefs.current,
          ctaEl: ctaRef.current,
          hintEl: hintRef.current,
          barEl: progressBarRef.current,
          readVeilEl: readVeilRef.current,
          textStageEl: textStageRef.current,
          isMobile,
        });
      };

      const syncChrome = () => {
        setActiveSection(-1);
        setHeaderTheme('light');
      };

      const createHeroTrigger = (pinDistance, heightUnit, scrub, isMobile = false) => {
        section.style.height = `${pinDistance * 100}${heightUnit}`;

        const finishScrub = (self) => {
          const progress = clampProgress(self.progress);
          progressRef.current = progress;
          const v = videoRef.current;
          if (v && videoReadyRef.current && Number.isFinite(v.duration)) {
            targetTimeRef.current = progress * v.duration;
          }
          paintAtProgress(progress, isMobile);
        };

        const trigger = ScrollTrigger.create({
          trigger: section,
          start: 'top top',
          end: () => `+=${section.offsetHeight - window.innerHeight}`,
          pin: stageRef.current,
          pinSpacing: false,
          scrub,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          snap: {
            snapTo: snapPoints,
            ...(isMobile ? SCROLL_TRIGGER_SNAP_MOBILE : SCROLL_TRIGGER_SNAP),
          },
          onEnter: syncChrome,
          onEnterBack: syncChrome,
          onUpdate: (self) => {
            const progress = clampProgress(self.progress);
            progressRef.current = progress;

            const v = videoRef.current;
            if (v && videoReadyRef.current && Number.isFinite(v.duration)) {
              targetTimeRef.current = progress * v.duration;
            }

            if (!rafRef.current) {
              rafRef.current = requestAnimationFrame(() => {
                rafRef.current = 0;
                paintAtProgress(progressRef.current, isMobile);
              });
            }
          },
          onScrubComplete: finishScrub,
          onSnapComplete: finishScrub,
        });

        ScrollTrigger.refresh();
        paintAtProgress(clampProgress(trigger.progress), isMobile);

        return () => {
          trigger.kill();
        };
      };

      const mm = gsap.matchMedia();

      mm.add('(max-width: 767px)', () =>
        createHeroTrigger(heroV2Config.pinScrollDistanceMobile, 'svh', 0.45, true),
      );

      mm.add('(min-width: 768px)', () =>
        createHeroTrigger(heroV2Config.pinScrollDistance, 'vh', true, false),
      );

      return () => {
        mm.revert();
        if (rafRef.current) {
          cancelAnimationFrame(rafRef.current);
          rafRef.current = 0;
        }
      };
    },
    { scope: sectionRef, dependencies: [reducedMotion, setActiveSection, setHeaderTheme] },
  );

  if (reducedMotion) {
    return (
      <section
        id="hero"
        data-shot
        aria-label="Mavericks — immobilier de prestige à Marrakech"
        className="relative w-full bg-dark-red text-stone-brand"
      >
        <div
          className="relative h-[100svh] w-full overflow-hidden"
          style={{
            backgroundImage: `url(${heroV2Config.video.poster})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div aria-hidden className="absolute inset-0 bg-dark-red/40" />
          <div className="hero-v2-safe-x relative z-10 flex h-full flex-col items-center justify-center px-6 text-center hero-v2-theme-lightText">
            <h1 className="hero-v2-title-primary">{heroV2Config.chapters[0].headline}</h1>
            <p className="hero-v2-subline mt-5">{heroV2Config.chapters[0].subline}</p>
          </div>
        </div>

        <div className="hero-v2-safe-x space-y-20 bg-dark-red px-6 py-20">
          {heroV2Config.chapters.slice(1).map((ch) => (
            <article key={ch.headline} className="mx-auto max-w-md text-center">
              <h2 className="hero-v2-title-chapter">{ch.headline}</h2>
              <p className="hero-v2-subline mt-4">{ch.subline}</p>
            </article>
          ))}
          <HeroCtaLinks
            langPath={langPath}
            id="private-access"
            className="flex flex-col items-center gap-4 pt-4"
          />
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      id="hero"
      data-shot
      aria-label="Mavericks — immobilier de prestige à Marrakech"
      className="relative w-full bg-dark-red text-stone-brand"
      style={{ height: `${heroV2Config.pinScrollDistanceMobile * 100}svh` }}
    >
      <div
        ref={stageRef}
        className="relative h-[100svh] w-full overflow-hidden md:h-screen"
      >
        {videoOk ? (
          <video
            ref={videoRef}
            className="hero-v2-media [transform:translateZ(0)]"
            src={heroV2Config.video.src}
            poster={heroV2Config.video.poster}
            muted
            playsInline
            preload="auto"
            disablePictureInPicture
            controlsList="nodownload nofullscreen noremoteplayback"
            aria-hidden
            tabIndex={-1}
          />
        ) : (
          <div
            className="hero-v2-media bg-cover bg-center"
            style={{
              backgroundImage: `url(${heroV2Config.video.poster})`,
            }}
            aria-hidden
          />
        )}

        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, rgba(39,7,7,0.38) 0%, rgba(39,7,7,0.22) 45%, rgba(39,7,7,0.48) 100%)',
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at center, transparent 40%, rgba(39,7,7,0.38) 100%)',
          }}
        />

        <div className="sr-readable">
          {heroV2Config.chapters.map((ch, i) =>
            ch.isH1 ? (
              <h1 key={i}>
                {ch.headline} — {ch.subline}
              </h1>
            ) : (
              <h2 key={i}>
                {ch.headline} — {ch.subline}
              </h2>
            ),
          )}
        </div>

        <div className="hero-v2-safe-x pointer-events-none absolute inset-0 z-[4] flex items-center justify-center">
          <div
            ref={textStageRef}
            className={`hero-v2-text-stage relative w-full max-w-4xl ${HERO_THEME_CLASSES.lightText}`}
          >
            <div
              ref={readVeilRef}
              aria-hidden
              className="hero-v2-read-veil"
              style={{
                background: HERO_VEILS.darkVeil,
                opacity: 1,
              }}
            />
            <div className="relative h-[min(42vh,22rem)] w-full md:h-[min(40vh,20rem)]">
            {heroV2Config.chapters.map((ch, i) => (
              <div
                key={ch.headline}
                ref={(el) => {
                  chapterRefs.current[i] = el;
                }}
                className={`absolute inset-0 flex flex-col items-center justify-center px-4 text-center ${HERO_THEME_CLASSES[resolveChapterTheme(ch).theme] ?? HERO_THEME_CLASSES.lightText}`}
                style={{
                  opacity: i === 0 ? 1 : 0,
                  transform: 'translate3d(0,0,0)',
                  willChange: 'opacity, transform',
                }}
                aria-hidden
              >
                {ch.isH1 ? (
                  <p className="hero-v2-title-primary">{ch.headline}</p>
                ) : (
                  <p className="hero-v2-title-chapter">{ch.headline}</p>
                )}
                <p className="hero-v2-subline mt-5 md:mt-6">{ch.subline}</p>
              </div>
            ))}
            </div>
          </div>
        </div>

        <HeroCtaLinks
          langPath={langPath}
          ref={ctaRef}
          id="private-access"
          className="hero-v2-safe-x hero-v2-safe-bottom absolute bottom-[clamp(3.5rem,9vh,7rem)] left-0 right-0 z-10 flex flex-col items-center gap-4 px-4 sm:gap-5"
          style={{ opacity: 0, pointerEvents: 'none', visibility: 'hidden' }}
        />

        <div
          ref={hintRef}
          className="pointer-events-none absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2"
          style={{ opacity: 0.65 }}
          aria-hidden
        >
          <span className="font-body text-[0.65rem] uppercase tracking-[0.32em] text-stone-brand/85 [text-shadow:0_1px_10px_rgba(39,7,7,0.45)]">
            Faire défiler
          </span>
          <span className="block h-8 w-px bg-stone-brand/60" aria-hidden />
        </div>

        <div
          aria-hidden
          className="absolute bottom-0 left-0 right-0 h-px bg-stone-brand/15"
        >
          <div
            ref={progressBarRef}
            className="h-full origin-left bg-champagne"
            style={{ transform: 'scaleX(0)' }}
          />
        </div>
      </div>
    </section>
  );
}
