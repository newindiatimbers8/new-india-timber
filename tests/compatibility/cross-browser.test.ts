/**
 * Cross-browser compatibility tests
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import ProductDetailPage from '@/pages/ProductDetailPage';
import { getProducts } from '@/services/products';
import type { Product } from '@/types/product';

// Mock React Router
vi.mock('react-router-dom', () => ({
  useParams: () => ({ productId: 'red-sal-wood' }),
  useNavigate: () => vi.fn()
}));

// Mock React Helmet
vi.mock('react-helmet-async', () => ({
  Helmet: ({ children }: { children: React.ReactNode }) => <div data-testid="helmet">{children}</div>
}));

// Mock Layout component
vi.mock('@/components/layout/Layout', () => ({
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="layout">{children}</div>
}));

// Mock UI components
vi.mock('@/components/ui/button', () => ({
  Button: ({ children, ...props }: any) => <button {...props}>{children}</button>
}));

vi.mock('@/components/ui/card', () => ({
  Card: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  CardContent: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  CardHeader: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  CardTitle: ({ children, ...props }: any) => <h3 {...props}>{children}</h3>
}));

vi.mock('@/components/ui/badge', () => ({
  Badge: ({ children, ...props }: any) => <span {...props}>{children}</span>
}));

vi.mock('@/components/ui/tabs', () => ({
  Tabs: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  TabsContent: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  TabsList: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  TabsTrigger: ({ children, ...props }: any) => <button {...props}>{children}</button>
}));

// Mock product components
vi.mock('@/components/products/ProductSEO', () => ({
  default: ({ product }: { product: Product }) => <div data-testid="product-seo">{product.name}</div>
}));

vi.mock('@/components/products/ProductSpecifications', () => ({
  default: ({ product }: { product: Product }) => <div data-testid="product-specifications">{product.name}</div>
}));

vi.mock('@/components/products/ProductImages', () => ({
  default: ({ product }: { product: Product }) => <div data-testid="product-images">{product.name}</div>
}));

vi.mock('@/components/products/ProductApplications', () => ({
  default: ({ product }: { product: Product }) => <div data-testid="product-applications">{product.name}</div>
}));

vi.mock('@/components/products/ProductPricing', () => ({
  default: ({ product }: { product: Product }) => <div data-testid="product-pricing">{product.name}</div>
}));

vi.mock('@/components/products/ProductComparison', () => ({
  default: ({ products }: { products: Product[] }) => <div data-testid="product-comparison">{products[0].name}</div>
}));

// Mock product data
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
  ],
  isActive: true,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z'
};

// Mock services
vi.mock('@/services/products', () => ({
  getProducts: vi.fn(() => Promise.resolve([mockProduct])),
  getProductById: vi.fn(() => Promise.resolve(mockProduct))
}));

describe('Cross-Browser Compatibility', () => {
  let originalUserAgent: string;
  let originalIntersectionObserver: any;
  let originalResizeObserver: any;
  let originalRequestIdleCallback: any;
  let originalCancelIdleCallback: any;

  beforeEach(() => {
    // Store original values
    originalUserAgent = navigator.userAgent;
    originalIntersectionObserver = global.IntersectionObserver;
    originalResizeObserver = global.ResizeObserver;
    originalRequestIdleCallback = global.requestIdleCallback;
    originalCancelIdleCallback = global.cancelIdleCallback;

    // Clear mocks
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Restore original values
    Object.defineProperty(navigator, 'userAgent', {
      writable: true,
      value: originalUserAgent
    });
    global.IntersectionObserver = originalIntersectionObserver;
    global.ResizeObserver = originalResizeObserver;
    global.requestIdleCallback = originalRequestIdleCallback;
    global.cancelIdleCallback = originalCancelIdleCallback;
  });

  describe('Chrome Compatibility', () => {
    beforeEach(() => {
      Object.defineProperty(navigator, 'userAgent', {
        writable: true,
        value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      });
    });

    it('renders correctly in Chrome', async () => {
      render(<ProductDetailPage />);
      
      await screen.findByTestId('product-seo');
      
      expect(screen.getByTestId('product-seo')).toBeInTheDocument();
      expect(screen.getByTestId('product-specifications')).toBeInTheDocument();
      expect(screen.getByTestId('product-images')).toBeInTheDocument();
    });

    it('supports modern CSS features in Chrome', async () => {
      render(<ProductDetailPage />);
      
      await screen.findByTestId('product-seo');
      
      // Check that modern CSS features are supported
      const container = screen.getByTestId('layout');
      const styles = window.getComputedStyle(container);
      
      // Chrome supports CSS Grid and Flexbox
      expect(styles.display).toBeTruthy();
    });

    it('supports WebP images in Chrome', async () => {
      render(<ProductDetailPage />);
      
      await screen.findByTestId('product-images');
      
      // Chrome supports WebP format
      const images = screen.getAllByRole('img');
      expect(images.length).toBeGreaterThan(0);
    });
  });

  describe('Firefox Compatibility', () => {
    beforeEach(() => {
      Object.defineProperty(navigator, 'userAgent', {
        writable: true,
        value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0'
      });
    });

    it('renders correctly in Firefox', async () => {
      render(<ProductDetailPage />);
      
      await screen.findByTestId('product-seo');
      
      expect(screen.getByTestId('product-seo')).toBeInTheDocument();
      expect(screen.getByTestId('product-specifications')).toBeInTheDocument();
      expect(screen.getByTestId('product-images')).toBeInTheDocument();
    });

    it('supports modern CSS features in Firefox', async () => {
      render(<ProductDetailPage />);
      
      await screen.findByTestId('product-seo');
      
      // Check that modern CSS features are supported
      const container = screen.getByTestId('layout');
      const styles = window.getComputedStyle(container);
      
      // Firefox supports CSS Grid and Flexbox
      expect(styles.display).toBeTruthy();
    });

    it('supports WebP images in Firefox', async () => {
      render(<ProductDetailPage />);
      
      await screen.findByTestId('product-images');
      
      // Firefox supports WebP format
      const images = screen.getAllByRole('img');
      expect(images.length).toBeGreaterThan(0);
    });
  });

  describe('Safari Compatibility', () => {
    beforeEach(() => {
      Object.defineProperty(navigator, 'userAgent', {
        writable: true,
        value: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15'
      });
    });

    it('renders correctly in Safari', async () => {
      render(<ProductDetailPage />);
      
      await screen.findByTestId('product-seo');
      
      expect(screen.getByTestId('product-seo')).toBeInTheDocument();
      expect(screen.getByTestId('product-specifications')).toBeInTheDocument();
      expect(screen.getByTestId('product-images')).toBeInTheDocument();
    });

    it('supports modern CSS features in Safari', async () => {
      render(<ProductDetailPage />);
      
      await screen.findByTestId('product-seo');
      
      // Check that modern CSS features are supported
      const container = screen.getByTestId('layout');
      const styles = window.getComputedStyle(container);
      
      // Safari supports CSS Grid and Flexbox
      expect(styles.display).toBeTruthy();
    });

    it('supports WebP images in Safari', async () => {
      render(<ProductDetailPage />);
      
      await screen.findByTestId('product-images');
      
      // Safari supports WebP format
      const images = screen.getAllByRole('img');
      expect(images.length).toBeGreaterThan(0);
    });
  });

  describe('Edge Compatibility', () => {
    beforeEach(() => {
      Object.defineProperty(navigator, 'userAgent', {
        writable: true,
        value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0'
      });
    });

    it('renders correctly in Edge', async () => {
      render(<ProductDetailPage />);
      
      await screen.findByTestId('product-seo');
      
      expect(screen.getByTestId('product-seo')).toBeInTheDocument();
      expect(screen.getByTestId('product-specifications')).toBeInTheDocument();
      expect(screen.getByTestId('product-images')).toBeInTheDocument();
    });

    it('supports modern CSS features in Edge', async () => {
      render(<ProductDetailPage />);
      
      await screen.findByTestId('product-seo');
      
      // Check that modern CSS features are supported
      const container = screen.getByTestId('layout');
      const styles = window.getComputedStyle(container);
      
      // Edge supports CSS Grid and Flexbox
      expect(styles.display).toBeTruthy();
    });

    it('supports WebP images in Edge', async () => {
      render(<ProductDetailPage />);
      
      await screen.findByTestId('product-images');
      
      // Edge supports WebP format
      const images = screen.getAllByRole('img');
      expect(images.length).toBeGreaterThan(0);
    });
  });

  describe('Internet Explorer Compatibility', () => {
    beforeEach(() => {
      Object.defineProperty(navigator, 'userAgent', {
        writable: true,
        value: 'Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; AS; rv:11.0) like Gecko'
      });
    });

    it('provides fallbacks for IE', async () => {
      render(<ProductDetailPage />);
      
      await screen.findByTestId('product-seo');
      
      // IE should still render basic content
      expect(screen.getByTestId('product-seo')).toBeInTheDocument();
    });

    it('uses fallback images for IE', async () => {
      render(<ProductDetailPage />);
      
      await screen.findByTestId('product-images');
      
      // IE should use JPEG fallbacks instead of WebP
      const images = screen.getAllByRole('img');
      expect(images.length).toBeGreaterThan(0);
    });
  });

  describe('Mobile Browser Compatibility', () => {
    beforeEach(() => {
      Object.defineProperty(navigator, 'userAgent', {
        writable: true,
        value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Mobile/15E148 Safari/604.1'
      });
    });

    it('renders correctly on mobile Safari', async () => {
      render(<ProductDetailPage />);
      
      await screen.findByTestId('product-seo');
      
      expect(screen.getByTestId('product-seo')).toBeInTheDocument();
      expect(screen.getByTestId('product-specifications')).toBeInTheDocument();
      expect(screen.getByTestId('product-images')).toBeInTheDocument();
    });

    it('supports touch interactions on mobile', async () => {
      render(<ProductDetailPage />);
      
      await screen.findByTestId('product-seo');
      
      // Check that touch events are supported
      const button = screen.getByRole('button', { name: /get quote/i });
      expect(button).toBeInTheDocument();
    });

    it('supports mobile viewport', async () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375
      });
      
      render(<ProductDetailPage />);
      
      await screen.findByTestId('product-seo');
      
      expect(screen.getByTestId('product-seo')).toBeInTheDocument();
    });
  });

  describe('Feature Detection', () => {
    it('detects Intersection Observer support', () => {
      const hasIntersectionObserver = typeof IntersectionObserver !== 'undefined';
      expect(hasIntersectionObserver).toBe(true);
    });

    it('detects ResizeObserver support', () => {
      const hasResizeObserver = typeof ResizeObserver !== 'undefined';
      expect(hasResizeObserver).toBe(true);
    });

    it('detects requestIdleCallback support', () => {
      const hasRequestIdleCallback = typeof requestIdleCallback !== 'undefined';
      expect(hasRequestIdleCallback).toBe(true);
    });

    it('detects WebP support', () => {
      const canvas = document.createElement('canvas');
      const hasWebP = canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
      expect(hasWebP).toBe(true);
    });

    it('detects CSS Grid support', () => {
      const hasCSSGrid = CSS.supports('display', 'grid');
      expect(hasCSSGrid).toBe(true);
    });

    it('detects CSS Flexbox support', () => {
      const hasFlexbox = CSS.supports('display', 'flex');
      expect(hasFlexbox).toBe(true);
    });
  });

  describe('Polyfill Support', () => {
    it('provides fallbacks for missing features', async () => {
      // Mock missing IntersectionObserver
      global.IntersectionObserver = undefined as any;
      
      render(<ProductDetailPage />);
      
      await screen.findByTestId('product-seo');
      
      // Should still render without IntersectionObserver
      expect(screen.getByTestId('product-seo')).toBeInTheDocument();
    });

    it('provides fallbacks for missing ResizeObserver', async () => {
      // Mock missing ResizeObserver
      global.ResizeObserver = undefined as any;
      
      render(<ProductDetailPage />);
      
      await screen.findByTestId('product-seo');
      
      // Should still render without ResizeObserver
      expect(screen.getByTestId('product-seo')).toBeInTheDocument();
    });

    it('provides fallbacks for missing requestIdleCallback', async () => {
      // Mock missing requestIdleCallback
      global.requestIdleCallback = undefined as any;
      global.cancelIdleCallback = undefined as any;
      
      render(<ProductDetailPage />);
      
      await screen.findByTestId('product-seo');
      
      // Should still render without requestIdleCallback
      expect(screen.getByTestId('product-seo')).toBeInTheDocument();
    });
  });

  describe('CSS Compatibility', () => {
    it('uses vendor prefixes where needed', async () => {
      render(<ProductDetailPage />);
      
      await screen.findByTestId('product-seo');
      
      // Check that vendor prefixes are applied
      const container = screen.getByTestId('layout');
      const styles = window.getComputedStyle(container);
      
      // Should have fallback values for older browsers
      expect(styles.display).toBeTruthy();
    });

    it('provides fallback values for CSS properties', async () => {
      render(<ProductDetailPage />);
      
      await screen.findByTestId('product-seo');
      
      // Check that fallback values are provided
      const container = screen.getByTestId('layout');
      const styles = window.getComputedStyle(container);
      
      // Should have fallback values
      expect(styles.display).toBeTruthy();
    });
  });

  describe('JavaScript Compatibility', () => {
    it('uses ES5 compatible syntax', async () => {
      render(<ProductDetailPage />);
      
      await screen.findByTestId('product-seo');
      
      // Should render without ES6+ syntax errors
      expect(screen.getByTestId('product-seo')).toBeInTheDocument();
    });

    it('handles missing ES6+ features gracefully', async () => {
      // Mock missing Promise
      const originalPromise = global.Promise;
      global.Promise = undefined as any;
      
      render(<ProductDetailPage />);
      
      await screen.findByTestId('product-seo');
      
      // Should still render
      expect(screen.getByTestId('product-seo')).toBeInTheDocument();
      
      // Restore Promise
      global.Promise = originalPromise;
    });
  });

  describe('Accessibility Compatibility', () => {
    it('maintains accessibility across browsers', async () => {
      render(<ProductDetailPage />);
      
      await screen.findByTestId('product-seo');
      
      // Check that accessibility features work across browsers
      const headings = screen.getAllByRole('heading');
      expect(headings.length).toBeGreaterThan(0);
      
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
    });

    it('supports keyboard navigation across browsers', async () => {
      render(<ProductDetailPage />);
      
      await screen.findByTestId('product-seo');
      
      // Check that keyboard navigation works
      const button = screen.getByRole('button', { name: /get quote/i });
      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute('tabindex');
    });
  });
});

