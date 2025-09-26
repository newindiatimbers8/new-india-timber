/**
 * Product Data Validation Utilities
 * Comprehensive validation functions for timber product data
 */

import { 
  Product, 
  ProductValidationResult, 
  ProductSpecifications, 
  PricingInfo, 
  AvailabilityInfo,
  SEOData,
  ProductImages,
  DensitySpec
} from '../types/Product';

/**
 * Validation rules configuration
 */
const VALIDATION_RULES = {
  // Basic product info
  id: {
    pattern: /^[a-z0-9-]+$/,
    minLength: 3,
    maxLength: 50
  },
  slug: {
    pattern: /^[a-z0-9-]+$/,
    minLength: 3,
    maxLength: 50
  },
  name: {
    minLength: 3,
    maxLength: 100
  },
  scientificName: {
    minLength: 5,
    maxLength: 100
  },
  description: {
    minLength: 50,
    maxLength: 2000
  },
  shortDescription: {
    maxLength: 200
  },
  
  // Technical specifications
  density: {
    min: 0,
    max: 2000
  },
  
  // Pricing
  basePrice: {
    min: 0,
    max: 100000
  },
  
  // SEO
  metaTitle: {
    minLength: 30,
    maxLength: 60
  },
  metaDescription: {
    minLength: 120,
    maxLength: 160
  },
  keywords: {
    minCount: 3,
    maxCount: 10
  },
  
  // Images
  imageUrl: {
    pattern: /^\/images\/products\/[a-z0-9-]+\/[a-z0-9-]+\.(webp|jpg|jpeg)$/
  }
};

/**
 * Validates a product ID
 */
export function validateProductId(id: string): string[] {
  const errors: string[] = [];
  
  if (!id) {
    errors.push('Product ID is required');
    return errors;
  }
  
  if (id.length < VALIDATION_RULES.id.minLength) {
    errors.push(`Product ID must be at least ${VALIDATION_RULES.id.minLength} characters long`);
  }
  
  if (id.length > VALIDATION_RULES.id.maxLength) {
    errors.push(`Product ID must be no more than ${VALIDATION_RULES.id.maxLength} characters long`);
  }
  
  if (!VALIDATION_RULES.id.pattern.test(id)) {
    errors.push('Product ID must contain only lowercase letters, numbers, and hyphens');
  }
  
  return errors;
}

/**
 * Validates a product slug
 */
export function validateProductSlug(slug: string): string[] {
  const errors: string[] = [];
  
  if (!slug) {
    errors.push('Product slug is required');
    return errors;
  }
  
  if (slug.length < VALIDATION_RULES.slug.minLength) {
    errors.push(`Product slug must be at least ${VALIDATION_RULES.slug.minLength} characters long`);
  }
  
  if (slug.length > VALIDATION_RULES.slug.maxLength) {
    errors.push(`Product slug must be no more than ${VALIDATION_RULES.slug.maxLength} characters long`);
  }
  
  if (!VALIDATION_RULES.slug.pattern.test(slug)) {
    errors.push('Product slug must contain only lowercase letters, numbers, and hyphens');
  }
  
  return errors;
}

/**
 * Validates product name
 */
export function validateProductName(name: string): string[] {
  const errors: string[] = [];
  
  if (!name) {
    errors.push('Product name is required');
    return errors;
  }
  
  if (name.length < VALIDATION_RULES.name.minLength) {
    errors.push(`Product name must be at least ${VALIDATION_RULES.name.minLength} characters long`);
  }
  
  if (name.length > VALIDATION_RULES.name.maxLength) {
    errors.push(`Product name must be no more than ${VALIDATION_RULES.name.maxLength} characters long`);
  }
  
  return errors;
}

/**
 * Validates scientific name
 */
export function validateScientificName(scientificName: string): string[] {
  const errors: string[] = [];
  
  if (!scientificName) {
    errors.push('Scientific name is required');
    return errors;
  }
  
  if (scientificName.length < VALIDATION_RULES.scientificName.minLength) {
    errors.push(`Scientific name must be at least ${VALIDATION_RULES.scientificName.minLength} characters long`);
  }
  
  if (scientificName.length > VALIDATION_RULES.scientificName.maxLength) {
    errors.push(`Scientific name must be no more than ${VALIDATION_RULES.scientificName.maxLength} characters long`);
  }
  
  // Check for proper scientific nomenclature format
  if (!/^[A-Z][a-z]+ [a-z]+$/.test(scientificName)) {
    errors.push('Scientific name should follow proper nomenclature format (e.g., "Shorea robusta")');
  }
  
  return errors;
}

/**
 * Validates product description
 */
