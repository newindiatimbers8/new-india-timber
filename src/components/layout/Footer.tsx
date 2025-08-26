
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Clock, Facebook, Twitter, Instagram } from "lucide-react";
import { cn } from "@/lib/utils";

interface FooterProps {
  className?: string;
}

const Footer = ({ className }: FooterProps) => {
  return (
    <footer className={cn("bg-forest-900 text-white pt-12 pb-6", className)}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-montserrat font-bold mb-4">New India Timber</h3>
            <p className="text-gray-300 mb-4">
              Quality Forever - Premium supplier of quality timber products in Bangalore, serving homeowners, 
              businesses, and contractors since 2005.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-timber-300">
                <Facebook size={20} />
              </a>
              <a href="#" className="hover:text-timber-300">
                <Twitter size={20} />
              </a>
              <a href="#" className="hover:text-timber-300">
                <Instagram size={20} />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-montserrat font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-timber-300">Home</Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-300 hover:text-timber-300">Products</Link>
              </li>
              <li>
                <Link to="/bulk-orders" className="text-gray-300 hover:text-timber-300">Bulk Orders</Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-timber-300">About Us</Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-timber-300">Contact Us</Link>
              </li>
            </ul>
          </div>
          
          {/* Products */}
          <div>
            <h3 className="text-xl font-montserrat font-bold mb-4">Products</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/products/teak" className="text-gray-300 hover:text-timber-300">Teak Wood</Link>
              </li>
              <li>
                <Link to="/products/plywood" className="text-gray-300 hover:text-timber-300">Plywood</Link>
              </li>
              <li>
                <Link to="/products/hardwood" className="text-gray-300 hover:text-timber-300">Hardwood Logs</Link>
              </li>
              <li>
                <Link to="/products/rental" className="text-gray-300 hover:text-timber-300">Rental Options</Link>
              </li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-montserrat font-bold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin size={18} className="mt-1 mr-2 flex-shrink-0" />
                <span>No. 134/20, 5th Main, HSR Layout Sector 7, Bangalore - 560068</span>
              </li>
              <li className="flex items-center">
                <Phone size={18} className="mr-2 flex-shrink-0" />
                <span>+91 8095701235</span>
              </li>
              <li className="flex items-center">
                <Mail size={18} className="mr-2 flex-shrink-0" />
                <span>contact@newindiatimber.com</span>
              </li>
              <li className="flex items-start">
                <Clock size={18} className="mt-1 mr-2 flex-shrink-0" />
                <span>
                  Monday - Saturday: 9:00 AM - 7:00 PM<br />
                  Sunday: 10:00 AM - 4:00 PM
                </span>
              </li>
            </ul>
          </div>
        </div>
        
        <hr className="border-forest-700 my-8" />
        
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} New India Timber. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0">
            <ul className="flex space-x-6 text-sm text-gray-400">
              <li><Link to="/privacy-policy" className="hover:text-timber-300">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-timber-300">Terms of Service</Link></li>
              <li><Link to="/shipping" className="hover:text-timber-300">Shipping Policy</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
