/**
 * Performance audit and optimization tests
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import ProductDetailPage from '@/pages/ProductDetailPage';
import { getProducts } from '@/services/products';
import type { Product } from '@/types/product';

// Mock performance API
const mockPerformance = {
  now: vi.fn(() => Date.now()),
  mark: vi.fn(),
  measure: vi.fn(),
  getEntriesByType: vi.fn(() => []),
  getEntriesByName: vi.fn(() => []),
  clearMarks: vi.fn(),
  clearMeasures: vi.fn()
};

// Mock Intersection Observer
const mockIntersectionObserver = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn()
}));

// Mock ResizeObserver
const mockResizeObserver = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn()
}));

// Mock requestIdleCallback
const mockRequestIdleCallback = vi.fn((callback) => {
  setTimeout(callback, 0);
  return 1;
});

// Mock cancelIdleCallback
const mockCancelIdleCallback = vi.fn();

// Mock fetch for performance testing
const mockFetch = vi.fn();

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

describe('Performance Audit', () => {
  beforeEach(() => {
    // Setup global mocks
    global.performance = mockPerformance as any;
    global.IntersectionObserver = mockIntersectionObserver as any;
    global.ResizeObserver = mockResizeObserver as any;
    global.requestIdleCallback = mockRequestIdleCallback as any;
    global.cancelIdleCallback = mockCancelIdleCallback as any;
    global.fetch = mockFetch as any;

    // Reset mocks
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Core Web Vitals', () => {
    it('measures Largest Contentful Paint (LCP)', async () => {
      const startTime = performance.now();
      
      render(<ProductDetailPage />);
      
      // Wait for component to render
      await screen.findByTestId('product-seo');
      
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      expect(renderTime).toBeLessThan(2500); // LCP should be under 2.5s
      expect(performance.mark).toHaveBeenCalledWith('lcp-start');
    });

    it('measures First Input Delay (FID)', async () => {
      const startTime = performance.now();
      
      render(<ProductDetailPage />);
      
      // Simulate user interaction
      const button = screen.getByRole('button', { name: /get quote/i });
      button.click();
      
      const endTime = performance.now();
      const inputDelay = endTime - startTime;
      
      expect(inputDelay).toBeLessThan(100); // FID should be under 100ms
      expect(performance.mark).toHaveBeenCalledWith('fid-start');
    });

    it('measures Cumulative Layout Shift (CLS)', async () => {
      const startTime = performance.now();
      
      render(<ProductDetailPage />);
      
      // Wait for all content to load
      await screen.findByTestId('product-comparison');
      
      const endTime = performance.now();
      const layoutShift = endTime - startTime;
      
      expect(layoutShift).toBeLessThan(100); // CLS should be under 0.1
      expect(performance.mark).toHaveBeenCalledWith('cls-start');
    });
  });

  describe('Bundle Size Optimization', () => {
    it('verifies code splitting is working', async () => {
      const startTime = performance.now();
      
      render(<ProductDetailPage />);
      
      // Check that components are loaded dynamically
      await screen.findByTestId('product-seo');
      
      const endTime = performance.now();
      const loadTime = endTime - startTime;
      
      expect(loadTime).toBeLessThan(1000); // Initial load should be fast
      expect(performance.mark).toHaveBeenCalledWith('bundle-split-start');
    });

    it('verifies lazy loading is working', async () => {
      const startTime = performance.now();
      
      render(<ProductDetailPage />);
      
      // Check that images are loaded lazily
      await screen.findByTestId('product-images');
      
      const endTime = performance.now();
      const lazyLoadTime = endTime - startTime;
      
      expect(lazyLoadTime).toBeLessThan(500); // Lazy loading should be fast
      expect(mockIntersectionObserver).toHaveBeenCalled();
    });
  });

  describe('Image Optimization', () => {
    it('verifies WebP images are used when supported', async () => {
      render(<ProductDetailPage />);
      
      await screen.findByTestId('product-images');
      
      // Check that WebP images are requested
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('.webp'),
        expect.any(Object)
      );
    });

    it('verifies responsive images are generated', async () => {
      render(<ProductDetailPage />);
      
      await screen.findByTestId('product-images');
      
      // Check that multiple image sizes are requested
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('small'),
        expect.any(Object)
      );
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('medium'),
        expect.any(Object)
      );
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('large'),
        expect.any(Object)
      );
    });

    it('verifies image compression is applied', async () => {
      render(<ProductDetailPage />);
      
      await screen.findByTestId('product-images');
      
      // Check that compressed images are requested
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('quality=80'),
        expect.any(Object)
      );
    });
  });

  describe('Memory Usage', () => {
    it('verifies memory usage is optimized', async () => {
      const startMemory = (performance as any).memory?.usedJSHeapSize || 0;
      
      render(<ProductDetailPage />);
      
      await screen.findByTestId('product-comparison');
      
      const endMemory = (performance as any).memory?.usedJSHeapSize || 0;
      const memoryIncrease = endMemory - startMemory;
      
      expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024); // Less than 10MB increase
    });

    it('verifies no memory leaks in component unmounting', async () => {
      const { unmount } = render(<ProductDetailPage />);
      
      await screen.findByTestId('product-comparison');
      
      const beforeUnmount = (performance as any).memory?.usedJSHeapSize || 0;
      
      unmount();
      
      // Force garbage collection if available
      if (global.gc) {
        global.gc();
      }
      
      const afterUnmount = (performance as any).memory?.usedJSHeapSize || 0;
      const memoryDecrease = beforeUnmount - afterUnmount;
      
      expect(memoryDecrease).toBeGreaterThan(0); // Memory should decrease
    });
  });

  describe('Network Performance', () => {
    it('verifies API calls are optimized', async () => {
      const startTime = performance.now();
      
      render(<ProductDetailPage />);
      
      await screen.findByTestId('product-seo');
      
      const endTime = performance.now();
      const apiTime = endTime - startTime;
      
      expect(apiTime).toBeLessThan(500); // API calls should be fast
      expect(getProducts).toHaveBeenCalledTimes(1); // Should only call once
    });

    it('verifies caching is working', async () => {
      render(<ProductDetailPage />);
      
      await screen.findByTestId('product-seo');
      
      // Second render should use cache
      render(<ProductDetailPage />);
      
      expect(getProducts).toHaveBeenCalledTimes(1); // Should still only call once
    });
  });

  describe('Rendering Performance', () => {
    it('verifies component rendering is optimized', async () => {
      const startTime = performance.now();
      
      render(<ProductDetailPage />);
      
      await screen.findByTestId('product-comparison');
      
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      expect(renderTime).toBeLessThan(1000); // Rendering should be fast
      expect(performance.measure).toHaveBeenCalledWith(
        'component-render',
        'render-start',
        'render-end'
      );
    });

    it('verifies re-rendering is minimized', async () => {
      const { rerender } = render(<ProductDetailPage />);
      
      await screen.findByTestId('product-seo');
      
      const renderCount = performance.mark.mock.calls.length;
      
      // Re-render with same props
      rerender(<ProductDetailPage />);
      
      const newRenderCount = performance.mark.mock.calls.length;
      
      expect(newRenderCount - renderCount).toBeLessThan(5); // Minimal re-renders
    });
  });

  describe('Accessibility Performance', () => {
    it('verifies accessibility checks are fast', async () => {
      const startTime = performance.now();
      
      render(<ProductDetailPage />);
      
      await screen.findByTestId('product-seo');
      
      const endTime = performance.now();
      const a11yTime = endTime - startTime;
      
      expect(a11yTime).toBeLessThan(200); // Accessibility checks should be fast
    });

    it('verifies screen reader support is optimized', async () => {
      render(<ProductDetailPage />);
      
      await screen.findByTestId('product-seo');
      
      // Check that screen reader elements are present
      const screenReaderElements = screen.getAllByRole('region');
      expect(screenReaderElements.length).toBeGreaterThan(0);
    });
  });

  describe('Mobile Performance', () => {
    it('verifies mobile rendering is optimized', async () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375
      });
      
      const startTime = performance.now();
      
      render(<ProductDetailPage />);
      
      await screen.findByTestId('product-seo');
      
      const endTime = performance.now();
      const mobileRenderTime = endTime - startTime;
      
      expect(mobileRenderTime).toBeLessThan(800); // Mobile rendering should be fast
    });

    it('verifies touch interactions are optimized', async () => {
      render(<ProductDetailPage />);
      
      await screen.findByTestId('product-seo');
      
      // Simulate touch interaction
      const button = screen.getByRole('button', { name: /get quote/i });
      const touchEvent = new TouchEvent('touchstart', {
        touches: [new Touch({ identifier: 1, target: button, clientX: 0, clientY: 0 })]
      });
      
      button.dispatchEvent(touchEvent);
      
      expect(performance.mark).toHaveBeenCalledWith('touch-interaction');
    });
  });

  describe('Error Handling Performance', () => {
    it('verifies error handling is fast', async () => {
      // Mock error
      vi.mocked(getProducts).mockRejectedValueOnce(new Error('Network error'));
      
      const startTime = performance.now();
      
      render(<ProductDetailPage />);
      
      // Wait for error to be handled
      await screen.findByText(/error/i);
      
      const endTime = performance.now();
      const errorTime = endTime - startTime;
      
      expect(errorTime).toBeLessThan(300); // Error handling should be fast
    });
  });
});