export function validateDescription(description: string): string[] {
  const errors: string[] = [];
  
  if (!description) {
    errors.push('Product description is required');
    return errors;
  }
  
  if (description.length < VALIDATION_RULES.description.minLength) {
    errors.push(`Product description must be at least ${VALIDATION_RULES.description.minLength} characters long`);
  }
  
  if (description.length > VALIDATION_RULES.description.maxLength) {
    errors.push(`Product description must be no more than ${VALIDATION_RULES.description.maxLength} characters long`);
  }
  
  return errors;
}

/**
 * Validates short description
 */
export function validateShortDescription(shortDescription: string): string[] {
  const errors: string[] = [];
  
  if (!shortDescription) {
    errors.push('Short description is required');
    return errors;
  }
  
  if (shortDescription.length > VALIDATION_RULES.shortDescription.maxLength) {
    errors.push(`Short description must be no more than ${VALIDATION_RULES.shortDescription.maxLength} characters long`);
  }
  
  return errors;
}

/**
 * Validates density specification
 */
export function validateDensity(density: DensitySpec): string[] {
  const errors: string[] = [];
  
  if (!density) {
    errors.push('Density specification is required');
    return errors;
  }
  
  if (typeof density.min !== 'number' || density.min < VALIDATION_RULES.density.min) {
    errors.push(`Minimum density must be at least ${VALIDATION_RULES.density.min} kg/m³`);
  }
  
  if (typeof density.max !== 'number' || density.max > VALIDATION_RULES.density.max) {
    errors.push(`Maximum density must be no more than ${VALIDATION_RULES.density.max} kg/m³`);
  }
  
  if (density.min >= density.max) {
    errors.push('Minimum density must be less than maximum density');
  }
  
  return errors;
}

/**
 * Validates product specifications
 */
export function validateSpecifications(specifications: ProductSpecifications): string[] {
  const errors: string[] = [];
  
  if (!specifications) {
    errors.push('Product specifications are required');
    return errors;
  }
  
  // Validate density
  errors.push(...validateDensity(specifications.density));
  
  // Validate required fields
  const requiredFields = [
    'grainPattern', 'texture', 'color', 'workability', 
    'durability', 'moistureResistance', 'insectResistance'
  ];
  
  requiredFields.forEach(field => {
    if (!specifications[field as keyof ProductSpecifications]) {
      errors.push(`${field} is required in specifications`);
    }
  });
  
  // Validate enum values
  const validGrainPatterns = ['straight', 'interlocked', 'wavy', 'mixed'];
  if (!validGrainPatterns.includes(specifications.grainPattern)) {
    errors.push(`Invalid grain pattern: ${specifications.grainPattern}`);
  }
  
  const validTextures = ['fine', 'medium', 'coarse'];
  if (!validTextures.includes(specifications.texture)) {
    errors.push(`Invalid texture: ${specifications.texture}`);
  }
  
  const validRatings = ['excellent', 'good', 'moderate', 'poor', 'difficult'];
  const ratingFields = ['workability', 'durability', 'moistureResistance', 'insectResistance'];
  
  ratingFields.forEach(field => {
    const value = specifications[field as keyof ProductSpecifications];
    if (!validRatings.includes(value as string)) {
      errors.push(`Invalid ${field}: ${value}`);
    }
  });
  
  return errors;
}

/**
 * Validates pricing information
 */
export function validatePricing(pricing: PricingInfo): string[] {
  const errors: string[] = [];
  
  if (!pricing) {
    errors.push('Pricing information is required');
    return errors;
  }
  
  if (typeof pricing.basePrice !== 'number' || pricing.basePrice < VALIDATION_RULES.basePrice.min) {
    errors.push(`Base price must be at least ${VALIDATION_RULES.basePrice.min}`);
  }
  
  if (typeof pricing.basePrice !== 'number' || pricing.basePrice > VALIDATION_RULES.basePrice.max) {
    errors.push(`Base price must be no more than ${VALIDATION_RULES.basePrice.max}`);
  }
  
  const validUnits = ['cubic-foot', 'board-foot', 'log', 'plank'];
  if (!validUnits.includes(pricing.unit)) {
    errors.push(`Invalid pricing unit: ${pricing.unit}`);
  }
  
  // Validate bulk discounts
  if (pricing.bulkDiscounts) {
    pricing.bulkDiscounts.forEach((discount, index) => {
      if (discount.minQuantity < 1) {
        errors.push(`Bulk discount ${index + 1}: minimum quantity must be at least 1`);
      }
      if (discount.discountPercentage < 0 || discount.discountPercentage > 100) {
        errors.push(`Bulk discount ${index + 1}: discount percentage must be between 0 and 100`);
      }
    });
  }
  
  return errors;
}

