/**
 * Unit tests for image utilities
 */

import { describe, it, expect, vi } from 'vitest';
import {
  generateWebPUrl,
  generateResponsiveImageUrls,
  generateImagePlaceholder,
  validateImageDimensions,
  optimizeImageForWeb,
  generateImageAltText,
  calculateImageAspectRatio,
  generateImageMetadata,
  compressImage,
  generateImageVariants,
  validateImageFormat,
  generateImageSrcSet,
  generateImageSizes,
  generateImagePreloadLinks,
  generateImageLazyLoadingData
} from '@/utils/imageUtils';

// Mock canvas for image processing
const mockCanvas = {
  getContext: vi.fn(() => ({
    drawImage: vi.fn(),
    getImageData: vi.fn(() => ({
      data: new Uint8ClampedArray(4)
    }))
  })),
  toDataURL: vi.fn(() => 'data:image/webp;base64,test'),
  width: 800,
  height: 600
};

// Mock Image constructor
global.Image = vi.fn(() => ({
  onload: null,
  onerror: null,
  src: '',
  width: 800,
  height: 600,
  naturalWidth: 800,
  naturalHeight: 600
})) as any;

// Mock HTMLCanvasElement
global.HTMLCanvasElement = vi.fn(() => mockCanvas) as any;

describe('imageUtils', () => {
  const mockImageUrl = '/images/test-image.jpg';
  const mockImageData = {
    url: '/images/test-image.jpg',
    width: 800,
    height: 600,
    format: 'jpeg'
  };

  describe('generateWebPUrl', () => {
    it('converts JPEG to WebP URL', () => {
      const webpUrl = generateWebPUrl(mockImageUrl);
      expect(webpUrl).toBe('/images/test-image.webp');
    });

    it('converts PNG to WebP URL', () => {
      const pngUrl = '/images/test-image.png';
      const webpUrl = generateWebPUrl(pngUrl);
      expect(webpUrl).toBe('/images/test-image.webp');
    });

    it('handles URLs without extension', () => {
      const urlWithoutExt = '/images/test-image';
      const webpUrl = generateWebPUrl(urlWithoutExt);
      expect(webpUrl).toBe('/images/test-image.webp');
    });

    it('handles URLs with query parameters', () => {
      const urlWithQuery = '/images/test-image.jpg?v=1';
      const webpUrl = generateWebPUrl(urlWithQuery);
      expect(webpUrl).toBe('/images/test-image.webp?v=1');
    });
  });

  describe('generateResponsiveImageUrls', () => {
    it('generates multiple image sizes', () => {
      const responsiveUrls = generateResponsiveImageUrls(mockImageUrl);
      expect(responsiveUrls).toHaveProperty('small');
      expect(responsiveUrls).toHaveProperty('medium');
      expect(responsiveUrls).toHaveProperty('large');
      expect(responsiveUrls).toHaveProperty('xlarge');
    });

    it('includes WebP variants', () => {
      const responsiveUrls = generateResponsiveImageUrls(mockImageUrl);
      expect(responsiveUrls.small.webp).toContain('.webp');
      expect(responsiveUrls.medium.webp).toContain('.webp');
      expect(responsiveUrls.large.webp).toContain('.webp');
    });

    it('includes original format variants', () => {
      const responsiveUrls = generateResponsiveImageUrls(mockImageUrl);
      expect(responsiveUrls.small.original).toContain('.jpg');
      expect(responsiveUrls.medium.original).toContain('.jpg');
      expect(responsiveUrls.large.original).toContain('.jpg');
    });
  });

  describe('generateImagePlaceholder', () => {
    it('generates placeholder with correct dimensions', () => {
      const placeholder = generateImagePlaceholder(800, 600);
      expect(placeholder.width).toBe(800);
      expect(placeholder.height).toBe(600);
      expect(placeholder.aspectRatio).toBe('4:3');
    });

    it('calculates aspect ratio correctly', () => {
      const placeholder = generateImagePlaceholder(1200, 800);
      expect(placeholder.aspectRatio).toBe('3:2');
    });

    it('handles square images', () => {
      const placeholder = generateImagePlaceholder(500, 500);
      expect(placeholder.aspectRatio).toBe('1:1');
    });

    it('handles portrait images', () => {
      const placeholder = generateImagePlaceholder(400, 600);
      expect(placeholder.aspectRatio).toBe('2:3');
    });
  });

  describe('validateImageDimensions', () => {
    it('validates correct dimensions', () => {
      const result = validateImageDimensions(800, 600);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('fails validation for zero dimensions', () => {
      const result = validateImageDimensions(0, 600);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Width must be greater than 0');
    });

    it('fails validation for negative dimensions', () => {
      const result = validateImageDimensions(-100, 600);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Width must be positive');
    });

    it('fails validation for too large dimensions', () => {
      const result = validateImageDimensions(10000, 10000);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Dimensions too large');
    });
  });

  describe('optimizeImageForWeb', () => {
    it('optimizes image data for web', async () => {
      const optimized = await optimizeImageForWeb(mockImageData);
      expect(optimized).toHaveProperty('webpUrl');
      expect(optimized).toHaveProperty('responsiveUrls');
      expect(optimized).toHaveProperty('placeholder');
    });

    it('includes compression settings', async () => {
      const optimized = await optimizeImageForWeb(mockImageData);
      expect(optimized).toHaveProperty('compression');
      expect(optimized.compression.quality).toBeLessThanOrEqual(85);
    });

    it('handles different image formats', async () => {
      const pngData = { ...mockImageData, format: 'png' };
      const optimized = await optimizeImageForWeb(pngData);
      expect(optimized).toBeTruthy();
    });
  });

  describe('generateImageAltText', () => {
    it('generates alt text from product data', () => {
      const productData = {
        name: 'Red Sal Wood',
        category: 'hardwood',
        specifications: {
          color: 'Reddish-brown',
          grainPattern: 'straight'
        }
      };
      const altText = generateImageAltText(productData, 'gallery');
      expect(altText).toContain('Red Sal Wood');
      expect(altText).toContain('hardwood');
    });

    it('includes context in alt text', () => {
      const productData = {
        name: 'Test Product',
        category: 'hardwood'
      };
      const altText = generateImageAltText(productData, 'hero');
      expect(altText).toContain('hero');
    });

    it('handles missing product data', () => {
      const altText = generateImageAltText({}, 'gallery');
      expect(altText).toBeTruthy();
      expect(altText.length).toBeGreaterThan(0);
    });
  });

  describe('calculateImageAspectRatio', () => {
    it('calculates 4:3 aspect ratio', () => {
      const ratio = calculateImageAspectRatio(800, 600);
      expect(ratio).toBe('4:3');
    });

    it('calculates 16:9 aspect ratio', () => {
      const ratio = calculateImageAspectRatio(1920, 1080);
      expect(ratio).toBe('16:9');
    });

    it('calculates 1:1 aspect ratio', () => {
      const ratio = calculateImageAspectRatio(500, 500);
      expect(ratio).toBe('1:1');
    });

    it('handles decimal aspect ratios', () => {
      const ratio = calculateImageAspectRatio(1000, 750);
      expect(ratio).toBe('4:3');
    });
  });

  describe('generateImageMetadata', () => {
    it('generates complete image metadata', () => {
      const metadata = generateImageMetadata(mockImageData, 'test-product');
      expect(metadata).toHaveProperty('generatedAt');
      expect(metadata).toHaveProperty('prompt');
      expect(metadata).toHaveProperty('optimized');
      expect(metadata).toHaveProperty('seoKeywords');
    });

    it('includes SEO keywords', () => {
      const metadata = generateImageMetadata(mockImageData, 'red-sal-wood');
      expect(metadata.seoKeywords).toContain('red sal wood');
      expect(metadata.seoKeywords).toContain('hardwood');
    });

    it('marks as optimized', () => {
      const metadata = generateImageMetadata(mockImageData, 'test-product');
      expect(metadata.optimized).toBe(true);
    });
  });

  describe('compressImage', () => {
    it('compresses image with quality settings', async () => {
      const compressed = await compressImage(mockImageData, 80);
      expect(compressed).toHaveProperty('quality');
      expect(compressed.quality).toBe(80);
    });

    it('handles different compression levels', async () => {
      const compressed = await compressImage(mockImageData, 60);
      expect(compressed.quality).toBe(60);
    });

    it('includes file size information', async () => {
      const compressed = await compressImage(mockImageData, 80);
      expect(compressed).toHaveProperty('fileSize');
    });
  });

  describe('generateImageVariants', () => {
    it('generates multiple image variants', () => {
      const variants = generateImageVariants(mockImageUrl);
      expect(variants).toHaveProperty('thumbnail');
      expect(variants).toHaveProperty('small');
      expect(variants).toHaveProperty('medium');
      expect(variants).toHaveProperty('large');
    });

    it('includes WebP variants', () => {
      const variants = generateImageVariants(mockImageUrl);
      expect(variants.thumbnail.webp).toContain('.webp');
      expect(variants.small.webp).toContain('.webp');
    });

    it('includes original format variants', () => {
      const variants = generateImageVariants(mockImageUrl);
      expect(variants.thumbnail.original).toContain('.jpg');
      expect(variants.small.original).toContain('.jpg');
    });
  });

  describe('validateImageFormat', () => {
    it('validates supported formats', () => {
      expect(validateImageFormat('jpeg')).toBe(true);
      expect(validateImageFormat('jpg')).toBe(true);
      expect(validateImageFormat('png')).toBe(true);
      expect(validateImageFormat('webp')).toBe(true);
    });

    it('rejects unsupported formats', () => {
      expect(validateImageFormat('gif')).toBe(false);
      expect(validateImageFormat('bmp')).toBe(false);
      expect(validateImageFormat('tiff')).toBe(false);
    });

    it('handles case insensitive formats', () => {
      expect(validateImageFormat('JPEG')).toBe(true);
      expect(validateImageFormat('PNG')).toBe(true);
    });
  });

  describe('generateImageSrcSet', () => {
    it('generates srcset for responsive images', () => {
      const srcset = generateImageSrcSet(mockImageUrl);
      expect(srcset).toContain('1x');
      expect(srcset).toContain('2x');
      expect(srcset).toContain('3x');
    });

    it('includes WebP variants', () => {
      const srcset = generateImageSrcSet(mockImageUrl);
      expect(srcset).toContain('.webp');
    });

    it('includes original format variants', () => {
      const srcset = generateImageSrcSet(mockImageUrl);
      expect(srcset).toContain('.jpg');
    });
  });

  describe('generateImageSizes', () => {
    it('generates sizes attribute for responsive images', () => {
      const sizes = generateImageSizes();
      expect(sizes).toContain('(max-width: 768px)');
      expect(sizes).toContain('(max-width: 1024px)');
      expect(sizes).toContain('100vw');
    });

    it('includes mobile breakpoints', () => {
      const sizes = generateImageSizes();
      expect(sizes).toContain('768px');
    });

    it('includes tablet breakpoints', () => {
      const sizes = generateImageSizes();
      expect(sizes).toContain('1024px');
    });
  });

  describe('generateImagePreloadLinks', () => {
    it('generates preload links for critical images', () => {
      const preloadLinks = generateImagePreloadLinks(mockImageUrl);
      expect(preloadLinks).toHaveProperty('webp');
      expect(preloadLinks).toHaveProperty('original');
    });

    it('includes correct media types', () => {
      const preloadLinks = generateImagePreloadLinks(mockImageUrl);
      expect(preloadLinks.webp.type).toBe('image/webp');
      expect(preloadLinks.original.type).toBe('image/jpeg');
    });

    it('includes fetchpriority', () => {
      const preloadLinks = generateImagePreloadLinks(mockImageUrl);
      expect(preloadLinks.webp.fetchpriority).toBe('high');
    });
  });

  describe('generateImageLazyLoadingData', () => {
    it('generates lazy loading data', () => {
      const lazyData = generateImageLazyLoadingData(mockImageUrl);
      expect(lazyData).toHaveProperty('src');
      expect(lazyData).toHaveProperty('srcset');
      expect(lazyData).toHaveProperty('sizes');
      expect(lazyData).toHaveProperty('loading');
    });

    it('sets loading to lazy', () => {
      const lazyData = generateImageLazyLoadingData(mockImageUrl);
      expect(lazyData.loading).toBe('lazy');
    });

    it('includes placeholder data', () => {
      const lazyData = generateImageLazyLoadingData(mockImageUrl);
      expect(lazyData).toHaveProperty('placeholder');
    });

    it('includes intersection observer data', () => {
      const lazyData = generateImageLazyLoadingData(mockImageUrl);
      expect(lazyData).toHaveProperty('intersectionObserver');
    });
  });
});

