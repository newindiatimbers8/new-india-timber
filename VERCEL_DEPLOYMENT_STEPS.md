# Vercel Deployment Steps

## 🚀 Manual Deployment to Vercel

Since the CLI is having authentication issues, here's how to deploy manually:

### Step 1: Go to Vercel Dashboard
1. Visit [vercel.com](https://vercel.com)
2. Sign in with your GitHub account (ambilimonllc@gmail.com)
3. Click "New Project"

### Step 2: Import Your Project
1. Click "Import Git Repository"
2. Select your `timber-craft-commerce-hub` repository
3. Click "Import"

### Step 3: Configure Build Settings
- **Framework Preset**: Vite
- **Root Directory**: `./` (leave as default)
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### Step 4: Set Environment Variables
In the Environment Variables section, add:

```
VITE_APPWRITE_ENDPOINT = https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID = your-project-id-here
VITE_APPWRITE_DATABASE_ID = timbercraft-db
VITE_GROQ_API_KEY = your-groq-api-key-here
```

### Step 5: Deploy
1. Click "Deploy"
2. Wait for the build to complete
3. Your site will be live at: `https://timber-craft-commerce-hub.vercel.app`

## 🔧 Alternative: Drag & Drop Deployment

If you prefer a quick deployment:

1. Go to [vercel.com/new](https://vercel.com/new)
2. Drag and drop your `dist` folder
3. Your site will be deployed instantly

## 📝 Post-Deployment Setup

After deployment:

1. **Update Appwrite Settings**:
   - Go to your Appwrite console
   - Update CORS settings to include your Vercel domain
   - Example: `https://timber-craft-commerce-hub.vercel.app`

2. **Test Your Application**:
   - Visit your deployed URL
   - Test all features
   - Check browser console for errors

3. **Custom Domain (Optional)**:
   - Go to Project Settings → Domains
   - Add your custom domain
   - Update DNS records

## 🎉 Your Site is Live!

Your Timber Craft Commerce Hub will be available at:
`https://timber-craft-commerce-hub.vercel.app`

---

**Next Steps:**
1. Complete the manual deployment above
2. Update environment variables with real values
3. Configure Appwrite backend
4. Test all functionality
