/**
 * AI Content Generation and Settings Types
 * Based on data-model.md specifications
 */

export interface AISettings {
  id: string;                    // Primary key
  apiKey: string;                // Encrypted Gemini API key
  model: string;                 // Model version (gemini-pro, etc.)
  maxTokens: number;             // Token limit per request
  temperature: number;           // Creativity setting (0-1)
  isEnabled: boolean;            // Feature toggle
  rateLimits: {
    requestsPerMinute: number;
    requestsPerHour: number;
    requestsPerDay: number;
  };
  usage: {
    totalRequests: number;
    totalTokens: number;
    lastUsed: string;            // ISO date
    monthlySpend: number;        // Cost tracking in currency units
  };
  prompts: AIPromptTemplate[];   // Pre-defined prompts
  createdAt: string;
  updatedAt: string;
}

export interface AIPromptTemplate {
  id: string;
  name: string;                  // Template name
  category: AIContentCategory;   // blog, product, legal, marketing
  prompt: string;                // Template content with variables
  variables: string[];           // Available placeholders (e.g., ['topic', 'audience'])
  description: string;           // Usage description
  isDefault?: boolean;           // Built-in template flag
  usageCount?: number;           // Usage tracking
}

export interface AIContentRequest {
  id: string;
  description: string;           // User input description
  contentType: AIContentCategory;
  promptTemplate?: string;       // Optional template ID
  generatedContent: string;      // AI response
  editedContent?: string;        // User modifications
  status: AIContentStatus;
  metadata: {
    model: string;
    tokensUsed: number;
    generationTime: number;      // Milliseconds
    cost: number;                // Estimated cost in currency units
  };
  createdAt: string;
  updatedAt: string;
  userId: string;                // Who requested
  sessionId?: string;            // For tracking related requests
}

export interface AIContentResponse {
  id: string;
  content: string;
  metadata: {
    model: string;
    tokensUsed: number;
    generationTime: number;
    cost: number;
  };
  suggestions?: string[];        // Improvement suggestions
  alternativeVersions?: string[]; // Alternative content versions
}

export interface AIImagePrompt {
  id: string;
  description: string;           // User description for image
  imageType: AIImageType;        // hero, product, thumbnail, etc.
  style?: AIImageStyle;          // photography, illustration, etc.
  dimensions?: string;           // "16:9", "4:3", "1:1", etc.
  generatedPrompt: string;       // AI-generated detailed prompt
  negativePrompt?: string;       // What to avoid in the image
  createdAt: string;
  userId: string;
}

// Enums and types
export type AIContentCategory = 'blog' | 'product' | 'legal' | 'marketing';
export type AIContentStatus = 'generating' | 'completed' | 'error' | 'cancelled';
export type AIImageType = 'hero' | 'product' | 'thumbnail' | 'social' | 'illustration';
export type AIImageStyle = 'photography' | 'illustration' | 'diagram' | 'infographic';

// Validation constants
export const AI_VALIDATION = {
  TEMPERATURE_RANGE: { min: 0, max: 1 } as const,
  MAX_TOKENS_RANGE: { min: 1, max: 4000 } as const,
  RATE_LIMIT_RANGES: {
    requestsPerMinute: { min: 1, max: 100 },
    requestsPerHour: { min: 1, max: 1000 },
    requestsPerDay: { min: 1, max: 10000 }
  } as const,
  SUPPORTED_MODELS: ['gemini-pro', 'gemini-pro-vision', 'gemini-1.5-pro'] as const,
} as const;

// Type guards
export function isAISettings(obj: any): obj is AISettings {
  return obj &&
         typeof obj.id === 'string' &&
         typeof obj.apiKey === 'string' &&
         typeof obj.model === 'string' &&
         typeof obj.maxTokens === 'number' &&
         typeof obj.temperature === 'number' &&
         typeof obj.isEnabled === 'boolean' &&
         obj.rateLimits && typeof obj.rateLimits === 'object' &&
         obj.usage && typeof obj.usage === 'object' &&
         Array.isArray(obj.prompts) &&
         typeof obj.createdAt === 'string' &&
         typeof obj.updatedAt === 'string';
}

export function isAIContentRequest(obj: any): obj is AIContentRequest {
  return obj &&
         typeof obj.id === 'string' &&
         typeof obj.description === 'string' &&
         ['blog', 'product', 'legal', 'marketing'].includes(obj.contentType) &&
         typeof obj.generatedContent === 'string' &&
         ['generating', 'completed', 'error', 'cancelled'].includes(obj.status) &&
         obj.metadata && typeof obj.metadata === 'object' &&
         typeof obj.createdAt === 'string' &&
         typeof obj.updatedAt === 'string' &&
         typeof obj.userId === 'string';
}

