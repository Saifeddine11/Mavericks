/**
 * Investment territories — vertical tap-to-expand gallery (mobile).
 * Same active/inactive concept as desktop: clear active, grayscale inactive.
 */

import { useState } from 'react';

const CARD_RADIUS = '1.25rem';
const INACTIVE_HEIGHT = 290;
const ACTIVE_HEIGHT = 520;
const EASING = 'cubic-bezier(.1, .7, 0, 1)';
const TRANSITION_MS = 1250;

export default function TerritoriesMobileGallery({ items, backgroundColor }) {
  const [activeIndex, setActiveIndex] = useState(null);

  const handleTap = (index) => {
    setActiveIndex((current) => (current === index ? null : index));
  };

  return (
    <div className="mx-auto flex w-full flex-col items-center gap-4 py-2">
      {items.map((entry, index) => {
        const isActive = activeIndex === index;

        return (
          <button
            key={`${entry.image}-${index}`}
            type="button"
            className="relative w-[88vw] max-w-full overflow-hidden rounded-[1.25rem] shadow-lg outline-none transition-[height] duration-[1250ms] will-change-[height,filter] focus:outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-[rgba(184,138,90,0.55)] focus-visible:outline-offset-4 focus-visible:ring-0 focus-visible:ring-offset-0"
            style={{
              height: isActive ? ACTIVE_HEIGHT : INACTIVE_HEIGHT,
              transitionTimingFunction: EASING,
              borderRadius: CARD_RADIUS,
            }}
            onClick={() => handleTap(index)}
            aria-pressed={isActive}
            aria-label={entry.ariaLabel}
          >
            <div
              className="absolute inset-0 overflow-hidden rounded-[inherit] bg-cover bg-center"
              style={{
                backgroundImage: `url(${entry.image})`,
                backgroundColor,
                filter: isActive ? 'none' : 'grayscale(1) brightness(0.5)',
                transition: `filter ${TRANSITION_MS}ms ${EASING}`,
              }}
              aria-hidden="true"
            />
            {isActive ? (
              <>
                <div
                  className="pointer-events-none absolute inset-y-0 right-0 z-[1] w-[58%] overflow-hidden rounded-[inherit]"
                  style={{
                    background:
                      'linear-gradient(to left, rgba(39,7,7,0.62), rgba(39,7,7,0.24), transparent)',
                  }}
                  aria-hidden="true"
                />
                <div
                  className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-[42%] overflow-hidden rounded-[inherit]"
                  style={{
                    background:
                      'linear-gradient(to top, rgba(39,7,7,0.55), rgba(39,7,7,0.16), transparent)',
                  }}
                  aria-hidden="true"
                />
                <div
                  className="pointer-events-none absolute z-10 text-left"
                  style={{
                    right: '1.25rem',
                    bottom: '1.25rem',
                    maxWidth: 'min(18rem, 72vw)',
                  }}
                >
                  <p className="font-label text-[0.68rem] uppercase tracking-[0.22em] text-stone-brand">
                    {entry.label}
                  </p>
                  {entry.subtitle ? (
                    <p className="mt-2 font-body text-sm text-stone-brand/80">
                      {entry.subtitle}
                    </p>
                  ) : null}
                  {entry.tag ? (
                    <p className="mt-3 font-label text-[0.58rem] uppercase tracking-[0.18em] text-champagne">
                      {entry.tag}
                    </p>
                  ) : null}
                </div>
              </>
            ) : (
              <>
                <div
                  className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-1/2 overflow-hidden rounded-[inherit] bg-gradient-to-t from-dark-red/75 via-dark-red/30 to-transparent"
                  aria-hidden="true"
                />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 overflow-hidden rounded-[inherit] p-4">
                  <p className="font-label text-[0.68rem] uppercase tracking-[0.22em] text-stone-brand">
                    {entry.label}
                  </p>
                  {entry.subtitle ? (
                    <p className="mt-2 font-body text-sm text-stone-brand/80">
                      {entry.subtitle}
                    </p>
                  ) : null}
                  {entry.tag ? (
                    <p className="mt-3 font-label text-[0.58rem] uppercase tracking-[0.18em] text-champagne">
                      {entry.tag}
                    </p>
                  ) : null}
                </div>
              </>
            )}
          </button>
        );
      })}
    </div>
  );
}
