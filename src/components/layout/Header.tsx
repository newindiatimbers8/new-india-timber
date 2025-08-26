
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  User,
  ShoppingCart,
  Menu,
  Search,
  X,
  Phone,
  Mail,
  Bell,
  ArrowLeft,
  Home,
  Calculator
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { useLocation } from "react-router-dom";

const Header = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();
  
  // Get page title based on current route
  const getPageTitle = () => {
    if (location.pathname === "/") return "New India Timber";
    if (location.pathname.includes("/products")) return "Products";
    if (location.pathname.includes("/bulk-orders")) return "Bulk Orders";
    if (location.pathname.includes("/estimator")) return "Price Estimator";
    if (location.pathname.includes("/about")) return "About Us";
    if (location.pathname.includes("/contact")) return "Contact";
    if (location.pathname.includes("/login")) return "Account";
    if (location.pathname.includes("/dashboard")) return "Dashboard";
    return "New India Timber";
  };
  
  const isHomePage = location.pathname === "/";

  return (
    <header className="w-full border-b bg-white sticky top-0 z-40">
      {/* Desktop Top bar - hidden on mobile */}
      <div className="hidden md:block bg-forest-900 text-white py-2 px-4">
        <div className="container mx-auto flex justify-between items-center text-xs md:text-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Phone size={14} className="mr-1" />
              <span>+91 8095701235</span>
            </div>
            <div className="flex items-center">
              <Mail size={14} className="mr-1" />
              <span>contact@southindiantimbers.com</span>
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
        {/* Left: Back button or Logo */}
        {!isHomePage ? (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => window.history.back()}
            className="p-2"
          >
            <ArrowLeft size={20} />
          </Button>
        ) : (
          <div className="w-10" /> // Spacer
        )}
        
        {/* Center: Page Title */}
        <h1 className="text-lg font-semibold text-center flex-1 truncate px-2">
          {getPageTitle()}
        </h1>
        
        {/* Right: Search and Menu */}
        <div className="flex items-center space-x-1">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="p-2"
          >
            {isSearchOpen ? <X size={20} /> : <Search size={20} />}
          </Button>
          
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="p-2">
                <Menu size={20} />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <div className="flex flex-col h-full">
                <div className="flex items-center mb-6">
                  <h2 className="text-xl font-bold">Menu</h2>
                </div>
                
                <nav className="flex flex-col space-y-1 flex-1">
                  <Link to="/" className="px-3 py-3 hover:bg-accent rounded-lg flex items-center">
                    <Home className="mr-3" size={20} />
                    Home
                  </Link>
                  
                  <div className="py-2">
                    <h3 className="px-3 text-sm font-semibold text-gray-500 uppercase tracking-wider">Products</h3>
                    <Link to="/products/teak" className="px-3 py-2 hover:bg-accent rounded-lg ml-4 flex items-center text-sm">
                      Teak Wood
                    </Link>
                    <Link to="/products/plywood" className="px-3 py-2 hover:bg-accent rounded-lg ml-4 flex items-center text-sm">
                      Plywood
                    </Link>
                    <Link to="/products/hardwood" className="px-3 py-2 hover:bg-accent rounded-lg ml-4 flex items-center text-sm">
                      Hardwood Logs
                    </Link>
                  </div>
                  
                  <Link to="/estimator" className="px-3 py-3 hover:bg-accent rounded-lg flex items-center">
                    <Calculator className="mr-3" size={20} />
                    Price Estimator
                  </Link>
                  
                  <Link to="/bulk-orders" className="px-3 py-3 hover:bg-accent rounded-lg flex items-center">
                    <ShoppingCart className="mr-3" size={20} />
                    Bulk Orders
                  </Link>
                  
                  <Link to="/about" className="px-3 py-3 hover:bg-accent rounded-lg flex items-center">
                    About Us
                  </Link>
                  
                  <Link to="/contact" className="px-3 py-3 hover:bg-accent rounded-lg flex items-center">
                    <Phone className="mr-3" size={20} />
                    Contact
                  </Link>
                </nav>
                
                <div className="border-t pt-4 mt-4">
                  <Link to="/login" className="px-3 py-3 hover:bg-accent rounded-lg flex items-center">
                    <User className="mr-3" size={20} />
                    Login / Register
                  </Link>
                  <div className="px-3 py-2 text-xs text-gray-500">
                    <div className="flex items-center mb-1">
                      <Phone size={12} className="mr-1" />
                      +91 8095701235
                    </div>
                    <div className="flex items-center">
                      <Mail size={12} className="mr-1" />
                      contact@newindiatimber.com
                    </div>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      
      {/* Desktop Header */}
      <div className="hidden md:block">
        <div className="container mx-auto py-4 px-4 flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <h1 className="text-2xl md:text-3xl font-bold font-montserrat">
              <span className="wood-grain-text">New India</span> Timber
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:block">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link to="/">
                    <NavigationMenuLink className="px-3 py-2 hover:text-timber-600 transition-colors">
                      Home
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Products</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="w-[600px] p-4 grid grid-cols-2 gap-4">
                      <div>
                        <h3 className="font-bold mb-2 text-forest-700">Teak Wood</h3>
                        <ul className="space-y-1">
                          <li><Link to="/products/teak/burma" className="hover:text-timber-600">Burma Teak</Link></li>
                          <li><Link to="/products/teak/ghana" className="hover:text-timber-600">Ghana Teak</Link></li>
                          <li><Link to="/products/teak/brazilian" className="hover:text-timber-600">Brazilian Teak</Link></li>
                          <li><Link to="/products/teak/indian-sal" className="hover:text-timber-600">Indian Sal</Link></li>
                        </ul>
                      </div>
                      <div>
                        <h3 className="font-bold mb-2 text-forest-700">Plywood</h3>
                        <ul className="space-y-1">
                          <li><Link to="/products/plywood/sainik-mr" className="hover:text-timber-600">Century Ply Sainik MR</Link></li>
                          <li><Link to="/products/plywood/marine" className="hover:text-timber-600">Marine Plywood</Link></li>
                          <li><Link to="/products/plywood/laminated" className="hover:text-timber-600">Laminated Plywood</Link></li>
                          <li><Link to="/products/plywood/waterproof" className="hover:text-timber-600">Waterproof Plywood</Link></li>
                        </ul>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <Link to="/bulk-orders">
                    <NavigationMenuLink className="px-3 py-2 hover:text-timber-600 transition-colors">
                      Bulk Orders
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <Link to="/about">
                    <NavigationMenuLink className="px-3 py-2 hover:text-timber-600 transition-colors">
                      About Us
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <Link to="/contact">
                    <NavigationMenuLink className="px-3 py-2 hover:text-timber-600 transition-colors">
                      Contact
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Desktop Right Side */}
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(!isSearchOpen)}>
              {isSearchOpen ? <X size={20} /> : <Search size={20} />}
            </Button>
            
            <Link to="/cart">
              <Button variant="ghost" size="icon">
                <ShoppingCart size={20} />
              </Button>
            </Link>
            
            <Link to="/login">
              <Button variant="ghost" size="icon">
                <User size={20} />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className={`bg-timber-50 py-3 px-4 transition-all duration-300 ${isSearchOpen ? 'block' : 'hidden'}`}>
        <div className="container mx-auto">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search products..." 
              className="w-full p-3 pl-10 pr-4 rounded-lg border border-timber-200 focus:outline-none focus:border-timber-500 text-base"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-timber-400" size={18} />
          </div>
          
          {/* Quick search suggestions for mobile */}
          <div className="md:hidden mt-3 flex flex-wrap gap-2">
            <button className="px-3 py-1 bg-white rounded-full text-xs border border-timber-200">
              Teak Door
            </button>
            <button className="px-3 py-1 bg-white rounded-full text-xs border border-timber-200">
              Plywood 18mm
            </button>
            <button className="px-3 py-1 bg-white rounded-full text-xs border border-timber-200">
              Marine Board
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
