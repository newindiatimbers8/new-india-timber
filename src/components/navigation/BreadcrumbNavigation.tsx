/**
 * BreadcrumbNavigation Component
 * Provides accessible breadcrumb navigation with proper ARIA labels
 */

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
  icon?: React.ComponentType<any>;
}

interface BreadcrumbNavigationProps {
  items?: BreadcrumbItem[];
  className?: string;
  showHome?: boolean;
  separator?: React.ReactNode;
  maxItems?: number;
}

const BreadcrumbNavigation: React.FC<BreadcrumbNavigationProps> = ({
  items = [],
  className,
  showHome = true,
  separator = <ChevronRight className="w-4 h-4" />,
  maxItems = 5
}) => {
  const location = useLocation();

  // Auto-generate breadcrumbs from current route if no items provided
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [];

    // Add home if enabled
    if (showHome) {
      breadcrumbs.push({
        label: 'Home',
        href: '/',
        icon: Home
      });
    }

    // Generate breadcrumbs from path segments
    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === pathSegments.length - 1;
      
      // Convert segment to readable label
      const label = segment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      breadcrumbs.push({
        label,
        href: isLast ? undefined : currentPath,
        current: isLast
      });
    });

    return breadcrumbs;
  };

  const breadcrumbItems = items.length > 0 ? items : generateBreadcrumbs();

  // Truncate breadcrumbs if too many
  const displayItems = breadcrumbItems.length > maxItems 
    ? [
        ...breadcrumbItems.slice(0, 1), // Keep first item
        { label: '...', href: undefined, current: false },
        ...breadcrumbItems.slice(-2) // Keep last 2 items
      ]
    : breadcrumbItems;

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn('flex items-center space-x-1 text-sm text-muted-foreground', className)}
    >
      <ol className="flex items-center space-x-1" itemScope itemType="https://schema.org/BreadcrumbList">
        {displayItems.map((item, index) => {
          const isLast = index === displayItems.length - 1;
          const Icon = item.icon;

          return (
            <li
              key={index}
              className="flex items-center"
              itemProp="itemListElement"
              itemScope
              itemType="https://schema.org/ListItem"
            >
              {index > 0 && (
                <span className="mx-2 text-muted-foreground" aria-hidden="true">
                  {separator}
                </span>
              )}

              {item.href && !item.current ? (
                <Link
                  to={item.href}
                  className="flex items-center hover:text-foreground transition-colors"
                  itemProp="item"
                >
                  {Icon && <Icon className="w-4 h-4 mr-1" />}
                  <span itemProp="name">{item.label}</span>
                </Link>
              ) : (
                <span
                  className={cn(
                    'flex items-center',
                    item.current ? 'text-foreground font-medium' : 'text-muted-foreground'
                  )}
                  aria-current={item.current ? 'page' : undefined}
                  itemProp="name"
                >
                  {Icon && <Icon className="w-4 h-4 mr-1" />}
                  {item.label}
                </span>
              )}

              <meta itemProp="position" content={String(index + 1)} />
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default BreadcrumbNavigation;

