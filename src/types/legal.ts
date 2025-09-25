/**
 * Legal Content Management Types
 * Based on data-model.md specifications
 */

export interface LegalPage {
  id: string;
  type: LegalPageType;
  title: string;
  slug: string;                  // URL path
  content: string;               // Legal content
  version: string;               // Version number (e.g., "1.0.0")
  effectiveDate: string;         // When policy takes effect (ISO date)
  lastReviewDate: string;        // Last legal review (ISO date)

  // AI Generation tracking
  aiGenerated: boolean;
  originalPrompt?: string;       // If AI-generated
  legalReviewed: boolean;        // Lawyer approval
  reviewNotes?: string;          // Review comments

  // Compliance
  jurisdiction: string;          // e.g., "Karnataka, India"
  applicableLaws: string[];      // Relevant regulations

  // SEO
  seo: {
    metaTitle: string;
    metaDescription: string;
    noIndex: boolean;            // Exclude from search engines
  };

  // Change management
  previousVersions: string[];    // Version history (array of version strings)
  changeReason?: string;         // Why updated
  notificationSent: boolean;     // User notification sent

  createdAt: string;
  updatedAt: string;
}

export interface LegalPageSummary {
  id: string;
  type: LegalPageType;
  title: string;
  slug: string;
  version: string;
  effectiveDate: string;
  lastReviewDate: string;
  aiGenerated: boolean;
  legalReviewed: boolean;
  jurisdiction: string;
  updatedAt: string;
}

export interface CreateLegalPageRequest {
  type: LegalPageType;
  businessName?: string;
  jurisdiction?: string;
  contactEmail?: string;
  websiteUrl?: string;
  specificRequirements?: string[];
  aiGenerate?: boolean;
}

export interface UpdateLegalPageRequest {
  title?: string;
  content?: string;
  version?: string;
  effectiveDate?: string;
  lastReviewDate?: string;
  legalReviewed?: boolean;
  reviewNotes?: string;
  jurisdiction?: string;
  applicableLaws?: string[];
  seo?: Partial<LegalPage['seo']>;
  changeReason?: string;
  notificationSent?: boolean;
}

export interface LegalPageVersion {
  version: string;
  content: string;
  effectiveDate: string;
  changeReason?: string;
  createdAt: string;
}

// Enums and types
export type LegalPageType = 'privacy' | 'terms' | 'shipping' | 'refund';

// Pre-defined legal templates and requirements
export const LEGAL_TEMPLATES = {
  privacy: {
    title: 'Privacy Policy',
    requiredSections: [
      'Information We Collect',
      'How We Use Your Information',
      'Information Sharing',
      'Data Security',
      'Your Rights',
      'Contact Information'
    ],
    indianCompliance: [
      'IT Act 2000',
      'Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011',
      'Consumer Protection Act 2019'
    ]
  },
  terms: {
    title: 'Terms of Service',
    requiredSections: [
      'Acceptance of Terms',
      'Description of Service',
      'User Obligations',
      'Intellectual Property',
      'Limitation of Liability',
      'Governing Law',
      'Contact Information'
    ],
    indianCompliance: [
      'Indian Contract Act 1872',
      'Information Technology Act 2000',
      'Consumer Protection Act 2019'
    ]
  },
  shipping: {
    title: 'Shipping & Delivery Policy',
    requiredSections: [
      'Shipping Areas',
      'Delivery Timeframes',
      'Shipping Costs',
      'Order Tracking',
      'Damaged Items',
      'Contact Information'
    ],
    indianCompliance: [
      'Consumer Protection Act 2019',
      'Sale of Goods Act'
    ]
  },
  refund: {
    title: 'Refund & Return Policy',
    requiredSections: [
      'Return Conditions',
      'Refund Process',
      'Exclusions',
      'Refund Timeframe',
      'Contact Information'
    ],
    indianCompliance: [
      'Consumer Protection Act 2019',
      'E-commerce Rules 2020'
    ]
  }
} as const;

// Validation constants
export const LEGAL_VALIDATION = {
  VERSION_PATTERN: /^\d+\.\d+\.\d+$/,
  SLUG_PATTERNS: {
    privacy: 'privacy-policy',
    terms: 'terms-of-service',
    shipping: 'shipping-delivery-policy',
    refund: 'refund-return-policy'
  },
  MIN_CONTENT_LENGTH: 500,
  MAX_TITLE_LENGTH: 100,
} as const;

// Type guards
export function isLegalPage(obj: any): obj is LegalPage {
  return obj &&
         typeof obj.id === 'string' &&
         ['privacy', 'terms', 'shipping', 'refund'].includes(obj.type) &&
         typeof obj.title === 'string' &&
         typeof obj.slug === 'string' &&
         typeof obj.content === 'string' &&
         typeof obj.version === 'string' &&
         typeof obj.effectiveDate === 'string' &&
         typeof obj.lastReviewDate === 'string' &&
         typeof obj.aiGenerated === 'boolean' &&
         typeof obj.legalReviewed === 'boolean' &&
         typeof obj.jurisdiction === 'string' &&
         Array.isArray(obj.applicableLaws) &&
         obj.seo && typeof obj.seo === 'object' &&
         Array.isArray(obj.previousVersions) &&
         typeof obj.notificationSent === 'boolean' &&
         typeof obj.createdAt === 'string' &&
         typeof obj.updatedAt === 'string';
}

