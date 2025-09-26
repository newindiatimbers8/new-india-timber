/**
 * Unit tests for ProductPricing component
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ProductPricing from '@/components/products/ProductPricing';
import type { Product } from '@/types/product';

// Mock product data with pricing
const mockProductWithPricing: Product = {
  id: 'test-product',
  name: 'Test Product',
  category: 'hardwood',
  grade: 'A',
  description: 'Test product description',
  pricing: {
    type: 'quote_based',
    displayText: 'Contact for Price',
    ctaButton: {
      text: 'Get Quote',
      action: 'contact',
      style: 'primary'
    },
    internalPricing: {
      basePrice: 1500,
      currency: 'INR',
      unit: 'cubic-foot',
      priceRange: '₹1,200 - ₹1,800',
      bulkDiscount: 'Available for bulk orders'
    },
    isVisible: true
  },
  images: [],
  isActive: true,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z'
};

const mockProductWithoutPricing: Product = {
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

describe('ProductPricing', () => {
  it('renders product pricing correctly', () => {
    render(<ProductPricing product={mockProductWithPricing} />);
    
    expect(screen.getByText('Pricing Information')).toBeInTheDocument();
    expect(screen.getByText('Contact for Price')).toBeInTheDocument();
    expect(screen.getByText('Get Quote')).toBeInTheDocument();
  });

  it('displays price range when available', () => {
    render(<ProductPricing product={mockProductWithPricing} />);
    
    expect(screen.getByText('₹1,200 - ₹1,800')).toBeInTheDocument();
    expect(screen.getByText('per cubic-foot')).toBeInTheDocument();
  });

  it('shows bulk discount information', () => {
    render(<ProductPricing product={mockProductWithPricing} />);
    
    expect(screen.getByText('Available for bulk orders')).toBeInTheDocument();
  });

  it('handles missing pricing gracefully', () => {
    render(<ProductPricing product={mockProductWithoutPricing} />);
    
    expect(screen.getByText('Pricing Information')).toBeInTheDocument();
    expect(screen.getByText('Contact for pricing information')).toBeInTheDocument();
  });

  it('renders CTA button with correct text', () => {
    render(<ProductPricing product={mockProductWithPricing} />);
    
    const ctaButton = screen.getByRole('button', { name: 'Get Quote' });
    expect(ctaButton).toBeInTheDocument();
  });

  it('handles CTA button click', () => {
    const mockOnContact = vi.fn();
    render(<ProductPricing product={mockProductWithPricing} onContact={mockOnContact} />);
    
    const ctaButton = screen.getByRole('button', { name: 'Get Quote' });
    fireEvent.click(ctaButton);
    
    expect(mockOnContact).toHaveBeenCalledTimes(1);
  });

  it('displays currency and unit information', () => {
    render(<ProductPricing product={mockProductWithPricing} />);
    
    expect(screen.getByText('INR')).toBeInTheDocument();
    expect(screen.getByText('per cubic-foot')).toBeInTheDocument();
  });

  it('handles quote-based pricing type', () => {
    render(<ProductPricing product={mockProductWithPricing} />);
    
    expect(screen.getByText('Contact for Price')).toBeInTheDocument();
    expect(screen.getByText('Get Quote')).toBeInTheDocument();
  });

  it('handles fixed pricing type', () => {
    const fixedPricingProduct = {
      ...mockProductWithPricing,
      pricing: {
        ...mockProductWithPricing.pricing!,
        type: 'fixed',
        displayText: '₹1,500 per cubic-foot'
      }
    };
    
    render(<ProductPricing product={fixedPricingProduct} />);
    
    expect(screen.getByText('₹1,500 per cubic-foot')).toBeInTheDocument();
  });

  it('renders with custom className', () => {
    const { container } = render(
      <ProductPricing product={mockProductWithPricing} className="custom-class" />
    );
    
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('displays pricing details in correct format', () => {
    render(<ProductPricing product={mockProductWithPricing} />);
    
    expect(screen.getByText('Base Price: ₹1,500')).toBeInTheDocument();
    expect(screen.getByText('Price Range: ₹1,200 - ₹1,800')).toBeInTheDocument();
  });

  it('handles missing internal pricing', () => {
    const productWithoutInternalPricing = {
      ...mockProductWithPricing,
      pricing: {
        ...mockProductWithPricing.pricing!,
        internalPricing: {
          basePrice: null,
          currency: 'INR',
          unit: 'cubic-foot'
        }
      }
    };
    
    render(<ProductPricing product={productWithoutInternalPricing} />);
    
    expect(screen.getByText('Contact for Price')).toBeInTheDocument();
    expect(screen.queryByText('Base Price:')).not.toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<ProductPricing product={mockProductWithPricing} />);
    
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toHaveTextContent('Pricing Information');
    
    const button = screen.getByRole('button', { name: 'Get Quote' });
    expect(button).toBeInTheDocument();
  });

  it('displays pricing information in a structured layout', () => {
    const { container } = render(<ProductPricing product={mockProductWithPricing} />);
    
    const pricingCard = container.querySelector('.bg-blue-50');
    expect(pricingCard).toBeInTheDocument();
  });

  it('handles different currency formats', () => {
    const usdPricingProduct = {
      ...mockProductWithPricing,
      pricing: {
        ...mockProductWithPricing.pricing!,
        internalPricing: {
          ...mockProductWithPricing.pricing!.internalPricing,
          currency: 'USD',
          basePrice: 20
        }
      }
    };
    
    render(<ProductPricing product={usdPricingProduct} />);
    
    expect(screen.getByText('USD')).toBeInTheDocument();
    expect(screen.getByText('Base Price: $20')).toBeInTheDocument();
  });
});

