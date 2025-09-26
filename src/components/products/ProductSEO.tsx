import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Product } from '@/types/product';
import { generateSEOData, generateAllStructuredData } from '@/utils/seoUtils';

interface ProductSEOProps {
  product: Product;
}

/**
 * ProductSEO Component
 * Handles all SEO-related meta tags and structured data for product pages
 */
export const ProductSEO: React.FC<ProductSEOProps> = ({ product }) => {
  const seoData = generateSEOData(product);
  const structuredData = generateAllStructuredData(product);

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{seoData.metaTitle}</title>
      <meta name="description" content={seoData.metaDescription} />
      <meta name="keywords" content={seoData.keywords.join(', ')} />
      <meta name="author" content="New India Timbers" />
      <meta name="robots" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta charSet="utf-8" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={seoData.canonicalUrl} />
      
      {/* Open Graph Tags */}
      <meta property="og:title" content={seoData.ogTitle} />
      <meta property="og:description" content={seoData.ogDescription} />
      <meta property="og:image" content={seoData.ogImage} />
      <meta property="og:url" content={seoData.canonicalUrl} />
      <meta property="og:type" content="product" />
      <meta property="og:site_name" content="New India Timbers" />
      
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content={seoData.twitterCard} />
      <meta name="twitter:title" content={seoData.ogTitle} />
      <meta name="twitter:description" content={seoData.ogDescription} />
      <meta name="twitter:image" content={seoData.ogImage} />
      <meta name="twitter:site" content="@NewIndiaTimbers" />
      
      {/* Product-specific Meta Tags */}
      <meta name="product:price:amount" content={product.pricing.basePrice.toString()} />
      <meta name="product:price:currency" content="INR" />
      <meta name="product:availability" content={product.availability.status} />
      <meta name="product:condition" content="new" />
      <meta name="product:brand" content="New India Timbers" />
      
      {/* Structured Data */}
      {structuredData.map((data, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
      ))}
    </Helmet>
  );
};

export default ProductSEO;

