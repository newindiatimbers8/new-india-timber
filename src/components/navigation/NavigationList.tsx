import type { NavigationItem as NavigationItemType } from "@/types/navigation";
import { NavigationItem } from "@/components/navigation/NavigationItem";

interface NavigationListProps {
  items: NavigationItemType[];
  variant?: "default" | "stacked" |
    "pill";
  className?: string;
}

export function NavigationList({ items, variant = "default", className }: NavigationListProps) {
  if (!items || items.length === 0) {
    return null;
  }

  const layout = variant === "stacked" ? "stacked" : "inline";
  const size = variant === "pill" ? "pill" : variant === "stacked" ? "compact" : "default";

  return (
    <div className={className}>
      {items.map((item) => (
        <NavigationItem key={item.id} item={item} layout={layout} size={size} className="w-full" />
      ))}
    </div>
  );
}
