# Database Setup Guide

This guide will help you set up the required databases and collections for the Timber Craft Commerce Hub application using Appwrite.

## Prerequisites

1. **Appwrite Project**: You need an active Appwrite project
2. **API Key**: A server-side API key with admin permissions
3. **Environment Variables**: Properly configured `.env` file

## Environment Configuration

Create a `.env` file in the project root with the following variables:

```env
# Appwrite Configuration
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your-project-id-here
VITE_APPWRITE_DATABASE_ID=timbercraft-db

# Server-side API Key (for admin operations)
APPWRITE_API_KEY=your-api-key-here

# Optional: AI Service Configuration
VITE_GROQ_API_KEY=your-groq-api-key-here
```

## Database Structure

The application uses a single database (`timbercraft-db`) with the following collections:

### 1. Users Collection (`users`)
Stores user account information and profiles.

**Attributes:**
- `name` (string, 255 chars, required)
- `email` (string, 255 chars, required, unique)
- `phone` (string, 20 chars, optional)
- `role` (enum: customer, admin, manager, default: customer)
- `profile` (string, 1000 chars, optional)
- `address` (string, 500 chars, optional)
- `isActive` (boolean, default: true)
- `lastLogin` (datetime, optional)

**Permissions:**
- Read: Anyone
- Create/Update/Delete: Authenticated users

### 2. Products Collection (`products`)
Stores wood product information and specifications.

**Attributes:**
- `name` (string, 255 chars, required)
- `scientificName` (string, 255 chars, optional)
- `category` (enum: teak, plywood, hardwood, softwood, engineered)
- `grade` (enum: premium, commercial, budget)
- `overview` (string, 2000 chars, required)
- `specifications` (string, 2000 chars, required)
- `origin` (string, 1000 chars, optional)
- `pricing` (string, 500 chars, required)
- `comparisonMetrics` (string, 1000 chars, optional)
- `prosAndCons` (string, 1000 chars, optional)
- `buyingGuide` (string, 1000 chars, optional)
- `applications` (string, 1000 chars, optional)
- `seo` (string, 1000 chars, optional)
- `images` (string array, 1000 chars, optional)
- `isActive` (boolean, default: true)
- `featured` (boolean, default: false)

**Permissions:**
- Read: Anyone
- Create/Update/Delete: Admin team only

### 3. Orders Collection (`orders`)
Stores customer orders and bulk order requests.

**Attributes:**
- `userId` (string, 255 chars, required)
- `purpose` (enum: commercial, residential)
- `frames` (integer, required)
- `deliveryRequired` (boolean, default: false)
- `address` (string, 500 chars, optional)
- `name` (string, 255 chars, required)
- `email` (string, 255 chars, required)
- `phone` (string, 20 chars, required)
- `customization` (string, 1000 chars, optional)
- `status` (enum: pending, confirmed, processing, completed, cancelled, default: pending)
- `estimatedValue` (double, optional)
- `notes` (string, 1000 chars, optional)

**Permissions:**
- Read/Create: Authenticated users
- Update/Delete: Admin team only

### 4. Estimates Collection (`estimates`)
Stores price estimates and calculations.

**Attributes:**
- `userId` (string, 255 chars, optional)
- `woodType` (string, 255 chars, required)
- `dimensions` (string, 500 chars, required)
- `quantity` (integer, required)
- `customization` (string, 1000 chars, optional)
- `totalPrice` (double, required)
- `sessionId` (string, 255 chars, optional)
- `isSaved` (boolean, default: false)

**Permissions:**
- Read/Update/Delete: Authenticated users
- Create: Anyone (for anonymous estimates)

### 5. SEO Settings Collection (`seo-settings`)
Stores SEO configuration and page metadata.

