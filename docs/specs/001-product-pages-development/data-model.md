# Data Model - Product Pages Development

## Enhanced Product Entity

### Core Product Schema
```typescript
interface Product {
  id: string;
  slug: string;
  name: string;
  scientificName: string;
  category: 'hardwood' | 'teak' | 'imported';
  origin: string;
  
  // Basic Information
  description: string;
  shortDescription: string;
  keyFeatures: string[];
  
  // Technical Specifications
  specifications: {
    density: {
      min: number; // kg/m³
      max: number; // kg/m³
    };
    grainPattern: 'straight' | 'interlocked' | 'wavy' | 'mixed';
    texture: 'fine' | 'medium' | 'coarse';
    color: string;
    workability: 'excellent' | 'good' | 'moderate' | 'difficult';
    durability: 'excellent' | 'good' | 'moderate' | 'poor';
    moistureResistance: 'excellent' | 'good' | 'moderate' | 'poor';
    insectResistance: 'excellent' | 'good' | 'moderate' | 'poor';
  };
  
  // Applications
  applications: {
    primary: string[];
    secondary: string[];
    notRecommended: string[];
  };
  
  // Quality & Certifications
  qualityGrades: string[];
  certifications: string[];
  sustainability: {
    source: 'sustainable' | 'plantation' | 'certified' | 'traditional';
    certification?: string;
  };
  
  // Pricing & Availability
  pricing: {
    basePrice: number; // per unit
    unit: 'cubic-foot' | 'board-foot' | 'log' | 'plank';
    bulkDiscounts: {
      minQuantity: number;
      discountPercentage: number;
    }[];
    regionalPricing?: {
      region: string;
      priceMultiplier: number;
    }[];
  };
  
  availability: {
    status: 'in-stock' | 'limited' | 'out-of-stock' | 'seasonal';
    leadTime: string;
    seasonalAvailability?: string[];
  };
  
  // Images
  images: {
    hero: {
      webp: string;
      jpg: string;
      alt: string;
    };
    gallery: {
      webp: string;
      jpg: string;
      alt: string;
      caption?: string;
    }[];
    details: {
      grain: {
        webp: string;
        jpg: string;
        alt: string;
      };
      crossSection: {
        webp: string;
        jpg: string;
        alt: string;
      };
      applications: {
        webp: string;
        jpg: string;
        alt: string;
        caption: string;
      }[];
    };
  };
  
  // SEO
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
    canonicalUrl: string;
    structuredData: {
      '@context': 'https://schema.org';
      '@type': 'Product';
      name: string;
      description: string;
      image: string[];
      brand: {
        '@type': 'Brand';
        name: 'New India Timbers';
      };
      offers: {
        '@type': 'Offer';
        price: number;
        priceCurrency: 'INR';
        availability: string;
      };
    };
  };
  
  // Related Products
  relatedProducts: string[]; // product IDs
  
  // Metadata
  createdAt: string;
  updatedAt: string;
  published: boolean;
  featured: boolean;
}
```

## Product Categories

### Category Schema
```typescript
interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  parentCategory?: string;
  products: string[]; // product IDs
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
  };
}
```

## Image Management

### Image Schema
```typescript
interface ProductImage {
  id: string;
  productId: string;
  type: 'hero' | 'gallery' | 'grain' | 'cross-section' | 'application';
  variants: {
    webp: {
      url: string;
      width: number;
      height: number;
      size: number; // bytes
    };
    jpg: {
      url: string;
      width: number;
      height: number;
      size: number; // bytes
    };
    thumbnail: {
      url: string;
      width: number;
      height: number;
      size: number; // bytes
    };
  };
  alt: string;
  caption?: string;
  order: number;
}
```

## SEO Data Structure

### SEO Metadata Schema
```typescript
interface SEOData {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  canonicalUrl: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterCard?: 'summary' | 'summary_large_image';
  structuredData: {
    '@context': string;
    '@type': string;
    [key: string]: any;
  };
}
```

## Validation Rules

### Product Validation
- `id`: Required, unique, alphanumeric with hyphens
- `slug`: Required, unique, URL-friendly format
- `name`: Required, 3-100 characters
- `scientificName`: Required, valid scientific nomenclature
- `density.min`: Required, positive number, must be less than `density.max`
- `density.max`: Required, positive number, must be greater than `density.min`
- `pricing.basePrice`: Required, positive number
- `images.hero`: Required, valid image URLs
- `seo.metaTitle`: Required, 30-60 characters
- `seo.metaDescription`: Required, 120-160 characters

### Image Validation
- All image URLs must be valid and accessible
- WebP and JPG variants required for all images
- Alt text required for accessibility
- Image dimensions must be reasonable (max 2000px width)
- File sizes should be optimized (max 500KB for hero images)

### SEO Validation
- Meta titles must be unique across all products
- Meta descriptions must be unique and compelling
- Keywords should be relevant and not overused
- Structured data must be valid JSON-LD
- Canonical URLs must be absolute and unique

## State Transitions

### Product Lifecycle
```
Draft → Review → Published → Archived
  ↓       ↓         ↓         ↓
  └───────┴─────────┴─────────┘
```

### Availability States
```
In-Stock → Limited → Out-of-Stock
    ↓         ↓          ↓
    └─────────┴──────────┘
```

## Relationships

### Product Relationships
- **One-to-Many**: Product → Images
- **Many-to-Many**: Product ↔ Related Products
- **Many-to-One**: Product → Category
- **One-to-One**: Product → SEO Data

### Data Dependencies
- Product images depend on product existence
- SEO data is tightly coupled with product data
- Related products must reference existing products
- Categories must contain valid product references

## Data Migration Strategy

### Existing Data Enhancement
1. **Extend products.json**: Add new fields to existing product structure
2. **Image Migration**: Organize existing images into new structure
3. **SEO Enhancement**: Generate SEO metadata for existing products
4. **Validation**: Ensure all existing data meets new validation rules

### Backward Compatibility
- Maintain existing product IDs and slugs
- Preserve existing image URLs
- Keep existing navigation structure
- Ensure existing components continue to work

## Performance Considerations

### Data Loading Strategy
- **Lazy Loading**: Load product details on demand
- **Image Optimization**: Serve appropriate image sizes
- **Caching**: Cache product data and images
- **Pagination**: Implement pagination for large product lists

### Storage Optimization
- **Image Compression**: Optimize all images for web
- **Data Structure**: Minimize redundant data storage
- **CDN Integration**: Use CDN for image delivery
- **Bundle Splitting**: Split product data from main bundle

