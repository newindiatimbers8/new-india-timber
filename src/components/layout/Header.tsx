
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

const Header = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <header className="w-full border-b">
      {/* Top bar */}
      <div className="bg-forest-900 text-white py-2 px-4">
        <div className="container mx-auto flex justify-between items-center text-xs md:text-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Phone size={14} className="mr-1" />
              <span>+91 8095701235</span>
            </div>
            <div className="hidden md:flex items-center">
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

      {/* Main header */}
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

        {/* Right Side - Search, User, Cart */}
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

          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon">
                <Menu size={20} />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col space-y-4 mt-8">
                <Link to="/" className="px-2 py-1 hover:bg-accent rounded-md">Home</Link>
                <Link to="/products/teak" className="px-2 py-1 hover:bg-accent rounded-md">Teak Wood</Link>
                <Link to="/products/plywood" className="px-2 py-1 hover:bg-accent rounded-md">Plywood</Link>
                <Link to="/products/hardwood" className="px-2 py-1 hover:bg-accent rounded-md">Hardwood Logs</Link>
                <Link to="/bulk-orders" className="px-2 py-1 hover:bg-accent rounded-md">Bulk Orders</Link>
                <Link to="/about" className="px-2 py-1 hover:bg-accent rounded-md">About Us</Link>
                <Link to="/contact" className="px-2 py-1 hover:bg-accent rounded-md">Contact</Link>
                <hr />
                <Link to="/login" className="px-2 py-1 hover:bg-accent rounded-md">Login / Register</Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Search Bar */}
      <div className={`bg-timber-50 py-3 px-4 transition-all duration-300 ${isSearchOpen ? 'block' : 'hidden'}`}>
        <div className="container mx-auto">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search for products (e.g., Burma Teak, Century Ply 12mm)..." 
              className="w-full p-2 pl-10 pr-4 rounded-md border border-timber-200 focus:outline-none focus:border-timber-500"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-timber-400" size={18} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
