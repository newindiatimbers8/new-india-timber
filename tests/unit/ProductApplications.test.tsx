/**
 * Unit tests for ProductApplications component
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ProductApplications from '@/components/products/ProductApplications';
import type { Product } from '@/types/product';

// Mock product data with applications
const mockProductWithApplications: Product = {
  id: 'test-product',
  name: 'Test Product',
  category: 'hardwood',
  grade: 'A',
  description: 'Test product description',
  applications: [
    'Furniture making',
    'Construction',
    'Flooring',
    'Decorative work'
  ],
  images: [],
  isActive: true,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z'
};

const mockProductWithoutApplications: Product = {
  id: 'test-product',
  name: 'Test Product',
  category: 'hardwood',
  grade: 'A',
  description: 'Test product description',
  applications: [],
  images: [],
  isActive: true,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z'
};

describe('ProductApplications', () => {
  it('renders product applications correctly', () => {
    render(<ProductApplications product={mockProductWithApplications} />);
    
    expect(screen.getByText('Applications & Uses')).toBeInTheDocument();
    expect(screen.getByText('Furniture making')).toBeInTheDocument();
    expect(screen.getByText('Construction')).toBeInTheDocument();
    expect(screen.getByText('Flooring')).toBeInTheDocument();
    expect(screen.getByText('Decorative work')).toBeInTheDocument();
  });

  it('displays all applications in a grid layout', () => {
    render(<ProductApplications product={mockProductWithApplications} />);
    
    const applicationItems = screen.getAllByText(/Furniture making|Construction|Flooring|Decorative work/);
    expect(applicationItems).toHaveLength(4);
  });

  it('handles empty applications array', () => {
    render(<ProductApplications product={mockProductWithoutApplications} />);
    
    expect(screen.getByText('Applications & Uses')).toBeInTheDocument();
    expect(screen.getByText('No applications specified')).toBeInTheDocument();
  });

  it('handles undefined applications', () => {
    const productWithoutApplications = { ...mockProductWithoutApplications, applications: undefined };
    render(<ProductApplications product={productWithoutApplications} />);
    
    expect(screen.getByText('Applications & Uses')).toBeInTheDocument();
    expect(screen.getByText('No applications specified')).toBeInTheDocument();
  });

  it('renders applications with proper styling', () => {
    const { container } = render(<ProductApplications product={mockProductWithApplications} />);
    
    const applicationItems = container.querySelectorAll('.bg-blue-50');
    expect(applicationItems.length).toBeGreaterThan(0);
  });

  it('displays application icons', () => {
    render(<ProductApplications product={mockProductWithApplications} />);
    
    // Check for icon elements (assuming icons are rendered)
    const icons = screen.getAllByRole('img', { hidden: true });
    expect(icons.length).toBeGreaterThan(0);
  });

  it('has proper accessibility attributes', () => {
    render(<ProductApplications product={mockProductWithApplications} />);
    
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toHaveTextContent('Applications & Uses');
  });

  it('renders with custom className', () => {
    const { container } = render(
      <ProductApplications product={mockProductWithApplications} className="custom-class" />
    );
    
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('handles single application', () => {
    const singleApplicationProduct = {
      ...mockProductWithApplications,
      applications: ['Furniture making']
    };
    
    render(<ProductApplications product={singleApplicationProduct} />);
    
    expect(screen.getByText('Furniture making')).toBeInTheDocument();
    expect(screen.queryByText('Construction')).not.toBeInTheDocument();
  });

  it('displays applications in correct order', () => {
    render(<ProductApplications product={mockProductWithApplications} />);
    
    const applicationItems = screen.getAllByText(/Furniture making|Construction|Flooring|Decorative work/);
    expect(applicationItems[0]).toHaveTextContent('Furniture making');
    expect(applicationItems[1]).toHaveTextContent('Construction');
    expect(applicationItems[2]).toHaveTextContent('Flooring');
    expect(applicationItems[3]).toHaveTextContent('Decorative work');
  });

  it('handles long application names', () => {
    const longApplicationProduct = {
      ...mockProductWithApplications,
      applications: ['Very long application name that might wrap to multiple lines']
    };
    
    render(<ProductApplications product={longApplicationProduct} />);
    
    expect(screen.getByText('Very long application name that might wrap to multiple lines')).toBeInTheDocument();
  });

  it('renders applications with proper spacing', () => {
    const { container } = render(<ProductApplications product={mockProductWithApplications} />);
    
    const grid = container.querySelector('.grid');
    expect(grid).toBeInTheDocument();
    expect(grid).toHaveClass('grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3', 'gap-4');
  });
});

