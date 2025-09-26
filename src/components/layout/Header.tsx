import { Link, useLocation } from "react-router-dom";
import {
  Phone,
  Mail,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "@/components/ui/Logo";
import { useNavigationMenu } from "@/components/navigation/useNavigationMenu";
import { MegaMenu } from "@/components/navigation/MegaMenu";
import { MobileNavigation } from "@/components/navigation/MobileNavigation";
import { FALLBACK_NAVIGATION_MENU } from "@/components/navigation/fallback-data";

const Header = () => {
  const location = useLocation();
  const { menu } = useNavigationMenu({ type: "main" });

  const activeMenu = menu ?? FALLBACK_NAVIGATION_MENU;
  
  // Get page title based on current route
  const getPageTitle = () => {
    if (location.pathname === "/") return "New India Timber";
    if (location.pathname.includes("/products")) return "Products";
    if (location.pathname.includes("/bulk-orders")) return "Bulk Orders";
    if (location.pathname.includes("/about")) return "About Us";
    if (location.pathname.includes("/contact")) return "Contact";
    if (location.pathname.includes("/blog")) return "Blog";
    if (location.pathname.includes("/privacy")) return "Privacy Policy";
    if (location.pathname.includes("/terms")) return "Terms & Conditions";
    if (location.pathname.includes("/refund")) return "Refund Policy";
    if (location.pathname.includes("/login")) return "Account";
    if (location.pathname.includes("/dashboard")) return "Dashboard";
    return "New India Timber";
  };
  
  const isHomePage = location.pathname === "/";

  return (
    <header className="w-full border-b bg-white sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-white/90">
      {/* Desktop Top bar - hidden on mobile */}
      <div className="hidden md:block bg-forest-900 text-white py-2 px-4">
        <div className="container mx-auto flex justify-between items-center text-xs md:text-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Phone size={14} className="mr-1" />
              <span>+91 9886033342</span>
            </div>
            <div className="flex items-center">
              <Mail size={14} className="mr-1" />
              <span>newindiatimbers8@gmail.com</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/bulk-orders" className="hover:text-timber-200">
              Bulk Orders
            </Link>
            <Link to="/contact" className="hover:text-timber-200">
              Contact Us
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="md:hidden px-4 py-3 flex items-center justify-between">
        {/* Left: Back button (only on non-home pages) */}
        {!isHomePage && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => window.history.back()}
            className="p-2"
            aria-label="Go back"
          >
            <ArrowLeft size={20} />
          </Button>
        )}
        {isHomePage && <div className="w-10" />} {/* Spacer for home page */}
        
        {/* Center: Logo (home page) or Page Title (other pages) */}
        <div className="flex-1 flex justify-center">
          {isHomePage ? (
            <Link to="/" className="logo-container">
              <Logo size="sm" variant="text" />
            </Link>
          ) : (
            <h1 className="text-lg font-semibold text-center truncate px-2">
              {getPageTitle()}
            </h1>
          )}
        </div>
        
        {/* Right: Menu */}
        <div className="flex items-center space-x-1">
          <MobileNavigation menu={activeMenu} />
        </div>
      </div>
      
      {/* Desktop Header */}
      <div className="hidden md:block">
        <div className="container mx-auto py-6 px-4 flex flex-col gap-4">
          {/* Logo and Actions */}
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center logo-container">
              <Logo size="2xl" variant="text" className="mr-3" />
            </Link>

            <div className="flex items-center gap-3">
              <Button asChild variant="outline" className="rounded-full border-timber-200 text-sm hover:bg-timber-50 hover:border-timber-300 transition-colors">
                <a href="tel:+919886033342" className="inline-flex items-center">
                  Quick Enquiry
                </a>
              </Button>
            </div>
          </div>

          {/* Desktop Navigation */}
          <MegaMenu menu={activeMenu} />
        </div>
      </div>
    </header>
  );
};

export default Header;