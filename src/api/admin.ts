/**
 * Admin Dashboard API Endpoints
 * Client-side API handlers for admin dashboard functionality
 */

import { getBlogPosts, getBlogAnalytics } from '@/services/blog';
import { getAISettings, getUsageStatistics } from '@/services/ai-settings';
import { getAllLegalPages } from '@/services/legal';
import { getMediaAssets, getStorageUsageStats } from '@/services/media';

/**
 * GET /api/admin/dashboard
 */
export async function handleGetAdminDashboard(request: Request): Promise<Response> {
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

    // Gather dashboard data in parallel
    const [
      blogStats,
      aiStats,
      legalStats,
      mediaStats,
      recentPosts,
      aiSettings
    ] = await Promise.all([
      getBlogDashboardStats(),
      getAIDashboardStats(),
      getLegalDashboardStats(),
      getMediaDashboardStats(),
      getRecentBlogPosts(),
      getAISettings()
    ]);

    const dashboard = {
      success: true,
      data: {
        products: {
          total: 0, // TODO: Implement product stats
          active: 0,
          outOfStock: 0
        },
        orders: {
          total: 0, // TODO: Implement order stats
          pending: 0,
          completed: 0,
          recent: []
        },
        aiUsage: {
          totalRequests: aiStats.totalRequests,
          monthlySpend: aiStats.monthlySpend,
          lastUsed: aiStats.lastUsed
        },
        blog: {
          totalPosts: blogStats.totalPosts,
          published: blogStats.publishedPosts,
          draft: blogStats.draftPosts
        },
        seo: {
          pagesOptimized: 0, // TODO: Implement SEO stats
          keywordsTracked: 0,
          lastAudit: new Date().toISOString()
        }
      },
      timestamp: new Date().toISOString()
    };

    return new Response(JSON.stringify(dashboard), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in GET /api/admin/dashboard:', error);
    return new Response(JSON.stringify({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to load dashboard data' }
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

/**
 * GET /api/admin/stats/overview
 */
export async function handleGetAdminStatsOverview(request: Request): Promise<Response> {
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
    const period = url.searchParams.get('period') || '30d';

    // Get comprehensive stats
    const [
      blogStats,
      aiStats,
      mediaStats,
      contentStats
    ] = await Promise.all([
      getBlogStatsForPeriod(period),
      getAIStatsForPeriod(period),
      getMediaStatsForPeriod(period),
      getContentStatsForPeriod(period)
    ]);

    const overview = {
      period,
      blog: blogStats,
      ai: aiStats,
      media: mediaStats,
      content: contentStats,
      generatedAt: new Date().toISOString()
    };

    return new Response(JSON.stringify(overview), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in GET /api/admin/stats/overview:', error);
    return new Response(JSON.stringify({
      error: { code: 'INTERNAL_ERROR', message: 'Failed to load admin statistics' }
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

/**
 * GET /api/admin/activity
 */
export async function handleGetAdminActivity(request: Request): Promise<Response> {
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
    const limit = Math.min(parseInt(url.searchParams.get('limit') || '50'), 200);

    // Mock activity data (in production, this would come from audit logs)
    const activities = generateMockActivities(limit);

    return new Response(JSON.stringify({
      activities,
      total: activities.length,
      generatedAt: new Date().toISOString()
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in GET /api/admin/activity:', error);
    return new Response(JSON.stringify({
      activities: [],
      total: 0
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

/**
 * POST /api/admin/cache/clear
 */
export async function handleClearAdminCache(request: Request): Promise<Response> {
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

    // In a real implementation, this would clear various caches
    console.log('Clearing admin caches...');

    return new Response(JSON.stringify({
      success: true,
      message: 'Cache cleared successfully',
      timestamp: new Date().toISOString()
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in POST /api/admin/cache/clear:', error);
    return new Response(JSON.stringify({
      error: { code: 'INTERNAL_ERROR', message: 'Failed to clear cache' }
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Helper functions for gathering dashboard data

async function getBlogDashboardStats() {
  try {
    const result = await getBlogPosts({});
    const posts = result.posts;

    return {
      totalPosts: result.totalResults,
      publishedPosts: posts.filter(p => p.status === 'published').length,
      draftPosts: posts.filter(p => p.status === 'draft').length,
      totalViews: posts.reduce((sum, p) => sum + p.viewCount, 0),
      recentPosts: posts.slice(0, 5).map(p => ({
        id: p.id,
        title: p.title,
        publishedAt: p.publishedAt,
        views: p.viewCount
      }))
    };
  } catch (error) {
    console.error('Error getting blog dashboard stats:', error);
    return {
      totalPosts: 0,
      publishedPosts: 0,
      draftPosts: 0,
      totalViews: 0,
      recentPosts: []
    };
  }
}

async function getAIDashboardStats() {
  try {
    const usage = await getUsageStatistics();
    const settings = await getAISettings();

    return {
      isEnabled: settings?.isEnabled ?? false,
      totalRequests: usage?.totalRequests ?? 0,
      totalTokens: usage?.totalTokens ?? 0,
      monthlySpend: usage?.monthlySpend ?? 0,
      lastUsed: usage?.lastUsed ?? null,
      averageCostPerToken: usage?.averageCostPerToken ?? 0
    };
  } catch (error) {
    console.error('Error getting AI dashboard stats:', error);
    return {
      isEnabled: false,
      totalRequests: 0,
      totalTokens: 0,
      monthlySpend: 0,
      lastUsed: null,
      averageCostPerToken: 0
    };
  }
}

async function getLegalDashboardStats() {
  try {
    const pages = await getAllLegalPages();

    return {
      totalPages: pages.length,
      aiGenerated: pages.filter(p => p.aiGenerated).length,
      legallyReviewed: pages.filter(p => p.legalReviewed).length,
      pendingReview: pages.filter(p => p.aiGenerated && !p.legalReviewed).length,
      pages: pages.map(p => ({
        type: p.type,
        title: p.title,
        reviewed: p.legalReviewed,
        updatedAt: p.updatedAt
      }))
    };
  } catch (error) {
    console.error('Error getting legal dashboard stats:', error);
    return {
      totalPages: 0,
      aiGenerated: 0,
      legallyReviewed: 0,
      pendingReview: 0,
      pages: []
    };
  }
}

async function getMediaDashboardStats() {
  try {
    const stats = await getStorageUsageStats();
    const assets = await getMediaAssets({ limit: 1000 });

    return {
      totalAssets: stats.totalAssets,
      totalSize: stats.totalSize,
      optimizedAssets: assets.filter(a => a.optimized).length,
      optimizationRate: stats.optimizedPercentage,
      byType: stats.byType,
      byCategory: stats.byCategory,
      recentUploads: assets.slice(0, 10).map(a => ({
        id: a.id,
        filename: a.filename,
        type: a.type,
        size: a.size,
        uploadedAt: a.createdAt
      }))
    };
  } catch (error) {
    console.error('Error getting media dashboard stats:', error);
    return {
      totalAssets: 0,
      totalSize: 0,
      optimizedAssets: 0,
      optimizationRate: 0,
      byType: {},
      byCategory: {},
      recentUploads: []
    };
  }
}

async function getRecentBlogPosts() {
  try {
    const result = await getBlogPosts({ limit: 5 });
    return result.posts.map(post => ({
      id: post.id,
      title: post.title,
      status: post.status,
      publishedAt: post.publishedAt,
      views: post.viewCount
    }));
  } catch (error) {
    console.error('Error getting recent blog posts:', error);
    return [];
  }
}

async function getBlogStatsForPeriod(period: string) {
  // Simplified - in production, this would calculate stats for the specific period
  const result = await getBlogPosts({});

  return {
    totalPosts: result.totalResults,
    publishedThisPeriod: result.posts.filter(p => p.status === 'published').length,
    viewsThisPeriod: result.posts.reduce((sum, p) => sum + p.viewCount, 0),
    topPosts: result.posts
      .sort((a, b) => b.viewCount - a.viewCount)
      .slice(0, 5)
      .map(p => ({ id: p.id, title: p.title, views: p.viewCount }))
  };
}

async function getAIStatsForPeriod(period: string) {
  const usage = await getUsageStatistics();

  return {
    requestsThisPeriod: usage?.totalRequests ?? 0,
    tokensUsedThisPeriod: usage?.totalTokens ?? 0,
    spendThisPeriod: usage?.monthlySpend ?? 0,
    costPerToken: usage?.averageCostPerToken ?? 0
  };
}

async function getMediaStatsForPeriod(period: string) {
  const stats = await getStorageUsageStats();

  return {
    uploadsThisPeriod: stats.totalAssets,
    storageUsed: stats.totalSize,
    optimizationRate: stats.optimizedPercentage,
    topCategories: Object.entries(stats.byCategory)
      .sort(([, a], [, b]) => b.count - a.count)
      .slice(0, 5)
      .map(([category, data]) => ({ category, ...data }))
  };
}

async function getContentStatsForPeriod(period: string) {
  const [blogResult, legalPages] = await Promise.all([
    getBlogPosts({}),
    getAllLegalPages()
  ]);

  return {
    totalContentItems: blogResult.totalResults + legalPages.length,
    blogPosts: blogResult.totalResults,
    legalPages: legalPages.length,
    aiGeneratedContent: legalPages.filter(p => p.aiGenerated).length,
    seoOptimizedPages: blogResult.posts.filter(p => p.seo && p.seo.keywords.length > 0).length
  };
}

function generateMockActivities(count: number) {
  const activities = [];
  const types = ['blog_post_published', 'ai_content_generated', 'legal_page_updated', 'media_uploaded', 'user_login'];
  const descriptions = {
    blog_post_published: 'Published blog post',
    ai_content_generated: 'Generated AI content',
    legal_page_updated: 'Updated legal page',
    media_uploaded: 'Uploaded media file',
    user_login: 'Admin user logged in'
  };

  for (let i = 0; i < count; i++) {
    const type = types[Math.floor(Math.random() * types.length)];
    const timestamp = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000); // Last 30 days

    activities.push({
      id: `activity_${i + 1}`,
      type,
      description: descriptions[type as keyof typeof descriptions],
      userId: 'admin-user',
      userName: 'System Administrator',
      timestamp: timestamp.toISOString(),
      metadata: {
        // Add relevant metadata based on type
      }
    });
  }

  return activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}
