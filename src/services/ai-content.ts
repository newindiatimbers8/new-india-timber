/**
 * AI Content Service
 * Handles AI-powered content generation using Google Gemini
 */

import {
  AIContentRequest,
  AIContentResponse,
  AIPromptTemplate,
  AIContentCategory,
  AIContentStatus,
  getDefaultPromptTemplates,
  validateAISettings,
  calculateTokenCost,
  AI_VALIDATION
} from '@/types/ai';
import { loadCollection, saveCollection } from '@/utils/dataLoader';

// Import Gemini AI (will be available after T001)
let GoogleGenerativeAI: any;
try {
  // Dynamic import to handle optional dependency
  const geminiModule = await import('@google/generative-ai');
  GoogleGenerativeAI = geminiModule.GoogleGenerativeAI;
} catch (error) {
  console.warn('Google Generative AI not available:', error);
}

const CONTENT_REQUESTS_COLLECTION = 'ai-content-requests';
const PROMPT_TEMPLATES_COLLECTION = 'ai-prompt-templates';

// In-memory cache
let promptTemplatesCache: AIPromptTemplate[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

/**
 * Generate content using AI
 */
export async function generateContent(
  description: string,
  contentType: AIContentCategory,
  options: {
    promptTemplate?: string;
    context?: {
      businessFocus?: string;
      tone?: 'professional' | 'friendly' | 'technical' | 'marketing';
      length?: 'short' | 'medium' | 'long';
    };
    userId?: string;
  } = {}
): Promise<AIContentResponse> {
  try {
    // Validate API availability
    if (!GoogleGenerativeAI) {
      throw new Error('Google Generative AI is not available. Please check your installation.');
    }

    // Get API key from environment
    const apiKey = resolveGeminiApiKey();
    if (!apiKey) {
      throw new Error('Gemini API key not configured');
    }

    // Load AI settings for validation
    const settings = await getAISettings();
    if (!settings?.isEnabled) {
      throw new Error('AI content generation is disabled');
    }

    // Validate rate limits
    await validateRateLimits(settings);

    // Create content request record
    const requestId = generateContentRequestId();
    const startTime = Date.now();

    const contentRequest: AIContentRequest = {
      id: requestId,
      description,
      contentType,
      promptTemplate: options.promptTemplate,
      generatedContent: '',
      status: 'generating',
      metadata: {
        model: settings.model,
        tokensUsed: 0,
        generationTime: 0,
        cost: 0
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId: options.userId || 'anonymous'
    };

    // Save initial request
    await saveContentRequest(contentRequest);

    try {
      // Initialize Gemini AI
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: settings.model });

      // Build prompt
      const prompt = await buildContentPrompt(description, contentType, options);

      // Generate content
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const generatedText = response.text();

      // Calculate metrics
      const generationTime = Date.now() - startTime;
      const estimatedTokens = estimateTokenCount(generatedText);
      const cost = calculateTokenCost(estimatedTokens, settings.model);

      // Update request with results
      const completedRequest: AIContentRequest = {
        ...contentRequest,
        generatedContent: generatedText,
        status: 'completed',
        metadata: {
          model: settings.model,
          tokensUsed: estimatedTokens,
          generationTime,
          cost
        },
        updatedAt: new Date().toISOString()
      };

      // Save completed request
      await saveContentRequest(completedRequest);

      // Update usage statistics
      await updateUsageStats(settings.id, estimatedTokens, cost);

      return {
        id: completedRequest.id,
        content: generatedText,
        metadata: completedRequest.metadata
      };

    } catch (generationError) {
      // Update request with error status
      const errorRequest: AIContentRequest = {
        ...contentRequest,
        status: 'error',
        updatedAt: new Date().toISOString()
      };
      await saveContentRequest(errorRequest);

      throw generationError;
    }

  } catch (error) {
    console.error('Error generating AI content:', error);
    throw error;
  }
}

/**
 * Generate image prompt for external image generation services
 */
