/**
 * AI Settings Service
 * Manages AI configuration, API keys, and usage tracking
 */

import { AISettings, getDefaultAISettings, validateAISettings } from '@/types/ai';
import { loadCollection, saveCollection } from '@/utils/dataLoader';

const SETTINGS_COLLECTION = 'ai-settings';
const SETTINGS_ID = 'main'; // Single settings record

// In-memory cache
let settingsCache: AISettings | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Get AI settings
 */
export async function getAISettings(): Promise<AISettings | null> {
  try {
    // Check cache first
    const now = Date.now();
    if (settingsCache && (now - cacheTimestamp) < CACHE_DURATION) {
      return settingsCache;
    }

    // Load from storage
    const settings = await loadCollection<AISettings>(SETTINGS_COLLECTION);
    const mainSettings = settings.find(s => s.id === SETTINGS_ID);

    if (!mainSettings) {
      // Initialize with default settings
      const defaultSettings = {
        ...getDefaultAISettings(),
        id: SETTINGS_ID,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await saveCollection(SETTINGS_COLLECTION, [defaultSettings]);
      settingsCache = defaultSettings;
      cacheTimestamp = now;

      return defaultSettings;
    }

    // Cache the settings
    settingsCache = mainSettings;
    cacheTimestamp = now;

    return mainSettings;

  } catch (error) {
    console.error('Error loading AI settings:', error);
    return null;
  }
}

/**
 * Update AI settings
 */
export async function updateAISettings(updates: Partial<AISettings>): Promise<AISettings | null> {
  try {
    const currentSettings = await getAISettings();
    if (!currentSettings) {
      throw new Error('AI settings not found');
    }

    // Validate updates
    const validationErrors = validateAISettings(updates);
    if (validationErrors.length > 0) {
      throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
    }

    // Handle API key encryption (simplified for demo)
    let apiKey = updates.apiKey;
    if (apiKey && apiKey !== currentSettings.apiKey) {
      // In production, this would use proper encryption
      apiKey = await encryptApiKey(apiKey);
    }

    // Create updated settings
    const updatedSettings: AISettings = {
      ...currentSettings,
      ...updates,
      ...(apiKey && { apiKey }),
      updatedAt: new Date().toISOString()
    };

    // Save to storage
    await saveCollection(SETTINGS_COLLECTION, [updatedSettings]);

    // Update cache
    settingsCache = updatedSettings;
    cacheTimestamp = Date.now();

    // Clear API key from response for security
    const responseSettings = { ...updatedSettings };
    if (responseSettings.apiKey) {
      responseSettings.apiKey = '[ENCRYPTED]';
    }

    return responseSettings;

  } catch (error) {
    console.error('Error updating AI settings:', error);
    throw error;
  }
}

/**
 * Reset usage statistics
 */
export async function resetUsageStats(): Promise<boolean> {
  try {
    const settings = await getAISettings();
    if (!settings) return false;

    const updatedSettings: AISettings = {
      ...settings,
      usage: {
        totalRequests: 0,
        totalTokens: 0,
        lastUsed: new Date().toISOString(),
        monthlySpend: 0
      },
      updatedAt: new Date().toISOString()
    };

    await saveCollection(SETTINGS_COLLECTION, [updatedSettings]);

    // Update cache
    settingsCache = updatedSettings;
    cacheTimestamp = Date.now();

    return true;

  } catch (error) {
    console.error('Error resetting usage stats:', error);
    return false;
  }
}

/**
 * Update usage statistics
 */
export async function updateUsageStatistics(tokensUsed: number, cost: number): Promise<void> {
  try {
    const settings = await getAISettings();
    if (!settings) return;

    const updatedSettings: AISettings = {
      ...settings,
      usage: {
        totalRequests: settings.usage.totalRequests + 1,
        totalTokens: settings.usage.totalTokens + tokensUsed,
        lastUsed: new Date().toISOString(),
        monthlySpend: settings.usage.monthlySpend + cost
      },
      updatedAt: new Date().toISOString()
    };

    await saveCollection(SETTINGS_COLLECTION, [updatedSettings]);

    // Update cache
    settingsCache = updatedSettings;
    cacheTimestamp = Date.now();

  } catch (error) {
    console.error('Error updating usage statistics:', error);
    // Don't throw - usage tracking failures shouldn't break content generation
  }
}

/**
 * Get usage statistics
 */
export async function getUsageStatistics(): Promise<{
  totalRequests: number;
  totalTokens: number;
  monthlySpend: number;
  lastUsed: string;
  averageCostPerToken: number;
} | null> {
  try {
    const settings = await getAISettings();
    if (!settings) return null;

    const usage = settings.usage;
    const averageCostPerToken = usage.totalTokens > 0
      ? usage.monthlySpend / usage.totalTokens
      : 0;

    return {
      totalRequests: usage.totalRequests,
      totalTokens: usage.totalTokens,
      monthlySpend: usage.monthlySpend,
      lastUsed: usage.lastUsed,
      averageCostPerToken
    };

  } catch (error) {
    console.error('Error getting usage statistics:', error);
    return null;
  }
}

/**
 * Check if AI features are enabled
 */
export async function isAIEnabled(): Promise<boolean> {
  try {
    const settings = await getAISettings();
    return settings?.isEnabled ?? false;
  } catch (error) {
    console.error('Error checking AI enabled status:', error);
    return false;
  }
}

/**
 * Validate API key
 */
export async function validateApiKey(): Promise<{
  isValid: boolean;
  message: string;
  lastTested?: string;
}> {
  try {
    const settings = await getAISettings();
    if (!settings?.apiKey) {
      return {
        isValid: false,
        message: 'No API key configured'
      };
    }

    // In a real implementation, this would make a test API call
    // For now, just check if the key looks valid
    const isValidFormat = settings.apiKey.length > 20; // Basic check

    return {
      isValid: isValidFormat,
      message: isValidFormat ? 'API key format appears valid' : 'API key format is invalid',
      lastTested: new Date().toISOString()
    };

  } catch (error) {
    console.error('Error validating API key:', error);
    return {
      isValid: false,
      message: 'Error validating API key',
      lastTested: new Date().toISOString()
    };
  }
}

/**
 * Get rate limit status
 */
export async function getRateLimitStatus(): Promise<{
  requestsPerMinute: { used: number; limit: number; remaining: number };
  requestsPerHour: { used: number; limit: number; remaining: number };
  requestsPerDay: { used: number; limit: number; remaining: number };
  resetTimes: {
    minute: string;
    hour: string;
    day: string;
  };
} | null> {
  try {
    const settings = await getAISettings();
    if (!settings) return null;

    // In a real implementation, this would track actual usage
    // For now, return mock data
    const now = new Date();
    const minuteReset = new Date(now.getTime() + 60 * 1000);
    const hourReset = new Date(now.getTime() + 60 * 60 * 1000);
    const dayReset = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

    return {
      requestsPerMinute: {
        used: Math.floor(Math.random() * 5), // Mock usage
        limit: settings.rateLimits.requestsPerMinute,
        remaining: settings.rateLimits.requestsPerMinute - Math.floor(Math.random() * 5)
      },
      requestsPerHour: {
        used: Math.floor(Math.random() * 50),
        limit: settings.rateLimits.requestsPerHour,
        remaining: settings.rateLimits.requestsPerHour - Math.floor(Math.random() * 50)
      },
      requestsPerDay: {
        used: Math.floor(Math.random() * 200),
        limit: settings.rateLimits.requestsPerDay,
        remaining: settings.rateLimits.requestsPerDay - Math.floor(Math.random() * 200)
      },
      resetTimes: {
        minute: minuteReset.toISOString(),
        hour: hourReset.toISOString(),
        day: dayReset.toISOString()
      }
    };

  } catch (error) {
    console.error('Error getting rate limit status:', error);
    return null;
  }
}

/**
 * Export settings for backup
 */
export async function exportSettings(): Promise<AISettings | null> {
  try {
    const settings = await getAISettings();
    if (!settings) return null;

    // Create a safe export (without sensitive data)
    const exportData = { ...settings };
    if (exportData.apiKey) {
      exportData.apiKey = '[EXPORTED - API KEY REMOVED FOR SECURITY]';
    }

    return exportData;

  } catch (error) {
    console.error('Error exporting settings:', error);
    return null;
  }
}

/**
 * Import settings from backup
 */
export async function importSettings(settingsData: Partial<AISettings>): Promise<AISettings | null> {
  try {
    // Validate imported data
    const validationErrors = validateAISettings(settingsData);
    if (validationErrors.length > 0) {
      throw new Error(`Invalid import data: ${validationErrors.join(', ')}`);
    }

    // Don't import API key from backup for security
    const safeData = { ...settingsData };
    delete safeData.apiKey;

    return await updateAISettings(safeData);

  } catch (error) {
    console.error('Error importing settings:', error);
    throw error;
  }
}

// Private helper functions

async function encryptApiKey(apiKey: string): Promise<string> {
  // In a real application, this would use proper encryption
  // For demo purposes, we'll just return a placeholder
  // In production: use AES encryption with a server-side key
  return `encrypted_${btoa(apiKey)}`;
}

async function decryptApiKey(encryptedKey: string): Promise<string> {
  // In a real application, this would decrypt the key
  // For demo purposes, we'll just return a placeholder
  if (encryptedKey.startsWith('encrypted_')) {
    try {
      return atob(encryptedKey.replace('encrypted_', ''));
    } catch {
      throw new Error('Invalid encrypted API key');
    }
  }
  return encryptedKey; // Assume it's not encrypted
}
