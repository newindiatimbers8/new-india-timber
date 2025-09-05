#!/usr/bin/env node

import { exec } from 'child_process';
import { promisify } from 'util';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const execAsync = promisify(exec);

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envPath = join(__dirname, '..', '.env');
dotenv.config({ path: envPath });

async function checkEnvironment() {
  console.log('🔍 Checking environment configuration...\n');
  
  const requiredVars = [
    'VITE_APPWRITE_ENDPOINT',
    'VITE_APPWRITE_PROJECT_ID',
    'VITE_APPWRITE_DATABASE_ID'
  ];

  const missing = [];
  for (const varName of requiredVars) {
    if (!process.env[varName] || process.env[varName].includes('your-')) {
      missing.push(varName);
    }
  }

  if (missing.length > 0) {
    console.error('❌ Missing or invalid environment variables:');
    missing.forEach(varName => console.error(`  - ${varName}`));
    console.error('\nPlease update your .env file with valid values.');
    process.exit(1);
  }

  console.log('✅ Environment configuration is valid\n');
}

async function runScript(scriptName, description) {
  try {
    console.log(`🚀 ${description}...`);
    const { stdout, stderr } = await execAsync(`node ${scriptName}`, {
      cwd: __dirname
    });
    
    if (stdout) console.log(stdout);
    if (stderr) console.error(stderr);
    
    console.log(`✅ ${description} completed\n`);
  } catch (error) {
    console.error(`❌ Error during ${description}:`, error.message);
    throw error;
  }
}

async function setupAppwrite() {
  try {
    console.log('🎯 Timber Craft Commerce Hub - Appwrite Setup\n');
    console.log('This script will set up:');
    console.log('  - Database and collections');
    console.log('  - Storage buckets');
    console.log('  - Permissions and security\n');

    // Check environment
    await checkEnvironment();

    // Setup database
    await runScript('setup-databases.mjs', 'Setting up database and collections');

    // Setup storage
    await runScript('setup-storage.mjs', 'Setting up storage buckets');

    console.log('🎉 Appwrite setup completed successfully!');
    console.log('\nNext steps:');
    console.log('1. Verify your database and collections in the Appwrite console');
    console.log('2. Test your application connection');
    console.log('3. Start adding data to your collections');
    console.log('\nDatabase ID:', process.env.VITE_APPWRITE_DATABASE_ID);
    console.log('Project ID:', process.env.VITE_APPWRITE_PROJECT_ID);

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  }
}

// Run the setup
setupAppwrite();