/**
 * Legal API Endpoints
 * Client-side API handlers for legal content management
 */

import { generateLegalPage, getLegalPage, getAllLegalPages, updateLegalPage, checkLegalReviewStatus, exportLegalPages } from '@/services/legal';

/**
 * POST /api/legal/generate
 */
export async function handleGenerateLegalPage(request: Request): Promise<Response> {
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
    const userId = 'current-user-id'; // TODO: Extract from JWT

    const legalPage = await generateLegalPage(body, userId);

    return new Response(JSON.stringify(legalPage), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error('Error in POST /api/legal/generate:', error);

    if (error.message.includes('already exists')) {
      return new Response(JSON.stringify({
        error: { code: 'CONFLICT', message: error.message }
      }), {
        status: 409,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (error.message.includes('not available')) {
      return new Response(JSON.stringify({
        error: { code: 'SERVICE_UNAVAILABLE', message: 'AI service is not available' }
      }), {
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({
      error: { code: 'INTERNAL_ERROR', message: 'Failed to generate legal page' }
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

/**
 * GET /api/legal/pages/:type
 */
export async function handleGetLegalPage(request: Request, type: string): Promise<Response> {
  try {
    const legalPage = await getLegalPage(type as any);

    if (!legalPage) {
      return new Response(JSON.stringify({
        error: { code: 'NOT_FOUND', message: 'Legal page not found' }
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify(legalPage), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in GET /api/legal/pages/:type:', error);
    return new Response(JSON.stringify({
      error: { code: 'INTERNAL_ERROR', message: 'Failed to retrieve legal page' }
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

/**
 * GET /api/legal/pages
 */
export async function handleGetAllLegalPages(request: Request): Promise<Response> {
  try {
    const pages = await getAllLegalPages();

    return new Response(JSON.stringify(pages), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in GET /api/legal/pages:', error);
    return new Response(JSON.stringify([]), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

/**
 * PUT /api/legal/pages/:id
 */
export async function handleUpdateLegalPage(request: Request, id: string): Promise<Response> {
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
    const legalPage = await updateLegalPage(id, body);

    if (!legalPage) {
      return new Response(JSON.stringify({
        error: { code: 'NOT_FOUND', message: 'Legal page not found' }
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify(legalPage), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error('Error in PUT /api/legal/pages/:id:', error);

    if (error.message.includes('Validation failed')) {
      return new Response(JSON.stringify({
        error: { code: 'VALIDATION_ERROR', message: error.message }
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({
      error: { code: 'INTERNAL_ERROR', message: 'Failed to update legal page' }
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

/**
 * GET /api/legal/review-status
 */
export async function handleCheckLegalReviewStatus(request: Request): Promise<Response> {
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

    const status = await checkLegalReviewStatus();

    return new Response(JSON.stringify(status), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in GET /api/legal/review-status:', error);
    return new Response(JSON.stringify({
      needsReview: [],
      upToDate: [],
      overdue: []
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

/**
 * GET /api/legal/export
 */
export async function handleExportLegalPages(request: Request): Promise<Response> {
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

    const exportData = await exportLegalPages();

    return new Response(JSON.stringify(exportData), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': 'attachment; filename="legal-pages-export.json"'
      }
    });

  } catch (error) {
    console.error('Error in GET /api/legal/export:', error);
    return new Response(JSON.stringify({
      error: { code: 'INTERNAL_ERROR', message: 'Failed to export legal pages' }
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
