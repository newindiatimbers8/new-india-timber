# Complete Appwrite Setup Guide for Timber Craft Commerce Hub

This is a comprehensive step-by-step guide to configure your entire project with Appwrite backend.

## 🎯 Project Overview

- **Project Name**: New India Timber
- **Project ID**: `68b0a743000c98e8ca75`
- **Endpoint**: `https://fra.cloud.appwrite.io/v1`
- **Frontend**: React + Vite running on http://localhost:8082
- **Backend**: Appwrite Cloud (Frankfurt region)

## 📋 Step-by-Step Setup Process

### Step 1: Access Appwrite Console ✅

1. Go to [Appwrite Console](https://cloud.appwrite.io)
2. Login to your account
3. Select project: **"New India Timber"** (ID: `68b0a743000c98e8ca75`)

### Step 2: Create Database

1. In your project dashboard, click **"Database"** in the left sidebar
2. Click **"Create Database"**
3. Fill in the details:
   - **Database ID**: `timbercraft-db`
   - **Name**: `Timber Craft Database`
   - **Description**: `Database for New India Timber e-commerce platform`
4. Click **"Create"**

### Step 3: Create Collections

#### Collection 1: Products
1. In your database, click **"Create Collection"**
2. **Collection ID**: `products`
3. **Name**: `Products`
4. **Permissions**:
   - Read: `any` (allows public access to product catalog)
   - Write: `users` (only authenticated users can create/edit products)
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
   - Read: `users` (users can only see their own orders)
   - Write: `users` (users can create orders)
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

#### Collection 4: Users (Extended Profiles)
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

#### Collection 5: SEO Settings
1. Click **"Create Collection"**
2. **Collection ID**: `seo-settings`
3. **Name**: `SEO Settings`
4. **Permissions**:
   - Read: `any`
   - Write: `users`
5. Click **"Create"**

**Add these attributes:**
- `page` (String, Required, Size: 100)
- `metaTitle` (String, Required, Size: 255)
- `metaDescription` (String, Required, Size: 500)
- `keywords` (String, Required, Size: 1000)
- `canonicalUrl` (String, Optional, Size: 255)
- `structuredData` (String, Optional, Size: 2000)

### Step 4: Create Storage Buckets

#### Bucket 1: Product Images
1. Go to **"Storage"** in the left sidebar
2. Click **"Create Bucket"**
3. **Bucket ID**: `product-images`
4. **Name**: `Product Images`
5. **Permissions**:
   - Read: `any` (public access to product images)
   - Write: `users` (authenticated users can upload)
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

### Step 5: Configure Authentication

1. Go to **"Authentication"** in the left sidebar
2. Click **"Settings"**
3. Enable **"Email/Password"** authentication
4. Configure the following settings:
   - **Email Verification**: Optional (can be enabled later)
   - **Password History**: 0 (no password history required)
   - **Password Dictionary**: Disabled
   - **Password Personal Data Check**: Disabled

#### Optional: OAuth Providers
1. In Authentication settings, you can enable:
   - Google OAuth
   - Facebook OAuth
2. Add your OAuth app credentials if needed

### Step 6: Add Sample Data

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
  "overview": "{\"description\":\"Premium Burma Teak with exceptional durability and beautiful grain pattern\",\"keyBenefits\":[\"High durability\",\"Beautiful grain\",\"Weather resistant\",\"Natural oils\"],\"premiumPositioning\":\"Gold standard of premium hardwoods\",\"tagline\":\"The Gold Standard of Premium Hardwoods\"}",
  "specifications": "{\"density\":650,\"hardness\":1155,\"moistureContent\":10,\"grainPattern\":\"straight\",\"durability\":\"class1\",\"workability\":\"excellent\",\"finishQuality\":\"excellent\",\"dimensionalStability\":\"high\"}",
  "pricing": "{\"pricePerSqFt\":3500,\"priceRange\":\"luxury\",\"marketTrend\":\"increasing\"}",
  "seo": "{\"metaTitle\":\"Burma Teak - Premium Hardwood | New India Timber\",\"metaDescription\":\"Discover Burma Teak, the gold standard of premium hardwoods. Exceptional durability, natural beauty, and luxury appeal.\",\"keywords\":[\"burma teak\",\"myanmar teak\",\"premium hardwood\",\"luxury wood\",\"teak furniture\"]}"
}
```

4. Click **"Create"**

#### Add Second Sample Product
```json
{
  "name": "Red Sal",
  "scientificName": "Shorea robusta",
  "category": "hardwood",
  "grade": "commercial",
  "overview": "{\"description\":\"Versatile and robust hardwood native to the Indian subcontinent\",\"keyBenefits\":[\"Excellent strength\",\"Natural resistance\",\"Cost-effective\",\"Readily available\"],\"premiumPositioning\":\"Perfect balance of quality and value\",\"tagline\":\"Strength, Reliability, and Value Combined\"}",
  "specifications": "{\"density\":800,\"hardness\":1350,\"moistureContent\":12,\"grainPattern\":\"straight\",\"durability\":\"class2\",\"workability\":\"good\",\"finishQuality\":\"good\",\"dimensionalStability\":\"medium\"}",
  "pricing": "{\"pricePerSqFt\":1600,\"priceRange\":\"commercial\",\"marketTrend\":\"stable\"}",
  "seo": "{\"metaTitle\":\"Red Sal Wood - Reliable Commercial Hardwood | New India Timber\",\"metaDescription\":\"Red Sal offers excellent strength and value for construction and furniture projects. Sustainable Indian hardwood.\",\"keywords\":[\"red sal wood\",\"shorea robusta\",\"indian hardwood\",\"construction timber\",\"commercial wood\"]}"
}
```

### Step 7: Test Your Setup

#### Test 1: User Registration
1. Go to http://localhost:8082/login
2. Click on the **"Register"** tab
3. Fill out the registration form:
   - Name: `Test User`
   - Email: `newindiatimbers8@gmail.com`
   - Phone: `+91 9886033342`
   - Password: `TestPassword123!`
   - Confirm Password: `TestPassword123!`
   - Company Name: `Test Company`
   - Usage Preference: `Own Use (Premium)`
4. Click **"Create Account"**
5. You should see a success message and be redirected to dashboard

#### Test 2: User Login
1. Go to http://localhost:8082/login
2. Use the credentials from registration:
   - Email: `newindiatimbers8@gmail.com`
   - Password: `TestPassword123!`
3. Click **"Login"**
4. You should be redirected to the dashboard

#### Test 3: Bulk Order Submission
1. Go to http://localhost:8082/bulk-orders
2. Fill out the bulk order form:
   - Purpose: `Residential`
   - Number of Frames: `50`
   - Home Delivery: `Yes`
   - Address: `123 Test Street, Bangalore, Karnataka 560001`
   - Name: `Test User`
   - Email: `newindiatimbers8@gmail.com`
   - Phone: `+91 9886033342`
   - Customization: `Premium finish required`
3. Click **"Submit Bulk Order Request"**
4. Check your Appwrite Console → Database → Orders collection to see the new order

#### Test 4: Product Display
1. Go to http://localhost:8082/products
2. You should see the sample products (Burma Teak and Red Sal)
3. Click on a product to view details

### Step 8: Verify Database Operations

#### Check Collections in Appwrite Console
1. Go to your Appwrite Console
2. Navigate to Database → timbercraft-db
3. Verify all collections exist:
   - ✅ products (with sample data)
   - ✅ orders (with test order)
   - ✅ estimates
   - ✅ users
   - ✅ seo-settings

#### Check Storage Buckets
1. Go to Storage in Appwrite Console
2. Verify buckets exist:
   - ✅ product-images
   - ✅ user-files

#### Check Authentication
1. Go to Authentication → Users
2. You should see your test user: `newindiatimbers8@gmail.com`

## 🎉 Success Checklist

- [ ] Database created: `timbercraft-db`
- [ ] Collections created: products, orders, estimates, users, seo-settings
- [ ] Storage buckets created: product-images, user-files
- [ ] Authentication enabled: Email/Password
- [ ] Sample products added
- [ ] Test user created and can login
- [ ] Bulk order submission works
- [ ] Products display correctly
- [ ] Data is being saved to Appwrite

## 🔧 Troubleshooting

### Common Issues:

1. **"Project not found"**
   - Verify Project ID: `68b0a743000c98e8ca75`
   - Check endpoint: `https://fra.cloud.appwrite.io/v1`

2. **"Collection not found"**
   - Ensure collections are created with exact IDs
   - Check collection permissions

3. **"Permission denied"**
   - Verify collection permissions allow user read/write
   - Check if user is authenticated

4. **"Authentication failed"**
   - Enable email/password authentication in Appwrite Console
   - Check authentication settings

5. **"File upload failed"**
   - Verify bucket configuration and permissions
   - Check file size and extension limits

## 📱 Your App Status

- ✅ **Frontend**: React + Vite on http://localhost:8082
- ✅ **Backend**: Appwrite Cloud (Frankfurt)
- ✅ **Database**: Ready for setup
- ✅ **Authentication**: Ready for configuration
- ✅ **Storage**: Ready for file uploads
- ✅ **Code**: Fully integrated and ready

## 🚀 Next Steps After Setup

1. **Add More Products**: Use the admin interface to add more wood products
2. **Configure Email**: Set up email notifications for orders
3. **Admin Dashboard**: Create admin interface for managing products and orders
4. **Payment Integration**: Add payment processing for orders
5. **Analytics**: Set up tracking and analytics
6. **SEO Optimization**: Use the SEO settings collection for better search rankings

Your Timber Craft Commerce Hub is now ready for production use!
