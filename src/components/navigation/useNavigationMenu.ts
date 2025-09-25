import { useEffect, useState } from "react";
import type { NavigationMenu } from "@/types/navigation";
import { getNavigationMenus } from "@/services/navigation";
import { FALLBACK_NAVIGATION_MENU } from "@/components/navigation/fallback-data";

interface UseNavigationMenuOptions {
  type?: NavigationMenu["type"];
}

export function useNavigationMenu({ type = "main" }: UseNavigationMenuOptions = {}) {
  const [menu, setMenu] = useState<NavigationMenu>(FALLBACK_NAVIGATION_MENU);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadMenu() {
      setIsLoading(true);

      try {
        const menus = await getNavigationMenus(type);
        const targetMenu = menus.find((item) => item.type === type);

        if (isMounted && targetMenu) {
          setMenu(targetMenu);
        }
      } catch (err) {
        if (isMounted) {
          console.error("Failed to load navigation menu", err);
          setError(err as Error);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadMenu();

    return () => {
      isMounted = false;
    };
  }, [type]);

  return {
    menu,
    isLoading,
    error,
  };
}
