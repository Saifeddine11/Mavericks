import clsx from 'clsx';

export default function GlassPopupButton({ label, onClick, reverse = false, className }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        'group inline-flex min-h-[44px] items-center gap-4 rounded-full border border-stone-brand/25',
        'bg-dark-red/35 px-2 py-2 transition-colors duration-300 hover:border-champagne/40 hover:bg-dark-red/50',
        reverse ? 'flex-row-reverse pl-6 pr-2' : 'pl-2 pr-6',
        className,
      )}
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-stone-brand/15 text-stone-brand transition-colors duration-300 group-hover:bg-champagne group-hover:text-dark-red">
        <svg width="12" height="12" viewBox="0 0 17 17" fill="none" aria-hidden="true">
          <path d="M8.76 1.75V15.78" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M15.78 8.77H1.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </span>
      <span className="font-label text-[11px] uppercase tracking-[0.14em] text-stone-brand">
        {label}
      </span>
    </button>
  );
}
