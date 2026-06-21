import React, { useRef, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export interface GalleryItem {
  image: string;
  label?: string;
  subtitle?: string;
  tag?: string;
  ariaLabel?: string;
}

export type GalleryVariant = "default" | "editorial";

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
  variant?: GalleryVariant;
  defaultActiveIndex?: number | null;
}

const ThreeDHoverGallery: React.FC<ThreeDHoverGalleryProps> = ({
  images,
  items,
  itemWidth = 12, // Increased default for more width
  itemHeight = 20, // Increased default for more height
  gap = 1.2, // Increased default for more spacing between items
  perspective = 50, // Increased default for a stronger 3D effect
  hoverScale = 15, // Increased default for more pronounced hover scale
  transitionDuration = 1.25,
  backgroundColor,
  grayscaleStrength = 1,
  brightnessLevel = 0.5,
  activeWidth = 45, // Increased default for wider active item
  rotationAngle = 35,
  zDepth = 10, // Increased default for deeper Z-axis effect
  enableKeyboardNavigation = true,
  autoPlay = false,
  autoPlayDelay = 3000,
  className,
  style,
  onImageClick,
  onImageHover,
  onImageFocus,
  variant = "default",
  defaultActiveIndex = null,
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
    items ??
    (images ?? defaultImages).map((image) => ({ image }));

  const isEditorial = variant === "editorial";
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(
    defaultActiveIndex ?? null,
  );
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  // Effect for auto-play functionality
  useEffect(() => {
    if (autoPlay && galleryItems.length > 0) {
      // Clear any existing interval to prevent multiple intervals running
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
      autoPlayRef.current = setInterval(() => {
        setActiveIndex((prev) => {
          // Calculate the next index, looping back to the start if at the end
          const nextIndex = prev === null ? 0 : (prev + 1) % galleryItems.length;
          return nextIndex;
        });
      }, autoPlayDelay);

      // Cleanup function to clear the interval when the component unmounts or dependencies change
      return () => {
        if (autoPlayRef.current) {
          clearInterval(autoPlayRef.current);
        }
      };
    }
    // If autoPlay is false or no images, ensure interval is cleared
    if (!autoPlay && autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
      autoPlayRef.current = null;
    }
  }, [autoPlay, autoPlayDelay, galleryItems.length]);

  // Handler for image click event
  const handleImageClick = (index: number, image: string) => {
    if (isEditorial) {
      setActiveIndex(index);
    } else {
      setActiveIndex(activeIndex === index ? null : index);
    }
    onImageClick?.(index, image);
  };

  // Handler for image hover (mouse enter) event
  const handleImageHover = (index: number, image: string) => {
    // Only set active index on hover if autoPlay is not enabled
    if (!autoPlay) {
      setActiveIndex(index);
    }
    onImageHover?.(index, image); // Call optional onImageHover prop
  };

  // Handler for image leave (mouse leave) event
  const handleImageLeave = () => {
    if (!autoPlay) {
      setActiveIndex(
        isEditorial && defaultActiveIndex !== null && defaultActiveIndex !== undefined
          ? defaultActiveIndex
          : null,
      );
    }
  };

  // Handler for image focus event (e.g., via keyboard navigation)
  const handleImageFocus = (index: number, image: string) => {
    setFocusedIndex(index); // Set the focused index
    onImageFocus?.(index, image); // Call optional onImageFocus prop
  };

  // Handler for keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent, index: number) => {
    if (!enableKeyboardNavigation) return; // Exit if keyboard navigation is disabled

    switch (event.key) {
      case "Enter":
      case " ": // Space key
        event.preventDefault(); // Prevent default scroll behavior for space key
        handleImageClick(index, galleryItems[index].image);
        break;
      case "ArrowLeft":
        event.preventDefault(); // Prevent default scroll behavior
        // Calculate previous index, looping to the end if at the beginning
        const prevIndex = index > 0 ? index - 1 : galleryItems.length - 1;
        // Focus the previous element if it exists
        (containerRef.current?.children[prevIndex] as HTMLElement)?.focus();
        break;
      case "ArrowRight":
        event.preventDefault(); // Prevent default scroll behavior
        // Calculate next index, looping to the start if at the end
        const nextIndex = index < galleryItems.length - 1 ? index + 1 : 0;
        // Focus the next element if it exists
        (containerRef.current?.children[nextIndex] as HTMLElement)?.focus();
        break;
    }
  };

  const getContainerStyle = (index: number): React.CSSProperties => {
    const isActive = activeIndex === index;
    const baseWidthPx = 10;

    if (isEditorial) {
      return {
        cursor: "pointer",
        transform: isActive
          ? `translateZ(calc(${hoverScale * 0.65}vw + ${hoverScale * 0.65}vh))`
          : "none",
        transition: `transform ${transitionDuration}s cubic-bezier(.1, .7, 0, 1), box-shadow 0.6s ease, border-color 0.6s ease`,
        willChange: "transform",
        zIndex: isActive ? 100 : "auto",
        margin: isActive ? "0 0.35vw" : "0",
        outline:
          focusedIndex === index ? "2px solid rgba(184, 138, 90, 0.85)" : "none",
        outlineOffset: "3px",
      };
    }

    return {
      width: isActive
        ? `${activeWidth}vw`
        : `calc(${itemWidth}vw + ${baseWidthPx}px)`,
      height: `calc(${itemHeight}vw + ${itemHeight}vh)`,
      cursor: "pointer",
      transform: isActive
        ? `translateZ(calc(${hoverScale}vw + ${hoverScale}vh))`
        : "none",
      transition: `transform ${transitionDuration}s cubic-bezier(.1, .7, 0, 1), width ${transitionDuration}s cubic-bezier(.1, .7, 0, 1)`,
      willChange: "transform, width",
      zIndex: isActive ? 100 : "auto",
      margin: isActive ? "0 0.45vw" : "0",
      outline:
        focusedIndex === index ? "2px solid rgba(184, 138, 90, 0.85)" : "none",
      outlineOffset: "2px",
      borderRadius: "0.5rem",
    };
  };

  const getImageLayerStyle = (index: number): React.CSSProperties => {
    const isActive = activeIndex === index;
    const isFocused = focusedIndex === index;
    const entry = galleryItems[index];
    const isLit = isActive || isFocused;

    if (isEditorial) {
      return {
        backgroundImage: `url(${entry.image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundColor,
        filter: isLit
          ? "grayscale(0.15) brightness(0.88) contrast(1.05)"
          : "grayscale(1) brightness(0.62) contrast(1.05)",
        transition: "filter 0.65s cubic-bezier(0.22, 1, 0.36, 1)",
      };
    }

    return {
      backgroundImage: `url(${entry.image})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundColor,
      filter:
        isActive || isFocused
          ? "grayscale(0) brightness(1.08) sepia(0.1) saturate(1.05)"
          : `grayscale(${grayscaleStrength}) brightness(${brightnessLevel})`,
      transition: `filter 1.1s cubic-bezier(.1, .7, 0, 1)`,
    };
  };

  return (
    <div
      className={cn(
        "flex items-center justify-center w-full overflow-hidden bg-background",
        isEditorial ? "territories-gallery min-h-0 py-0" : "min-h-[550px]",
        className,
      )}
      style={backgroundColor ? { backgroundColor, ...style } : style}
    >
      <div
        ref={containerRef}
        className={cn(
          "flex w-full",
          isEditorial
            ? "territories-gallery__track items-stretch justify-start gap-4 px-5 pb-2 pt-2 md:justify-center md:gap-6 md:px-10 lg:px-14"
            : "items-center justify-center",
        )}
        style={
          isEditorial
            ? undefined
            : {
                perspective: `calc(${perspective}vw + ${perspective}vh)`,
                gap: `${gap}rem`,
              }
        }
      >
        {galleryItems.map((entry, index) => {
          const isActive = activeIndex === index;
          const isFocused = focusedIndex === index;
          const showCopy = Boolean(entry.label);

          return (
            <div
              key={`${entry.image}-${index}`}
              className={cn(
                "relative will-change-transform overflow-hidden",
                isEditorial
                  ? cn(
                      "territories-gallery__card shrink-0 rounded-xl border border-white/[0.08] shadow-[0_18px_50px_rgba(0,0,0,0.28)]",
                      isActive || isFocused
                        ? "territories-gallery__card--active border-champagne/35 shadow-[0_24px_70px_rgba(0,0,0,0.38)]"
                        : "border-white/[0.06]",
                    )
                  : "rounded-lg shadow-lg shadow-black/30",
              )}
              style={getContainerStyle(index)}
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
                className="absolute inset-0"
                style={getImageLayerStyle(index)}
                aria-hidden="true"
              />
              {showCopy && (
                <div
                  className={cn(
                    "pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-dark-red/92 via-dark-red/55 to-transparent px-3 pb-3 pt-10 transition-opacity duration-500 md:px-4 md:pb-4 md:pt-12",
                    isActive || isFocused ? "opacity-100" : "opacity-88",
                  )}
                >
                  <p className="font-label text-[9px] uppercase tracking-[0.24em] text-stone-brand md:text-[10px]">
                    {entry.label}
                  </p>
                  {entry.subtitle ? (
                    <p
                      className={cn(
                        "mt-1.5 font-body text-[10px] leading-snug transition-all duration-500 md:text-[11px]",
                        isActive || isFocused
                          ? "text-grey-orange opacity-100"
                          : "text-grey-orange/65 opacity-90",
                      )}
                    >
                      {entry.subtitle}
                    </p>
                  ) : null}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ThreeDHoverGallery;
