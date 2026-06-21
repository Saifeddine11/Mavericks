import React, { useRef, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export interface GalleryItem {
  image: string;
  label?: string;
  subtitle?: string;
  tag?: string;
  ariaLabel?: string;
}

export interface ThreeDHoverGalleryProps {
  images?: string[];
  items?: GalleryItem[];
  itemWidth?: number;
  itemHeight?: number;
  gap?: number;
  perspective?: number;
  hoverScale?: number;
  transitionDuration?: number;
  backgroundColor?: string;
  grayscaleStrength?: number;
  brightnessLevel?: number;
  activeWidth?: number;
  rotationAngle?: number;
  zDepth?: number;
  enableKeyboardNavigation?: boolean;
  autoPlay?: boolean;
  autoPlayDelay?: number;
  className?: string;
  style?: React.CSSProperties;
  onImageClick?: (index: number, image: string) => void;
  onImageHover?: (index: number, image: string) => void;
  onImageFocus?: (index: number, image: string) => void;
}

const CARD_RADIUS = "1.25rem";

const ThreeDHoverGallery: React.FC<ThreeDHoverGalleryProps> = ({
  images,
  items,
  itemWidth = 12,
  itemHeight = 20,
  gap = 1.2,
  perspective = 50,
  hoverScale = 15,
  transitionDuration = 1.25,
  backgroundColor,
  grayscaleStrength = 1,
  brightnessLevel = 0.5,
  activeWidth = 45,
  rotationAngle = 35,
  zDepth = 10,
  enableKeyboardNavigation = true,
  autoPlay = false,
  autoPlayDelay = 3000,
  className,
  style,
  onImageClick,
  onImageHover,
  onImageFocus,
}) => {
  const defaultImages = [
    "https://images.pexels.com/photos/26797335/pexels-photo-26797335/free-photo-of-scenic-view-of-mountains.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    "https://images.pexels.com/photos/12194487/pexels-photo-12194487.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    "https://images.pexels.com/photos/32423809/pexels-photo-32423809/free-photo-of-aerial-view-of-kayaking-at-robberg-south-africa.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    "https://images.pexels.com/photos/32296519/pexels-photo-32296519/free-photo-of-rocky-coastline-of-cape-point-with-turquoise-waters.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    "https://images.pexels.com/photos/32396739/pexels-photo-32396739/free-photo-of-serene-motorcycle-ride-through-bamboo-grove.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    "https://images.pexels.com/photos/32304900/pexels-photo-32304900/free-photo-of-scenic-view-of-cape-town-s-twelve-apostles.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    "https://images.pexels.com/photos/32437034/pexels-photo-32437034/free-photo-of-fisherman-holding-freshly-caught-red-drum-fish.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    "https://images.pexels.com/photos/32469847/pexels-photo-32469847/free-photo-of-deer-drinking-from-natural-water-source-in-wilderness.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  ];

  const galleryItems: GalleryItem[] =
    items ?? (images ?? defaultImages).map((image) => ({ image }));

  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (autoPlay && galleryItems.length > 0) {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
      autoPlayRef.current = setInterval(() => {
        setActiveIndex((prev) => {
          const nextIndex = prev === null ? 0 : (prev + 1) % galleryItems.length;
          return nextIndex;
        });
      }, autoPlayDelay);

      return () => {
        if (autoPlayRef.current) {
          clearInterval(autoPlayRef.current);
        }
      };
    }
    if (!autoPlay && autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
      autoPlayRef.current = null;
    }
  }, [autoPlay, autoPlayDelay, galleryItems.length]);

  const handleImageClick = (index: number, image: string) => {
    setActiveIndex(activeIndex === index ? null : index);
    onImageClick?.(index, image);
  };

  const handleImageHover = (index: number, image: string) => {
    if (!autoPlay) {
      setActiveIndex(index);
    }
    onImageHover?.(index, image);
  };

  const handleImageLeave = () => {
    if (!autoPlay) {
      setActiveIndex(null);
    }
  };

  const handleImageFocus = (index: number, image: string) => {
    setFocusedIndex(index);
    onImageFocus?.(index, image);
  };

  const handleKeyDown = (event: React.KeyboardEvent, index: number) => {
    if (!enableKeyboardNavigation) return;

    switch (event.key) {
      case "Enter":
      case " ":
        event.preventDefault();
        handleImageClick(index, galleryItems[index].image);
        break;
      case "ArrowLeft": {
        event.preventDefault();
        const prevIndex = index > 0 ? index - 1 : galleryItems.length - 1;
        (containerRef.current?.children[prevIndex] as HTMLElement)?.focus();
        break;
      }
      case "ArrowRight": {
        event.preventDefault();
        const nextIndex = index < galleryItems.length - 1 ? index + 1 : 0;
        (containerRef.current?.children[nextIndex] as HTMLElement)?.focus();
        break;
      }
    }
  };

  const getShellStyle = (index: number): React.CSSProperties => {
    const isActive = activeIndex === index;
    const baseWidthPx = 10;
    const inactiveHeight = `calc(${itemHeight}vw + ${itemHeight}vh)`;
    const activeHeight = `calc(${itemHeight}vw + ${itemHeight}vh + 3rem)`;

    return {
      width: isActive
        ? `${activeWidth}vw`
        : `calc(${itemWidth}vw + ${baseWidthPx}px)`,
      height: isActive ? activeHeight : inactiveHeight,
      cursor: "pointer",
      transition: `width ${transitionDuration}s cubic-bezier(.1, .7, 0, 1), height ${transitionDuration}s cubic-bezier(.1, .7, 0, 1)`,
      willChange: "width, height",
      zIndex: isActive ? 100 : "auto",
      margin: isActive ? "0 0.45vw" : "0",
      borderRadius: CARD_RADIUS,
      overflow: "hidden",
      clipPath: `inset(0 round ${CARD_RADIUS})`,
      WebkitClipPath: `inset(0 round ${CARD_RADIUS})`,
      isolation: "isolate",
    };
  };

  const getTransformStyle = (index: number): React.CSSProperties => {
    const isActive = activeIndex === index;

    return {
      width: "100%",
      height: "100%",
      position: "relative",
      borderRadius: "inherit",
      overflow: "hidden",
      backfaceVisibility: "hidden",
      WebkitBackfaceVisibility: "hidden",
      transform: isActive
        ? `translateZ(calc(${hoverScale}vw + ${hoverScale}vh))`
        : "none",
      transition: `transform ${transitionDuration}s cubic-bezier(.1, .7, 0, 1)`,
      willChange: "transform",
      transformStyle: "preserve-3d",
    };
  };

  const getImageLayerStyle = (index: number): React.CSSProperties => {
    const isActive = activeIndex === index;
    const isFocused = focusedIndex === index;
    const entry = galleryItems[index];

    return {
      backgroundImage: `url(${entry.image})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundColor,
      borderRadius: "inherit",
      overflow: "hidden",
      backgroundClip: "padding-box",
      filter:
        isActive || isFocused
          ? "none"
          : `grayscale(${grayscaleStrength}) brightness(${brightnessLevel})`,
      transition: `filter 3s cubic-bezier(.1, .7, 0, 1)`,
    };
  };

  return (
    <div
      className={cn(
        "flex h-full min-h-full w-full items-center justify-center overflow-hidden bg-transparent",
        className,
      )}
      style={backgroundColor ? { backgroundColor, ...style } : style}
    >
      <div
        ref={containerRef}
        className="mx-auto flex w-full max-w-full items-center justify-center"
        style={{
          perspective: `calc(${perspective}vw + ${perspective}vh)`,
          gap: `${gap}rem`,
          transformStyle: "preserve-3d",
        }}
      >
        {galleryItems.map((entry, index) => {
          const isActive = activeIndex === index;
          const showCopy = Boolean(entry.label);

          return (
            <div
              key={`${entry.image}-${index}`}
              className="relative overflow-hidden shadow-lg outline-none will-change-[width,height] focus:outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-[rgba(184,138,90,0.55)] focus-visible:outline-offset-4 focus-visible:ring-0 focus-visible:ring-offset-0"
              style={getShellStyle(index)}
              tabIndex={enableKeyboardNavigation ? 0 : -1}
              onClick={() => handleImageClick(index, entry.image)}
              onMouseEnter={() => handleImageHover(index, entry.image)}
              onMouseLeave={handleImageLeave}
              onFocus={() => handleImageFocus(index, entry.image)}
              onBlur={() => setFocusedIndex(null)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              role="button"
              aria-label={
                entry.ariaLabel ?? `Image ${index + 1} of ${galleryItems.length}`
              }
              aria-pressed={isActive}
            >
              <div
                className="h-full w-full will-change-transform"
                style={getTransformStyle(index)}
              >
                <div
                  className="absolute inset-0 overflow-hidden rounded-[inherit]"
                  style={getImageLayerStyle(index)}
                  aria-hidden="true"
                />
                {showCopy ? (
                  <>
                    {isActive ? (
                      <>
                        <div
                          className="pointer-events-none absolute inset-y-0 right-0 z-[1] w-[58%] overflow-hidden rounded-[inherit]"
                          style={{
                            background:
                              "linear-gradient(to left, rgba(39,7,7,0.62), rgba(39,7,7,0.24), transparent)",
                          }}
                          aria-hidden="true"
                        />
                        <div
                          className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-[42%] overflow-hidden rounded-[inherit]"
                          style={{
                            background:
                              "linear-gradient(to top, rgba(39,7,7,0.55), rgba(39,7,7,0.16), transparent)",
                          }}
                          aria-hidden="true"
                        />
                        <div
                          className="pointer-events-none absolute z-10 text-left"
                          style={{
                            right: "clamp(1.5rem, 3vw, 3rem)",
                            bottom: "clamp(1.5rem, 4vh, 3rem)",
                            maxWidth: "clamp(20rem, 28vw, 26.25rem)",
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
                        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 overflow-hidden rounded-[inherit] p-4 md:p-5">
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
                  </>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ThreeDHoverGallery;
