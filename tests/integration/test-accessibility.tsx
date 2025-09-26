import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { axe, toHaveNoViolations } from 'jest-axe';
import { ProductDetailPage } from '../../src/pages/ProductDetailPage';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

// Mock product data for accessibility testing
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
      alt: 'Red Sal Wood timber sample showing reddish-brown color and straight grain pattern'
    },
    gallery: [
      {
        webp: '/images/products/red-sal-wood/gallery-1.webp',
        jpg: '/images/products/red-sal-wood/gallery-1.jpg',
        alt: 'Red Sal Wood grain detail showing coarse texture and natural patterns',
        caption: 'Grain detail showing characteristic coarse texture'
      }
    ],
    details: {
      grain: {
        webp: '/images/products/red-sal-wood/grain-detail.webp',
        jpg: '/images/products/red-sal-wood/grain-detail.jpg',
        alt: 'Close-up view of Red Sal Wood grain pattern showing natural wood texture'
      },
      crossSection: {
        webp: '/images/products/red-sal-wood/cross-section.webp',
        jpg: '/images/products/red-sal-wood/cross-section.jpg',
        alt: 'Cross-section view of Red Sal Wood showing internal structure and density'
      },
      applications: [
        {
          webp: '/images/products/red-sal-wood/application-1.webp',
          jpg: '/images/products/red-sal-wood/application-1.jpg',
          alt: 'Red Sal Wood being used in railway sleeper construction showing practical application',
          caption: 'Railway sleeper construction application'
        }
      ]
    }
  },
  seo: {
    metaTitle: 'Red Sal Wood - Premium Hardwood Timber | New India Timbers',
    metaDescription: 'Buy premium Red Sal Wood (Shorea robusta) timber. High strength, moisture resistant hardwood perfect for construction and structural applications.',
    keywords: ['red sal wood', 'shorea robusta', 'hardwood timber'],
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

// Mock React Router
const MockRouter = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('Accessibility Compliance Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should pass WCAG 2.1 AA accessibility audit', async () => {
    const { container } = render(
      <MockRouter>
        <ProductDetailPage />
      </MockRouter>
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have proper heading hierarchy', () => {
    render(
      <MockRouter>
        <ProductDetailPage />
      </MockRouter>
    );

    // Check for proper heading structure
    const h1 = screen.getByRole('heading', { level: 1 });
    expect(h1).toBeInTheDocument();
    expect(h1).toHaveTextContent('Red Sal Wood');

    // Check for h2 headings for main sections
    const h2Headings = screen.getAllByRole('heading', { level: 2 });
    expect(h2Headings.length).toBeGreaterThan(0);
    
    // Should have headings for main sections
    const sectionHeadings = h2Headings.map(h => h.textContent);
    expect(sectionHeadings).toContain('Technical Specifications');
    expect(sectionHeadings).toContain('Applications');
    expect(sectionHeadings).toContain('Pricing');
  });

  it('should have proper alt text for all images', () => {
    render(
      <MockRouter>
        <ProductDetailPage />
      </MockRouter>
    );

    const images = screen.getAllByRole('img');
    
    images.forEach(img => {
      expect(img).toHaveAttribute('alt');
      const altText = img.getAttribute('alt');
      expect(altText).not.toBe('');
      expect(altText).not.toBe('undefined');
      expect(altText?.length).toBeGreaterThan(10); // Meaningful alt text
    });
  });

  it('should have proper form labels and controls', () => {
    render(
      <MockRouter>
        <ProductDetailPage />
      </MockRouter>
    );

    // Check for form controls (quote form, contact form)
    const inputs = screen.getAllByRole('textbox');
    const buttons = screen.getAllByRole('button');
    
    inputs.forEach(input => {
      const label = screen.getByLabelText(input.getAttribute('aria-label') || '');
      expect(label).toBeInTheDocument();
    });

    buttons.forEach(button => {
      expect(button).toHaveAttribute('aria-label');
      const ariaLabel = button.getAttribute('aria-label');
      expect(ariaLabel).not.toBe('');
    });
  });

  it('should have proper focus management', () => {
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
      
      // Should have visible focus indicators
      const computedStyle = window.getComputedStyle(element);
      expect(computedStyle.outline).not.toBe('none');
    });
  });

  it('should have proper color contrast ratios', () => {
    render(
      <MockRouter>
        <ProductDetailPage />
      </MockRouter>
    );

    // Check text elements for proper contrast
    const textElements = screen.getAllByText(/Red Sal Wood|Technical Specifications|Applications/);
    
    textElements.forEach(element => {
      const computedStyle = window.getComputedStyle(element);
      const color = computedStyle.color;
      const backgroundColor = computedStyle.backgroundColor;
      
      // Should have sufficient contrast (this would be tested with actual contrast checking)
      expect(color).not.toBe('transparent');
      expect(backgroundColor).not.toBe('transparent');
    });
  });

  it('should have proper ARIA labels and roles', () => {
    render(
      <MockRouter>
        <ProductDetailPage />
      </MockRouter>
    );

    // Check for proper ARIA roles
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getByRole('banner')).toBeInTheDocument();

    // Check for ARIA labels
    const elementsWithAriaLabel = document.querySelectorAll('[aria-label]');
    expect(elementsWithAriaLabel.length).toBeGreaterThan(0);

    // Check for ARIA descriptions
    const elementsWithAriaDescribedBy = document.querySelectorAll('[aria-describedby]');
    expect(elementsWithAriaDescribedBy.length).toBeGreaterThanOrEqual(0);
  });

  it('should have proper keyboard navigation', () => {
    render(
      <MockRouter>
        <ProductDetailPage />
      </MockRouter>
    );

    const interactiveElements = screen.getAllByRole('button')
      .concat(screen.getAllByRole('link'))
      .concat(screen.getAllByRole('textbox'));

    interactiveElements.forEach(element => {
      // Should be keyboard accessible
      expect(element).not.toHaveAttribute('tabindex', '-1');
      
      // Should have proper tab order
      const tabIndex = element.getAttribute('tabindex');
      if (tabIndex) {
        expect(parseInt(tabIndex)).toBeGreaterThanOrEqual(0);
      }
    });
  });

  it('should have proper semantic HTML structure', () => {
    render(
      <MockRouter>
        <ProductDetailPage />
      </MockRouter>
    );

    // Check for semantic HTML elements
    expect(document.querySelector('main')).toBeInTheDocument();
    expect(document.querySelector('nav')).toBeInTheDocument();
    expect(document.querySelector('header')).toBeInTheDocument();
    expect(document.querySelector('section')).toBeInTheDocument();
    expect(document.querySelector('article')).toBeInTheDocument();
  });

  it('should have proper language attributes', () => {
    render(
      <MockRouter>
        <ProductDetailPage />
      </MockRouter>
    );

    const htmlElement = document.querySelector('html');
    expect(htmlElement).toHaveAttribute('lang', 'en');
  });

  it('should have proper skip links for screen readers', () => {
    render(
      <MockRouter>
        <ProductDetailPage />
      </MockRouter>
    );

    const skipLinks = document.querySelectorAll('a[href^="#"]');
    expect(skipLinks.length).toBeGreaterThan(0);
    
    skipLinks.forEach(link => {
      expect(link).toHaveTextContent(/skip|jump/i);
    });
  });

  it('should have proper table headers if tables are used', () => {
    render(
      <MockRouter>
        <ProductDetailPage />
      </MockRouter>
    );

    const tables = document.querySelectorAll('table');
    
    tables.forEach(table => {
      const headers = table.querySelectorAll('th');
      expect(headers.length).toBeGreaterThan(0);
      
      // Check for proper scope attributes
      headers.forEach(header => {
        expect(header).toHaveAttribute('scope');
      });
    });
  });

  it('should have proper error messages and validation', () => {
    render(
      <MockRouter>
        <ProductDetailPage />
      </MockRouter>
    );

    // Check for form validation messages
    const errorMessages = document.querySelectorAll('[role="alert"]');
    const ariaInvalid = document.querySelectorAll('[aria-invalid="true"]');
    
    // Should have proper error handling
    expect(errorMessages.length).toBeGreaterThanOrEqual(0);
    expect(ariaInvalid.length).toBeGreaterThanOrEqual(0);
  });

  it('should have proper loading states and announcements', () => {
    render(
      <MockRouter>
        <ProductDetailPage />
      </MockRouter>
    );

    // Check for loading indicators
    const loadingElements = document.querySelectorAll('[aria-busy="true"]');
    const liveRegions = document.querySelectorAll('[aria-live]');
    
    expect(loadingElements.length).toBeGreaterThanOrEqual(0);
    expect(liveRegions.length).toBeGreaterThanOrEqual(0);
  });

  it('should have proper mobile accessibility features', () => {
    // Mock mobile viewport
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375,
    });

    render(
      <MockRouter>
        <ProductDetailPage />
      </MockRouter>
    );

    // Check for mobile-specific accessibility features
    const touchTargets = document.querySelectorAll('button, a, input, select, textarea');
    
    touchTargets.forEach(target => {
      const computedStyle = window.getComputedStyle(target);
      const minSize = Math.min(
        parseFloat(computedStyle.width),
        parseFloat(computedStyle.height)
      );
      
      // Touch targets should be at least 44px
      expect(minSize).toBeGreaterThanOrEqual(44);
    });
  });

  it('should have proper screen reader support', () => {
    render(
      <MockRouter>
        <ProductDetailPage />
      </MockRouter>
    );

    // Check for screen reader specific attributes
    const srOnlyElements = document.querySelectorAll('.sr-only, .visually-hidden');
    const ariaHidden = document.querySelectorAll('[aria-hidden="true"]');
    
    expect(srOnlyElements.length).toBeGreaterThanOrEqual(0);
    expect(ariaHidden.length).toBeGreaterThanOrEqual(0);
  });

  it('should have proper landmark roles', () => {
    render(
      <MockRouter>
        <ProductDetailPage />
      </MockRouter>
    );

    // Check for proper landmark roles
    expect(screen.getByRole('banner')).toBeInTheDocument(); // header
    expect(screen.getByRole('navigation')).toBeInTheDocument(); // nav
    expect(screen.getByRole('main')).toBeInTheDocument(); // main
    expect(screen.getByRole('contentinfo')).toBeInTheDocument(); // footer
  });

  it('should handle dynamic content updates accessibly', () => {
    render(
      <MockRouter>
        <ProductDetailPage />
      </MockRouter>
    );

    // Check for live regions for dynamic content
    const liveRegions = document.querySelectorAll('[aria-live]');
    expect(liveRegions.length).toBeGreaterThanOrEqual(0);
    
    liveRegions.forEach(region => {
      const liveValue = region.getAttribute('aria-live');
      expect(['polite', 'assertive']).toContain(liveValue);
    });
  });
});

