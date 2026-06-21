/**
 * OFF / MARKET — enter through MARKET typography → full-screen video.
 */

import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import OffMarketLineMask from '@/components/cinematic/sections/OffMarketLineMask';
import OffMarketStackedMask from '@/components/cinematic/sections/OffMarketStackedMask';
import { gsap, useGSAP } from '@/lib/gsap';
import useReducedMotion from '@/hooks/useReducedMotion';
import {
  cinematicMatchMedia,
  refreshScrollTriggersWhenReady,
  useScrollTriggerRefresh,
} from '../hooks/useCinematicScroll';

const BRAND_VIDEO_SRC = '/videos/offmarket-villa-reveal.mp4';
const CLIP_START = 'circle(8% at 50% 55%)';
const CLIP_MID = 'circle(45% at 50% 55%)';
const CLIP_END = 'circle(150% at 50% 55%)';

const VIDEO_PROPS = {
  muted: true,
  loop: true,
  autoPlay: true,
  playsInline: true,
  preload: 'auto',
};

function BrandVideo() {
  return (
    <video
      className="absolute inset-0 h-full w-full object-cover object-center"
      {...VIDEO_PROPS}
    >
      <source src={BRAND_VIDEO_SRC} type="video/mp4" />
    </video>
  );
}

function StaticBrandSignature({ lineOff, lineMarket, tagline, ariaLabel }) {
  return (
    <section
      id="brand-signature"
      className="relative overflow-x-clip bg-dark-red"
      aria-label={ariaLabel}
    >
      <div className="grid min-h-[100svh] place-items-center px-4">
        <OffMarketStackedMask
          src={BRAND_VIDEO_SRC}
          lineOff={lineOff}
          lineMarket={lineMarket}
          videoProps={VIDEO_PROPS}
        />
      </div>

      <div className="relative h-[100svh] w-full overflow-hidden">
        <BrandVideo />
      </div>

      <p className="px-6 py-12 text-center font-editorial text-base font-light leading-relaxed text-stone-brand/85 md:text-lg">
        {tagline}
      </p>
    </section>
  );
}

