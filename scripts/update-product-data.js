#!/usr/bin/env node
/**
 * Update Product Data Script
 * Updates product JSON with new image structure and pricing
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read current product data
const productsPath = path.join(__dirname, '..', 'src', 'data', 'products.json');
const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

console.log('🚀 Updating product data with new image structure and pricing...');

// Update each product
products.forEach(product => {
  console.log(`\n📦 Updating: ${product.name}`);
  
  // Create new image structure
  const contexts = [
    { id: 'apartment', name: 'Residential Apartment' },
    { id: 'villa', name: 'Residential Villa' },
    { id: 'office', name: 'Commercial Office' },
    { id: 'retail', name: 'Commercial Retail' }
  ];
  
  // Update images array
  product.images = contexts.map((context, index) => ({
    id: `${product.id}-${context.id}`,
    productId: product.id,
    url: `/images/products/${product.id}-${context.id}.webp`,
    altText: `${product.name} in ${context.name} - Bangalore`,
    context: context.id,
    sequence: index + 1,
    dimensions: {
      width: 1920,
      height: 1080,
      aspectRatio: "16:9"
    },
    metadata: {
      generatedAt: new Date().toISOString(),
      prompt: `${product.description} installed in ${context.name.toLowerCase()} building, professional photography, 16:9 aspect ratio`,
      optimized: true,
      seoKeywords: [context.id, 'bangalore', product.category]
    },
    isActive: true
  }));
  
  // Update pricing structure
  const originalPricing = product.pricing;
  product.pricing = {
    type: "quote_based",
    displayText: "Contact for Quote",
    ctaButton: {
      text: "Get Quote Now",
      action: "contact",
      style: "primary"
    },
    internalPricing: {
      basePrice: originalPricing?.basePrice || null,
      currency: originalPricing?.currency || "INR",
      unit: originalPricing?.unit || "piece",
      priceRange: originalPricing?.priceRange,
      bulkDiscount: originalPricing?.bulkDiscount
    },
    isVisible: true
  };
  
  // Update primary image
  product.primaryImage = product.images[0]?.url;
  
  console.log(`  ✅ Updated images: ${product.images.length} context images`);
  console.log(`  ✅ Updated pricing: Quote-based display`);
});

// Write updated data back to file
fs.writeFileSync(productsPath, JSON.stringify(products, null, 2));

console.log('\n🎉 Product data update complete!');
console.log(`📁 Updated file: ${productsPath}`);
console.log(`📊 Updated ${products.length} products`);

// Create a summary
console.log('\n📋 Summary of changes:');
products.forEach(product => {
  console.log(`  • ${product.name}: ${product.images.length} images, quote-based pricing`);
});
