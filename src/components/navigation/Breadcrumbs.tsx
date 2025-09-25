import { Link } from "react-router-dom";
import { NavigationIcon } from "@/components/navigation/Icon";
import type { NavigationItem } from "@/types/navigation";
import { cn } from "@/lib/utils";
import { Slash } from "lucide-react";

interface BreadcrumbsProps {
  items: Array<{
    label: string;
    href: string;
    icon?: string;
  }>;
  withHomeLink?: boolean;
  className?: string;
}

const HOME_CRUMB = {
  label: "Home",
  href: "/",
  icon: "home",
};

export function Breadcrumbs({ items, withHomeLink = true, className }: BreadcrumbsProps) {
  const crumbs = withHomeLink ? [HOME_CRUMB, ...items] : items;

  if (!crumbs || crumbs.length === 0) {
    return null;
  }

  const lastIndex = crumbs.length - 1;

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn(
        "flex items-center gap-1 text-sm text-muted-foreground",
        className
      )}
    >
      {crumbs.map((crumb, index) => {
        const isLast = index === lastIndex;

        return (
          <div key={`${crumb.href}-${index}`} className="flex items-center gap-1">
            <BreadcrumbItem crumb={crumb} isActive={isLast} />
            {!isLast && <Slash className="h-3 w-3 text-muted-foreground" aria-hidden="true" />}
          </div>
        );
      })}
    </nav>
  );
}

interface BreadcrumbItemProps {
  crumb: {
    label: string;
    href: string;
    icon?: string;
  };
  isActive?: boolean;
}

function BreadcrumbItem({ crumb, isActive }: BreadcrumbItemProps) {
  const content = (
    <span
      className={cn(
        "inline-flex items-center gap-1 transition-colors",
        isActive ? "text-forest-900" : "hover:text-timber-600"
      )}
    >
      <NavigationIcon
        name={crumb.icon}
        size={14}
        className={cn(!isActive && "text-muted-foreground")}
      />
      <span>{crumb.label}</span>
    </span>
  );

  if (isActive) {
    return (
      <span
        aria-current="page"
        className="inline-flex items-center gap-1 text-forest-900"
      >
        {content}
      </span>
    );
  }

  return (
    <Link to={crumb.href} className="inline-flex items-center">
      {content}
    </Link>
  );
}
