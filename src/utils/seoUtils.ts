/**
 * SEO Metadata Utilities
 * Comprehensive SEO utilities for timber product pages
 */

import { Product, SEOData, StructuredData } from '@/types/product';

/**
 * SEO configuration constants
 */
const SEO_CONFIG = {
  siteName: 'New India Timbers',
  siteUrl: 'https://newindiatimber.com',
  defaultImage: '/images/logo.png',
  twitterHandle: '@NewIndiaTimbers',
  facebookAppId: '123456789',
  
  // Meta tag limits
  metaTitle: {
    minLength: 30,
    maxLength: 60,
    recommendedLength: 50
  },
  metaDescription: {
    minLength: 120,
    maxLength: 160,
    recommendedLength: 150
  },
  
  // Keywords
  keywords: {
    minCount: 3,
    maxCount: 10,
    recommendedCount: 5
  }
};

/**
 * Generates a meta title for a product
 */
export function generateMetaTitle(product: Product): string {
  const baseTitle = `${product.name} - Premium ${product.category} Timber`;
  const siteName = SEO_CONFIG.siteName;
  
  // Try to fit within recommended length
  let title = `${baseTitle} | ${siteName}`;
  
  if (title.length > SEO_CONFIG.metaTitle.recommendedLength) {
    // Try without site name
    title = baseTitle;
    
    if (title.length > SEO_CONFIG.metaTitle.maxLength) {
      // Truncate and add ellipsis
      title = baseTitle.substring(0, SEO_CONFIG.metaTitle.maxLength - 3) + '...';
    }
  }
  
  return title;
}

/**
 * Generates a meta description for a product
 */
export function generateMetaDescription(product: Product): string {
  const keyFeatures = product.keyFeatures.slice(0, 2).join(', ');
  const applications = product.applications.primary.slice(0, 2).join(', ');
  
  let description = `Buy premium ${product.name} (${product.scientificName}) timber. `;
  description += `${keyFeatures}. Perfect for ${applications}. `;
  
  if (product.certifications.length > 0) {
    description += `${product.certifications[0]} certified. `;
  }
  
  description += `Available at ${SEO_CONFIG.siteName}.`;
  
  // Ensure it fits within limits
  if (description.length > SEO_CONFIG.metaDescription.maxLength) {
    description = description.substring(0, SEO_CONFIG.metaDescription.maxLength - 3) + '...';
  }
  
  return description;
}

/**
 * Generates keywords for a product
 */
export function generateKeywords(product: Product): string[] {
  const keywords = new Set<string>();
  
  // Product-specific keywords
  keywords.add(product.name.toLowerCase());
  keywords.add(product.scientificName.toLowerCase());
  keywords.add(`${product.name.toLowerCase()} wood`);
  keywords.add(`${product.name.toLowerCase()} timber`);
  
  // Category keywords
  keywords.add(`${product.category} timber`);
  keywords.add(`${product.category} wood`);
  
  // Application keywords
  product.applications.primary.forEach(app => {
    keywords.add(`${app.toLowerCase()} wood`);
    keywords.add(`${app.toLowerCase()} timber`);
  });
  
  // Origin keywords
  keywords.add(`${product.origin.toLowerCase()} timber`);
  keywords.add(`${product.origin.toLowerCase()} wood`);
  
  // Quality keywords
  if (product.specifications.durability === 'excellent') {
    keywords.add('durable timber');
    keywords.add('strong wood');
  }
  
  if (product.specifications.moistureResistance === 'excellent') {
    keywords.add('moisture resistant wood');
    keywords.add('weather resistant timber');
  }
  
  // Certification keywords
  product.certifications.forEach(cert => {
    keywords.add(`${cert.toLowerCase()} timber`);
  });
  
  // Location-based keywords
  keywords.add('timber suppliers bangalore');
  keywords.add('wood dealers india');
  keywords.add('hardwood suppliers');
  
  // Convert to array and limit count
  return Array.from(keywords).slice(0, SEO_CONFIG.keywords.recommendedCount);
}

/**
 * Generates canonical URL for a product
 */
export function generateCanonicalUrl(product: Product): string {
  return `${SEO_CONFIG.siteUrl}/products/${product.slug}`;
}

/**
 * Generates Open Graph title
 */
export function generateOGTitle(product: Product): string {
  return `${product.name} - Premium ${product.category} Timber`;
}

/**
 * Generates Open Graph description
 */
export function generateOGDescription(product: Product): string {
  return `Premium ${product.name} timber for ${product.applications.primary[0] || 'construction'}. ${product.certifications[0] || 'High quality'} certified.`;
}

/**
 * Generates Open Graph image URL
 */
export function generateOGImage(product: Product): string {
  return `${SEO_CONFIG.siteUrl}${product.images.hero.webp}`;
}

