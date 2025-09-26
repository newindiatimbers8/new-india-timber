/**
 * Unit tests for ProductSpecifications component
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ProductSpecifications from '@/components/products/ProductSpecifications';
import type { Product } from '@/types/product';

// Mock product data
const mockProduct: Product = {
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
  images: [],
  isActive: true,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z'
};

describe('ProductSpecifications', () => {
  it('renders product specifications correctly', () => {
    render(<ProductSpecifications product={mockProduct} />);
    
    expect(screen.getByText('Technical Specifications')).toBeInTheDocument();
    expect(screen.getByText('Density')).toBeInTheDocument();
    expect(screen.getByText('800-900 kg/m³')).toBeInTheDocument();
    expect(screen.getByText('Grain Pattern')).toBeInTheDocument();
    expect(screen.getByText('Straight')).toBeInTheDocument();
  });

  it('displays all specification properties', () => {
    render(<ProductSpecifications product={mockProduct} />);
    
    // Check all specification properties are displayed
    expect(screen.getByText('Density')).toBeInTheDocument();
    expect(screen.getByText('Grain Pattern')).toBeInTheDocument();
    expect(screen.getByText('Texture')).toBeInTheDocument();
    expect(screen.getByText('Color')).toBeInTheDocument();
    expect(screen.getByText('Workability')).toBeInTheDocument();
    expect(screen.getByText('Durability')).toBeInTheDocument();
    expect(screen.getByText('Moisture Resistance')).toBeInTheDocument();
    expect(screen.getByText('Insect Resistance')).toBeInTheDocument();
  });

  it('handles missing specifications gracefully', () => {
    const productWithoutSpecs = { ...mockProduct, specifications: undefined };
    render(<ProductSpecifications product={productWithoutSpecs} />);
    
    expect(screen.getByText('Technical Specifications')).toBeInTheDocument();
    expect(screen.getByText('No specifications available')).toBeInTheDocument();
  });

  it('formats density range correctly', () => {
    render(<ProductSpecifications product={mockProduct} />);
    
    const densityCell = screen.getByText('800-900 kg/m³');
    expect(densityCell).toBeInTheDocument();
  });

  it('capitalizes specification labels properly', () => {
    render(<ProductSpecifications product={mockProduct} />);
    
    expect(screen.getByText('Grain Pattern')).toBeInTheDocument();
    expect(screen.getByText('Moisture Resistance')).toBeInTheDocument();
    expect(screen.getByText('Insect Resistance')).toBeInTheDocument();
  });

  it('displays quality ratings correctly', () => {
    render(<ProductSpecifications product={mockProduct} />);
    
    expect(screen.getByText('Good')).toBeInTheDocument();
    expect(screen.getByText('Excellent')).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<ProductSpecifications product={mockProduct} />);
    
    const table = screen.getByRole('table');
    expect(table).toBeInTheDocument();
    
    const headers = screen.getAllByRole('columnheader');
    expect(headers).toHaveLength(2);
    expect(headers[0]).toHaveTextContent('Property');
    expect(headers[1]).toHaveTextContent('Value');
  });

  it('renders with custom className', () => {
    const { container } = render(
      <ProductSpecifications product={mockProduct} className="custom-class" />
    );
    
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('handles empty specifications object', () => {
    const productWithEmptySpecs = { ...mockProduct, specifications: {} };
    render(<ProductSpecifications product={productWithEmptySpecs} />);
    
    expect(screen.getByText('Technical Specifications')).toBeInTheDocument();
    expect(screen.getByText('No specifications available')).toBeInTheDocument();
  });

  it('displays certification information', () => {
    render(<ProductSpecifications product={mockProduct} />);
    
    expect(screen.getByText('Certification')).toBeInTheDocument();
    expect(screen.getByText('FSC Certified')).toBeInTheDocument();
  });
});

