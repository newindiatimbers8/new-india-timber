import { cn } from "@/lib/utils";
import {
  BarChart3,
  Briefcase,
  Home,
  Info,
  Layers,
  Logs,
  Newspaper,
  Package,
  Phone,
  Puzzle,
  Route,
  Scale,
  Search,
  Shield,
  TreePine,
  Truck,
} from "lucide-react";

const ICON_MAP = {
  "bar-chart-3": BarChart3,
  briefcase: Briefcase,
  home: Home,
  info: Info,
  layers: Layers,
  logs: Logs,
  newspaper: Newspaper,
  package: Package,
  phone: Phone,
  puzzle: Puzzle,
  route: Route,
  scale: Scale,
  search: Search,
  shield: Shield,
  "tree-pine": TreePine,
  truck: Truck,
} as const;

export type NavigationIconName = keyof typeof ICON_MAP;

interface NavigationIconProps {
  name?: string | null;
  className?: string;
  size?: number;
}

export function NavigationIcon({ name, className, size = 18 }: NavigationIconProps) {
  if (!name) return null;

  const IconComponent = ICON_MAP[name as NavigationIconName];

  if (!IconComponent) return null;

  return <IconComponent className={cn("text-forest-700", className)} size={size} aria-hidden="true" />;
}
