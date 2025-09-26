import { describe, it, expect, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';
import { ProductDetailPage } from '../../src/pages/ProductDetailPage';

// Mock product data for SEO testing
const mockProduct = {
  id: 'red-sal-wood',
  slug: 'red-sal-wood',
  name: 'Red Sal Wood',
  scientificName: 'Shorea robusta',
  category: 'hardwood',
  origin: 'India',
  description: 'Premium hardwood timber sourced from the Shorea robusta species, known for its distinctive reddish-brown color and exceptional strength properties.',
  shortDescription: 'Premium hardwood with exceptional strength and durability',
  keyFeatures: ['High strength', 'Moisture resistant', 'Insect resistant'],
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
    primary: ['Structural work', 'Railway sleepers'],
    secondary: ['Bridge construction', 'Flooring'],
    notRecommended: ['Fine furniture']
  },
  qualityGrades: ['Grade A', 'Grade B'],
  certifications: ['FSC Certified'],
  sustainability: {
    source: 'sustainable',
    certification: 'FSC'
  },
  pricing: {
    basePrice: 1500,
    unit: 'cubic-foot',
    bulkDiscounts: [
      { minQuantity: 10, discountPercentage: 5 }
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
    gallery: []
  },
  seo: {
    metaTitle: 'Red Sal Wood - Premium Hardwood Timber | New India Timbers',
    metaDescription: 'Buy premium Red Sal Wood (Shorea robusta) timber. High strength, moisture resistant hardwood perfect for construction and structural applications. FSC certified.',
    keywords: [
      'red sal wood',
      'shorea robusta timber',
      'construction hardwood',
      'railway sleeper wood',
      'structural timber',
      'moisture resistant wood',
      'FSC certified timber'
    ],
    canonicalUrl: 'https://newindiatimber.com/products/red-sal-wood',
    ogTitle: 'Red Sal Wood - Premium Hardwood Timber',
    ogDescription: 'Premium Red Sal Wood timber for construction applications',
    ogImage: 'https://newindiatimber.com/images/products/red-sal-wood/hero.webp',
    twitterCard: 'summary_large_image',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: 'Red Sal Wood',
      description: 'Premium hardwood timber sourced from the Shorea robusta species',
      image: [
        'https://newindiatimber.com/images/products/red-sal-wood/hero.webp'
      ],
      brand: {
        '@type': 'Brand',
        name: 'New India Timbers'
      },
      offers: {
        '@type': 'Offer',
        price: 1500,
        priceCurrency: 'INR',
        availability: 'InStock'
      }
    }
  },
  relatedProducts: ['australia-honne-wood', 'mahogany-wood'],
  createdAt: '2025-01-27T00:00:00Z',
  updatedAt: '2025-01-27T00:00:00Z',
  published: true,
  featured: true
};

// Mock the product data loading
vi.mock('../../src/data/products.json', () => ({
  default: [mockProduct]
}));

// Helper function to get meta tags from document head
const getMetaTag = (name: string, property?: string) => {
  const selector = property ? `meta[property="${property}"]` : `meta[name="${name}"]`;
  return document.querySelector(selector) as HTMLMetaElement;
};

// Helper function to get structured data from script tags
const getStructuredData = () => {
  const script = document.querySelector('script[type="application/ld+json"]') as HTMLScriptElement;
  return script ? JSON.parse(script.textContent || '{}') : null;
};

// Mock React Router and Helmet
const MockRouter = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    <HelmetProvider>
      {children}
    </HelmetProvider>
  </BrowserRouter>
);