// Validation functions
export function validateLegalPage(page: Partial<LegalPage>): string[] {
  const errors: string[] = [];

  if (page.title && page.title.length > LEGAL_VALIDATION.MAX_TITLE_LENGTH) {
    errors.push(`Title must be ${LEGAL_VALIDATION.MAX_TITLE_LENGTH} characters or less`);
  }

  if (page.content && page.content.length < LEGAL_VALIDATION.MIN_CONTENT_LENGTH) {
    errors.push(`Content must be at least ${LEGAL_VALIDATION.MIN_CONTENT_LENGTH} characters`);
  }

  if (page.version && !LEGAL_VALIDATION.VERSION_PATTERN.test(page.version)) {
    errors.push('Version must follow semantic versioning format (e.g., 1.0.0)');
  }

  if (page.effectiveDate && isNaN(Date.parse(page.effectiveDate))) {
    errors.push('Effective date must be a valid ISO date string');
  }

  if (page.lastReviewDate && isNaN(Date.parse(page.lastReviewDate))) {
    errors.push('Last review date must be a valid ISO date string');
  }

  // Validate slug matches expected pattern for type
  if (page.type && page.slug) {
    const expectedSlug = LEGAL_VALIDATION.SLUG_PATTERNS[page.type];
    if (page.slug !== expectedSlug) {
      errors.push(`Slug for ${page.type} must be "${expectedSlug}"`);
    }
  }

  return errors;
}

export function validateLegalPageType(type: string): type is LegalPageType {
  return ['privacy', 'terms', 'shipping', 'refund'].includes(type);
}

// Utility functions
export function getDefaultLegalPage(type: LegalPageType): Omit<LegalPage, 'id' | 'content' | 'createdAt' | 'updatedAt'> {
  const template = LEGAL_TEMPLATES[type];
  const now = new Date().toISOString();

  return {
    type,
    title: template.title,
    slug: LEGAL_VALIDATION.SLUG_PATTERNS[type],
    version: '1.0.0',
    effectiveDate: now,
    lastReviewDate: now,
    aiGenerated: false,
    legalReviewed: false,
    jurisdiction: 'Karnataka, India',
    applicableLaws: template.indianCompliance,
    seo: {
      metaTitle: template.title,
      metaDescription: `Read our ${template.title.toLowerCase()} for New India Timber services.`,
      noIndex: false
    },
    previousVersions: [],
    notificationSent: false
  };
}

export function generateLegalPrompt(type: LegalPageType, request: CreateLegalPageRequest): string {
  const template = LEGAL_TEMPLATES[type];
  const requirements = request.specificRequirements?.length
    ? ` Additional specific requirements: ${request.specificRequirements.join(', ')}`
    : '';

  const businessInfo = [
    request.businessName && `Business name: ${request.businessName}`,
    request.jurisdiction && `Jurisdiction: ${request.jurisdiction}`,
    request.contactEmail && `Contact email: ${request.contactEmail}`,
    request.websiteUrl && `Website: ${request.websiteUrl}`
  ].filter(Boolean).join('. ');

  return `Generate a comprehensive ${template.title} for a timber and wood products business${businessInfo ? ` (${businessInfo})` : ''}.

Required sections: ${template.requiredSections.join(', ')}

Indian legal compliance requirements: ${template.indianCompliance.join(', ')}

${requirements}

The policy should be professional, legally sound, and tailored for the Indian timber industry context. Include specific contact information and jurisdiction details where appropriate.`;
}

export function incrementVersion(currentVersion: string): string {
  const parts = currentVersion.split('.').map(Number);
  if (parts.length !== 3) return '1.0.0';

  // Increment patch version for minor updates
  parts[2] += 1;
  return parts.join('.');
}

export function shouldNotifyUsers(page: LegalPage, changes: UpdateLegalPageRequest): boolean {
  // Notify users for major legal changes
  return Boolean(
    changes.effectiveDate ||
    changes.jurisdiction ||
    (changes.version && changes.version !== page.version) ||
    changes.changeReason
  );
}

export function getLegalPageUrl(type: LegalPageType): string {
  return `/${LEGAL_VALIDATION.SLUG_PATTERNS[type]}`;
}

export function isLegalPageCurrent(page: LegalPage): boolean {
  const now = new Date();
  const effectiveDate = new Date(page.effectiveDate);
  return effectiveDate <= now;
}

export function getNextReviewDate(page: LegalPage): string {
  const reviewDate = new Date(page.lastReviewDate);
  reviewDate.setFullYear(reviewDate.getFullYear() + 1); // Annual review
  return reviewDate.toISOString();
}
