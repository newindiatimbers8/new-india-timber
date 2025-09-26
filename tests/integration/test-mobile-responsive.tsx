import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ProductDetailPage } from '../../src/pages/ProductDetailPage';

// Mock product data for mobile responsiveness testing
const mockProduct = {
  id: 'red-sal-wood',
  slug: 'red-sal-wood',
  name: 'Red Sal Wood',
  scientificName: 'Shorea robusta',
  category: 'hardwood',
  origin: 'India',
  description: 'Premium hardwood timber sourced from the Shorea robusta species, known for its distinctive reddish-brown color and exceptional strength properties. This timber is highly valued in the construction industry for its durability and resistance to moisture and insects.',
  shortDescription: 'Premium hardwood with exceptional strength and durability',
  keyFeatures: [
    'High strength and load-bearing capacity',
    'Excellent moisture and insect resistance',
    'Straight grain pattern with coarse texture',
    'Ideal for structural applications'
  ],
  specifications: {
    density: { min: 800, max: 900 },
    grainPattern: 'straight',
    texture: 'coarse',
    color: 'reddish-brown',
    workability: 'good',
    durability: 'excellent',
    moistureResistance: 'excellent',
    insectResistance: 'excellent'
  },
  applications: {
    primary: [
      'Structural construction work',
      'Railway sleepers',
      'Bridge construction',
      'Heavy construction projects'
    ],
    secondary: [
      'Flooring',
      'General construction',
      'Pier work'
    ],
    notRecommended: [
      'Fine furniture making',
      'Decorative carving'
    ]
  },
  qualityGrades: ['Grade A', 'Grade B', 'Grade C'],
  certifications: ['FSC Certified', 'ISO 9001'],
  sustainability: {
    source: 'sustainable',
    certification: 'FSC Certified'
  },
  pricing: {
    basePrice: 1500,
    unit: 'cubic-foot',
    bulkDiscounts: [
      { minQuantity: 10, discountPercentage: 5 },
      { minQuantity: 50, discountPercentage: 10 }
    ]
  },
  availability: {
    status: 'in-stock',
    leadTime: '2-3 weeks'
  },
  images: {
    hero: {
      webp: '/images/products/red-sal-wood/hero.webp',
      jpg: '/images/products/red-sal-wood/hero.jpg',
      alt: 'Red Sal Wood timber sample'
    },
    gallery: [
      {
        webp: '/images/products/red-sal-wood/gallery-1.webp',
        jpg: '/images/products/red-sal-wood/gallery-1.jpg',
        alt: 'Red Sal Wood gallery image 1'
      }
    ],
    details: {
      grain: {
        webp: '/images/products/red-sal-wood/grain-detail.webp',
        jpg: '/images/products/red-sal-wood/grain-detail.jpg',
        alt: 'Red Sal Wood grain detail'
      },
      crossSection: {
        webp: '/images/products/red-sal-wood/cross-section.webp',
        jpg: '/images/products/red-sal-wood/cross-section.jpg',
        alt: 'Red Sal Wood cross-section'
      },
      applications: []
    }
  },
  seo: {
    metaTitle: 'Red Sal Wood - Premium Hardwood',
    metaDescription: 'Premium hardwood timber',
    keywords: ['red sal wood'],
    canonicalUrl: 'https://newindiatimber.com/products/red-sal-wood',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: 'Red Sal Wood',
      description: 'Premium hardwood timber',
      image: ['/images/products/red-sal-wood/hero.webp'],
      brand: { '@type': 'Brand', name: 'New India Timbers' },
      offers: { '@type': 'Offer', price: 1500, priceCurrency: 'INR', availability: 'InStock' }
    }
  },
  relatedProducts: [],
  createdAt: '2025-01-27T00:00:00Z',
  updatedAt: '2025-01-27T00:00:00Z',
  published: true,
  featured: true
};

// Mock the product data loading
vi.mock('../../src/data/products.json', () => ({
  default: [mockProduct]
}));

// Mock window.matchMedia for responsive testing
const mockMatchMedia = vi.fn();
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: mockMatchMedia,
});

// Mock ResizeObserver
const mockResizeObserver = vi.fn();
mockResizeObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null
});
window.ResizeObserver = mockResizeObserver;

// Mock React Router
const MockRouter = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

// Helper function to set viewport size
const setViewportSize = (width: number, height: number) => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  });
  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: height,
  });
  
  // Trigger resize event
  window.dispatchEvent(new Event('resize'));
};

