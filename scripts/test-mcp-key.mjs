#!/usr/bin/env node

import { Client, Databases, Storage } from 'appwrite';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envPath = join(__dirname, '..', '.env');
dotenv.config({ path: envPath });

// Use the API key from your MCP configuration
const MCP_API_KEY = 'ad7749fba7f075a9f0abe9efe3f7afe2056221cf24e1a0afe4dd5f84dc2f3bab8403ef8630820baa1cf7c0a8c117e661c8b0b3195340d29b4735537d117b85b69a6526da63cbd874b0ea92301cd2f623665de96c798933e07c701c5d63853c57033706c4e645016adce1462e85db93e25ebf36d3b9737d1ef126b08b199021e2';

console.log('Testing Appwrite SDK with MCP API key...\n');

// Test different ways to set the API key
console.log('1. Testing Client methods:');
const client = new Client();
console.log('Available methods on Client:', Object.getOwnPropertyNames(Object.getPrototypeOf(client)).filter(name => name !== 'constructor'));

console.log('\n2. Testing with setEndpoint and setProject:');
const client2 = new Client()
  .setEndpoint(process.env.VITE_APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1')
  .setProject(process.env.VITE_APPWRITE_PROJECT_ID || '68b0a743000c98e8ca75');

console.log('Available methods after setEndpoint/setProject:', Object.getOwnPropertyNames(Object.getPrototypeOf(client2)).filter(name => name !== 'constructor'));

console.log('\n3. Testing API key setting:');
try {
  // Try different methods
  if (typeof client2.setKey === 'function') {
    console.log('setKey method exists');
    client2.setKey(MCP_API_KEY);
  } else {
    console.log('setKey method does not exist');
  }
} catch (error) {
  console.log('Error with setKey:', error.message);
}

console.log('\n4. Testing with API key in constructor:');
try {
  const client3 = new Client()
    .setEndpoint(process.env.VITE_APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1')
    .setProject(process.env.VITE_APPWRITE_PROJECT_ID || '68b0a743000c98e8ca75');
  
  // Try to set key using different approaches
  if (client3.key) {
    client3.key = MCP_API_KEY;
    console.log('Set key via property');
  } else {
    console.log('key property does not exist');
  }
} catch (error) {
  console.log('Error setting key via property:', error.message);
}

console.log('\n5. Testing database operations:');
const databases = new Databases(client2);
console.log('Available methods on Databases:', Object.getOwnPropertyNames(Object.getPrototypeOf(databases)).filter(name => name !== 'constructor'));

console.log('\n6. Configuration:');
console.log('Endpoint:', process.env.VITE_APPWRITE_ENDPOINT);
console.log('Project ID:', process.env.VITE_APPWRITE_PROJECT_ID);
console.log('Database ID:', process.env.VITE_APPWRITE_DATABASE_ID);
console.log('API Key (first 20 chars):', MCP_API_KEY.substring(0, 20) + '...');
