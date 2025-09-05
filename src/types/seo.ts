// SEO Settings Type Definitions

export interface MetaTag {
  name?: string;
  property?: string;
  content: string;
  httpEquiv?: string;
}

export interface ContactPoint {
  '@type': 'ContactPoint';
  telephone: string;
  contactType: string;
  areaServed?: string;
  availableLanguage?: string[];
}

export interface PostalAddress {
  '@type': 'PostalAddress';
  streetAddress: string;
  addressLocality: string;
  addressRegion: string;
  postalCode: string;
  addressCountry: string;
}

export interface OrganizationSchema {
  '@type': 'Organization';
  name: string;
  url: string;
  logo: string;
  contactPoint: ContactPoint[];
  address: PostalAddress;
  sameAs: string[];
}

export interface WebsiteSchema {
  '@type': 'WebSite';
  name: string;
  url: string;
  description: string;
  publisher: {
    '@type': 'Organization';
    name: string;
  };
}

export interface FaviconSet {
  ico: string;
  png16: string;
  png32: string;
  apple180: string;
}

export interface SocialMediaSettings {
  ogImage: string;
  ogType: string;
  twitterCard: string;
  twitterSite: string;
  facebookAppId?: string;
}

export interface AnalyticsSettings {
  googleAnalyticsId?: string;
  googleSearchConsole?: string;
  bingWebmasterTools?: string;
}

export interface GlobalSEOSettings {
  id: string;
  siteName: string;
  defaultTitle: string;
  titleSeparator: string;
  defaultDescription: string;
  defaultKeywords: string[];
  canonicalURL: string;
  robotsTxt: string;
  favicon: FaviconSet;
  socialMedia: SocialMediaSettings;
  structuredData: {
    organizationSchema: OrganizationSchema;
    websiteSchema: WebsiteSchema;
  };
  analytics: AnalyticsSettings;
  updatedAt: string;
  updatedBy: string;
}

export interface PageSEOSettings {
  id: string;
  pageId: string;
  pagePath: string;
  pageTitle: string;
  metaTitle?: string;
  metaDescription?: string;
  keywords: string[];
  canonicalUrl?: string;
  noIndex: boolean;
  noFollow: boolean;
  customMeta: MetaTag[];
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  priority: number;
  changeFreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  lastModified: string;
  status: 'published' | 'draft' | 'archived';
}

export interface AISettings {
  groqApiKey: string;
  model: string;
  temperature: number;
  maxTokens: number;
  isEnabled: boolean;
}

export interface AIGenerationRequest {
  type: 'title' | 'description' | 'keywords';
  content: string;
  targetKeywords?: string[];
  characterLimit?: number;
  brand?: string;
  tone?: 'professional' | 'casual' | 'technical' | 'friendly';
}

export interface AIGenerationResponse {
  generated: string;
  suggestions: string[];
  confidence: number;
  tokensUsed: number;
}

export interface SEOAuditResult {
  score: number;
  issues: SEOIssue[];
  recommendations: string[];
  lastAuditDate: string;
}

export interface SEOIssue {
  type: 'error' | 'warning' | 'info';
  category: 'meta' | 'content' | 'technical' | 'performance';
  description: string;
  impact: 'high' | 'medium' | 'low';
  fix?: string;
}

export interface SitemapEntry {
  url: string;
  lastModified: string;
  changeFreq: PageSEOSettings['changeFreq'];
  priority: number;
}

export interface SEOPreviewData {
  title: string;
  description: string;
  url: string;
  image?: string;
  siteName?: string;
}

// Default values for SEO settings
export const defaultGlobalSEOSettings: Partial<GlobalSEOSettings> = {
  siteName: 'Timber Craft Commerce Hub',
  defaultTitle: '%page% | Timber Craft Commerce Hub',
  titleSeparator: ' | ',
  defaultDescription: 'Premium timber and woodcraft solutions for all your construction and design needs. Quality materials, expert craftsmanship, and reliable service.',
  defaultKeywords: ['timber', 'wood', 'craft', 'construction', 'premium lumber', 'woodcraft'],
  canonicalURL: 'https://timbercrafthub.com',
  robotsTxt: `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /dashboard/
Sitemap: https://timbercrafthub.com/sitemap.xml`,
  favicon: {
    ico: '/favicon.ico',
    png16: '/favicon-16x16.png',
    png32: '/favicon-32x32.png',
    apple180: '/apple-touch-icon.png'
  },
  socialMedia: {
    ogImage: '/og-image.jpg',
    ogType: 'website',
    twitterCard: 'summary_large_image',
    twitterSite: '@timbercrafthub'
  }
};

export const defaultAISettings: AISettings = {
  groqApiKey: '',
  model: 'openai/gpt-oss-20b',
  temperature: 0.7,
  maxTokens: 200,
  isEnabled: false
};

// Page definitions for SEO management
export const predefinedPages = [
  { id: 'home', path: '/', title: 'Home' },
  { id: 'products', path: '/products', title: 'Products' },
  { id: 'estimator', path: '/estimator', title: 'Price Estimator' },
  { id: 'bulk-orders', path: '/bulk-orders', title: 'Bulk Orders' },
  { id: 'comparison', path: '/comparison', title: 'Wood Comparison' },
  { id: 'about', path: '/about', title: 'About Us' },
  { id: 'contact', path: '/contact', title: 'Contact Us' }
];