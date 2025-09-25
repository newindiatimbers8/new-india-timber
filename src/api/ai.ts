/**
 * AI API Endpoints
 * Client-side API handlers for AI functionality
 */

import { generateContent, generateImagePrompt, getAISettings, updateAISettings, getContentHistory, getPromptTemplates, createPromptTemplate } from '@/services/ai-content';
import { getAISettings as getSettingsService, updateUsageStatistics, validateApiKey, getRateLimitStatus } from '@/services/ai-settings';

/**
 * GET /api/ai/settings
 */
export async function handleGetAISettings(request: Request): Promise<Response> {
  try {
    // Check authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({
        error: { code: 'UNAUTHORIZED', message: 'Authentication required' }
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // TODO: Validate admin token
    const settings = await getSettingsService();

    if (!settings) {
      return new Response(JSON.stringify({
        error: { code: 'NOT_FOUND', message: 'AI settings not found' }
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify(settings), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in GET /api/ai/settings:', error);
    return new Response(JSON.stringify({
      error: { code: 'INTERNAL_ERROR', message: 'Failed to retrieve AI settings' }
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

/**
 * PUT /api/ai/settings
 */
export async function handleUpdateAISettings(request: Request): Promise<Response> {
  try {
    // Check authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({
        error: { code: 'UNAUTHORIZED', message: 'Authentication required' }
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // TODO: Validate admin token

    // Parse request body
    const body = await request.json();
    const settings = await updateAISettings(body);

    if (!settings) {
      return new Response(JSON.stringify({
        error: { code: 'NOT_FOUND', message: 'AI settings not found' }
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify(settings), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error('Error in PUT /api/ai/settings:', error);

    if (error.message.includes('Validation failed')) {
      return new Response(JSON.stringify({
        error: { code: 'VALIDATION_ERROR', message: error.message }
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({
      error: { code: 'INTERNAL_ERROR', message: 'Failed to update AI settings' }
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

/**
 * POST /api/ai/generate/content
 */
export async function handleGenerateContent(request: Request): Promise<Response> {
  try {
    // Check authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({
        error: { code: 'UNAUTHORIZED', message: 'Authentication required' }
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // TODO: Validate editor/admin token

    // Parse request body
    const body = await request.json();
    const { description, contentType, promptTemplate, context } = body;

    if (!description || !contentType) {
      return new Response(JSON.stringify({
        error: { code: 'VALIDATION_ERROR', message: 'Description and contentType are required' }
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Extract user ID from token (simplified)
    const userId = 'current-user-id'; // TODO: Extract from JWT

    const result = await generateContent(description, contentType, {
      promptTemplate,
      context,
      userId
    });

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error('Error in POST /api/ai/generate/content:', error);

    if (error.message.includes('not available')) {
      return new Response(JSON.stringify({
        error: { code: 'SERVICE_UNAVAILABLE', message: 'AI service is not available' }
      }), {
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (error.message.includes('Rate limit')) {
      return new Response(JSON.stringify({
        error: { code: 'RATE_LIMIT_EXCEEDED', message: error.message }
      }), {
        status: 429,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({
      error: { code: 'INTERNAL_ERROR', message: 'Failed to generate content' }
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

/**
 * POST /api/ai/generate/image-prompt
 */
export async function handleGenerateImagePrompt(request: Request): Promise<Response> {
  try {
    // Check authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({
        error: { code: 'UNAUTHORIZED', message: 'Authentication required' }
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Parse request body
    const body = await request.json();
    const { description, imageType, style, dimensions } = body;

    if (!description) {
      return new Response(JSON.stringify({
        error: { code: 'VALIDATION_ERROR', message: 'Description is required' }
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const userId = 'current-user-id'; // TODO: Extract from JWT

    const result = await generateImagePrompt(description, {
      imageType,
      style,
      dimensions,
      userId
    });

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error('Error in POST /api/ai/generate/image-prompt:', error);

    return new Response(JSON.stringify({
      error: { code: 'INTERNAL_ERROR', message: 'Failed to generate image prompt' }
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

/**
 * GET /api/ai/content/history
 */
export async function handleGetContentHistory(request: Request): Promise<Response> {
  try {
    // Check authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({
        error: { code: 'UNAUTHORIZED', message: 'Authentication required' }
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const contentType = url.searchParams.get('contentType') as any;
    const startDate = url.searchParams.get('startDate') || undefined;

    const userId = 'current-user-id'; // TODO: Extract from JWT

    const history = await getContentHistory(userId, {
      contentType,
      limit,
      startDate
    });

    return new Response(JSON.stringify(history), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in GET /api/ai/content/history:', error);
    return new Response(JSON.stringify({
      requests: [],
      pagination: { page: 1, limit: 20, total: 0, pages: 0 }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

/**
 * GET /api/ai/prompts
 */
export async function handleGetPromptTemplates(request: Request): Promise<Response> {
  try {
    // Check authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({
        error: { code: 'UNAUTHORIZED', message: 'Authentication required' }
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const url = new URL(request.url);
    const category = url.searchParams.get('category') as any;

    const templates = await getPromptTemplates(category);

    return new Response(JSON.stringify(templates), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in GET /api/ai/prompts:', error);
    return new Response(JSON.stringify([]), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

/**
 * POST /api/ai/prompts
 */
export async function handleCreatePromptTemplate(request: Request): Promise<Response> {
  try {
    // Check authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({
        error: { code: 'UNAUTHORIZED', message: 'Authentication required' }
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // TODO: Validate admin token

    // Parse request body
    const body = await request.json();
    const template = await createPromptTemplate(body);

    return new Response(JSON.stringify(template), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error('Error in POST /api/ai/prompts:', error);

    if (error.message.includes('already exists')) {
      return new Response(JSON.stringify({
        error: { code: 'CONFLICT', message: error.message }
      }), {
        status: 409,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({
      error: { code: 'INTERNAL_ERROR', message: 'Failed to create prompt template' }
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

/**
 * GET /api/ai/validate-key
 */
export async function handleValidateApiKey(request: Request): Promise<Response> {
  try {
    // Check authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({
        error: { code: 'UNAUTHORIZED', message: 'Authentication required' }
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const validation = await validateApiKey();

    return new Response(JSON.stringify(validation), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in GET /api/ai/validate-key:', error);
    return new Response(JSON.stringify({
      isValid: false,
      message: 'Error validating API key'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

/**
 * GET /api/ai/rate-limits
 */
export async function handleGetRateLimits(request: Request): Promise<Response> {
  try {
    // Check authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({
        error: { code: 'UNAUTHORIZED', message: 'Authentication required' }
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const rateLimits = await getRateLimitStatus();

    if (!rateLimits) {
      return new Response(JSON.stringify({
        error: { code: 'NOT_FOUND', message: 'Rate limit information not available' }
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify(rateLimits), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in GET /api/ai/rate-limits:', error);
    return new Response(JSON.stringify({
      error: { code: 'INTERNAL_ERROR', message: 'Failed to retrieve rate limits' }
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