describe('Mobile Responsiveness Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset to desktop viewport
    setViewportSize(1024, 768);
  });

  it('should render properly on mobile devices (375px width)', () => {
    setViewportSize(375, 667); // iPhone SE dimensions
    
    render(
      <MockRouter>
        <ProductDetailPage />
      </MockRouter>
    );

    // Check if main content is visible
    expect(screen.getByText('Red Sal Wood')).toBeInTheDocument();
    expect(screen.getByText('Shorea robusta')).toBeInTheDocument();
    
    // Check if mobile-specific elements are rendered
    const mainContent = screen.getByRole('main');
    expect(mainContent).toBeInTheDocument();
  });

  it('should render properly on tablet devices (768px width)', () => {
    setViewportSize(768, 1024); // iPad dimensions
    
    render(
      <MockRouter>
        <ProductDetailPage />
      </MockRouter>
    );

    // Check if content is properly displayed on tablet
    expect(screen.getByText('Red Sal Wood')).toBeInTheDocument();
    expect(screen.getByText('Technical Specifications')).toBeInTheDocument();
  });

  it('should render properly on large mobile devices (414px width)', () => {
    setViewportSize(414, 896); // iPhone 11 Pro Max dimensions
    
    render(
      <MockRouter>
        <ProductDetailPage />
      </MockRouter>
    );

    // Check if content is properly displayed
    expect(screen.getByText('Red Sal Wood')).toBeInTheDocument();
    expect(screen.getByText('Applications')).toBeInTheDocument();
  });

  it('should have touch-friendly button sizes on mobile', () => {
    setViewportSize(375, 667);
    
    render(
      <MockRouter>
        <ProductDetailPage />
      </MockRouter>
    );

    const buttons = screen.getAllByRole('button');
    
    buttons.forEach(button => {
      const rect = button.getBoundingClientRect();
      // Touch targets should be at least 44px
      expect(rect.width).toBeGreaterThanOrEqual(44);
      expect(rect.height).toBeGreaterThanOrEqual(44);
    });
  });

  it('should have readable text without horizontal scrolling', () => {
    setViewportSize(375, 667);
    
    render(
      <MockRouter>
        <ProductDetailPage />
      </MockRouter>
    );

    // Check if text is readable (no horizontal overflow)
    const body = document.body;
    expect(body.scrollWidth).toBeLessThanOrEqual(375);
  });

  it('should stack content vertically on mobile', () => {
    setViewportSize(375, 667);
    
    render(
      <MockRouter>
        <ProductDetailPage />
      </MockRouter>
    );

    // Check if sections are stacked vertically
    const sections = document.querySelectorAll('section');
    expect(sections.length).toBeGreaterThan(0);
    
    // Each section should be full width on mobile
    sections.forEach(section => {
      const computedStyle = window.getComputedStyle(section);
      expect(computedStyle.width).toBe('100%');
    });
  });

  it('should have proper image scaling on mobile', () => {
    setViewportSize(375, 667);
    
    render(
      <MockRouter>
        <ProductDetailPage />
      </MockRouter>
    );

    const images = screen.getAllByRole('img');
    
    images.forEach(img => {
      const rect = img.getBoundingClientRect();
      // Images should not exceed viewport width
      expect(rect.width).toBeLessThanOrEqual(375);
    });
  });

  it('should handle orientation changes', () => {
    // Start in portrait
    setViewportSize(375, 667);
    
    render(
      <MockRouter>
        <ProductDetailPage />
      </MockRouter>
    );

    expect(screen.getByText('Red Sal Wood')).toBeInTheDocument();
    
    // Change to landscape
    setViewportSize(667, 375);
    
    // Content should still be visible and properly laid out
    expect(screen.getByText('Red Sal Wood')).toBeInTheDocument();
  });

  it('should have proper spacing and padding on mobile', () => {
    setViewportSize(375, 667);
    
    render(
      <MockRouter>
        <ProductDetailPage />
      </MockRouter>
    );

    const mainContent = screen.getByRole('main');
    const computedStyle = window.getComputedStyle(mainContent);
    
    // Should have appropriate padding for mobile
    expect(computedStyle.paddingLeft).not.toBe('0px');
    expect(computedStyle.paddingRight).not.toBe('0px');
  });

  it('should have collapsible navigation on mobile', () => {
    setViewportSize(375, 667);
    
    render(
      <MockRouter>
        <ProductDetailPage />
      </MockRouter>
    );

    // Check for mobile navigation elements
    const nav = screen.getByRole('navigation');
    expect(nav).toBeInTheDocument();
    
    // Should have hamburger menu or mobile navigation
    const mobileMenuButton = screen.queryByRole('button', { name: /menu/i });
    if (mobileMenuButton) {
      expect(mobileMenuButton).toBeInTheDocument();
    }
  });

  it('should have proper form layout on mobile', () => {
    setViewportSize(375, 667);
    
    render(
      <MockRouter>
        <ProductDetailPage />
      </MockRouter>
    );

    // Check for form elements (quote form, contact form)
    const inputs = screen.queryAllByRole('textbox');
    const buttons = screen.queryAllByRole('button');
    
    if (inputs.length > 0) {
      inputs.forEach(input => {
        const rect = input.getBoundingClientRect();
        // Form inputs should be full width on mobile
        expect(rect.width).toBeGreaterThan(300);
      });
    }
  });

  it('should have proper table responsiveness on mobile', () => {
    setViewportSize(375, 667);
    
    render(
      <MockRouter>
        <ProductDetailPage />
      </MockRouter>
    );

    const tables = document.querySelectorAll('table');
    
    tables.forEach(table => {
      // Tables should be horizontally scrollable on mobile
      const computedStyle = window.getComputedStyle(table);
      expect(computedStyle.overflowX).toBe('auto');
    });
  });

  it('should have proper modal and overlay behavior on mobile', () => {
    setViewportSize(375, 667);
    
    render(
      <MockRouter>
        <ProductDetailPage />
      </MockRouter>
    );

    // Check for modal elements (image zoom, product comparison)
    const modals = document.querySelectorAll('[role="dialog"]');
    
    modals.forEach(modal => {
      const computedStyle = window.getComputedStyle(modal);
      // Modals should be full screen on mobile
      expect(computedStyle.width).toBe('100vw');
      expect(computedStyle.height).toBe('100vh');
    });
  });

  it('should have proper loading states on mobile', () => {
    setViewportSize(375, 667);
    
    render(
      <MockRouter>
        <ProductDetailPage />
      </MockRouter>
    );

    // Check for loading indicators
    const loadingElements = document.querySelectorAll('[aria-busy="true"]');
    
    loadingElements.forEach(element => {
      const rect = element.getBoundingClientRect();
      // Loading indicators should be appropriately sized for mobile
      expect(rect.width).toBeGreaterThan(20);
      expect(rect.height).toBeGreaterThan(20);
    });
  });

  it('should have proper error handling on mobile', () => {
    setViewportSize(375, 667);
    
    render(
      <MockRouter>
        <ProductDetailPage />
      </MockRouter>
    );

    // Check for error messages
    const errorMessages = document.querySelectorAll('[role="alert"]');
    
    errorMessages.forEach(message => {
      const computedStyle = window.getComputedStyle(message);
      // Error messages should be visible and properly styled
      expect(computedStyle.display).not.toBe('none');
    });
  });

  it('should have proper performance on mobile', () => {
    setViewportSize(375, 667);
    
    const startTime = performance.now();
    
    render(
      <MockRouter>
        <ProductDetailPage />
      </MockRouter>
    );
    
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    
    // Should render quickly on mobile (less than 100ms)
    expect(renderTime).toBeLessThan(100);
  });

  it('should handle touch events properly', () => {
    setViewportSize(375, 667);
    
    render(
      <MockRouter>
        <ProductDetailPage />
      </MockRouter>
    );

    const buttons = screen.getAllByRole('button');
    
    buttons.forEach(button => {
      // Simulate touch event
      fireEvent.touchStart(button);
      fireEvent.touchEnd(button);
      
      // Should handle touch events without errors
      expect(button).toBeInTheDocument();
    });
  });

  it('should have proper keyboard navigation on mobile', () => {
    setViewportSize(375, 667);
    
    render(
      <MockRouter>
        <ProductDetailPage />
      </MockRouter>
    );

    const focusableElements = screen.getAllByRole('button')
      .concat(screen.getAllByRole('link'))
      .concat(screen.getAllByRole('textbox'));

    focusableElements.forEach(element => {
      // Should be focusable
      expect(element).not.toHaveAttribute('tabindex', '-1');
    });
  });

  it('should have proper accessibility on mobile', () => {
    setViewportSize(375, 667);
    
    render(
      <MockRouter>
        <ProductDetailPage />
      </MockRouter>
    );

    // Check for mobile-specific accessibility features
    const images = screen.getAllByRole('img');
    
    images.forEach(img => {
      // Should have proper alt text
      expect(img).toHaveAttribute('alt');
      expect(img.getAttribute('alt')).not.toBe('');
    });
  });

  it('should handle different pixel densities', () => {
    // Test with high DPI display
    Object.defineProperty(window, 'devicePixelRatio', {
      writable: true,
      value: 2,
    });
    
    setViewportSize(375, 667);
    
    render(
      <MockRouter>
        <ProductDetailPage />
      </MockRouter>
    );

    // Should render properly on high DPI displays
    expect(screen.getByText('Red Sal Wood')).toBeInTheDocument();
  });

  it('should have proper viewport meta tag', () => {
    setViewportSize(375, 667);
    
    render(
      <MockRouter>
        <ProductDetailPage />
      </MockRouter>
    );

    const viewportMeta = document.querySelector('meta[name="viewport"]');
    expect(viewportMeta).toBeInTheDocument();
    expect(viewportMeta?.getAttribute('content')).toContain('width=device-width');
    expect(viewportMeta?.getAttribute('content')).toContain('initial-scale=1');
  });
});

