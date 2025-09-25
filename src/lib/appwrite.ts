import { Client, Account, Databases, Storage } from 'appwrite';

// Appwrite configuration
export const appwriteConfig = {
  endpoint: import.meta.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1',
  projectId: import.meta.env.VITE_APPWRITE_PROJECT_ID || '68b0a743000c98e8ca75',
  databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID || 'timbercraft-db',
  collectionIds: {
    users: 'users',
    products: 'products',
    orders: 'orders',
    estimates: 'estimates',
    seoSettings: 'seo-settings'
  },
  bucketIds: {
    productImages: 'product-images',
    userFiles: 'user-files'
  }
};

// Initialize Appwrite client
export const client = new Client()
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId);

// Initialize services
export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

// Helper function to get current user
export const getCurrentUser = async () => {
  try {
    return await account.get();
  } catch (error) {
    console.log('No authenticated user');
    return null;
  }
};

// Helper function to check if user is authenticated
export const isAuthenticated = async (): Promise<boolean> => {
  try {
    await account.get();
    return true;
  } catch {
    return false;
  }
};

export default client;
