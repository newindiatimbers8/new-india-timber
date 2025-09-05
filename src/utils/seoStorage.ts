import { 
  GlobalSEOSettings, 
  PageSEOSettings, 
  defaultGlobalSEOSettings,
  predefinedPages,
  AISettings,
  defaultAISettings
} from '@/types/seo';

/**
 * SEO Storage Manager - Handles localStorage operations for SEO settings
 */
export class SEOStorageManager {
  private static readonly STORAGE_KEYS = {
    GLOBAL_SEO: 'timber_hub_global_seo',
    PAGE_SEO: 'timber_hub_page_seo',
    AI_SETTINGS: 'timber_hub_ai_settings',
    SEO_CACHE: 'timber_hub_seo_cache'
  } as const;

  /**
   * Save global SEO settings to localStorage
   */
  static saveGlobalSettings(settings: GlobalSEOSettings): void {
    try {
      const serializedSettings = JSON.stringify({
        ...settings,
        updatedAt: new Date().toISOString(),
        updatedBy: 'admin' // In a real app, this would be the current user
      });
      localStorage.setItem(this.STORAGE_KEYS.GLOBAL_SEO, serializedSettings);
    } catch (error) {
      console.error('Failed to save global SEO settings:', error);
      throw new Error('Failed to save SEO settings. Storage might be full.');
    }
  }

  /**
   * Load global SEO settings from localStorage
   */
  static loadGlobalSettings(): GlobalSEOSettings | null {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEYS.GLOBAL_SEO);
      if (!stored) return null;
      
