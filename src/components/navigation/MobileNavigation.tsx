import { useState } from "react";
import { Link } from "react-router-dom";
import type { NavigationMenu, NavigationItem } from "@/types/navigation";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { NavigationIcon } from "@/components/navigation/Icon";
import { shouldOpenInNewTab } from "@/components/navigation/utils";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Menu, Phone } from "lucide-react";

interface MobileNavigationProps {
  menu: NavigationMenu;
}

export function MobileNavigation({ menu }: MobileNavigationProps) {
  const [open, setOpen] = useState(false);
  const [activeTrail, setActiveTrail] = useState<NavigationItem[]>([]);

  const topLevelItems = (menu.items ?? []).filter((item) => item.isVisible !== false);

  const currentItems = activeTrail.length > 0
    ? activeTrail[activeTrail.length - 1].children ?? []
    : topLevelItems;

  const currentTitle = activeTrail.length > 0
    ? activeTrail[activeTrail.length - 1].label
    : "Navigation";

  const handleOpenChange = (value: boolean) => {
    setOpen(value);

    if (!value) {
      setActiveTrail([]);
    }
  };

  const handleItemClick = (item: NavigationItem) => {
    if (item.children && item.children.length > 0) {
      setActiveTrail((prev) => [...prev, item]);
      return;
    }

    // If item has a URL, navigate to it
    if (item.url && item.url !== "#") {
      if (item.isExternal) {
        window.open(item.url, '_blank', 'noopener,noreferrer');
      } else {
        window.location.href = item.url;
      }
    }

    setOpen(false);
  };

  const handleBack = () => {
    setActiveTrail((prev) => prev.slice(0, -1));
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="p-2"
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="flex h-full w-[320px] flex-col bg-white p-0">
        <SheetHeader className="border-b border-timber-100 px-5 py-4">
          <div className="flex items-center justify-between">
            {activeTrail.length > 0 ? (
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2 text-sm text-muted-foreground"
                onClick={handleBack}
              >
                <ChevronLeft className="h-4 w-4" />
                Back
              </Button>
            ) : (
              <span className="h-4 w-4" />
            )}

            <SheetTitle className="flex-1 text-center text-lg font-semibold text-forest-900">
              {currentTitle}
            </SheetTitle>

            <span className="h-4 w-4" />
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto">
          <nav className="space-y-1 px-5 py-4" aria-label="Mobile navigation">
            {currentItems.map((item) => (
              <button
                key={item.id}
                type="button"
                className={cn(
                  "flex w-full items-center justify-between rounded-xl border border-transparent px-3 py-3 text-left text-sm font-medium text-forest-900",
                  "transition hover:border-timber-200 hover:bg-timber-50 focus-visible:outline focus-visible:outline-2",
                  "focus-visible:outline-offset-2 focus-visible:outline-timber-600"
                )}
                onClick={() => handleItemClick(item)}
              >
                <div className="flex items-center gap-3">
                  <NavigationIcon name={item.icon} className="text-timber-600" />
                  <div className="flex flex-col">
                    <span>{item.label}</span>
                    {item.description && (
                      <span className="text-xs text-muted-foreground">
                        {item.description}
                      </span>
                    )}
                  </div>
                </div>

                {item.children && item.children.length > 0 ? (
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <span className="h-4 w-4" />
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="border-t border-timber-100 px-5 py-4">
          <div className="rounded-xl bg-timber-50 px-4 py-3">
            <div className="flex items-center gap-3 text-sm text-forest-900">
              <Phone className="h-4 w-4 text-timber-700" />
              <div>
                <p className="font-medium">Need assistance?</p>
                <p className="text-xs text-muted-foreground">Call +91 9886033342</p>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
