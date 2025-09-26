/**
 * ImageGallery Component
 * Optimized gallery with lazy loading, WebP support, and progressive loading
 */

import React, { useState, useCallback } from 'react';
import { useLazyImageGallery } from '@/hooks/useLazyLoading';
import LazyImage from '@/components/ui/LazyImage';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GalleryImage {
  webp?: string;
  jpg: string;
  alt: string;
  caption?: string;
}

interface ImageGalleryProps {
  images: GalleryImage[];
  className?: string;
  showThumbnails?: boolean;
  showCaptions?: boolean;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  maxThumbnails?: number;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({
  images,
  className,
  showThumbnails = true,
  showCaptions = true,
  autoPlay = false,
  autoPlayInterval = 5000,
  maxThumbnails = 6
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(autoPlay);

  const { ref, loadedImages, loadNextImage, isImageLoaded } = useLazyImageGallery(
    images.map(img => img.webp || img.jpg),
    { triggerOnce: true, rootMargin: '100px' }
  );

  const currentImage = images[currentIndex];

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  const goToImage = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(!isFullscreen);
  }, [isFullscreen]);

  const toggleAutoPlay = useCallback(() => {
    setIsAutoPlaying(!isAutoPlaying);
  }, [isAutoPlaying]);

  // Auto-play functionality
  React.useEffect(() => {
    if (isAutoPlaying && images.length > 1) {
      const interval = setInterval(() => {
        goToNext();
      }, autoPlayInterval);

      return () => clearInterval(interval);
    }
  }, [isAutoPlaying, goToNext, autoPlayInterval, images.length]);

  // Load next images progressively
  React.useEffect(() => {
    if (loadedImages.size < images.length) {
      loadNextImage();
    }
  }, [loadedImages.size, images.length, loadNextImage]);

  if (!images || images.length === 0) {
    return (
      <div className={cn('flex items-center justify-center bg-gray-100 rounded-lg', className)}>
        <div className="text-center text-gray-500">
          <ZoomIn className="w-12 h-12 mx-auto mb-2" />
          <p>No images available</p>
        </div>
      </div>
    );
  }

  const renderThumbnails = () => {
    if (!showThumbnails || images.length <= 1) return null;

    const visibleThumbnails = images.slice(0, maxThumbnails);
    const hasMore = images.length > maxThumbnails;

    return (
      <div className="flex gap-2 mt-4 overflow-x-auto">
        {visibleThumbnails.map((image, index) => (
          <button
            key={index}
            onClick={() => goToImage(index)}
            className={cn(
              'flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all',
              currentIndex === index
                ? 'border-blue-500 ring-2 ring-blue-200'
                : 'border-gray-200 hover:border-gray-300'
            )}
          >
            <LazyImage
              src={image.jpg}
              webpSrc={image.webp}
              alt={image.alt}
              className="w-full h-full object-cover"
              priority={index < 3} // Load first 3 thumbnails with priority
            />
          </button>
        ))}
        {hasMore && (
          <div className="flex-shrink-0 w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 text-xs">
            +{images.length - maxThumbnails}
          </div>
        )}
      </div>
    );
  };

  const renderMainImage = () => (
    <div className="relative group">
      <LazyImage
        ref={ref}
        src={currentImage.jpg}
        webpSrc={currentImage.webp}
        alt={currentImage.alt}
        className={cn(
          'w-full h-full object-cover rounded-lg transition-all duration-300',
          isFullscreen ? 'cursor-zoom-out' : 'cursor-zoom-in'
        )}
        priority={currentIndex < 2} // Load first 2 images with priority
        onLoad={() => {
          // Load next image when current loads
          if (currentIndex + 1 < images.length) {
            loadNextImage();
          }
        }}
      />
      
      {/* Overlay controls */}
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 rounded-lg">
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button
            variant="secondary"
            size="sm"
            onClick={toggleFullscreen}
            className="bg-white bg-opacity-90 hover:bg-opacity-100"
          >
            <ZoomIn className="w-4 h-4 mr-2" />
            {isFullscreen ? 'Exit' : 'Zoom'}
          </Button>
        </div>
      </div>

      {/* Navigation arrows */}
      {images.length > 1 && (
        <>
          <Button
            variant="secondary"
            size="sm"
            onClick={goToPrevious}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-90 hover:bg-opacity-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={goToNext}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-90 hover:bg-opacity-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </>
      )}

      {/* Image counter */}
      {images.length > 1 && (
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
          {currentIndex + 1} / {images.length}
        </div>
      )}
    </div>
  );

  const renderFullscreen = () => {
    if (!isFullscreen) return null;

    return (
      <div className="fixed inset-0 z-50 bg-black bg-opacity-95 flex items-center justify-center">
        <div className="relative w-full h-full flex items-center justify-center p-4">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsFullscreen(false)}
            className="absolute top-4 right-4 z-10 bg-white bg-opacity-90 hover:bg-opacity-100"
          >
            <X className="w-4 h-4" />
          </Button>

          <div className="max-w-7xl max-h-full">
            <LazyImage
              src={currentImage.jpg}
              webpSrc={currentImage.webp}
              alt={currentImage.alt}
              className="max-w-full max-h-full object-contain"
            />
          </div>

          {/* Fullscreen navigation */}
          {images.length > 1 && (
            <>
              <Button
                variant="secondary"
                size="sm"
                onClick={goToPrevious}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-90 hover:bg-opacity-100"
              >
                <ChevronLeft className="w-6 h-6" />
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={goToNext}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-90 hover:bg-opacity-100"
              >
                <ChevronRight className="w-6 h-6" />
              </Button>
            </>
          )}

          {/* Fullscreen image counter */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-70 text-white text-sm px-4 py-2 rounded">
              {currentIndex + 1} / {images.length}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={cn('relative', className)}>
      {renderMainImage()}
      
      {showCaptions && currentImage.caption && (
        <p className="text-sm text-gray-600 mt-2 text-center">
          {currentImage.caption}
        </p>
      )}
      
      {renderThumbnails()}
      {renderFullscreen()}
    </div>
  );
};

export default ImageGallery;

