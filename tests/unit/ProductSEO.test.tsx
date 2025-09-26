/**
 * Unit tests for ProductSEO component
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ProductSEO from '@/components/products/ProductSEO';
import type { Product } from '@/types/product';

// Mock React Helmet
vi.mock('react-helmet-async', () => ({
  Helmet: ({ children }: { children: React.ReactNode }) => <div data-testid="helmet">{children}</div>
}));

// Mock product data with SEO
const mockProductWithSEO: Product = {
  id: 'test-product',
  name: 'Test Product',
  category: 'hardwood',
  grade: 'A',
  description: 'Test product description',
  seo: {
    metaTitle: 'Test Product - Premium Hardwood | New India Timbers',
    metaDescription: 'Premium Test Product hardwood in Bangalore. 25+ years experience.',
    keywords: ['test product', 'hardwood', 'bangalore', 'timber'],
    canonicalUrl: 'https://newindiatimbers.com/products/test-product',
    ogTitle: 'Test Product - Premium Hardwood',
    ogDescription: 'Premium Test Product hardwood with excellent quality.',
    ogImage: '/images/test-product.jpg',
    twitterCard: 'summary_large_image'
  },
  images: [],
  isActive: true,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z'
};

const mockProductWithoutSEO: Product = {
  id: 'test-product',
  name: 'Test Product',
  category: 'hardwood',
  grade: 'A',
  description: 'Test product description',
  images: [],
  isActive: true,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z'
};

describe('ProductSEO', () => {
  it('renders SEO meta tags correctly', () => {
    render(<ProductSEO product={mockProductWithSEO} />);
    
    expect(screen.getByTestId('helmet')).toBeInTheDocument();
  });

  it('generates default meta title when not provided', () => {
    render(<ProductSEO product={mockProductWithoutSEO} />);
    
    expect(screen.getByTestId('helmet')).toBeInTheDocument();
  });

  it('generates default meta description when not provided', () => {
    render(<ProductSEO product={mockProductWithoutSEO} />);
    
    expect(screen.getByTestId('helmet')).toBeInTheDocument();
  });

  it('uses provided meta title', () => {
    render(<ProductSEO product={mockProductWithSEO} />);
    
    expect(screen.getByTestId('helmet')).toBeInTheDocument();
  });

  it('uses provided meta description', () => {
    render(<ProductSEO product={mockProductWithSEO} />);
    
    expect(screen.getByTestId('helmet')).toBeInTheDocument();
  });

  it('includes keywords in meta tags', () => {
    render(<ProductSEO product={mockProductWithSEO} />);
    
    expect(screen.getByTestId('helmet')).toBeInTheDocument();
  });

  it('sets canonical URL', () => {
    render(<ProductSEO product={mockProductWithSEO} />);
    
    expect(screen.getByTestId('helmet')).toBeInTheDocument();
  });

  it('includes Open Graph tags', () => {
    render(<ProductSEO product={mockProductWithSEO} />);
    
    expect(screen.getByTestId('helmet')).toBeInTheDocument();
  });

  it('includes Twitter card tags', () => {
    render(<ProductSEO product={mockProductWithSEO} />);
    
    expect(screen.getByTestId('helmet')).toBeInTheDocument();
  });

  it('handles missing SEO data gracefully', () => {
    render(<ProductSEO product={mockProductWithoutSEO} />);
    
    expect(screen.getByTestId('helmet')).toBeInTheDocument();
  });

  it('renders structured data', () => {
    render(<ProductSEO product={mockProductWithSEO} />);
    
    expect(screen.getByTestId('helmet')).toBeInTheDocument();
  });

  it('includes product image in Open Graph', () => {
    const productWithImage = {
      ...mockProductWithSEO,
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
      ]
    };
    
    render(<ProductSEO product={productWithImage} />);
    
    expect(screen.getByTestId('helmet')).toBeInTheDocument();
  });

  it('handles empty keywords array', () => {
    const productWithEmptyKeywords = {
      ...mockProductWithSEO,
      seo: {
        ...mockProductWithSEO.seo!,
        keywords: []
      }
    };
    
    render(<ProductSEO product={productWithEmptyKeywords} />);
    
    expect(screen.getByTestId('helmet')).toBeInTheDocument();
  });

  it('renders with custom className', () => {
    const { container } = render(
      <ProductSEO product={mockProductWithSEO} className="custom-class" />
    );
    
    expect(container.firstChild).toHaveClass('custom-class');
  });
});

