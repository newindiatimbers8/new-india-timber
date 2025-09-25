import { Link } from "react-router-dom";
import type { NavigationItem as NavigationItemType } from "@/types/navigation";
import { NavigationIcon } from "@/components/navigation/Icon";
import { shouldOpenInNewTab } from "@/components/navigation/utils";
import { cn } from "@/lib/utils";

type SizeVariant = "default" | "compact" | "pill";

type LayoutVariant = "inline" | "stacked";

interface NavigationItemProps {
  item: NavigationItemType;
  size?: SizeVariant;
  layout?: LayoutVariant;
  className?: string;
}

export function NavigationItem({
  item,
  size = "default",
  layout = "inline",
  className,
}: NavigationItemProps) {
  const openInNewTab = shouldOpenInNewTab(item);

  const content = (
    <div
      className={cn(
        "flex items-center gap-2 transition-colors",
        size === "default" && "text-sm",
        size === "compact" && "text-xs",
        size === "pill" && "text-xs",
        layout === "stacked" && "flex-col items-start gap-1",
      )}
    >
      <NavigationIcon
        name={item.icon}
        size={size === "default" ? 18 : 14}
        className={cn(
          size === "pill" && "text-white",
          layout === "stacked" && "text-timber-700"
        )}
      />
      <span className={cn(
        "font-medium",
        size === "default" && "text-forest-900",
        size === "compact" && "text-muted-foreground",
        size === "pill" && "text-white"
      )}>
        {item.label}
      </span>
      {item.description && layout === "stacked" && (
        <span className="text-xs text-muted-foreground">
          {item.description}
        </span>
      )}
    </div>
  );

  return (
    <Link
      to={item.url}
      target={openInNewTab ? "_blank" : undefined}
      rel={openInNewTab ? "noopener noreferrer" : undefined}
      className={cn(
        "group inline-flex items-center gap-2 rounded-lg px-3 py-2 transition",
        size === "default" && "hover:bg-timber-50",
        size === "compact" && "hover:bg-muted",
        size === "pill" && "rounded-full bg-timber-600 px-4 py-2 text-white hover:bg-timber-700",
        className
      )}
    >
      {content}
    </Link>
  );
}
