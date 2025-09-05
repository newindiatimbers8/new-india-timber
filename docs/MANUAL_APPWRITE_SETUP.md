# Manual Appwrite Setup Guide

Since the automated script has compatibility issues, follow this manual setup guide to configure your Appwrite backend.

## 🚀 Quick Setup Checklist

### ✅ 1. Project Configuration
- [x] Project ID: `68b0a743000c98e8ca75`
- [x] Project Name: `New India Timber`
- [x] Endpoint: `https://fra.cloud.appwrite.io/v1`
- [x] Environment variables configured
- [x] Development server running on http://localhost:8081

### 📊 2. Create Database

1. Go to [Appwrite Console](https://cloud.appwrite.io)
2. Select your project: **"New India Timber"** (ID: `68b0a743000c98e8ca75`)
3. Navigate to **Database**
4. Click **"Create Database"**
5. **Database ID**: `timbercraft-db`
6. **Name**: `Timber Craft Database`
7. Click **"Create"**

### 📋 3. Create Collections

#### Collection 1: Products
1. In your database, click **"Create Collection"**
2. **Collection ID**: `products`
3. **Name**: `Products`
4. **Permissions**: 
   - Read: `any`
   - Write: `users`
5. Click **"Create"**

**Add these attributes:**
- `name` (String, Required, Size: 255)
- `scientificName` (String, Optional, Size: 255)
- `category` (String, Required, Size: 50)
- `grade` (String, Required, Size: 20)
- `overview` (String, Required, Size: 2000)
- `specifications` (String, Required, Size: 2000)
- `pricing` (String, Required, Size: 1000)
- `images` (String, Optional, Size: 1000)
- `seo` (String, Optional, Size: 1000)

#### Collection 2: Orders
1. Click **"Create Collection"**
2. **Collection ID**: `orders`
3. **Name**: `Orders`
4. **Permissions**:
   - Read: `users`
   - Write: `users`
5. Click **"Create"**

**Add these attributes:**
- `userId` (String, Optional, Size: 50)
- `purpose` (String, Required, Size: 20)
- `frames` (Integer, Required)
- `deliveryRequired` (Boolean, Required)
- `address` (String, Optional, Size: 500)
- `name` (String, Required, Size: 255)
- `email` (String, Required, Size: 255)
- `phone` (String, Required, Size: 20)
- `customization` (String, Optional, Size: 1000)
- `status` (String, Required, Size: 20)
- `estimatedValue` (Integer, Optional)

#### Collection 3: Estimates
1. Click **"Create Collection"**
2. **Collection ID**: `estimates`
3. **Name**: `Estimates`
4. **Permissions**:
   - Read: `users`
   - Write: `users`
5. Click **"Create"**

**Add these attributes:**
- `userId` (String, Optional, Size: 50)
- `woodType` (String, Required, Size: 100)
- `dimensions` (String, Required, Size: 500)
- `quantity` (Integer, Required)
- `customization` (String, Optional, Size: 500)
- `totalPrice` (Integer, Required)

#### Collection 4: Users (Optional - for extended profiles)
1. Click **"Create Collection"**
2. **Collection ID**: `users`
3. **Name**: `Users`
4. **Permissions**:
   - Read: `any`
   - Write: `users`
5. Click **"Create"**

**Add these attributes:**
- `companyName` (String, Optional, Size: 255)
- `usagePreference` (String, Optional, Size: 20)
- `phone` (String, Optional, Size: 20)

### 📦 4. Create Storage Buckets

#### Bucket 1: Product Images
1. Go to **Storage**
2. Click **"Create Bucket"**
3. **Bucket ID**: `product-images`
4. **Name**: `Product Images`
5. **Permissions**:
   - Read: `any`
   - Write: `users`
6. **File Security**: Enabled
7. **Maximum File Size**: 5MB
8. **Allowed File Extensions**: jpg, jpeg, png, webp
9. Click **"Create"**

#### Bucket 2: User Files
1. Click **"Create Bucket"**
2. **Bucket ID**: `user-files`
3. **Name**: `User Files`
4. **Permissions**:
   - Read: `users`
   - Write: `users`
5. **File Security**: Enabled
6. **Maximum File Size**: 10MB
7. **Allowed File Extensions**: jpg, jpeg, png, pdf, doc, docx
8. Click **"Create"**

### 🔐 5. Configure Authentication

1. Go to **Authentication**
2. Click **"Settings"**
3. Enable **"Email/Password"** authentication
4. Configure email templates (optional):
   - Welcome email
   - Password reset email
   - Email verification

#### Optional: OAuth Providers
1. In Authentication settings, enable:
   - Google OAuth
   - Facebook OAuth
2. Add your OAuth app credentials

### 🌱 6. Add Sample Data

#### Add Sample Products
1. Go to your **Products** collection
2. Click **"Create Document"**
3. Add this sample product:

```json
{
  "name": "Burma Teak",
  "scientificName": "Tectona grandis",
  "category": "teak",
  "grade": "premium",
  "overview": "{\"description\":\"Premium Burma Teak with exceptional durability\",\"keyBenefits\":[\"High durability\",\"Beautiful grain\",\"Weather resistant\"],\"premiumPositioning\":\"Gold standard of premium hardwoods\",\"tagline\":\"The Gold Standard of Premium Hardwoods\"}",
  "specifications": "{\"density\":650,\"hardness\":1155,\"moistureContent\":10,\"grainPattern\":\"straight\",\"durability\":\"class1\",\"workability\":\"excellent\",\"finishQuality\":\"excellent\",\"dimensionalStability\":\"high\"}",
  "pricing": "{\"pricePerSqFt\":3500,\"priceRange\":\"luxury\",\"marketTrend\":\"increasing\"}",
  "seo": "{\"metaTitle\":\"Burma Teak - Premium Hardwood | New India Timber\",\"metaDescription\":\"Discover Burma Teak, the gold standard of premium hardwoods\",\"keywords\":[\"burma teak\",\"premium hardwood\",\"luxury wood\"]}"
}
```

### 🧪 7. Test Your Setup

1. **Test Authentication**:
   - Go to http://localhost:8081/login
   - Try registering a new user
   - Try logging in

2. **Test Bulk Orders**:
   - Go to http://localhost:8081/bulk-orders
   - Fill out the form
   - Submit and check if it appears in your Orders collection

3. **Test Product Display**:
   - Go to http://localhost:8081/products
   - Verify products are loading from the database

## 🔧 Troubleshooting

### Common Issues:

1. **"Project not found"**
   - Verify your Project ID in the .env file
   - Check that you're using the correct Appwrite project

2. **"Collection not found"**
   - Ensure collections are created with exact IDs: `products`, `orders`, `estimates`
   - Check collection permissions

3. **"Permission denied"**
   - Verify collection permissions allow user read/write
   - Check if user is authenticated

4. **"Authentication failed"**
   - Enable email/password authentication in Appwrite Console
   - Check authentication settings

## 📱 Your App Status

- ✅ **Frontend**: Running on http://localhost:8081
- ✅ **Backend**: Appwrite configured
- ✅ **Environment**: Variables set
- 🔄 **Database**: Ready for setup (follow steps above)
- 🔄 **Authentication**: Ready for configuration

## 🎯 Next Steps After Setup

1. Test user registration and login
2. Add more product data
3. Test bulk order submissions
4. Configure email notifications
5. Set up admin dashboard for managing products

Your Timber Craft Commerce Hub is ready to go once you complete the manual setup above!
