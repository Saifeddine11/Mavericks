/**
 * Single-line SVG video mask for OFF / MARKET stack.
 */

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { breakpoints } from '@/styles/tokens';

const FONT_FAMILY = 'Cormorant Garamond, Georgia, serif';
const FONT_WEIGHT = 800;

const METRICS = {
  off: {
    desktop: { viewBox: '0 0 1000 200', y: 108, size: 172, tracking: '-0.08em' },
    mobile: { viewBox: '0 0 1000 200', y: 110, size: 112, tracking: '-0.07em' },
  },
  market: {
    desktop: { viewBox: '0 0 1000 260', y: 142, size: 236, tracking: '-0.09em' },
    mobile: { viewBox: '0 0 1000 260', y: 144, size: 154, tracking: '-0.08em' },
  },
};

function buildLineMaskSvg({ text, metrics }) {
  const { viewBox, y, size, tracking } = metrics;

  return `<svg xmlns='http://www.w3.org/2000/svg' viewBox='${viewBox}' width='100%' height='100%' preserveAspectRatio='xMidYMid meet'>
    <text x='500' y='${y}' text-anchor='middle' dominant-baseline='middle'
      font-family='${FONT_FAMILY}' font-size='${size}' font-weight='${FONT_WEIGHT}'
      letter-spacing='${tracking}' fill='black'>${text}</text>
  </svg>`;
}

export default function OffMarketLineMask({
  src,
  text,
  variant = 'market',
  className,
  videoClassName = 'h-full w-full object-cover object-center',
  preload = 'auto',
  muted = true,
  loop = true,
  autoPlay = true,
  compact = false,
}) {
  const [svgMask, setSvgMask] = useState('');
  const [isCompact, setIsCompact] = useState(compact);

  useEffect(() => {
    if (compact) {
      setIsCompact(true);
      return undefined;
    }

    if (typeof window === 'undefined' || !window.matchMedia) return undefined;

    const mq = window.matchMedia(breakpoints.mobile);
    const update = () => setIsCompact(mq.matches);
    update();

    if (mq.addEventListener) {
      mq.addEventListener('change', update);
      return () => mq.removeEventListener('change', update);
    }

    mq.addListener(update);
    return () => mq.removeListener(update);
  }, [compact]);

  useEffect(() => {
    const lineMetrics = METRICS[variant] ?? METRICS.market;
    const metrics = isCompact ? lineMetrics.mobile : lineMetrics.desktop;
    setSvgMask(buildLineMaskSvg({ text, metrics }));
  }, [text, variant, isCompact]);

  if (!svgMask) {
    return (
      <div className={cn('relative size-full', className)}>
        <span className="sr-only">{text}</span>
      </div>
    );
  }

  const dataUrlMask = `url("data:image/svg+xml,${encodeURIComponent(svgMask)}")`;

  return (
    <div className={cn('relative size-full', className)}>
      <div
        className="absolute inset-0"
        style={{
          maskImage: dataUrlMask,
          WebkitMaskImage: dataUrlMask,
          maskSize: 'contain',
          WebkitMaskSize: 'contain',
          maskRepeat: 'no-repeat',
          WebkitMaskRepeat: 'no-repeat',
          maskPosition: 'center',
          WebkitMaskPosition: 'center',
        }}
      >
        <video
          className={videoClassName}
          autoPlay={autoPlay}
          muted={muted}
          loop={loop}
          preload={preload}
          playsInline
        >
          <source src={src} type="video/mp4" />
        </video>
      </div>
      <span className="sr-only">{text}</span>
    </div>
  );
}
