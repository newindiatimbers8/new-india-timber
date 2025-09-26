/**
 * Unit tests for SEO utilities
 */

import { describe, it, expect } from 'vitest';
import {
  generateMetaTitle,
  generateMetaDescription,
  generateKeywords,
  generateCanonicalUrl,
  generateOpenGraphData,
  generateTwitterCardData,
  generateStructuredData,
  validateSEOData,
  sanitizeSEOText,
  truncateText,
  extractKeywordsFromText,
  generateLocalSEOData,
  generateProductSchema
} from '@/utils/seoUtils';
import type { Product } from '@/types/product';

describe('seoUtils', () => {
  const mockProduct: Product = {
    id: 'red-sal-wood',
    name: 'Red Sal Wood',
    category: 'hardwood',
    grade: 'A',
    description: 'Premium hardwood timber with exceptional strength and durability',
    specifications: {
      density: { min: 800, max: 900 },
      grainPattern: 'straight',
      texture: 'coarse',
      color: 'Reddish-brown',
      workability: 'good',
      durability: 'excellent',
      moistureResistance: 'excellent',
      insectResistance: 'excellent'
    },
    applications: ['Construction', 'Furniture making', 'Flooring'],
    images: [],
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  };

  describe('generateMetaTitle', () => {
    it('generates title with product name and location', () => {
      const title = generateMetaTitle(mockProduct);
      expect(title).toContain('Red Sal Wood');
      expect(title).toContain('Bangalore');
      expect(title).toContain('New India Timbers');
    });

    it('respects character limit', () => {
      const title = generateMetaTitle(mockProduct);
      expect(title.length).toBeLessThanOrEqual(60);
    });

    it('handles missing product data gracefully', () => {
      const title = generateMetaTitle({} as Product);
      expect(title).toBeTruthy();
      expect(title.length).toBeGreaterThan(0);
    });

    it('includes category in title', () => {
      const title = generateMetaTitle(mockProduct);
      expect(title).toContain('Hardwood');
    });
  });

  describe('generateMetaDescription', () => {
    it('generates description with product details', () => {
      const description = generateMetaDescription(mockProduct);
      expect(description).toContain('Red Sal Wood');
      expect(description).toContain('Bangalore');
      expect(description).toContain('New India Timbers');
    });

    it('respects character limit', () => {
      const description = generateMetaDescription(mockProduct);
      expect(description.length).toBeLessThanOrEqual(160);
    });

    it('includes key features', () => {
      const description = generateMetaDescription(mockProduct);
      expect(description).toContain('premium');
    });

    it('handles missing product data gracefully', () => {
      const description = generateMetaDescription({} as Product);
      expect(description).toBeTruthy();
      expect(description.length).toBeGreaterThan(0);
    });
  });

  describe('generateKeywords', () => {
    it('generates relevant keywords', () => {
      const keywords = generateKeywords(mockProduct);
      expect(keywords).toContain('red sal wood');
      expect(keywords).toContain('hardwood');
      expect(keywords).toContain('bangalore');
      expect(keywords).toContain('timber');
    });

    it('includes category-specific keywords', () => {
      const keywords = generateKeywords(mockProduct);
      expect(keywords).toContain('construction timber');
    });

    it('includes application keywords', () => {
      const keywords = generateKeywords(mockProduct);
      expect(keywords).toContain('furniture making');
    });

    it('limits number of keywords', () => {
      const keywords = generateKeywords(mockProduct);
      expect(keywords.length).toBeLessThanOrEqual(10);
    });

    it('handles missing product data gracefully', () => {
      const keywords = generateKeywords({} as Product);
      expect(keywords).toBeTruthy();
      expect(keywords.length).toBeGreaterThan(0);
    });
  });

  describe('generateCanonicalUrl', () => {
    it('generates canonical URL with product ID', () => {
      const url = generateCanonicalUrl(mockProduct);
      expect(url).toContain('red-sal-wood');
      expect(url).toContain('newindiatimbers.com');
    });

    it('uses HTTPS protocol', () => {
      const url = generateCanonicalUrl(mockProduct);
      expect(url).toMatch(/^https:/);
    });

    it('handles missing product ID gracefully', () => {
      const url = generateCanonicalUrl({} as Product);
      expect(url).toBeTruthy();
      expect(url).toContain('newindiatimbers.com');
    });
  });

  describe('generateOpenGraphData', () => {
    it('generates complete Open Graph data', () => {
      const ogData = generateOpenGraphData(mockProduct);
      expect(ogData.title).toBeTruthy();
      expect(ogData.description).toBeTruthy();
      expect(ogData.type).toBe('product');
      expect(ogData.url).toBeTruthy();
    });

    it('includes product image if available', () => {
      const productWithImage = {
        ...mockProduct,
        images: [
          {
            id: 'img1',
            productId: 'red-sal-wood',
            url: '/images/red-sal-wood.jpg',
            altText: 'Red Sal Wood',
            context: 'hero',
            sequence: 1,
            dimensions: { width: 800, height: 600, aspectRatio: '4:3' },
            metadata: {
              generatedAt: '2024-01-01T00:00:00Z',
              prompt: 'Test',
              optimized: true,
              seoKeywords: ['test']
            },
            isActive: true
          }
        ]
      };
      const ogData = generateOpenGraphData(productWithImage);
      expect(ogData.image).toBeTruthy();
    });

    it('handles missing image gracefully', () => {
      const ogData = generateOpenGraphData(mockProduct);
      expect(ogData.image).toBeUndefined();
    });
  });

  describe('generateTwitterCardData', () => {
    it('generates Twitter card data', () => {
      const twitterData = generateTwitterCardData(mockProduct);
      expect(twitterData.card).toBe('summary_large_image');
      expect(twitterData.title).toBeTruthy();
      expect(twitterData.description).toBeTruthy();
    });

    it('includes image if available', () => {
      const productWithImage = {
        ...mockProduct,
        images: [
          {
            id: 'img1',
            productId: 'red-sal-wood',
            url: '/images/red-sal-wood.jpg',
            altText: 'Red Sal Wood',
            context: 'hero',
            sequence: 1,
            dimensions: { width: 800, height: 600, aspectRatio: '4:3' },
            metadata: {
              generatedAt: '2024-01-01T00:00:00Z',
              prompt: 'Test',
              optimized: true,
              seoKeywords: ['test']
            },
            isActive: true
          }
        ]
      };
      const twitterData = generateTwitterCardData(productWithImage);
      expect(twitterData.image).toBeTruthy();
    });
  });

  describe('generateStructuredData', () => {
    it('generates valid JSON-LD structured data', () => {
      const structuredData = generateStructuredData(mockProduct);
      expect(structuredData['@context']).toBe('https://schema.org');
      expect(structuredData['@type']).toBe('Product');
      expect(structuredData.name).toBe('Red Sal Wood');
    });

    it('includes product specifications', () => {
      const structuredData = generateStructuredData(mockProduct);
      expect(structuredData.description).toBeTruthy();
      expect(structuredData.category).toBeTruthy();
    });

    it('includes organization data', () => {
      const structuredData = generateStructuredData(mockProduct);
      expect(structuredData.brand).toBeTruthy();
      expect(structuredData.brand.name).toBe('New India Timbers');
    });

    it('includes local business data', () => {
      const structuredData = generateStructuredData(mockProduct);
      expect(structuredData.offers).toBeTruthy();
      expect(structuredData.offers.seller).toBeTruthy();
    });
  });

  describe('validateSEOData', () => {
    it('validates complete SEO data', () => {
      const seoData = {
        metaTitle: 'Red Sal Wood - Premium Hardwood | New India Timbers',
        metaDescription: 'Premium Red Sal Wood hardwood in Bangalore. 25+ years experience.',
        keywords: ['red sal wood', 'hardwood', 'bangalore', 'timber'],
        canonicalUrl: 'https://newindiatimbers.com/products/red-sal-wood'
      };
      const result = validateSEOData(seoData);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('fails validation for missing required fields', () => {
      const seoData = {
        metaDescription: 'Premium Red Sal Wood hardwood in Bangalore.',
        keywords: ['red sal wood', 'hardwood']
      };
      const result = validateSEOData(seoData as any);
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('fails validation for title too long', () => {
      const seoData = {
        metaTitle: 'A'.repeat(61),
        metaDescription: 'Premium Red Sal Wood hardwood in Bangalore.',
        keywords: ['red sal wood', 'hardwood'],
        canonicalUrl: 'https://newindiatimbers.com/products/red-sal-wood'
      };
      const result = validateSEOData(seoData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Meta title too long');
    });
  });

  describe('sanitizeSEOText', () => {
    it('removes HTML tags', () => {
      const text = '<p>Test <strong>bold</strong> text</p>';
      const sanitized = sanitizeSEOText(text);
      expect(sanitized).toBe('Test bold text');
    });

    it('removes special characters', () => {
      const text = 'Test@#$%^&*()text';
      const sanitized = sanitizeSEOText(text);
      expect(sanitized).toBe('Testtext');
    });

    it('trims whitespace', () => {
      const text = '  Test text  ';
      const sanitized = sanitizeSEOText(text);
      expect(sanitized).toBe('Test text');
    });

    it('handles empty string', () => {
      const sanitized = sanitizeSEOText('');
      expect(sanitized).toBe('');
    });
  });

  describe('truncateText', () => {
    it('truncates text to specified length', () => {
      const text = 'This is a very long text that should be truncated';
      const truncated = truncateText(text, 20);
      expect(truncated.length).toBeLessThanOrEqual(20);
      expect(truncated).toContain('...');
    });

    it('does not truncate short text', () => {
      const text = 'Short text';
      const truncated = truncateText(text, 20);
      expect(truncated).toBe('Short text');
    });

    it('handles empty string', () => {
      const truncated = truncateText('', 20);
      expect(truncated).toBe('');
    });
  });

  describe('extractKeywordsFromText', () => {
    it('extracts relevant keywords from text', () => {
      const text = 'Premium hardwood timber for construction and furniture making';
      const keywords = extractKeywordsFromText(text);
      expect(keywords).toContain('hardwood');
      expect(keywords).toContain('timber');
      expect(keywords).toContain('construction');
    });

    it('removes common stop words', () => {
      const text = 'This is a premium hardwood timber for construction';
      const keywords = extractKeywordsFromText(text);
      expect(keywords).not.toContain('this');
      expect(keywords).not.toContain('is');
      expect(keywords).not.toContain('a');
    });

    it('limits number of keywords', () => {
      const text = 'Premium hardwood timber for construction furniture making flooring decking';
      const keywords = extractKeywordsFromText(text, 3);
      expect(keywords.length).toBeLessThanOrEqual(3);
    });
  });

  describe('generateLocalSEOData', () => {
    it('generates local SEO data', () => {
      const localData = generateLocalSEOData(mockProduct);
      expect(localData.location).toBeTruthy();
      expect(localData.serviceArea).toBeTruthy();
      expect(localData.businessHours).toBeTruthy();
    });

    it('includes Bangalore location', () => {
      const localData = generateLocalSEOData(mockProduct);
      expect(localData.location.city).toBe('Bangalore');
      expect(localData.location.state).toBe('Karnataka');
    });

    it('includes service areas', () => {
      const localData = generateLocalSEOData(mockProduct);
      expect(localData.serviceArea).toContain('Bangalore');
      expect(localData.serviceArea).toContain('Karnataka');
    });
  });

  describe('generateProductSchema', () => {
    it('generates valid product schema', () => {
      const schema = generateProductSchema(mockProduct);
      expect(schema['@context']).toBe('https://schema.org');
      expect(schema['@type']).toBe('Product');
      expect(schema.name).toBe('Red Sal Wood');
    });

    it('includes product properties', () => {
      const schema = generateProductSchema(mockProduct);
      expect(schema.description).toBeTruthy();
      expect(schema.category).toBeTruthy();
      expect(schema.brand).toBeTruthy();
    });

    it('includes offers information', () => {
      const schema = generateProductSchema(mockProduct);
      expect(schema.offers).toBeTruthy();
      expect(schema.offers['@type']).toBe('Offer');
    });
  });
});

