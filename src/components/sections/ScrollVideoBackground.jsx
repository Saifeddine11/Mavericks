import { useCallback, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import VideoFallback from './VideoFallback';

const isDev = import.meta.env.DEV;
const SEEK_EPSILON = 0.035;

export default function ScrollVideoBackground({
  progress,
  videoSrc,
  posterSrc,
  enabled = true,
}) {
  const videoRef = useRef(null);
  const frameRef = useRef(0);
  const lastTimeRef = useRef(-1);
  const [duration, setDuration] = useState(0);
  const [videoFailed, setVideoFailed] = useState(false);

  const handleLoadedMetadata = useCallback((event) => {
    const video = event.currentTarget;
    const nextDuration = Number.isFinite(video.duration) ? video.duration : 0;

    setDuration(nextDuration);
    setVideoFailed(false);

    try {
      video.currentTime = 0;
      lastTimeRef.current = 0;
    } catch {
      /* Some browsers reject early seeks until the first frame is ready. */
    }
  }, []);

  const handleError = useCallback(() => {
    setVideoFailed(true);
    setDuration(0);

    if (isDev) {
      // eslint-disable-next-line no-console
      console.warn(`Video not found: ${videoSrc}`);
    }
  }, [videoSrc]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !enabled || videoFailed || duration <= 0) return undefined;

    if (frameRef.current) window.cancelAnimationFrame(frameRef.current);

    frameRef.current = window.requestAnimationFrame(() => {
      frameRef.current = 0;

      const targetTime = Math.min(duration, Math.max(0, progress * duration));
      if (Math.abs(targetTime - lastTimeRef.current) < SEEK_EPSILON) return;

      try {
        video.currentTime = targetTime;
        lastTimeRef.current = targetTime;
      } catch {
        /* Ignore transient seek errors while the browser buffers metadata. */
      }
    });

    return () => {
      if (frameRef.current) {
        window.cancelAnimationFrame(frameRef.current);
        frameRef.current = 0;
      }
    };
  }, [duration, enabled, progress, videoFailed]);

  return (
    <>
      <VideoFallback
        posterSrc={posterSrc}
        videoSrc={videoSrc}
        showMissingMessage={isDev && videoFailed}
      />
      {enabled ? (
        <video
          ref={videoRef}
          className={clsx(
            'absolute inset-0 z-0 h-full w-full object-cover',
            videoFailed && 'opacity-0',
          )}
          src={videoSrc}
          poster={posterSrc}
          muted
          playsInline
          preload="metadata"
          onLoadedMetadata={handleLoadedMetadata}
          onError={handleError}
          aria-hidden
          tabIndex={-1}
        />
      ) : null}
    </>
  );
}
