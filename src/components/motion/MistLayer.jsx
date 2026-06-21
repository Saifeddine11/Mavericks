/**
 * MistLayer
 *
 * Slowly-drifting SVG mist that adds atmospheric depth to "void" sections
 * (Dream Statement, Private Access). Two large soft-edged radial blobs
 * float independently on a 90-second loop — slow enough that the motion is
 * barely perceptible frame-to-frame, fast enough that the page never feels
 * static.
 *
 * Implementation: pure CSS animations driven by `animationDelay` so the
 * two blobs are out of phase. No JS animation loop, no ScrollTrigger —
 * minimal cost.
 *
 * Reduced motion: blobs render static at their resting position. The
 * atmosphere remains; only the drift stops.
 *
 * Props
 *   tone       — 'mist' (default, pale near-white) | 'warm' (sand-tinted)
 *   intensity  — 0..1, opacity multiplier. Default: 1.
 *   className  — applied to the root absolute layer.
 */

import clsx from 'clsx';

export default function MistLayer({
  tone = 'mist',
  intensity = 1,
  className,
}) {
  // Two color schemes. `mist` is the bright/airy void (Dream Statement).
  // `warm` adds a sand undertone (Private Access — slightly grounded).
  const palette = tone === 'warm'
    ? { a: '#F5F1E8', b: '#E8E1D4' }
    : { a: '#FFFFFF', b: '#FAF7EF' };

  // Inline keyframes — scoped to this component via unique animation names.
  // Two motions, out of phase, both 90s, both transform-only.
  const css = `
    @keyframes mavericks-mist-a {
      0%, 100% { transform: translate3d(-4%, -2%, 0) scale(1.05); }
      50%      { transform: translate3d(4%, 3%, 0) scale(1.1); }
    }
    @keyframes mavericks-mist-b {
      0%, 100% { transform: translate3d(3%, 2%, 0) scale(1); }
      50%      { transform: translate3d(-3%, -2%, 0) scale(1.08); }
    }
    @media (prefers-reduced-motion: reduce) {
      .mavericks-mist-blob-a, .mavericks-mist-blob-b {
        animation: none !important;
      }
    }
  `;

  return (
    <div
      aria-hidden="true"
      className={clsx('pointer-events-none absolute inset-0 overflow-hidden', className)}
      style={{ opacity: intensity }}
    >
      <style>{css}</style>

      {/* Blob A — upper-left, larger */}
      <div
        className="mavericks-mist-blob-a absolute"
        style={{
          left: '-15%',
          top: '-20%',
          width: '85%',
          height: '90%',
          background: `radial-gradient(ellipse at 35% 40%, ${palette.a} 0%, ${palette.a}00 65%)`,
          filter: 'blur(40px)',
          animation: 'mavericks-mist-a 90s ease-in-out infinite',
          willChange: 'transform',
        }}
      />

      {/* Blob B — lower-right, smaller, different palette stop */}
      <div
        className="mavericks-mist-blob-b absolute"
        style={{
          right: '-10%',
          bottom: '-15%',
          width: '70%',
          height: '75%',
          background: `radial-gradient(ellipse at 60% 60%, ${palette.b} 0%, ${palette.b}00 70%)`,
          filter: 'blur(50px)',
          animation: 'mavericks-mist-b 90s ease-in-out infinite',
          willChange: 'transform',
        }}
      />
    </div>
  );
}
