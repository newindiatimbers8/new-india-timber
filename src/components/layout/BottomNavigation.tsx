import { Link, useLocation } from "react-router-dom";
import { 
  Home, 
  Package, 
  Phone,
  MapPin
} from "lucide-react";

const BottomNavigation = () => {
  const location = useLocation();
  
  // Essential navigation items only (4 most important)
  const navigationItems = [
    {
      path: "/",
      icon: Home,
      label: "Home",
      active: location.pathname === "/"
    },
    {
      path: "/products",
      icon: Package,
      label: "Products",
      active: location.pathname.includes("/products")
    },
    {
      path: "#", // Special handling for external link
      icon: MapPin,
      label: "Directions",
      active: false,
      isExternal: true,
      externalUrl: "https://share.google/wy5zsZJlZLGB41zl7"
    },
    {
      path: "/contact",
      icon: Phone,
      label: "Contact",
      active: location.pathname.includes("/contact")
    }
  ];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderNavItem = (item: any) => {
    const Icon = item.icon;
    
    // Handle external links (like Google Maps)
    if (item.isExternal) {
      return (
        <a
          key={item.label}
          href={item.externalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-lg transition-colors ${
            item.active 
              ? "text-timber-600 bg-timber-50" 
              : "text-gray-500 hover:text-timber-600 hover:bg-timber-50"
          }`}
        >
          <Icon 
            size={18} 
            className={`mb-1 ${item.active ? "text-timber-600" : "text-gray-500"}`} 
          />
          <span className={`text-[10px] font-medium leading-tight ${item.active ? "text-timber-600" : "text-gray-500"}`}>
            {item.label}
          </span>
        </a>
      );
    }
    
    // Handle internal navigation
    return (
      <Link
        key={item.path}
        to={item.path}
        className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-lg transition-colors ${
          item.active 
            ? "text-timber-600 bg-timber-50" 
            : "text-gray-500 hover:text-timber-600 hover:bg-timber-50"
        }`}
      >
        <Icon
          size={18}
          className={`mb-1 ${item.active ? "text-timber-600" : "text-gray-500"}`}
        />
        <span className={`text-[10px] font-medium leading-tight ${item.active ? "text-timber-600" : "text-gray-500"}`}>
          {item.label}
        </span>
      </Link>
    );
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
      <nav className="grid grid-cols-4 gap-0.5 py-2 px-1">
        {navigationItems.map(renderNavItem)}
      </nav>
    </div>
  );
};

export default BottomNavigation;