export default function BrandSignatureSection() {
  const { t } = useTranslation();
  const reducedMotion = useReducedMotion();
  const sectionRef = useRef(null);
  const maskGroupRef = useRef(null);
  const offLineRef = useRef(null);
  const marketLineRef = useRef(null);
  const videoRevealRef = useRef(null);
  const videoClipRef = useRef(null);
  const captionRef = useRef(null);

  const lineOff = t('cinematic.brandSignature.lineOff');
  const lineMarket = t('cinematic.brandSignature.lineMarket');
  const tagline = t('cinematic.brandSignature.tagline');
  const ariaLabel = t('cinematic.brandSignature.ariaLabel');

  useScrollTriggerRefresh(sectionRef);

  useGSAP(
    () => {
      if (reducedMotion) return undefined;

      const section = sectionRef.current;
      const maskGroup = maskGroupRef.current;
      const offLine = offLineRef.current;
      const marketLine = marketLineRef.current;
      const videoReveal = videoRevealRef.current;
      const videoClip = videoClipRef.current;
      const caption = captionRef.current;

      if (!section || !maskGroup || !offLine || !marketLine || !videoReveal || !videoClip) {
        return undefined;
      }

      return cinematicMatchMedia(({ isCompact, isMobile }) => {
        const marketScaleEnd = isCompact ? 2.75 : 3.35;
        const origin = '50% 55%';

        gsap.set(maskGroup, { autoAlpha: 0, scale: 0.9, transformOrigin: origin });
        gsap.set(offLine, { autoAlpha: 1, transformOrigin: '50% 50%' });
        gsap.set(marketLine, {
          autoAlpha: 1,
          scale: 1,
          transformOrigin: origin,
        });
        gsap.set(videoReveal, { opacity: 0 });
        gsap.set(videoClip, {
          clipPath: CLIP_START,
          WebkitClipPath: CLIP_START,
        });
        if (caption) {
          gsap.set(caption, { opacity: 0 });
        }

        const end = isMobile ? '+=200%' : isCompact ? '+=240%' : '+=300%';
        const scrub = isMobile ? 0.42 : isCompact ? 0.5 : 0.7;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end,
            pin: true,
            scrub,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        tl.addLabel('enter', 0);
        tl.to(
          maskGroup,
          { autoAlpha: 1, scale: 1, ease: 'none', duration: 0.12 },
          'enter',
        );
        if (caption) {
          tl.to(caption, { opacity: 1, ease: 'none', duration: 0.1 }, 'enter+=0.05');
        }

        tl.addLabel('zoom', 0.1);
        tl.to(
          marketLine,
          { scale: marketScaleEnd, ease: 'none', duration: 0.38 },
          'zoom',
        );

        tl.addLabel('offFade', 0.2);
        tl.to(
          offLine,
          { autoAlpha: 0, ease: 'none', duration: 0.15 },
          'offFade',
        );

        tl.addLabel('sphereIn', 0.25);
        tl.to(videoReveal, { opacity: 1, ease: 'none', duration: 0.2 }, 'sphereIn');
        tl.to(
          videoClip,
          {
            clipPath: CLIP_MID,
            WebkitClipPath: CLIP_MID,
            ease: 'none',
            duration: 0.1,
          },
          'sphereIn+=0.1',
        );

        tl.addLabel('marketFade', 0.38);
        tl.to(
          marketLine,
          { autoAlpha: 0, ease: 'none', duration: 0.17 },
          'marketFade',
        );
        tl.to(maskGroup, { autoAlpha: 0, ease: 'none', duration: 0.1 }, 'marketFade+=0.12');

        if (caption) {
          tl.to(caption, { opacity: 0, ease: 'none', duration: 0.1 }, 'offFade');
        }

        tl.addLabel('sphereExpand', 0.35);
        tl.to(
          videoClip,
          {
            clipPath: CLIP_END,
            WebkitClipPath: CLIP_END,
            ease: 'none',
            duration: 0.65,
          },
          'sphereExpand',
        );

        tl.set([offLine, marketLine, maskGroup], { autoAlpha: 0 }, 0.58);

        tl.addLabel('final', 1);
        tl.to(videoReveal, { opacity: 1, ease: 'none', duration: 0.01 }, 'final');
        tl.to(
          videoClip,
          { clipPath: CLIP_END, WebkitClipPath: CLIP_END, ease: 'none', duration: 0.01 },
          'final',
        );
        tl.set([offLine, marketLine, maskGroup], { autoAlpha: 0, visibility: 'hidden' }, 'final');

        refreshScrollTriggersWhenReady(section);
        return () => tl.scrollTrigger?.kill();
      });
    },
    { scope: sectionRef, dependencies: [reducedMotion] },
  );

  if (reducedMotion) {
    return (
      <StaticBrandSignature
        lineOff={lineOff}
        lineMarket={lineMarket}
        tagline={tagline}
        ariaLabel={ariaLabel}
      />
    );
  }

  return (
    <section
      id="brand-signature"
      ref={sectionRef}
      className="relative h-[100svh] min-h-[100svh] overflow-x-clip overflow-hidden bg-dark-red"
      aria-label={ariaLabel}
    >
      <div ref={videoRevealRef} className="absolute inset-0 z-10">
        <div
          ref={videoClipRef}
          className="absolute inset-0 overflow-hidden will-change-[clip-path]"
        >
          <BrandVideo />
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 z-20 grid place-items-center">
        <div
          ref={maskGroupRef}
          className="flex w-full max-w-[100vw] flex-col items-center justify-center will-change-transform"
        >
          <div
            ref={offLineRef}
            className="h-[clamp(4.8rem,18vw,14rem)] w-full will-change-[opacity] md:h-[clamp(8rem,18vw,22rem)]"
          >
            <OffMarketLineMask
              src={BRAND_VIDEO_SRC}
              text={lineOff}
              variant="off"
              {...VIDEO_PROPS}
            />
          </div>
          <div
            ref={marketLineRef}
            className="-mt-[0.06em] h-[clamp(5.4rem,20vw,16rem)] w-full will-change-transform md:h-[clamp(9rem,20vw,26rem)]"
            style={{ transformOrigin: '50% 55%' }}
          >
            <OffMarketLineMask
              src={BRAND_VIDEO_SRC}
              text={lineMarket}
              variant="market"
              {...VIDEO_PROPS}
            />
          </div>
        </div>
      </div>

      <div
        ref={captionRef}
        className="pointer-events-none absolute bottom-[8vh] left-1/2 z-30 w-full max-w-xl -translate-x-1/2 px-6 text-center"
      >
        <p className="font-editorial text-base font-light leading-relaxed text-stone-brand/90 md:text-lg">
          {tagline}
        </p>
      </div>
    </section>
  );
}
