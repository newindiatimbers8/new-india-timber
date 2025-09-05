# Timber Craft Commerce Hub - Deployment Guide

## 🚀 Quick Deployment Options

Your project is ready for deployment! Here are the best hosting options:

### Option 1: Vercel (Recommended)
**Best for**: React apps, automatic deployments, great performance

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Deploy**:
   ```bash
   vercel --prod
   ```

3. **Configure Environment Variables** in Vercel Dashboard:
   - `VITE_APPWRITE_ENDPOINT`: https://cloud.appwrite.io/v1
   - `VITE_APPWRITE_PROJECT_ID`: your-project-id-here
   - `VITE_APPWRITE_DATABASE_ID`: timbercraft-db
   - `VITE_GROQ_API_KEY`: your-groq-api-key-here

### Option 2: Netlify
**Best for**: Static sites, form handling, edge functions

1. **Install Netlify CLI**:
   ```bash
   npm i -g netlify-cli
   ```

2. **Deploy**:
   ```bash
   netlify deploy --prod --dir=dist
   ```

3. **Configure Environment Variables** in Netlify Dashboard

### Option 3: GitHub Pages
**Best for**: Free hosting, GitHub integration

1. **Install gh-pages**:
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Add to package.json scripts**:
   ```json
   "deploy": "gh-pages -d dist"
   ```

3. **Deploy**:
   ```bash
   npm run deploy
   ```

### Option 4: Firebase Hosting
**Best for**: Google ecosystem, real-time features

1. **Install Firebase CLI**:
   ```bash
   npm install -g firebase-tools
   ```

2. **Initialize**:
   ```bash
   firebase init hosting
   ```

3. **Deploy**:
   ```bash
   firebase deploy
   ```

## 🔧 Pre-Deployment Checklist

- [x] ✅ Project built successfully (`npm run build`)
- [x] ✅ Build files generated in `dist/` folder
- [x] ✅ Environment variables configured
- [ ] ⚠️ Update Appwrite project ID in environment variables
- [ ] ⚠️ Configure Appwrite database and collections
- [ ] ⚠️ Set up domain (optional)

## 🌐 Custom Domain Setup

### For Vercel:
1. Go to Project Settings → Domains
2. Add your domain
3. Update DNS records as instructed

### For Netlify:
1. Go to Site Settings → Domain Management
2. Add custom domain
3. Configure DNS

## 📱 Appwrite Backend Setup

Before deploying, ensure your Appwrite backend is configured:

1. **Create Appwrite Project**:
   - Go to [Appwrite Console](https://cloud.appwrite.io)
   - Create new project
   - Copy Project ID

2. **Set up Database**:
   ```bash
   npm run setup:database
   ```

3. **Configure Storage**:
   ```bash
   npm run setup:storage
   ```

## 🚨 Important Notes

1. **Environment Variables**: Update the placeholder values in your hosting platform
2. **Appwrite Configuration**: Ensure your Appwrite project is properly set up
3. **CORS Settings**: Configure CORS in Appwrite for your domain
4. **API Keys**: Keep your API keys secure and never commit them to version control

## 🔍 Testing Your Deployment

After deployment:
1. Visit your deployed URL
2. Test all major features:
   - User authentication
   - Product browsing
   - Price estimation
   - Contact forms
3. Check browser console for any errors
4. Test on mobile devices

## 📞 Support

If you encounter issues:
1. Check the browser console for errors
2. Verify environment variables are set correctly
3. Ensure Appwrite backend is accessible
4. Check hosting platform logs

---

**Your Timber Craft Commerce Hub is ready to go live! 🎉**