/**
 * Generates structured data (JSON-LD) for a product
 */
export function generateStructuredData(product: Product): StructuredData {
  const images = [
    `${SEO_CONFIG.siteUrl}${product.images.hero.webp}`,
    ...product.images.gallery.map(img => `${SEO_CONFIG.siteUrl}${img.webp}`)
  ];
  
  const structuredData: StructuredData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: images,
    brand: {
      '@type': 'Brand',
      name: SEO_CONFIG.siteName
    },
    offers: {
      '@type': 'Offer',
      price: product.pricing.basePrice,
      priceCurrency: 'INR',
      availability: product.availability.status === 'in-stock' ? 'InStock' : 'OutOfStock',
      seller: {
        '@type': 'Organization',
        name: SEO_CONFIG.siteName,
        url: SEO_CONFIG.siteUrl
      }
    }
  };
  
  // Add additional properties if available
  if (product.specifications) {
    structuredData.additionalProperty = [
      {
        '@type': 'PropertyValue',
        name: 'Density',
        value: `${product.specifications.density.min}-${product.specifications.density.max} kg/m³`
      },
      {
        '@type': 'PropertyValue',
        name: 'Grain Pattern',
        value: product.specifications.grainPattern
      },
      {
        '@type': 'PropertyValue',
        name: 'Texture',
        value: product.specifications.texture
      },
      {
        '@type': 'PropertyValue',
        name: 'Workability',
        value: product.specifications.workability
      }
    ];
  }
  
  if (product.certifications.length > 0) {
    structuredData.certification = product.certifications.map(cert => ({
      '@type': 'Certification',
      name: cert
    }));
  }
  
  if (product.origin) {
    structuredData.countryOfOrigin = {
      '@type': 'Country',
      name: product.origin
    };
  }
  
  return structuredData;
}

/**
 * Generates complete SEO data for a product
 */
export function generateSEOData(product: Product): SEOData {
  return {
    metaTitle: generateMetaTitle(product),
    metaDescription: generateMetaDescription(product),
    keywords: generateKeywords(product),
    canonicalUrl: generateCanonicalUrl(product),
    ogTitle: generateOGTitle(product),
    ogDescription: generateOGDescription(product),
    ogImage: generateOGImage(product),
    twitterCard: 'summary_large_image',
    structuredData: generateStructuredData(product)
  };
}

/**
 * Validates SEO data quality
 */
export function validateSEOQuality(seo: SEOData): {
  score: number;
  issues: string[];
  suggestions: string[];
} {
  const issues: string[] = [];
  const suggestions: string[] = [];
  let score = 100;
  
  // Check meta title
  if (seo.metaTitle.length < SEO_CONFIG.metaTitle.minLength) {
    issues.push('Meta title is too short');
    score -= 20;
  } else if (seo.metaTitle.length > SEO_CONFIG.metaTitle.maxLength) {
    issues.push('Meta title is too long');
    score -= 10;
  }
  
  if (seo.metaTitle.length < SEO_CONFIG.metaTitle.recommendedLength) {
    suggestions.push('Consider making meta title longer for better SEO');
  }
  
  // Check meta description
  if (seo.metaDescription.length < SEO_CONFIG.metaDescription.minLength) {
    issues.push('Meta description is too short');
    score -= 20;
  } else if (seo.metaDescription.length > SEO_CONFIG.metaDescription.maxLength) {
    issues.push('Meta description is too long');
    score -= 10;
  }
  
  if (seo.metaDescription.length < SEO_CONFIG.metaDescription.recommendedLength) {
    suggestions.push('Consider making meta description longer for better SEO');
  }
  
  // Check keywords
  if (seo.keywords.length < SEO_CONFIG.keywords.minCount) {
    issues.push('Too few keywords');
    score -= 15;
  } else if (seo.keywords.length > SEO_CONFIG.keywords.maxCount) {
    issues.push('Too many keywords');
    score -= 10;
  }
  
  // Check canonical URL
  if (!seo.canonicalUrl.startsWith('http')) {
    issues.push('Canonical URL should be absolute');
    score -= 15;
  }
  
  // Check structured data
  if (!seo.structuredData || !seo.structuredData['@context']) {
    issues.push('Structured data is missing or invalid');
    score -= 20;
  }
  
  return {
    score: Math.max(0, score),
    issues,
    suggestions
  };
}

/**
 * Generates breadcrumb structured data
 */
export function generateBreadcrumbStructuredData(product: Product): any {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: SEO_CONFIG.siteUrl
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Products',
        item: `${SEO_CONFIG.siteUrl}/products`
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: product.category.charAt(0).toUpperCase() + product.category.slice(1),
        item: `${SEO_CONFIG.siteUrl}/products?category=${product.category}`
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: product.name,
        item: `${SEO_CONFIG.siteUrl}/products/${product.slug}`
      }
    ]
  };
}

