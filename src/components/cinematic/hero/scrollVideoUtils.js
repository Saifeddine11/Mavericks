import { ScrollTrigger } from '@/lib/gsap';

const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));

/** Direct 1:1 mapping — scroll progress equals video progress. */
export function mapProgressToVideo(progress) {
  return clamp(progress);
}

const SEEK_EPSILON = 0.02;

/**
 * Safe scroll-driven video scrubber — refs only, rAF-throttled seeks.
 * @param {HTMLVideoElement | null} video
 */
export function createVideoScrubController(video) {
  if (!video) {
    return { setProgress: () => {}, destroy: () => {} };
  }

  let durationReady = false;
  let rafId = 0;
  let targetTime = 0;

  const refreshIfReady = () => {
    durationReady = Number.isFinite(video.duration) && video.duration > 0;
    if (durationReady) ScrollTrigger.refresh();
  };

  const onLoadedMetadata = () => refreshIfReady();
  const onLoadedData = () => refreshIfReady();

  video.addEventListener('loadedmetadata', onLoadedMetadata);
  video.addEventListener('loadeddata', onLoadedData);
  video.load();

  const setProgress = (scrollProgress) => {
    if (!durationReady) return;

    targetTime = mapProgressToVideo(scrollProgress) * video.duration;

    cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => {
      if (Math.abs(video.currentTime - targetTime) < SEEK_EPSILON) return;

      try {
        video.currentTime = targetTime;
      } catch {
        /* Transient seek errors while buffering on mobile Safari. */
      }
    });
  };

  const destroy = () => {
    cancelAnimationFrame(rafId);
    video.removeEventListener('loadedmetadata', onLoadedMetadata);
    video.removeEventListener('loadeddata', onLoadedData);
  };

  return { setProgress, destroy };
}

/** GSAP-friendly chapter crossfade — blur is transitional only. */
export function crossfadeChapter(tl, fromEl, toEl, at) {
  if (fromEl) {
    tl.to(
      fromEl,
      { opacity: 0, y: -12, filter: 'blur(8px)', ease: 'none', duration: 0.1 },
      at,
    );
  }
  if (toEl) {
    tl.fromTo(
      toEl,
      { opacity: 0, y: 16, filter: 'blur(10px)' },
      { opacity: 1, y: 0, filter: 'blur(0px)', ease: 'none', duration: 0.1 },
      at,
    );
  }
}

export function lockChapterClean(tl, el, label) {
  if (!el) return;
  tl.set(el, { opacity: 1, y: 0, filter: 'blur(0px)' }, label);
}
