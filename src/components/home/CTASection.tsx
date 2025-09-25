
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Phone } from "lucide-react";

const CTASection = () => {
  return (
    <section className="relative py-16 md:py-24 overflow-hidden bg-white">
      {/* Animated Background with Multiple Gradients */}
      <div className="absolute inset-0 bg-white">
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-timber-50/30 to-transparent">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,69,19,0.05),transparent)] animate-pulse">
          </div>
        </div>
      </div>
      
      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-1/4 w-32 h-32 bg-timber-100/40 rounded-full blur-xl animate-float [animation-delay:0s]">
        </div>
        <div className="absolute top-60 right-1/4 w-28 h-28 bg-timber-50/40 rounded-full blur-lg animate-float [animation-delay:2s]">
        </div>
        <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-timber-100/40 rounded-full blur-2xl animate-float [animation-delay:4s]">
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 md:p-16 animate-fade-in [animation-delay:0.2s] border border-timber-200/20 shadow-lg">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 text-timber-900">
              Ready To Start Your Timber Project?
            </h2>
            <p className="text-lg md:text-xl mb-8 md:mb-12 leading-relaxed text-timber-700">
              Contact us today for a free consultation or browse our 
              <br className="hidden md:block" />
              extensive range of premium timber products.
            </p>
            
            {/* Enhanced Button Layout */}
            <div className="space-y-4 md:space-y-0 md:flex md:justify-center md:space-x-6 animate-fade-in [animation-delay:0.4s]">
              <Button asChild size="lg" className="w-full md:w-auto bg-timber-600 hover:bg-timber-700 text-white rounded-full py-4 md:py-6 shadow-2xl hover:shadow-timber-500/25 transition-all duration-300 transform hover:scale-105 group">
                <Link to="/login" className="text-lg md:text-xl px-8 md:px-12 inline-flex items-center justify-center">
                  Join Our Community
                  <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              
              <div className="flex space-x-4 md:space-x-6">
                <Button asChild size="lg" variant="outline" className="flex-1 md:flex-none bg-white border-2 border-timber-300 text-timber-700 hover:bg-timber-50 rounded-full py-4 md:py-6 transition-all duration-300 transform hover:scale-105">
                  <Link to="/products" className="text-base md:text-lg px-6 md:px-8 inline-flex items-center justify-center">
                    <span className="hidden sm:inline">Browse </span>Products
                  </Link>
                </Button>
                
                <Button asChild size="lg" variant="outline" className="flex-1 md:flex-none bg-timber-600 hover:bg-timber-700 text-white border-2 border-timber-600 hover:border-timber-700 rounded-full py-4 md:py-6 transition-all duration-300 transform hover:scale-105 group shadow-lg hover:shadow-xl">
                  <a href="tel:+919886033342" className="text-base md:text-lg px-6 md:px-8 flex items-center justify-center">
                    <Phone className="mr-2 md:mr-3 h-4 w-4 group-hover:animate-bounce" />
                    <span className="hidden sm:inline">Call </span>Now
                  </a>
                </Button>
              </div>
            </div>
            
            {/* Trust Indicators */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 md:mt-16 animate-fade-in [animation-delay:0.6s]">
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-timber-600 mb-2">18+</div>
                <div className="text-sm text-timber-700">Years Experience</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-timber-600 mb-2">5000+</div>
                <div className="text-sm text-timber-700">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-timber-600 mb-2">100%</div>
                <div className="text-sm text-timber-700">Quality Assured</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-timber-600 mb-2">24/7</div>
                <div className="text-sm text-timber-700">Support</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
