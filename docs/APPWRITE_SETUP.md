# Appwrite Backend Setup Guide

This guide will help you set up Appwrite as the backend for your Timber Craft Commerce Hub application.

## Prerequisites

1. Create an Appwrite account at [https://cloud.appwrite.io](https://cloud.appwrite.io)
2. Create a new project in Appwrite Console

## Step 1: Create Appwrite Project

1. Go to [Appwrite Cloud](https://cloud.appwrite.io)
2. Click "Create Project"
3. Name your project: `Timber Craft Commerce Hub`
4. Choose your preferred region

## Step 2: Configure Environment Variables

1. Copy the `.env.example.txt` file to `.env` in your project root
2. Update the values:

```env
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your-project-id-here
VITE_APPWRITE_DATABASE_ID=timbercraft-db
```

You can find your Project ID in the Appwrite Console under Settings > General.

## Step 3: Create Database

1. In Appwrite Console, go to **Database**
2. Click **Create Database**
3. Name: `timbercraft-db`
4. Set permissions to allow access from your application

## Step 4: Create Collections

Create the following collections in your database:

### 1. Users Collection
- **Collection ID**: `users`
- **Name**: Users
- **Permissions**: Read: Any, Write: Users

**Attributes:**
- `companyName` (string, optional)
- `usagePreference` (string, optional) - Values: "own_premium", "own_budget"

### 2. Products Collection
- **Collection ID**: `products`
- **Name**: Products
- **Permissions**: Read: Any, Write: Users (admin only)

**Attributes:**
- `name` (string, required)
- `scientificName` (string, optional)
- `category` (string, required) - Values: "teak", "plywood", "hardwood", "softwood", "engineered"
- `grade` (string, required) - Values: "premium", "commercial", "budget"
- `overview` (object, required)
  - `description` (string)
  - `keyBenefits` (string[])
  - `premiumPositioning` (string)
  - `tagline` (string)
- `specifications` (object, required)
  - `density` (number)
  - `hardness` (number)
  - `moistureContent` (number)
  - `grainPattern` (string)
  - `durability` (string)
  - `workability` (string)
  - `finishQuality` (string)
  - `dimensionalStability` (string)
- `pricing` (object, required)
  - `pricePerSqFt` (number)
  - `priceRange` (string)
  - `marketTrend` (string)
- `images` (string[], optional) - Array of Appwrite file IDs
- `seo` (object, optional)
  - `metaTitle` (string)
  - `metaDescription` (string)
  - `keywords` (string[])

### 3. Orders Collection
- **Collection ID**: `orders`
- **Name**: Orders
- **Permissions**: Read: Users, Write: Users

**Attributes:**
- `userId` (string, optional) - Reference to user
- `purpose` (string, required) - Values: "commercial", "residential"
- `frames` (number, required)
- `deliveryRequired` (boolean, required)
- `address` (string, optional)
- `name` (string, required)
- `email` (string, required)
- `phone` (string, required)
- `customization` (string, optional)
- `status` (string, required) - Values: "pending", "confirmed", "processing", "completed", "cancelled"
- `estimatedValue` (number, optional)

### 4. Estimates Collection
- **Collection ID**: `estimates`
- **Name**: Estimates
- **Permissions**: Read: Users, Write: Users

**Attributes:**
- `userId` (string, optional)
- `woodType` (string, required)
- `dimensions` (object, required)
  - `length` (number)
  - `width` (number)
  - `thickness` (number)
- `quantity` (number, required)
- `customization` (string, optional)
- `totalPrice` (number, required)

### 5. SEO Settings Collection
- **Collection ID**: `seo-settings`
- **Name**: SEO Settings
- **Permissions**: Read: Any, Write: Users (admin only)

**Attributes:**
- `page` (string, required)
- `metaTitle` (string, required)
- `metaDescription` (string, required)
- `keywords` (string[], required)
- `canonicalUrl` (string, optional)
- `structuredData` (object, optional)

## Step 5: Create Storage Buckets

### 1. Product Images Bucket
- **Bucket ID**: `product-images`
- **Name**: Product Images
- **Permissions**: Read: Any, Write: Users (admin only)
- **Allowed file extensions**: jpg, jpeg, png, webp
- **Maximum file size**: 5MB

### 2. User Files Bucket
- **Bucket ID**: `user-files`
- **Name**: User Files
- **Permissions**: Read: Users, Write: Users
- **Allowed file extensions**: jpg, jpeg, png, pdf, doc, docx
- **Maximum file size**: 10MB

## Step 6: Configure Authentication

1. Go to **Authentication** in Appwrite Console
2. Enable email/password authentication
3. Optionally enable OAuth providers (Google, Facebook)

## Step 7: Set Up API Keys (Optional)

If you need server-side operations:

1. Go to **API Keys** in Settings
2. Create a new API Key with appropriate scopes
3. Add to your environment variables:

```env
VITE_APPWRITE_API_KEY=your-api-key-here
```

## Step 8: Test the Setup

1. Start your development server: `npm run dev`
2. Try registering a new user
3. Try logging in
4. Test bulk order submission

## Database Relationships

- **Users** can have multiple **Orders** and **Estimates**
- **Products** can be referenced in **Orders** and **Estimates**
- **Orders** and **Estimates** can link to authenticated **Users**
- **Products** can have multiple **Images** stored in Storage

## Security Considerations

1. **Database Rules**: Set appropriate read/write permissions for each collection
2. **File Upload**: Validate file types and sizes on both client and server
3. **User Data**: Never store sensitive information in plain text
4. **API Keys**: Use environment variables and restrict scopes

## Troubleshooting

### Common Issues:

1. **"Project not found"**: Check your Project ID in environment variables
2. **"Collection not found"**: Ensure collections are created with correct IDs
3. **"Permission denied"**: Check collection permissions in Appwrite Console
4. **"File upload failed"**: Verify bucket configuration and permissions

### Debug Mode:

Set `VITE_APPWRITE_ENDPOINT` to your local Appwrite instance for development:
```env
VITE_APPWRITE_ENDPOINT=http://localhost:80/v1
```

## Next Steps

1. Seed your database with initial product data
2. Implement admin dashboard for managing products
3. Add real-time notifications for order updates
4. Set up email notifications for new orders

## Support

- [Appwrite Documentation](https://appwrite.io/docs)
- [Appwrite Community](https://appwrite.io/discord)
- [Appwrite GitHub](https://github.com/appwrite/appwrite)
