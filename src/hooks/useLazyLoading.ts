/**
 * Custom hook for lazy loading images and other content
 * Uses Intersection Observer API for efficient lazy loading
 */

import { useEffect, useRef, useState } from 'react';

interface UseLazyLoadingOptions {
  root?: Element | null;
  rootMargin?: string;
  threshold?: number | number[];
  triggerOnce?: boolean;
}

interface UseLazyLoadingReturn {
  ref: React.RefObject<HTMLElement>;
  isIntersecting: boolean;
  hasIntersected: boolean;
}

export const useLazyLoading = (
  options: UseLazyLoadingOptions = {}
): UseLazyLoadingReturn => {
  const {
    root = null,
    rootMargin = '50px',
    threshold = 0.1,
    triggerOnce = true
  } = options;

  const ref = useRef<HTMLElement>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isElementIntersecting = entry.isIntersecting;
        setIsIntersecting(isElementIntersecting);

        if (isElementIntersecting && !hasIntersected) {
          setHasIntersected(true);
        }

        // If triggerOnce is true, disconnect after first intersection
        if (triggerOnce && isElementIntersecting) {
          observer.disconnect();
        }
      },
      {
        root,
        rootMargin,
        threshold
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [root, rootMargin, threshold, triggerOnce, hasIntersected]);

  return {
    ref,
    isIntersecting,
    hasIntersected
  };
};

// Hook specifically for lazy loading images
export const useLazyImage = (
  src: string,
  options: UseLazyLoadingOptions = {}
) => {
  const { ref, hasIntersected } = useLazyLoading(options);
  const [imageSrc, setImageSrc] = useState<string>('');
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);

  useEffect(() => {
    if (hasIntersected && src) {
      setImageLoading(true);
      setImageError(false);

      const img = new Image();
      img.onload = () => {
        setImageSrc(src);
        setImageLoading(false);
      };
      img.onerror = () => {
        setImageError(true);
        setImageLoading(false);
      };
      img.src = src;
    }
  }, [hasIntersected, src]);

  return {
    ref,
    imageSrc,
    imageError,
    imageLoading,
    hasIntersected
  };
};

// Hook for lazy loading multiple images (like galleries)
export const useLazyImageGallery = (
  images: string[],
  options: UseLazyLoadingOptions = {}
) => {
  const { ref, hasIntersected } = useLazyLoading(options);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());
  const [loadingImages, setLoadingImages] = useState<Set<number>>(new Set());

  const loadImage = (index: number) => {
    if (loadedImages.has(index) || imageErrors.has(index) || loadingImages.has(index)) {
      return;
    }

    setLoadingImages(prev => new Set(prev).add(index));

    const img = new Image();
    img.onload = () => {
      setLoadedImages(prev => new Set(prev).add(index));
      setLoadingImages(prev => {
        const newSet = new Set(prev);
        newSet.delete(index);
        return newSet;
      });
    };
    img.onerror = () => {
      setImageErrors(prev => new Set(prev).add(index));
      setLoadingImages(prev => {
        const newSet = new Set(prev);
        newSet.delete(index);
        return newSet;
      });
    };
    img.src = images[index];
  };

  useEffect(() => {
    if (hasIntersected) {
      // Load first image immediately
      if (images.length > 0) {
        loadImage(0);
      }
    }
  }, [hasIntersected, images]);

  const loadNextImage = () => {
    const nextIndex = loadedImages.size;
    if (nextIndex < images.length) {
      loadImage(nextIndex);
    }
  };

  return {
    ref,
    loadedImages,
    imageErrors,
    loadingImages,
    hasIntersected,
    loadNextImage,
    isImageLoaded: (index: number) => loadedImages.has(index),
    isImageError: (index: number) => imageErrors.has(index),
    isImageLoading: (index: number) => loadingImages.has(index)
  };
};

export default useLazyLoading;

