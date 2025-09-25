/**
 * Blog API Endpoints
 * Client-side API handlers for blog functionality
 */

import { getBlogPosts, getBlogPostById, getBlogPostBySlug, createBlogPost, updateBlogPost, deleteBlogPost, publishBlogPost, unpublishBlogPost, getBlogCategories, getBlogAnalytics } from '@/services/blog';

/**
 * GET /api/blog/posts
 */
export async function handleGetBlogPosts(request: Request): Promise<Response> {
  try {
    const url = new URL(request.url);

    // Parse query parameters
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = Math.min(parseInt(url.searchParams.get('limit') || '10'), 50); // Max 50
    const status = url.searchParams.get('status') as any;
    const category = url.searchParams.get('category') || undefined;
    const tag = url.searchParams.get('tag') || undefined;
    const author = url.searchParams.get('author') || undefined;
    const search = url.searchParams.get('search') || undefined;
    const dateFrom = url.searchParams.get('dateFrom') || undefined;
    const dateTo = url.searchParams.get('dateTo') || undefined;
    const sortBy = url.searchParams.get('sortBy') || 'publishedAt';
    const sortOrder = url.searchParams.get('sortOrder') || 'desc';

    const filters = {
      status,
      category,
      tag,
      author,
      dateFrom,
      dateTo,
      search
    };

    const result = await getBlogPosts(filters);

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in GET /api/blog/posts:', error);
    return new Response(JSON.stringify({
      posts: [],
      pagination: { page: 1, limit: 10, total: 0, pages: 0, hasNext: false, hasPrev: false },
      facets: { categories: [], tags: [], authors: [] },
      totalResults: 0,
      searchTime: 0
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

/**
 * POST /api/blog/posts
 */
export async function handleCreateBlogPost(request: Request): Promise<Response> {
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
    const userId = 'current-user-id'; // TODO: Extract from JWT

    const post = await createBlogPost(body, userId);

    return new Response(JSON.stringify(post), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error('Error in POST /api/blog/posts:', error);

    if (error.message.includes('Validation failed')) {
      return new Response(JSON.stringify({
        error: { code: 'VALIDATION_ERROR', message: error.message }
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (error.message.includes('already exists')) {
      return new Response(JSON.stringify({
        error: { code: 'CONFLICT', message: error.message }
      }), {
        status: 409,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({
      error: { code: 'INTERNAL_ERROR', message: 'Failed to create blog post' }
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

/**
 * GET /api/blog/posts/:id
 */
export async function handleGetBlogPost(request: Request, id: string): Promise<Response> {
  try {
    const url = new URL(request.url);
    const incrementView = url.searchParams.get('incrementView') === 'true';

    const post = await getBlogPostById(id, incrementView);

    if (!post) {
      return new Response(JSON.stringify({
        error: { code: 'NOT_FOUND', message: 'Blog post not found' }
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Add related posts and navigation (simplified)
    const enhancedPost = {
      ...post,
      relatedPosts: [], // TODO: Implement related posts logic
      nextPost: null,   // TODO: Implement next post logic
      prevPost: null    // TODO: Implement previous post logic
    };

    return new Response(JSON.stringify(enhancedPost), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in GET /api/blog/posts/:id:', error);
    return new Response(JSON.stringify({
      error: { code: 'INTERNAL_ERROR', message: 'Failed to retrieve blog post' }
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

/**
 * PUT /api/blog/posts/:id
 */
export async function handleUpdateBlogPost(request: Request, id: string): Promise<Response> {
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
    const post = await updateBlogPost(id, body);

    if (!post) {
      return new Response(JSON.stringify({
        error: { code: 'NOT_FOUND', message: 'Blog post not found' }
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify(post), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error('Error in PUT /api/blog/posts/:id:', error);

    if (error.message.includes('Validation failed')) {
      return new Response(JSON.stringify({
        error: { code: 'VALIDATION_ERROR', message: error.message }
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({
      error: { code: 'INTERNAL_ERROR', message: 'Failed to update blog post' }
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

/**
 * DELETE /api/blog/posts/:id
 */
export async function handleDeleteBlogPost(request: Request, id: string): Promise<Response> {
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

    const success = await deleteBlogPost(id);

    if (!success) {
      return new Response(JSON.stringify({
        error: { code: 'NOT_FOUND', message: 'Blog post not found' }
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(null, { status: 204 });

  } catch (error) {
    console.error('Error in DELETE /api/blog/posts/:id:', error);
    return new Response(JSON.stringify({
      error: { code: 'INTERNAL_ERROR', message: 'Failed to delete blog post' }
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

/**
 * POST /api/blog/posts/:id/publish
 */
export async function handlePublishBlogPost(request: Request, id: string): Promise<Response> {
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

    // Parse request body for optional parameters
    const body = await request.json().catch(() => ({}));
    const { publishAt, notifySubscribers, socialShare } = body;

    const post = await publishBlogPost(id, publishAt);

    if (!post) {
      return new Response(JSON.stringify({
        error: { code: 'NOT_FOUND', message: 'Blog post not found' }
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify(post), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in POST /api/blog/posts/:id/publish:', error);
    return new Response(JSON.stringify({
      error: { code: 'INTERNAL_ERROR', message: 'Failed to publish blog post' }
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

/**
 * POST /api/blog/posts/:id/unpublish
 */
export async function handleUnpublishBlogPost(request: Request, id: string): Promise<Response> {
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

    const post = await unpublishBlogPost(id);

    if (!post) {
      return new Response(JSON.stringify({
        error: { code: 'NOT_FOUND', message: 'Blog post not found' }
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify(post), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in POST /api/blog/posts/:id/unpublish:', error);
    return new Response(JSON.stringify({
      error: { code: 'INTERNAL_ERROR', message: 'Failed to unpublish blog post' }
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

/**
 * GET /api/blog/posts/:id/analytics
 */
export async function handleGetBlogAnalytics(request: Request, id: string): Promise<Response> {
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
    const period = (url.searchParams.get('period') || '30d') as any;

    const analytics = await getBlogAnalytics(id, period);

    if (!analytics) {
      return new Response(JSON.stringify({
        error: { code: 'NOT_FOUND', message: 'Blog post analytics not found' }
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify(analytics), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in GET /api/blog/posts/:id/analytics:', error);
    return new Response(JSON.stringify({
      error: { code: 'INTERNAL_ERROR', message: 'Failed to retrieve blog analytics' }
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

/**
 * POST /api/blog/posts/:id/generate-toc
 */
export async function handleGenerateTOC(request: Request, id: string): Promise<Response> {
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

    // Get the post and generate TOC
    const post = await getBlogPostById(id);
    if (!post) {
      return new Response(JSON.stringify({
        error: { code: 'NOT_FOUND', message: 'Blog post not found' }
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // TOC is already generated when post is created/updated
    return new Response(JSON.stringify(post.tableOfContents), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in POST /api/blog/posts/:id/generate-toc:', error);
    return new Response(JSON.stringify({
      error: { code: 'INTERNAL_ERROR', message: 'Failed to generate table of contents' }
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

/**
 * GET /api/blog/categories
 */
export async function handleGetBlogCategories(request: Request): Promise<Response> {
  try {
    const url = new URL(request.url);
    const includeEmpty = url.searchParams.get('includeEmpty') === 'true';
    const includeHidden = url.searchParams.get('includeHidden') === 'true';

    const categories = await getBlogCategories(includeEmpty);

    // Filter hidden categories unless explicitly requested
    const filteredCategories = includeHidden ? categories : categories.filter(cat => cat.isVisible);

    return new Response(JSON.stringify(filteredCategories), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in GET /api/blog/categories:', error);
    return new Response(JSON.stringify([]), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

/**
 * GET /api/blog/tags
 */
export async function handleGetBlogTags(request: Request): Promise<Response> {
  try {
    const url = new URL(request.url);
    const limit = Math.min(parseInt(url.searchParams.get('limit') || '50'), 100);
    const minUsage = parseInt(url.searchParams.get('minUsage') || '1');

    // Get posts and extract tags
    const result = await getBlogPosts({ status: 'published' });
    const tagCounts: Record<string, number> = {};

    result.posts.forEach(post => {
      post.tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });

    // Filter and sort tags
    const tags = Object.entries(tagCounts)
      .filter(([, count]) => count >= minUsage)
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([name, count]) => ({
        name,
        count,
        slug: name.toLowerCase().replace(/\s+/g, '-')
      }));

    return new Response(JSON.stringify(tags), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in GET /api/blog/tags:', error);
    return new Response(JSON.stringify([]), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

/**
 * GET /api/blog/search
 */
export async function handleSearchBlog(request: Request): Promise<Response> {
  try {
    const url = new URL(request.url);
    const query = url.searchParams.get('q');

    if (!query) {
      return new Response(JSON.stringify({
        error: { code: 'VALIDATION_ERROR', message: 'Search query is required' }
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Use existing blog posts endpoint with search filter
    const result = await getBlogPosts({ search: query });

    // Add search-specific metadata
    const searchResult = {
      ...result,
      queryTime: Date.now(), // Simplified
      facets: {
        ...result.facets,
        // Add search facets
      }
    };

    return new Response(JSON.stringify(searchResult), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in GET /api/blog/search:', error);
    return new Response(JSON.stringify({
      results: [],
      pagination: { page: 1, limit: 10, total: 0, pages: 0 },
      facets: {},
      queryTime: 0
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