export async function generateImagePrompt(
  description: string,
  options: {
    imageType?: 'hero' | 'product' | 'thumbnail' | 'social' | 'illustration';
    style?: 'photography' | 'illustration' | 'diagram' | 'infographic';
    dimensions?: string;
    userId?: string;
  } = {}
): Promise<{
  prompt: string;
  negativePrompt?: string;
  suggestions?: string[];
}> {
  try {
    if (!GoogleGenerativeAI) {
      throw new Error('Google Generative AI is not available');
    }

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('Gemini API key not configured');
    }

    // Initialize Gemini AI with vision model for better image prompt generation
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro-vision' });

    const prompt = `Create a detailed, professional image generation prompt for: ${description}

Image type: ${options.imageType || 'general'}
Style: ${options.style || 'photography'}
Dimensions: ${options.dimensions || '16:9'}

Please provide:
1. A detailed prompt optimized for AI image generation
2. A negative prompt (things to avoid)
3. 3-5 suggestions for improving the image

Make the prompt specific, professional, and optimized for timber/wood industry context.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const fullResponse = response.text();

    // Parse the response (simplified parsing)
    const lines = fullResponse.split('\n').filter(line => line.trim());
    const mainPrompt = lines.find(line => !line.startsWith('-') && !line.match(/^\d+\./)) || description;
    const negativePrompt = lines.find(line => line.toLowerCase().includes('avoid') || line.toLowerCase().includes('negative')) || 'blurry, low quality, watermark';
    const suggestions = lines.filter(line => line.startsWith('-') || line.match(/^\d+\./)).slice(0, 5);

    return {
      prompt: mainPrompt,
      negativePrompt,
      suggestions
    };

  } catch (error) {
    console.error('Error generating image prompt:', error);
    throw error;
  }
}

/**
 * Get AI settings
 */
export async function getAISettings() {
  try {
    // For now, return default settings since we don't have a settings service yet
    // This will be updated when AISettingsService is implemented
    return {
      id: 'default',
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
  } catch (error) {
    console.error('Error loading AI settings:', error);
    return null;
  }
}

/**
 * Get content generation history for user
 */
export async function getContentHistory(
  userId: string,
  options: {
    contentType?: AIContentCategory;
    limit?: number;
    startDate?: string;
  } = {}
): Promise<{
  requests: AIContentRequest[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}> {
  try {
    const requests = await loadCollection<AIContentRequest>(CONTENT_REQUESTS_COLLECTION);

    // Filter by user
    let filteredRequests = requests.filter(req => req.userId === userId);

    // Filter by content type
    if (options.contentType) {
      filteredRequests = filteredRequests.filter(req => req.contentType === options.contentType);
    }

    // Filter by date
    if (options.startDate) {
      const startDate = new Date(options.startDate);
      filteredRequests = filteredRequests.filter(req =>
        new Date(req.createdAt) >= startDate
      );
    }

    // Sort by creation date (newest first)
    filteredRequests.sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    // Paginate
    const limit = options.limit || 20;
    const total = filteredRequests.length;
    const pages = Math.ceil(total / limit);
    const paginatedRequests = filteredRequests.slice(0, limit);

    return {
      requests: paginatedRequests,
      pagination: {
        page: 1,
        limit,
        total,
        pages
      }
    };

  } catch (error) {
    console.error('Error loading content history:', error);
    return {
      requests: [],
      pagination: {
        page: 1,
        limit: options.limit || 20,
        total: 0,
        pages: 0
      }
    };
  }
}

/**
 * Get available prompt templates
 */
export async function getPromptTemplates(category?: AIContentCategory): Promise<AIPromptTemplate[]> {
  try {
    // Check cache first
    const now = Date.now();
    if (promptTemplatesCache && (now - cacheTimestamp) < CACHE_DURATION) {
      return category
        ? promptTemplatesCache.filter(template => template.category === category)
        : promptTemplatesCache;
    }

    // Load from storage
    let templates = await loadCollection<AIPromptTemplate>(PROMPT_TEMPLATES_COLLECTION);

    // If no templates exist, initialize with defaults
    if (templates.length === 0) {
      templates = getDefaultPromptTemplates();
      await saveCollection(PROMPT_TEMPLATES_COLLECTION, templates);
    }

    // Cache the results
    promptTemplatesCache = templates;
    cacheTimestamp = now;

    return category
      ? templates.filter(template => template.category === category)
      : templates;

  } catch (error) {
    console.error('Error loading prompt templates:', error);
    return getDefaultPromptTemplates().filter(template =>
      category ? template.category === category : true
    );
  }
}

/**
 * Create custom prompt template
 */
export async function createPromptTemplate(template: Omit<AIPromptTemplate, 'id' | 'usageCount'>): Promise<AIPromptTemplate> {
  try {
    const templates = await loadCollection<AIPromptTemplate>(PROMPT_TEMPLATES_COLLECTION);

    // Check for duplicate names
    const nameExists = templates.some(t => t.name === template.name);
    if (nameExists) {
      throw new Error(`Template with name "${template.name}" already exists`);
    }

    const newTemplate: AIPromptTemplate = {
      ...template,
      id: generatePromptTemplateId(),
      usageCount: 0
    };

    const updatedTemplates = [...templates, newTemplate];
    await saveCollection(PROMPT_TEMPLATES_COLLECTION, updatedTemplates);

    // Invalidate cache
    promptTemplatesCache = null;

    return newTemplate;

  } catch (error) {
    console.error('Error creating prompt template:', error);
    throw error;
  }
}

// Private helper functions

function generateContentRequestId(): string {
  return `ai_req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function generatePromptTemplateId(): string {
  return `ai_template_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

async function buildContentPrompt(
  description: string,
  contentType: AIContentCategory,
  options: any
): Promise<string> {
  let prompt = '';

  // Use custom template if specified
  if (options.promptTemplate) {
    const templates = await getPromptTemplates();
    const template = templates.find(t => t.id === options.promptTemplate);

    if (template) {
      prompt = template.prompt;

      // Replace variables
      if (template.variables.includes('topic') && options.context?.businessFocus) {
        prompt = prompt.replace(/\{topic\}/g, description);
      }
      if (template.variables.includes('location') && options.context?.businessFocus) {
        prompt = prompt.replace(/\{location\}/g, 'Bangalore, Karnataka, India');
      }
    }
  }

  // Default prompt structure if no template
  if (!prompt) {
    const tone = options.context?.tone || 'professional';
    const length = options.context?.length || 'medium';
    const businessContext = options.context?.businessFocus || 'timber and wood products business';

    prompt = `Write a ${length} ${contentType} piece about: ${description}

Context: This is for a ${businessContext} based in Bangalore, Karnataka, India.
Tone: ${tone}
Style: Professional, informative, and engaging for the timber industry audience.

Please ensure the content is accurate, well-structured, and optimized for the specified purpose.`;
  }

  return prompt;
}

async function validateRateLimits(settings: any): Promise<void> {
  // Simplified rate limiting - in production, this would use Redis or similar
  const now = new Date();
  const oneMinuteAgo = new Date(now.getTime() - 60 * 1000);
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  const requests = await loadCollection<AIContentRequest>(CONTENT_REQUESTS_COLLECTION);

  const requestsLastMinute = requests.filter(req =>
    new Date(req.createdAt) >= oneMinuteAgo
  ).length;

  const requestsLastHour = requests.filter(req =>
    new Date(req.createdAt) >= oneHourAgo
  ).length;

  const requestsLastDay = requests.filter(req =>
    new Date(req.createdAt) >= oneDayAgo
  ).length;

  if (requestsLastMinute >= settings.rateLimits.requestsPerMinute) {
    throw new Error('Rate limit exceeded: too many requests per minute');
  }

  if (requestsLastHour >= settings.rateLimits.requestsPerHour) {
    throw new Error('Rate limit exceeded: too many requests per hour');
  }

  if (requestsLastDay >= settings.rateLimits.requestsPerDay) {
    throw new Error('Rate limit exceeded: too many requests per day');
  }
}

function estimateTokenCount(text: string): number {
  // Rough estimation: 1 token ≈ 4 characters for English text
  return Math.ceil(text.length / 4);
}

async function saveContentRequest(request: AIContentRequest): Promise<void> {
  try {
    const requests = await loadCollection<AIContentRequest>(CONTENT_REQUESTS_COLLECTION);
    const existingIndex = requests.findIndex(req => req.id === request.id);

    if (existingIndex >= 0) {
      requests[existingIndex] = request;
    } else {
      requests.push(request);
    }

    await saveCollection(CONTENT_REQUESTS_COLLECTION, requests);
  } catch (error) {
    console.error('Error saving content request:', error);
    throw error;
  }
}

async function updateUsageStats(settingsId: string, tokensUsed: number, cost: number): Promise<void> {
  // This would update the AI settings usage statistics
  // For now, we'll skip this as the settings service isn't implemented yet
  console.log(`Usage update: ${tokensUsed} tokens, $${cost.toFixed(4)}`);
}

function resolveGeminiApiKey(): string | undefined {
  const importMetaEnv = (typeof import.meta !== "undefined" && (import.meta as any).env) || {};
  if (importMetaEnv?.VITE_GEMINI_API_KEY) {
    return importMetaEnv.VITE_GEMINI_API_KEY as string;
  }

  if (typeof process !== "undefined" && process.env?.VITE_GEMINI_API_KEY) {
    return process.env.VITE_GEMINI_API_KEY;
  }

  if (typeof globalThis !== "undefined" && (globalThis as any).__TEST_GEMINI_API_KEY) {
    return (globalThis as any).__TEST_GEMINI_API_KEY;
  }

  return undefined;
}
