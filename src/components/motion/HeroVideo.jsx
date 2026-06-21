/**
 * HeroVideo
 *
 * Full-viewport cinematic video background for the homepage hero.
 *
 *   - Autoplay, muted, loop, playsinline (all browser autoplay constraints
 *     satisfied).
 *   - Poster image (`public/images/hero/…`) shows immediately at first paint
 *     and during metadata load.
 *   - Subtle Ken-Burns scale: 1.04 → 1.00 over 14 seconds, then holds.
 *     This is a second motion layer on top of the video's own motion,
 *     adding cinematic depth even with simple footage.
 *   - On `prefers-reduced-motion: reduce`, the <video> is omitted entirely
 *     and the poster image is shown as a still frame. No autoplay surprises
 *     for users who explicitly opted out.
 *   - A warm vignette overlay sits above the video to ensure the headline
 *     remains legible regardless of the underlying frame.
 *
 * The video element references files in `public/videos/` — replacing
 * footage is a one-file swap. See `public/videos/README.md`.
 */

import { motion, useReducedMotion } from 'framer-motion';
import { easings } from '@/styles/tokens';
import { getMediaSrc } from '@/lib/media';

const VIDEO_SRC = '/videos/hero-placeholder.mp4';
const POSTER_SRC = getMediaSrc('hero');

export default function HeroVideo({ className, posterAlt = '' }) {
  const reduce = useReducedMotion();

  return (
    <div className={['absolute inset-0 overflow-hidden bg-ivory', className].filter(Boolean).join(' ')}>
      {/* The image-or-video plate, with a slow Ken-Burns scale-in. */}
      <motion.div
        className="absolute inset-0"
        initial={{ scale: reduce ? 1 : 1.04 }}
        animate={{
          scale: 1,
          transition: { duration: reduce ? 0 : 14, ease: easings.editorial },
        }}
        style={{ willChange: 'transform' }}
      >
        {reduce ? (
          // Reduced motion: just the poster. No motion, no autoplay.
          <img
            src={POSTER_SRC}
            alt={posterAlt}
            aria-hidden={!posterAlt}
            decoding="async"
            fetchPriority="high"
            sizes="100vw"
            className="h-full w-full object-cover"
          />
        ) : (
          <video
            // Markup that satisfies every modern browser's autoplay policy.
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={POSTER_SRC}
            // `disablePictureInPicture` and `disableRemotePlayback` keep the
            // background film unobtrusive — users can't accidentally pop it
            // into PiP and treat it as content.
            disablePictureInPicture
            controlsList="nodownload noremoteplayback"
            aria-hidden="true"
            className="h-full w-full object-cover"
          >
            <source src={VIDEO_SRC} type="video/mp4" />
            {/* If the browser can't play any source, the poster shows. */}
          </video>
        )}
      </motion.div>

      {/* Warm vignette — keeps the centered headline legible regardless
          of underlying frame. Uses pseudo-painted gradients on top of the
          video; never harsh. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(245, 241, 232, 0) 30%, rgba(245, 241, 232, 0.35) 100%), ' +
            'linear-gradient(180deg, rgba(245, 241, 232, 0.0) 0%, rgba(245, 241, 232, 0.0) 60%, rgba(232, 225, 212, 0.4) 100%)',
        }}
      />
    </div>
  );
}