/**
 * Validates availability information
 */
export function validateAvailability(availability: AvailabilityInfo): string[] {
  const errors: string[] = [];
  
  if (!availability) {
    errors.push('Availability information is required');
    return errors;
  }
  
  const validStatuses = ['in-stock', 'limited', 'out-of-stock', 'seasonal'];
  if (!validStatuses.includes(availability.status)) {
    errors.push(`Invalid availability status: ${availability.status}`);
  }
  
  if (!availability.leadTime) {
    errors.push('Lead time is required');
  }
  
  return errors;
}

/**
 * Validates image URLs
 */
export function validateImageUrl(url: string, imageType: string): string[] {
  const errors: string[] = [];
  
  if (!url) {
    errors.push(`${imageType} image URL is required`);
    return errors;
  }
  
  if (!VALIDATION_RULES.imageUrl.pattern.test(url)) {
    errors.push(`${imageType} image URL must be a valid product image path`);
  }
  
  return errors;
}

/**
 * Validates product images
 */
export function validateImages(images: ProductImages): string[] {
  const errors: string[] = [];
  
  if (!images) {
    errors.push('Product images are required');
    return errors;
  }
  
  // Validate hero image
  if (images.hero) {
    errors.push(...validateImageUrl(images.hero.webp, 'Hero WebP'));
    errors.push(...validateImageUrl(images.hero.jpg, 'Hero JPEG'));
    if (!images.hero.alt) {
      errors.push('Hero image alt text is required');
    }
  } else {
    errors.push('Hero image is required');
  }
  
  // Validate gallery images
  if (images.gallery) {
    images.gallery.forEach((img, index) => {
      errors.push(...validateImageUrl(img.webp, `Gallery ${index + 1} WebP`));
      errors.push(...validateImageUrl(img.jpg, `Gallery ${index + 1} JPEG`));
      if (!img.alt) {
        errors.push(`Gallery image ${index + 1} alt text is required`);
      }
    });
  }
  
  // Validate detail images
  if (images.details) {
    if (images.details.grain) {
      errors.push(...validateImageUrl(images.details.grain.webp, 'Grain detail WebP'));
      errors.push(...validateImageUrl(images.details.grain.jpg, 'Grain detail JPEG'));
      if (!images.details.grain.alt) {
        errors.push('Grain detail image alt text is required');
      }
    }
    
    if (images.details.crossSection) {
      errors.push(...validateImageUrl(images.details.crossSection.webp, 'Cross-section WebP'));
      errors.push(...validateImageUrl(images.details.crossSection.jpg, 'Cross-section JPEG'));
      if (!images.details.crossSection.alt) {
        errors.push('Cross-section image alt text is required');
      }
    }
    
    if (images.details.applications) {
      images.details.applications.forEach((img, index) => {
        errors.push(...validateImageUrl(img.webp, `Application ${index + 1} WebP`));
        errors.push(...validateImageUrl(img.jpg, `Application ${index + 1} JPEG`));
        if (!img.alt) {
          errors.push(`Application image ${index + 1} alt text is required`);
        }
        if (!img.caption) {
          errors.push(`Application image ${index + 1} caption is required`);
        }
      });
    }
  }
  
  return errors;
}

/**
 * Validates SEO data
 */
export function validateSEO(seo: SEOData): string[] {
  const errors: string[] = [];
  
  if (!seo) {
    errors.push('SEO data is required');
    return errors;
  }
  
  // Validate meta title
  if (!seo.metaTitle) {
    errors.push('Meta title is required');
  } else {
    if (seo.metaTitle.length < VALIDATION_RULES.metaTitle.minLength) {
      errors.push(`Meta title must be at least ${VALIDATION_RULES.metaTitle.minLength} characters long`);
    }
    if (seo.metaTitle.length > VALIDATION_RULES.metaTitle.maxLength) {
      errors.push(`Meta title must be no more than ${VALIDATION_RULES.metaTitle.maxLength} characters long`);
    }
  }
  
  // Validate meta description
  if (!seo.metaDescription) {
    errors.push('Meta description is required');
  } else {
    if (seo.metaDescription.length < VALIDATION_RULES.metaDescription.minLength) {
      errors.push(`Meta description must be at least ${VALIDATION_RULES.metaDescription.minLength} characters long`);
    }
    if (seo.metaDescription.length > VALIDATION_RULES.metaDescription.maxLength) {
      errors.push(`Meta description must be no more than ${VALIDATION_RULES.metaDescription.maxLength} characters long`);
    }
  }
  
  // Validate keywords
  if (!seo.keywords || !Array.isArray(seo.keywords)) {
    errors.push('Keywords array is required');
  } else {
    if (seo.keywords.length < VALIDATION_RULES.keywords.minCount) {
      errors.push(`At least ${VALIDATION_RULES.keywords.minCount} keywords are required`);
    }
    if (seo.keywords.length > VALIDATION_RULES.keywords.maxCount) {
      errors.push(`No more than ${VALIDATION_RULES.keywords.maxCount} keywords are allowed`);
    }
  }
  
  // Validate canonical URL
  if (!seo.canonicalUrl) {
    errors.push('Canonical URL is required');
  } else if (!seo.canonicalUrl.startsWith('http')) {
    errors.push('Canonical URL must be absolute (start with http/https)');
  }
  
  // Validate structured data
  if (!seo.structuredData) {
    errors.push('Structured data is required');
  } else {
    const requiredFields = ['@context', '@type', 'name', 'description', 'image', 'offers'];
    requiredFields.forEach(field => {
      if (!seo.structuredData[field]) {
        errors.push(`Structured data missing required field: ${field}`);
      }
    });
  }
  
  return errors;
}

