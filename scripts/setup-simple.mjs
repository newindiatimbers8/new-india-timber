#!/usr/bin/env node

import { Client, Databases, Storage, ID, Permission, Role } from 'appwrite';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envPath = join(__dirname, '..', '.env');
dotenv.config({ path: envPath });

// Appwrite configuration
const client = new Client()
  .setEndpoint(process.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
  .setProject(process.env.VITE_APPWRITE_PROJECT_ID || 'your-project-id');

const databases = new Databases(client);
const storage = new Storage(client);

const DATABASE_ID = process.env.VITE_APPWRITE_DATABASE_ID || 'timbercraft-db';

async function createDatabase() {
  try {
    console.log('Creating database...');
    const database = await databases.create(DATABASE_ID, 'Timber Craft Commerce Hub');
    console.log('✅ Database created successfully:', database.$id);
    return database;
  } catch (error) {
    if (error.code === 409) {
      console.log('✅ Database already exists:', DATABASE_ID);
      return { $id: DATABASE_ID };
    }
    throw error;
  }
}

async function createCollection(collectionId, name, permissions) {
  try {
    console.log(`Creating collection: ${name}...`);
    const collection = await databases.createCollection(
      DATABASE_ID,
      collectionId,
      name,
      permissions
    );
    console.log(`✅ Collection created: ${name}`);
    return collection;
  } catch (error) {
    if (error.code === 409) {
      console.log(`✅ Collection already exists: ${name}`);
      return { $id: collectionId };
    }
    throw error;
  }
}

async function createStringAttribute(collectionId, key, size = 255, required = false, default_value = null, array = false) {
  try {
    console.log(`  Creating string attribute: ${key}...`);
    await databases.createStringAttribute(
      DATABASE_ID,
      collectionId,
      key,
      size,
      required,
      default_value,
      array
    );
    console.log(`  ✅ String attribute created: ${key}`);
  } catch (error) {
    if (error.code === 409) {
      console.log(`  ✅ String attribute already exists: ${key}`);
    } else {
      console.error(`  ❌ Error creating string attribute ${key}:`, error.message);
    }
  }
}

async function createEnumAttribute(collectionId, key, elements, required = false, default_value = null, array = false) {
  try {
    console.log(`  Creating enum attribute: ${key}...`);
    await databases.createEnumAttribute(
      DATABASE_ID,
      collectionId,
      key,
      elements,
      required,
      default_value,
      array
    );
    console.log(`  ✅ Enum attribute created: ${key}`);
  } catch (error) {
    if (error.code === 409) {
      console.log(`  ✅ Enum attribute already exists: ${key}`);
    } else {
      console.error(`  ❌ Error creating enum attribute ${key}:`, error.message);
    }
  }
}

async function createBooleanAttribute(collectionId, key, required = false, default_value = false) {
  try {
    console.log(`  Creating boolean attribute: ${key}...`);
    await databases.createBooleanAttribute(
      DATABASE_ID,
      collectionId,
      key,
      required,
      default_value
    );
    console.log(`  ✅ Boolean attribute created: ${key}`);
  } catch (error) {
    if (error.code === 409) {
      console.log(`  ✅ Boolean attribute already exists: ${key}`);
    } else {
      console.error(`  ❌ Error creating boolean attribute ${key}:`, error.message);
    }
  }
}

async function createIntegerAttribute(collectionId, key, required = false, min = null, max = null, default_value = null) {
  try {
    console.log(`  Creating integer attribute: ${key}...`);
    await databases.createIntegerAttribute(
      DATABASE_ID,
      collectionId,
      key,
      required,
      min,
      max,
      default_value
    );
    console.log(`  ✅ Integer attribute created: ${key}`);
  } catch (error) {
    if (error.code === 409) {
      console.log(`  ✅ Integer attribute already exists: ${key}`);
    } else {
      console.error(`  ❌ Error creating integer attribute ${key}:`, error.message);
    }
  }
}

async function createFloatAttribute(collectionId, key, required = false, min = null, max = null, default_value = null) {
  try {
    console.log(`  Creating float attribute: ${key}...`);
    await databases.createFloatAttribute(
      DATABASE_ID,
      collectionId,
      key,
      required,
      min,
      max,
      default_value
    );
    console.log(`  ✅ Float attribute created: ${key}`);
  } catch (error) {
    if (error.code === 409) {
      console.log(`  ✅ Float attribute already exists: ${key}`);
    } else {
      console.error(`  ❌ Error creating float attribute ${key}:`, error.message);
    }
  }
}

async function createDatetimeAttribute(collectionId, key, required = false, default_value = null) {
  try {
    console.log(`  Creating datetime attribute: ${key}...`);
    await databases.createDatetimeAttribute(
      DATABASE_ID,
      collectionId,
      key,
      required,
      default_value
    );
    console.log(`  ✅ Datetime attribute created: ${key}`);
  } catch (error) {
    if (error.code === 409) {
      console.log(`  ✅ Datetime attribute already exists: ${key}`);
    } else {
      console.error(`  ❌ Error creating datetime attribute ${key}:`, error.message);
    }
  }
}

async function createBucket(bucketId, name, permissions, fileSecurity = true, allowedFileExtensions = [], maximumFileSize = 10 * 1024 * 1024, enabled = true, encryption = true, antivirus = true) {
  try {
    console.log(`Creating bucket: ${name}...`);
    const bucket = await storage.createBucket(
      bucketId,
      name,
      permissions,
      fileSecurity,
      allowedFileExtensions,
      maximumFileSize,
      enabled,
      encryption,
      antivirus
    );
    console.log(`✅ Bucket created: ${name}`);
    return bucket;
  } catch (error) {
    if (error.code === 409) {
      console.log(`✅ Bucket already exists: ${name}`);
      return { $id: bucketId };
    }
    throw error;
  }
}

async function setupDatabase() {
  try {
    console.log('🚀 Starting database setup...\n');

    // Create database
    await createDatabase();
    console.log('');

    // Create Users collection
    await createCollection('users', 'Users', [
      Permission.read(Role.any()),
      Permission.create(Role.users()),
      Permission.update(Role.users()),
      Permission.delete(Role.users())
    ]);
    console.log('Creating attributes for Users...');
    await createStringAttribute('users', 'name', 255, true);
    await createStringAttribute('users', 'email', 255, true);
    await createStringAttribute('users', 'phone', 20, false);
    await createEnumAttribute('users', 'role', ['customer', 'admin', 'manager'], true, 'customer');
    await createStringAttribute('users', 'profile', 1000, false);
    await createStringAttribute('users', 'address', 500, false);
    await createBooleanAttribute('users', 'isActive', true, true);
    await createDatetimeAttribute('users', 'lastLogin', false);
    console.log('');

    // Create Products collection
    await createCollection('products', 'Wood Products', [
      Permission.read(Role.any()),
      Permission.create(Role.team('admin')),
      Permission.update(Role.team('admin')),
      Permission.delete(Role.team('admin'))
    ]);
    console.log('Creating attributes for Wood Products...');
    await createStringAttribute('products', 'name', 255, true);
    await createStringAttribute('products', 'scientificName', 255, false);
    await createEnumAttribute('products', 'category', ['teak', 'plywood', 'hardwood', 'softwood', 'engineered'], true);
    await createEnumAttribute('products', 'grade', ['premium', 'commercial', 'budget'], true);
    await createStringAttribute('products', 'overview', 2000, true);
    await createStringAttribute('products', 'specifications', 2000, true);
    await createStringAttribute('products', 'origin', 1000, false);
    await createStringAttribute('products', 'pricing', 500, true);
    await createStringAttribute('products', 'comparisonMetrics', 1000, false);
    await createStringAttribute('products', 'prosAndCons', 1000, false);
    await createStringAttribute('products', 'buyingGuide', 1000, false);
    await createStringAttribute('products', 'applications', 1000, false);
    await createStringAttribute('products', 'seo', 1000, false);
    await createStringAttribute('products', 'images', 1000, false, null, true);
    await createBooleanAttribute('products', 'isActive', true, true);
    await createBooleanAttribute('products', 'featured', true, false);
    console.log('');

    // Create Orders collection
    await createCollection('orders', 'Orders', [
      Permission.read(Role.users()),
      Permission.create(Role.users()),
      Permission.update(Role.team('admin')),
      Permission.delete(Role.team('admin'))
    ]);
    console.log('Creating attributes for Orders...');
    await createStringAttribute('orders', 'userId', 255, true);
    await createEnumAttribute('orders', 'purpose', ['commercial', 'residential'], true);
    await createIntegerAttribute('orders', 'frames', true);
    await createBooleanAttribute('orders', 'deliveryRequired', true, false);
    await createStringAttribute('orders', 'address', 500, false);
    await createStringAttribute('orders', 'name', 255, true);
    await createStringAttribute('orders', 'email', 255, true);
    await createStringAttribute('orders', 'phone', 20, true);
    await createStringAttribute('orders', 'customization', 1000, false);
    await createEnumAttribute('orders', 'status', ['pending', 'confirmed', 'processing', 'completed', 'cancelled'], true, 'pending');
    await createFloatAttribute('orders', 'estimatedValue', false);
    await createStringAttribute('orders', 'notes', 1000, false);
    console.log('');

    // Create Estimates collection
    await createCollection('estimates', 'Price Estimates', [
      Permission.read(Role.users()),
      Permission.create(Role.any()),
      Permission.update(Role.users()),
      Permission.delete(Role.users())
    ]);
    console.log('Creating attributes for Price Estimates...');
    await createStringAttribute('estimates', 'userId', 255, false);
    await createStringAttribute('estimates', 'woodType', 255, true);
    await createStringAttribute('estimates', 'dimensions', 500, true);
    await createIntegerAttribute('estimates', 'quantity', true);
    await createStringAttribute('estimates', 'customization', 1000, false);
    await createFloatAttribute('estimates', 'totalPrice', true);
    await createStringAttribute('estimates', 'sessionId', 255, false);
    await createBooleanAttribute('estimates', 'isSaved', true, false);
    console.log('');

    // Create SEO Settings collection
    await createCollection('seo-settings', 'SEO Settings', [
      Permission.read(Role.team('admin')),
      Permission.create(Role.team('admin')),
      Permission.update(Role.team('admin')),
      Permission.delete(Role.team('admin'))
    ]);
    console.log('Creating attributes for SEO Settings...');
    await createEnumAttribute('seo-settings', 'type', ['global', 'page'], true);
    await createStringAttribute('seo-settings', 'pageId', 255, false);
    await createStringAttribute('seo-settings', 'pagePath', 255, false);
    await createStringAttribute('seo-settings', 'pageTitle', 255, false);
    await createStringAttribute('seo-settings', 'metaTitle', 255, false);
    await createStringAttribute('seo-settings', 'metaDescription', 500, false);
    await createStringAttribute('seo-settings', 'keywords', 1000, false, null, true);
    await createStringAttribute('seo-settings', 'canonicalUrl', 500, false);
    await createBooleanAttribute('seo-settings', 'noIndex', true, false);
    await createBooleanAttribute('seo-settings', 'noFollow', true, false);
    await createStringAttribute('seo-settings', 'customMeta', 2000, false);
    await createStringAttribute('seo-settings', 'ogTitle', 255, false);
    await createStringAttribute('seo-settings', 'ogDescription', 500, false);
    await createStringAttribute('seo-settings', 'ogImage', 500, false);
    await createStringAttribute('seo-settings', 'twitterTitle', 255, false);
    await createStringAttribute('seo-settings', 'twitterDescription', 500, false);
    await createStringAttribute('seo-settings', 'twitterImage', 500, false);
    await createFloatAttribute('seo-settings', 'priority', true, 0, 1, 0.5);
    await createEnumAttribute('seo-settings', 'changeFreq', ['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never'], true, 'monthly');
    await createEnumAttribute('seo-settings', 'status', ['published', 'draft', 'archived'], true, 'published');
    console.log('');

    // Create storage buckets
    console.log('Creating storage buckets...');
    await createBucket(
      'product-images',
      'Product Images',
      [
        Permission.read(Role.any()),
        Permission.create(Role.team('admin')),
        Permission.update(Role.team('admin')),
        Permission.delete(Role.team('admin'))
      ],
      true,
      ['jpg', 'jpeg', 'png', 'webp', 'gif'],
      10 * 1024 * 1024, // 10MB
      true,
      true,
      true
    );

    await createBucket(
      'user-files',
      'User Files',
      [
        Permission.read(Role.users()),
        Permission.create(Role.users()),
        Permission.update(Role.users()),
        Permission.delete(Role.users())
      ],
      true,
      ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png', 'webp'],
      5 * 1024 * 1024, // 5MB
      true,
      true,
      true
    );

    await createBucket(
      'seo-assets',
      'SEO Assets',
      [
        Permission.read(Role.any()),
        Permission.create(Role.team('admin')),
        Permission.update(Role.team('admin')),
        Permission.delete(Role.team('admin'))
      ],
      true,
      ['jpg', 'jpeg', 'png', 'webp', 'svg', 'ico'],
      2 * 1024 * 1024, // 2MB
      true,
      true,
      true
    );

    console.log('\n🎉 Database setup completed successfully!');
    console.log('\nDatabase ID:', DATABASE_ID);
    console.log('Collections created:');
    console.log('  - Users (users)');
    console.log('  - Wood Products (products)');
    console.log('  - Orders (orders)');
    console.log('  - Price Estimates (estimates)');
    console.log('  - SEO Settings (seo-settings)');
    console.log('\nStorage buckets created:');
    console.log('  - Product Images (product-images)');
    console.log('  - User Files (user-files)');
    console.log('  - SEO Assets (seo-assets)');

  } catch (error) {
    console.error('❌ Error setting up database:', error.message);
    process.exit(1);
  }
}

// Run the setup
setupDatabase();
