/**
 * Migration helpers for converting Appwrite data to JSON format
 */

import { generateId, convertAppwriteDate } from './dataLoader';

export interface AppwriteDocument {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  [key: string]: any;
}

export interface MigrationResult {
  success: boolean;
  migratedCount: number;
  errors: string[];
  data: any[];
}

/**
 * Convert Appwrite user document to JSON format
 */
export function convertAppwriteUser(appwriteUser: any): any {
  return {
    id: appwriteUser.$id || generateId('user'),
    email: appwriteUser.email,
    passwordHash: appwriteUser.passwordHash || '',
    name: appwriteUser.name || appwriteUser.email,
    role: appwriteUser.role || 'visitor',
    status: appwriteUser.status || 'active',
    createdAt: convertAppwriteDate(appwriteUser.$createdAt),
    updatedAt: convertAppwriteDate(appwriteUser.$updatedAt),
    lastLoginAt: appwriteUser.lastLoginAt ? convertAppwriteDate(appwriteUser.lastLoginAt) : null,
  };
}

/**
 * Convert Appwrite product document to JSON format
 */
export function convertAppwriteProduct(appwriteProduct: any): any {
  return {
    id: appwriteProduct.$id || generateId('prod'),
    name: appwriteProduct.name,
    scientificName: appwriteProduct.scientificName || null,
    category: appwriteProduct.category,
    grade: appwriteProduct.grade || 'commercial',
    overview: typeof appwriteProduct.overview === 'string' 
      ? JSON.parse(appwriteProduct.overview) 
      : appwriteProduct.overview || {},
    specifications: typeof appwriteProduct.specifications === 'string'
      ? JSON.parse(appwriteProduct.specifications)
      : appwriteProduct.specifications || {},
    pricing: typeof appwriteProduct.pricing === 'string'
      ? JSON.parse(appwriteProduct.pricing)
      : appwriteProduct.pricing || {},
    images: appwriteProduct.images || [],
    seo: typeof appwriteProduct.seo === 'string'
      ? JSON.parse(appwriteProduct.seo)
      : appwriteProduct.seo || {},
    status: appwriteProduct.status || 'active',
    createdAt: convertAppwriteDate(appwriteProduct.$createdAt),
    updatedAt: convertAppwriteDate(appwriteProduct.$updatedAt),
  };
}

/**
 * Convert Appwrite order document to JSON format
 */
export function convertAppwriteOrder(appwriteOrder: any): any {
  return {
    id: appwriteOrder.$id || generateId('order'),
    orderNumber: appwriteOrder.orderNumber || `ORD-${Date.now()}`,
    userId: appwriteOrder.userId || null,
    customerInfo: {
      name: appwriteOrder.name,
      email: appwriteOrder.email,
      phone: appwriteOrder.phone,
      address: appwriteOrder.address || null,
    },
    orderDetails: {
      purpose: appwriteOrder.purpose || 'residential',
      frames: appwriteOrder.frames || 1,
      deliveryRequired: appwriteOrder.deliveryRequired || false,
      customization: appwriteOrder.customization || '',
    },
    status: appwriteOrder.status || 'pending',
    estimatedValue: appwriteOrder.estimatedValue || null,
    notes: appwriteOrder.notes || '',
    createdAt: convertAppwriteDate(appwriteOrder.$createdAt),
    updatedAt: convertAppwriteDate(appwriteOrder.$updatedAt),
  };
}

/**
 * Generic converter for Appwrite documents
 */
export function convertAppwriteDocument(
  appwriteDoc: AppwriteDocument,
  customConverter?: (doc: any) => any
): any {
  if (customConverter) {
    return customConverter(appwriteDoc);
  }

  // Default conversion - remove Appwrite-specific fields and convert dates
  const { $id, $createdAt, $updatedAt, $collectionId, $databaseId, $permissions, ...cleanDoc } = appwriteDoc;
  
  return {
    id: $id || generateId(),
    ...cleanDoc,
    createdAt: convertAppwriteDate($createdAt),
    updatedAt: convertAppwriteDate($updatedAt),
  };
}

/**
 * Migrate a collection from Appwrite to JSON
 */
export function migrateCollection(
  appwriteData: AppwriteDocument[],
  converter: (doc: any) => any
): MigrationResult {
  const errors: string[] = [];
  const migratedData: any[] = [];

  for (const doc of appwriteData) {
    try {
      const converted = converter(doc);
      migratedData.push(converted);
    } catch (error) {
      errors.push(`Failed to convert document ${doc.$id}: ${error}`);
    }
  }

  return {
    success: errors.length === 0,
    migratedCount: migratedData.length,
    errors,
    data: migratedData,
  };
}

/**
 * Export current Appwrite data (placeholder - would integrate with actual Appwrite client)
 */
export async function exportAppwriteCollection(collectionId: string): Promise<AppwriteDocument[]> {
  // This would integrate with the actual Appwrite client
  // For now, return empty array as placeholder
  console.log(`Exporting Appwrite collection: ${collectionId}`);
  
  try {
    // const databases = new Databases(client);
    // const response = await databases.listDocuments('database-id', collectionId);
    // return response.documents;
    
    // Placeholder return
    return [];
  } catch (error) {
    console.error(`Error exporting collection ${collectionId}:`, error);
    return [];
  }
}

/**
 * Complete migration workflow
 */
export async function runMigration(): Promise<void> {
  console.log('Starting Appwrite to JSON migration...');

  const collections = [
    { id: 'users', converter: convertAppwriteUser },
    { id: 'products', converter: convertAppwriteProduct },
    { id: 'orders', converter: convertAppwriteOrder },
    // Add more collections as needed
  ];

  for (const collection of collections) {
    try {
      console.log(`Migrating collection: ${collection.id}`);
      
      const appwriteData = await exportAppwriteCollection(collection.id);
      const result = migrateCollection(appwriteData, collection.converter);
      
      console.log(`Migration result for ${collection.id}:`, {
        success: result.success,
        migratedCount: result.migratedCount,
        errorCount: result.errors.length,
      });

      if (result.errors.length > 0) {
        console.error('Migration errors:', result.errors);
      }
      
    } catch (error) {
      console.error(`Failed to migrate collection ${collection.id}:`, error);
    }
  }

  console.log('Migration completed!');
}