      const parsed = JSON.parse(stored);
      return {
        ...defaultGlobalSEOSettings,
        ...parsed,
        id: parsed.id || crypto.randomUUID()
      } as GlobalSEOSettings;
    } catch (error) {
      console.error('Failed to load global SEO settings:', error);
      return null;
    }
  }

  /**
   * Get or create global SEO settings with defaults
   */
  static getGlobalSettingsWithDefaults(): GlobalSEOSettings {
    const stored = this.loadGlobalSettings();
    if (stored) return stored;

    const newSettings: GlobalSEOSettings = {
      ...defaultGlobalSEOSettings,
      id: crypto.randomUUID(),
      updatedAt: new Date().toISOString(),
      updatedBy: 'system',
      structuredData: {
        organizationSchema: {
          '@type': 'Organization',
          name: 'Timber Craft Commerce Hub',
          url: 'https://timbercrafthub.com',
          logo: 'https://timbercrafthub.com/logo.png',
          contactPoint: [{
            '@type': 'ContactPoint',
            telephone: '+91-80-1234-5678',
            contactType: 'customer service',
            areaServed: 'IN',
            availableLanguage: ['English', 'Hindi']
          }],
          address: {
            '@type': 'PostalAddress',
            streetAddress: '24/4 Sarjapura Main Road Doddakanna halli, beside Uber Verdant, Phase 1, apartments',
            addressLocality: 'Bangalore',
            addressRegion: 'Karnataka',
            postalCode: '560068',
            addressCountry: 'IN'
          },
          sameAs: [
            'https://www.facebook.com/timbercrafthub',
            'https://www.instagram.com/timbercrafthub',
            'https://www.linkedin.com/company/timbercrafthub'
          ]
        },
        websiteSchema: {
          '@type': 'WebSite',
          name: 'Timber Craft Commerce Hub',
          url: 'https://timbercrafthub.com',
          description: 'Premium timber and woodcraft solutions for construction and design',
          publisher: {
            '@type': 'Organization',
            name: 'Timber Craft Commerce Hub'
          }
        }
      },
      analytics: {}
    } as GlobalSEOSettings;

    this.saveGlobalSettings(newSettings);
    return newSettings;
  }

  /**
   * Save page SEO settings to localStorage
   */
  static savePageSettings(settings: PageSEOSettings[]): void {
    try {
      const serializedSettings = JSON.stringify(settings.map(setting => ({
        ...setting,
        lastModified: new Date().toISOString()
      })));
      localStorage.setItem(this.STORAGE_KEYS.PAGE_SEO, serializedSettings);
    } catch (error) {
      console.error('Failed to save page SEO settings:', error);
      throw new Error('Failed to save page SEO settings. Storage might be full.');
    }
  }

  /**
   * Load page SEO settings from localStorage
   */
  static loadPageSettings(): PageSEOSettings[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEYS.PAGE_SEO);
      if (!stored) return this.initializeDefaultPageSettings();
      
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : this.initializeDefaultPageSettings();
    } catch (error) {
      console.error('Failed to load page SEO settings:', error);
      return this.initializeDefaultPageSettings();
    }
  }

  /**
   * Initialize default page settings for predefined pages
   */
  private static initializeDefaultPageSettings(): PageSEOSettings[] {
    const defaultPages: PageSEOSettings[] = predefinedPages.map(page => ({
      id: crypto.randomUUID(),
      pageId: page.id,
      pagePath: page.path,
      pageTitle: page.title,
      metaTitle: undefined,
      metaDescription: undefined,
      keywords: [],
      canonicalUrl: undefined,
      noIndex: false,
      noFollow: false,
      customMeta: [],
      ogTitle: undefined,
      ogDescription: undefined,
      ogImage: undefined,
      twitterTitle: undefined,
      twitterDescription: undefined,
      twitterImage: undefined,
      priority: 0.8,
      changeFreq: 'weekly',
      lastModified: new Date().toISOString(),
      status: 'published'
    }));

    this.savePageSettings(defaultPages);
    return defaultPages;
  }

  /**
   * Update a specific page's SEO settings
   */
  static updatePageSetting(updatedPage: PageSEOSettings): void {
    const allPages = this.loadPageSettings();
    const pageIndex = allPages.findIndex(page => page.id === updatedPage.id);
    
    if (pageIndex >= 0) {
      allPages[pageIndex] = {
        ...updatedPage,
        lastModified: new Date().toISOString()
      };
    } else {
      allPages.push({
        ...updatedPage,
        lastModified: new Date().toISOString()
      });
    }
    
    this.savePageSettings(allPages);
  }

  /**
   * Save AI settings to localStorage
   */
  static saveAISettings(settings: AISettings): void {
    try {
      localStorage.setItem(this.STORAGE_KEYS.AI_SETTINGS, JSON.stringify(settings));
    } catch (error) {
      console.error('Failed to save AI settings:', error);
      throw new Error('Failed to save AI settings.');
    }
  }

  /**
   * Load AI settings from localStorage
   */
  static loadAISettings(): AISettings {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEYS.AI_SETTINGS);
      if (!stored) return defaultAISettings;
      
      const parsed = JSON.parse(stored);
      return { ...defaultAISettings, ...parsed };
    } catch (error) {
      console.error('Failed to load AI settings:', error);
      return defaultAISettings;
    }
  }

  /**
   * Clear all SEO cache data
   */
  static clearCache(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEYS.SEO_CACHE);
    } catch (error) {
      console.error('Failed to clear SEO cache:', error);
    }
  }

  /**
   * Export all SEO settings as JSON
   */
  static exportAllSettings(): string {
    const globalSettings = this.loadGlobalSettings();
    const pageSettings = this.loadPageSettings();
    const aiSettings = this.loadAISettings();

    const exportData = {
      global: globalSettings,
      pages: pageSettings,
      ai: aiSettings,
      exportedAt: new Date().toISOString(),
      version: '1.0'
    };

    return JSON.stringify(exportData, null, 2);
  }

  /**
   * Import SEO settings from JSON string
   */
  static importSettings(jsonString: string): boolean {
    try {
      const importData = JSON.parse(jsonString);
      
      if (importData.global) {
        this.saveGlobalSettings(importData.global);
      }
      
      if (importData.pages && Array.isArray(importData.pages)) {
        this.savePageSettings(importData.pages);
      }
      
      if (importData.ai) {
        this.saveAISettings(importData.ai);
      }
      
      return true;
    } catch (error) {
      console.error('Failed to import SEO settings:', error);
      return false;
    }
  }

  /**
   * Get storage usage information
   */
  static getStorageInfo(): { used: number; available: number; percentage: number } {
    try {
      const used = new Blob(Object.values(localStorage)).size;
      const available = 5 * 1024 * 1024; // Assuming 5MB limit for localStorage
      const percentage = (used / available) * 100;
      
      return { used, available, percentage };
    } catch (error) {
      return { used: 0, available: 0, percentage: 0 };
    }
  }

  /**
   * Validate SEO settings data integrity
   */
  static validateSettings(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    try {
      const global = this.loadGlobalSettings();
      if (!global) {
        errors.push('Global SEO settings not found');
      } else {
        if (!global.siteName) errors.push('Site name is required');
        if (!global.defaultTitle) errors.push('Default title is required');
        if (!global.defaultDescription) errors.push('Default description is required');
      }
      
      const pages = this.loadPageSettings();
      if (!Array.isArray(pages)) {
        errors.push('Page SEO settings are corrupted');
      }
      
    } catch (error) {
      errors.push(`Settings validation failed: ${error}`);
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}