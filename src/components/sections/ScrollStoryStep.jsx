import clsx from 'clsx';

function clamp(value, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function stepPresence(progress, start, end, { isFirst = false, isLast = false } = {}) {
  const length = end - start;
  const local = clamp((progress - start) / length);
  const fadeIn = isFirst ? 1 : clamp(local / 0.22);
  const fadeOut = isLast ? 1 : clamp((1 - local) / 0.22);

  return {
    opacity: Math.min(fadeIn, fadeOut),
    y: -28 * local + 14 * (1 - fadeIn),
  };
}

export default function ScrollStoryStep({
  eyebrow,
  title,
  body,
  index,
  start,
  end,
  progress,
  active = true,
  isLast = false,
}) {
  const Heading = index === 0 ? 'h1' : 'h2';
  const presence = active
    ? stepPresence(progress, start, end, { isFirst: index === 0, isLast })
    : { opacity: 1, y: 0 };

  return (
    <article
      className={clsx(
        active
          ? 'absolute inset-x-0 top-1/2 mx-auto max-w-4xl -translate-y-1/2 px-6 text-center'
          : 'relative mx-auto max-w-3xl px-6 py-12 text-center',
      )}
      style={
        active
          ? {
              opacity: presence.opacity,
              transform: `translate3d(0, calc(-50% + ${presence.y}px), 0)`,
              pointerEvents: presence.opacity > 0.5 ? 'auto' : 'none',
            }
          : undefined
      }
      aria-hidden={active && presence.opacity < 0.05 ? true : undefined}
    >
      <p className="mb-5 text-[0.68rem] uppercase tracking-[0.34em] text-[#C49A6C] md:text-xs">
        {eyebrow}
      </p>
      <Heading className="mx-auto max-w-5xl font-serif text-[clamp(2.4rem,7vw,6.8rem)] font-light leading-[0.95] tracking-normal text-[#F1EBE5]">
        {title}
      </Heading>
      <div className="mx-auto mt-7 h-px w-20 bg-[#B88A5A]" aria-hidden />
      <p className="mx-auto mt-7 max-w-2xl text-base leading-relaxed text-[#F1EBE5]/85 md:text-xl">
        {body}
      </p>
    </article>
  );
}