/**
 * Generates FAQ structured data for common product questions
 */
export function generateFAQStructuredData(product: Product): any {
  const faqs = [
    {
      question: `What is ${product.name}?`,
      answer: `${product.name} (${product.scientificName}) is a ${product.category} timber known for its ${product.specifications.durability} durability and ${product.specifications.workability} workability.`
    },
    {
      question: `What are the main applications of ${product.name}?`,
      answer: `${product.name} is commonly used for ${product.applications.primary.join(', ')}.`
    },
    {
      question: `What is the density of ${product.name}?`,
      answer: `${product.name} has a density of ${product.specifications.density.min}-${product.specifications.density.max} kg/m³.`
    },
    {
      question: `Is ${product.name} suitable for outdoor use?`,
      answer: `${product.name} has ${product.specifications.moistureResistance} moisture resistance, making it ${product.specifications.moistureResistance === 'excellent' ? 'excellent' : 'suitable'} for outdoor applications.`
    }
  ];
  
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };
}

/**
 * Generates organization structured data
 */
export function generateOrganizationStructuredData(): any {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SEO_CONFIG.siteName,
    url: SEO_CONFIG.siteUrl,
    logo: `${SEO_CONFIG.siteUrl}${SEO_CONFIG.defaultImage}`,
    description: 'Premium timber supplier specializing in hardwood, teak, and imported wood products for construction and furniture applications.',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'No. 134/20, 5th Main, HSR Layout Sector 7',
      addressLocality: 'Bangalore',
      postalCode: '560068',
      addressCountry: 'IN'
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+91-XXXXXXXXXX',
      contactType: 'customer service',
      areaServed: 'IN',
      availableLanguage: 'English'
    },
    sameAs: [
      'https://www.facebook.com/NewIndiaTimbers',
      'https://www.linkedin.com/company/new-india-timbers',
      'https://twitter.com/NewIndiaTimbers'
    ]
  };
}

/**
 * Generates WebSite structured data with search functionality
 */
export function generateWebSiteStructuredData(): any {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SEO_CONFIG.siteName,
    url: SEO_CONFIG.siteUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SEO_CONFIG.siteUrl}/search?q={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    }
  };
}

/**
 * Generates all structured data for a product page
 */
export function generateAllStructuredData(product: Product): any[] {
  return [
    generateStructuredData(product),
    generateBreadcrumbStructuredData(product),
    generateFAQStructuredData(product),
    generateOrganizationStructuredData(),
    generateWebSiteStructuredData()
  ];
}

/**
 * Generates meta tags for a product page
 */
export function generateMetaTags(product: Product): Array<{ name?: string; property?: string; content: string }> {
  const seo = generateSEOData(product);
  
  return [
    // Basic meta tags
    { name: 'title', content: seo.metaTitle },
    { name: 'description', content: seo.metaDescription },
    { name: 'keywords', content: seo.keywords.join(', ') },
    { name: 'author', content: SEO_CONFIG.siteName },
    { name: 'robots', content: 'index, follow' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { name: 'charset', content: 'utf-8' },
    
    // Canonical URL
    { name: 'canonical', content: seo.canonicalUrl },
    
    // Open Graph tags
    { property: 'og:title', content: seo.ogTitle },
    { property: 'og:description', content: seo.ogDescription },
    { property: 'og:image', content: seo.ogImage },
    { property: 'og:url', content: seo.canonicalUrl },
    { property: 'og:type', content: 'product' },
    { property: 'og:site_name', content: SEO_CONFIG.siteName },
    
    // Twitter Card tags
    { name: 'twitter:card', content: seo.twitterCard },
    { name: 'twitter:title', content: seo.ogTitle },
    { name: 'twitter:description', content: seo.ogDescription },
    { name: 'twitter:image', content: seo.ogImage },
    { name: 'twitter:site', content: SEO_CONFIG.twitterHandle },
    
    // Product-specific meta tags
    { name: 'product:price:amount', content: product.pricing.basePrice.toString() },
    { name: 'product:price:currency', content: 'INR' },
    { name: 'product:availability', content: product.availability.status },
    { name: 'product:condition', content: 'new' },
    { name: 'product:brand', content: SEO_CONFIG.siteName }
  ];
}

/**
 * Generates sitemap entry for a product
 */
export function generateSitemapEntry(product: Product): string {
  const url = generateCanonicalUrl(product);
  const lastmod = new Date(product.updatedAt).toISOString().split('T')[0];
  const priority = product.featured ? '0.8' : '0.6';
  const changefreq = 'weekly';
  
  return `  <url>
    <loc>${url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

