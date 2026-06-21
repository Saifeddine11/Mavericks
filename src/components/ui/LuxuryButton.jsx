/**
 * LuxuryButton
 *
 * The canonical CTA across the cinematic homepage. Composes:
 *   - MagneticButton (Phase 2) for cursor magnetism + reduced-motion fallback
 *   - a small visual system: hairline border, optional gold underline accent,
 *     two variants (filled / ghost), three sizes
 *
 * Used by:
 *   - FloatingChrome (the top-left MENU · ENQUIRE pill is two LuxuryButtons)
 *   - the Hero CTAs (EXPLORE / ENQUIRE)
 *   - PrivateAccessQuiet
 *   - EnquireCard submit
 *
 * Props
 *   children   — label text.
 *   as         — 'button' (default) | 'a'.
 *   variant    — 'ghost' (default — hairline border, transparent) |
 *                'filled' (navy fill, ivory text) |
 *                'underline' (no border, gold underline only)
 *   size       — 'sm' | 'md' (default) | 'lg'
 *   accent     — boolean. When true, a thin gold rule appears next to the
 *                label. Default: false.
 *   className  — extra classes on the outer element.
 *   ...rest    — forwarded (onClick, href, type, aria-*).
 */

import clsx from 'clsx';
import MagneticButton from '@/components/motion/MagneticButton';

const SIZES = {
  sm: 'px-4 py-2 text-[11px]',
  md: 'px-7 py-3.5 text-xs',
  lg: 'px-9 py-4 text-xs',
};

const VARIANTS = {
  ghost:
    'border border-navy/60 text-navy hover:bg-navy hover:text-ivory backdrop-blur-sm',
  filled:
    'border border-navy bg-navy text-ivory hover:bg-graphite',
  underline:
    'text-navy hover:text-graphite',
};

export default function LuxuryButton({
  children,
  as = 'button',
  variant = 'ghost',
  size = 'md',
  accent = false,
  className,
  strength = 0.22,
  ...rest
}) {
  return (
    <MagneticButton
      as={as}
      strength={strength}
      className={clsx(
        // Base — uppercase, wide tracking, refined transition timing.
        'group relative inline-flex items-center gap-3 uppercase tracking-widest',
        'transition-colors duration-600 ease-editorial',
        // No rounded-full or rounded pills here — we keep right angles to
        // match the editorial / architectural feel.
        'rounded-subtle',
        SIZES[size],
        VARIANTS[variant],
        className,
      )}
      {...rest}
    >
      <span>{children}</span>
      {accent && (
        <span
          aria-hidden="true"
          className={clsx(
            'block h-px w-6 transition-all duration-600 ease-editorial',
            variant === 'underline'
              ? 'bg-gold group-hover:w-10'
              : 'bg-current opacity-60 group-hover:opacity-100 group-hover:w-10',
          )}
        />
      )}
    </MagneticButton>
  );
}
