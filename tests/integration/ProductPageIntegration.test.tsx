/**
 * Integration tests for Product Pages
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ProductDetailPage from '@/pages/ProductDetailPage';
import ProductSearchFilter from '@/components/products/ProductSearchFilter';
import type { Product } from '@/types/product';

// Mock product data
const mockProducts: Product[] = [
  {
    id: 'red-sal-wood',
    name: 'Red Sal Wood',
    category: 'hardwood',
    grade: 'A',
    description: 'Premium hardwood with distinctive reddish-brown color',
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
    applications: ['Furniture making', 'Construction', 'Flooring'],
    images: [
      {
        id: 'img1',
        productId: 'red-sal-wood',
        url: '/images/red-sal-wood.jpg',
        altText: 'Red Sal Wood',
        context: 'gallery',
        sequence: 1,
        dimensions: { width: 800, height: 600, aspectRatio: '4:3' },
        metadata: {
          generatedAt: '2024-01-01T00:00:00Z',
          prompt: 'Test prompt',
          optimized: true,
          seoKeywords: ['red sal wood']
        },
        isActive: true
      }
    ],
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'mahogany-wood',
    name: 'Mahogany Wood',
    category: 'hardwood',
    grade: 'A',
    description: 'Premium mahogany wood with rich color',
    specifications: {
      density: { min: 500, max: 650 },
      grainPattern: 'straight',
      texture: 'fine',
      color: 'Rich reddish-brown',
      workability: 'excellent',
      durability: 'excellent',
      moistureResistance: 'excellent',
      insectResistance: 'excellent'
    },
    applications: ['Furniture making', 'Cabinetry', 'Decorative work'],
    images: [],
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];

// Mock the products service
vi.mock('@/services/products', () => ({
  getProducts: vi.fn(() => Promise.resolve({
    products: mockProducts,
    total: mockProducts.length,
    page: 1,
    limit: 10,
    hasMore: false,
    filters: {
      categories: ['hardwood'],
      grades: ['A'],
      priceRange: { min: 0, max: 10000 }
    }
  }))
}));

// Mock React Router
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ productId: 'red-sal-wood' })
  };
});

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('Product Page Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders product detail page with all components', async () => {
    renderWithRouter(<ProductDetailPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Red Sal Wood')).toBeInTheDocument();
    });
    
    // Check for main sections
    expect(screen.getByText('Technical Specifications')).toBeInTheDocument();
    expect(screen.getByText('Applications & Uses')).toBeInTheDocument();
    expect(screen.getByText('Pricing Information')).toBeInTheDocument();
  });

  it('displays product information correctly', async () => {
    renderWithRouter(<ProductDetailPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Red Sal Wood')).toBeInTheDocument();
    });
    
    expect(screen.getByText('Premium hardwood with distinctive reddish-brown color')).toBeInTheDocument();
    expect(screen.getByText('HARDWOOD TIMBER')).toBeInTheDocument();
  });

  it('shows product specifications', async () => {
    renderWithRouter(<ProductDetailPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Technical Specifications')).toBeInTheDocument();
    });
    
    expect(screen.getByText('Density')).toBeInTheDocument();
    expect(screen.getByText('800-900 kg/m³')).toBeInTheDocument();
    expect(screen.getByText('Grain Pattern')).toBeInTheDocument();
    expect(screen.getByText('Straight')).toBeInTheDocument();
  });

  it('displays product applications', async () => {
    renderWithRouter(<ProductDetailPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Applications & Uses')).toBeInTheDocument();
    });
    
    expect(screen.getByText('Furniture making')).toBeInTheDocument();
    expect(screen.getByText('Construction')).toBeInTheDocument();
    expect(screen.getByText('Flooring')).toBeInTheDocument();
  });

  it('shows pricing information', async () => {
    renderWithRouter(<ProductDetailPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Pricing Information')).toBeInTheDocument();
    });
    
    expect(screen.getByText('Contact for pricing information')).toBeInTheDocument();
  });

  it('handles product search and filtering', () => {
    const mockOnFilteredProducts = vi.fn();
    
    render(
      <ProductSearchFilter
        products={mockProducts}
        onFilteredProducts={mockOnFilteredProducts}
      />
    );
    
    // Test search functionality
    const searchInput = screen.getByPlaceholderText('Search products...');
    fireEvent.change(searchInput, { target: { value: 'mahogany' } });
    
    expect(mockOnFilteredProducts).toHaveBeenCalled();
  });

  it('filters products by category', () => {
    const mockOnFilteredProducts = vi.fn();
    
    render(
      <ProductSearchFilter
        products={mockProducts}
        onFilteredProducts={mockOnFilteredProducts}
        showAdvancedFilters={true}
      />
    );
    
    // Open filters
    const filtersButton = screen.getByText('Filters');
    fireEvent.click(filtersButton);
    
    // Check hardwood category
    const hardwoodCheckbox = screen.getByLabelText('Hardwood');
    fireEvent.click(hardwoodCheckbox);
    
    expect(mockOnFilteredProducts).toHaveBeenCalled();
  });

  it('sorts products correctly', () => {
    const mockOnFilteredProducts = vi.fn();
    
    render(
      <ProductSearchFilter
        products={mockProducts}
        onFilteredProducts={mockOnFilteredProducts}
      />
    );
    
    // Change sort order
    const sortSelect = screen.getByDisplayValue('Name');
    fireEvent.change(sortSelect, { target: { value: 'price' } });
    
    expect(mockOnFilteredProducts).toHaveBeenCalled();
  });

  it('handles product not found', async () => {
    // Mock useParams to return non-existent product
    vi.mocked(require('react-router-dom').useParams).mockReturnValue({ 
      productId: 'non-existent-product' 
    });
    
    renderWithRouter(<ProductDetailPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Product Not Found')).toBeInTheDocument();
    });
  });

  it('displays breadcrumb navigation', async () => {
    renderWithRouter(<ProductDetailPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Red Sal Wood')).toBeInTheDocument();
    });
    
    // Check for breadcrumb elements
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Timber & Wood')).toBeInTheDocument();
  });

  it('shows trust signals and certifications', async () => {
    renderWithRouter(<ProductDetailPage />);
    
    await waitFor(() => {
      expect(screen.getByText('25+ Years Experience')).toBeInTheDocument();
    });
    
    expect(screen.getByText('FSC Certified')).toBeInTheDocument();
    expect(screen.getByText('500+ Satisfied Customers')).toBeInTheDocument();
  });

  it('handles tab navigation', async () => {
    renderWithRouter(<ProductDetailPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Red Sal Wood')).toBeInTheDocument();
    });
    
    // Test tab switching
    const applicationsTab = screen.getByText('Applications');
    fireEvent.click(applicationsTab);
    
    expect(screen.getByText('Applications & Uses')).toBeInTheDocument();
  });

  it('displays product images correctly', async () => {
    renderWithRouter(<ProductDetailPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Red Sal Wood')).toBeInTheDocument();
    });
    
    // Check for product images
    const productImage = screen.getByAltText('Red Sal Wood');
    expect(productImage).toBeInTheDocument();
  });
});

