/**
 * SEO Service
 * Handles SEO settings, sitemap generation, and meta tag management
 */

import type { 
  SEOSetting, 
  SEOSettingInput,
  SitemapEntry,
  SitemapConfig 
} from '@/types/content';
import type { BlogPost } from '@/types/blog';
import type { Product } from '@/types/product';
import { storageService } from './storage';

export class SEOService {
  // SEO Settings Management
  async getSEOSettings(): Promise<SEOSetting[]> {
    return storageService.getAll<SEOSetting>('seo-settings');
  }

  async getSEOSetting(page: string): Promise<SEOSetting | null> {
    return storageService.findBy<SEOSetting>('seo-settings', 'page', page);
  }

  async createSEOSetting(input: SEOSettingInput): Promise<SEOSetting> {
    // Check for duplicate page
    const existingSetting = await storageService.findBy<SEOSetting>('seo-settings', 'page', input.page);
    if (existingSetting) {
      throw new Error(`SEO setting for page '${input.page}' already exists`);
    }

    // Validate required fields
    if (!input.page?.trim()) {
      throw new Error('Page identifier is required');
    }
    if (!input.metaTitle?.trim()) {
      throw new Error('Meta title is required');
    }
    if (!input.metaDescription?.trim()) {
      throw new Error('Meta description is required');
    }

    // Validate meta title and description lengths
    if (input.metaTitle.length > 60) {
      throw new Error('Meta title must be 60 characters or less');
    }
    if (input.metaDescription.length > 160) {
      throw new Error('Meta description must be 160 characters or less');
    }

    const newSetting: SEOSetting = {
      id: `seo-${Date.now()}`,
      page: input.page.trim(),
      metaTitle: input.metaTitle.trim(),
      metaDescription: input.metaDescription.trim(),
      keywords: input.keywords || [],
      canonicalUrl: input.canonicalUrl || null,
      structuredData: input.structuredData || null,
      openGraph: input.openGraph || {
        title: input.metaTitle.trim(),
        description: input.metaDescription.trim(),
        image: null,
        type: 'website',
        siteName: 'New India Timber',
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return storageService.create('seo-settings', newSetting);
  }

  async updateSEOSetting(id: string, updates: Partial<SEOSettingInput>): Promise<SEOSetting | null> {
    const existingSetting = await storageService.get<SEOSetting>('seo-settings', id);
    if (!existingSetting) {
      return null;
    }

    // Validate meta title and description lengths if they're being updated
    if (updates.metaTitle && updates.metaTitle.length > 60) {
      throw new Error('Meta title must be 60 characters or less');
    }
    if (updates.metaDescription && updates.metaDescription.length > 160) {
      throw new Error('Meta description must be 160 characters or less');
    }

    return storageService.update<SEOSetting>('seo-settings', id, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  }

  async deleteSEOSetting(id: string): Promise<boolean> {
    return storageService.delete('seo-settings', id);
  }

  // Sitemap Generation
  async generateSitemap(): Promise<{
    success: boolean;
    message: string;
    urlCount: number;
    lastGenerated: string;
  }> {
    try {
      const baseUrl = 'https://newindiatimber.com'; // In production, get from config
      const lastGenerated = new Date().toISOString();
      
      // Get all entities for sitemap
      const [products, blogPosts, seoSettings] = await Promise.all([
        storageService.getAll<Product>('products'),
        storageService.getAll<BlogPost>('blog-posts'),
        this.getSEOSettings(),
      ]);

      const sitemapEntries: SitemapEntry[] = [];

      // Static pages
      const staticPages = [
        { url: '/', priority: 1.0, changeFrequency: 'weekly' as const },
        { url: '/products', priority: 0.9, changeFrequency: 'daily' as const },
        { url: '/blog', priority: 0.8, changeFrequency: 'daily' as const },
        { url: '/bulk-orders', priority: 0.7, changeFrequency: 'monthly' as const },
        { url: '/contact', priority: 0.6, changeFrequency: 'monthly' as const },
        { url: '/about', priority: 0.6, changeFrequency: 'monthly' as const },
        { url: '/compare', priority: 0.5, changeFrequency: 'monthly' as const },
        { url: '/terms-conditions', priority: 0.3, changeFrequency: 'yearly' as const },
        { url: '/privacy-policy', priority: 0.3, changeFrequency: 'yearly' as const },
      ];

      staticPages.forEach(page => {
        sitemapEntries.push({
          url: `${baseUrl}${page.url}`,
          lastModified: lastGenerated,
          changeFrequency: page.changeFrequency,
          priority: page.priority,
        });
      });

      // Product pages
      products
        .filter(product => product.status === 'active')
        .forEach(product => {
          sitemapEntries.push({
            url: `${baseUrl}/products/wood/${encodeURIComponent(product.name.toLowerCase().replace(/\s+/g, '-'))}`,
            lastModified: product.updatedAt,
            changeFrequency: 'weekly',
            priority: 0.8,
          });
        });

      // Blog posts
      blogPosts
        .filter(post => post.status === 'published')
        .forEach(post => {
          sitemapEntries.push({
            url: `${baseUrl}/blog/${post.slug}`,
            lastModified: post.updatedAt,
            changeFrequency: 'monthly',
            priority: 0.7,
          });
        });

      // Blog categories
      const blogCategories = await storageService.getAll('blog-categories');
      blogCategories.forEach((category: any) => {
        sitemapEntries.push({
          url: `${baseUrl}/blog/category/${category.slug}`,
          lastModified: category.updatedAt,
          changeFrequency: 'weekly',
          priority: 0.6,
        });
      });

      // Generate XML sitemap content
      const sitemapXml = this.generateSitemapXML(sitemapEntries);

      // In a real implementation, this would write to the public directory
      // For now, we'll simulate the file creation
      console.log('Generated sitemap.xml with', sitemapEntries.length, 'URLs');

      // Generate sitemap config
      const sitemapConfig: SitemapConfig = {
        baseUrl,
        pages: sitemapEntries.filter(entry => entry.url.match(/\/(products|blog|contact|about)/)),
        products: sitemapEntries.filter(entry => entry.url.includes('/products/wood/')),
        blogPosts: sitemapEntries.filter(entry => entry.url.includes('/blog/') && !entry.url.includes('/blog/category/')),
        categories: sitemapEntries.filter(entry => entry.url.includes('/blog/category/')),
        lastGenerated,
      };

      // Store sitemap config (could be used for incremental updates)
      await storageService.create('sitemap-config', sitemapConfig);

      return {
        success: true,
        message: `Sitemap generated with ${sitemapEntries.length} URLs`,
        urlCount: sitemapEntries.length,
        lastGenerated,
      };
    } catch (error) {
      console.error('Error generating sitemap:', error);
      return {
        success: false,
        message: `Failed to generate sitemap: ${error instanceof Error ? error.message : 'Unknown error'}`,
        urlCount: 0,
        lastGenerated: new Date().toISOString(),
      };
    }
  }

  private generateSitemapXML(entries: SitemapEntry[]): string {
    const header = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;
    
    const urls = entries.map(entry => `  <url>
    <loc>${entry.url}</loc>
    <lastmod>${entry.lastModified}</lastmod>
    <changefreq>${entry.changeFrequency}</changefreq>
    <priority>${entry.priority.toFixed(1)}</priority>
  </url>`).join('\n');

    const footer = '</urlset>';

    return `${header}\n${urls}\n${footer}`;
  }

  // Robots.txt Generation
  async generateRobotsTxt(): Promise<string> {
    const baseUrl = 'https://newindiatimber.com'; // In production, get from config
    
    return `User-agent: *
Allow: /
Disallow: /dashboard/
Disallow: /admin/
Disallow: /login
Disallow: /api/

# Sitemap
Sitemap: ${baseUrl}/sitemap.xml

# Crawl-delay for politeness
Crawl-delay: 1

# Allow common bot user-agents
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: facebookexternalhit
Allow: /`;
  }

  // Meta tag helpers
  async getMetaTagsForPage(page: string): Promise<{
    title: string;
    description: string;
    keywords: string[];
    canonical?: string;
    openGraph: {
      title: string;
      description: string;
      image?: string;
      type: string;
      siteName: string;
    };
  }> {
    const seoSetting = await this.getSEOSetting(page);
    
    if (seoSetting) {
      return {
        title: seoSetting.metaTitle,
        description: seoSetting.metaDescription,
        keywords: seoSetting.keywords,
        canonical: seoSetting.canonicalUrl || undefined,
        openGraph: seoSetting.openGraph,
      };
    }

    // Default meta tags
    return this.getDefaultMetaTags(page);
  }

  private getDefaultMetaTags(page: string): {
    title: string;
    description: string;
    keywords: string[];
    openGraph: {
      title: string;
      description: string;
      type: string;
      siteName: string;
    };
  } {
    const defaults: Record<string, any> = {
      'home': {
        title: 'New India Timber - Premium Wood Suppliers in Bangalore, Karnataka',
        description: 'Leading timber suppliers in Bangalore offering premium quality wood, teak, and construction materials. Serving Karnataka with sustainable forestry products.',
        keywords: ['timber suppliers bangalore', 'wood suppliers karnataka', 'teak bangalore', 'timber dealers', 'construction wood'],
      },
      'products': {
        title: 'Premium Timber Products | New India Timber Bangalore',
        description: 'Browse our extensive collection of premium timber products including teak, rosewood, and hardwood for construction and furniture projects in Bangalore.',
        keywords: ['timber products', 'premium wood', 'teak wood', 'rosewood', 'hardwood', 'bangalore'],
      },
      'blog': {
        title: 'Timber Knowledge Hub | New India Timber Blog',
        description: 'Expert insights on timber selection, construction tips, and wood care guides for Bangalore and Karnataka region.',
        keywords: ['timber blog', 'wood care', 'construction tips', 'bangalore timber guide', 'karnataka'],
      },
    };

    const pageDefaults = defaults[page] || defaults['home'];

    return {
      ...pageDefaults,
      openGraph: {
        title: pageDefaults.title,
        description: pageDefaults.description,
        type: 'website',
        siteName: 'New India Timber',
      },
    };
  }

  // Structured data helpers
  async getStructuredDataForPage(page: string): Promise<Record<string, any> | null> {
    const seoSetting = await this.getSEOSetting(page);
    return seoSetting?.structuredData || null;
  }

  async generateLocalBusinessStructuredData(): Promise<Record<string, any>> {
    return {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: 'New India Timber',
      description: 'Premium timber and wood suppliers in Bangalore, Karnataka',
      url: 'https://newindiatimber.com',
      telephone: '+91-XXXXXXXXXX',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Bangalore',
        addressRegion: 'Karnataka',
        addressCountry: 'IN',
      },
      openingHours: [
        'Mo-Sa 09:00-18:00',
      ],
      priceRange: '$$',
      areaServed: [
        'Bangalore',
        'Karnataka',
        'South India',
      ],
      serviceArea: {
        '@type': 'GeoCircle',
        geoMidpoint: {
          '@type': 'GeoCoordinates',
          latitude: 12.9716,
          longitude: 77.5946,
        },
        geoRadius: 50000, // 50km radius
      },
    };
  }

  // SEO Analysis
  async analyzeSEOHealth(): Promise<{
    score: number;
    issues: string[];
    recommendations: string[];
    coverage: {
      pagesWithSEO: number;
      totalPages: number;
      percentage: number;
    };
  }> {
    const seoSettings = await this.getSEOSettings();
    const issues: string[] = [];
    const recommendations: string[] = [];

    // Define important pages that should have SEO settings
    const importantPages = ['home', 'products', 'blog', 'contact', 'about'];
    const coveredPages = seoSettings.map(setting => setting.page);
    const uncoveredPages = importantPages.filter(page => !coveredPages.includes(page));

    // Check coverage
    if (uncoveredPages.length > 0) {
      issues.push(`Missing SEO settings for important pages: ${uncoveredPages.join(', ')}`);
      recommendations.push('Add SEO settings for all important pages');
    }

    // Check SEO quality
    seoSettings.forEach(setting => {
      if (setting.metaTitle.length < 30) {
        issues.push(`Meta title too short for page '${setting.page}' (${setting.metaTitle.length} characters)`);
      }
      if (setting.metaTitle.length > 60) {
        issues.push(`Meta title too long for page '${setting.page}' (${setting.metaTitle.length} characters)`);
      }
      if (setting.metaDescription.length < 120) {
        issues.push(`Meta description too short for page '${setting.page}' (${setting.metaDescription.length} characters)`);
      }
      if (setting.keywords.length === 0) {
        issues.push(`No keywords defined for page '${setting.page}'`);
      }
      if (setting.keywords.length > 10) {
        recommendations.push(`Consider reducing keywords for page '${setting.page}' (focus on 5-7 primary keywords)`);
      }
    });

    // Calculate score
    let score = 100;
    score -= uncoveredPages.length * 10; // -10 points per uncovered important page
    score -= issues.length * 5; // -5 points per issue
    score = Math.max(0, score);

    return {
      score,
      issues,
      recommendations,
      coverage: {
        pagesWithSEO: seoSettings.length,
        totalPages: importantPages.length,
        percentage: Math.round((coveredPages.length / importantPages.length) * 100),
      },
    };
  }
}

export function generateHomeStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "New India Timber",
    url: "https://newindiatimber.com",
    logo: "https://newindiatimber.com/logo.png",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+91-9886033342",
      contactType: "customer service",
      areaServed: "IN-KA",
      availableLanguage: ["English", "Kannada"],
    },
    sameAs: [
      "https://www.facebook.com/newindiatimber",
      "https://www.linkedin.com/company/new-india-timber",
      "https://g.page/newindiatimber",
    ],
  };
}

