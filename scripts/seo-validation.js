#!/usr/bin/env node

/**
 * SEO Validation Script for Product Pages
 * Validates meta tags, structured data, and SEO best practices
 */

const fs = require('fs').promises;
const path = require('path');

const PRODUCTS_DIR = 'src/data/products';
const VALIDATION_RULES = {
  metaTitle: {
    minLength: 30,
    maxLength: 60,
    required: true
  },
  metaDescription: {
    minLength: 120,
    maxLength: 160,
    required: true
  },
  keywords: {
    minCount: 3,
    maxCount: 10,
    required: true
  },
  canonicalUrl: {
    required: true,
    mustBeAbsolute: true
  },
  structuredData: {
    required: true,
    mustBeValid: true
  }
};

class SEOValidator {
  constructor() {
    this.errors = [];
    this.warnings = [];
  }

  validateMetaTitle(title, productName) {
    if (!title) {
      this.errors.push(`${productName}: Meta title is required`);
      return false;
    }

    if (title.length < VALIDATION_RULES.metaTitle.minLength) {
      this.warnings.push(`${productName}: Meta title too short (${title.length} chars, min ${VALIDATION_RULES.metaTitle.minLength})`);
    }

    if (title.length > VALIDATION_RULES.metaTitle.maxLength) {
      this.warnings.push(`${productName}: Meta title too long (${title.length} chars, max ${VALIDATION_RULES.metaTitle.maxLength})`);
    }

    return true;
  }

  validateMetaDescription(description, productName) {
    if (!description) {
      this.errors.push(`${productName}: Meta description is required`);
      return false;
    }

    if (description.length < VALIDATION_RULES.metaDescription.minLength) {
      this.warnings.push(`${productName}: Meta description too short (${description.length} chars, min ${VALIDATION_RULES.metaDescription.minLength})`);
    }

    if (description.length > VALIDATION_RULES.metaDescription.maxLength) {
      this.warnings.push(`${productName}: Meta description too long (${description.length} chars, max ${VALIDATION_RULES.metaDescription.maxLength})`);
    }

    return true;
  }

  validateKeywords(keywords, productName) {
    if (!keywords || !Array.isArray(keywords)) {
      this.errors.push(`${productName}: Keywords array is required`);
      return false;
    }

    if (keywords.length < VALIDATION_RULES.keywords.minCount) {
      this.warnings.push(`${productName}: Too few keywords (${keywords.length}, min ${VALIDATION_RULES.keywords.minCount})`);
    }

    if (keywords.length > VALIDATION_RULES.keywords.maxCount) {
      this.warnings.push(`${productName}: Too many keywords (${keywords.length}, max ${VALIDATION_RULES.keywords.maxCount})`);
    }

    return true;
  }

  validateCanonicalUrl(url, productName) {
    if (!url) {
      this.errors.push(`${productName}: Canonical URL is required`);
      return false;
    }

    if (!url.startsWith('http')) {
      this.errors.push(`${productName}: Canonical URL must be absolute (start with http/https)`);
      return false;
    }

    return true;
  }

  validateStructuredData(structuredData, productName) {
    if (!structuredData) {
      this.errors.push(`${productName}: Structured data is required`);
      return false;
    }

    try {
      // Basic validation of required fields
      const required = ['@context', '@type', 'name', 'description', 'image', 'offers'];
      for (const field of required) {
        if (!structuredData[field]) {
          this.errors.push(`${productName}: Structured data missing required field: ${field}`);
        }
      }

      // Validate offers structure
      if (structuredData.offers) {
        const offerRequired = ['@type', 'price', 'priceCurrency', 'availability'];
        for (const field of offerRequired) {
          if (!structuredData.offers[field]) {
            this.errors.push(`${productName}: Offers missing required field: ${field}`);
          }
        }
      }

    } catch (error) {
      this.errors.push(`${productName}: Invalid structured data format`);
    }

    return true;
  }

  validateProduct(product) {
    const productName = product.name || product.id || 'Unknown Product';
    
    this.validateMetaTitle(product.seo?.metaTitle, productName);
    this.validateMetaDescription(product.seo?.metaDescription, productName);
    this.validateKeywords(product.seo?.keywords, productName);
    this.validateCanonicalUrl(product.seo?.canonicalUrl, productName);
    this.validateStructuredData(product.seo?.structuredData, productName);
  }

  getReport() {
    return {
      errors: this.errors,
      warnings: this.warnings,
      hasErrors: this.errors.length > 0,
      hasWarnings: this.warnings.length > 0
    };
  }
}

async function validateProductFile(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf8');
    const product = JSON.parse(content);
    
    const validator = new SEOValidator();
    validator.validateProduct(product);
    
    return validator.getReport();
  } catch (error) {
    return {
      errors: [`Failed to parse ${filePath}: ${error.message}`],
      warnings: [],
      hasErrors: true,
      hasWarnings: false
    };
  }
}

async function main() {
  console.log('🔍 Starting SEO validation...\n');
  
  try {
    const files = await fs.readdir(PRODUCTS_DIR);
    const productFiles = files.filter(file => file.endsWith('.json'));
    
    if (productFiles.length === 0) {
      console.log('No product files found to validate');
      return;
    }

    let totalErrors = 0;
    let totalWarnings = 0;

    for (const file of productFiles) {
      const filePath = path.join(PRODUCTS_DIR, file);
      const report = await validateProductFile(filePath);
      
      if (report.hasErrors || report.hasWarnings) {
        console.log(`\n📄 ${file}:`);
        
        if (report.hasErrors) {
          console.log('  ❌ Errors:');
          report.errors.forEach(error => console.log(`    - ${error}`));
          totalErrors += report.errors.length;
        }
        
        if (report.hasWarnings) {
          console.log('  ⚠️  Warnings:');
          report.warnings.forEach(warning => console.log(`    - ${warning}`));
          totalWarnings += report.warnings.length;
        }
      } else {
        console.log(`✅ ${file}: All validations passed`);
      }
    }

    console.log(`\n📊 Summary:`);
    console.log(`  Total errors: ${totalErrors}`);
    console.log(`  Total warnings: ${totalWarnings}`);
    
    if (totalErrors === 0) {
      console.log('\n🎉 All SEO validations passed!');
    } else {
      console.log('\n❌ SEO validation failed. Please fix the errors above.');
      process.exit(1);
    }

  } catch (error) {
    console.error('❌ Error during validation:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { SEOValidator, validateProductFile };

