/**
 * Unit tests for ProductImages component
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ProductImages from '@/components/products/ProductImages';
import type { Product } from '@/types/product';

// Mock product data with images
const mockProductWithImages: Product = {
  id: 'test-product',
  name: 'Test Product',
  category: 'hardwood',
  grade: 'A',
  description: 'Test product description',
  images: [
    {
      id: 'img1',
      productId: 'test-product',
      url: '/images/test1.jpg',
      altText: 'Test image 1',
      context: 'gallery',
      sequence: 1,
      dimensions: { width: 800, height: 600, aspectRatio: '4:3' },
      metadata: {
        generatedAt: '2024-01-01T00:00:00Z',
        prompt: 'Test prompt',
        optimized: true,
        seoKeywords: ['test', 'image']
      },
      isActive: true
    },
    {
      id: 'img2',
      productId: 'test-product',
      url: '/images/test2.jpg',
      altText: 'Test image 2',
      context: 'gallery',
      sequence: 2,
      dimensions: { width: 800, height: 600, aspectRatio: '4:3' },
      metadata: {
        generatedAt: '2024-01-01T00:00:00Z',
        prompt: 'Test prompt 2',
        optimized: true,
        seoKeywords: ['test', 'image']
      },
      isActive: true
    }
  ],
  isActive: true,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z'
};

const mockProductWithoutImages: Product = {
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

describe('ProductImages', () => {
  it('renders product images correctly', () => {
    render(<ProductImages product={mockProductWithImages} />);
    
    expect(screen.getByText('Product Images')).toBeInTheDocument();
    expect(screen.getByAltText('Test image 1')).toBeInTheDocument();
    expect(screen.getByAltText('Test image 2')).toBeInTheDocument();
  });

  it('displays main image', () => {
    render(<ProductImages product={mockProductWithImages} />);
    
    const mainImage = screen.getByAltText('Test image 1');
    expect(mainImage).toBeInTheDocument();
    expect(mainImage).toHaveAttribute('src', '/images/test1.jpg');
  });

  it('shows thumbnail navigation when multiple images', () => {
    render(<ProductImages product={mockProductWithImages} />);
    
    const thumbnails = screen.getAllByRole('button');
    expect(thumbnails).toHaveLength(2); // Two thumbnail buttons
  });

  it('handles image click to change main image', () => {
    render(<ProductImages product={mockProductWithImages} />);
    
    const secondThumbnail = screen.getAllByRole('button')[1];
    fireEvent.click(secondThumbnail);
    
    const mainImage = screen.getByAltText('Test image 2');
    expect(mainImage).toBeInTheDocument();
  });

  it('displays placeholder when no images', () => {
    render(<ProductImages product={mockProductWithoutImages} />);
    
    expect(screen.getByText('Product Images')).toBeInTheDocument();
    expect(screen.getByText('No images available')).toBeInTheDocument();
  });

  it('handles single image without thumbnails', () => {
    const singleImageProduct = {
      ...mockProductWithImages,
      images: [mockProductWithImages.images[0]]
    };
    
    render(<ProductImages product={singleImageProduct} />);
    
    expect(screen.getByAltText('Test image 1')).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('applies correct CSS classes', () => {
    const { container } = render(<ProductImages product={mockProductWithImages} />);
    
    const mainImage = container.querySelector('.aspect-square');
    expect(mainImage).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<ProductImages product={mockProductWithImages} />);
    
    const images = screen.getAllByRole('img');
    expect(images[0]).toHaveAttribute('alt', 'Test image 1');
    expect(images[1]).toHaveAttribute('alt', 'Test image 2');
  });

  it('renders with custom className', () => {
    const { container } = render(
      <ProductImages product={mockProductWithImages} className="custom-class" />
    );
    
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('handles image loading errors gracefully', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    render(<ProductImages product={mockProductWithImages} />);
    
    const mainImage = screen.getByAltText('Test image 1');
    fireEvent.error(mainImage);
    
    // Should not crash the component
    expect(screen.getByText('Product Images')).toBeInTheDocument();
    
    consoleSpy.mockRestore();
  });

  it('displays image counter when multiple images', () => {
    render(<ProductImages product={mockProductWithImages} />);
    
    expect(screen.getByText('1 / 2')).toBeInTheDocument();
  });

  it('updates image counter when switching images', () => {
    render(<ProductImages product={mockProductWithImages} />);
    
    const secondThumbnail = screen.getAllByRole('button')[1];
    fireEvent.click(secondThumbnail);
    
    expect(screen.getByText('2 / 2')).toBeInTheDocument();
  });
});