/**
 * Validates a complete product
 */
export function validateProduct(product: Product): ProductValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Validate basic fields
  errors.push(...validateProductId(product.id));
  errors.push(...validateProductSlug(product.slug));
  errors.push(...validateProductName(product.name));
  errors.push(...validateScientificName(product.scientificName));
  errors.push(...validateDescription(product.description));
  errors.push(...validateShortDescription(product.shortDescription));
  
  // Validate technical specifications
  errors.push(...validateSpecifications(product.specifications));
  
  // Validate pricing
  errors.push(...validatePricing(product.pricing));
  
  // Validate availability
  errors.push(...validateAvailability(product.availability));
  
  // Validate images
  errors.push(...validateImages(product.images));
  
  // Validate SEO
  errors.push(...validateSEO(product.seo));
  
  // Check for duplicate IDs (this would require checking against existing products)
  // This is a warning rather than an error
  if (product.id && product.slug && product.id !== product.slug) {
    warnings.push('Product ID and slug should match for consistency');
  }
  
  // Check for missing key features
  if (!product.keyFeatures || product.keyFeatures.length === 0) {
    warnings.push('Product should have at least one key feature');
  }
  
  // Check for missing applications
  if (!product.applications.primary || product.applications.primary.length === 0) {
    warnings.push('Product should have at least one primary application');
  }
  
  // Check for missing quality grades
  if (!product.qualityGrades || product.qualityGrades.length === 0) {
    warnings.push('Product should have at least one quality grade');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Validates multiple products and returns summary
 */
export function validateProducts(products: Product[]): {
  valid: number;
  invalid: number;
  totalErrors: number;
  totalWarnings: number;
  results: ProductValidationResult[];
} {
  const results = products.map(validateProduct);
  
  const valid = results.filter(r => r.isValid).length;
  const invalid = results.filter(r => !r.isValid).length;
  const totalErrors = results.reduce((sum, r) => sum + r.errors.length, 0);
  const totalWarnings = results.reduce((sum, r) => sum + r.warnings.length, 0);
  
  return {
    valid,
    invalid,
    totalErrors,
    totalWarnings,
    results
  };
}

/**
 * Sanitizes product data by removing invalid characters and normalizing values
 */
export function sanitizeProduct(product: Partial<Product>): Partial<Product> {
  const sanitized = { ...product };
  
  // Sanitize ID and slug
  if (sanitized.id) {
    sanitized.id = sanitized.id.toLowerCase().replace(/[^a-z0-9-]/g, '-');
  }
  
  if (sanitized.slug) {
    sanitized.slug = sanitized.slug.toLowerCase().replace(/[^a-z0-9-]/g, '-');
  }
  
  // Sanitize scientific name
  if (sanitized.scientificName) {
    sanitized.scientificName = sanitized.scientificName.trim();
  }
  
  // Sanitize descriptions
  if (sanitized.description) {
    sanitized.description = sanitized.description.trim();
  }
  
  if (sanitized.shortDescription) {
    sanitized.shortDescription = sanitized.shortDescription.trim();
  }
  
  // Sanitize SEO data
  if (sanitized.seo) {
    if (sanitized.seo.metaTitle) {
      sanitized.seo.metaTitle = sanitized.seo.metaTitle.trim();
    }
    if (sanitized.seo.metaDescription) {
      sanitized.seo.metaDescription = sanitized.seo.metaDescription.trim();
    }
    if (sanitized.seo.keywords) {
      sanitized.seo.keywords = sanitized.seo.keywords.map(k => k.trim()).filter(k => k.length > 0);
    }
  }
  
  return sanitized;
}

