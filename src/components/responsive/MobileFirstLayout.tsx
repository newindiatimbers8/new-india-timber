/**
 * MobileFirstLayout Component
 * Mobile-first responsive layout with progressive enhancement
 */

import React, { useState, useEffect } from 'react';
import { Menu, X, Search, User, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

interface MobileFirstLayoutProps {
  children: React.ReactNode;
  className?: string;
}

const MobileFirstLayout: React.FC<MobileFirstLayoutProps> = ({
  children,
  className
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigationItems = [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' }
  ];

  return (
    <div className={cn('min-h-screen bg-background', className)}>
      {/* Mobile-First Header */}
      <header className={cn(
        'sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
        isScrolled && 'shadow-sm'
      )}>
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo - Always visible */}
            <div className="flex items-center">
              <a href="/" className="flex items-center space-x-2">
                <div className="h-8 w-8 bg-primary rounded-md flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">NIT</span>
                </div>
                <span className="hidden sm:block font-bold text-lg">New India Timbers</span>
              </a>
            </div>

            {/* Desktop Navigation - Hidden on mobile */}
            <nav className="hidden md:flex items-center space-x-6">
              {navigationItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-sm font-medium transition-colors hover:text-primary"
                >
                  {item.label}
                </a>
              ))}
            </nav>

            {/* Search Bar - Responsive */}
            <div className="hidden sm:flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search products..."
                  className="w-64 pl-10 pr-4"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              {/* Mobile Search Button */}
              <Button variant="ghost" size="sm" className="sm:hidden">
                <Search className="w-4 h-4" />
              </Button>

              {/* User Account */}
              <Button variant="ghost" size="sm">
                <User className="w-4 h-4" />
                <span className="hidden sm:ml-2 sm:block">Account</span>
              </Button>

              {/* Shopping Cart */}
              <Button variant="ghost" size="sm">
                <ShoppingCart className="w-4 h-4" />
                <span className="hidden sm:ml-2 sm:block">Cart</span>
              </Button>

              {/* Mobile Menu Button */}
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="md:hidden">
                    <Menu className="w-4 h-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80">
                  <div className="flex flex-col space-y-4 mt-8">
                    {/* Mobile Search */}
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        type="text"
                        placeholder="Search products..."
                        className="pl-10 pr-4"
                      />
                    </div>

                    {/* Mobile Navigation */}
                    <nav className="flex flex-col space-y-2">
                      {navigationItems.map((item) => (
                        <a
                          key={item.href}
                          href={item.href}
                          className="text-lg font-medium py-2 transition-colors hover:text-primary"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {item.label}
                        </a>
                      ))}
                    </nav>

                    {/* Mobile Actions */}
                    <div className="flex flex-col space-y-2 pt-4 border-t">
                      <Button variant="outline" className="justify-start">
                        <User className="w-4 h-4 mr-2" />
                        My Account
                      </Button>
                      <Button variant="outline" className="justify-start">
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Shopping Cart
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Mobile-First Footer */}
      <footer className="border-t bg-muted/50">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 bg-primary rounded-md flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">NIT</span>
                </div>
                <span className="font-bold text-lg">New India Timbers</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Premium timber suppliers in Bangalore with 25+ years of experience.
              </p>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h4 className="font-semibold">Quick Links</h4>
              <nav className="flex flex-col space-y-2">
                {navigationItems.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
            </div>

            {/* Products */}
            <div className="space-y-4">
              <h4 className="font-semibold">Products</h4>
              <nav className="flex flex-col space-y-2">
                <a href="/products/red-sal-wood" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Red Sal Wood
                </a>
                <a href="/products/australia-honne-wood" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Australia Honne Wood
                </a>
                <a href="/products/mahogany-wood" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Mahogany Wood
                </a>
                <a href="/products/benin-teak-logs" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Benin Teak Logs
                </a>
              </nav>
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <h4 className="font-semibold">Contact</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>Bangalore, Karnataka</p>
                <p>+91-9886033342</p>
                <p>info@newindiatimbers.com</p>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-8 pt-8 border-t flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <p className="text-sm text-muted-foreground">
              © 2024 New India Timbers. All rights reserved.
            </p>
            <div className="flex space-x-4">
              <a href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Privacy Policy
              </a>
              <a href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MobileFirstLayout;

