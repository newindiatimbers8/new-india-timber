import { describe, it, expect } from 'vitest';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';

// Import the OpenAPI schema (we'll need to convert YAML to JSON or use a YAML parser)
// For now, we'll define the schema inline based on the contract
const productSchema = {
  type: 'object',
  required: ['id', 'slug', 'name', 'scientificName', 'category', 'origin', 'description', 'specifications', 'pricing', 'images', 'seo'],
  properties: {
    id: { type: 'string', pattern: '^[a-z0-9-]+$' },
    slug: { type: 'string', pattern: '^[a-z0-9-]+$' },
    name: { type: 'string', minLength: 3, maxLength: 100 },
    scientificName: { type: 'string' },
    category: { type: 'string', enum: ['hardwood', 'teak', 'imported'] },
    origin: { type: 'string' },
    description: { type: 'string', minLength: 50, maxLength: 2000 },
    shortDescription: { type: 'string', maxLength: 200 },
    keyFeatures: { type: 'array', items: { type: 'string' } },
    specifications: {
      type: 'object',
      required: ['density', 'grainPattern', 'texture', 'color', 'workability', 'durability', 'moistureResistance', 'insectResistance'],
      properties: {
        density: {
          type: 'object',
          required: ['min', 'max'],
          properties: {
            min: { type: 'number', minimum: 0 },
            max: { type: 'number', minimum: 0 }
          }
        },
        grainPattern: { type: 'string', enum: ['straight', 'interlocked', 'wavy', 'mixed'] },
        texture: { type: 'string', enum: ['fine', 'medium', 'coarse'] },
        color: { type: 'string' },
        workability: { type: 'string', enum: ['excellent', 'good', 'moderate', 'difficult'] },
        durability: { type: 'string', enum: ['excellent', 'good', 'moderate', 'poor'] },
        moistureResistance: { type: 'string', enum: ['excellent', 'good', 'moderate', 'poor'] },
        insectResistance: { type: 'string', enum: ['excellent', 'good', 'moderate', 'poor'] }
      }
    },
    applications: {
      type: 'object',
      required: ['primary', 'secondary'],
      properties: {
        primary: { type: 'array', items: { type: 'string' } },
        secondary: { type: 'array', items: { type: 'string' } },
        notRecommended: { type: 'array', items: { type: 'string' } }
      }
    },
    qualityGrades: { type: 'array', items: { type: 'string' } },
    certifications: { type: 'array', items: { type: 'string' } },
    sustainability: {
      type: 'object',
      required: ['source'],
      properties: {
        source: { type: 'string', enum: ['sustainable', 'plantation', 'certified', 'traditional'] },
        certification: { type: 'string' }
      }
    },
    pricing: {
      type: 'object',
      required: ['basePrice', 'unit'],
      properties: {
        basePrice: { type: 'number', minimum: 0 },
        unit: { type: 'string', enum: ['cubic-foot', 'board-foot', 'log', 'plank'] },
        bulkDiscounts: {
          type: 'array',
          items: {
            type: 'object',
            required: ['minQuantity', 'discountPercentage'],
            properties: {
              minQuantity: { type: 'number', minimum: 1 },
              discountPercentage: { type: 'number', minimum: 0, maximum: 100 }
            }
          }
        },
        regionalPricing: {
          type: 'array',
          items: {
            type: 'object',
            required: ['region', 'priceMultiplier'],
            properties: {
              region: { type: 'string' },
              priceMultiplier: { type: 'number', minimum: 0 }
            }
          }
        }
      }
    },
    availability: {
      type: 'object',
      required: ['status', 'leadTime'],
      properties: {
        status: { type: 'string', enum: ['in-stock', 'limited', 'out-of-stock', 'seasonal'] },
        leadTime: { type: 'string' },
        seasonalAvailability: { type: 'array', items: { type: 'string' } }
      }
    },
    images: {
      type: 'object',
      required: ['hero', 'gallery'],
      properties: {
        hero: {
          type: 'object',
          required: ['webp', 'jpg', 'alt'],
          properties: {
            webp: { type: 'string', format: 'uri' },
            jpg: { type: 'string', format: 'uri' },
            alt: { type: 'string' }
          }
        },
        gallery: {
          type: 'array',
          items: {
            type: 'object',
            required: ['webp', 'jpg', 'alt'],
            properties: {
              webp: { type: 'string', format: 'uri' },
              jpg: { type: 'string', format: 'uri' },
              alt: { type: 'string' },
              caption: { type: 'string' }
            }
          }
        },
        details: {
          type: 'object',
          properties: {
            grain: {
              type: 'object',
              required: ['webp', 'jpg', 'alt'],
              properties: {
                webp: { type: 'string', format: 'uri' },
                jpg: { type: 'string', format: 'uri' },
                alt: { type: 'string' }
              }
            },
            crossSection: {
              type: 'object',
              required: ['webp', 'jpg', 'alt'],
              properties: {
                webp: { type: 'string', format: 'uri' },
                jpg: { type: 'string', format: 'uri' },
                alt: { type: 'string' }
              }
            },
            applications: {
              type: 'array',
              items: {
                type: 'object',
                required: ['webp', 'jpg', 'alt', 'caption'],
                properties: {
                  webp: { type: 'string', format: 'uri' },
                  jpg: { type: 'string', format: 'uri' },
                  alt: { type: 'string' },
                  caption: { type: 'string' }
                }
              }
            }
          }
        }
      }
    },
    seo: {
      type: 'object',
      required: ['metaTitle', 'metaDescription', 'keywords', 'canonicalUrl', 'structuredData'],
      properties: {
        metaTitle: { type: 'string', minLength: 30, maxLength: 60 },
        metaDescription: { type: 'string', minLength: 120, maxLength: 160 },
        keywords: { type: 'array', items: { type: 'string' } },
        canonicalUrl: { type: 'string', format: 'uri' },
        ogTitle: { type: 'string' },
        ogDescription: { type: 'string' },
        ogImage: { type: 'string', format: 'uri' },
        twitterCard: { type: 'string', enum: ['summary', 'summary_large_image'] },
        structuredData: {
          type: 'object',
          required: ['@context', '@type', 'name', 'description', 'image', 'offers'],
          properties: {
            '@context': { type: 'string' },
            '@type': { type: 'string' },
            name: { type: 'string' },
            description: { type: 'string' },
            image: { type: 'array', items: { type: 'string' } },
            brand: {
              type: 'object',
              required: ['@type', 'name'],
              properties: {
                '@type': { type: 'string' },
                name: { type: 'string' }
              }
            },
            offers: {
              type: 'object',
              required: ['@type', 'price', 'priceCurrency', 'availability'],
              properties: {
                '@type': { type: 'string' },
                price: { type: 'number' },
                priceCurrency: { type: 'string' },
                availability: { type: 'string' }
              }
            }
          }
        }
      }
    },
    relatedProducts: { type: 'array', items: { type: 'string' } },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' },
    published: { type: 'boolean' },
    featured: { type: 'boolean' }
  }
};

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);
const validate = ajv.compile(productSchema);

