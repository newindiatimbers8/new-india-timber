# SEO Settings Documentation

## Overview

The SEO Settings feature provides comprehensive search engine optimization management for the Timber Craft Commerce Hub website. This includes global SEO configuration, page-specific SEO management, AI-powered content generation, and analytics tools.

## Features

### 1. Global SEO Settings
- **Basic Information**: Site name, default title templates, meta descriptions, keywords
- **Social Media**: Open Graph and Twitter Card configurations
- **Structured Data**: Organization schema with contact and address information
- **Technical SEO**: Robots.txt configuration and canonical URLs

### 2. Page SEO Management
- **Individual Page Settings**: Custom meta titles, descriptions, and keywords for each page
- **Status Management**: Published, draft, and archived page states
- **Social Media Optimization**: Page-specific Open Graph and Twitter settings
- **SEO Scoring**: Automatic scoring based on best practices
- **Bulk Operations**: Mass generation and management of SEO content

### 3. AI Content Generation
- **GroqCloud Integration**: Uses GroqCloud API for intelligent content generation
- **Title Optimization**: AI-generated meta titles with character limit awareness
- **Description Generation**: Compelling meta descriptions optimized for click-through rates
- **Keyword Extraction**: Intelligent keyword suggestions based on content analysis
- **Multiple Models**: Support for various AI models (GPT OSS 20B, Llama 3.1, Mixtral)

### 4. SEO Preview
- **Search Results Preview**: See how pages appear in Google search results
- **Social Media Previews**: Facebook, Twitter, LinkedIn, and mobile previews
- **Real-time Updates**: Live preview as you edit content
- **Character Count Validation**: Real-time validation of title and description lengths

### 5. Analytics & Monitoring
- **SEO Score Dashboard**: Overall website SEO health monitoring
- **Completion Tracking**: Progress tracking for page optimization
- **Issue Detection**: Automatic identification of SEO problems
- **Storage Management**: Data usage and integrity monitoring

## Getting Started

### 1. Access SEO Settings
1. Navigate to the Dashboard
2. Click on "SEO Settings" in the sidebar
3. You'll be taken to the SEO management interface

### 2. Configure Global Settings
1. Go to the "Global Settings" tab
2. Fill in basic information (site name, default title, description)
3. Configure social media settings
4. Set up structured data for your organization
5. Save the settings

### 3. Set Up AI Content Generation
1. Navigate to the "AI Generator" tab
2. Enter your GroqCloud API key (get it from [GroqCloud Console](https://console.groq.com/keys))
3. Select your preferred AI model
4. Test the connection
5. Start generating SEO content

### 4. Optimize Individual Pages
1. Go to the "Page Management" tab
2. Select a page from the list
3. Fill in custom meta titles and descriptions
4. Add relevant keywords
5. Use the AI generator for suggestions
6. Preview how the page will appear in search results
7. Save the changes

## API Configuration

### GroqCloud API Setup
1. Create an account at [GroqCloud](https://console.groq.com/)
2. Generate an API key
3. Add the key in SEO Settings > AI Generator > AI Configuration
4. Select your preferred model:
   - **GPT OSS 20B**: Fast and capable for general tasks
   - **Llama 3.1 70B**: Large model with excellent reasoning
   - **Llama 3.1 8B Instant**: Lightweight for quick responses
   - **Mixtral 8x7B**: Best for complex reasoning and long contexts

### Environment Variables (Optional)
For production deployments, you can set the API key as an environment variable:
```bash
GROQ_API_KEY=your_api_key_here
```

## File Structure

```
src/
├── types/
│   └── seo.ts                    # TypeScript type definitions
├── utils/
│   ├── seoStorage.ts            # LocalStorage management
│   └── seoAI.ts                 # AI content generation utilities
├── components/
│   └── seo/
│       ├── GlobalSEOSettings.tsx    # Global settings form
│       ├── PageSEOManagement.tsx    # Page-specific SEO management
│       ├── SEOPreview.tsx           # Preview component
│       └── AIContentGenerator.tsx   # AI content generation interface
└── pages/
    └── SEOSettingsPage.tsx      # Main SEO settings page
```

## Best Practices

### 1. Meta Titles
- Keep under 60 characters
- Include primary keywords near the beginning
- Make them descriptive and compelling
- Use the brand name consistently

### 2. Meta Descriptions
- Aim for 150-160 characters
- Include a call-to-action
- Describe the page content accurately
- Include relevant keywords naturally

### 3. Keywords
- Use 3-7 relevant keywords per page
- Focus on long-tail keywords
- Include location-based keywords for local SEO
- Avoid keyword stuffing

### 4. Social Media
- Use high-quality images (1200x630px for Open Graph)
- Write compelling social media titles and descriptions
- Test how content appears on different platforms

## Troubleshooting

### AI Generation Issues
- **API Key Invalid**: Verify your GroqCloud API key is correct
- **Model Not Available**: Try switching to a different AI model
- **Rate Limiting**: Wait a moment and try again
- **Network Error**: Check your internet connection

### Storage Issues
- **Settings Not Saving**: Check browser localStorage is enabled
- **Data Corruption**: Use the export/import feature to backup and restore
- **Storage Full**: Clear unnecessary data or export settings

### Performance
- **Slow Loading**: Check if you have too many pages configured
- **Memory Issues**: Export settings and reload the page
- **Browser Compatibility**: Ensure you're using a modern browser

## Support

For technical issues or feature requests related to the SEO Settings:
1. Check the browser console for error messages
2. Verify all required fields are filled
3. Test with a different browser
4. Export your settings as a backup before making major changes

## API Limitations

### GroqCloud Free Tier
- Limited API calls per minute
- Model availability may vary
- Response time depends on server load

### LocalStorage Limits
- Typical limit: 5-10MB per domain
- Export settings regularly as backup
- Consider implementing server-side storage for large datasets

## Future Enhancements

Planned features for future versions:
- Server-side storage integration
- Automated SEO auditing
- Integration with Google Analytics
- Sitemap generation
- Schema markup wizard
- Performance monitoring
- A/B testing for SEO content