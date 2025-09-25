export interface NavigationMenu {
  id: string;
  name: string;
  displayName?: string;
  type?: string;
  items: NavigationItem[];
  settings?: NavigationSettings;
  isActive: boolean;
  version?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface NavigationItem {
  id: string;
  label: string;
  url: string;
  type: 'page' | 'category' | 'external';
  icon?: string;
  description?: string;
  order: number;
  isExternal?: boolean;
  isVisible: boolean;
  children?: NavigationItem[];
  metadata?: Record<string, any>;
}

export interface NavigationSettings {
  maxDepth?: number;
  showIcons?: boolean;
  showDescriptions?: boolean;
  mobileCollapsible?: boolean;
  theme?: string;
  accessibility?: NavigationAccessibilitySettings;
}

export interface NavigationAccessibilitySettings {
  enableKeyboardNavigation?: boolean;
  announceNavigationChanges?: boolean;
  skipLinks?: boolean;
  ariaLabels?: boolean;
}

export interface NavigationValidationResult {
  isValid: boolean;
  issues: NavigationIssue[];
  score: number;
  accessibilityScore: number;
  performanceScore: number;
  seoScore: number;
}

export interface NavigationIssue {
  type: 'error' | 'warning' | 'info';
  category: 'structure' | 'accessibility' | 'performance' | 'seo';
  message: string;
  itemId?: string;
  suggestion?: string;
}

export interface NavigationCreateRequest {
  name: string;
  displayName?: string;
  type?: string;
  items: NavigationItem[];
  settings?: NavigationSettings;
}

export interface NavigationUpdateRequest {
  name?: string;
  displayName?: string;
  items?: NavigationItem[];
  settings?: NavigationSettings;
  isActive?: boolean;
}

export interface NavigationItemCreateRequest {
  label: string;
  url: string;
  type: 'page' | 'category' | 'external';
  icon?: string;
  description?: string;
  order: number;
  parentId?: string;
  metadata?: Record<string, any>;
}

export interface NavigationItemUpdateRequest {
  label?: string;
  url?: string;
  type?: 'page' | 'category' | 'external';
  icon?: string;
  description?: string;
  order?: number;
  isVisible?: boolean;
  metadata?: Record<string, any>;
}

// Navigation validation constants and functions
export const NAVIGATION_VALIDATION = {
  MENU_NAME_PATTERN: /^[a-zA-Z0-9\s\-_]+$/,
  MAX_DEPTH: 3,
  URL_PATTERN: /^\/[a-zA-Z0-9\-_\/]*$/,
} as const;

export type NavigationMenuType = 'main' | 'footer' | 'mobile' | 'admin';

export function validateMenuDepth(item: NavigationItem, currentDepth: number = 0): boolean {
  if (currentDepth > NAVIGATION_VALIDATION.MAX_DEPTH) {
    return false;
  }

  if (item.children && item.children.length > 0) {
    return item.children.every(child => validateMenuDepth(child, currentDepth + 1));
  }

  return true;
}

export function sortMenuItems(menus: NavigationMenu[]): NavigationMenu[] {
  const typeOrder: Record<string, number> = {
    main: 1,
    mobile: 2,
    footer: 3,
    admin: 4,
  };

  return menus.sort((a, b) => {
    const typeDiff = (typeOrder[a.type || ''] || 99) - (typeOrder[b.type || ''] || 99);
    if (typeDiff !== 0) return typeDiff;

    // Within same type, sort by name
    return a.name.localeCompare(b.name);
  });
}