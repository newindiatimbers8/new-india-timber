import React, { useState, useRef, useEffect } from 'react';
import { Product } from '@/types/product';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  X,
  Play,
  Pause
} from 'lucide-react';
import { LazyImageLoader, ImageZoom, ImageGallery } from '@/utils/imageUtils';

interface ProductImagesProps {
  product: Product;
  className?: string;
}

/**
 * ProductImages Component
 * Displays product images with gallery, zoom, and lazy loading functionality
 */
export const ProductImages: React.FC<ProductImagesProps> = ({
  product,
  className = ''
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  
  const lazyLoaderRef = useRef<LazyImageLoader | null>(null);
  const imageZoomRef = useRef<ImageZoom | null>(null);
  const galleryRef = useRef<ImageGallery | null>(null);
  const autoPlayIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize utilities
  useEffect(() => {
    lazyLoaderRef.current = new LazyImageLoader();
    imageZoomRef.current = new ImageZoom();
    
    const galleryImages = [
      product.images.hero,
      ...product.images.gallery
    ];
    galleryRef.current = new ImageGallery(galleryImages, setCurrentImageIndex);

    return () => {
      lazyLoaderRef.current?.disconnect();
      if (autoPlayIntervalRef.current) {
        clearInterval(autoPlayIntervalRef.current);
      }
    };
  }, [product]);

  // Auto-play functionality
  useEffect(() => {
    if (isAutoPlay && galleryRef.current) {
      autoPlayIntervalRef.current = setInterval(() => {
        galleryRef.current?.goToNext();
      }, 3000);
    } else if (autoPlayIntervalRef.current) {
      clearInterval(autoPlayIntervalRef.current);
    }

    return () => {
      if (autoPlayIntervalRef.current) {
        clearInterval(autoPlayIntervalRef.current);
      }
    };
  }, [isAutoPlay]);

  // Handle image load
  const handleImageLoad = (src: string) => {
    setLoadedImages(prev => new Set(prev).add(src));
  };

  // Handle image error
  const handleImageError = (src: string) => {
    console.error(`Failed to load image: ${src}`);
  };

  // Handle zoom toggle
  const handleZoomToggle = (img: HTMLImageElement) => {
    if (imageZoomRef.current) {
      imageZoomRef.current.toggleZoom(img);
      setIsZoomed(!isZoomed);
    }
  };

  // Handle fullscreen toggle
  const handleFullscreenToggle = () => {
    setIsFullscreen(!isFullscreen);
    setIsZoomed(false);
  };

  // Handle auto-play toggle
  const handleAutoPlayToggle = () => {
    setIsAutoPlay(!isAutoPlay);
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isFullscreen) return;

      switch (e.key) {
        case 'ArrowLeft':
          galleryRef.current?.goToPrevious();
          break;
        case 'ArrowRight':
          galleryRef.current?.goToNext();
          break;
        case 'Escape':
          setIsFullscreen(false);
          break;
        case ' ':
          e.preventDefault();
          handleAutoPlayToggle();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  // Get current image
  const currentImage = galleryRef.current?.getCurrentImage() || product.images.hero;
  const totalImages = galleryRef.current?.getTotalImages() || 1;

  return (
    <div className={`w-full ${className}`}>
      {/* Main Image Display */}
      <Card className="mb-4">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">
              Product Images
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleAutoPlayToggle}
                className="flex items-center space-x-1"
              >
                {isAutoPlay ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span className="hidden sm:inline">
                  {isAutoPlay ? 'Pause' : 'Auto'}
                </span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleFullscreenToggle}
                className="flex items-center space-x-1"
              >
                <ZoomIn className="w-4 h-4" />
                <span className="hidden sm:inline">Fullscreen</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative">
            {/* Main Image */}
            <div className="relative overflow-hidden rounded-lg bg-gray-100">
              <img
                src={currentImage.webp}
                alt={currentImage.alt}
                className={`w-full h-96 object-cover transition-all duration-300 ${
                  isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'
                }`}
                onLoad={() => handleImageLoad(currentImage.webp)}
                onError={() => handleImageError(currentImage.webp)}
                onClick={(e) => handleZoomToggle(e.currentTarget)}
                loading="lazy"
              />
              
              {/* Loading Overlay */}
              {!loadedImages.has(currentImage.webp) && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              )}
              
              {/* Image Counter */}
              <div className="absolute top-4 right-4">
                <Badge variant="secondary" className="bg-black/50 text-white">
                  {currentImageIndex + 1} / {totalImages}
                </Badge>
              </div>
              
              {/* Navigation Arrows */}
              {totalImages > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white hover:bg-black/70"
                    onClick={() => galleryRef.current?.goToPrevious()}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white hover:bg-black/70"
                    onClick={() => galleryRef.current?.goToNext()}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </>
              )}
            </div>
            
            {/* Image Caption */}
            {currentImage.caption && (
              <p className="mt-2 text-sm text-gray-600 text-center">
                {currentImage.caption}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Thumbnail Gallery */}
      {product.images.gallery.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">
              Gallery
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {/* Hero Image Thumbnail */}
              <div
                className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                  currentImageIndex === 0 
                    ? 'border-blue-500 ring-2 ring-blue-200' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => galleryRef.current?.goToIndex(0)}
              >
                <img
                  src={product.images.hero.webp}
                  alt={product.images.hero.alt}
                  className="w-full h-20 object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors" />
              </div>
              
              {/* Gallery Image Thumbnails */}
              {product.images.gallery.map((image, index) => (
                <div
                  key={index}
                  className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                    currentImageIndex === index + 1 
                      ? 'border-blue-500 ring-2 ring-blue-200' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => galleryRef.current?.goToIndex(index + 1)}
                >
                  <img
                    src={image.webp}
                    alt={image.alt}
                    className="w-full h-20 object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Detail Images */}
      {(product.images.details.grain || product.images.details.crossSection || product.images.details.applications.length > 0) && (
        <Card className="mt-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">
              Detail Views
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Grain Detail */}
              {product.images.details.grain && (
                <div className="space-y-2">
                  <img
                    src={product.images.details.grain.webp}
                    alt={product.images.details.grain.alt}
                    className="w-full h-32 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={(e) => handleZoomToggle(e.currentTarget)}
                    loading="lazy"
                  />
                  <p className="text-sm font-medium text-gray-900">Grain Detail</p>
                </div>
              )}
              
              {/* Cross Section */}
              {product.images.details.crossSection && (
                <div className="space-y-2">
                  <img
                    src={product.images.details.crossSection.webp}
                    alt={product.images.details.crossSection.alt}
                    className="w-full h-32 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={(e) => handleZoomToggle(e.currentTarget)}
                    loading="lazy"
                  />
                  <p className="text-sm font-medium text-gray-900">Cross Section</p>
                </div>
              )}
              
              {/* Application Images */}
              {product.images.details.applications.map((app, index) => (
                <div key={index} className="space-y-2">
                  <img
                    src={app.webp}
                    alt={app.alt}
                    className="w-full h-32 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={(e) => handleZoomToggle(e.currentTarget)}
                    loading="lazy"
                  />
                  <p className="text-sm font-medium text-gray-900">{app.caption}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center">
          <div className="relative w-full h-full flex items-center justify-center p-4">
            {/* Close Button */}
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-4 right-4 text-white hover:bg-white/20"
              onClick={() => setIsFullscreen(false)}
            >
              <X className="w-6 h-6" />
            </Button>
            
            {/* Fullscreen Image */}
            <div className="relative max-w-full max-h-full">
              <img
                src={currentImage.webp}
                alt={currentImage.alt}
                className="max-w-full max-h-full object-contain"
                onClick={(e) => handleZoomToggle(e.currentTarget)}
              />
              
              {/* Navigation in Fullscreen */}
              {totalImages > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20"
                    onClick={() => galleryRef.current?.goToPrevious()}
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20"
                    onClick={() => galleryRef.current?.goToNext()}
                  >
                    <ChevronRight className="w-6 h-6" />
                  </Button>
                </>
              )}
            </div>
            
            {/* Fullscreen Caption */}
            {currentImage.caption && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-center">
                <p className="text-sm bg-black/50 px-4 py-2 rounded-lg">
                  {currentImage.caption}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductImages;

