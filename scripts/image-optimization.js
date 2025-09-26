#!/usr/bin/env node

/**
 * Image Optimization Script for Product Pages
 * Converts images to WebP format with JPEG fallbacks
 * Optimizes images for web delivery
 */

const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

const PRODUCTS_DIR = 'public/images/products';
const QUALITY = {
  webp: 85,
  jpeg: 90
};

const SIZES = {
  hero: { width: 800, height: 600 },
  gallery: { width: 600, height: 400 },
  thumbnail: { width: 200, height: 150 },
  detail: { width: 400, height: 300 }
};

async function optimizeImage(inputPath, outputDir, filename, size) {
  try {
    const baseName = path.parse(filename).name;
    
    // WebP version
    await sharp(inputPath)
      .resize(size.width, size.height, { fit: 'cover' })
      .webp({ quality: QUALITY.webp })
      .toFile(path.join(outputDir, `${baseName}.webp`));
    
    // JPEG fallback
    await sharp(inputPath)
      .resize(size.width, size.height, { fit: 'cover' })
      .jpeg({ quality: QUALITY.jpeg })
      .toFile(path.join(outputDir, `${baseName}.jpg`));
    
    console.log(`✓ Optimized ${filename} -> ${baseName}.webp + ${baseName}.jpg`);
  } catch (error) {
    console.error(`✗ Failed to optimize ${filename}:`, error.message);
  }
}

async function processProductImages(productDir) {
  const productName = path.basename(productDir);
  console.log(`\nProcessing ${productName}...`);
  
  try {
    const files = await fs.readdir(productDir);
    const imageFiles = files.filter(file => 
      /\.(jpg|jpeg|png)$/i.test(file)
    );
    
    if (imageFiles.length === 0) {
      console.log(`  No images found in ${productName}`);
      return;
    }
    
    for (const file of imageFiles) {
      const inputPath = path.join(productDir, file);
      const stat = await fs.stat(inputPath);
      
      if (stat.isFile()) {
        // Determine size based on filename
        let size = SIZES.gallery;
        if (file.includes('hero')) size = SIZES.hero;
        else if (file.includes('thumbnail')) size = SIZES.thumbnail;
        else if (file.includes('detail')) size = SIZES.detail;
        
        await optimizeImage(inputPath, productDir, file, size);
      }
    }
  } catch (error) {
    console.error(`Error processing ${productName}:`, error.message);
  }
}

async function main() {
  console.log('🖼️  Starting image optimization...\n');
  
  try {
    const products = await fs.readdir(PRODUCTS_DIR);
    
    for (const product of products) {
      const productPath = path.join(PRODUCTS_DIR, product);
      const stat = await fs.stat(productPath);
      
      if (stat.isDirectory()) {
        await processProductImages(productPath);
      }
    }
    
    console.log('\n✅ Image optimization complete!');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { optimizeImage, processProductImages };

