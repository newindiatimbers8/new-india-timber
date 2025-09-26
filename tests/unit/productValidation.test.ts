/**
 * Unit tests for product validation utilities
 */

import { describe, it, expect } from 'vitest';
import {
  validateProduct,
  validateProductSpecifications,
  validateProductImages,
  validateProductPricing,
  validateProductSEO,
  validateProductApplications,
  sanitizeProductData,
  validateProductCategory,
  validateProductGrade,
  validateProductDimensions
} from '@/utils/productValidation';
import type { Product } from '@/types/product';

describe('productValidation', () => {
  const validProduct: Product = {
    id: 'test-product',
    name: 'Test Product',
    category: 'hardwood',
    grade: 'A',
    description: 'Test product description',
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
    applications: ['Furniture making', 'Construction'],
    images: [
      {
        id: 'img1',
        productId: 'test-product',
        url: '/images/test.jpg',
        altText: 'Test image',
        context: 'gallery',
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
    ],
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  };

  describe('validateProduct', () => {
    it('validates a complete product successfully', () => {
      const result = validateProduct(validProduct);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('fails validation for missing required fields', () => {
      const invalidProduct = { ...validProduct, name: '' };
      const result = validateProduct(invalidProduct);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Name is required');
    });

    it('fails validation for invalid category', () => {
      const invalidProduct = { ...validProduct, category: 'invalid-category' };
      const result = validateProduct(invalidProduct);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Invalid category');
    });

    it('fails validation for invalid grade', () => {
      const invalidProduct = { ...validProduct, grade: 'Z' };
      const result = validateProduct(invalidProduct);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Invalid grade');
    });

    it('fails validation for empty description', () => {
      const invalidProduct = { ...validProduct, description: '' };
      const result = validateProduct(invalidProduct);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Description is required');
    });
  });

  describe('validateProductSpecifications', () => {
    it('validates complete specifications', () => {
      const result = validateProductSpecifications(validProduct.specifications!);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('fails validation for missing density', () => {
      const invalidSpecs = { ...validProduct.specifications!, density: undefined };
      const result = validateProductSpecifications(invalidSpecs);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Density is required');
    });

    it('fails validation for invalid density range', () => {
      const invalidSpecs = {
        ...validProduct.specifications!,
        density: { min: 1000, max: 500 }
      };
      const result = validateProductSpecifications(invalidSpecs);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Invalid density range');
    });

    it('fails validation for invalid grain pattern', () => {
      const invalidSpecs = {
        ...validProduct.specifications!,
        grainPattern: 'invalid-pattern'
      };
      const result = validateProductSpecifications(invalidSpecs);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Invalid grain pattern');
    });
  });

  describe('validateProductImages', () => {
    it('validates complete image data', () => {
      const result = validateProductImages(validProduct.images);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('fails validation for missing image URL', () => {
      const invalidImages = [
        { ...validProduct.images[0], url: '' }
      ];
      const result = validateProductImages(invalidImages);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Image URL is required');
    });

    it('fails validation for missing alt text', () => {
      const invalidImages = [
        { ...validProduct.images[0], altText: '' }
      ];
      const result = validateProductImages(invalidImages);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Alt text is required');
    });

    it('fails validation for invalid image dimensions', () => {
      const invalidImages = [
        {
          ...validProduct.images[0],
          dimensions: { width: -100, height: 600, aspectRatio: '4:3' }
        }
      ];
      const result = validateProductImages(invalidImages);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Invalid image dimensions');
    });
  });

  describe('validateProductPricing', () => {
    it('validates complete pricing data', () => {
      const pricing = {
        type: 'quote_based' as const,
        displayText: 'Contact for Price',
        ctaButton: {
          text: 'Get Quote',
          action: 'contact',
          style: 'primary'
        },
        internalPricing: {
          basePrice: 1500,
          currency: 'INR',
          unit: 'cubic-foot'
        },
        isVisible: true
      };
      const result = validateProductPricing(pricing);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('fails validation for missing pricing type', () => {
      const invalidPricing = {
        displayText: 'Contact for Price',
        ctaButton: {
          text: 'Get Quote',
          action: 'contact',
          style: 'primary'
        },
        internalPricing: {
          basePrice: 1500,
          currency: 'INR',
          unit: 'cubic-foot'
        },
        isVisible: true
      };
      const result = validateProductPricing(invalidPricing as any);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Pricing type is required');
    });

    it('fails validation for invalid currency', () => {
      const invalidPricing = {
        type: 'quote_based' as const,
        displayText: 'Contact for Price',
        ctaButton: {
          text: 'Get Quote',
          action: 'contact',
          style: 'primary'
        },
        internalPricing: {
          basePrice: 1500,
          currency: 'INVALID',
          unit: 'cubic-foot'
        },
        isVisible: true
      };
      const result = validateProductPricing(invalidPricing);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Invalid currency');
    });
  });

  describe('validateProductSEO', () => {
    it('validates complete SEO data', () => {
      const seo = {
        metaTitle: 'Test Product - Premium Hardwood',
        metaDescription: 'Premium Test Product hardwood in Bangalore.',
        keywords: ['test', 'product', 'hardwood'],
        canonicalUrl: 'https://example.com/product'
      };
      const result = validateProductSEO(seo);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('fails validation for missing meta title', () => {
      const invalidSEO = {
        metaDescription: 'Premium Test Product hardwood in Bangalore.',
        keywords: ['test', 'product', 'hardwood'],
        canonicalUrl: 'https://example.com/product'
      };
      const result = validateProductSEO(invalidSEO as any);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Meta title is required');
    });

    it('fails validation for meta title too long', () => {
      const invalidSEO = {
        metaTitle: 'A'.repeat(61),
        metaDescription: 'Premium Test Product hardwood in Bangalore.',
        keywords: ['test', 'product', 'hardwood'],
        canonicalUrl: 'https://example.com/product'
      };
      const result = validateProductSEO(invalidSEO);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Meta title too long');
    });

    it('fails validation for meta description too long', () => {
      const invalidSEO = {
        metaTitle: 'Test Product',
        metaDescription: 'A'.repeat(161),
        keywords: ['test', 'product', 'hardwood'],
        canonicalUrl: 'https://example.com/product'
      };
      const result = validateProductSEO(invalidSEO);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Meta description too long');
    });
  });

  describe('validateProductApplications', () => {
    it('validates complete applications data', () => {
      const applications = ['Furniture making', 'Construction', 'Flooring'];
      const result = validateProductApplications(applications);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('fails validation for empty applications array', () => {
      const result = validateProductApplications([]);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('At least one application is required');
    });

    it('fails validation for empty application strings', () => {
      const result = validateProductApplications(['', 'Construction']);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Application cannot be empty');
    });
  });

  describe('sanitizeProductData', () => {
    it('sanitizes product data correctly', () => {
      const dirtyProduct = {
        ...validProduct,
        name: '  Test Product  ',
        description: 'Test product description with <script>alert("xss")</script>'
      };
      const result = sanitizeProductData(dirtyProduct);
      expect(result.name).toBe('Test Product');
      expect(result.description).not.toContain('<script>');
    });

    it('handles null and undefined values', () => {
      const dirtyProduct = {
        ...validProduct,
        name: null,
        description: undefined
      };
      const result = sanitizeProductData(dirtyProduct as any);
      expect(result.name).toBe('');
      expect(result.description).toBe('');
    });
  });

  describe('validateProductCategory', () => {
    it('validates valid categories', () => {
      expect(validateProductCategory('hardwood')).toBe(true);
      expect(validateProductCategory('teak')).toBe(true);
      expect(validateProductCategory('imported')).toBe(true);
    });

    it('rejects invalid categories', () => {
      expect(validateProductCategory('invalid')).toBe(false);
      expect(validateProductCategory('')).toBe(false);
      expect(validateProductCategory(null as any)).toBe(false);
    });
  });

  describe('validateProductGrade', () => {
    it('validates valid grades', () => {
      expect(validateProductGrade('A')).toBe(true);
      expect(validateProductGrade('B')).toBe(true);
      expect(validateProductGrade('C')).toBe(true);
    });

    it('rejects invalid grades', () => {
      expect(validateProductGrade('Z')).toBe(false);
      expect(validateProductGrade('')).toBe(false);
      expect(validateProductGrade(null as any)).toBe(false);
    });
  });

  describe('validateProductDimensions', () => {
    it('validates valid dimensions', () => {
      const dimensions = { length: 10, width: 5, height: 2, unit: 'feet' };
      const result = validateProductDimensions(dimensions);
      expect(result.isValid).toBe(true);
    });

    it('fails validation for negative dimensions', () => {
      const dimensions = { length: -10, width: 5, height: 2, unit: 'feet' };
      const result = validateProductDimensions(dimensions);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Dimensions must be positive');
    });

    it('fails validation for invalid unit', () => {
      const dimensions = { length: 10, width: 5, height: 2, unit: 'invalid' };
      const result = validateProductDimensions(dimensions);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Invalid unit');
    });
  });
});

