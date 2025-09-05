#!/usr/bin/env node

import { Client, Storage, ID, Permission, Role } from 'appwrite';
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

// Note: For server-side operations, you may need to set an API key
// This depends on your Appwrite configuration and permissions

const storage = new Storage(client);

// Storage bucket configurations
const buckets = [
  {
    id: 'product-images',
    name: 'Product Images',
    permissions: [
      Permission.read(Role.any()),
      Permission.create(Role.team('admin')),
      Permission.update(Role.team('admin')),
      Permission.delete(Role.team('admin'))
    ],
    fileSecurity: true,
    allowedFileExtensions: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
    maximumFileSize: 10 * 1024 * 1024, // 10MB
    enabled: true,
    encryption: true,
    antivirus: true
  },
  {
    id: 'user-files',
    name: 'User Files',
    permissions: [
      Permission.read(Role.users()),
      Permission.create(Role.users()),
      Permission.update(Role.users()),
      Permission.delete(Role.users())
    ],
    fileSecurity: true,
    allowedFileExtensions: ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png', 'webp'],
    maximumFileSize: 5 * 1024 * 1024, // 5MB
    enabled: true,
    encryption: true,
    antivirus: true
  },
  {
    id: 'seo-assets',
    name: 'SEO Assets',
    permissions: [
      Permission.read(Role.any()),
      Permission.create(Role.team('admin')),
      Permission.update(Role.team('admin')),
      Permission.delete(Role.team('admin'))
    ],
    fileSecurity: true,
    allowedFileExtensions: ['jpg', 'jpeg', 'png', 'webp', 'svg', 'ico'],
    maximumFileSize: 2 * 1024 * 1024, // 2MB
    enabled: true,
    encryption: true,
    antivirus: true
  }
];

async function createBucket(bucketConfig) {
  try {
    console.log(`Creating bucket: ${bucketConfig.name}...`);
    const bucket = await storage.createBucket(
      bucketConfig.id,
      bucketConfig.name,
      bucketConfig.permissions,
      bucketConfig.fileSecurity,
      bucketConfig.allowedFileExtensions,
      bucketConfig.maximumFileSize,
      bucketConfig.enabled,
      bucketConfig.encryption,
      bucketConfig.antivirus
    );
    console.log(`✅ Bucket created: ${bucketConfig.name}`);
    return bucket;
  } catch (error) {
    if (error.code === 409) {
      console.log(`✅ Bucket already exists: ${bucketConfig.name}`);
      return { $id: bucketConfig.id };
    }
    throw error;
  }
}

async function setupStorage() {
  try {
    console.log('🚀 Starting storage setup...\n');

    // Create buckets
    for (const bucketConfig of buckets) {
      await createBucket(bucketConfig);
    }

    console.log('\n🎉 Storage setup completed successfully!');
    console.log('\nBuckets created:');
    buckets.forEach(bucket => console.log(`  - ${bucket.name} (${bucket.id})`));

  } catch (error) {
    console.error('❌ Error setting up storage:', error.message);
    process.exit(1);
  }
}

// Run the setup
setupStorage();