describe('SEO Meta Tags Integration Tests', () => {
  beforeEach(() => {
    // Clear document head before each test
    document.head.innerHTML = '';
    vi.clearAllMocks();
  });

  it('should render correct meta title', () => {
    render(
      <MockRouter>
        <ProductDetailPage />
      </MockRouter>
    );

    const titleTag = document.querySelector('title');
    expect(titleTag).toBeInTheDocument();
    expect(titleTag?.textContent).toBe('Red Sal Wood - Premium Hardwood Timber | New India Timbers');
  });

  it('should render meta description with correct length', () => {
    render(
      <MockRouter>
        <ProductDetailPage />
      </MockRouter>
    );

    const metaDescription = getMetaTag('description');
    expect(metaDescription).toBeInTheDocument();
    expect(metaDescription?.content).toBe('Buy premium Red Sal Wood (Shorea robusta) timber. High strength, moisture resistant hardwood perfect for construction and structural applications. FSC certified.');
    expect(metaDescription?.content?.length).toBeGreaterThanOrEqual(120);
    expect(metaDescription?.content?.length).toBeLessThanOrEqual(160);
  });

  it('should render meta keywords', () => {
    render(
      <MockRouter>
        <ProductDetailPage />
      </MockRouter>
    );

    const metaKeywords = getMetaTag('keywords');
    expect(metaKeywords).toBeInTheDocument();
    expect(metaKeywords?.content).toContain('red sal wood');
    expect(metaKeywords?.content).toContain('shorea robusta timber');
    expect(metaKeywords?.content).toContain('construction hardwood');
  });

  it('should render canonical URL', () => {
    render(
      <MockRouter>
        <ProductDetailPage />
      </MockRouter>
    );

    const canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    expect(canonicalLink).toBeInTheDocument();
    expect(canonicalLink?.href).toBe('https://newindiatimber.com/products/red-sal-wood');
  });

  it('should render Open Graph meta tags', () => {
    render(
      <MockRouter>
        <ProductDetailPage />
      </MockRouter>
    );

    // Check Open Graph title
    const ogTitle = getMetaTag('', 'og:title');
    expect(ogTitle).toBeInTheDocument();
    expect(ogTitle?.content).toBe('Red Sal Wood - Premium Hardwood Timber');

    // Check Open Graph description
    const ogDescription = getMetaTag('', 'og:description');
    expect(ogDescription).toBeInTheDocument();
    expect(ogDescription?.content).toBe('Premium Red Sal Wood timber for construction applications');

    // Check Open Graph image
    const ogImage = getMetaTag('', 'og:image');
    expect(ogImage).toBeInTheDocument();
    expect(ogImage?.content).toBe('https://newindiatimber.com/images/products/red-sal-wood/hero.webp');

    // Check Open Graph URL
    const ogUrl = getMetaTag('', 'og:url');
    expect(ogUrl).toBeInTheDocument();
    expect(ogUrl?.content).toBe('https://newindiatimber.com/products/red-sal-wood');

    // Check Open Graph type
    const ogType = getMetaTag('', 'og:type');
    expect(ogType).toBeInTheDocument();
    expect(ogType?.content).toBe('product');
  });

  it('should render Twitter Card meta tags', () => {
    render(
      <MockRouter>
        <ProductDetailPage />
      </MockRouter>
    );

    // Check Twitter Card type
    const twitterCard = getMetaTag('twitter:card');
    expect(twitterCard).toBeInTheDocument();
    expect(twitterCard?.content).toBe('summary_large_image');

    // Check Twitter title
    const twitterTitle = getMetaTag('twitter:title');
    expect(twitterTitle).toBeInTheDocument();
    expect(twitterTitle?.content).toBe('Red Sal Wood - Premium Hardwood Timber');

    // Check Twitter description
    const twitterDescription = getMetaTag('twitter:description');
    expect(twitterDescription).toBeInTheDocument();
    expect(twitterDescription?.content).toBe('Premium Red Sal Wood timber for construction applications');

    // Check Twitter image
    const twitterImage = getMetaTag('twitter:image');
    expect(twitterImage).toBeInTheDocument();
    expect(twitterImage?.content).toBe('https://newindiatimber.com/images/products/red-sal-wood/hero.webp');
  });

  it('should render structured data (JSON-LD)', () => {
    render(
      <MockRouter>
        <ProductDetailPage />
      </MockRouter>
    );

    const structuredData = getStructuredData();
    expect(structuredData).toBeTruthy();
    expect(structuredData['@context']).toBe('https://schema.org');
    expect(structuredData['@type']).toBe('Product');
    expect(structuredData.name).toBe('Red Sal Wood');
    expect(structuredData.description).toBe('Premium hardwood timber sourced from the Shorea robusta species');
    expect(structuredData.image).toEqual(['https://newindiatimber.com/images/products/red-sal-wood/hero.webp']);
    expect(structuredData.brand['@type']).toBe('Brand');
    expect(structuredData.brand.name).toBe('New India Timbers');
    expect(structuredData.offers['@type']).toBe('Offer');
    expect(structuredData.offers.price).toBe(1500);
    expect(structuredData.offers.priceCurrency).toBe('INR');
    expect(structuredData.offers.availability).toBe('InStock');
  });

  it('should validate meta title length requirements', () => {
    render(
      <MockRouter>
        <ProductDetailPage />
      </MockRouter>
    );

    const titleTag = document.querySelector('title');
    const titleLength = titleTag?.textContent?.length || 0;
    
    expect(titleLength).toBeGreaterThanOrEqual(30);
    expect(titleLength).toBeLessThanOrEqual(60);
  });

  it('should validate meta description length requirements', () => {
    render(
      <MockRouter>
        <ProductDetailPage />
      </MockRouter>
    );

    const metaDescription = getMetaTag('description');
    const descriptionLength = metaDescription?.content?.length || 0;
    
    expect(descriptionLength).toBeGreaterThanOrEqual(120);
    expect(descriptionLength).toBeLessThanOrEqual(160);
  });

  it('should render robots meta tag', () => {
    render(
      <MockRouter>
        <ProductDetailPage />
      </MockRouter>
    );

    const robotsTag = getMetaTag('robots');
    expect(robotsTag).toBeInTheDocument();
    expect(robotsTag?.content).toContain('index');
    expect(robotsTag?.content).toContain('follow');
  });

  it('should render viewport meta tag for mobile', () => {
    render(
      <MockRouter>
        <ProductDetailPage />
      </MockRouter>
    );

    const viewportTag = getMetaTag('viewport');
    expect(viewportTag).toBeInTheDocument();
    expect(viewportTag?.content).toContain('width=device-width');
    expect(viewportTag?.content).toContain('initial-scale=1');
  });

  it('should render charset meta tag', () => {
    render(
      <MockRouter>
        <ProductDetailPage />
      </MockRouter>
    );

    const charsetTag = document.querySelector('meta[charset]') as HTMLMetaElement;
    expect(charsetTag).toBeInTheDocument();
    expect(charsetTag?.charset).toBe('utf-8');
  });

  it('should handle missing SEO data gracefully', () => {
    // Mock product with minimal SEO data
    const minimalProduct = {
      ...mockProduct,
      seo: {
        metaTitle: 'Red Sal Wood',
        metaDescription: 'Premium hardwood timber',
        keywords: ['red sal wood'],
        canonicalUrl: 'https://newindiatimber.com/products/red-sal-wood',
        structuredData: {
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: 'Red Sal Wood'
        }
      }
    };

    vi.mocked(require('../../src/data/products.json')).default = [minimalProduct];

    render(
      <MockRouter>
        <ProductDetailPage />
      </MockRouter>
    );

    // Should still render basic meta tags
    const titleTag = document.querySelector('title');
    expect(titleTag?.textContent).toBe('Red Sal Wood');

    const metaDescription = getMetaTag('description');
    expect(metaDescription?.content).toBe('Premium hardwood timber');
  });

  it('should render language meta tag', () => {
    render(
      <MockRouter>
        <ProductDetailPage />
      </MockRouter>
    );

    const htmlTag = document.querySelector('html') as HTMLHtmlElement;
    expect(htmlTag).toBeInTheDocument();
    expect(htmlTag?.lang).toBe('en');
  });

  it('should render author meta tag', () => {
    render(
      <MockRouter>
        <ProductDetailPage />
      </MockRouter>
    );

    const authorTag = getMetaTag('author');
    expect(authorTag).toBeInTheDocument();
    expect(authorTag?.content).toBe('New India Timbers');
  });
});

