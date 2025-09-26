/**
 * Image Optimization Utilities
 * Comprehensive image handling and optimization for timber product pages
 */

import { Product, ImageVariant, GalleryImage, ApplicationImage } from '@/types/product';

/**
 * Image optimization configuration
 */
const IMAGE_CONFIG = {
  // Image sizes for different use cases
  sizes: {
    hero: { width: 800, height: 600 },
    gallery: { width: 600, height: 400 },
    thumbnail: { width: 200, height: 150 },
    detail: { width: 400, height: 300 },
    application: { width: 500, height: 350 }
  },
  
  // Quality settings
  quality: {
    webp: 85,
    jpeg: 90
  },
  
  // Lazy loading configuration
  lazyLoading: {
    rootMargin: '50px',
    threshold: 0.1
  },
  
  // Placeholder configuration
  placeholder: {
    backgroundColor: '#f3f4f6',
    textColor: '#6b7280',
    fontSize: '14px'
  }
};

/**
 * Image format support detection
 */
class ImageFormatSupport {
  private static webpSupported: boolean | null = null;
  private static avifSupported: boolean | null = null;

  /**
   * Detects WebP support
   */
  static async detectWebPSupport(): Promise<boolean> {
    if (this.webpSupported !== null) {
      return this.webpSupported;
    }

  return new Promise((resolve) => {
    const webP = new Image();
    webP.onload = webP.onerror = () => {
        this.webpSupported = webP.height === 2;
        resolve(this.webpSupported);
    };
    webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
  });
  }

  /**
   * Detects AVIF support
   */
  static async detectAVIFSupport(): Promise<boolean> {
    if (this.avifSupported !== null) {
      return this.avifSupported;
    }

    return new Promise((resolve) => {
      const avif = new Image();
      avif.onload = avif.onerror = () => {
        this.avifSupported = avif.height === 2;
        resolve(this.avifSupported);
      };
      avif.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAABcAAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAEAAAABAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQAMAAAAABNjb2xybmNseAACAAIABoAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAAB9tZGF0EgAKCBgABogQEAwgMgkfAAAAAAAAP0o=';
    });
  }

  /**
   * Gets the best supported image format
   */
  static async getBestFormat(): Promise<'avif' | 'webp' | 'jpeg'> {
    if (await this.detectAVIFSupport()) {
      return 'avif';
    }
    if (await this.detectWebPSupport()) {
      return 'webp';
    }
    return 'jpeg';
  }
}

/**
 * Image lazy loading utility
 */
class LazyImageLoader {
  private observer: IntersectionObserver | null = null;
  private loadedImages: Set<string> = new Set();

  constructor() {
    this.initObserver();
  }

  private initObserver(): void {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.loadImage(entry.target as HTMLImageElement);
            this.observer?.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: IMAGE_CONFIG.lazyLoading.rootMargin,
        threshold: IMAGE_CONFIG.lazyLoading.threshold
      }
    );
  }

  private async loadImage(img: HTMLImageElement): Promise<void> {
    const src = img.dataset.src;
    if (!src || this.loadedImages.has(src)) {
      return;
    }

    try {
      // Check for WebP support
      const webpSupported = await ImageFormatSupport.detectWebPSupport();
      const finalSrc = this.getOptimalImageSrc(src, webpSupported);
      
      img.src = finalSrc;
      img.classList.remove('lazy');
      img.classList.add('loaded');
      this.loadedImages.add(src);
    } catch (error) {
      console.error('Failed to load image:', error);
      img.classList.add('error');
    }
  }

  private getOptimalImageSrc(originalSrc: string, webpSupported: boolean): string {
    if (webpSupported && originalSrc.includes('.jpg')) {
      return originalSrc.replace('.jpg', '.webp');
    }
    return originalSrc;
  }

  public observe(img: HTMLImageElement): void {
    if (this.observer) {
      this.observer.observe(img);
    } else {
      // Fallback for browsers without IntersectionObserver
      this.loadImage(img);
    }
  }

  public unobserve(img: HTMLImageElement): void {
    if (this.observer) {
      this.observer.unobserve(img);
    }
  }

  public disconnect(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}

/**
 * Image optimization utility
 */
