/**
 * Navigation Service
 * Handles navigation menu CRUD operations using JSON-based storage
 */

import {
  NavigationMenu,
  NavigationItem,
  NavigationMenuType,
  validateMenuDepth,
  sortMenuItems,
  NAVIGATION_VALIDATION
} from '@/types/navigation';
import { loadCollection, saveCollection } from '@/utils/dataLoader';

const COLLECTION_NAME = 'navigation';

// In-memory cache for better performance
let navigationCache: NavigationMenu[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Get all navigation menus
 */
export async function getNavigationMenus(type?: NavigationMenuType): Promise<NavigationMenu[]> {
  try {
    // Check cache first
    const now = Date.now();
    if (navigationCache && (now - cacheTimestamp) < CACHE_DURATION) {
      let menus = navigationCache;
      if (type) {
        menus = menus.filter(menu => menu.type === type);
      }
      return sortMenusByTypeAndOrder(menus);
    }

    // Load from JSON storage
    const menus = await loadCollection<NavigationMenu>(COLLECTION_NAME);

    // Filter by type if specified
    let filteredMenus = menus;
    if (type) {
      filteredMenus = menus.filter(menu => menu.type === type);
    }

    // Cache the results
    navigationCache = menus;
    cacheTimestamp = now;

    return sortMenusByTypeAndOrder(filteredMenus);
  } catch (error) {
    console.error('Error loading navigation menus:', error);
    return [];
  }
}

/**
 * Get navigation menu by ID
 */
export async function getNavigationMenuById(id: string): Promise<NavigationMenu | null> {
  try {
    const menus = await loadCollection<NavigationMenu>(COLLECTION_NAME);
    return menus.find(menu => menu.id === id) || null;
  } catch (error) {
    console.error('Error loading navigation menu by ID:', error);
    return null;
  }
}

/**
 * Create new navigation menu
 */
export async function createNavigationMenu(menuData: Omit<NavigationMenu, 'id' | 'createdAt' | 'updatedAt'>): Promise<NavigationMenu> {
  try {
    // Validate menu data
    const validationErrors = collectNavigationValidationErrors(menuData);
    if (validationErrors.length > 0) {
      throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
    }

    // Check for unique name
    const existingMenus = await loadCollection<NavigationMenu>(COLLECTION_NAME);
    const nameExists = existingMenus.some(menu => menu.name === menuData.name);
    if (nameExists) {
      throw new Error(`Menu with name "${menuData.name}" already exists`);
    }

    // Create new menu
    const now = new Date().toISOString();
    const newMenu: NavigationMenu = {
      ...menuData,
      id: generateMenuId(),
      createdAt: now,
      updatedAt: now,
      version: 1
    };

    // Save to storage
    const updatedMenus = [...existingMenus, newMenu];
    await saveCollection(COLLECTION_NAME, updatedMenus);

    // Invalidate cache
    navigationCache = null;

    return newMenu;
  } catch (error) {
    console.error('Error creating navigation menu:', error);
    throw error;
  }
}

/**
 * Update navigation menu
 */
export async function updateNavigationMenu(id: string, updates: Partial<NavigationMenu>): Promise<NavigationMenu | null> {
  try {
    const menus = await loadCollection<NavigationMenu>(COLLECTION_NAME);
    const menuIndex = menus.findIndex(menu => menu.id === id);

    if (menuIndex === -1) {
      return null;
    }

    const existingMenu = menus[menuIndex];

    // Validate updates
    const updatedMenu = { ...existingMenu, ...updates };
    const validationErrors = collectNavigationValidationErrors(updatedMenu);
    if (validationErrors.length > 0) {
      throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
    }

    // Check name uniqueness if name is being updated
    if (updates.name && updates.name !== existingMenu.name) {
      const nameExists = menus.some(menu => menu.id !== id && menu.name === updates.name);
      if (nameExists) {
        throw new Error(`Menu with name "${updates.name}" already exists`);
      }
    }

    // Update menu
    const now = new Date().toISOString();
    const finalMenu: NavigationMenu = {
      ...updatedMenu,
      updatedAt: now,
      version: (existingMenu.version || 1) + 1
    };

    menus[menuIndex] = finalMenu;
    await saveCollection(COLLECTION_NAME, menus);

    // Invalidate cache
    navigationCache = null;

    return finalMenu;
  } catch (error) {
    console.error('Error updating navigation menu:', error);
    throw error;
  }
}

/**
 * Delete navigation menu
 */
export async function deleteNavigationMenu(id: string): Promise<boolean> {
  try {
    const menus = await loadCollection<NavigationMenu>(COLLECTION_NAME);
    const filteredMenus = menus.filter(menu => menu.id !== id);

    if (filteredMenus.length === menus.length) {
      return false; // Menu not found
    }

    await saveCollection(COLLECTION_NAME, filteredMenus);

    // Invalidate cache
    navigationCache = null;

    return true;
  } catch (error) {
    console.error('Error deleting navigation menu:', error);
    return false;
  }
}

/**
 * Validate navigation menu structure
 */
export async function validateNavigationMenu(menu: NavigationMenu): Promise<{
  isValid: boolean;
  score: number;
  issues: Array<{ severity: 'error' | 'warning' | 'info'; message: string; itemId?: string }>;
  recommendations: string[];
}> {
  const issues: Array<{ severity: 'error' | 'warning' | 'info'; message: string; itemId?: string }> = [];
  const recommendations: string[] = [];

  // Basic validation
  const validationErrors = collectNavigationValidationErrors(menu);
  validationErrors.forEach(error => {
    issues.push({ severity: 'error', message: error });
  });

  // Depth validation
  menu.items.forEach(item => {
    if (!validateMenuDepth(item)) {
      issues.push({
        severity: 'error',
        message: 'Menu exceeds maximum depth of 3 levels',
        itemId: item.id
      });
    }
  });

  // URL validation
  menu.items.forEach(item => {
    validateMenuItemRecursively(item, issues);
  });

  // Accessibility checks
  const accessibilityIssues = checkMenuAccessibility(menu);
  issues.push(...accessibilityIssues);

  // Performance checks
  if (menu.items.length > 20) {
    issues.push({
      severity: 'warning',
      message: 'Menu has many items which may impact performance',
      itemId: menu.id
    });
    recommendations.push('Consider splitting large menus into sub-menus');
  }

  // Calculate score (0-100)
  const errorCount = issues.filter(issue => issue.severity === 'error').length;
  const warningCount = issues.filter(issue => issue.severity === 'warning').length;

  let score = 100;
  score -= errorCount * 20; // -20 points per error
  score -= warningCount * 5;  // -5 points per warning
  score = Math.max(0, Math.min(100, score));

  // Generate recommendations
  if (errorCount > 0) {
    recommendations.push('Fix all errors before publishing the menu');
  }
  if (!menu.settings?.showIcons) {
    recommendations.push('Consider enabling icons for better visual hierarchy');
  }
  if (menu.items.length === 0) {
    recommendations.push('Add menu items to make the menu functional');
  }

  return {
    isValid: errorCount === 0,
    score,
    issues,
    recommendations
  };
}

/**
 * Get breadcrumbs for a given path
 */
export async function getBreadcrumbs(path: string): Promise<{
  breadcrumbs: Array<{ name: string; url: string; isActive: boolean }>;
  structuredData?: any;
}> {
  try {
    // Load all menus to find path matches
    const menus = await loadCollection<NavigationMenu>(COLLECTION_NAME);
    const breadcrumbs: Array<{ name: string; url: string; isActive: boolean }> = [];

    // Add home breadcrumb
    breadcrumbs.push({ name: 'Home', url: '/', isActive: path === '/' });

    // Find matching menu items
    for (const menu of menus) {
      if (menu.type === 'main') {
        const pathSegments = path.split('/').filter(Boolean);
        let currentPath = '';

        for (const segment of pathSegments) {
          currentPath += `/${segment}`;
          const matchingItem = findItemByUrl(menu.items, currentPath);

          if (matchingItem) {
            breadcrumbs.push({
              name: matchingItem.label,
              url: matchingItem.url,
              isActive: matchingItem.url === path
            });
          }
        }
      }
    }

    // Generate structured data for SEO
    const structuredData = generateBreadcrumbStructuredData(breadcrumbs);

    return { breadcrumbs, structuredData };
  } catch (error) {
    console.error('Error generating breadcrumbs:', error);
    return { breadcrumbs: [{ name: 'Home', url: '/', isActive: true }] };
  }
}

/**
 * Get available Lucide icons for menu items
 */
export async function getAvailableIcons(search?: string, category?: string): Promise<{
  icons: Array<{ name: string; category: string; keywords: string[] }>;
  total: number;
  categories: Array<{ name: string; count: number }>;
}> {
  // This would typically load from a comprehensive icon database
  // For now, return a curated list of commonly used navigation icons
  const allIcons = [
    { name: 'home', category: 'navigation', keywords: ['home', 'house', 'main'] },
    { name: 'package', category: 'ecommerce', keywords: ['product', 'package', 'box'] },
    { name: 'tree-pine', category: 'nature', keywords: ['tree', 'wood', 'nature'] },
    { name: 'shopping-cart', category: 'ecommerce', keywords: ['cart', 'shopping', 'buy'] },
    { name: 'user', category: 'user', keywords: ['user', 'person', 'account'] },
    { name: 'settings', category: 'system', keywords: ['settings', 'gear', 'config'] },
    { name: 'info', category: 'information', keywords: ['info', 'information', 'help'] },
    { name: 'phone', category: 'communication', keywords: ['phone', 'call', 'contact'] },
    { name: 'mail', category: 'communication', keywords: ['mail', 'email', 'message'] },
    { name: 'search', category: 'action', keywords: ['search', 'find', 'magnify'] },
    { name: 'menu', category: 'navigation', keywords: ['menu', 'hamburger', 'list'] },
    { name: 'chevron-right', category: 'navigation', keywords: ['arrow', 'right', 'next'] },
    { name: 'bar-chart-3', category: 'data', keywords: ['chart', 'graph', 'analytics'] },
    { name: 'file-text', category: 'content', keywords: ['file', 'document', 'text'] },
    { name: 'calendar', category: 'time', keywords: ['calendar', 'date', 'schedule'] },
  ];

  let filteredIcons = allIcons;

  // Filter by search
  if (search) {
    const searchLower = search.toLowerCase();
    filteredIcons = filteredIcons.filter(icon =>
      icon.name.toLowerCase().includes(searchLower) ||
      icon.keywords.some(keyword => keyword.includes(searchLower))
    );
  }

  // Filter by category
  if (category) {
    filteredIcons = filteredIcons.filter(icon => icon.category === category);
  }

  // Group by category for statistics
  const categoryCounts: Record<string, number> = {};
  allIcons.forEach(icon => {
    categoryCounts[icon.category] = (categoryCounts[icon.category] || 0) + 1;
  });

  const categories = Object.entries(categoryCounts).map(([name, count]) => ({
    name,
    count
  }));

  return {
    icons: filteredIcons.slice(0, 50), // Limit results
    total: filteredIcons.length,
    categories
  };
}

// Helper functions

function generateMenuId(): string {
  return `nav_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function sortMenusByTypeAndOrder(menus: NavigationMenu[]): NavigationMenu[] {
  const typeOrder = { main: 1, footer: 2, mobile: 3, admin: 4 };

  return menus.sort((a, b) => {
    const typeDiff = (typeOrder[a.type] || 99) - (typeOrder[b.type] || 99);
    if (typeDiff !== 0) return typeDiff;

    // Within same type, sort by name
    return a.name.localeCompare(b.name);
  });
}

function collectNavigationValidationErrors(menu: Partial<NavigationMenu>): string[] {
  const errors: string[] = [];

  if (!menu.name || menu.name.length === 0) {
    errors.push('Menu name is required');
  } else if (!NAVIGATION_VALIDATION.MENU_NAME_PATTERN.test(menu.name)) {
    errors.push('Menu name contains invalid characters');
  }

  if (!menu.type || !['main', 'footer', 'mobile', 'admin'].includes(menu.type)) {
    errors.push('Valid menu type is required');
  }

  if (!Array.isArray(menu.items)) {
    errors.push('Menu items must be an array');
  }

  if (typeof menu.isActive !== 'boolean') {
    errors.push('isActive must be a boolean');
  }

  return errors;
}

function validateMenuItemRecursively(item: NavigationItem, issues: any[]): void {
  // URL validation
  if (item.url) {
    if (item.isExternal) {
      // External URLs should be valid
      try {
        new URL(item.url);
      } catch {
        issues.push({
          severity: 'error',
          message: `Invalid external URL: ${item.url}`,
          itemId: item.id
        });
      }
    } else if (!item.url.startsWith('/')) {
      issues.push({
        severity: 'error',
        message: `Internal URLs must start with '/': ${item.url}`,
        itemId: item.id
      });
    }
  }

  // Recurse into children
  if (item.children) {
    item.children.forEach(child => validateMenuItemRecursively(child, issues));
  }
}

function checkMenuAccessibility(menu: NavigationMenu): Array<{ severity: 'error' | 'warning' | 'info'; message: string; itemId?: string }> {
  const issues: Array<{ severity: 'error' | 'warning' | 'info'; message: string; itemId?: string }> = [];

  menu.items.forEach(item => {
    // Check for missing descriptions on complex menus
    if (item.children && item.children.length > 0 && !item.description) {
      issues.push({
        severity: 'warning',
        message: 'Menu items with children should have descriptions for accessibility',
        itemId: item.id
      });
    }

    // Check for very long labels
    if (item.label.length > 50) {
      issues.push({
        severity: 'warning',
        message: 'Menu item labels should be concise for mobile devices',
        itemId: item.id
      });
    }
  });

  return issues;
}

function findItemByUrl(items: NavigationItem[], targetUrl: string): NavigationItem | null {
  for (const item of items) {
    if (item.url === targetUrl) {
      return item;
    }
    if (item.children) {
      const found = findItemByUrl(item.children, targetUrl);
      if (found) return found;
    }
  }
  return null;
}

function generateBreadcrumbStructuredData(breadcrumbs: Array<{ name: string; url: string; isActive: boolean }>): any {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: `https://newindiatimber.com${crumb.url}`
    }))
  };
}
