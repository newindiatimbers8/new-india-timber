/**
 * LazyImage Component
 * Optimized image component with lazy loading, WebP support, and fallbacks
 */

import React, { useState } from 'react';
import { useLazyImage } from '@/hooks/useLazyLoading';
import { cn } from '@/lib/utils';

interface LazyImageProps {
  src: string;
  webpSrc?: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  placeholder?: string;
  loading?: 'lazy' | 'eager';
  onLoad?: () => void;
  onError?: () => void;
  fallbackSrc?: string;
  priority?: boolean;
}

const LazyImage: React.FC<LazyImageProps> = ({
  src,
  webpSrc,
  alt,
  className,
  width,
  height,
  placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PC9zdmc+',
  loading = 'lazy',
  onLoad,
  onError,
  fallbackSrc,
  priority = false
}) => {
  const [imageError, setImageError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Use lazy loading unless priority is true
  const { ref, imageSrc, hasIntersected } = useLazyImage(
    priority ? src : '',
    {
      triggerOnce: true,
      rootMargin: '50px'
    }
  );

  // For priority images, load immediately
  const finalSrc = priority ? src : imageSrc;
  const shouldShowImage = priority || hasIntersected;

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setImageError(true);
    onError?.();
  };

  const getImageSrc = () => {
    if (imageError && fallbackSrc) {
      return fallbackSrc;
    }
    return finalSrc;
  };

  const getWebpSrc = () => {
    if (imageError && fallbackSrc) {
      return fallbackSrc;
    }
    return webpSrc || src;
  };

  if (!shouldShowImage) {
    return (
      <div
        ref={ref}
        className={cn(
          'bg-gray-100 animate-pulse flex items-center justify-center',
          className
        )}
        style={{ width, height }}
        aria-label={alt}
      >
        <div className="w-8 h-8 text-gray-400">
          <svg
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
    );
  }

  return (
    <picture className={cn('block', className)}>
      {/* WebP source for modern browsers */}
      {webpSrc && !imageError && (
        <source
          srcSet={getWebpSrc()}
          type="image/webp"
        />
      )}
      
      {/* Fallback image */}
      <img
        ref={ref}
        src={getImageSrc()}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          'transition-opacity duration-300',
          isLoaded ? 'opacity-100' : 'opacity-0',
          className
        )}
        style={{
          backgroundImage: `url(${placeholder})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />
    </picture>
  );
};

export default LazyImage;