export function isAIPromptTemplate(obj: any): obj is AIPromptTemplate {
  return obj &&
         typeof obj.id === 'string' &&
         typeof obj.name === 'string' &&
         ['blog', 'product', 'legal', 'marketing'].includes(obj.category) &&
         typeof obj.prompt === 'string' &&
         Array.isArray(obj.variables) &&
         typeof obj.description === 'string';
}

// Validation functions
export function validateAISettings(settings: Partial<AISettings>): string[] {
  const errors: string[] = [];

  if (settings.temperature !== undefined) {
    if (settings.temperature < AI_VALIDATION.TEMPERATURE_RANGE.min ||
        settings.temperature > AI_VALIDATION.TEMPERATURE_RANGE.max) {
      errors.push(`Temperature must be between ${AI_VALIDATION.TEMPERATURE_RANGE.min} and ${AI_VALIDATION.TEMPERATURE_RANGE.max}`);
    }
  }

  if (settings.maxTokens !== undefined) {
    if (settings.maxTokens < AI_VALIDATION.MAX_TOKENS_RANGE.min ||
        settings.maxTokens > AI_VALIDATION.MAX_TOKENS_RANGE.max) {
      errors.push(`Max tokens must be between ${AI_VALIDATION.MAX_TOKENS_RANGE.min} and ${AI_VALIDATION.MAX_TOKENS_RANGE.max}`);
    }
  }

  if (settings.rateLimits) {
    const { requestsPerMinute, requestsPerHour, requestsPerDay } = settings.rateLimits;

    if (requestsPerMinute !== undefined) {
      const range = AI_VALIDATION.RATE_LIMIT_RANGES.requestsPerMinute;
      if (requestsPerMinute < range.min || requestsPerMinute > range.max) {
        errors.push(`Requests per minute must be between ${range.min} and ${range.max}`);
      }
    }

    if (requestsPerHour !== undefined) {
      const range = AI_VALIDATION.RATE_LIMIT_RANGES.requestsPerHour;
      if (requestsPerHour < range.min || requestsPerHour > range.max) {
        errors.push(`Requests per hour must be between ${range.min} and ${range.max}`);
      }
    }

    if (requestsPerDay !== undefined) {
      const range = AI_VALIDATION.RATE_LIMIT_RANGES.requestsPerDay;
      if (requestsPerDay < range.min || requestsPerDay > range.max) {
        errors.push(`Requests per day must be between ${range.min} and ${range.max}`);
      }
    }
  }

  if (settings.model && !AI_VALIDATION.SUPPORTED_MODELS.includes(settings.model as any)) {
    errors.push(`Model must be one of: ${AI_VALIDATION.SUPPORTED_MODELS.join(', ')}`);
  }

  return errors;
}

// Utility functions
export function getDefaultAISettings(): Omit<AISettings, 'id' | 'apiKey' | 'createdAt' | 'updatedAt'> {
  return {
    model: 'gemini-pro',
    maxTokens: 2000,
    temperature: 0.7,
    isEnabled: true,
    rateLimits: {
      requestsPerMinute: 10,
      requestsPerHour: 100,
      requestsPerDay: 500
    },
    usage: {
      totalRequests: 0,
      totalTokens: 0,
      lastUsed: new Date().toISOString(),
      monthlySpend: 0
    },
    prompts: []
  };
}

export function getDefaultPromptTemplates(): AIPromptTemplate[] {
  return [
    {
      id: 'blog-timber-basics',
      name: 'Timber Basics Blog Post',
      category: 'blog',
      prompt: 'Write an informative blog post about {topic} for timber and wood product customers in {location}. Include practical tips, quality considerations, and local availability information. Keep it engaging and professional.',
      variables: ['topic', 'location'],
      description: 'General timber and wood product information',
      isDefault: true,
      usageCount: 0
    },
    {
      id: 'legal-privacy-india',
      name: 'Indian Privacy Policy',
      category: 'legal',
      prompt: 'Generate a comprehensive privacy policy for a {businessType} business in India, compliant with IT Act 2000 and consumer protection laws. Include sections on data collection, usage, cookies, and user rights under Indian law.',
      variables: ['businessType'],
      description: 'GDPR and IT Act compliant privacy policy',
      isDefault: true,
      usageCount: 0
    },
    {
      id: 'product-description',
      name: 'Product Description',
      category: 'product',
      prompt: 'Create a compelling product description for {productName} including key features, benefits, specifications, and ideal use cases. Highlight quality, durability, and value proposition.',
      variables: ['productName'],
      description: 'Detailed product descriptions for e-commerce',
      isDefault: true,
      usageCount: 0
    }
  ];
}

export function calculateTokenCost(tokens: number, model: string): number {
  // Simplified cost calculation - in production, this would use actual API pricing
  const rates: Record<string, number> = {
    'gemini-pro': 0.00025, // $0.00025 per token (example rate)
    'gemini-pro-vision': 0.0004,
    'gemini-1.5-pro': 0.00035
  };

  return tokens * (rates[model] || rates['gemini-pro']);
}
