import { Link } from "react-router-dom";
import type { NavigationMenu, NavigationItem } from "@/types/navigation";
import { NavigationIcon } from "@/components/navigation/Icon";
import { splitIntoColumns } from "@/components/navigation/utils";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

interface MegaMenuProps {
  menu: NavigationMenu;
}

export function MegaMenu({ menu }: MegaMenuProps) {
  if (!menu.items || menu.items.length === 0) {
    return null;
  }

  const topLevelItems = menu.items.filter((item) => item.isVisible !== false);

  return (
    <nav className="hidden md:flex items-center gap-2" aria-label="Primary Navigation">
      {topLevelItems.map((item) => (
        <TopLevelItem key={item.id} item={item} />
      ))}
    </nav>
  );
}

interface TopLevelItemProps {
  item: NavigationItem;
}

function TopLevelItem({ item }: TopLevelItemProps) {
  const hasChildren = Boolean(item.children && item.children.length > 0);

  if (!hasChildren) {
    return (
      <Link
        to={item.url}
        className={cn(
          "flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-forest-900",
          "transition hover:bg-timber-50 hover:text-timber-700 focus-visible:outline focus-visible:outline-2",
          "focus-visible:outline-offset-2 focus-visible:outline-timber-600 min-h-[40px]"
        )}
      >
        <NavigationIcon name={item.icon} size={16} />
        <span>{item.label}</span>
      </Link>
    );
  }

  const columns = splitIntoColumns(item.children ?? [], 3);

  return (
    <div className="group relative">
      <button
        type="button"
        className={cn(
          "flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-forest-900",
          "transition hover:bg-timber-50 hover:text-timber-700 focus-visible:outline focus-visible:outline-2",
          "focus-visible:outline-offset-2 focus-visible:outline-timber-600 min-h-[40px]"
        )}
        aria-haspopup="true"
        aria-expanded="false"
      >
        <NavigationIcon name={item.icon} size={16} />
        <span>{item.label}</span>
        <ChevronDown className="h-4 w-4" aria-hidden="true" />
      </button>

      <div className="absolute left-0 top-full z-50 hidden w-[860px] pt-4 group-hover:block">
        <div className="rounded-3xl border border-timber-100 bg-white/95 p-6 shadow-2xl backdrop-blur-xl">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {columns.map((column, index) => (
              <div key={index} className="space-y-5">
                {column.map((child) => (
                  <MegaMenuSection key={child.id} item={child} />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

interface MegaMenuSectionProps {
  item: NavigationItem;
}

function MegaMenuSection({ item }: MegaMenuSectionProps) {
  const hasChildren = Boolean(item.children && item.children.length > 0);

  return (
    <div className="space-y-3">
      <Link
        to={item.url}
        className={cn(
          "flex items-start gap-3 rounded-2xl border border-transparent px-3 py-3 transition",
          "hover:border-timber-200 hover:bg-timber-50"
        )}
      >
        <NavigationIcon name={item.icon} className="mt-1 text-timber-600" />
        <div className="space-y-1">
          <div className="text-sm font-semibold text-forest-900">{item.label}</div>
          {item.description && (
            <p className="text-xs text-muted-foreground">{item.description}</p>
          )}
        </div>
      </Link>

      {hasChildren && (
        <ul className="space-y-1 pl-4 text-sm text-muted-foreground">
          {item.children?.map((child) => (
            <li key={child.id}>
              <Link
                to={child.url}
                className="inline-flex items-center gap-2 rounded-lg px-2 py-1 transition hover:bg-timber-50 hover:text-timber-700"
              >
                <span>{child.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
