#!/usr/bin/env node

/**
 * Appwrite Initialization Script
 * Run this script after setting up your Appwrite project to create the basic structure
 */

import { Client, Databases, Storage, ID } from 'appwrite';

// Configuration - Update these with your actual values
const config = {
  endpoint: 'https://cloud.appwrite.io/v1',
  projectId: process.env.VITE_APPWRITE_PROJECT_ID || 'your-project-id',
  databaseId: 'timbercraft-db',
  apiKey: process.env.APPWRITE_API_KEY || '', // Server-side API key
};

const client = new Client()
  .setEndpoint(config.endpoint)
  .setProject(config.projectId)
  .setKey(config.apiKey);

const databases = new Databases(client);
const storage = new Storage(client);

async function initializeAppwrite() {
  console.log('🚀 Initializing Appwrite for Timber Craft Commerce Hub...\n');

  try {
    // Create Database
    console.log('📊 Creating database...');
    await databases.create(config.databaseId, 'Timber Craft Database');
    console.log('✅ Database created successfully\n');

    // Create Collections
    await createCollections();

    // Create Storage Buckets
    await createBuckets();

    console.log('🎉 Appwrite initialization completed successfully!');
    console.log('\nNext steps:');
    console.log('1. Update your .env file with the correct Project ID');
    console.log('2. Test the authentication flow');
    console.log('3. Add your product data to the database');

  } catch (error) {
    console.error('❌ Error during initialization:', error.message);
    console.log('\nTroubleshooting:');
    console.log('1. Make sure your API key has the necessary permissions');
    console.log('2. Check that the project ID is correct');
    console.log('3. Ensure Appwrite server is running and accessible');
  }
}

async function createCollections() {
  console.log('📋 Creating collections...');

  const collections = [
    {
      id: 'users',
      name: 'Users',
      permissions: ['read("any")', 'write("users")'],
      attributes: [
        { key: 'companyName', type: 'string', required: false, size: 255 },
        { key: 'usagePreference', type: 'string', required: false, size: 20 },
      ]
    },
    {
      id: 'products',
      name: 'Products',
      permissions: ['read("any")', 'write("users")'],
      attributes: [
        { key: 'name', type: 'string', required: true, size: 255 },
        { key: 'scientificName', type: 'string', required: false, size: 255 },
        { key: 'category', type: 'string', required: true, size: 50 },
        { key: 'grade', type: 'string', required: true, size: 20 },
      ]
    },
    {
      id: 'orders',
      name: 'Orders',
      permissions: ['read("users")', 'write("users")'],
      attributes: [
        { key: 'userId', type: 'string', required: false, size: 50 },
        { key: 'purpose', type: 'string', required: true, size: 20 },
        { key: 'frames', type: 'integer', required: true },
        { key: 'deliveryRequired', type: 'boolean', required: true },
        { key: 'address', type: 'string', required: false, size: 500 },
        { key: 'name', type: 'string', required: true, size: 255 },
        { key: 'email', type: 'string', required: true, size: 255 },
        { key: 'phone', type: 'string', required: true, size: 20 },
        { key: 'customization', type: 'string', required: false, size: 1000 },
        { key: 'status', type: 'string', required: true, size: 20 },
        { key: 'estimatedValue', type: 'integer', required: false },
      ]
    },
    {
      id: 'estimates',
      name: 'Estimates',
      permissions: ['read("users")', 'write("users")'],
      attributes: [
        { key: 'userId', type: 'string', required: false, size: 50 },
        { key: 'woodType', type: 'string', required: true, size: 100 },
        { key: 'quantity', type: 'integer', required: true },
        { key: 'customization', type: 'string', required: false, size: 500 },
        { key: 'totalPrice', type: 'integer', required: true },
      ]
    }
  ];

  for (const collection of collections) {
    try {
      await databases.createCollection(
        config.databaseId,
        collection.id,
        collection.name,
        collection.permissions
      );

      // Create attributes
      for (const attr of collection.attributes) {
        if (attr.type === 'string') {
          await databases.createStringAttribute(
            config.databaseId,
            collection.id,
            attr.key,
            attr.size,
            attr.required
          );
        } else if (attr.type === 'integer') {
          await databases.createIntegerAttribute(
            config.databaseId,
            collection.id,
            attr.key,
            attr.required
          );
        } else if (attr.type === 'boolean') {
          await databases.createBooleanAttribute(
            config.databaseId,
            collection.id,
            attr.key,
            attr.required
          );
        }
      }

      console.log(`✅ Created collection: ${collection.name}`);
    } catch (error) {
      console.log(`⚠️  Collection ${collection.name} may already exist:`, error.message);
    }
  }

  console.log('');
}

async function createBuckets() {
  console.log('📦 Creating storage buckets...');

  const buckets = [
    {
      id: 'product-images',
      name: 'Product Images',
      permissions: ['read("any")', 'write("users")'],
      fileSecurity: true,
      enabled: true,
      maximumFileSize: 5 * 1024 * 1024, // 5MB
      allowedFileExtensions: ['jpg', 'jpeg', 'png', 'webp']
    },
    {
      id: 'user-files',
      name: 'User Files',
      permissions: ['read("users")', 'write("users")'],
      fileSecurity: true,
      enabled: true,
      maximumFileSize: 10 * 1024 * 1024, // 10MB
      allowedFileExtensions: ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx']
    }
  ];

  for (const bucket of buckets) {
    try {
      await storage.createBucket(
        bucket.id,
        bucket.name,
        bucket.permissions,
        bucket.fileSecurity,
        bucket.enabled,
        bucket.maximumFileSize,
        bucket.allowedFileExtensions
      );
      console.log(`✅ Created bucket: ${bucket.name}`);
    } catch (error) {
      console.log(`⚠️  Bucket ${bucket.name} may already exist:`, error.message);
    }
  }

  console.log('');
}

// Seed initial data
async function seedInitialData() {
  console.log('🌱 Seeding initial product data...');

  const sampleProducts = [
    {
      name: 'Burma Teak',
      scientificName: 'Tectona grandis',
      category: 'teak',
      grade: 'premium',
      overview: {
        description: 'Premium Burma Teak with exceptional durability',
        keyBenefits: ['High durability', 'Beautiful grain', 'Weather resistant'],
        premiumPositioning: 'Gold standard of premium hardwoods',
        tagline: 'The Gold Standard of Premium Hardwoods'
      },
      specifications: {
        density: 650,
        hardness: 1155,
        moistureContent: 10,
        grainPattern: 'straight',
        durability: 'class1',
        workability: 'excellent',
        finishQuality: 'excellent',
        dimensionalStability: 'high'
      },
      pricing: {
        pricePerSqFt: 3500,
        priceRange: 'luxury',
        marketTrend: 'increasing'
      }
    }
  ];

  for (const product of sampleProducts) {
    try {
      await databases.createDocument(
        config.databaseId,
        'products',
        ID.unique(),
        product
      );
      console.log(`✅ Added product: ${product.name}`);
    } catch (error) {
      console.log(`⚠️  Failed to add product ${product.name}:`, error.message);
    }
  }

  console.log('');
}

// Run the initialization
if (require.main === module) {
  initializeAppwrite().then(() => {
    console.log('✨ Initialization complete!');
    process.exit(0);
  }).catch((error) => {
    console.error('💥 Initialization failed:', error);
    process.exit(1);
  });
}

export { initializeAppwrite, seedInitialData };
