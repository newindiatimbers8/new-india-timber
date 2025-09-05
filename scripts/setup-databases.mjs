#!/usr/bin/env node

import { Client, Databases, ID, Permission, Role } from 'appwrite';
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

const databases = new Databases(client);

const DATABASE_ID = process.env.VITE_APPWRITE_DATABASE_ID || 'timbercraft-db';

// Collection configurations
const collections = [
  {
    id: 'users',
    name: 'Users',
    permissions: [
      Permission.read(Role.any()),
      Permission.create(Role.users()),
      Permission.update(Role.users()),
      Permission.delete(Role.users())
    ],
    attributes: [
      { key: 'name', type: 'string', size: 255, required: true },
      { key: 'email', type: 'string', size: 255, required: true, array: false },
      { key: 'phone', type: 'string', size: 20, required: false },
      { key: 'role', type: 'enum', elements: ['customer', 'admin', 'manager'], required: true, default: 'customer' },
      { key: 'profile', type: 'string', size: 1000, required: false },
      { key: 'address', type: 'string', size: 500, required: false },
      { key: 'isActive', type: 'boolean', required: true, default: true },
      { key: 'lastLogin', type: 'datetime', required: false }
    ]
  },
  {
    id: 'products',
    name: 'Wood Products',
    permissions: [
      Permission.read(Role.any()),
      Permission.create(Role.team('admin')),
      Permission.update(Role.team('admin')),
      Permission.delete(Role.team('admin'))
    ],
    attributes: [
      { key: 'name', type: 'string', size: 255, required: true },
      { key: 'scientificName', type: 'string', size: 255, required: false },
      { key: 'category', type: 'enum', elements: ['teak', 'plywood', 'hardwood', 'softwood', 'engineered'], required: true },
      { key: 'grade', type: 'enum', elements: ['premium', 'commercial', 'budget'], required: true },
      { key: 'overview', type: 'string', size: 2000, required: true },
      { key: 'specifications', type: 'string', size: 2000, required: true },
      { key: 'origin', type: 'string', size: 1000, required: false },
      { key: 'pricing', type: 'string', size: 500, required: true },
      { key: 'comparisonMetrics', type: 'string', size: 1000, required: false },
      { key: 'prosAndCons', type: 'string', size: 1000, required: false },
      { key: 'buyingGuide', type: 'string', size: 1000, required: false },
      { key: 'applications', type: 'string', size: 1000, required: false },
      { key: 'seo', type: 'string', size: 1000, required: false },
      { key: 'images', type: 'string', size: 1000, required: false, array: true },
      { key: 'isActive', type: 'boolean', required: true, default: true },
      { key: 'featured', type: 'boolean', required: true, default: false }
    ]
  },
  {
    id: 'orders',
    name: 'Orders',
    permissions: [
      Permission.read(Role.users()),
      Permission.create(Role.users()),
      Permission.update(Role.team('admin')),
      Permission.delete(Role.team('admin'))
    ],
    attributes: [
      { key: 'userId', type: 'string', size: 255, required: true },
      { key: 'purpose', type: 'enum', elements: ['commercial', 'residential'], required: true },
      { key: 'frames', type: 'integer', required: true },
      { key: 'deliveryRequired', type: 'boolean', required: true, default: false },
      { key: 'address', type: 'string', size: 500, required: false },
      { key: 'name', type: 'string', size: 255, required: true },
      { key: 'email', type: 'string', size: 255, required: true },
      { key: 'phone', type: 'string', size: 20, required: true },
      { key: 'customization', type: 'string', size: 1000, required: false },
      { key: 'status', type: 'enum', elements: ['pending', 'confirmed', 'processing', 'completed', 'cancelled'], required: true, default: 'pending' },
      { key: 'estimatedValue', type: 'double', required: false },
      { key: 'notes', type: 'string', size: 1000, required: false }
    ]
  },
  {
    id: 'estimates',
    name: 'Price Estimates',
    permissions: [
      Permission.read(Role.users()),
      Permission.create(Role.any()),
      Permission.update(Role.users()),
      Permission.delete(Role.users())
    ],
    attributes: [
      { key: 'userId', type: 'string', size: 255, required: false },
      { key: 'woodType', type: 'string', size: 255, required: true },
      { key: 'dimensions', type: 'string', size: 500, required: true },
      { key: 'quantity', type: 'integer', required: true },
      { key: 'customization', type: 'string', size: 1000, required: false },
      { key: 'totalPrice', type: 'double', required: true },
      { key: 'sessionId', type: 'string', size: 255, required: false },
      { key: 'isSaved', type: 'boolean', required: true, default: false }
    ]
  },
  {
    id: 'seo-settings',
    name: 'SEO Settings',
    permissions: [
      Permission.read(Role.team('admin')),
      Permission.create(Role.team('admin')),
      Permission.update(Role.team('admin')),
      Permission.delete(Role.team('admin'))
    ],
    attributes: [
      { key: 'type', type: 'enum', elements: ['global', 'page'], required: true },
      { key: 'pageId', type: 'string', size: 255, required: false },
      { key: 'pagePath', type: 'string', size: 255, required: false },
      { key: 'pageTitle', type: 'string', size: 255, required: false },
      { key: 'metaTitle', type: 'string', size: 255, required: false },
      { key: 'metaDescription', type: 'string', size: 500, required: false },
      { key: 'keywords', type: 'string', size: 1000, required: false, array: true },
      { key: 'canonicalUrl', type: 'string', size: 500, required: false },
      { key: 'noIndex', type: 'boolean', required: true, default: false },
      { key: 'noFollow', type: 'boolean', required: true, default: false },
      { key: 'customMeta', type: 'string', size: 2000, required: false },
      { key: 'ogTitle', type: 'string', size: 255, required: false },
      { key: 'ogDescription', type: 'string', size: 500, required: false },
      { key: 'ogImage', type: 'string', size: 500, required: false },
      { key: 'twitterTitle', type: 'string', size: 255, required: false },
      { key: 'twitterDescription', type: 'string', size: 500, required: false },
      { key: 'twitterImage', type: 'string', size: 500, required: false },
      { key: 'priority', type: 'double', required: true, default: 0.5 },
      { key: 'changeFreq', type: 'enum', elements: ['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never'], required: true, default: 'monthly' },
      { key: 'status', type: 'enum', elements: ['published', 'draft', 'archived'], required: true, default: 'published' }
    ]
  }
];

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

