
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
                <Link to="/products?category=teak" className="text-gray-300 hover:text-timber-300">Teak Wood</Link>
              </li>
              <li>
                <Link to="/products?category=plywood" className="text-gray-300 hover:text-timber-300">Plywood</Link>
              </li>
              <li>
                <Link to="/products?category=hardwood" className="text-gray-300 hover:text-timber-300">Hardwood Logs</Link>
              </li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-montserrat font-bold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin size={18} className="mt-1 mr-2 flex-shrink-0" />
                <span>24/4 Sarjapura Main Road Doddakanna halli, beside Uber Verdant, Phase 1, apartments, Bengaluru, Karnataka 560035</span>
              </li>
              <li className="flex items-center">
                <Phone size={18} className="mr-2 flex-shrink-0" />
                <span>+91 9886033342</span>
              </li>
              <li className="flex items-center">
                <Mail size={18} className="mr-2 flex-shrink-0" />
                <span>newindiatimbers8@gmail.com</span>
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
        
        {/* Compliance Notice */}
        <div className="mb-6 p-4 bg-forest-800 rounded-lg border border-forest-700">
          <h4 className="text-sm font-semibold text-timber-200 mb-3 flex items-center">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            Privacy & Compliance Notice
          </h4>
          <div className="text-xs text-gray-300 leading-relaxed space-y-2">
            <p>
              <strong className="text-timber-200">WhatsApp Redirect:</strong> By clicking "Contact for price" or WhatsApp links, you will be redirected to WhatsApp (a third-party messaging platform owned by Meta). Your conversation data will be processed by WhatsApp according to their privacy policy.
            </p>
            <p>
              <strong className="text-timber-200">Data Collection:</strong> We collect and process your contact information to provide pricing quotes and customer service. Your data is stored securely and used only for business purposes.
            </p>
            <p>
              <strong className="text-timber-200">Your Rights:</strong> You can request data deletion, access, or modification at any time by contacting us at <a href="mailto:newindiatimbers8@gmail.com" className="text-timber-300 hover:text-timber-200 underline">newindiatimbers8@gmail.com</a> or calling <a href="tel:+919886033342" className="text-timber-300 hover:text-timber-200 underline">+91 9886033342</a>.
            </p>
            <p className="text-timber-200">
              For complete details, see our <Link to="/privacy-policy" className="text-timber-300 hover:text-timber-200 underline">Privacy Policy</Link> and <Link to="/terms" className="text-timber-300 hover:text-timber-200 underline">Terms of Service</Link>.
            </p>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} New India Timber. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0">
            <ul className="flex space-x-6 text-sm text-gray-400">
              <li><Link to="/privacy-policy" className="hover:text-timber-300">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-timber-300">Terms of Service</Link></li>
              <li><Link to="/shipping-policy" className="hover:text-timber-300">Shipping Policy</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