**Attributes:**
- `type` (enum: global, page)
- `pageId` (string, 255 chars, optional)
- `pagePath` (string, 255 chars, optional)
- `pageTitle` (string, 255 chars, optional)
- `metaTitle` (string, 255 chars, optional)
- `metaDescription` (string, 500 chars, optional)
- `keywords` (string array, 1000 chars, optional)
- `canonicalUrl` (string, 500 chars, optional)
- `noIndex` (boolean, default: false)
- `noFollow` (boolean, default: false)
- `customMeta` (string, 2000 chars, optional)
- `ogTitle` (string, 255 chars, optional)
- `ogDescription` (string, 500 chars, optional)
- `ogImage` (string, 500 chars, optional)
- `twitterTitle` (string, 255 chars, optional)
- `twitterDescription` (string, 500 chars, optional)
- `twitterImage` (string, 500 chars, optional)
- `priority` (double, default: 0.5)
- `changeFreq` (enum: always, hourly, daily, weekly, monthly, yearly, never, default: monthly)
- `status` (enum: published, draft, archived, default: published)

**Permissions:**
- All operations: Admin team only

## Storage Buckets

The application also sets up three storage buckets:

### 1. Product Images (`product-images`)
- **Purpose**: Store product images and galleries
- **File Types**: jpg, jpeg, png, webp, gif
- **Max Size**: 10MB
- **Permissions**: Read (anyone), Write (admin only)

### 2. User Files (`user-files`)
- **Purpose**: Store user-uploaded documents and files
- **File Types**: pdf, doc, docx, jpg, jpeg, png, webp
- **Max Size**: 5MB
- **Permissions**: All operations (authenticated users only)

### 3. SEO Assets (`seo-assets`)
- **Purpose**: Store SEO-related images and assets
- **File Types**: jpg, jpeg, png, webp, svg, ico
- **Max Size**: 2MB
- **Permissions**: Read (anyone), Write (admin only)

## Setup Instructions

### Option 1: Automated Setup (Recommended)

Run the complete setup script:

```bash
npm run setup:appwrite
```

This will:
1. Check your environment configuration
2. Create the database and all collections
3. Set up all attributes with proper types and constraints
4. Create storage buckets with appropriate permissions
5. Configure security settings

### Option 2: Manual Setup

If you prefer to run individual setup scripts:

```bash
# Setup database and collections only
npm run setup:database

# Setup storage buckets only
npm run setup:storage
```

### Option 3: Direct Script Execution

```bash
# Complete setup
node scripts/setup-appwrite.mjs

# Database only
node scripts/setup-databases.mjs

# Storage only
node scripts/setup-storage.mjs
```

## Verification

After running the setup, verify the following in your Appwrite console:

1. **Database**: `timbercraft-db` exists
2. **Collections**: All 5 collections are created with proper attributes
3. **Storage**: All 3 buckets are created with correct permissions
4. **Permissions**: Security rules are properly configured

## Troubleshooting

### Common Issues

1. **Environment Variables**: Ensure all required variables are set and valid
2. **API Key**: Make sure your API key has admin permissions
3. **Project ID**: Verify the project ID matches your Appwrite project
4. **Network**: Check your internet connection and Appwrite endpoint

### Error Codes

- **409**: Resource already exists (this is normal for re-runs)
- **401**: Authentication failed (check API key)
- **404**: Project not found (check project ID)
- **403**: Insufficient permissions (check API key permissions)

### Manual Cleanup

If you need to start fresh:

1. Delete the database in Appwrite console
2. Delete storage buckets
3. Re-run the setup script

## Next Steps

After successful setup:

1. **Test Connection**: Verify your application can connect to the database
2. **Add Sample Data**: Use the provided sample data to populate collections
3. **Configure Authentication**: Set up user authentication if not already done
4. **Test File Uploads**: Verify storage buckets work correctly
5. **Monitor Usage**: Keep track of database and storage usage

## Support

If you encounter issues:

1. Check the Appwrite console for detailed error messages
2. Verify your environment configuration
3. Ensure your API key has the necessary permissions
4. Check the Appwrite documentation for specific error codes

## Security Notes

- The setup scripts use secure default permissions
- Admin operations require team membership
- User data is protected with appropriate access controls
- File uploads have size and type restrictions
- All buckets have antivirus scanning enabled
