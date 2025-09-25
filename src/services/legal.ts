/**
 * Legal Content Management Service
 * Handles legal pages, compliance, and AI-generated content
 */

import {
  LegalPage,
  LegalPageSummary,
  CreateLegalPageRequest,
  UpdateLegalPageRequest,
  LegalPageType,
  getDefaultLegalPage,
  generateLegalPrompt,
  incrementVersion,
  validateLegalPage,
} from '@/types/legal';
import { loadCollection, saveCollection } from '@/utils/dataLoader';
import { generateContent } from './ai-content';

const LEGAL_PAGES_COLLECTION = 'legal-pages';

// In-memory cache
let legalPagesCache: LegalPage[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

/**
 * Generate legal page content using AI
 */
export async function generateLegalPage(
  request: CreateLegalPageRequest,
  userId: string
): Promise<LegalPage> {
  try {
    // Check if page already exists
    const existingPages = await loadLegalPages();
    const existingPage = existingPages.find(page =>
      page.type === request.type &&
      (!request.jurisdiction || page.jurisdiction === request.jurisdiction)
    );

    if (existingPage) {
      throw new Error(`${request.type} page already exists for this jurisdiction`);
    }

    // Generate content using AI if requested
    let content = '';
    if (request.aiGenerate !== false) { // Default to true
      const prompt = generateLegalPrompt(request.type, request);

      try {
        const aiResponse = await generateContent(prompt, 'legal', {
          context: {
            businessFocus: request.businessName || 'general business',
            tone: 'professional'
          },
          userId
        });

        content = aiResponse.content;
      } catch (aiError) {
        console.warn('AI content generation failed, using template:', aiError);
        content = getDefaultLegalContent(request.type);
      }
    } else {
      content = getDefaultLegalContent(request.type);
    }

    // Create legal page
    const defaultPage = getDefaultLegalPage(request.type);
    const now = new Date().toISOString();

    const newPage: LegalPage = {
      ...defaultPage,
      content,
      jurisdiction: request.jurisdiction || defaultPage.jurisdiction,
      aiGenerated: request.aiGenerate !== false,
      originalPrompt: request.aiGenerate !== false ? generateLegalPrompt(request.type, request) : undefined,
      applicableLaws: getApplicableLaws(request.type, request.jurisdiction),
      seo: {
        ...defaultPage.seo,
        metaTitle: request.businessName
          ? `${defaultPage.title} - ${request.businessName}`
          : defaultPage.seo.metaTitle
      },
      createdAt: now,
      updatedAt: now
    };

    // Validate the created page
    const errors = validateLegalPage(newPage);
    if (errors.length > 0) {
      throw new Error(`Generated page validation failed: ${errors.join(', ')}`);
    }

    // Save to storage
    const updatedPages = [...existingPages, newPage];
    await saveCollection(LEGAL_PAGES_COLLECTION, updatedPages);

    // Invalidate cache
    legalPagesCache = null;

    return newPage;

  } catch (error) {
    console.error('Error generating legal page:', error);
    throw error;
  }
}

/**
 * Get legal page by type
 */
export async function getLegalPage(type: LegalPageType): Promise<LegalPage | null> {
  try {
    const pages = await loadLegalPages();
    return pages.find(page => page.type === type) || null;
  } catch (error) {
    console.error('Error getting legal page:', error);
    return null;
  }
}

/**
 * Get all legal pages
 */
export async function getAllLegalPages(): Promise<LegalPageSummary[]> {
  try {
    const pages = await loadLegalPages();
    return pages.map(page => ({
      id: page.id,
      type: page.type,
      title: page.title,
      slug: page.slug,
      version: page.version,
      effectiveDate: page.effectiveDate,
      lastReviewDate: page.lastReviewDate,
      aiGenerated: page.aiGenerated,
      legalReviewed: page.legalReviewed,
      jurisdiction: page.jurisdiction,
      updatedAt: page.updatedAt
    }));
  } catch (error) {
    console.error('Error getting legal pages:', error);
    return [];
  }
}

/**
 * Update legal page
 */
export async function updateLegalPage(id: string, updates: UpdateLegalPageRequest): Promise<LegalPage | null> {
  try {
    const pages = await loadLegalPages();
    const pageIndex = pages.findIndex(page => page.id === id);

    if (pageIndex === -1) return null;

    const existingPage = pages[pageIndex];

    // Handle version increment
    let newVersion = existingPage.version;
    if (updates.effectiveDate || updates.content || updates.changeReason) {
      newVersion = incrementVersion(existingPage.version);
    }

    const updatedPage: LegalPage = {
      ...existingPage,
      ...updates,
      version: updates.version || newVersion,
      updatedAt: new Date().toISOString()
    };

    // Validate updates
    const errors = validateLegalPage(updatedPage);
    if (errors.length > 0) {
      throw new Error(`Validation failed: ${errors.join(', ')}`);
    }

    pages[pageIndex] = updatedPage;
    await saveCollection(LEGAL_PAGES_COLLECTION, pages);

    // Invalidate cache
    legalPagesCache = null;

    return updatedPage;

  } catch (error) {
    console.error('Error updating legal page:', error);
    throw error;
  }
}

/**
 * Check if legal page needs review
 */
export async function checkLegalReviewStatus(): Promise<{
  needsReview: LegalPage[];
  upToDate: LegalPage[];
  overdue: LegalPage[];
}> {
  try {
    const pages = await loadLegalPages();
    const now = new Date();

    const needsReview: LegalPage[] = [];
    const upToDate: LegalPage[] = [];
    const overdue: LegalPage[] = [];

    pages.forEach(page => {
      const reviewDate = new Date(page.lastReviewDate);
      const nextReviewDate = new Date(reviewDate);
      nextReviewDate.setFullYear(nextReviewDate.getFullYear() + 1);

      if (now > nextReviewDate) {
        overdue.push(page);
      } else if (page.aiGenerated && !page.legalReviewed) {
        needsReview.push(page);
      } else {
        upToDate.push(page);
      }
    });

    return { needsReview, upToDate, overdue };

  } catch (error) {
    console.error('Error checking legal review status:', error);
    return { needsReview: [], upToDate: [], overdue: [] };
  }
}

/**
 * Get legal page URL
 */
// Provided via types/legal utilities; keep compatibility exports elsewhere if needed.

/**
 * Export legal pages for compliance audit
 */
export async function exportLegalPages(): Promise<{
  pages: LegalPage[];
  exportDate: string;
  complianceSummary: {
    totalPages: number;
    aiGenerated: number;
    legallyReviewed: number;
    jurisdictions: string[];
  };
}> {
  try {
    const pages = await loadLegalPages();
    const exportDate = new Date().toISOString();

    const complianceSummary = {
      totalPages: pages.length,
      aiGenerated: pages.filter(p => p.aiGenerated).length,
      legallyReviewed: pages.filter(p => p.legalReviewed).length,
      jurisdictions: [...new Set(pages.map(p => p.jurisdiction))]
    };

    return {
      pages,
      exportDate,
      complianceSummary
    };

  } catch (error) {
    console.error('Error exporting legal pages:', error);
    throw error;
  }
}

// Private helper functions

async function loadLegalPages(): Promise<LegalPage[]> {
  const now = Date.now();
  if (legalPagesCache && (now - cacheTimestamp) < CACHE_DURATION) {
    return legalPagesCache;
  }

  const pages = await loadCollection<LegalPage>(LEGAL_PAGES_COLLECTION);
  legalPagesCache = pages;
  cacheTimestamp = now;

  return pages;
}

function getDefaultLegalContent(type: LegalPageType): string {
  const templates: Record<LegalPageType, string> = {
    privacy: `# Privacy Policy

## Information We Collect

We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us for support.

## How We Use Your Information

We use the information we collect to provide, maintain, and improve our services, process transactions, and communicate with you.

## Contact Information

If you have any questions about this Privacy Policy, please contact us at privacy@example.com.`,
    terms: `# Terms of Service

## Acceptance of Terms

By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.

## Use License

Permission is granted to temporarily access the materials on our website for personal, non-commercial transitory viewing only.

## Contact Information

For any questions regarding these terms, please contact legal@example.com.`,
    shipping: `# Shipping & Delivery Policy

## Shipping Areas

We currently ship to select locations. Please contact us for specific delivery area information.

## Delivery Timeframes

Orders are typically processed within 1-2 business days. Delivery timeframes vary by location.

## Contact Information

For shipping inquiries, please contact us at shipping@example.com.`,
    refund: `# Refund & Return Policy

## Return Conditions

Items must be returned in their original condition within 30 days of purchase.

## Refund Process

Once we receive your return, we will process your refund within 5-7 business days.

## Contact Information

For refund inquiries, please contact us at refunds@example.com.`
  };

  return templates[type];
}

function getApplicableLaws(type: LegalPageType, jurisdiction?: string): string[] {
  const baseLaws = ['Information Technology Act 2000'];

  const typeSpecificLaws: Record<LegalPageType, string[]> = {
    privacy: [
      'Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011',
      'Consumer Protection Act 2019'
    ],
    terms: [
      'Indian Contract Act 1872',
      'Consumer Protection Act 2019'
    ],
    shipping: [
      'Sale of Goods Act',
      'Consumer Protection Act 2019'
    ],
    refund: [
      'Consumer Protection Act 2019',
      'E-commerce Rules 2020'
    ]
  };

  return [...baseLaws, ...typeSpecificLaws[type]];
}

export const legalService = {
  generateLegalPage,
  getLegalPage,
  getAllLegalPages,
  updateLegalPage,
  checkLegalReviewStatus,
  exportLegalPages,
};
