#!/usr/bin/env node

/**
 * Simple Test User Creation
 * Creates a basic test user without updating preferences
 */

import { Client, Account, ID } from 'appwrite';
import dotenv from 'dotenv';

dotenv.config();

const config = {
  endpoint: process.env.VITE_APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1',
  projectId: process.env.VITE_APPWRITE_PROJECT_ID,
};

const client = new Client()
  .setEndpoint(config.endpoint)
  .setProject(config.projectId);

const account = new Account(client);

async function createSimpleTestUser() {
  console.log('🚀 Creating simple test user...\n');

  const testUser = {
    email: 'newindiatimbers8@gmail.com',
    password: 'TestPassword123!',
    name: 'Test User'
  };

  try {
    // Create account
    console.log('👤 Creating test user account...');
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

    console.log('\n🧪 Test Credentials:');
    console.log(`   Email: ${testUser.email}`);
    console.log(`   Password: ${testUser.password}`);

    console.log('\n📱 Test Your App:');
    console.log('1. Go to http://localhost:8082/login');
    console.log('2. Use the credentials above');
    console.log('3. Test login functionality');

  } catch (error) {
    if (error.message.includes('already exists')) {
      console.log('✅ Test user already exists!');
      console.log('\n🧪 Use these credentials:');
      console.log(`   Email: ${testUser.email}`);
      console.log(`   Password: ${testUser.password}`);
    } else {
      console.error('❌ Failed to create test user:', error.message);
    }
  }
}

createSimpleTestUser();