async function createCollection(collectionConfig) {
  try {
    console.log(`Creating collection: ${collectionConfig.name}...`);
    const collection = await databases.createCollection(
      DATABASE_ID,
      collectionConfig.id,
      collectionConfig.name,
      collectionConfig.permissions
    );
    console.log(`✅ Collection created: ${collectionConfig.name}`);
    return collection;
  } catch (error) {
    if (error.code === 409) {
      console.log(`✅ Collection already exists: ${collectionConfig.name}`);
      return { $id: collectionConfig.id };
    }
    throw error;
  }
}

async function createAttribute(collectionId, attribute) {
  try {
    console.log(`  Creating string attribute: ${attribute.key}...`);
    
    await databases.createStringAttribute(
      DATABASE_ID,
      collectionId,
      attribute.key,
      attribute.size || 255,
      attribute.required || false,
      attribute.default,
      attribute.array || false
    );
    
    console.log(`  ✅ String attribute created: ${attribute.key}`);
  } catch (error) {
    if (error.code === 409) {
      console.log(`  ✅ String attribute already exists: ${attribute.key}`);
    } else {
      console.error(`  ❌ Error creating string attribute ${attribute.key}:`, error.message);
    }
  }
}

async function createEnumAttribute(collectionId, attribute) {
  try {
    console.log(`  Creating enum attribute: ${attribute.key}...`);
    
    await databases.createEnumAttribute(
      DATABASE_ID,
      collectionId,
      attribute.key,
      attribute.elements,
      attribute.required || false,
      attribute.default,
      attribute.array || false
    );
    
    console.log(`  ✅ Enum attribute created: ${attribute.key}`);
  } catch (error) {
    if (error.code === 409) {
      console.log(`  ✅ Enum attribute already exists: ${attribute.key}`);
    } else {
      console.error(`  ❌ Error creating enum attribute ${attribute.key}:`, error.message);
    }
  }
}