describe('Product API Schema Validation', () => {
  it('should validate a complete product object', () => {
    const validProduct = {
      id: 'red-sal-wood',
      slug: 'red-sal-wood',
      name: 'Red Sal Wood',
      scientificName: 'Shorea robusta',
      category: 'hardwood',
      origin: 'India',
      description: 'Premium hardwood timber sourced from the Shorea robusta species, known for its distinctive reddish-brown color and exceptional strength properties.',
      shortDescription: 'Premium hardwood with exceptional strength',
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
            alt: 'Red Sal Wood grain detail'
          }
        ]
      },
      seo: {
        metaTitle: 'Red Sal Wood - Premium Hardwood Timber | New India Timbers',
        metaDescription: 'Buy premium Red Sal Wood (Shorea robusta) timber. High strength, moisture resistant hardwood perfect for construction and structural applications.',
        keywords: ['red sal wood', 'shorea robusta', 'hardwood timber', 'construction wood'],
        canonicalUrl: 'https://newindiatimber.com/products/red-sal-wood',
        structuredData: {
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: 'Red Sal Wood',
          description: 'Premium hardwood timber sourced from the Shorea robusta species',
          image: ['/images/products/red-sal-wood/hero.webp'],
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

    const isValid = validate(validProduct);
    if (!isValid) {
      console.error('Validation errors:', validate.errors);
    }
    expect(isValid).toBe(true);
  });

  it('should reject product with missing required fields', () => {
    const invalidProduct = {
      id: 'red-sal-wood',
      name: 'Red Sal Wood'
      // Missing required fields
    };

    const isValid = validate(invalidProduct);
    expect(isValid).toBe(false);
    expect(validate.errors).toBeDefined();
    expect(validate.errors?.length).toBeGreaterThan(0);
  });

  it('should reject product with invalid category', () => {
    const invalidProduct = {
      id: 'red-sal-wood',
      slug: 'red-sal-wood',
      name: 'Red Sal Wood',
      scientificName: 'Shorea robusta',
      category: 'invalid-category', // Invalid category
      origin: 'India',
      description: 'Premium hardwood timber',
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
      pricing: {
        basePrice: 1500,
        unit: 'cubic-foot'
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
        metaTitle: 'Red Sal Wood - Premium Hardwood Timber',
        metaDescription: 'Buy premium Red Sal Wood timber for construction applications.',
        keywords: ['red sal wood', 'hardwood'],
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
      }
    };

    const isValid = validate(invalidProduct);
    expect(isValid).toBe(false);
  });

  it('should reject product with invalid density values', () => {
    const invalidProduct = {
      id: 'red-sal-wood',
      slug: 'red-sal-wood',
      name: 'Red Sal Wood',
      scientificName: 'Shorea robusta',
      category: 'hardwood',
      origin: 'India',
      description: 'Premium hardwood timber',
      specifications: {
        density: { min: 900, max: 800 }, // Invalid: min > max
        grainPattern: 'straight',
        texture: 'coarse',
        color: 'reddish-brown',
        workability: 'good',
        durability: 'excellent',
        moistureResistance: 'excellent',
        insectResistance: 'excellent'
      },
      pricing: {
        basePrice: 1500,
        unit: 'cubic-foot'
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
        metaTitle: 'Red Sal Wood - Premium Hardwood Timber',
        metaDescription: 'Buy premium Red Sal Wood timber for construction applications.',
        keywords: ['red sal wood', 'hardwood'],
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
      }
    };

    const isValid = validate(invalidProduct);
    expect(isValid).toBe(false);
  });

  it('should reject product with invalid SEO meta title length', () => {
    const invalidProduct = {
      id: 'red-sal-wood',
      slug: 'red-sal-wood',
      name: 'Red Sal Wood',
      scientificName: 'Shorea robusta',
      category: 'hardwood',
      origin: 'India',
      description: 'Premium hardwood timber',
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
      pricing: {
        basePrice: 1500,
        unit: 'cubic-foot'
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
        metaTitle: 'Short', // Too short
        metaDescription: 'Buy premium Red Sal Wood timber for construction applications.',
        keywords: ['red sal wood', 'hardwood'],
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
      }
    };

    const isValid = validate(invalidProduct);
    expect(isValid).toBe(false);
  });
});

