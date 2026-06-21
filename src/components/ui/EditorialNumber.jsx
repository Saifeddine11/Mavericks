/**
 * EditorialNumber
 *
 * Renders a two-digit film-reel-style counter. Used by:
 *   - the ScrollCounter inside FloatingChrome ("01 / 06")
 *   - section eyebrow labels in shots that need a frame number
 *
 * Pure presentation. No animation; the parent controls visibility.
 *
 * Props
 *   index   — current number, 1-indexed.
 *   total   — denominator. If omitted, only `index` is rendered.
 *   pad     — zero-pad to N digits. Default: 2.
 *   className — applied to the root <span>.
 */

import clsx from 'clsx';

export default function EditorialNumber({
  index,
  total,
  pad = 2,
  className,
}) {
  const fmt = (n) => String(n).padStart(pad, '0');

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-2 font-sans uppercase tracking-widest',
        // Use tabular figures so digits don't shift width during transitions.
        'tabular-nums text-[11px]',
        className,
      )}
    >
      <span>{fmt(index)}</span>
      {total !== undefined && (
        <>
          <span aria-hidden="true" className="block h-px w-3 bg-current opacity-60" />
          <span className="opacity-60">{fmt(total)}</span>
        </>
      )}
    </span>
  );
}