async function createBooleanAttribute(collectionId, attribute) {
  try {
    console.log(`  Creating boolean attribute: ${attribute.key}...`);
    
    await databases.createBooleanAttribute(
      DATABASE_ID,
      collectionId,
      attribute.key,
      attribute.required || false,
      attribute.default
    );
    
    console.log(`  ✅ Boolean attribute created: ${attribute.key}`);
  } catch (error) {
    if (error.code === 409) {
      console.log(`  ✅ Boolean attribute already exists: ${attribute.key}`);
    } else {
      console.error(`  ❌ Error creating boolean attribute ${attribute.key}:`, error.message);
    }
  }
}

async function createIntegerAttribute(collectionId, attribute) {
  try {
    console.log(`  Creating integer attribute: ${attribute.key}...`);
    
    await databases.createIntegerAttribute(
      DATABASE_ID,
      collectionId,
      attribute.key,
      attribute.required || false,
      attribute.min,
      attribute.max,
      attribute.default
    );
    
    console.log(`  ✅ Integer attribute created: ${attribute.key}`);
  } catch (error) {
    if (error.code === 409) {
      console.log(`  ✅ Integer attribute already exists: ${attribute.key}`);
    } else {
      console.error(`  ❌ Error creating integer attribute ${attribute.key}:`, error.message);
    }
  }
}

async function createFloatAttribute(collectionId, attribute) {
  try {
    console.log(`  Creating float attribute: ${attribute.key}...`);
    
    await databases.createFloatAttribute(
      DATABASE_ID,
      collectionId,
      attribute.key,
      attribute.required || false,
      attribute.min,
      attribute.max,
      attribute.default
    );
    
    console.log(`  ✅ Float attribute created: ${attribute.key}`);
  } catch (error) {
    if (error.code === 409) {
      console.log(`  ✅ Float attribute already exists: ${attribute.key}`);
    } else {
      console.error(`  ❌ Error creating float attribute ${attribute.key}:`, error.message);
    }
  }
}

async function createDateTimeAttribute(collectionId, attribute) {
  try {
    console.log(`  Creating datetime attribute: ${attribute.key}...`);
    
    await databases.createDatetimeAttribute(
      DATABASE_ID,
      collectionId,
      attribute.key,
      attribute.required || false,
      attribute.default
    );
    
    console.log(`  ✅ Datetime attribute created: ${attribute.key}`);
  } catch (error) {
    if (error.code === 409) {
      console.log(`  ✅ Datetime attribute already exists: ${attribute.key}`);
    } else {
      console.error(`  ❌ Error creating datetime attribute ${attribute.key}:`, error.message);
    }
  }
}

async function createAttributes(collectionId, attributes) {
  for (const attribute of attributes) {
    switch (attribute.type) {
      case 'string':
        await createAttribute(collectionId, attribute);
        break;
      case 'enum':
        await createEnumAttribute(collectionId, attribute);
        break;
      case 'boolean':
        await createBooleanAttribute(collectionId, attribute);
        break;
      case 'integer':
        await createIntegerAttribute(collectionId, attribute);
        break;
      case 'double':
      case 'float':
        await createFloatAttribute(collectionId, attribute);
        break;
      case 'datetime':
        await createDateTimeAttribute(collectionId, attribute);
        break;
      default:
        console.log(`  ⚠️  Unknown attribute type: ${attribute.type} for ${attribute.key}`);
    }
  }
}

async function setupDatabase() {
  try {
    console.log('🚀 Starting database setup...\n');

    // Create database
    await createDatabase();
    console.log('');

    // Create collections and attributes
    for (const collectionConfig of collections) {
      await createCollection(collectionConfig);
      console.log(`Creating attributes for ${collectionConfig.name}...`);
      await createAttributes(collectionConfig.id, collectionConfig.attributes);
      console.log('');
    }

    console.log('🎉 Database setup completed successfully!');
    console.log('\nDatabase ID:', DATABASE_ID);
    console.log('Collections created:');
    collections.forEach(col => console.log(`  - ${col.name} (${col.id})`));

  } catch (error) {
    console.error('❌ Error setting up database:', error.message);
    process.exit(1);
  }
}

// Run the setup
setupDatabase();
