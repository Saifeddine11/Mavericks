import clsx from 'clsx';

export default function VideoFallback({
  posterSrc,
  videoSrc,
  showMissingMessage = false,
  className,
}) {
  return (
    <>
      <div
        className={clsx(
          'absolute inset-0 z-0 bg-[radial-gradient(circle_at_50%_35%,rgba(184,138,90,0.34),rgba(39,7,7,0.92)_62%,#270707_100%)]',
          className,
        )}
        aria-hidden
      />
      <img
        src={posterSrc}
        alt=""
        className="absolute inset-0 z-0 h-full w-full object-cover opacity-75"
        aria-hidden
        decoding="async"
        fetchPriority="high"
      />
      {showMissingMessage ? (
        <p className="absolute left-4 top-24 z-30 max-w-[calc(100%-2rem)] border border-[#C49A6C]/70 bg-[#270707]/90 px-4 py-3 font-mono text-sm text-[#F1EBE5] backdrop-blur-sm">
          Video not found: {videoSrc}
        </p>
      ) : null}
    </>
  );
}
