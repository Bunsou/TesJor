"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, CircleSmall } from "lucide-react";

interface ImageCarouselProps {
  images: string[];
  alt: string;
  onError?: () => void;
}

export function ImageCarousel({ images, alt, onError }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});

  // Auto-slide every 5 seconds if there are multiple images
  useEffect(() => {
    if (isPaused || images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((index) => {
        if (index === images.length - 1) return 0;
        return index + 1;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused, images.length]);

  if (images.length === 0) return null;

  const showNextImage = () => {
    setCurrentIndex((index) => {
      if (index === images.length - 1) return 0;
      return index + 1;
    });
  };

  const showPrevImage = () => {
    setCurrentIndex((index) => {
      if (index === 0) return images.length - 1;
      return index - 1;
    });
  };

  const handleImageError = (index: number) => {
    setImageErrors((prev) => ({ ...prev, [index]: true }));
    if (index === 0 && onError) {
      onError();
    }
  };

  return (
    <div
      className="w-full relative group rounded-xl md:rounded-2xl overflow-hidden shadow-sm aspect-[4/3] md:aspect-video lg:aspect-21/9 bg-gray-200 dark:bg-gray-800"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Images Container with slide animation */}
      <div className="w-full h-full flex overflow-hidden relative">
        {images.map((image, index) => (
          <div
            key={index}
            aria-hidden={currentIndex !== index}
            className="min-w-full h-full shrink-0 grow-0 relative transition-transform duration-300 ease-in-out"
            style={{ translate: `${-100 * currentIndex}%` }}
          >
            <Image
              src={image}
              alt={`${alt} - Image ${index + 1}`}
              fill
              className="object-cover"
              onError={() => handleImageError(index)}
              priority={index === 0}
            />
          </div>
        ))}
      </div>

      {/* Image counter badge */}
      {images.length > 1 && (
        <div className="absolute top-2 md:top-4 right-2 md:right-4 z-10">
          <span className="px-2 md:px-3 py-0.5 md:py-1 rounded-full bg-black/60 backdrop-blur-sm text-white text-xs md:text-sm font-medium">
            {currentIndex + 1} / {images.length}
          </span>
        </div>
      )}

      {/* Carousel Controls */}
      {images.length > 1 && (
        <>
          {/* Previous Button */}
          <button
            onClick={showPrevImage}
            className="absolute top-1/2 left-2 md:left-4 -translate-y-1/2 p-1.5 md:p-2 rounded-full bg-white/90 dark:bg-black/60 backdrop-blur-sm hover:bg-white dark:hover:bg-black/80 transition-all shadow-lg z-10 opacity-0 group-hover:opacity-100"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-gray-800 dark:text-white" />
          </button>

          {/* Next Button */}
          <button
            onClick={showNextImage}
            className="absolute top-1/2 right-2 md:right-4 -translate-y-1/2 p-1.5 md:p-2 rounded-full bg-white/90 dark:bg-black/60 backdrop-blur-sm hover:bg-white dark:hover:bg-black/80 transition-all shadow-lg z-10 opacity-0 group-hover:opacity-100"
            aria-label="Next image"
          >
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-gray-800 dark:text-white" />
          </button>

          {/* Dot Indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-0 z-10">
            {images.map((_, index) => (
              <button
                key={index}
                className="block cursor-pointer w-4 h-4 transition-transform duration-100 hover:scale-125 focus-visible:scale-125 focus-visible:outline-none"
                aria-label={`View image ${index + 1}`}
                onClick={() => setCurrentIndex(index)}
              >
                {index === currentIndex ? (
                  <CircleSmall
                    className="w-full h-full text-white/80 fill-white"
                    aria-hidden
                  />
                ) : (
                  <CircleSmall
                    className="w-full h-full text-white/50 hover:fill-white/80"
                    aria-hidden
                  />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
