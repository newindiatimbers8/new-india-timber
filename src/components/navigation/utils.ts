import type { NavigationItem } from "@/types/navigation";

export type NavigationItemWithDepth = NavigationItem & { depth: number };

/**
 * Flatten a tree of navigation items into a depth-aware array.
 */
export function flattenNavigationItems(items: NavigationItem[], depth = 0): NavigationItemWithDepth[] {
  const flattened: NavigationItemWithDepth[] = [];

  items.forEach(item => {
    flattened.push({ ...item, depth });

    if (item.children && item.children.length > 0) {
      flattened.push(...flattenNavigationItems(item.children, depth + 1));
    }
  });

  return flattened;
}

/**
 * Group navigation items by their immediate depth, preserving order.
 */
export function groupItemsByDepth(items: NavigationItem[]): NavigationItem[][] {
  const grouped: NavigationItem[][] = [];

  function process(currentItems: NavigationItem[], level: number) {
    if (!grouped[level]) {
      grouped[level] = [];
    }

    currentItems
      .slice()
      .sort((a, b) => a.order - b.order)
      .forEach(item => {
        grouped[level].push(item);

        if (item.children && item.children.length > 0) {
          process(item.children, level + 1);
        }
      });
  }

  process(items, 0);
  return grouped;
}

/**
 * Split navigation items into visually balanced columns.
 */
export function splitIntoColumns<T>(items: T[], columns: number): T[][] {
  if (columns <= 0) {
    return [items];
  }

  const result: T[][] = Array.from({ length: columns }, () => []);

  items.forEach((item, index) => {
    const columnIndex = index % columns;
    result[columnIndex].push(item);
  });

  return result;
}

/**
 * Ensure external URLs start with a supported protocol.
 */
export function normalizeExternalUrl(url: string): string {
  if (/^https?:\/\//i.test(url)) {
    return url;
  }

  return `https://${url}`;
}

/**
 * Determine whether a navigation item should open in a new tab.
 */
export function shouldOpenInNewTab(item: NavigationItem): boolean {
  if (typeof item.openInNewTab === "boolean") {
    return item.openInNewTab;
  }

  return item.isExternal;
}
