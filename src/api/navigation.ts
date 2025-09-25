/**
 * Navigation API Endpoints
 * Client-side API handlers for navigation functionality
 */

import { getNavigationMenus, createNavigationMenu, updateNavigationMenu, deleteNavigationMenu, validateNavigationMenu, getBreadcrumbs } from '@/services/navigation';
import { NavigationMenuType } from '@/types/navigation';

/**
 * GET /api/navigation/menus
 */
export async function handleGetNavigationMenus(request: Request): Promise<Response> {
  try {
    const url = new URL(request.url);
    const type = url.searchParams.get('type') as NavigationMenuType | null;
    const includeInactive = url.searchParams.get('includeInactive') === 'true';

    const menus = await getNavigationMenus(type);

    // Filter inactive menus unless explicitly requested
    const filteredMenus = includeInactive ? menus : menus.filter(menu => menu.isActive);

    return new Response(JSON.stringify(filteredMenus), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in GET /api/navigation/menus:', error);
    return new Response(JSON.stringify({
      error: { code: 'INTERNAL_ERROR', message: 'Failed to retrieve navigation menus' }
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

/**
 * POST /api/navigation/menus
 */
export async function handleCreateNavigationMenu(request: Request): Promise<Response> {
  try {
    // Check authentication (simplified)
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
    const menu = await createNavigationMenu(body);

    return new Response(JSON.stringify(menu), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error('Error in POST /api/navigation/menus:', error);

    if (error.message.includes('Validation failed')) {
      return new Response(JSON.stringify({
        error: { code: 'VALIDATION_ERROR', message: error.message }
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({
      error: { code: 'INTERNAL_ERROR', message: 'Failed to create navigation menu' }
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

/**
 * GET /api/navigation/menus/:id
 */
export async function handleGetNavigationMenu(request: Request, id: string): Promise<Response> {
  try {
    const url = new URL(request.url);
    const includeAnalytics = url.searchParams.get('includeAnalytics') === 'true';

    const menus = await getNavigationMenus();
    const menu = menus.find(m => m.id === id);

    if (!menu) {
      return new Response(JSON.stringify({
        error: { code: 'NOT_FOUND', message: 'Navigation menu not found' }
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Add analytics data if requested (simplified)
    const responseMenu = includeAnalytics ? {
      ...menu,
      analytics: {
        totalClicks: Math.floor(Math.random() * 1000), // Mock data
        itemStats: menu.items.map(item => ({
          itemId: item.id,
          clicks: Math.floor(Math.random() * 100)
        }))
      }
    } : menu;

    return new Response(JSON.stringify(responseMenu), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in GET /api/navigation/menus/:id:', error);
    return new Response(JSON.stringify({
      error: { code: 'INTERNAL_ERROR', message: 'Failed to retrieve navigation menu' }
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

/**
 * PUT /api/navigation/menus/:id
 */
export async function handleUpdateNavigationMenu(request: Request, id: string): Promise<Response> {
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
    const menu = await updateNavigationMenu(id, body);

    if (!menu) {
      return new Response(JSON.stringify({
        error: { code: 'NOT_FOUND', message: 'Navigation menu not found' }
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify(menu), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error('Error in PUT /api/navigation/menus/:id:', error);

    if (error.message.includes('Validation failed')) {
      return new Response(JSON.stringify({
        error: { code: 'VALIDATION_ERROR', message: error.message }
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({
      error: { code: 'INTERNAL_ERROR', message: 'Failed to update navigation menu' }
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

/**
 * DELETE /api/navigation/menus/:id
 */
export async function handleDeleteNavigationMenu(request: Request, id: string): Promise<Response> {
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

    const success = await deleteNavigationMenu(id);

    if (!success) {
      return new Response(JSON.stringify({
        error: { code: 'NOT_FOUND', message: 'Navigation menu not found' }
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(null, { status: 204 });

  } catch (error) {
    console.error('Error in DELETE /api/navigation/menus/:id:', error);
    return new Response(JSON.stringify({
      error: { code: 'INTERNAL_ERROR', message: 'Failed to delete navigation menu' }
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

/**
 * POST /api/navigation/menus/:id/validate
 */
export async function handleValidateNavigationMenu(request: Request, id: string): Promise<Response> {
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

    const menus = await getNavigationMenus();
    const menu = menus.find(m => m.id === id);

    if (!menu) {
      return new Response(JSON.stringify({
        error: { code: 'NOT_FOUND', message: 'Navigation menu not found' }
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const validation = await validateNavigationMenu(menu);

    return new Response(JSON.stringify(validation), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in POST /api/navigation/menus/:id/validate:', error);
    return new Response(JSON.stringify({
      error: { code: 'INTERNAL_ERROR', message: 'Failed to validate navigation menu' }
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

/**
 * GET /api/navigation/menus/:id/preview
 */
export async function handlePreviewNavigationMenu(request: Request, id: string): Promise<Response> {
  try {
    const url = new URL(request.url);
    const theme = url.searchParams.get('theme') || 'light';
    const mobile = url.searchParams.get('mobile') === 'true';

    const menus = await getNavigationMenus();
    const menu = menus.find(m => m.id === id);

    if (!menu) {
      return new Response(JSON.stringify({
        error: { code: 'NOT_FOUND', message: 'Navigation menu not found' }
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Generate HTML preview (simplified)
    const html = generateMenuPreviewHTML(menu, theme, mobile);

    return new Response(html, {
      status: 200,
      headers: { 'Content-Type': 'text/html' }
    });

  } catch (error) {
    console.error('Error in GET /api/navigation/menus/:id/preview:', error);
    return new Response(JSON.stringify({
      error: { code: 'INTERNAL_ERROR', message: 'Failed to generate menu preview' }
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

/**
 * GET /api/navigation/icons
 */
export async function handleGetAvailableIcons(request: Request): Promise<Response> {
  try {
    const url = new URL(request.url);
    const search = url.searchParams.get('search') || undefined;
    const category = url.searchParams.get('category') || undefined;
    const limit = parseInt(url.searchParams.get('limit') || '50');

    // This would call the service method
    // For now, return mock data
    const mockIcons = [
      { name: 'home', category: 'navigation', keywords: ['home', 'house', 'main'] },
      { name: 'package', category: 'ecommerce', keywords: ['product', 'package', 'box'] },
      { name: 'tree-pine', category: 'nature', keywords: ['tree', 'wood', 'nature'] },
      { name: 'user', category: 'user', keywords: ['user', 'person', 'account'] },
      { name: 'settings', category: 'system', keywords: ['settings', 'gear', 'config'] },
    ];

    let filteredIcons = mockIcons;

    if (search) {
      const searchLower = search.toLowerCase();
      filteredIcons = filteredIcons.filter(icon =>
        icon.name.toLowerCase().includes(searchLower) ||
        icon.keywords.some(keyword => keyword.includes(searchLower))
      );
    }

    if (category) {
      filteredIcons = filteredIcons.filter(icon => icon.category === category);
    }

    const limitedIcons = filteredIcons.slice(0, limit);

    return new Response(JSON.stringify({
      icons: limitedIcons,
      total: filteredIcons.length,
      categories: [
        { name: 'navigation', count: 1 },
        { name: 'ecommerce', count: 1 },
        { name: 'nature', count: 1 },
        { name: 'user', count: 1 },
        { name: 'system', count: 1 }
      ]
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in GET /api/navigation/icons:', error);
    return new Response(JSON.stringify({
      error: { code: 'INTERNAL_ERROR', message: 'Failed to retrieve icons' }
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

/**
 * GET /api/navigation/breadcrumbs/:path
 */
export async function handleGetBreadcrumbs(request: Request, path: string): Promise<Response> {
  try {
    const url = new URL(request.url);
    const includeHome = url.searchParams.get('includeHome') !== 'false';
    const includeStructuredData = url.searchParams.get('includeStructuredData') !== 'false';

    const breadcrumbs = await getBreadcrumbs(decodeURIComponent(path));

    return new Response(JSON.stringify(breadcrumbs), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in GET /api/navigation/breadcrumbs/:path:', error);
    return new Response(JSON.stringify({
      breadcrumbs: [],
      structuredData: null
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Helper functions

function generateMenuPreviewHTML(menu: any, theme: string, mobile: boolean): string {
  // Simplified HTML generation for menu preview
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Menu Preview</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .menu-item { margin: 5px 0; padding: 10px; border: 1px solid #ccc; }
        .mobile { max-width: 375px; }
      </style>
    </head>
    <body class="${mobile ? 'mobile' : ''}">
      <h2>${menu.displayName || menu.name} Preview</h2>
      <div class="menu">
        ${menu.items.map((item: any) => `
          <div class="menu-item">
            ${item.icon ? `<span>${item.icon}</span> ` : ''}
            <span>${item.label}</span>
            ${item.children ? ` (${item.children.length} sub-items)` : ''}
          </div>
        `).join('')}
      </div>
    </body>
    </html>
  `;
}