class ImageOptimizer {
  /**
   * Generates responsive image sources
   */
  static generateResponsiveSources(basePath: string, imageName: string): {
    webp: string[];
    jpeg: string[];
    sizes: string;
  } {
    const webpSources: string[] = [];
    const jpegSources: string[] = [];
    const sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw';

    // Generate different sizes
    const sizes_config = [
      { width: 400, suffix: '400w' },
      { width: 600, suffix: '600w' },
      { width: 800, suffix: '800w' },
      { width: 1200, suffix: '1200w' }
    ];

    sizes_config.forEach(({ width, suffix }) => {
      webpSources.push(`${basePath}/${imageName}-${suffix}.webp ${width}w`);
      jpegSources.push(`${basePath}/${imageName}-${suffix}.jpg ${width}w`);
    });

    return {
      webp: webpSources,
      jpeg: jpegSources,
      sizes
    };
  }

  /**
   * Generates image placeholder
   */
  static generatePlaceholder(width: number, height: number, text: string = ''): string {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      return '';
    }

    canvas.width = width;
    canvas.height = height;

    // Fill background
    ctx.fillStyle = IMAGE_CONFIG.placeholder.backgroundColor;
    ctx.fillRect(0, 0, width, height);

    // Add text if provided
    if (text) {
      ctx.fillStyle = IMAGE_CONFIG.placeholder.textColor;
      ctx.font = `${IMAGE_CONFIG.placeholder.fontSize} Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, width / 2, height / 2);
    }

    return canvas.toDataURL('image/jpeg', 0.1);
  }

  /**
   * Preloads critical images
   */
  static preloadImages(urls: string[]): void {
    urls.forEach(url => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = url;
      document.head.appendChild(link);
    });
  }

  /**
   * Generates image alt text
   */
  static generateAltText(product: Product, imageType: string, index?: number): string {
    const baseText = `${product.name} timber`;
    
    switch (imageType) {
      case 'hero':
        return `${baseText} sample showing ${product.specifications.color} color and ${product.specifications.grainPattern} grain pattern`;
      case 'gallery':
        return `${baseText} ${index ? `view ${index}` : 'detail view'} showing natural wood characteristics`;
      case 'grain':
        return `Close-up of ${baseText} grain pattern showing ${product.specifications.texture} texture`;
      case 'cross-section':
        return `Cross-section view of ${baseText} showing internal structure and density`;
      case 'application':
        return `${baseText} being used in ${product.applications.primary[0] || 'construction'} application`;
      default:
        return baseText;
    }
  }
}

/**
 * Image gallery utility
 */
class ImageGallery {
  private currentIndex: number = 0;
  private images: GalleryImage[] = [];
  private onImageChange?: (index: number) => void;

  constructor(images: GalleryImage[], onImageChange?: (index: number) => void) {
    this.images = images;
    this.onImageChange = onImageChange;
  }

  public getCurrentImage(): GalleryImage | null {
    return this.images[this.currentIndex] || null;
  }

  public getNextImage(): GalleryImage | null {
    const nextIndex = (this.currentIndex + 1) % this.images.length;
    return this.images[nextIndex] || null;
  }

  public getPreviousImage(): GalleryImage | null {
    const prevIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
    return this.images[prevIndex] || null;
  }

  public goToNext(): void {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
    this.onImageChange?.(this.currentIndex);
  }

  public goToPrevious(): void {
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
    this.onImageChange?.(this.currentIndex);
  }

  public goToIndex(index: number): void {
    if (index >= 0 && index < this.images.length) {
      this.currentIndex = index;
      this.onImageChange?.(this.currentIndex);
    }
  }

  public getTotalImages(): number {
    return this.images.length;
  }

  public getCurrentIndex(): number {
    return this.currentIndex;
  }
}

/**
 * Image zoom utility
 */
class ImageZoom {
  private isZoomed: boolean = false;
  private originalTransform: string = '';
  private zoomLevel: number = 2;

  public zoomIn(img: HTMLImageElement): void {
    if (this.isZoomed) return;

    this.originalTransform = img.style.transform;
    img.style.transform = `scale(${this.zoomLevel})`;
    img.style.cursor = 'zoom-out';
    img.style.transition = 'transform 0.3s ease';
    this.isZoomed = true;
  }

  public zoomOut(img: HTMLImageElement): void {
    if (!this.isZoomed) return;

    img.style.transform = this.originalTransform;
    img.style.cursor = 'zoom-in';
    this.isZoomed = false;
  }

  public toggleZoom(img: HTMLImageElement): void {
    if (this.isZoomed) {
      this.zoomOut(img);
    } else {
      this.zoomIn(img);
    }
  }

  public setZoomLevel(level: number): void {
    this.zoomLevel = Math.max(1, Math.min(5, level));
  }
}

/**
 * Image compression utility
 */
class ImageCompressor {
  /**
   * Compresses an image file
   */
  static async compressImage(
    file: File, 
    maxWidth: number = 800, 
    quality: number = 0.8
  ): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions
        let { width, height } = img;
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        // Draw and compress
        ctx?.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to compress image'));
            }
          },
          'image/jpeg',
          quality
        );
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  }

  /**
   * Converts image to WebP format
   */
  static async convertToWebP(file: File, quality: number = 0.8): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to convert to WebP'));
            }
          },
          'image/webp',
          quality
        );
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  }
}

/**
 * Image loading state manager
 */
class ImageLoadingState {
  private loadingStates: Map<string, 'loading' | 'loaded' | 'error'> = new Map();

  public setLoading(src: string): void {
    this.loadingStates.set(src, 'loading');
  }

  public setLoaded(src: string): void {
    this.loadingStates.set(src, 'loaded');
  }

  public setError(src: string): void {
    this.loadingStates.set(src, 'error');
  }

  public getState(src: string): 'loading' | 'loaded' | 'error' | undefined {
    return this.loadingStates.get(src);
  }

  public isLoading(src: string): boolean {
    return this.loadingStates.get(src) === 'loading';
  }

  public isLoaded(src: string): boolean {
    return this.loadingStates.get(src) === 'loaded';
  }

  public hasError(src: string): boolean {
    return this.loadingStates.get(src) === 'error';
  }
}

/**
 * Utility functions for image handling
 */
export const imageUtils = {
  /**
   * Gets the optimal image source based on browser support
   */
  async getOptimalImageSrc(webpSrc: string, jpegSrc: string): Promise<string> {
    const webpSupported = await ImageFormatSupport.detectWebPSupport();
    return webpSupported ? webpSrc : jpegSrc;
  },

  /**
   * Generates image dimensions for responsive loading
   */
  generateImageDimensions(width: number, height: number): {
    aspectRatio: number;
    sizes: string;
  } {
    const aspectRatio = width / height;
    const sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw';
    
    return { aspectRatio, sizes };
  },

  /**
   * Validates image URL
   */
  isValidImageUrl(url: string): boolean {
    try {
      new URL(url);
      return /\.(jpg|jpeg|png|webp|avif)$/i.test(url);
    } catch {
      return false;
    }
  },

  /**
   * Generates image fallback
   */
  generateFallback(product: Product): string {
    return `/images/products/${product.slug}/placeholder.jpg`;
  },

  /**
   * Calculates image loading priority
   */
  getImagePriority(imageType: string, index: number = 0): 'high' | 'low' {
    if (imageType === 'hero' || (imageType === 'gallery' && index === 0)) {
      return 'high';
    }
    return 'low';
  }
};

/**
 * Get placeholder image for a given category
 */
export function getPlaceholderImage(category: string): string {
  const categoryMap: Record<string, string> = {
    'teak': '/images/placeholder/teak-placeholder.jpg',
    'plywood': '/images/placeholder/plywood-placeholder.jpg',
    'hardwood': '/images/placeholder/hardwood-placeholder.jpg',
    'wood': '/images/placeholder/wood-placeholder.jpg',
    'default': '/images/placeholder/default-placeholder.jpg'
  };
  
  return categoryMap[category.toLowerCase()] || categoryMap.default;
}

/**
 * Handle image loading errors
 */
export function handleImageError(event: any, category: string = 'default'): void {
  if (event.target) {
    event.target.src = getPlaceholderImage(category);
    event.target.alt = `Placeholder image for ${category}`;
  }
}

// Export all utilities
export {
  IMAGE_CONFIG,
  ImageFormatSupport,
  LazyImageLoader,
  ImageOptimizer,
  ImageGallery,
  ImageZoom,
  ImageCompressor,
  ImageLoadingState
};