export function generateProductsStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Timber and Plywood Catalog",
    description: "Premium teak, plywood, and hardwood products available in Bangalore, Karnataka.",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Burma Teak Door",
        url: "https://newindiatimber.com/products/wood/burma-teak",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Marine Plywood 19mm",
        url: "https://newindiatimber.com/products?category=plywood",
      },
    ],
  };
}

export function generateBlogListingStructuredData(posts: Array<{ id: string; title: string; slug: string; summary?: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Bangalore Timber Insights",
    description: "Educational content about timber procurement, plywood selection, and compliance in Karnataka.",
    blogPost: posts.slice(0, 5).map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      url: `https://newindiatimber.com/blog/${post.slug}`,
      description: post.summary ?? "Timber insights for Bangalore projects",
    })),
  };
}

// Export singleton instance and methods
export const seoService = new SEOService();

// Export individual methods for contract tests compatibility
export const getSEOSettings = () => seoService.getSEOSettings();
export const getSEOSetting = (page: string) => seoService.getSEOSetting(page);
export const createSEOSetting = (input: SEOSettingInput) => seoService.createSEOSetting(input);
export const updateSEOSetting = (id: string, updates: Partial<SEOSettingInput>) => seoService.updateSEOSetting(id, updates);
export const deleteSEOSetting = (id: string) => seoService.deleteSEOSetting(id);
export const generateSitemap = () => seoService.generateSitemap();
export const getMetaTagsForPage = (page: string) => seoService.getMetaTagsForPage(page);
export const generateLocalBusinessStructuredData = () => seoService.generateLocalBusinessStructuredData();

export default seoService;
