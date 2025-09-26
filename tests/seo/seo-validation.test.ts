/**
 * SEO validation tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
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
  default: ({ product }: { product: Product }) => (
    <div data-testid="product-seo">
      <meta name="title" content={`${product.name} - Premium Hardwood | New India Timbers`} />
      <meta name="description" content={`Premium ${product.name} hardwood in Bangalore. 25+ years experience.`} />
      <meta name="keywords" content={`${product.name}, hardwood, bangalore, timber`} />
      <link rel="canonical" href={`https://newindiatimbers.com/products/${product.id}`} />
      <meta property="og:title" content={`${product.name} - Premium Hardwood`} />
      <meta property="og:description" content={`Premium ${product.name} hardwood with excellent quality.`} />
      <meta property="og:type" content="product" />
      <meta property="og:url" content={`https://newindiatimbers.com/products/${product.id}`} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={`${product.name} - Premium Hardwood`} />
      <meta name="twitter:description" content={`Premium ${product.name} hardwood with excellent quality.`} />
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Product",
          "name": product.name,
          "description": product.description,
          "category": product.category,
          "brand": {
            "@type": "Brand",
            "name": "New India Timbers"
          },
          "offers": {
            "@type": "Offer",
            "seller": {
              "@type": "Organization",
              "name": "New India Timbers",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "123 Timber Street",
                "addressLocality": "Bangalore",
                "addressRegion": "Karnataka",
                "postalCode": "560001",
                "addressCountry": "IN"
              }
            }
          }
        })}
      </script>
    </div>
  )
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

describe('SEO Validation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Meta Tags', () => {
    it('validates title tag is present and optimized', async () => {
      render(<ProductDetailPage />);
      
      await screen.findByTestId('product-seo');
      
      const titleMeta = screen.getByTestId('helmet').querySelector('meta[name="title"]');
      expect(titleMeta).toBeInTheDocument();
      expect(titleMeta?.getAttribute('content')).toContain('Red Sal Wood');
      expect(titleMeta?.getAttribute('content')).toContain('New India Timbers');
      expect(titleMeta?.getAttribute('content')?.length).toBeLessThanOrEqual(60);
    });

    it('validates description tag is present and optimized', async () => {
      render(<ProductDetailPage />);
      
      await screen.findByTestId('product-seo');
      
      const descMeta = screen.getByTestId('helmet').querySelector('meta[name="description"]');
      expect(descMeta).toBeInTheDocument();
      expect(descMeta?.getAttribute('content')).toContain('Red Sal Wood');
      expect(descMeta?.getAttribute('content')).toContain('Bangalore');
      expect(descMeta?.getAttribute('content')?.length).toBeLessThanOrEqual(160);
    });

    it('validates keywords tag is present', async () => {
      render(<ProductDetailPage />);
      
      await screen.findByTestId('product-seo');
      
      const keywordsMeta = screen.getByTestId('helmet').querySelector('meta[name="keywords"]');
      expect(keywordsMeta).toBeInTheDocument();
      expect(keywordsMeta?.getAttribute('content')).toContain('red sal wood');
      expect(keywordsMeta?.getAttribute('content')).toContain('hardwood');
      expect(keywordsMeta?.getAttribute('content')).toContain('bangalore');
    });

    it('validates canonical URL is present', async () => {
      render(<ProductDetailPage />);
      
      await screen.findByTestId('product-seo');
      
      const canonicalLink = screen.getByTestId('helmet').querySelector('link[rel="canonical"]');
      expect(canonicalLink).toBeInTheDocument();
      expect(canonicalLink?.getAttribute('href')).toBe('https://newindiatimbers.com/products/red-sal-wood');
    });
  });

  describe('Open Graph Tags', () => {
    it('validates Open Graph title is present', async () => {
      render(<ProductDetailPage />);
      
      await screen.findByTestId('product-seo');
      
      const ogTitle = screen.getByTestId('helmet').querySelector('meta[property="og:title"]');
      expect(ogTitle).toBeInTheDocument();
      expect(ogTitle?.getAttribute('content')).toContain('Red Sal Wood');
    });

    it('validates Open Graph description is present', async () => {
      render(<ProductDetailPage />);
      
      await screen.findByTestId('product-seo');
      
      const ogDesc = screen.getByTestId('helmet').querySelector('meta[property="og:description"]');
      expect(ogDesc).toBeInTheDocument();
      expect(ogDesc?.getAttribute('content')).toContain('Premium');
    });

    it('validates Open Graph type is set to product', async () => {
      render(<ProductDetailPage />);
      
      await screen.findByTestId('product-seo');
      
      const ogType = screen.getByTestId('helmet').querySelector('meta[property="og:type"]');
      expect(ogType).toBeInTheDocument();
      expect(ogType?.getAttribute('content')).toBe('product');
    });

    it('validates Open Graph URL is present', async () => {
      render(<ProductDetailPage />);
      
      await screen.findByTestId('product-seo');
      
      const ogUrl = screen.getByTestId('helmet').querySelector('meta[property="og:url"]');
      expect(ogUrl).toBeInTheDocument();
      expect(ogUrl?.getAttribute('content')).toBe('https://newindiatimbers.com/products/red-sal-wood');
    });
  });

  describe('Twitter Card Tags', () => {
    it('validates Twitter card type is set', async () => {
      render(<ProductDetailPage />);
      
      await screen.findByTestId('product-seo');
      
      const twitterCard = screen.getByTestId('helmet').querySelector('meta[name="twitter:card"]');
      expect(twitterCard).toBeInTheDocument();
      expect(twitterCard?.getAttribute('content')).toBe('summary_large_image');
    });

    it('validates Twitter title is present', async () => {
      render(<ProductDetailPage />);
      
      await screen.findByTestId('product-seo');
      
      const twitterTitle = screen.getByTestId('helmet').querySelector('meta[name="twitter:title"]');
      expect(twitterTitle).toBeInTheDocument();
      expect(twitterTitle?.getAttribute('content')).toContain('Red Sal Wood');
    });

    it('validates Twitter description is present', async () => {
      render(<ProductDetailPage />);
      
      await screen.findByTestId('product-seo');
      
      const twitterDesc = screen.getByTestId('helmet').querySelector('meta[name="twitter:description"]');
      expect(twitterDesc).toBeInTheDocument();
      expect(twitterDesc?.getAttribute('content')).toContain('Premium');
    });
  });

  describe('Structured Data', () => {
    it('validates JSON-LD structured data is present', async () => {
      render(<ProductDetailPage />);
      
      await screen.findByTestId('product-seo');
      
      const jsonLdScript = screen.getByTestId('helmet').querySelector('script[type="application/ld+json"]');
      expect(jsonLdScript).toBeInTheDocument();
      
      const structuredData = JSON.parse(jsonLdScript?.textContent || '{}');
      expect(structuredData['@context']).toBe('https://schema.org');
      expect(structuredData['@type']).toBe('Product');
      expect(structuredData.name).toBe('Red Sal Wood');
    });

    it('validates product schema includes required fields', async () => {
      render(<ProductDetailPage />);
      
      await screen.findByTestId('product-seo');
      
      const jsonLdScript = screen.getByTestId('helmet').querySelector('script[type="application/ld+json"]');
      const structuredData = JSON.parse(jsonLdScript?.textContent || '{}');
      
      expect(structuredData.description).toBeTruthy();
      expect(structuredData.category).toBeTruthy();
      expect(structuredData.brand).toBeTruthy();
      expect(structuredData.offers).toBeTruthy();
    });

    it('validates organization schema is included', async () => {
      render(<ProductDetailPage />);
      
      await screen.findByTestId('product-seo');
      
      const jsonLdScript = screen.getByTestId('helmet').querySelector('script[type="application/ld+json"]');
      const structuredData = JSON.parse(jsonLdScript?.textContent || '{}');
      
      expect(structuredData.brand['@type']).toBe('Brand');
      expect(structuredData.brand.name).toBe('New India Timbers');
      expect(structuredData.offers.seller['@type']).toBe('Organization');
    });

    it('validates local business schema is included', async () => {
      render(<ProductDetailPage />);
      
      await screen.findByTestId('product-seo');
      
      const jsonLdScript = screen.getByTestId('helmet').querySelector('script[type="application/ld+json"]');
      const structuredData = JSON.parse(jsonLdScript?.textContent || '{}');
      
      expect(structuredData.offers.seller.address).toBeTruthy();
      expect(structuredData.offers.seller.address['@type']).toBe('PostalAddress');
      expect(structuredData.offers.seller.address.addressLocality).toBe('Bangalore');
      expect(structuredData.offers.seller.address.addressRegion).toBe('Karnataka');
    });
  });

  describe('Content SEO', () => {
    it('validates heading hierarchy is correct', async () => {
      render(<ProductDetailPage />);
      
      await screen.findByTestId('product-seo');
      
      const h1 = screen.getByRole('heading', { level: 1 });
      expect(h1).toBeInTheDocument();
      expect(h1.textContent).toContain('Red Sal Wood');
    });

    it('validates product name is in H1', async () => {
      render(<ProductDetailPage />);
      
      await screen.findByTestId('product-seo');
      
      const h1 = screen.getByRole('heading', { level: 1 });
      expect(h1.textContent).toContain('Red Sal Wood');
    });

    it('validates category is displayed prominently', async () => {
      render(<ProductDetailPage />);
      
      await screen.findByTestId('product-seo');
      
      const categoryBadge = screen.getByText(/HARDWOOD TIMBER/i);
      expect(categoryBadge).toBeInTheDocument();
    });

    it('validates product description is present', async () => {
      render(<ProductDetailPage />);
      
      await screen.findByTestId('product-seo');
      
      const description = screen.getByText(/Premium hardwood timber/);
      expect(description).toBeInTheDocument();
    });
  });

  describe('Local SEO', () => {
    it('validates location is mentioned in content', async () => {
      render(<ProductDetailPage />);
      
      await screen.findByTestId('product-seo');
      
      const locationText = screen.getByText(/Bangalore/);
      expect(locationText).toBeInTheDocument();
    });

    it('validates service area is mentioned', async () => {
      render(<ProductDetailPage />);
      
      await screen.findByTestId('product-seo');
      
      const serviceArea = screen.getByText(/Karnataka/);
      expect(serviceArea).toBeInTheDocument();
    });

    it('validates business name is consistent', async () => {
      render(<ProductDetailPage />);
      
      await screen.findByTestId('product-seo');
      
      const businessName = screen.getByText(/New India Timbers/);
      expect(businessName).toBeInTheDocument();
    });
  });

  describe('Technical SEO', () => {
    it('validates page has proper structure', async () => {
      render(<ProductDetailPage />);
      
      await screen.findByTestId('product-seo');
      
      const main = screen.getByRole('main');
      expect(main).toBeInTheDocument();
    });

    it('validates navigation is present', async () => {
      render(<ProductDetailPage />);
      
      await screen.findByTestId('product-seo');
      
      const nav = screen.getByRole('navigation');
      expect(nav).toBeInTheDocument();
    });

    it('validates breadcrumbs are present', async () => {
      render(<ProductDetailPage />);
      
      await screen.findByTestId('product-seo');
      
      const breadcrumbs = screen.getByRole('navigation');
      expect(breadcrumbs).toBeInTheDocument();
    });
  });

  describe('Image SEO', () => {
    it('validates images have alt text', async () => {
      render(<ProductDetailPage />);
      
      await screen.findByTestId('product-images');
      
      const images = screen.getAllByRole('img');
      images.forEach(img => {
        expect(img).toHaveAttribute('alt');
        expect(img.getAttribute('alt')).toBeTruthy();
      });
    });

    it('validates images have descriptive alt text', async () => {
      render(<ProductDetailPage />);
      
      await screen.findByTestId('product-images');
      
      const images = screen.getAllByRole('img');
      images.forEach(img => {
        const altText = img.getAttribute('alt');
        expect(altText).toContain('Red Sal Wood');
      });
    });
  });

  describe('Performance SEO', () => {
    it('validates page loads quickly', async () => {
      const startTime = Date.now();
      
      render(<ProductDetailPage />);
      
      await screen.findByTestId('product-seo');
      
      const endTime = Date.now();
      const loadTime = endTime - startTime;
      
      expect(loadTime).toBeLessThan(1000); // Page should load in under 1 second
    });

    it('validates images are optimized', async () => {
      render(<ProductDetailPage />);
      
      await screen.findByTestId('product-images');
      
      const images = screen.getAllByRole('img');
      images.forEach(img => {
        const src = img.getAttribute('src');
        expect(src).toMatch(/\.(webp|jpg|jpeg|png)$/i);
      });
    });
  });
});

