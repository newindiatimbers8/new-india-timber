#!/usr/bin/env node

/**
 * Create Test User Script
 * Creates a test user in Appwrite for testing authentication
 */

import { Client, Account, ID } from 'appwrite';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Configuration
const config = {
  endpoint: process.env.VITE_APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1',
  projectId: process.env.VITE_APPWRITE_PROJECT_ID,
};

if (!config.projectId) {
  console.error('❌ VITE_APPWRITE_PROJECT_ID is required in .env file');
  process.exit(1);
}

const client = new Client()
  .setEndpoint(config.endpoint)
  .setProject(config.projectId);

const account = new Account(client);

async function createTestUser() {
  console.log('🚀 Creating test user for Timber Craft Commerce Hub...\n');
  console.log(`📋 Project ID: ${config.projectId}`);
  console.log(`🌐 Endpoint: ${config.endpoint}\n`);

  const testUser = {
    email: 'newindiatimbers8@gmail.com',
    password: 'TestPassword123!',
    name: 'Test User',
    phone: '+91 9886033342',
    companyName: 'Test Company',
    usagePreference: 'own_premium'
  };

  try {
    // Test connection
    console.log('🔗 Testing connection...');
    try {
      await account.get();
      console.log('⚠️  Already logged in, logging out first...');
      await account.deleteSession('current');
    } catch {
      console.log('✅ Ready to create user');
    }

    // Create account
    console.log('\n👤 Creating test user account...');
    const user = await account.create(
      ID.unique(),
      testUser.email,
      testUser.password,
      testUser.name
    );

    console.log('✅ User account created successfully!');
    console.log(`   User ID: ${user.$id}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Name: ${user.name}`);

    // Create session
    console.log('\n🔐 Creating session...');
    await account.createEmailPasswordSession(
      testUser.email,
      testUser.password
    );

    console.log('✅ Session created successfully!');

    // Update user preferences
    console.log('\n⚙️  Updating user preferences...');
    const prefs = {
      companyName: testUser.companyName,
      usagePreference: testUser.usagePreference,
      phone: testUser.phone
    };

    await account.updatePrefs(prefs);
    console.log('✅ User preferences updated!');

    // Get final user data
    const finalUser = await account.get();
    console.log('\n🎉 Test user created successfully!');
    console.log('\n📋 User Details:');
    console.log(`   ID: ${finalUser.$id}`);
    console.log(`   Email: ${finalUser.email}`);
    console.log(`   Name: ${finalUser.name}`);
    console.log(`   Phone: ${finalUser.prefs.phone || 'Not set'}`);
    console.log(`   Company: ${finalUser.prefs.companyName || 'Not set'}`);
    console.log(`   Usage Preference: ${finalUser.prefs.usagePreference || 'Not set'}`);
    console.log(`   Email Verified: ${finalUser.emailVerification}`);
    console.log(`   Created: ${finalUser.$createdAt}`);

    console.log('\n🧪 Test Credentials:');
    console.log(`   Email: ${testUser.email}`);
    console.log(`   Password: ${testUser.password}`);

    console.log('\n📱 Next Steps:');
    console.log('1. Go to http://localhost:8082/login');
    console.log('2. Use the test credentials above');
    console.log('3. Test the authentication flow');
    console.log('4. Test bulk order submission');

  } catch (error) {
    console.error('❌ Failed to create test user:', error.message);
    
    if (error.message.includes('already exists')) {
      console.log('\n💡 User already exists. You can:');
      console.log('1. Use existing credentials to login');
      console.log('2. Delete the user and recreate');
      console.log('3. Try with different email');
    }
    
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Check your Appwrite project configuration');
    console.log('2. Ensure authentication is enabled in Appwrite Console');
    console.log('3. Verify project ID and endpoint are correct');
    process.exit(1);
  }
}

// Run the script
if (import.meta.url === `file://${process.argv[1]}`) {
  createTestUser().then(() => {
    console.log('\n✨ Test user creation complete!');
    process.exit(0);
  }).catch((error) => {
    console.error('💥 Script failed:', error);
    process.exit(1);
  });
}

export { createTestUser };
